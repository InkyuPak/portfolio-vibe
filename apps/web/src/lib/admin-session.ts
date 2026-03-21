import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/api/server";

export async function getCookieHeader() {
  return (await headers()).get("cookie") ?? "";
}

export async function requireAdminSession() {
  const cookieHeader = await getCookieHeader();

  try {
    return await getAdminSession(cookieHeader);
  } catch {
    redirect("/admin/login");
  }
}
