export type SortBy =
  | "default"
  | "title"
  | "dateTime"
  | "added_by"
  | "status"
  | "disasterType";

import {
  TCommunity,
  TDisasterAdvisory,
  TRoadAdvisory,
  TWeatherAdvisory,
} from "../../types";

// --------- WEATHER SORTING AND FILTERING -------- //

export function sortWeatherData(
  data: TWeatherAdvisory[],
  sortBy: SortBy,
): TWeatherAdvisory[] {
  if (!data) return [];

  switch (sortBy) {
    case "default":
      return data;

    case "title":
      return [...data].sort((a, b) => a.title.localeCompare(b.title));

    case "added_by": {
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (!user) {
        return [...data].sort((a, b) => a.added_by.localeCompare(b.added_by));
      }

      const currentUserBarangay = user.barangay?.trim().toLowerCase();

      return [...data].sort((a, b) => {
        const aBarangay = a.added_by?.trim().toLowerCase();
        const bBarangay = b.added_by?.trim().toLowerCase();

        const isAUser = aBarangay === currentUserBarangay;
        const isBUser = bBarangay === currentUserBarangay;

        if (isAUser && !isBUser) return -1;
        if (!isAUser && isBUser) return 1;

        return aBarangay.localeCompare(bBarangay);
      });
    }

    case "dateTime":
      return [...data].sort(
        (a, b) =>
          new Date(b.date_time).getTime() - new Date(a.date_time).getTime(),
      );

    default:
      return data;
  }
}

export function filterWeatherData(
  data: TWeatherAdvisory[],
  filterBrgy: string,
  filterDate: string,
): TWeatherAdvisory[] {
  return data.filter((item) => {
    const normalize = (val?: string) =>
      (val ?? "")
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ");

    const itemVal = normalize(item.added_by);
    const filterVal = normalize(filterBrgy);

    const matchBrgy = filterBrgy === "default" || itemVal === filterVal;

    const matchDate = (() => {
      if (filterDate === "all") return true;

      const advisoryDate = new Date(item.date_time);
      const now = new Date();

      const advisoryDay = new Date(
        advisoryDate.getFullYear(),
        advisoryDate.getMonth(),
        advisoryDate.getDate(),
      );
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (filterDate === "today") {
        return advisoryDay.getTime() === today.getTime();
      }

      if (filterDate === "yesterday") {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return advisoryDay.getTime() === yesterday.getTime();
      }

      if (filterDate === "past7") {
        const past = new Date(today);
        past.setDate(today.getDate() - 7);
        return advisoryDay >= past && advisoryDay <= today;
      }

      if (filterDate === "past30") {
        const past = new Date(today);
        past.setDate(today.getDate() - 30);
        return advisoryDay >= past && advisoryDay <= today;
      }

      return true;
    })();

    return matchBrgy && matchDate;
  });
}

// --------- COMMUNITY SORTING AND FILTERING -------- //

export function sortCommunityData(
  data: TCommunity[],
  sortBy: SortBy,
): TCommunity[] {
  if (!data) return [];

  switch (sortBy) {
    case "default":
      return data;

    case "title":
      return [...data].sort((a, b) => a.title.localeCompare(b.title));

    case "added_by": {
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (!user) {
        return [...data].sort((a, b) => a.added_by.localeCompare(b.added_by));
      }

      const currentUserBarangay = user.barangay?.trim().toLowerCase();

      return [...data].sort((a, b) => {
        const aBarangay = a.added_by?.trim().toLowerCase();
        const bBarangay = b.added_by?.trim().toLowerCase();

        const isAUser = aBarangay === currentUserBarangay;
        const isBUser = bBarangay === currentUserBarangay;

        if (isAUser && !isBUser) return -1;
        if (!isAUser && isBUser) return 1;

        return aBarangay.localeCompare(bBarangay);
      });
    }

    case "dateTime":
      return [...data].sort(
        (a, b) =>
          new Date(a.date_time).getTime() - new Date(b.date_time).getTime(),
      );

    default:
      return data;
  }
}

export function filterCommunityData(
  data: TCommunity[],
  filterBrgy: string,
  filterDate: string,
): TCommunity[] {
  return data.filter((item) => {
    const normalize = (val?: string) =>
      (val ?? "")
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ");

    const itemVal = normalize(item.added_by);
    const filterVal = normalize(filterBrgy);

    const matchBrgy = filterBrgy === "default" || itemVal === filterVal;

    const matchDate = (() => {
      if (filterDate === "all") return true;

      const advisoryDate = new Date(item.date_time);
      const now = new Date();

      const advisoryDay = new Date(
        advisoryDate.getFullYear(),
        advisoryDate.getMonth(),
        advisoryDate.getDate(),
      );
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (filterDate === "today") {
        return advisoryDay.getTime() === today.getTime();
      }

      if (filterDate === "yesterday") {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return advisoryDay.getTime() === yesterday.getTime();
      }

      if (filterDate === "past7") {
        const past = new Date(today);
        past.setDate(today.getDate() - 7);
        return advisoryDay >= past && advisoryDay <= today;
      }

      if (filterDate === "past30") {
        const past = new Date(today);
        past.setDate(today.getDate() - 30);
        return advisoryDay >= past && advisoryDay <= today;
      }

      return true;
    })();

    return matchBrgy && matchDate;
  });
}

// --------- ROAD SORTING AND FILTERING -------- //

export function sortRoadData(
  data: TRoadAdvisory[],
  sortBy: SortBy,
): TRoadAdvisory[] {
  if (!data) return [];

  switch (sortBy) {
    case "default":
      return data;

    case "title":
      return [...data].sort((a, b) => a.title.localeCompare(b.title));

    case "added_by": {
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (!user) {
        return [...data].sort((a, b) => a.added_by.localeCompare(b.added_by));
      }

      const currentUserBarangay = user.barangay?.trim().toLowerCase();

      return [...data].sort((a, b) => {
        const aBarangay = a.added_by?.trim().toLowerCase();
        const bBarangay = b.added_by?.trim().toLowerCase();

        const isAUser = aBarangay === currentUserBarangay;
        const isBUser = bBarangay === currentUserBarangay;

        if (isAUser && !isBUser) return -1;
        if (!isAUser && isBUser) return 1;

        return aBarangay.localeCompare(bBarangay);
      });
    }

    case "status":
      return [...data].sort((a, b) => a.status.localeCompare(b.status));

    case "dateTime":
      return [...data].sort(
        (a, b) =>
          new Date(a.date_time).getTime() - new Date(b.date_time).getTime(),
      );

    default:
      return data;
  }
}

export function filterRoadData(
  data: TRoadAdvisory[],
  filterStatus: string,
  filterBrgy: string,
  filterDate: string,
): TRoadAdvisory[] {
  return data.filter((item) => {
    const normalize = (val?: string) =>
      (val ?? "")
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ");

    const itemVal = normalize(item.added_by);
    const filterVal = normalize(filterBrgy);

    const matchBrgy = filterBrgy === "default" || itemVal === filterVal;

    const matchStatus =
      filterStatus === "all" ||
      item.status?.toLowerCase() === filterStatus.toLowerCase();

    const matchDate = (() => {
      if (filterDate === "all") return true;

      const advisoryDate = new Date(item.date_time);
      const now = new Date();

      const advisoryDay = new Date(
        advisoryDate.getFullYear(),
        advisoryDate.getMonth(),
        advisoryDate.getDate(),
      );
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (filterDate === "today") {
        return advisoryDay.getTime() === today.getTime();
      }

      if (filterDate === "yesterday") {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return advisoryDay.getTime() === yesterday.getTime();
      }

      if (filterDate === "past7") {
        const past = new Date(today);
        past.setDate(today.getDate() - 7);
        return advisoryDay >= past && advisoryDay <= today;
      }

      if (filterDate === "past30") {
        const past = new Date(today);
        past.setDate(today.getDate() - 30);
        return advisoryDay >= past && advisoryDay <= today;
      }

      return true;
    })();

    return matchBrgy && matchDate && matchStatus;
  });
}

// --------- DISASTER SORTING AND FILTERING -------- //

export function sortDisasterData(
  data: TDisasterAdvisory[],
  sortBy: SortBy,
): TDisasterAdvisory[] {
  if (!data) return [];

  switch (sortBy) {
    case "default":
      return data;

    case "title":
      return [...data].sort((a, b) => a.title.localeCompare(b.title));

    case "added_by": {
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (!user) {
        return [...data].sort((a, b) => a.added_by.localeCompare(b.added_by));
      }

      const currentUserBarangay = user.barangay?.trim().toLowerCase();

      return [...data].sort((a, b) => {
        const aBarangay = a.added_by?.trim().toLowerCase();
        const bBarangay = b.added_by?.trim().toLowerCase();

        const isAUser = aBarangay === currentUserBarangay;
        const isBUser = bBarangay === currentUserBarangay;

        if (isAUser && !isBUser) return -1;
        if (!isAUser && isBUser) return 1;

        return aBarangay.localeCompare(bBarangay);
      });
    }

    case "disasterType":
      return [...data].sort((a, b) =>
        a.disaster_type.localeCompare(b.disaster_type),
      );

    case "dateTime":
      return [...data].sort(
        (a, b) =>
          new Date(a.date_time).getTime() - new Date(b.date_time).getTime(),
      );

    default:
      return data;
  }
}

export function filterDisasterData(
  data: TDisasterAdvisory[],
  filterDisasterType: string,
  filterBrgy: string,
  filterDate: string,
): TDisasterAdvisory[] {
  return data.filter((item) => {
    const normalize = (val?: string) =>
      (val ?? "")
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ");

    const itemVal = normalize(item.added_by);
    const filterVal = normalize(filterBrgy);

    const matchBrgy = filterBrgy === "default" || itemVal === filterVal;

    const matchStatus =
      filterDisasterType === "all" ||
      item.disaster_type?.toLowerCase() === filterDisasterType.toLowerCase();

    const matchDate = (() => {
      if (filterDate === "all") return true;

      const advisoryDate = new Date(item.date_time);
      const now = new Date();

      const advisoryDay = new Date(
        advisoryDate.getFullYear(),
        advisoryDate.getMonth(),
        advisoryDate.getDate(),
      );
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (filterDate === "today") {
        return advisoryDay.getTime() === today.getTime();
      }

      if (filterDate === "yesterday") {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return advisoryDay.getTime() === yesterday.getTime();
      }

      if (filterDate === "past7") {
        const past = new Date(today);
        past.setDate(today.getDate() - 7);
        return advisoryDay >= past && advisoryDay <= today;
      }

      if (filterDate === "past30") {
        const past = new Date(today);
        past.setDate(today.getDate() - 30);
        return advisoryDay >= past && advisoryDay <= today;
      }

      return true;
    })();

    return matchBrgy && matchDate && matchStatus;
  });
}
