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
