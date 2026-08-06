import { NextResponse } from "next/server";
import { getBaseUrl, setAdminSession } from "@/lib/auth";
import { verifyAdminLogin } from "@/lib/adminGateway";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const baseUrl = getBaseUrl(request);

  if (!username || !password) {
    return NextResponse.redirect(`${baseUrl}/admin/login?error=missing`, { status: 303 });
  }

  let admin = null;

  try {
    admin = await verifyAdminLogin(username, password);
  } catch {
    return NextResponse.redirect(`${baseUrl}/admin/login?error=backend`, { status: 303 });
  }

  if (!admin) {
    return NextResponse.redirect(`${baseUrl}/admin/login?error=invalid`, { status: 303 });
  }

  await setAdminSession({
    email: admin.email,
    name: admin.name,
    provider: "password",
  });

  return NextResponse.redirect(`${baseUrl}/admin`, { status: 303 });
}
