import { Skeleton } from "@/app/components/ui/skeleton";

type TableSkeletonType = {
  includeTableActions?: boolean;
};

export default function TableSkeleton({ includeTableActions = false }: TableSkeletonType) {
  return (
    <div className="space-y-6">
      {includeTableActions && (
        <div className="flex justify-between">
          <Skeleton className="h-8 w-lg" />
          <Skeleton className="h-8 w-32" />
        </div>
      )}

      <div className="space-y-3">
        {[...new Array(12)].map((_, i) => (
          <Skeleton key={i} className="w-full h-10 rounded-sm" />
        ))}
      </div>

      <div className="flex justify-between">
        <Skeleton className="h-5 w-30" />
        <Skeleton className="h-8 w-70" />
      </div>
    </div>
  );
}
