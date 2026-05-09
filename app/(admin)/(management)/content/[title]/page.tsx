import { DeleteModal } from "@/app/components/ui/.custom/delete-modal";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/app/components/ui/card";
import { QuantityField } from "@/app/components/ui/content/quantity-field";
import { Field, FieldGroup } from "@/app/components/ui/field";
import { Input } from "@/app/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from "@/app/components/ui/input-group";
import { Label } from "@/app/components/ui/label";
import { deleteProduct, editProduct } from "@/app/lib/actions";
import { getProductByTitle, getUser } from "@/app/lib/data";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ title: string }> }) {
  const title = (await params).title;
  const product = await getProductByTitle(decodeURI(title));

  const user = await getUser();

  return (
    <Card className="max-w-[420px]">
      <CardHeader>
        <CardTitle>{product.title}</CardTitle>
        <CardDescription>Просмотр и редактирование карточки товара</CardDescription>
      </CardHeader>
      <fieldset disabled={user?.role === "viewer"}>
        <form action={editProduct}>
          <CardContent>
            <FieldGroup>
              <Field className="pointer-events-none">
                <Label htmlFor="title">Наименование</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Назовите товар..."
                  readOnly
                  value={product.title}
                />
              </Field>

              <QuantityField value={product.quantity} />

              <Field>
                <Label htmlFor="price">Стоимость</Label>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>₽</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput id="price" name="price" placeholder="0" defaultValue={product.price} />
                </InputGroup>
              </Field>
            </FieldGroup>
          </CardContent>

          <CardFooter className="flex justify-between pt-6">
            <DeleteModal id={product.id} deleteAction={deleteProduct} itemTitle="товар" />

            <div className="flex gap-2">
              <Link href="/customers">
                <Button variant="outline">Назад</Button>
              </Link>
              <Button type="submit" className="w-34">
                Сохранить
              </Button>
            </div>
          </CardFooter>
        </form>
      </fieldset>
    </Card>
  );
}
