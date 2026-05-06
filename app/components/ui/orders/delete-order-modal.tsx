"use client";

import { Button } from "../button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../dialog";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { deleteOrder } from "@/app/lib/actions";
import { Order } from "@/generated/prisma/client";

type DeleteOrderModalType = {
  orderData: Order[];
  children: React.ReactNode;
};

export function DeleteOrderModal({ orderData, children }: DeleteOrderModalType) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  if (!session?.user) return null;

  const handleDeleteOrder = async () => {
    try {
      await deleteOrder(orderData);

      setOpen(false);
      toast.success("Заказ(ы) удален(ы) успешно");
    } catch (error) {
      toast.error("Произошла ошибка!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}

      <DialogContent className="sm:max-w-xs" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Удалить заказ</DialogTitle>
          <DialogDescription>
            Вы уверены, что хотите удалить текущий заказ со всеми его данными?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="flex-1">
              Отмена
            </Button>
          </DialogClose>
          <Button className="flex-1" type="submit" onClick={handleDeleteOrder}>
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
