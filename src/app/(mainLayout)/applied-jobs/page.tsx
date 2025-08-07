import { getJobsUserAppliedTo } from "@/app/actions";
import { requireUser } from "@/utils/requireUser";
import Link from "next/link";

export default async function AppliedJobsPage() {
  const user = await requireUser();
  // Only allow jobseekers
  const dbUser = await import("@/utils/db").then(m => m.prisma.user.findUnique({ where: { id: user.id }, select: { userType: true } }));
  if (dbUser?.userType !== "JOB_SEEKER") {
    return <div className="p-8">Only jobseekers can view this page.</div>;
  }
  const applications = await getJobsUserAppliedTo(user?.id || "");
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Jobs You&apos;ve Applied To</h1>
      {applications.length === 0 ? (
        <p>You haven&apos;t applied to any jobs yet.</p>
      ) : (
        <ul className="space-y-6">
          {applications.map((app) => (
            <li key={app.id} className="border-b pb-4">
              <div className="font-semibold text-lg">
                <Link href={`/job/${app.jobPost.id}`} className="text-blue-600 underline">
                  {app.jobPost.jobTitle}
                </Link>
              </div>
              <div><b>Company:</b> {app.jobPost.company?.name}</div>
              <div><b>Location:</b> {app.jobPost.location}</div>
              <div><b>Employment Type:</b> {app.jobPost.employmentType}</div>
              <div><b>Applied On:</b> {new Date(app.createdAt).toLocaleDateString("en-US")}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
