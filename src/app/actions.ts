"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { companySchema, jobSchema, jobSeekerSchema } from "@/utils/zodSchemas";
import { requireUser } from "@/utils/requireUser";
import { prisma } from "@/utils/db";
import arcjet, { detectBot, shield } from "@/utils/arcjet";
import { request } from "@arcjet/next";
import { stripe } from "@/utils/stripe";
import { jobListingDurationPricing } from "@/utils/pricingTiers";
import { inngest } from "@/utils/inngest/client";

const aj = arcjet
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  );

export async function createCompany(data: z.infer<typeof companySchema>) {
  const user = await requireUser();

  // // Access the request object so Arcjet can analyze it
  const req = await request();
  // Call Arcjet protect
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  // Server-side validation
  const validatedData = companySchema.parse(data);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      onboardingCompleted: true,
      userType: "COMPANY",
      Company: {
        create: {
          name: validatedData.name,
          location: validatedData.location,
          about: validatedData.about,
          logo: validatedData.logo,
          website: validatedData.website,
          xAccount: validatedData.xAccount,
        },
      },
    },
  });

  return redirect("/");
}

export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>) {
  const user = await requireUser();

  // // Access the request object so Arcjet can analyze it
  const req = await request();
  // Call Arcjet protect
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validatedData = jobSeekerSchema.parse(data);
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      onboardingCompleted: true,
      userType: "JOB_SEEKER",
      JobSeeker: {
        create: {
          name: validatedData.name,
          about: validatedData.about,
          resume: validatedData.resume,
        },
      },
    },
  });

  return redirect("/");
}

export async function createJob(data: z.infer<typeof jobSchema>) {
  const user = await requireUser();

  const validatedData = jobSchema.parse(data);

  const company = await prisma.company.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });

  if (!company?.id) {
    return redirect("/");
  }

  let stripeCustomerId = company.user.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      name: user.name || undefined,
    });

    stripeCustomerId = customer.id;

    // Update user with Stripe customer ID
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    });
  }

  const jobPost = await prisma.jobPost.create({
    data: {
      companyId: company.id,
      jobDescription: validatedData.jobDescription,
      jobTitle: validatedData.jobTitle,
      employmentType: validatedData.employmentType,
      location: validatedData.location,
      salaryFrom: validatedData.salaryFrom,
      salaryTo: validatedData.salaryTo,
      listingDuration: validatedData.listingDuration,
      benefits: validatedData.benefits,
    },
  });

  // // Trigger the job expiration function
  await inngest.send({
    name: "job/created",
    data: {
      jobId: jobPost.id,
      expirationDays: validatedData.listingDuration,
    },
  });

  // // Get price from pricing tiers based on duration
  const pricingTier = jobListingDurationPricing.find(
    (tier) => tier.days === validatedData.listingDuration
  );

  if (!pricingTier) {
    throw new Error("Invalid listing duration selected");
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [
      {
        price_data: {
          product_data: {
            name: `Job Posting - ${pricingTier.days} Days`,
            description: pricingTier.description,
            images: [
              "https://pve1u6tfz1.ufs.sh/f/Ae8VfpRqE7c0gFltIEOxhiBIFftvV4DTM8a13LU5EyzGb2SQ",
            ],
          },
          currency: "INR",
          unit_amount: pricingTier.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      jobId: jobPost.id,
    },
    success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
  });

  return redirect(session.url as string);
}

export async function updateJobPost(
  data: z.infer<typeof jobSchema>,
  jobId: string
) {
  const user = await requireUser();

  const validatedData = jobSchema.parse(data);

  await prisma.jobPost.update({
    where: {
      id: jobId,
      company: {
        userId: user.id,
      },
    },
    data: {
      jobDescription: validatedData.jobDescription,
      jobTitle: validatedData.jobTitle,
      employmentType: validatedData.employmentType,
      location: validatedData.location,
      salaryFrom: validatedData.salaryFrom,
      salaryTo: validatedData.salaryTo,
      listingDuration: validatedData.listingDuration,
      benefits: validatedData.benefits,
    },
  });

  return redirect("/my-jobs");
}

export async function deleteJobPost(jobId: string) {
  const user = await requireUser();

  await prisma.jobPost.delete({
    where: {
      id: jobId,
      company: {
        userId: user.id,
      },
    },
  });

  await inngest.send({
    name: "job/cancel.expiration",
    data: { jobId: jobId },
  });

  return redirect("/my-jobs");
}

export async function saveJobPost(jobId: string) {
  const user = await requireUser();

  await prisma.savedJobPost.create({
    data: {
      jobId: jobId,
      userId: user.id as string,
    },
  });

  revalidatePath(`/job/${jobId}`);
}

export async function unsaveJobPost(savedJobPostId: string) {
  const user = await requireUser();

  const data = await prisma.savedJobPost.delete({
    where: {
      id: savedJobPostId,
      userId: user.id as string,
    },
    select: {
      jobId: true,
    },
  });

  revalidatePath(`/job/${data.jobId}`);
}

// Apply to a job (robust, type-safe)
export async function applyToJob({ jobId, coverLetter, resume }: { jobId: string; coverLetter?: string; resume?: string }) {
  const user = await requireUser();
  // Always fetch userType from DB for safety
  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { userType: true } });
  if (dbUser?.userType !== "JOB_SEEKER") {
    return { success: false, error: "Only job seekers can apply to jobs." };
  }
  // Prevent duplicate applications
  const existing = await prisma.jobApplication.findUnique({
    where: {
      jobPostId_jobSeekerId: {
        jobPostId: jobId,
        jobSeekerId: user.id!,
      },
    },
  });
  if (existing) {
    return { success: false, error: "You have already applied to this job." };
  }
  // Create application
  await prisma.jobApplication.create({
    data: {
      jobPostId: jobId,
      jobSeekerId: user.id!,
      coverLetter: coverLetter ?? "",
      resume: resume ?? "",
    },
  });
  // Increment applications count
  await prisma.jobPost.update({
    where: { id: jobId },
    data: { applications: { increment: 1 } },
  });
  return { success: true };
}

// Get all applicants for a job post (for company)
export async function getApplicantsForJob(jobId: string) {
  return prisma.jobApplication.findMany({
    where: { jobPostId: jobId },
    include: {
      jobSeeker: {
        select: {
          id: true,
          name: true,
          email: true,
          JobSeeker: { select: { resume: true, about: true } },
        },
      },
    },
  });
}

// Get applicant count for a job post
export async function getApplicantCountForJob(jobId: string) {
  return prisma.jobApplication.count({ where: { jobPostId: jobId } });
}

// Get all jobs a user has applied to (for jobseeker, future use)
export async function getJobsUserAppliedTo(userId: string) {
  return prisma.jobApplication.findMany({
    where: { jobSeekerId: userId },
    include: {
      jobPost: {
        select: {
          id: true,
          jobTitle: true,
          company: { select: { name: true, logo: true } },
          location: true,
          employmentType: true,
        },
      },
    },
  });
}
