"use client";

import { Field, FieldGroup } from "@/app/components/ui/field";
import { Input } from "@/app/components/ui/input";
import Link from "next/link";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { deleteCustomer, editCustomer } from "@/app/lib/actions";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/app/components/ui/input-group";
import { CardContent, CardFooter } from "../card";
import { Customer } from "@/generated/prisma/client";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { DeleteModal } from "../.custom/delete-modal";

type EditCustomerFormProps = {
  customer: Customer;
};

export function EditCustomerForm({ customer }: EditCustomerFormProps) {
  const [state, formAction] = useActionState(editCustomer, { message: "", status: "" });

  useEffect(() => {
    if (state.message) toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction}>
      <CardContent>
        <FieldGroup>
          <input readOnly name="id" value={customer.id} className="hidden" />

          <Field>
            <Label htmlFor="email">Эл. почта</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                name="email"
                placeholder="example@mail.ru"
                defaultValue={customer.email ?? ""}
              />
              <Link href="https://mail.ru/">
                <Button type="button">Связаться</Button>
              </Link>
            </div>
          </Field>

          <Field>
            <Label htmlFor="telegram">Телеграм</Label>
            <div className="flex gap-2">
              <Input
                id="telegram"
                name="telegram_username"
                placeholder="@username"
                defaultValue={customer.telegram_username ?? ""}
              />
              <Link href="https://t.me">
                <Button type="button">Связаться</Button>
              </Link>
            </div>
          </Field>

          <Field>
            <Label htmlFor="phone_number">Номер телефона</Label>
            <div className="flex gap-2">
              <InputGroup>
                <InputGroupAddon>+7</InputGroupAddon>
                <InputGroupInput
                  maxLength={10}
                  id="phone_number"
                  name="phone_number"
                  placeholder="000 000 00 00"
                  defaultValue={customer.phone_number ?? ""}
                />
              </InputGroup>
              <Button type="button">Связаться</Button>
            </div>
          </Field>

          <Field>
            <Label htmlFor="note">Комментарий к заказу</Label>
            <Textarea
              id="note"
              name="note"
              className="min-h-27"
              defaultValue={customer.note ?? ""}
              placeholder="Информация о клиенте..."
            />
          </Field>
        </FieldGroup>
      </CardContent>

      <CardFooter className="flex justify-between pt-6">
        <DeleteModal id={customer.id} deleteAction={deleteCustomer} itemTitle="клиента" />

        <div className="flex gap-2">
          <Link href="/customers">
            <Button variant="outline">Назад</Button>
          </Link>
          <Button type="submit" className="w-34">
            Сохранить
          </Button>
        </div>
      </CardFooter>
    </form>
  );
}
