"use client";

import { Card, CardHeader } from "../ui/card";
import { MapPin, Clock, DollarSign, Building2, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { useRouter } from "next/navigation";

interface iAppProps {
  job: {
    id: string;
    jobTitle: string;
    salaryFrom: number;
    salaryTo: number;
    employmentType: string;
    location: string;
    createdAt: Date;
    company: {
      logo: string | null;
      name: string;
      about: string;
      location: string;
    };
  };
  alreadyApplied?: boolean;
  applicantCount?: number;
  isJobOwner?: boolean;
}

export function JobCard({
  job,
  alreadyApplied,
  applicantCount,
  isJobOwner,
}: iAppProps) {
  const router = useRouter();
  console.log("isJobOwner", isJobOwner)

  const ApplicantCountBadge = () => (
    <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm border border-blue-100 animate-in slide-in-from-right-2 duration-300">
      <Users className="size-3" />
      <span>
        {applicantCount} {applicantCount === 1 ? "Application" : "Applications"}
      </span>
    </div>
  );

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking the applicant count link (for job owner)
    if (
      isJobOwner &&
      (e.target as HTMLElement).closest('[data-element="applicant-count"]')
    ) {
      return;
    }
    router.push(`/job/${job.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="block group cursor-pointer"
    >
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white via-white to-gray-50/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 backdrop-blur-sm">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Status badges */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-1 z-20 max-w-[200px]">
          {typeof applicantCount === "number" && applicantCount > 0 && (
            isJobOwner ? (
              <div
                onClick={() => router.push(`/my-jobs/${job.id}/applications`)}
                data-element="applicant-count"
                className="hover:scale-105 transition-transform"
              >
                <ApplicantCountBadge />
              </div>
            ) : (
              <ApplicantCountBadge />
            )
          )}

          {alreadyApplied && (
            <div className="flex items-center gap-1.5 bg-emerald-50/95 backdrop-blur-sm text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm border border-emerald-200 animate-in slide-in-from-right-2 duration-500">
              <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span>Applied</span>
            </div>
          )}
        </div>

        <CardHeader className="p-6">
          <div className="space-y-4">
            {/* Header section */}
            <div className="flex items-start gap-4">
              {/* Company logo */}
              <div className="relative group/logo">
                {job.company.logo ? (
                  <div className="relative size-14 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    <Image
                      src={job.company.logo || "/placeholder.svg"}
                      alt={job.company.name}
                      width={56}
                      height={56}
                      className="size-full object-cover group-hover/logo:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="size-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    <Building2 className="size-7 text-white" />
                  </div>
                )}
              </div>

              {/* Job info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 leading-tight">
                  {job.jobTitle}
                </h2>
                <p className="text-sm font-medium text-gray-600 mt-1 group-hover:text-gray-800 transition-colors duration-300">
                  {job.company.name}
                </p>
              </div>

              {/* Time and location */}
              <div className="hidden sm:flex flex-col items-end text-right space-y-1 mt-12 min-w-[120px]">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Clock className="size-3.5" />
                  <span className="text-xs font-medium">
                    {formatRelativeTime(job.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <MapPin className="size-3.5" />
                  <span className="text-sm font-medium truncate">
                    {job.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Badges and salary */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors duration-200 font-medium"
              >
                {job.employmentType}
              </Badge>

              <Badge
                variant="outline"
                className="border-gray-200 text-gray-600 hover:border-gray-300 transition-colors duration-200"
              >
                <MapPin className="size-3 mr-1" />
                {job.location}
              </Badge>

              <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                <DollarSign className="size-3.5" />
                <span>
                  {formatCurrency(job.salaryFrom)} -{" "}
                  {formatCurrency(job.salaryTo)}
                </span>
              </div>
            </div>

            {/* Mobile time and location */}
            <div className="sm:hidden flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                <span>{formatRelativeTime(job.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                <span>{job.location}</span>
              </div>
            </div>

            {/* Company description */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {job.company.about}
              </p>
            </div>
          </div>
        </CardHeader>

        {/* Hover effect border */}
        <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300 pointer-events-none" />
      </Card>
    </div>
  );
}
