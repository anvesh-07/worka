// import { signIn } from "@/app/utils/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import * as React from "react";
import { GeneralSubmitButton } from "../general/SubmitButtons";
import { Github } from "../icons/Github";
import { Google } from "../icons/Google";
import { auth, signIn } from "@/utils/auth";
import { redirect } from "next/navigation";



export async function LoginForm() {
  const session = await auth()
  if (session?.user) {
    return redirect("/");
  }
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <form
                action={async () => {
                  "use server";
                  await signIn("github", {
                    redirectTo: "/onboarding",
                  });
                }}
              >
                <GeneralSubmitButton
                  text="Login with GitHub"
                  icon={<Github />}
                  variant="outline"
                  width="w-full"
                />
              </form>
              <form
                action={async () => {
                  "use server";
                  await signIn("google", {
                    redirectTo: "/onboarding",
                  });
                }}
              >
                <GeneralSubmitButton
                  text="Login with Google"
                  icon={<Google />}
                  variant="outline"
                  width="w-full"
                />
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
