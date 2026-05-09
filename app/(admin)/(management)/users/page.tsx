import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { CreateUserModal } from "@/app/components/ui/users/create-user-modal";
import { UserListItem } from "@/app/components/ui/users/user-list-item";
import { getUser, getUsers } from "@/app/lib/data";
import { Suspense } from "react";

export default async function Page() {
  const user = await getUser();

  const userSkeleton = (
    <div className="space-y-7">
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );

  return (
    <Card className="max-w-220">
      <CardHeader>
        <CardTitle>Конфигурация команды</CardTitle>
        <CardDescription>
          Создайте пользователя или измените права доступа для членов команды администрирования компании
        </CardDescription>
      </CardHeader>

      <fieldset disabled={user?.role === "viewer"}>
        <CardContent className="space-y-6">
          <Suspense fallback={userSkeleton}>
            <UserList />
          </Suspense>
          <CreateUserModal />
        </CardContent>
      </fieldset>

      <CardFooter>
        <Suspense fallback={<Skeleton className="h-5 w-45" />}>
          <UserCount />
        </Suspense>
      </CardFooter>
    </Card>
  );
}

async function UserList() {
  const { users } = await getUsers();
  return (
    <>
      {users.map(user => (
        <UserListItem user={user} key={user.id} />
      ))}
    </>
  );
}

async function UserCount() {
  const { usersCount } = await getUsers();
  return <CardDescription className="select-none">Всего пользователей: {usersCount}</CardDescription>;
}
