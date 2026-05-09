"use client";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/app/components/ui/dialog";
import { Field, FieldGroup } from "@/app/components/ui/field";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { authenticate } from "@/app/lib/actions";
import { useActionState, useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export function AuthModal() {
  const [open, setOpen] = useState(false);
  const { data: session, update, status } = useSession();
  const [state, formAction, isPending] = useActionState(authenticate, { message: "", status: "" });

  useEffect(() => {
    if (!state.message) return;
    if (state.status === "error") toast.error(state.message);
    else {
      update();
      setOpen(false);
      toast.success(state.message);
    }
  }, [state]);

  useEffect(() => {
    if (session?.user) setOpen(false);
    else if (!session?.user && status !== "loading") setOpen(true);
  }, [session]);

  if (session?.user) return null;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <form className="contents" action={formAction}>
          <DialogHeader>
            <DialogTitle>Войдите в аккаунт</DialogTitle>
            <DialogDescription>Здесь вы можете авторизоваться по логину</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="login">Логин</Label>
              <Input id="login" name="login" placeholder="Введите логин..." />
            </Field>
          </FieldGroup>
          <DialogFooter>
            {isPending ? (
              <Button disabled>
                <Spinner /> Производится вход
              </Button>
            ) : (
              <Button type="submit">Войти в аккаунт</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
