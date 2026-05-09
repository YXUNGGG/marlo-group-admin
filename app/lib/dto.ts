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

export const CustomerSchema = z.object({
  name: z.string().min(6, { message: "Наименование слишком коротко" }),
  email: z.string().or(z.literal("")),
  telegram_username: z
    .string()
    .startsWith("@", { message: "Некорректный формат Telegram username" })
    .min(4, { message: "Некорректный формат Telegram username" })
    .or(z.literal("")),
  phone_number: z
    .string()
    .min(10, { message: "Некорректный формат номера телефона" })
    .nullish()
    .or(z.literal("")),
  note: z.string().or(z.literal(""))
});

export const EditCustomerSchema = z.object({
  id: z.string(),
  email: z.email({ message: "Некорректный адрес электронной почты" }).or(z.literal("")),
  telegram_username: z
    .string()
    .startsWith("@", { message: "Некорректный формат Telegram username" })
    .min(4, { message: "Некорректный формат Telegram username" })
    .or(z.literal("")),
  phone_number: z
    .string()
    .min(10, { message: "Некорректный формат номера телефона" })
    .nullish()
    .or(z.literal("")),
  note: z.string().or(z.literal(""))
});

export const ProductSchema = z.object({
  title: z.string().min(5, { message: "Наименование слишком короткое" }),
  quantity: z.number().nonnegative({ message: "Неверный формат количества" }),
  countless: z.boolean(),
  price: z.number().nonnegative({ message: "Неверный формат цены товара" })
});
