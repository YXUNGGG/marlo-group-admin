import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/app/components/ui/card";
import { Field, FieldGroup } from "@/app/components/ui/field";
import { Input } from "@/app/components/ui/input";
import { getOrderById } from "@/app/lib/data";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { statuses } from "../(table)/data";
import { editOrder } from "@/app/lib/actions";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const orderId = (await params).id;
  const order = await getOrderById(orderId);

  return (
    <div className="space-y-2.5 max-w-[450px]">
      <Card>
        <CardHeader>
          <CardTitle>Редактирование заказа</CardTitle>
          <CardDescription>Просмотр и редактирование карточки заказа</CardDescription>
        </CardHeader>

        <form action={editOrder}>
          <CardContent>
            <FieldGroup>
              <div className="flex gap-4">
                <input readOnly name="id" value={orderId} className="hidden" />

                <Field className="flex-3">
                  <Label htmlFor="product">Товар</Label>
                  <Input value={order.product_title} readOnly />
                </Field>

                <Field className="flex-2">
                  <Label htmlFor="product">Статус</Label>
                  <Select defaultValue={order.status} name="status">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {statuses.map(option => (
                          <SelectItem key={option.value} value={option.value} title={option.label}>
                            <div className={`size-3 rounded-2xl ${option.color}`} />
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <Label htmlFor="note">Комментарий к заказу</Label>
                <Textarea
                  id="note"
                  name="note"
                  className="min-h-27"
                  defaultValue={order.note ?? undefined}
                  placeholder="Оставьте комментарий к заказу..."
                />
              </Field>
            </FieldGroup>
          </CardContent>

          <CardFooter className="flex justify-end pt-6 gap-2">
            <Link href="/orders">
              <Button variant="outline">Назад</Button>
            </Link>
            <Button type="submit" className="w-34">
              Сохранить
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="py-4">
        <CardContent className="flex justify-between">
          <div className="space-y-1">
            <CardDescription>Заказчик</CardDescription>
            <p className="text-[16px] font-semibold">{order.customer.name}</p>
          </div>
          <div className="space-y-1 text-end">
            <CardDescription>Сумма заказа</CardDescription>
            <p className="text-[16px] font-semibold">₽{order.product.price}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
