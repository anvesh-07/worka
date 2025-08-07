"use client";
import { useState } from "react";
import { GeneralSubmitButton } from "@/components/general/SubmitButtons";
import { applyToJob } from "@/app/actions";

export function ApplyNowForm({ jobId, alreadyApplied }: { jobId: string; alreadyApplied?: boolean }) {
  const [status, setStatus] = useState<null | { success: boolean; error?: string }>(null);

  if (alreadyApplied) {
    return <div className="text-green-600 font-semibold">Applied</div>;
  }

  async function action(formData: FormData) {
    const coverLetter = formData.get("coverLetter") as string;
    const res = await applyToJob({ jobId, coverLetter });
    setStatus(res);
  }

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="jobId" value={jobId} />
      <label className="block text-sm font-medium">Cover Letter (optional)</label>
      <textarea name="coverLetter" className="w-full border rounded p-2" rows={4} />
      <GeneralSubmitButton text="Apply now" />
      {status && (
        <div className={status.success ? "text-green-600" : "text-red-600"}>
          {status.success ? "Application submitted!" : status.error}
        </div>
      )}
    </form>
  );
}