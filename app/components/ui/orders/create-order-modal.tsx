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
import { createOrder } from "@/app/lib/actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "../select";
import { use, useEffect, useMemo, useState } from "react";
import { Spinner } from "../spinner";
import { Textarea } from "../textarea";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "../input-group";
import { LockKeyholeIcon } from "lucide-react";
import { useCreateModalState } from "@/app/hooks/use-create-modal-state";
import { useSession } from "next-auth/react";

type CreateOrderModalType = {
  createOrderData: Promise<{
    customers: {
      id: string;
      name: string;
    }[];
    products: {
      id: string;
      title: string;
      price: number;
    }[];
  }>;
};

export function CreateOrderModal({ createOrderData }: CreateOrderModalType) {
  const { data } = useSession();
  const [open, setOpen] = useState(false);
  const { customers, products } = use(createOrderData);
  const { formAction, isPending } = useCreateModalState(createOrder);
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  const selectedProductPrice: number = useMemo(() => {
    const product = products.find(pr => pr.title === selectedProduct);
    return product?.price ?? 0;
  }, [selectedProduct]);

  useEffect(() => {
    if (!open) setSelectedProduct("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <fieldset disabled={data?.user.role === "viewer"}>
          <Button>Добавить заказ</Button>
        </fieldset>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form action={formAction} className="contents">
          <DialogHeader>
            <DialogTitle>Добавить заказ</DialogTitle>
            <DialogDescription>Новый заказ добавиться со статусом "создан"</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="customer_id">Заказчик</Label>
              <Select name="customer_id" required>
                <SelectTrigger id="customer_id" className="w-full">
                  <SelectValue placeholder="Выберите клиента" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Все клиенты</SelectLabel>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} children={customer.name} value={customer.id} />
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <div className="flex gap-4">
              <Field className="flex-2 max-w-2/3">
                <Label htmlFor="product_title">Товар</Label>
                <Select name="product_title" required onValueChange={setSelectedProduct}>
                  <SelectTrigger id="product_title">
                    <SelectValue placeholder="Выберите товар" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Все товары</SelectLabel>
                      {products.map(product => (
                        <SelectItem key={product.id} children={product.title} value={product.title} />
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field className="flex-1 pointer-events-none">
                <Label htmlFor="price">Сумма</Label>
                <InputGroup>
                  <InputGroupInput id="price" value={selectedProductPrice} readOnly />
                  <InputGroupAddon>
                    <InputGroupText>₽</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <LockKeyholeIcon />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </div>

            <Field>
              <Label htmlFor="note">Комментарий к заказу</Label>
              <Textarea
                id="note"
                name="note"
                className="min-h-17"
                placeholder="Оставьте комментарий к заказу..."
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Отмена</Button>
            </DialogClose>

            {isPending ? (
              <Button disabled>
                <Spinner /> Создание заказа
              </Button>
            ) : (
              <Button type="submit">Создать заказ</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
