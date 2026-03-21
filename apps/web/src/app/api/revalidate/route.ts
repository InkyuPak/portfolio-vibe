import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as {
    secret?: string;
  };

  if (body.secret !== process.env.NEXT_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  [
    "/",
    "/projects",
    "/experience",
    "/contact",
    "/en",
    "/en/projects",
    "/en/experience",
    "/en/contact",
  ].forEach((path) => revalidatePath(path));

  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
