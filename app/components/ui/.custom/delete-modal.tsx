"use client";

import { Button } from "../button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type DeleteModalType = {
  id: string;
  itemTitle: string;
  deleteAction: (id: string) => Promise<any>;
};

export function DeleteModal({ id, deleteAction, itemTitle }: DeleteModalType) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleDeleteCustomer = async () => {
    try {
      const name = await deleteAction(id);
      setOpen(false);

      toast.success(`Удаление прошло успешно!`, { description: `Наименование: ${name}` });
      console.log(path.split("/")[1]);
      router.replace("/" + path.split("/")[1]);
    } catch (error) {
      toast.error("Произошла ошибка!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2Icon />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Удалить {itemTitle}</DialogTitle>
          <DialogDescription>
            Вы уверены, что хотите удалить {itemTitle} со всеми его данными?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="flex-1">
              Отмена
            </Button>
          </DialogClose>
          <Button className="flex-1" type="submit" onClick={handleDeleteCustomer}>
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
