import { notFound } from "next/navigation";

import { ProjectDetailScreen } from "@/components/site/public-screens";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    return await ProjectDetailScreen({ locale: "ko", slug });
  } catch {
    notFound();
  }
}
