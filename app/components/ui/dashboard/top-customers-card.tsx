import { getRevenue, getTopPositions } from "@/app/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";

function PercentCircleIcon({ percent }: { percent: number }) {
  return (
    <svg aria-hidden="true" fill="none" height="16" width="16" strokeWidth="2" viewBox="0 0 100 100" className="-rotate-90">
      <circle cx="50" cy="50" r="42.5" strokeWidth="12" strokeDashoffset="0" strokeLinecap="round" strokeLinejoin="round" className="opacity-20" stroke="currentColor" 
      style={{ strokeDasharray: "270, 270" }}></circle>
      <circle cx="50" cy="50" r="42.5" strokeWidth="12" strokeDashoffset="0" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" className="transition-all duration-300" 
      style={{strokeDasharray: `${percent * 3}, 270`}}></circle>
    </svg>
  );
}

type TopCustomersCardProps = {
  className: string;
}

export async function TopCustomersCard({ className }: TopCustomersCardProps) {
  const { totalRevenue } = await getRevenue();
  const { topCustomers } = await getTopPositions();
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Активные клиенты</CardTitle>
        <CardDescription>Топ клиентов с процентом от общих продаж</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {topCustomers.map(customer => (
          <p key={customer.id} className="flex justify-between">
            <span className="flex gap-2 items-center text-primary">
              <PercentCircleIcon percent={100 / Number(totalRevenue) * customer.total_revenue} />
              <span className="text-foreground">{customer.name}</span>
            </span>
            <span className="text-muted-foreground font-medium">
              ₽{customer.total_revenue.toLocaleString('en-US')}
            </span>
          </p>
        ))}
      </CardContent>
    </Card>
  );
}