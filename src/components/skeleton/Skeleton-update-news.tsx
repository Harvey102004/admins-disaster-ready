import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Skeleton } from "../ui/skeleton";

export const SideBarSkeleton = () => {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="relative h-14 w-14">
        <Skeleton className="h-full w-full rounded-full" />
      </div>
      <div className="flex w-full flex-1 flex-col gap-1">
        <Skeleton className="h-3 w-[50%]" />
        <Skeleton className="h-3 w-[70%]" />
        <Skeleton className="h-3 w-[35%]" />
      </div>
    </div>
  );
};

export const WeatherAdvisorySkeleton = () => {
  return (
    <Card className="border-dark-blue/50 flex max-w-[350px] dark:border-gray-500/40 dark:bg-transparent">
      <CardHeader>
        <Skeleton className="h-5 w-[90%]" />
        <Skeleton className="h-2 w-[50%]" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[85%]" />
        <Skeleton className="h-4 w-[75%]" />
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between text-xs">
        <Skeleton className="h-3 w-[60%]" />
        <Skeleton className="h-3 w-[20%]" />
      </CardFooter>
    </Card>
  );
};

export const RoadAdvisorySkeleton = () => {
  return (
    <Card className="border-dark-blue/50 flex max-w-[350px] dark:border-gray-500/40 dark:bg-transparent">
      <CardHeader>
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-3 w-[50%]" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[85%]" />
        <Skeleton className="h-4 w-[75%]" />
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between text-xs">
        <div className="w-[60%]">
          <Skeleton className="mb-2 h-3 w-[50%]" />
          <Skeleton className="h-3 w-full" />
        </div>
        <Skeleton className="h-3 w-[20%]" />
      </CardFooter>
    </Card>
  );
};

export const CommunityNoticeSkeleton = () => {
  return (
    <Card className="border-dark-blue/50 flex max-w-[350px] dark:border-gray-500/40 dark:bg-transparent">
      <CardHeader>
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-3 w-[50%]" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[85%]" />
        <Skeleton className="h-4 w-[75%]" />
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between text-xs">
        <Skeleton className="h-3 w-[60%]" />
        <Skeleton className="h-3 w-[20%]" />
      </CardFooter>
    </Card>
  );
};

export const DisasterUpdatesSkeleton = () => {
  return (
    <Card className="border-dark-blue/50 flex h-[300px] max-w-[350px] dark:border-gray-500/40 dark:bg-transparent">
      <CardHeader>
        <div className="flex gap-3">
          <Skeleton className="h-15 w-15" />

          <div className="flex w-[50%] flex-col gap-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-[100px]" />
            <Skeleton className="h-3 w-[200px]" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[75%]" />
      </CardContent>

      <CardFooter className="mt-auto flex items-center justify-between">
        <Skeleton className="h-3 w-[100px]" />

        <Skeleton className="h-3 w-[100px]" />
      </CardFooter>
    </Card>
  );
};
