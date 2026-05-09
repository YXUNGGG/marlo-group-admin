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
import { createProduct } from "@/app/lib/actions";
import { Spinner } from "../spinner";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "../input-group";
import { Input } from "../input";
import { useCreateModalState } from "@/app/hooks/use-create-modal-state";
import { QuantityField } from "./quantity-field";

export function CreateProductModal() {
  const { formAction, isPending } = useCreateModalState(createProduct);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Добавить товар</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form action={formAction} className="contents">
          <DialogHeader>
            <DialogTitle>Новый товар</DialogTitle>
            <DialogDescription className="w-9/10">
              Обратите внимание: наименование товара в дальнейшем изменить будет нельзя
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="title">Наименование</Label>
              <Input id="title" name="title" placeholder="Назовите товар..." required />
            </Field>

            <QuantityField />

            <Field>
              <Label htmlFor="price">Стоимость</Label>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>₽</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput required id="price" name="price" placeholder="0" />
              </InputGroup>
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
