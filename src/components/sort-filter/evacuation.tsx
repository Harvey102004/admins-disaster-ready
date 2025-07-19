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
        <SelectTrigger className="border-dark-blue/50 focus:border-dark-blue w-[170px] rounded-sm border text-xs shadow-none outline-none dark:border-gray-500/50 dark:bg-transparent">
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

// ----------- FILTERING EVACUATION CENTER ----------- //

type FilteringEvacuationProps = {
  selectedBrgy: string;
  selectedStatus: string;
  onBrgyChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export const FilteringEvacuation = ({
  selectedStatus,
  onStatusChange,
}: FilteringEvacuationProps) => {
  const allBrgy = [
    { name: "All Brgy", value: "all" },
    { name: "Anos", value: "anos" },
    { name: "Bagong Silang", value: "bagong-silang" },
    { name: "Bambang", value: "bambang" },
    { name: "Batong Malake", value: "batong-malake" },
    { name: "Baybayin", value: "baybayin" },
    { name: "Bayog", value: "bayog" },
    { name: "Lalakay", value: "lalakay" },
    { name: "Maahas", value: "maahas" },
    { name: "Malinta", value: "malinta" },
    { name: "Mayondon", value: "mayondon" },
    { name: "Putho-Tuntungin", value: "putho-tuntungin" },
    { name: "San Antonio", value: "san-antonio" },
    { name: "Tadlac", value: "tadlac" },
    { name: "Timugan", value: "timugan" },
  ];

  const allStatus = [
    { name: "All status", value: "all" },
    { name: "Plenty of space", value: "plenty" },
    { name: "Almost full", value: "almostFull" },
    { name: "Full", value: "full" },
  ];

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <FaFilter />
        <p className="text-sm">Filter By:</p>
      </div>

      <Select>
        <SelectTrigger className="border-dark-blue/50 focus:border-dark-blue w-[170px] rounded-sm border text-xs shadow-none outline-none dark:border-gray-500/50 dark:bg-transparent">
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

      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="border-dark-blue/50 focus:border-dark-blue w-[170px] rounded-sm border text-xs shadow-none outline-none dark:border-gray-500/50 dark:bg-transparent">
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
