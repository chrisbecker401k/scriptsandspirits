import { AdminPortal } from "./AdminPortal";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getSiteContent } from "@/lib/siteData";

export const metadata = {
  title: "Admin | Scripts & Spirits",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const content = await getSiteContent();

  return <AdminPortal adminEmail={session.email} initialContent={content} />;
}
