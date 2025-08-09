"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { applicationSchema, companySchema, jobSchema, jobSeekerSchema } from "@/utils/zodSchemas";
import { requireUser } from "@/utils/requireUser";
import { prisma } from "@/utils/db";
import arcjet, { detectBot, shield } from "@/utils/arcjet";
import { request } from "@arcjet/next";
import { stripe } from "@/utils/stripe";
import { jobListingDurationPricing } from "@/utils/pricingTiers";
import { inngest } from "@/utils/inngest/client";
import { ApplicationStatus } from "@prisma/client";

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
      createdById: user.id as string,
      updatedById: user.id as string,
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

export async function updateJobPost(data: z.infer<typeof jobSchema>,
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
      updatedById: user.id as string,
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


export async function applyForJob(
  data: z.infer<typeof applicationSchema>
) {
  const user = await requireUser();

  const jobSeeker = await prisma.jobSeeker.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!jobSeeker) {
    throw new Error("User is not a job seeker.");
  }

  const skillsArray =
    data.skills
      ?.split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0) || [];

  const application = await prisma.application.create({
    data: {
      jobId: data.jobId,
      userId: user.id as string,
      resume: data.resume,
      coverLetter: data.coverLetter,
      expectedSalary: data.expectedSalary,
      noticePeriod: data.noticePeriod as any,
      relocation: data.relocation,
      skills: skillsArray,
    },
  });

  revalidatePath(`/job/${data.jobId}`);
  return application;
}


export async function updateApplicationStatus(
  applicationId: string,
  jobId: string,
  status: ApplicationStatus
) {
  const user = await requireUser();

  // First, verify the user owns the job post associated with the application
  const jobPost = await prisma.jobPost.findFirst({
    where: {
      id: jobId,
      company: {
        userId: user.id as string,
      },
    },
  });

  if (!jobPost) {
    throw new Error("Unauthorized or Job Post not found");
  }

  // If authorized, update the application status
  await prisma.application.update({
    where: {
      id: applicationId,
    },
    data: {
      status: status,
    },
  });

  revalidatePath(`/my-jobs/${jobId}/applications`);
}