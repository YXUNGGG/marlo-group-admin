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
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { createUser } from "@/app/lib/actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "../select";
import { useActionState, useEffect } from "react";
import { Spinner } from "../spinner";
import { toast } from "sonner";

export function CreateUserModal() {
  const [state, formAction, isPending] = useActionState(createUser, { message: "", status: "" });

  useEffect(() => {
    if (!state.message) return;
    state.status === "error" ? toast.error(state.message) : toast.success(state.message);
  }, [state]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Добавить пользователя</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form action={formAction} className="contents">
          <DialogHeader>
            <DialogTitle>Добавить пользователя</DialogTitle>
            <DialogDescription>
              Обратите внимание: логин и имя невозможно изменить в дальнейшем
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="login">Логин</Label>
              <Input id="login" name="login" required placeholder="marlo-admin" />
            </Field>
            <div className="w-full grid grid-cols-[1.5fr_1fr] gap-4">
              <Field>
                <Label htmlFor="name">Имя сотрудника</Label>
                <Input id="name" name="name" required placeholder="Иван Иванов" />
              </Field>

              <Field>
                <Label htmlFor="role">Роль</Label>
                <Select name="role" defaultValue="editor">
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Выберите роль</SelectLabel>
                      <SelectItem value="editor">Админ</SelectItem>
                      <SelectItem value="viewer">Зритель</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Отмена</Button>
            </DialogClose>

            {isPending ? (
              <Button disabled className="w-full">
                <Spinner /> Создание
              </Button>
            ) : (
              <Button type="submit">Создать пользователя</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
