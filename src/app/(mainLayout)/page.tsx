import JobListingsLoading from "@/components/general/JobListingsLoading";
import { JobFilters } from "@/components/general/JobFilters";
import JobListings from "@/components/general/JobListings";
import { Suspense } from "react";

type SearchParamsProps = {
  searchParams: Promise<{
    page?: string;
    jobTypes?: string;
    location?: string;
  }>;
};

export default async function Home({ searchParams }: SearchParamsProps) {
  const params = await searchParams;

  // Ensure currentPage is always a valid positive number
  const pageParam = Number(params.page);
  const currentPage = pageParam > 0 ? pageParam : 1;

  const jobTypes = params.jobTypes?.split(",").filter(Boolean) || [];
  const location = params.location || "";

  // Create a composite key from all filter parameters
  const filterKey = `page=${currentPage};types=${jobTypes.join(
    ","
  )};location=${location}`;

  return (
    <div className="grid grid-cols-3 gap-8">
      <JobFilters />
      <div className="col-span-2 flex flex-col gap-6">
        <Suspense key={filterKey} fallback={<JobListingsLoading />}>
          <JobListings
            currentPage={currentPage}
            jobTypes={jobTypes}
            location={location}
          />
        </Suspense>
      </div>
    </div>
  );
}
