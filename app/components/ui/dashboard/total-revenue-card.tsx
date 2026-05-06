import { getRevenue } from "@/app/lib/data";
import { Badge } from "../badge";
import { Card, CardContent, CardDescription, CardHeader } from "../card";
import { Separator } from "../separator";

type TotalRevenueCardProps = {
  className: string;
};

export async function TotalRevenueCard({ className }: TotalRevenueCardProps) {
  const { weekRevenue } = await getRevenue();

  return (
    <Card className={className}>
      <CardHeader>
        <CardDescription>Выручка за неделю</CardDescription>
        <h1 className="font-medium text-[42px]">₽{weekRevenue?.toLocaleString("en-US") ?? 0}</h1>
        <Badge variant="outline">
          {" "}
          <div className="rounded-xl size-2 bg-muted-foreground" /> Какой-нибудь бейдж
        </Badge>
      </CardHeader>

      <CardContent>
        <div className="bg-muted rounded-3xl p-4 space-y-4">
          <div className="flex justify-between">
            <p className="text-muted-foreground">Всего переводов</p>
            <p className="font-medium">₽{weekRevenue?.toLocaleString("en-US")}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-muted-foreground">Налоги</p>
            <p className="font-medium">₽{"0"}</p>
          </div>

          <Separator />

          <div className="flex justify-between">
            <p className="text-muted-foreground">Суммарная выручка</p>
            <p className="font-medium">₽{weekRevenue?.toLocaleString("en-US") ?? 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
