"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ApplicationForm from "@/components/forms/ApplicationForm";

interface ApplyDialogProps {
  jobId: string;
  jobTitle: string;
  userResume: string;
}

export function ApplyDialog({
  jobId,
  jobTitle,
  userResume,
}: ApplyDialogProps) {
  const [open, setOpen] = useState(false);

  const handleApplicationSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Apply now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
        </DialogHeader>
        <ApplicationForm
          jobId={jobId}
          userResume={userResume}
          onApplicationSuccess={handleApplicationSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
