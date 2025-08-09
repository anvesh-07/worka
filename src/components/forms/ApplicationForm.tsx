"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { applyForJob } from "@/app/actions";
import { UploadDropzone } from "@/components/general/UploadThingReExport";
import { GeneralSubmitButton } from "../general/SubmitButtons";
import { applicationSchema } from "@/utils/zodSchemas";

export default function ApplicationForm({
  jobId,
  userResume,
  onApplicationSuccess, // Prop to close the dialog
}: {
  jobId: string;
  userResume: string;
  onApplicationSuccess: () => void; // Define the prop type
}) {
  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      resume: userResume || "",
      coverLetter: "",
      jobId: jobId,
      expectedSalary: 0,
      noticePeriod: "",
      relocation: false,
      skills: "",
    },
  });

  async function onSubmit(values: z.infer<typeof applicationSchema>) {
    try {
      await applyForJob(values);
      toast.success("Application submitted successfully!");
      onApplicationSuccess(); // Call the function to close the dialog
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <Form {...form}>
      {/* Added padding and overflow for better scrolling on small screens */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 py-4 overflow-y-auto max-h-[70vh] pr-2"
      >
        {/* Resume and Cover Letter Section */}
        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume (PDF)</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    <div className="relative w-fit">
                      <Image
                        src={"/pdf.png"}
                        alt="PDF Icon"
                        width={100}
                        height={100}
                        className="rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 "
                        onClick={() => field.onChange("")}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <UploadDropzone
                      endpoint="resumeUploader"
                      onClientUploadComplete={(res) => {
                        if (res && res[0]) {
                          field.onChange(res[0].url);
                          toast.success("Resume uploaded successfully!");
                        }
                      }}
                      onUploadError={() => {
                        toast.error("Something went wrong. Please try again.");
                      }}
                      className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border-primary"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us why you're a great fit for this role..."
                  className="resize-none min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Responsive grid for salary and notice period */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="expectedSalary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Salary (Annual)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 1200000"
                    {...field}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      field.onChange(isNaN(value) ? 0 : value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="noticePeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notice Period</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your notice period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="IMMEDIATE">Immediate</SelectItem>
                    <SelectItem value="FIFTEEN_DAYS">15 Days</SelectItem>
                    <SelectItem value="ONE_MONTH">1 Month</SelectItem>
                    <SelectItem value="TWO_MONTHS">2 Months</SelectItem>
                    <SelectItem value="MORE_THAN_TWO_MONTHS">
                      More than 2 Months
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Skills and Relocation Section */}
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills (optional, comma-separated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., React, Node.js, TypeScript"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="relocation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Willing to Relocate</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <GeneralSubmitButton text="Submit Application" />
      </form>
    </Form>
  );
}
