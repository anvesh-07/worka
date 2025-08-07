/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { Control, useController } from "react-hook-form";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/utils/formatCurrency";

interface SalaryRangeSelectorProps {
  control: Control<any>;
  minSalary?: number;
  maxSalary?: number;
  step?: number;
  currency?: string;
}

export function SalaryRangeSelector({
  control,
  minSalary = 30000,
  maxSalary = 200000,
  step = 1000,
}: SalaryRangeSelectorProps) {
  const { field: fromField } = useController({
    name: "salaryFrom",
    control,
  });

  const { field: toField } = useController({
    name: "salaryTo",
    control,
  });

  const [range, setRange] = useState<[number, number]>([
    fromField.value || minSalary,
    toField.value || maxSalary / 2,
  ]);

  const handleRangeChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setRange(newRange);
    fromField.onChange(newRange[0]);
    toField.onChange(newRange[1]);
  };

  useEffect(() => {
    setRange([fromField.value || minSalary, toField.value || maxSalary / 2]);
  }, [fromField.value, toField.value, minSalary, maxSalary]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-muted-foreground">
          Expected Salary Range
        </label>
        <div className="flex items-center justify-between text-sm font-semibold text-primary">
          <span>{formatCurrency(range[0])}</span>
          <span className="text-muted">to</span>
          <span>{formatCurrency(range[1])}</span>
        </div>
      </div>

      <Slider
        min={minSalary}
        max={maxSalary}
        step={step}
        value={range}
        onValueChange={handleRangeChange}
        className="py-3"
        aria-label="Salary range"
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatCurrency(minSalary)}</span>
        <span>{formatCurrency(maxSalary)}</span>
      </div>
    </div>
  );
}
