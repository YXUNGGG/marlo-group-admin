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
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

export function LogoutModal() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  if (!session?.user) return null;

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });

      setOpen(false);
      toast.success("Выход произведен успешно");
    } catch (error) {
      toast.error("Произошла ошибка!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" onClick={() => setOpen(true)}>
          Выйти из аккаунта
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <form className="contents">
          <DialogHeader>
            <DialogTitle>Выйти из аккаунта</DialogTitle>
            <DialogDescription>Вы уверены, что хотите выйти?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Отмена</Button>
            </DialogClose>
            <Button type="submit" onClick={handleLogout}>
              Выйти из аккаунта
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
