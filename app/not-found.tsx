import Link from "next/link";
import { Button } from "./components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";

export default function NotFound() {
  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="size-74 py-18 gap-6">
        <CardHeader className="text-center gap-6">
          <CardTitle className="text-xl">404 - Не найдено</CardTitle>
          <CardDescription className="text-[16px]">
            Похоже, такой страницы не существует проверьте ссылку или вернитесь на главную
          </CardDescription>
        </CardHeader>

        <CardFooter className="justify-center">
          <Link href="/dashboard">
            <Button variant="link" className="text-[16px]">
              Перейти на главную
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
