import { Skeleton } from "@/app/components/ui/skeleton";

type LoadingProps = {
  className: string;
};

export default function Loading({ className }: LoadingProps) {
  return (
    <div
      className={
        `size-full *:rounded-4xl px-0 pb-3.5 grid grid-cols-4 grid-rows-[325px_1fr] gap-x-3.5 gap-y-5.5 ` +
        className
      }
    >
      <Skeleton className="col-span-2" />
      <Skeleton />
      <Skeleton />

      <Skeleton />
      <Skeleton />
      <Skeleton className="col-span-2" />
    </div>
  );
}
