import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/app/components/ui/card";
import { Field, FieldGroup } from "@/app/components/ui/field";
import { Label } from "@/app/components/ui/label";
import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-2.5 max-w-[450px]">
      <Card>
        <CardHeader>
          <CardTitle>Редактирование заказа</CardTitle>
          <CardDescription>Просмотр и редактирование карточки заказа</CardDescription>
        </CardHeader>

        <form>
          <CardContent>
            <FieldGroup>
              <div className="flex gap-4">
                <Field className="flex-3">
                  <Label htmlFor="product">Товар</Label>
                  <Skeleton className="w-2/3 h-9" />
                </Field>

                <Field className="flex-2">
                  <Label htmlFor="product">Статус</Label>
                  <Skeleton className="w-1/3 h-9" />
                </Field>
              </div>

              <Field>
                <Label htmlFor="note">Комментарий к заказу</Label>
                <Skeleton className="w-full h-27" />
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
          <div className="space-y-2">
            <CardDescription>Заказчик</CardDescription>
            <Skeleton className="w-32 h-5" />
          </div>
          <div className="space-y-2 flex flex-col items-end">
            <CardDescription>Сумма заказа</CardDescription>
            <Skeleton className="w-24 h-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
