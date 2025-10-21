"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TiArrowUnsorted } from "react-icons/ti";
import { FaFilter } from "react-icons/fa6";

// ----------- SORT DROPDOWN ----------- //

type SortOption = {
  label: string;
  value: string;
};

type SortDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  options: SortOption[];
};

export const SortDropdown = ({
  value,
  onChange,
  options,
}: SortDropdownProps) => {
  return (
    <div className="flex gap-4">
      <div className="flex w-max items-center gap-4">
        <div className="flex items-center gap-2">
          <TiArrowUnsorted className="text-2xl" />
          <p className="text-sm text-nowrap">Sort By :</p>
        </div>
      </div>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-dark-blue/50 focus:border-dark-blue w-[130px] rounded-sm border text-xs shadow-none outline-none dark:border-gray-500/50 dark:bg-transparent">
          <SelectValue placeholder="Select field" />
        </SelectTrigger>

        <SelectContent className="dark:bg-light-black bg-light-blue text-xs">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="data-[highlighted]:bg-dark-blue/20 text-xs dark:data-[highlighted]:text-white"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

// ---------- FILTERING WEATHER ADVISORY ------- //

export const FilteringWeather = ({
  selectedDate,
  onDateChange,
  selectedBrgy,
  onBrgyChange,
}: {
  selectedDate: string;
  onDateChange: (val: string) => void;
  selectedBrgy: string;
  onBrgyChange: (val: string) => void;
}) => {
  const allBrgy = [
    { name: "All", value: "default" },
    { name: "Municipality of LB", value: "Municipality of los baños" },
    { name: "Anos", value: "anos" },
    { name: "Bagong Silang", value: "bagong silang" },
    { name: "Bambang", value: "bambang" },
    { name: "Batong Malake", value: "batong malake" },
    { name: "Baybayin", value: "baybayin" },
    { name: "Bayog", value: "bayog" },
    { name: "Lalakay", value: "lalakay" },
    { name: "Maahas", value: "maahas" },
    { name: "Malinta", value: "malinta" },
    { name: "Mayondon", value: "mayondon" },
    { name: "Putho-Tuntungin", value: "putho-tuntungin" },
    { name: "San Antonio", value: "san antonio" },
    { name: "Tadlac", value: "tadlac" },
    { name: "Timugan", value: "timugan" },
  ];

  const dateOptions = [
    { label: "All Dates", value: "all" },
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Past 7 Days", value: "past7" },
    { label: "Past 30 Days", value: "past30" },
  ];

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <FaFilter />
        <p className="text-sm">Filter By:</p>
      </div>

      {/* Barangay Select */}
      <Select value={selectedBrgy} onValueChange={onBrgyChange}>
        <SelectTrigger className="border-dark-blue/50 focus:border-dark-blue w-[130px] rounded-sm border text-xs shadow-none outline-none dark:border-gray-500/50 dark:bg-transparent">
          <SelectValue placeholder="Select brgy" />
        </SelectTrigger>

        <SelectContent className="dark:bg-light-black bg-light-blue text-xs">
          {allBrgy.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="data-[highlighted]:bg-dark-blue/20 text-xs dark:data-[highlighted]:text-white"
            >
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date Select */}
      <Select value={selectedDate} onValueChange={onDateChange}>
        <SelectTrigger className="border-dark-blue/50 focus:border-dark-blue w-[130px] rounded-sm border text-xs shadow-none outline-none dark:border-gray-500/50 dark:bg-transparent">
          <SelectValue placeholder="Select date" />
        </SelectTrigger>
        <SelectContent className="dark:bg-light-black bg-light-blue text-xs">
          {dateOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="data-[highlighted]:bg-dark-blue/20 text-xs dark:data-[highlighted]:text-white"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

// ---------- FILTERING COMMUNITY NOTICE ------- //

export const FilteringCommunity = ({
  selectedDate,
  onDateChange,
  selectedBrgy,
  onBrgyChange,
}: {
  selectedDate: string;
  onDateChange: (val: string) => void;
  selectedBrgy: string;
  onBrgyChange: (val: string) => void;
}) => {
  const allBrgy = [
    { name: "All", value: "default" },
    { name: "Municipality of LB", value: "Municipality of los baños" },
    { name: "Anos", value: "anos" },
    { name: "Bagong Silang", value: "bagong silang" },
    { name: "Bambang", value: "bambang" },
    { name: "Batong Malake", value: "batong malake" },
    { name: "Baybayin", value: "baybayin" },
    { name: "Bayog", value: "bayog" },
    { name: "Lalakay", value: "lalakay" },
    { name: "Maahas", value: "maahas" },
    { name: "Malinta", value: "malinta" },
    { name: "Mayondon", value: "mayondon" },
    { name: "Putho-Tuntungin", value: "putho-tuntungin" },
    { name: "San Antonio", value: "san antonio" },
    { name: "Tadlac", value: "tadlac" },
    { name: "Timugan", value: "timugan" },
  ];

  const dateOptions = [
    { label: "All Dates", value: "all" },
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Past 7 Days", value: "past7" },
    { label: "Past 30 Days", value: "past30" },
  ];

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <FaFilter />
        <p className="text-sm">Filter By:</p>
      </div>

      <Select value={selectedBrgy} onValueChange={onBrgyChange}>
        <SelectTrigger className="border-dark-blue/50 focus:border-dark-blue w-[130px] rounded-sm border text-xs shadow-none outline-none dark:border-gray-500/50 dark:bg-transparent">
          <SelectValue placeholder="Select brgy" />
        </SelectTrigger>

        <SelectContent className="dark:bg-light-black bg-light-blue text-xs">
          {allBrgy.map((option) => (
            <SelectItem
              key={option.name}
              value={option.value}
              className="data-[highlighted]:bg-dark-blue/20 text-xs dark:data-[highlighted]:text-white"
            >
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedDate} onValueChange={onDateChange}>
        <SelectTrigger className="border-dark-blue/50 focus:border-dark-blue w-[130px] rounded-sm border text-xs shadow-none outline-none dark:border-gray-500/50 dark:bg-transparent">
          <SelectValue placeholder="Select date" />
        </SelectTrigger>
        <SelectContent className="dark:bg-light-black bg-light-blue text-xs">
          {dateOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="data-[highlighted]:bg-dark-blue/20 text-xs dark:data-[highlighted]:text-white"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

// ---------- FILTERING ROAD ADVISORY ------- //

type FilteringRoadProps = {
  selectedBrgy: string;
  onBrgyChange: (value: string) => void;
  selectedDate: string;
  onDateChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
};

export const FilteringRoad = ({
  selectedBrgy,
  onBrgyChange,
  selectedDate,
  onDateChange,
  selectedStatus,
  onStatusChange,
}: FilteringRoadProps) => {
  const allBrgy = [
    { name: "All", value: "default" },
    { name: "Municipality of LB", value: "Municipality of los baños" },
    { name: "Anos", value: "anos" },
    { name: "Bagong Silang", value: "bagong silang" },
    { name: "Bambang", value: "bambang" },
    { name: "Batong Malake", value: "batong malake" },
    { name: "Baybayin", value: "baybayin" },
    { name: "Bayog", value: "bayog" },
    { name: "Lalakay", value: "lalakay" },
    { name: "Maahas", value: "maahas" },
    { name: "Malinta", value: "malinta" },
    { name: "Mayondon", value: "mayondon" },
    { name: "Putho-Tuntungin", value: "putho-tuntungin" },
    { name: "San Antonio", value: "san antonio" },
    { name: "Tadlac", value: "tadlac" },
    { name: "Timugan", value: "timugan" },
  ];

  const allStatus = [
    { name: "All status", value: "all" },
    { name: "Open", value: "Open" },
    { name: "Partialy Open", value: "Partially Open" },
    { name: "Closed", value: "Closed" },
  ];

  const dateOptions = [
    { label: "All Dates", value: "all" },
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Past 7 Days", value: "past7" },
    { label: "Past 30 Days", value: "past30" },
  ];

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <FaFilter />
        <p className="text-sm">Filter By:</p>
      </div>

      <Select value={selectedBrgy} onValueChange={onBrgyChange}>
        <SelectTrigger className="border-dark-blue/50 focus:border-dark-blue w-[120px] rounded-sm border text-xs shadow-none outline-none dark:border-gray-500/50 dark:bg-transparent">
          <SelectValue placeholder="Select brgy" />
        </SelectTrigger>

        <SelectContent className="dark:bg-light-black bg-light-blue text-xs">
          {allBrgy.map((option) => (
            <SelectItem
              key={option.name}
              value={option.value}
              className="data-[highlighted]:bg-dark-blue/20 text-xs dark:data-[highlighted]:text-white"
            >
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedDate} onValueChange={onDateChange}>
        <SelectTrigger className="border-dark-blue/50 focus:border-dark-blue w-[115px] rounded-sm border text-xs shadow-none outline-none dark:border-gray-500/50 dark:bg-transparent">
          <SelectValue placeholder="Select date" />
        </SelectTrigger>
        <SelectContent className="dark:bg-light-black bg-light-blue text-xs">
          {dateOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="data-[highlighted]:bg-dark-blue/20 text-xs dark:data-[highlighted]:text-white"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="border-dark-blue/50 focus:border-dark-blue w-[115px] rounded-sm border text-xs shadow-none outline-none dark:border-gray-500/50 dark:bg-transparent">
          <SelectValue placeholder="Select date" />
        </SelectTrigger>
        <SelectContent className="dark:bg-light-black bg-light-blue text-xs">
          {allStatus.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="data-[highlighted]:bg-dark-blue/20 text-xs dark:data-[highlighted]:text-white"
            >
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

// ---------- FILTERING DISASTER UPDATES  ------- //

type FilterDisasterProps = {
  selectedBrgy: string;
  onBrgyChange: (value: string) => void;
  selectedDate: string;
  onDateChange: (value: string) => void;
  selectedDisasterType: string;
  onDisasterTypeChange: (value: string) => void;
};

export const FilteringDisaster = ({
  selectedDate,
  onDateChange,
  selectedDisasterType,
  onDisasterTypeChange,
  selectedBrgy,
  onBrgyChange,
}: FilterDisasterProps) => {
  const allBrgy = [
    { name: "All", value: "default" },
    { name: "Municipality of LB", value: "Municipality of los baños" },
    { name: "Anos", value: "anos" },
    { name: "Bagong Silang", value: "bagong silang" },
    { name: "Bambang", value: "bambang" },
    { name: "Batong Malake", value: "batong malake" },
    { name: "Baybayin", value: "baybayin" },
    { name: "Bayog", value: "bayog" },
    { name: "Lalakay", value: "lalakay" },
    { name: "Maahas", value: "maahas" },
    { name: "Malinta", value: "malinta" },
    { name: "Mayondon", value: "mayondon" },
    { name: "Putho-Tuntungin", value: "putho-tuntungin" },
    { name: "San Antonio", value: "san antonio" },
    { name: "Tadlac", value: "tadlac" },
    { name: "Timugan", value: "timugan" },
  ];

  const disasterTypes = [
    {
      name: "All Disaster type",
      value: "all",
    },
    {
      name: "Flood",
      value: "Flood",
    },
    {
      name: "Earthquake",
      value: "Earthquake",
    },
    {
      name: "Typhoon",
      value: "Typhoon",
    },
    {
      name: "Landslide",
      value: "Landslide",
    },
    {
      name: "Volcanic Eruption",
      value: "Volcanic Eruption",
    },
  ];

  const dateOptions = [
    { label: "All Dates", value: "all" },
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Past 7 Days", value: "past7" },
    { label: "Past 30 Days", value: "past30" },
  ];

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <FaFilter />
        <p className="text-sm">Filter By:</p>
      </div>

        <Select value={selectedBrgy} onValueChange={onBrgyChange}>
          <SelectTrigger className="border-dark-blue/50 focus:border-dark-blue w-[120px] rounded-sm border text-xs shadow-none outline-none dark:border-gray-500/50 dark:bg-transparent">
            <SelectValue placeholder="Select brgy" />
          </SelectTrigger>

          <SelectContent className="dark:bg-light-black bg-light-blue text-xs">
            {allBrgy.map((option) => (
              <SelectItem
                key={option.name}
                value={option.value}
                className="data-[highlighted]:bg-dark-blue/20 text-xs dark:data-[highlighted]:text-white"
              >
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      <Select value={selectedDate} onValueChange={onDateChange}>
        <SelectTrigger className="border-dark-blue/50 focus:border-dark-blue w-[115px] rounded-sm border text-xs shadow-none outline-none dark:border-gray-500/50 dark:bg-transparent">
          <SelectValue placeholder="Select date" />
        </SelectTrigger>
        <SelectContent className="dark:bg-light-black bg-light-blue text-xs">
          {dateOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="data-[highlighted]:bg-dark-blue/20 text-xs dark:data-[highlighted]:text-white"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedDisasterType} onValueChange={onDisasterTypeChange}>
        <SelectTrigger className="border-dark-blue/50 focus:border-dark-blue w-[115px] rounded-sm border text-xs shadow-none outline-none dark:border-gray-500/50 dark:bg-transparent">
          <SelectValue placeholder="Select date" />
        </SelectTrigger>
        <SelectContent className="dark:bg-light-black bg-light-blue text-xs">
          {disasterTypes.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="data-[highlighted]:bg-dark-blue/20 text-xs dark:data-[highlighted]:text-white"
            >
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
