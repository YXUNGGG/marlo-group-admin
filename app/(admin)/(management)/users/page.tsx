import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/app/components/ui/card";
import { CreateUserModal } from "@/app/components/ui/users/create-user-modal";
import { UserListItem } from "@/app/components/ui/users/user-list-item";
import { getUsers } from "@/app/lib/data";

export default async function Page() {
  const { users, usersCount } = await getUsers();

  return (
    <Card className="max-w-220">
      <CardHeader>
        <CardTitle>Конфигурация команды</CardTitle>
        <CardDescription>
          Создайте или измените права доступа для членов команды администрирования компании
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {users.map(user => (
          <UserListItem user={user} key={user.id} />
        ))}

        <CreateUserModal />
      </CardContent>

      <CardFooter>
        <CardDescription className="select-none">Всего пользователей: {usersCount}</CardDescription>
      </CardFooter>
    </Card>
  );
}
