import { Skeleton } from "../ui/skeleton";

export const EvacuationSkeleton = () => {
  return (
    <div className="relative h-screen w-full overflow-auto pl-8">
      <div className="flex w-full items-center justify-between gap-8 px-8 py-5">
        <div className="flex items-center gap-2 pr-3 font-medium">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-36 rounded-full" />
        </div>
        <Skeleton className="h-10 flex-1 rounded-full" />
        <Skeleton className="h-10 w-36 rounded-full" />
      </div>

      <div className="px-8">
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="scrollBar grid h-[82vh] grid-cols-2 gap-7 overflow-auto px-8 pt-5 pb-20">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <div
              key={i}
              className="border-dark-blue/50 relative h-[280px] rounded-xl border p-5 dark:border-gray-500/40 dark:bg-transparent"
            >
              <div className="h-full w-full">
                <div className="flex w-full items-center justify-between">
                  <Skeleton className="h-5 w-[60%]" />

                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </div>
                </div>

                <div className="mt-3 flex h-[85%] w-full justify-between gap-10">
                  <div className="flex flex-1 flex-col justify-between gap-3">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-[80%]" />
                    <Skeleton className="h-3 w-[80%]" />
                    <Skeleton className="h-3 w-[80%]" />
                    <Skeleton className="h-3 w-[80%]" />
                    <Skeleton className="h-3 w-[80%]" />

                    <div className="flex items-center gap-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-[70%]" />
                    </div>
                  </div>

                  <div className="flex h-full w-1/2 flex-col items-center justify-between">
                    <div className="flex h-full w-full items-center justify-center">
                      <Skeleton className="h-[60%] w-[80%]" />
                    </div>

                    <Skeleton className="ml-5 h-8 w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
