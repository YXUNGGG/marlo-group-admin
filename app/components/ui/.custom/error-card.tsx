import Link from "next/link";
import { Button } from "../button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../card";

type ErrorCardProps = {};

export function ErrorCard(props: ErrorCardProps) {
  return (
    <div className="h-9/10 w-full flex justify-center items-center">
      <Card className="w-72">
        <CardHeader className="text-center">
          <CardTitle>Непредвиденная ошибка</CardTitle>
          <CardDescription>Пожалуйста, повторите позже. Мы уже разбираемся с проблемой</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Link href="/dashboard">
            <Button variant="outline">На главную</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
