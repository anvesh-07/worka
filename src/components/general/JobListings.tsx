import { prisma } from "@/utils/db";
import { EmptyState } from "./EmptyState";
import { PaginationComponent } from "./PaginationComponent";
import { JobCard } from "./JobCard";
import { JobPostStatus } from "@prisma/client";
import { auth } from "@/utils/auth";


async function getJobs(
  page: number = 1,
  pageSize: number = 10,
  jobTypes: string[] = [],
  location: string = "",
  userId?: string
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

  const [jobData, totalCount, applications] = await Promise.all([
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
        // --- CHANGE START: Include a count of related applications ---
        _count: {
          select: { applications: true },
        },
        // --- CHANGE END ---
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.jobPost.count({ where }),
    userId
      ? prisma.application.findMany({
        where: {
          userId,
        },
        select: {
          jobId: true,
        },
      })
      : Promise.resolve([]),
  ]);

  const appliedJobIds = new Set(applications.map((app: any) => app.jobId));

  // --- CHANGE START: Process the job data to add applicantCount ---
  const jobs = jobData.map(({ _count, ...job }) => ({
    ...job,
    applicantCount: _count.applications,
  }));
  // --- CHANGE END ---


  return {
    jobs, // Return the processed jobs with the applicant count
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
    appliedJobIds,
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
  const session = await auth();
  const {
    jobs, // This `jobs` array now contains objects with `applicantCount`
    totalPages,
    currentPage: page,
    appliedJobIds,
  } = await getJobs(currentPage, 5, jobTypes, location, session?.user?.id);

  return (
    <>
      {jobs.length > 0 ? (
        <div className="flex flex-col gap-6">
          {/* --- CHANGE START: Pass applicantCount to JobCard --- */}
          {jobs.map((job: any, index) => (
            <JobCard
              job={job}
              key={index}
              alreadyApplied={appliedJobIds.has(job.id)}
              applicantCount={job.applicantCount}
              isJobOwner={session?.user?.id === job.company.userId}
            />
          ))}
          {/* --- CHANGE END --- */}
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