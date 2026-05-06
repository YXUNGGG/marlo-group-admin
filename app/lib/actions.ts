"use server";

import { OrderStatus, Role } from "@/generated/prisma/enums";
import { prisma } from "./prisma";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "./auth/auth";
import { EditCustomerSchema, EditOrderSchema, OrderSchema, UserSchema } from "./dto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Order } from "@/generated/prisma/client";

export type ResponseType = {
  status: string;
  message: string;
  description?: string;
};

// important handler \\
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
    await signIn("credentials", { login: formData.get("login"), redirect: false });
    return { status: "success", message: "Вы успешно вошли в аккаунт" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { status: "error", message: "Введен неверный логин" };
        default:
          return { status: "error", message: "Что-то пошло не так." };
      }
    }
    throw error;
  }
};

export const logOut = async (state: ResponseType) => {
  try {
    await signOut({ redirect: false });

    updateUserLastSeenAt();
    return { status: "success", message: "Выход произведен успешно" };
  } catch {
    return { status: "error", message: "Произошла ошибка!" };
  }
};

export const changeUserRole = async (id: string, role: Role) => {
  await prisma.user.update({
    where: { id },
    data: { role }
  });

  updateUserLastSeenAt();
};

export const createUser = async (state: ResponseType, formData: FormData) => {
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
  const parsedOrder = OrderSchema.safeParse({
    customer_id: formData.get("customer_id"),
    product_title: formData.get("product_title"),
    note: formData.get("note")
  });

  if (!parsedOrder.success) return { status: "error", message: "Ошибка в создании заказа, попробуйте позже" };

  const [orderId] = await prisma.$transaction([
    prisma.order.create({
      data: parsedOrder.data,
      select: { id: true }
    }),
    prisma.product.update({
      where: { title: parsedOrder.data.product_title },
      data: { quantity: { decrement: 1 } }
    }),
    prisma.customer.update({
      where: { id: parsedOrder.data.customer_id },
      data: { orders_quantity: { increment: 1 } }
    })
  ]);

  updateUserLastSeenAt();
  revalidatePath("/orders", "page");
  return {
    status: "success",
    message: "Заказ успешно создан",
    description: `ID заказа: ${orderId.id}`
  };
};

export const changeOrderStatus = async (orderIds: string[], payload: OrderStatus) => {
  await prisma.order.updateMany({ where: { id: { in: orderIds } }, data: { status: payload } });

  updateUserLastSeenAt();
  revalidatePath("/orders");
};

export const deleteOrder = async (orders: Order[]) => {
  let orderIds: string[] = [];
  let customerIds: string[] = [];
  let productTitles: string[] = [];

  orders.forEach(order => {
    orderIds.push(order.id);
    customerIds.push(order.customer_id);
    productTitles.push(order.product_title);
  });

  await prisma.$transaction([
    prisma.order.deleteMany({ where: { id: { in: orderIds } } }),
    prisma.product.updateMany({
      where: { title: { in: productTitles } },
      data: { quantity: { increment: 1 } }
    }),
    prisma.customer.updateMany({
      where: { id: { in: customerIds } },
      data: { orders_quantity: { decrement: 1 } }
    })
  ]);

  updateUserLastSeenAt();
  revalidatePath("/orders");
};

export const editOrder = async (formData: FormData) => {
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

export const editCustomer = async (state: ResponseType, formData: FormData) => {
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
