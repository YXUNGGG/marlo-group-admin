"use client";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/app/components/ui/dialog";
import { Field, FieldGroup } from "@/app/components/ui/field";
import { Label } from "@/app/components/ui/label";
import { createCustomer } from "@/app/lib/actions";
import { Spinner } from "../spinner";
import { Textarea } from "../textarea";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "../input-group";
import { Input } from "../input";
import { useCreateModalState } from "@/app/hooks/use-create-modal-state";

export function CreateCustomerModal() {
  const { formAction, isPending } = useCreateModalState(createCustomer);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Зарегистрировать клиента</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form action={formAction} className="contents">
          <DialogHeader>
            <DialogTitle>Зарегистрировать клиента</DialogTitle>
            <DialogDescription>
              Обратите внимание, Наименование клиента в дальнейшем изменить будет нельзя
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name" className="gap-1">
                Наименование <span className="text-primary">*</span>
              </Label>
              <Input name="name" placeholder="Назовите клиента..." required />
            </Field>

            <Field>
              <Label htmlFor="email">Эл. почта</Label>
              <Input id="email" name="email" placeholder="example@mail.ru" />
            </Field>

            <Field>
              <Label htmlFor="telegram_username">Телеграм</Label>
              <Input id="telegram_username" name="telegram_username" placeholder="@username" />
            </Field>

            <Field>
              <Label htmlFor="phone_number">Номер телефона</Label>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>+7</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput id="phone_number" name="phone_number" placeholder="(000)000-00-00" />
              </InputGroup>
            </Field>

            <Field>
              <Label htmlFor="note">Заметки</Label>
              <Textarea id="note" name="note" className="min-h-17" placeholder="Информация о клиенте..." />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Отмена</Button>
            </DialogClose>

            {isPending ? (
              <Button disabled>
                <Spinner /> Идет регистрация
              </Button>
            ) : (
              <Button type="submit">Зарегистрировать</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
