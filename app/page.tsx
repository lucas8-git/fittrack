import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function RootPage() {
  const session = await auth();
  // Redirect authenticated users to dashboard, others to login
  if (session?.user) redirect("/dashboard");
  redirect("/login");
}
