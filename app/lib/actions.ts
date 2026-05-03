"use server";

import { OrderStatus, Role } from "@/generated/prisma/enums";
import { prisma } from "./prisma";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "./auth/auth";
import { OrderSchema, UserSchema } from "./dto";
import { revalidatePath } from "next/cache";

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

  const orderId = await prisma.order.create({
    data: parsedOrder.data,
    select: { id: true }
  });

  updateUserLastSeenAt();
  revalidatePath("/orders", "page");
  return {
    status: "success",
    message: "Заказ успешно создан",
    description: `ID заказа: ${orderId.id}`
  };
};

export const changeOrderStatus = async (id: string, payload: OrderStatus) => {
  await prisma.order.update({ where: { id }, data: { status: payload } });
};
