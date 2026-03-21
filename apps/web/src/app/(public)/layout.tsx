import type { ReactNode } from "react";

import { PublicChrome } from "@/components/site/public-chrome";

export const dynamic = "force-dynamic";

export default function PublicLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <PublicChrome>{children}</PublicChrome>;
}
