import { redirect } from "next/navigation";
import { auth } from "@/auth";
import BottomNav from "@/components/layout/BottomNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      {/* Main content with bottom padding for nav */}
      <main className="flex-1 pb-[80px]">{children}</main>
      <BottomNav />
    </div>
  );
}
