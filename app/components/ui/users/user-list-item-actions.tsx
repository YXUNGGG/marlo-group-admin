"use client";

import { useState } from "react";
import { changeUserRole, toggleUserIsBlocked } from "@/app/lib/actions";
import { Prisma, Role } from "@/generated/prisma/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "../select";
import { Button } from "../button";
import { useSession } from "next-auth/react";

type UserRoleSelectProps = {
  id: string;
  user: Prisma.UserGetPayload<{}>;
};

export function UserListItemActions({ id, user }: UserRoleSelectProps) {
  const session = useSession().data;
  const currentUser = session?.user;
  const isDisabled = currentUser?.id === user.id;
  const [role, setRole] = useState<Role>(user.role);
  const [isBlocked, setIsBlocked] = useState(user.is_blocked);

  const UserRoleSelect = (
    <Select
      disabled={currentUser?.id === user.id}
      value={role}
      onValueChange={async (value: Role) => {
        setRole(value);
        changeUserRole(user.id, value);
      }}
    >
      <SelectTrigger id={id} className="w-full max-w-48">
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
  );

  const UserBlockButton = (
    <Button
      disabled={isDisabled}
      variant="destructive"
      onClick={async () => {
        setIsBlocked(true);
        toggleUserIsBlocked(user.id, true);
      }}
    >
      Заблокировать
    </Button>
  );

  const UserUnblockButton = (
    <Button
      disabled={isDisabled}
      variant="secondary"
      onClick={async () => {
        setIsBlocked(false);
        toggleUserIsBlocked(user.id, false);
      }}
    >
      Разблокировать
    </Button>
  );

  return {
    UserRoleSelect,
    UserBlockButton: isBlocked ? UserUnblockButton : UserBlockButton
  };
}
