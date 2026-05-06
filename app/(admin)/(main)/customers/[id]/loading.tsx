import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/app/components/ui/card";
import { Field, FieldGroup } from "@/app/components/ui/field";
import { Label } from "@/app/components/ui/label";
import TableSkeleton from "@/app/components/ui/orders/table-skeleton";
import { Skeleton } from "@/app/components/ui/skeleton";

type LoadingProps = {};

export default function Loading(props: LoadingProps) {
  return (
    <div className="flex gap-4">
      <div className="space-y-2.5 w-110">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <CardDescription>Просмотр и редактирование карточки клиента</CardDescription>
          </CardHeader>

          <form>
            <CardContent>
              <FieldGroup>
                <Field>
                  <Label htmlFor="email">Эл. почта</Label>
                  <Skeleton className="h-9 w-full" />
                </Field>

                <Field>
                  <Label htmlFor="telegram">Телеграмм</Label>
                  <Skeleton className="h-9 w-full" />
                </Field>

                <Field>
                  <Label htmlFor="phone_number">Номер телефона</Label>
                  <Skeleton className="h-9 w-full" />
                </Field>

                <Field>
                  <Label htmlFor="note">Комментарий к заказу</Label>
                  <Skeleton className="h-27 w-full" />
                </Field>
              </FieldGroup>
            </CardContent>

            <CardFooter className="flex justify-end pt-6 gap-2">
              <Button variant="outline">Назад</Button>
              <Button type="submit" className="w-34">
                Сохранить
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="py-4">
          <CardContent className="flex justify-between">
            <div className="space-y-1.5">
              <CardDescription>Количество заказов</CardDescription>
              <Skeleton className="h-5 w-12" />
            </div>
            <div className="space-y-1.5 text-end">
              <CardDescription>Общий чек</CardDescription>
              <Skeleton className="h-5 w-12" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 container">
        <TableSkeleton />
      </div>
    </div>
  );
}
