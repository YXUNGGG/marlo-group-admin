"use client";

import { Prisma } from "@/generated/prisma/client";
import { formatTime } from "@/app/lib/utils";
import { Input } from "@/app/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/app/components/ui/field";
import { UserListItemActions } from "@/app/components/ui/users/user-list-item-actions";

type UserListItemProps = {
  user: Prisma.UserGetPayload<{}>;
};

export function UserListItem({ user }: UserListItemProps) {
  const { UserBlockButton, UserRoleSelect } = UserListItemActions({ id: "role", user: user });

  return (
    <div className="flex gap-4">
      <FieldSet className="w-full">
        <FieldGroup>
          <div className="grid grid-cols-[1.2fr_1.2fr_1fr_0.8fr_1fr] gap-4">
            <Field>
              <FieldLabel htmlFor="login">Логин</FieldLabel>
              <Input disabled id="login" type="text" value={user.login} />
            </Field>
            <Field>
              <FieldLabel htmlFor="name">Имя</FieldLabel>
              <Input disabled id="name" type="text" value={user.name} />
            </Field>
            <Field>
              <FieldLabel htmlFor="role">Роль</FieldLabel>
              {UserRoleSelect}
            </Field>
            <Field>
              <FieldLabel htmlFor="last-seen-at">Последний вход</FieldLabel>
              <p id="last-seen-at" className="py-2 text-muted-foreground">
                {formatTime(user.last_seen_at)}
              </p>
            </Field>
            <Field className="justify-end">{UserBlockButton}</Field>
          </div>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}
