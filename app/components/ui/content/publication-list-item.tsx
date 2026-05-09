import { PublicationType } from "@/app/(admin)/(management)/content/data";
import { formatTime } from "@/app/lib/utils";
import { Button } from "../button";
import Link from "next/link";
import { Separator } from "../separator";

type PublicationListItemProps = {
  data: PublicationType;
};

export function PublicationListItem({ data }: PublicationListItemProps) {
  return (
    <div>
      <div className="py-4 px-3 flex justify-between items-center">
        <div className="flex-1 flex gap-4 items-center">
          <div className="p-2.5 bg-secondary rounded-xl">
            <data.icon />
          </div>
          <div>
            <div>{data.title}</div>
            <div className="text-muted-foreground">{data.provider}</div>
          </div>
        </div>
        <p className="flex-1 text-center text-muted-foreground">{formatTime(data.date)}</p>
        <Link href={data.href}>
          <Button variant="secondary" className="px-6">
            Перейти
          </Button>
        </Link>
      </div>
      <Separator />
    </div>
  );
}
