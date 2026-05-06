import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { EditCustomerForm } from "@/app/components/ui/customer/edit-customer-form";
import { getCustomerById } from "@/app/lib/data";
import { columns } from "../../orders/(table)/columns";
import { DataTable } from "../../orders/(table)/data-table";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const customerId = (await params).id;
  const customer = await getCustomerById(customerId);

  return (
    <div className="flex gap-4">
      <div className="space-y-2.5 w-110">
        <Card>
          <CardHeader>
            <CardTitle>{customer.name}</CardTitle>
            <CardDescription>Просмотр и редактирование карточки клиента</CardDescription>
          </CardHeader>

          <EditCustomerForm customer={customer} />
        </Card>

        <Card className="py-4">
          <CardContent className="flex justify-between">
            <div className="space-y-1">
              <CardDescription>Количество заказов</CardDescription>
              <p className="text-[16px] font-semibold">{customer.orders_quantity}</p>
            </div>
            <div className="space-y-1 text-end">
              <CardDescription>Общий чек</CardDescription>
              <p className="text-[16px] font-semibold">₽{customer.total_revenue}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 container">
        <DataTable columns={columns} data={customer.orders} />
      </div>
    </div>
  );
}
