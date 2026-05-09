"use server";

import { OrderStatus, Role } from "@/generated/prisma/enums";
import { prisma } from "./prisma";
import { AuthError } from "next-auth";
import { auth, signIn } from "./auth/auth";
import {
  CustomerSchema,
  EditCustomerSchema,
  EditOrderSchema,
  OrderSchema,
  ProductSchema,
  UserSchema
} from "./dto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ResponseType = {
  status: string;
  message: string;
  description?: string;
};

// important handlers \\
export async function requireAdmin() {
  const session = await auth();

  if (session?.user?.role !== "editor") {
    throw new Error("forbidden");
  }

  return session.user;
}

const updateUserLastSeenAt = async () => {
  const session = await auth();

  if (session?.user) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { last_seen_at: new Date() }
    });
  }
};

export const authenticate = async (state: ResponseType, formData: FormData) => {
  try {
    await signIn("credentials", { login: formData.get("login") });
    return { status: "success", message: "Вы успешно вошли в аккаунт" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { status: "error", message: "Введен неверный логин" };
        default:
          return { status: "error", message: "Ошибка! Администратор заблокировал этот аккаунт" };
      }
    }
    throw error;
  }
};

export const changeUserRole = async (id: string, role: Role) => {
  requireAdmin();

  await prisma.user.update({
    where: { id },
    data: { role }
  });

  updateUserLastSeenAt();
};

export const toggleUserIsBlocked = async (id: string, state: boolean) => {
  requireAdmin();

  await prisma.user.update({
    where: { id },
    data: { is_blocked: state }
  });

  updateUserLastSeenAt();
};

export const createUser = async (state: ResponseType, formData: FormData) => {
  requireAdmin();

  const parsedUser = UserSchema.safeParse({
    login: formData.get("login"),
    name: formData.get("name"),
    role: formData.get("role")
  });

  if (!parsedUser.success)
    return { status: "error", message: "Ошибка в создании пользователя, попробуйте позже" };

  const user = parsedUser.data;

  const existedUser = await prisma.user.findFirst({
    where: {
      login: user.login
    }
  });

  if (existedUser) return { status: "error", message: "Пользователь с таким логином уже существует" };

  await prisma.user.create({
    data: parsedUser.data
  });

  updateUserLastSeenAt();
  revalidatePath("/users", "page");
  return { status: "success", message: "Пользователь успешно создан" };
};

export const createOrder = async (state: ResponseType, formData: FormData) => {
  requireAdmin();

  const parsedOrder = OrderSchema.safeParse({
    customer_id: formData.get("customer_id"),
    product_title: formData.get("product_title"),
    note: formData.get("note")
  });

  if (!parsedOrder.success) return { status: "error", message: "Ошибка в создании заказа, попробуйте позже" };

  const { price: orderPrice } = await prisma.product.update({
    where: { title: parsedOrder.data.product_title },
    data: { quantity: { decrement: 1 } },
    select: { price: true }
  });

  const [order] = await prisma.$transaction([
    prisma.order.create({
      data: parsedOrder.data,
      select: { id: true }
    }),
    prisma.customer.update({
      where: { id: parsedOrder.data.customer_id },
      data: {
        orders_quantity: { increment: 1 },
        total_revenue: { increment: orderPrice }
      }
    })
  ]);

  updateUserLastSeenAt();
  revalidatePath("/orders", "page");
  return {
    status: "success",
    message: "Заказ успешно создан",
    description: `ID заказа: ${order.id}`
  };
};

export const changeOrderStatus = async (orderIds: string[], payload: OrderStatus) => {
  requireAdmin();

  await prisma.order.updateMany({ where: { id: { in: orderIds } }, data: { status: payload } });

  updateUserLastSeenAt();
  revalidatePath("/orders");
};

export type fullOrder = {
  customer: {
    name: string;
  };
  product: {
    price: number;
  };
} & {
  id: string;
  created_at: Date;
  note: string | null;
  updated_at: Date;
  status: OrderStatus;
  customer_id: string;
  product_title: string;
};

export const deleteOrder = async (orders: fullOrder[]) => {
  requireAdmin();

  const orderIds: string[] = [];
  const productTitles: string[] = [];

  orders.forEach(order => {
    orderIds.push(order.id);
    productTitles.push(order.product_title);
  });

  const customerData = orders.reduce(
    (acc, ord) => {
      if (!acc[ord.customer_id]) acc[ord.customer_id] = { quantity: 0, revenue: 0 };

      acc[ord.customer_id].quantity += 1;
      acc[ord.customer_id].revenue += ord.product.price;

      return acc;
    },
    {} as Record<string, { quantity: number; revenue: number }>
  );
  const customerOperations = [];

  for (const [customerId, data] of Object.entries(customerData)) {
    customerOperations.push(
      prisma.customer.updateMany({
        where: { id: customerId },
        data: {
          orders_quantity: { decrement: data.quantity },
          total_revenue: { decrement: data.revenue }
        }
      })
    );
  }

  await prisma.$transaction([
    prisma.order.deleteMany({ where: { id: { in: orderIds } } }),
    prisma.product.updateMany({
      where: { title: { in: productTitles } },
      data: { quantity: { increment: 1 } }
    }),
    ...customerOperations
  ]);

  updateUserLastSeenAt();
  revalidatePath("/orders");
};

export const editOrder = async (formData: FormData) => {
  requireAdmin();

  const parsedOrder = EditOrderSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status") as OrderStatus,
    note: formData.get("note")
  });

  if (parsedOrder.data) {
    const { id, ...data } = parsedOrder.data;

    await prisma.order.update({
      where: { id },
      data
    });
  }

  updateUserLastSeenAt();
  revalidatePath("/orders", "page");
  redirect("/orders");
};

export const createCustomer = async (state: ResponseType, formData: FormData) => {
  requireAdmin();

  const parsedCustomer = CustomerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    telegram_username: formData.get("telegram_username"),
    phone_number: formData.get("phone_number"),
    note: formData.get("note")
  });

  if (!parsedCustomer.success)
    return {
      status: "error",
      message: parsedCustomer.error.issues[0].message || "Ошибка, проверьте правильность заполнения формы"
    };

  const { name: customerName } = await prisma.customer.create({
    data: parsedCustomer.data,
    select: { name: true }
  });

  updateUserLastSeenAt();
  revalidatePath("/customers");
  return {
    status: "success",
    message: "Клиент успешно зарегистрирован",
    description: `Имя клиента: ${customerName}`
  };
};

export const editCustomer = async (state: ResponseType, formData: FormData) => {
  requireAdmin();

  const parsedCustomer = EditCustomerSchema.safeParse({
    id: formData.get("id"),
    email: formData.get("email"),
    telegram_username: formData.get("telegram_username"),
    phone_number: formData.get("phone_number"),
    note: formData.get("note")
  });

  if (parsedCustomer.data) {
    const { id, ...data } = parsedCustomer.data;

    await prisma.customer.update({
      where: { id },
      data
    });
  } else {
    const err = parsedCustomer.error.issues[0];
    return { message: err.message, status: "error" };
  }

  updateUserLastSeenAt();
  revalidatePath("/customers");
  redirect("/customers");
};

export const deleteCustomer = async (id: string) => {
  requireAdmin();

  const { name } = await prisma.customer.delete({ where: { id: id }, select: { name: true } });
  revalidatePath("/customers");
  return name;
};

export const createProduct = async (state: ResponseType, formData: FormData) => {
  requireAdmin();

  const parsedProduct = ProductSchema.safeParse({
    title: formData.get("title"),
    quantity: Number(formData.get("quantity")),
    countless: formData.has("countless"),
    price: Number(formData.get("price"))
  });

  if (!parsedProduct.success) {
    const err = parsedProduct.error.issues[0];
    return { status: "error", message: err.message || "Ошибка, проверьте правильность заполнения формы" };
  }

  const { countless, ...productData } = parsedProduct.data;
  const { title: productTitle } = await prisma.product.create({
    data: { ...productData, ...(countless && { quantity: null }) },
    select: { title: true }
  });

  updateUserLastSeenAt();
  revalidatePath("/customers");
  return {
    status: "success",
    message: "Товар успешно добавлен",
    description: `Название товара: ${productTitle}`
  };
};

export const editProduct = async (formData: FormData) => {
  requireAdmin();

  const parsedProduct = ProductSchema.safeParse({
    title: formData.get("title"),
    quantity: Number(formData.get("quantity")),
    countless: formData.has("countless"),
    price: Number(formData.get("price"))
  });

  if (!parsedProduct.data) throw new Error("Что то пошло не так");

  const { countless, ...productData } = parsedProduct.data;
  await prisma.product.update({
    where: { title: productData.title },
    data: { ...productData, ...(countless && { quantity: null }) }
  });

  updateUserLastSeenAt();
  revalidatePath("/content");
  redirect("/content");
};

export const deleteProduct = async (id: string) => {
  requireAdmin();

  const { title } = await prisma.product.delete({ where: { id: id }, select: { title: true } });
  revalidatePath("/content");
  return title;
};
