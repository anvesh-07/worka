import { getApplicantsForJob } from "@/app/actions";
import { requireUser } from "@/utils/requireUser";
import { prisma } from "@/utils/db";
import Link from "next/link";

export default async function ApplicantsPage({ params }: { params: { jobId: string } }) {
  const user = await requireUser();
  // Check if user is the owner of the job post
  const job = await prisma.jobPost.findUnique({
    where: { id: params.jobId },
    select: { company: { select: { userId: true } }, jobTitle: true },
  });
  if (!job || job.company.userId !== user.id) {
    return <div className="p-8">You are not authorized to view applicants for this job.</div>;
  }
  const applicants = await getApplicantsForJob(params.jobId);
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Applicants for <span className="text-blue-600">{job.jobTitle}</span></h1>
      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <ul className="space-y-6">
          {applicants.map((app) => (
            <li key={app.id} className="border-b pb-4">
              <div><b>Name:</b> {app.jobSeeker.name}</div>
              <div><b>Email:</b> <a href={`mailto:${app.jobSeeker.email}`} className="underline">{app.jobSeeker.email}</a></div>
              <div><b>About:</b> {app.jobSeeker.JobSeeker?.about}</div>
              <div><b>Resume:</b> {app.jobSeeker.JobSeeker?.resume ? <a href={app.jobSeeker.JobSeeker.resume} target="_blank" rel="noopener noreferrer" className="underline">View Resume</a> : "N/A"}</div>
              <div><b>Cover Letter:</b> <div className="whitespace-pre-line bg-gray-50 p-2 rounded mt-1">{app.coverLetter || "-"}</div></div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8">
        <Link href="/my-jobs" className="text-blue-600 underline">Back to My Jobs</Link>
      </div>
    </div>
  );
}
