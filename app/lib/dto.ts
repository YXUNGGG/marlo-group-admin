import z from "zod";

export const UserSchema = z.object({
  login: z.string({ message: "Логин должен содержать минимум 6 символов" }).min(6),
  name: z.string({ message: "Имя должно содержать минимум 6 символов" }).min(6),
  role: z.enum(["editor", "viewer"])
});

export const OrderSchema = z.object({
  customer_id: z.string({ message: "Выберите клиента" }),
  product_title: z.string().nonempty({ message: "Выберите соответствующий товар" }),
  note: z.string()
});

export const EditOrderSchema = z.object({
  id: z.string(),
  status: z.enum(["Создан", "В_работе", "Выполнен", "Проблема"]),
  note: z.string()
});

export const EditCustomerSchema = z.object({
  id: z.string(),
  email: z.email({ message: "Некорректный адрес электронной почты" }),
  telegram_username: z.string().startsWith("@", { message: "Некорректный формат Telegram username" }) || null,
  phone_number: z.string().min(10, { message: "Некорректный формат номера телефона" }) || null,
  note: z.string() || null
});
