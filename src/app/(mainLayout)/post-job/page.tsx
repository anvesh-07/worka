/* eslint-disable react/no-unescaped-entities */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import Image from "next/image";

import { redirect } from "next/navigation";
import { prisma } from "@/utils/db";
import { requireUser } from "@/utils/requireUser";
import { CreateJobForm } from "@/components/forms/CreateJobForm";

const companies = [
  { id: 0, name: "Google", logo: "/logos/google.svg" },
  { id: 1, name: "Microsoft", logo: "/logos/microsoft.svg" },
  { id: 2, name: "Amazon", logo: "/logos/amazon.svg" },
  { id: 3, name: "Apple", logo: "/logos/apple.svg" },
  { id: 4, name: "Netflix", logo: "/logos/netflix.svg" },
  { id: 5, name: "Meta", logo: "/logos/meta.svg" },
];

const testimonials = [
  {
    quote:
      "We hired a senior engineer within 24 hours. The talent pool is incredibly strong and well-matched.",
    author: "Aisha Patel",
    company: "CodeCraft Inc.",
  },
  {
    quote:
      "This platform streamlined our hiring process and helped us find remote-ready candidates effortlessly.",
    author: "David Kim",
    company: "RemoteNest",
  },
  {
    quote:
      "We've scaled our team twice as fast thanks to the quality and speed of this hiring platform.",
    author: "Priya Nair",
    company: "GrowthLoop",
  },
];

const stats = [
  { value: "50k+", label: "Verified job seekers each month" },
  { value: "24h", label: "Fastest average time to first hire" },
  { value: "98%", label: "Client satisfaction score" },
  { value: "1,000+", label: "Companies hiring globally" },
];

async function getCompany(userId: string) {
  const data = await prisma.company.findUnique({
    where: {
      userId: userId,
    },
    select: {
      name: true,
      location: true,
      about: true,
      logo: true,
      xAccount: true,
      website: true,
    },
  });

  if (!data) {
    return redirect("/");
  }
  return data;
}

const PostJobPage = async () => {
  const session = await requireUser();
  const data = await getCompany(session.id as string);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
      <CreateJobForm
        companyAbout={data.about}
        companyLocation={data.location}
        companyLogo={data.logo}
        companyName={data.name}
        companyXAccount={data.xAccount}
        companyWebsite={data.website}
      />

      <div className="col-span-1">
        <Card className="lg:sticky lg:top-4">
          <CardHeader>
            <CardTitle className="text-xl">
              Trusted by Industry Leaders
            </CardTitle>
            <CardDescription>
              Join thousands of companies hiring top talent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Logos */}
            <div className="grid grid-cols-3 gap-4">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-center"
                >
                  <Image
                    src={company.logo}
                    alt={company.name}
                    height={80}
                    width={80}
                    className="opacity-75 transition-opacity hover:opacity-100 rounded-lg"
                  />{" "}
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <blockquote
                  key={index}
                  className="border-l-2 border-primary pl-4"
                >
                  <p className="text-sm italic text-muted-foreground">
                    "{testimonial.quote}"
                  </p>
                  <footer className="mt-2 text-sm font-medium">
                    - {testimonial.author}, {testimonial.company}
                  </footer>
                </blockquote>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="rounded-lg bg-muted p-4">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostJobPage;
