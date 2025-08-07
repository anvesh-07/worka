/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Calendar, Rocket, Megaphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl } from "../ui/form";
import { ControllerRenderProps } from "react-hook-form";
import { jobListingDurationPricing } from "@/utils/pricingTiers";

interface JobListingDurationSelectorProps {
  field: ControllerRenderProps<any, "listingDuration">;
}

const getIcon = (days: number) => {
  switch (days) {
    case 30:
      return <Calendar className="w-6 h-6 text-blue-600" />;
    case 60:
      return <Rocket className="w-7 h-7 text-purple-600" />;
    case 90:
      return <Megaphone className="w-10 h-10 text-orange-600" />;
    default:
      return null;
  }
};

export function JobListingDurationSelector({
  field,
}: JobListingDurationSelectorProps) {
  return (
    <FormControl>
      <RadioGroup
        value={field.value?.toString()}
        onValueChange={(value) => field.onChange(parseInt(value))}
        className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        {jobListingDurationPricing.map((duration) => {
          const isSelected = field.value === duration.days;
          const isBestValue = duration.days === 60;

          return (
            <div key={duration.days} className="relative group">
              {isBestValue && (
                <div className="absolute top-2 right-2 z-10 text-xs font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500 px-2 py-1 rounded-full shadow">
                  🌟 Best Value
                </div>
              )}
              <RadioGroupItem
                value={duration.days.toString()}
                id={duration.days.toString()}
                className="peer sr-only"
              />
              <Label
                htmlFor={duration.days.toString()}
                className="block cursor-pointer"
              >
                <Card
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 ease-in-out shadow-sm group-hover:shadow-md transform group-hover:-translate-y-1
                    ${
                      isSelected
                        ? "border-primary ring-2 ring-primary bg-primary/10"
                        : "border-border bg-background hover:bg-accent"
                    }`}
                >
                  <div className="flex flex-col justify-between min-h-[130px] gap-4">
                    <div className="flex items-center gap-3">
                      {getIcon(duration.days)}
                      <div className="flex flex-col">
                        <p className="text-base font-semibold text-foreground">
                          {duration.days} Days
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {duration.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-foreground">
                        ₹{duration.price}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ₹{(duration.price / duration.days).toFixed(2)}/day
                      </p>
                    </div>
                  </div>
                </Card>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </FormControl>
  );
}
