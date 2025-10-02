"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface SortOption<T> {
  field: T;
  label: string;
}

export interface SortConfig<T> {
  field: T;
  direction: "asc" | "desc";
}

interface SortDropdownProps<T> {
  sortConfig: SortConfig<T>;
  onSort: (field: T) => void;
  options: SortOption<T>[];
  className?: string;
}

export function SortDropdown<T>({
  sortConfig,
  onSort,
  options,
  className = "",
}: SortDropdownProps<T>) {
  const getFieldLabel = (field: T): string => {
    const option = options.find((opt) => opt.field === field);
    return option?.label || String(field);
  };

  const getDirectionLabel = (direction: "asc" | "desc"): string => {
    return direction === "asc" ? "A-Z" : "Z-A";
  };

  const getDirectionIcon = (direction: "asc" | "desc"): string => {
    return direction === "asc" ? "↑" : "↓";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={`gap-2 ${className}`}>
          Sort: {getFieldLabel(sortConfig.field)} ({getDirectionLabel(sortConfig.direction)})
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64">
        <div className="space-y-2">
          <h4 className="font-medium">Sort by</h4>
          <div className="space-y-1">
            {options.map((option) => (
              <button
                key={option.field as string}
                onClick={() => onSort(option.field)}
                className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 ${
                  sortConfig.field === option.field ? "bg-blue-50 text-blue-600" : ""
                }`}
              >
                {option.label}{" "}
                {sortConfig.field === option.field && getDirectionIcon(sortConfig.direction)}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
