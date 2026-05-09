import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/app/components/ui/card";
import { Field, FieldGroup } from "@/app/components/ui/field";
import { Label } from "@/app/components/ui/label";
import { Skeleton } from "@/app/components/ui/skeleton";
import Link from "next/link";

export default function Loading() {
  return (
    <Card className="max-w-[420px]">
      <CardHeader>
        <Skeleton className="h-6 w-42" />
        <CardDescription>Просмотр и редактирование карточки товара</CardDescription>
      </CardHeader>

      <CardContent>
        <FieldGroup>
          <Field>
            <Label htmlFor="title">Наименование</Label>
            <Skeleton className="h-9 w-full" />
          </Field>

          <Field>
            <Label htmlFor="title">Количество</Label>
            <Skeleton className="h-9 w-full" />
          </Field>

          <Field>
            <Label htmlFor="price">Стоимость</Label>
            <Skeleton className="h-9 w-full" />
          </Field>
        </FieldGroup>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Link href="/content">
          <Button variant="outline">Назад</Button>
        </Link>
        <Button type="submit" className="w-34">
          Сохранить
        </Button>
      </CardFooter>
    </Card>
  );
}
