import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { SignInView } from "@/modules/auth/ui/views/sign-in-view";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!!session) {
    redirect("/");
  }
  return <SignInView />;
};

export default Page;
