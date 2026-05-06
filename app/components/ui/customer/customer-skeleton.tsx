import { Skeleton } from "../skeleton";

export function CustomerSkeleton() {
  return (
    <div className="space-y-4 px-6">
      {[...new Array(7)].map((_, i) => (
        <Skeleton key={i} className="w-full h-20" />
      ))}
    </div>
  );
}
