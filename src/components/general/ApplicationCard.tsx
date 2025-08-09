"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  DollarSign,
  Briefcase,
  ExternalLink,
  Calendar,
  Sparkles,
  MapPin,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ApplicationStatus } from "@prisma/client";
import { useState } from "react";
import { updateApplicationStatus } from "@/app/actions";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

// Helper to format the status enum
const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function ApplicationCard({ application }: { application: any }) {
  const {
    user,
    skills,
    expectedSalary,
    noticePeriod,
    relocation,
    resume,
    coverLetter,
    status,
    appliedAt,
    id,
    jobId,
  } = application;

  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    try {
      await updateApplicationStatus(id, jobId, newStatus);
      setCurrentStatus(newStatus);
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg">{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
          <p className="text-xs text-muted-foreground mt-1">
            Applied on: {new Date(appliedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Status and Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={resume} target="_blank" rel="noopener noreferrer">
                View Resume
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={currentStatus}
              onValueChange={(value) =>
                handleStatusChange(value as ApplicationStatus)
              }
            >
              {Object.values(ApplicationStatus).map((s) => (
                <DropdownMenuRadioItem key={s} value={s}>
                  {formatStatus(s)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Bio and Cover Letter */}
        <p className="text-sm text-muted-foreground italic">
          {user.JobSeeker?.about}
        </p>
        {coverLetter && (
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="link" className="p-0 h-auto">
                Show Cover Letter
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 text-sm p-4 bg-muted/50 rounded-md whitespace-pre-wrap">
              {coverLetter}
            </CollapsibleContent>
          </Collapsible>
        )}
        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/50 px-6 py-3 flex justify-between items-center text-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{formatCurrency(expectedSalary)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{noticePeriod.replace(/_/g, " ")}</span>
          </div>
          {relocation && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Relocation OK</span>
            </div>
          )}
        </div>
        <Badge>{formatStatus(currentStatus)}</Badge>
      </CardFooter>
    </Card>
  );
}