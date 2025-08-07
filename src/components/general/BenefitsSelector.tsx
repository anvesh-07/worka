"use client";

import { useMemo, useState } from "react";
import { benefits } from "@/utils/listOfBenefits";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BenefitsSelectorProps {
  field: {
    value: string[];
    onChange: (value: string[]) => void;
  };
}

type FilterOption = "all" | "selected" | "unselected";

export default function BenefitsSelector({ field }: BenefitsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterOption>("all");

  const toggleBenefit = (id: string) => {
    const selected = field.value || [];
    field.onChange(
      selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id]
    );
  };

  const filtered = useMemo(() => {
    return benefits.filter((b) => {
      const labelMatch = b.label
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const isSelected = (field.value || []).includes(b.id);

      if (filter === "selected" && !isSelected) return false;
      if (filter === "unselected" && isSelected) return false;

      return labelMatch;
    });
  }, [searchTerm, filter, field.value]);

  const selected = field.value || [];

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search benefits..."
          className="w-full md:w-1/2"
        />
        <div className="flex gap-2 flex-wrap">
          {(["all", "selected", "unselected"] as FilterOption[]).map((f) => (
            <Button
              key={f}
              type="button"
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Selected Benefits */}
      {selected.length > 0 && (
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">
            Selected ({selected.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {selected.map((id) => {
              const benefit = benefits.find((b) => b.id === id);
              if (!benefit) return null;

              return (
                <Badge
                  key={id}
                  variant="default"
                  className="cursor-pointer text-sm px-3 py-1.5 rounded-full"
                  onClick={() => toggleBenefit(id)}
                >
                  <span className="flex items-center gap-2">
                    {benefit.icon}
                    {benefit.label}
                  </span>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Benefits Grid */}
      <div className="flex flex-wrap gap-3">
        {filtered.map((benefit) => {
          const isSelected = selected.includes(benefit.id);
          return (
            <Badge
              key={benefit.id}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all hover:scale-105 active:scale-95 select-none text-sm px-4 py-1.5 rounded-full",
                isSelected && "ring-2 ring-primary ring-offset-2"
              )}
              onClick={() => toggleBenefit(benefit.id)}
            >
              <span className="flex items-center gap-2">
                {benefit.icon}
                {benefit.label}
              </span>
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
