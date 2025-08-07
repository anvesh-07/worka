import { prisma } from "@/utils/db";
import { EmptyState } from "./EmptyState";
import { PaginationComponent } from "./PaginationComponent";
import { JobCard } from "./JobCard";
import { JobPostStatus } from "@prisma/client";
import { requireUser } from "@/utils/requireUser";
import { getApplicantCountForJob, getJobsUserAppliedTo } from "@/app/actions";

async function getJobs(
  page: number = 1,
  pageSize: number = 10,
  jobTypes: string[] = [],
  location: string = ""
) {
  const skip = (page - 1) * pageSize;

  const where = {
    status: JobPostStatus.ACTIVE,
    ...(jobTypes.length > 0 && {
      employmentType: {
        in: jobTypes,
      },
    }),
    ...(location &&
      location !== "worldwide" && {
      location: location,
    }),
  };

  const [data, totalCount] = await Promise.all([
    prisma.jobPost.findMany({
      skip,
      take: pageSize,
      where,
      select: {
        jobTitle: true,
        id: true,
        salaryFrom: true,
        salaryTo: true,
        employmentType: true,
        location: true,
        createdAt: true,
        company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.jobPost.count({ where }),
  ]);

  return {
    jobs: data,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
  };
}

export default async function JobListings({
  currentPage,
  jobTypes,
  location,
}: {
  currentPage: number;
  jobTypes: string[];
  location: string;
}) {
  const {
    jobs,
    totalPages,
    currentPage: page,
  } = await getJobs(currentPage, 5, jobTypes, location);

  let user = null;
  let userType = null;
  try {
    user = await requireUser();
    // Fetch userType from DB
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { userType: true } });
    userType = dbUser?.userType;
  } catch {
    // Not logged in
  }

  let appliedJobIds: Set<string> = new Set();
  const applicantCounts: Record<string, number> = {};

  if (user && userType === "JOB_SEEKER") {
    // Get all jobs this user has applied to (batch)
    const applied = await getJobsUserAppliedTo(user.id || "");
    appliedJobIds = new Set(applied.map((a) => a.jobPost.id));
  } else if (user && userType === "COMPANY") {
    // For each job, get applicant count
    await Promise.all(
      jobs.map(async (job) => {
        applicantCounts[job.id] = await getApplicantCountForJob(job.id);
      })
    );
  }

  return (
    <>
      {jobs.length > 0 ? (
        <div className="flex flex-col gap-6">
          {jobs.map((job, index) => (
            <JobCard
              job={job}
              key={index}
              alreadyApplied={userType === "JOB_SEEKER" ? appliedJobIds.has(job.id) : undefined}
              applicantCount={userType === "COMPANY" ? applicantCounts[job.id] : undefined}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jobs found"
          description="Try searching for a different job title or location."
          buttonText="Clear all filters"
          href="/"
        />
      )}

      <div className="flex justify-center mt-6">
        <PaginationComponent totalPages={totalPages} currentPage={page} />
      </div>
    </>
  );
}
