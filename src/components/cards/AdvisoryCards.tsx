"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

import DateTimeDisplay from "../DateConvertion";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { HiOutlineDotsVertical } from "react-icons/hi";
import { AiFillDelete } from "react-icons/ai";
import { RiEdit2Fill } from "react-icons/ri";

import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  deleteCommunity,
  deleteDisaster,
  deleteRoad,
  deleteWeather,
} from "@/server/api/advisories";
import { toast } from "sonner";
import { showDeleteConfirmation } from "@/lib/toasts";

interface WeatherCardsProps {
  id: string | number;
  title: string;
  desc: string;
  dateTime: string;
  addedBy: string;
}

interface CommunityCardsProps {
  id: string | number;
  title: string;
  desc: string;
  dateTime: string;
  addedBy: string;
}

interface RoadCardsProps {
  id: string | number;
  title: string;
  desc: string;
  dateTime: string;
  status: string;
  addedBy: string;
}

interface DisasterCardsProps {
  id: string | number;
  image: string;
  title: string;
  desc: string;
  disasterType: string;
  dateTime: string;
  addedBy: string;
}

export const WeatherCards = ({
  id,
  title,
  desc,
  dateTime,
  addedBy,
}: WeatherCardsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isToastOpen, setIsToastOpen] = useState(false);

  const weatherId = id;

  const { mutate } = useMutation({
    mutationFn: async () => {
      return await toast.promise(deleteWeather({ id: String(weatherId) }), {
        loading: "Deleting weather advisory...",
        success: () => {
          return "Weather advisory deleted successfully!";
        },
        error: (error) => {
          return error?.message || "Something went wrong";
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weatherAdvisory"] });
      router.refresh();
    },
  });

  return (
    <Card className="border-dark-blue/50 relative flex h-[280px] max-w-[350px] transition-all duration-300 hover:z-10 hover:scale-[1.01] hover:shadow-lg dark:border-gray-500/40 dark:bg-transparent">
      <CardHeader>
        <CardTitle className="truncate pr-3">{title}</CardTitle>
        <CardDescription className="text-xs text-gray-800 dark:text-gray-500">
          <DateTimeDisplay value={dateTime} />
        </CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="outline-none focus:outline-none active:outline-none">
                <HiOutlineDotsVertical className="text-xl" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-xs"
                disabled={isToastOpen}
                onClick={() =>
                  router.push(
                    `/super-update-news/weather-advisory/edit-weather-form/${id}`,
                  )
                }
              >
                <RiEdit2Fill className="text-dark-blue" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs"
                disabled={isToastOpen}
                onClick={() => {
                  if (!id) return toast.error("Invalid ID");
                  setIsToastOpen(true);
                  showDeleteConfirmation({
                    onConfirm: () => mutate(),
                    onClose: () => {
                      setIsToastOpen(false);
                    },
                  });

                  setTimeout(() => {
                    setIsToastOpen(false);
                  }, 5000);
                }}
              >
                <AiFillDelete className="text-red-500" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardContent className="justify-self-end">
        <p className="line-clamp-5 text-sm leading-relaxed tracking-normal text-gray-800 dark:text-gray-300">
          {desc}
        </p>
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between">
        <span className="text-xs text-gray-800 dark:text-gray-500">
          {addedBy}
        </span>
        <Link
          href={`weather-advisory/detail/${id}`}
          scroll={false}
          className="text-dark-blue text-sm"
        >
          View details
        </Link>
      </CardFooter>
    </Card>
  );
};

export const CommunityCards = ({
  id,
  title,
  desc,
  dateTime,
  addedBy,
}: CommunityCardsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isToastOpen, setIsToastOpen] = useState(false);

  const communityId = id;

  const { mutate } = useMutation({
    mutationFn: async () => {
      return await toast.promise(deleteCommunity({ id: String(communityId) }), {
        loading: "Deleting community notice...",
        success: () => {
          return "Community notice deleted successfully!";
        },
        error: (error) => {
          return error?.message || "Something went wrong";
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityNotice"] });
      router.refresh();
    },
  });

  return (
    <Card className="border-dark-blue/50 relative flex h-[280px] max-w-[350px] transition-all duration-300 hover:z-10 hover:scale-[1.01] hover:shadow-lg dark:border-gray-500/40 dark:bg-transparent">
      <CardHeader>
        <CardTitle className="truncate pr-3">{title}</CardTitle>
        <CardDescription className="text-xs text-gray-800 dark:text-gray-500">
          <DateTimeDisplay value={dateTime} />
        </CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="outline-none focus:outline-none active:outline-none">
                <HiOutlineDotsVertical className="text-xl" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-xs"
                disabled={isToastOpen}
                onClick={() =>
                  router.push(
                    `/super-update-news/community-notice/edit-community-notice-form/${id}`,
                  )
                }
              >
                <RiEdit2Fill className="text-dark-blue" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs"
                disabled={isToastOpen}
                onClick={() => {
                  if (!id) return toast.error("Invalid ID");
                  setIsToastOpen(true);
                  showDeleteConfirmation({
                    onConfirm: () => mutate(),
                    onClose: () => {
                      setIsToastOpen(false);
                    },
                  });

                  setTimeout(() => {
                    setIsToastOpen(false);
                  }, 5000);
                }}
              >
                <AiFillDelete className="text-red-500" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="justify-self-end">
        <p className="line-clamp-5 text-sm leading-relaxed tracking-normal text-gray-800 dark:text-gray-300">
          {desc}
        </p>
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between">
        <span className="text-xs text-gray-800 dark:text-gray-500">
          {addedBy}
        </span>
        <Link
          href={`community-notice/detail/${id}`}
          scroll={false}
          className="text-dark-blue text-sm"
        >
          View details
        </Link>
      </CardFooter>
    </Card>
  );
};

export const RoadCards = ({
  id,
  title,
  desc,
  dateTime,
  status,
  addedBy,
}: RoadCardsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isToastOpen, setIsToastOpen] = useState(false);

  const roadId = id;

  const { mutate } = useMutation({
    mutationFn: async () => {
      return await toast.promise(deleteRoad({ id: String(roadId) }), {
        loading: "Deleting road advisory...",
        success: () => {
          return "Road advisory deleted successfully!";
        },
        error: (error) => {
          return error?.message || "Something went wrong";
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadAdvisory"] });
      router.refresh();
    },
  });

  return (
    <Card className="border-dark-blue/50 relative flex h-[300px] max-w-[350px] transition-all duration-300 hover:z-10 hover:scale-[1.01] hover:shadow-lg dark:border-gray-500/40 dark:bg-transparent">
      <CardHeader>
        <CardTitle className="truncate pr-3">{title}</CardTitle>
        <CardDescription className="text-xs text-gray-800 dark:text-gray-500">
          <DateTimeDisplay value={dateTime} />
        </CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="outline-none focus:outline-none active:outline-none">
                <HiOutlineDotsVertical className="text-xl" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-xs"
                disabled={isToastOpen}
                onClick={() =>
                  router.push(
                    `/super-update-news/road-advisory/edit-road-form/${id}`,
                  )
                }
              >
                <RiEdit2Fill className="text-dark-blue" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs"
                disabled={isToastOpen}
                onClick={() => {
                  if (!id) return toast.error("Invalid ID");
                  setIsToastOpen(true);
                  showDeleteConfirmation({
                    onConfirm: () => mutate(),
                    onClose: () => {
                      setIsToastOpen(false);
                    },
                  });

                  setTimeout(() => {
                    setIsToastOpen(false);
                  }, 5000);
                }}
              >
                <AiFillDelete className="text-red-500" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="justify-self-end">
        <p className="line-clamp-5 text-sm leading-relaxed tracking-normal text-gray-800 dark:text-gray-300">
          {desc}
        </p>
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <div
              className={`h-2 w-2 rounded-full bg-green-700 ${
                status === "Open"
                  ? "bg-green-500"
                  : status === "Partially Open"
                    ? "bg-yellow-600"
                    : status === "Closed"
                      ? "bg-red-500"
                      : "bg-zinc-300"
              }`}
            ></div>
            <p
              className={`text-xs ${
                status === "Open"
                  ? "text-green-500"
                  : status === "Partially Open"
                    ? "text-yellow-600"
                    : status === "Closed"
                      ? "text-red-500"
                      : "text-zinc-300"
              }`}
            >
              {status}
            </p>
          </div>

          <span className="text-xs text-gray-800 dark:text-gray-500">
            {addedBy}
          </span>
        </div>
        <Link
          href={`road-advisory/detail/${id}`}
          scroll={false}
          className="text-dark-blue text-sm"
        >
          View details
        </Link>
      </CardFooter>
    </Card>
  );
};

export const DisasterCard = ({
  id,
  image,
  title,
  disasterType,
  desc,
  dateTime,
  addedBy,
}: DisasterCardsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isToastOpen, setIsToastOpen] = useState(false);

  const disasterId = id;

  const { mutate } = useMutation({
    mutationFn: async () => {
      return await toast.promise(deleteDisaster({ id: String(disasterId) }), {
        loading: "Deleting disaster updates...",
        success: () => {
          return "Disaster updates deleted successfully";
        },
        error: (err) => {
          return err?.message || "Something went wrong";
        },
      });
    },

    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["disasterUpdates"] });
    },
  });

  return (
    <Card className="border-dark-blue/50 relative flex h-[300px] max-w-[350px] transition-all duration-300 hover:z-10 hover:scale-[1.01] hover:shadow-lg dark:border-gray-500/40 dark:bg-transparent">
      <CardHeader>
        <div className="flex gap-3">
          <div className="relative h-15 w-15 overflow-hidden rounded-md bg-transparent">
            <Image
              src={image ?? ""}
              fill
              alt=""
              className="object-cover object-center"
            />
          </div>

          <div className="w-[50%]">
            <CardTitle className="max-w-[300px] truncate">{title}</CardTitle>
            <CardDescription className="text-dark-blue mt-1 text-xs">
              {disasterType}
            </CardDescription>
            <CardDescription className="mt-1 text-[10px] text-gray-800 dark:text-gray-500">
              <DateTimeDisplay value={dateTime} />
            </CardDescription>
          </div>

          <CardAction className="absolute right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none focus:outline-none active:outline-none">
                  <HiOutlineDotsVertical className="text-xl" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    router.push(
                      `/super-update-news/disaster-updates/edit-disaster-form/${id}`,
                    )
                  }
                  disabled={isToastOpen}
                  className="text-xs"
                >
                  <RiEdit2Fill className="text-dark-blue" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={isToastOpen}
                  onClick={() => {
                    if (!id) return toast.error("Invalid ID");
                    setIsToastOpen(true);
                    showDeleteConfirmation({
                      onConfirm: () => mutate(),
                      onClose: () => {
                        setIsToastOpen(false);
                      },
                    });

                    setTimeout(() => {
                      setIsToastOpen(false);
                    }, 5000);
                  }}
                  className="text-xs"
                >
                  <AiFillDelete className="text-red-500" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="justify-self-end">
        <p className="line-clamp-5 text-sm leading-relaxed tracking-normal text-gray-800 dark:text-gray-300">
          {desc}
        </p>
      </CardContent>

      <CardFooter className="mt-auto flex items-center justify-between">
        <p className="text-xs text-gray-800 dark:text-gray-500">{addedBy}</p>

        <Link
          href={`disaster-updates/detail/${id}`}
          scroll={false}
          className="text-dark-blue text-sm"
        >
          View details
        </Link>
      </CardFooter>
    </Card>
  );
};
