/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "@/utils/db";
import { requireUser } from "@/utils/requireUser";
import { notFound, redirect } from "next/navigation";

import { EmptyState } from "@/components/general/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ApplicationCard } from "@/components/general/ApplicationCard";

async function getJobWithApplicants(jobId: string, userId: string) {
  const job = await prisma.jobPost.findUnique({
    where: { id: jobId },
    select: {
      jobTitle: true,
      company: {
        select: {
          userId: true,
        },
      },
      applications: {
        select: {
          id: true,
          jobId: true,
          userId: true,
          resume: true,
          coverLetter: true,
          expectedSalary: true,
          noticePeriod: true,
          relocation: true,
          skills: true,
          status: true,
          appliedAt: true,
          user: {
            select: {
              name: true,
              email: true,
              image: true,
              JobSeeker: { // --- Fetch JobSeeker bio
                select: {
                  about: true,
                },
              },
            },
          },
        },
        orderBy: {
          appliedAt: "desc",
        },
      },
    },
  });

  if (!job) {
    notFound();
  }

  // Security check: ensure the current user owns this job post
  if (job.company.userId !== userId) {
    redirect("/");
  }

  return job;
}

export default async function JobApplicantsPage({
  params,
}: {
  params: { jobId: string };
}) {
  const user = await requireUser();
  const job = await getJobWithApplicants(params.jobId, user.id as string);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/my-jobs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Applicants for {job.jobTitle}</h1>
          <p className="text-muted-foreground">
            {job.applications.length} total application(s)
          </p>
        </div>
      </div>

      {job.applications.length > 0 ? (
        <div className="grid gap-4">
          {job.applications.map((app) => (
            <ApplicationCard key={app.id} application={app as any} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Applications Yet"
          description="Check back later to see who has applied for your job posting."
          buttonText="Back to My Jobs"
          href="/my-jobs"
        />
      )}
    </div>
  );
}