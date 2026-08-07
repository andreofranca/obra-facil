import { ReactNode } from "react";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ApplicationShell from "@/components/layout/ApplicationShell";

export default async function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <ApplicationShell user={session}>
      {children}
    </ApplicationShell>
  );
}
