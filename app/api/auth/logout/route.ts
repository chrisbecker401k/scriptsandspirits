import { NextResponse } from "next/server";
import { clearAdminSession, getBaseUrl } from "@/lib/auth";

export async function POST(request: Request) {
  await clearAdminSession();
  return NextResponse.redirect(`${getBaseUrl(request)}/admin/login`, { status: 303 });
}
