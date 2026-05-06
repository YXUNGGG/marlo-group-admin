import { getCustomers } from "@/app/lib/data";
import { CardContent } from "../card";
import { CustopmerParamsType } from "@/app/(admin)/(main)/customers/page";
import { CustomerListItem } from "./customer-list-item";

type CustomerListProps = {
  params: Promise<CustopmerParamsType>;
};

export async function CustomerList({ params }: CustomerListProps) {
  const searchParams = await params;
  const customers = await getCustomers(searchParams);

  if (!customers.length) return <div className="py-6 mx-auto text-muted-foreground">Ничего не найдено</div>;
  return (
    <CardContent className="space-y-4 overflow-y-auto">
      {customers.map(customer => (
        <CustomerListItem key={customer.id} customer={customer} />
      ))}
    </CardContent>
  );
}
