import { DashboardWorkspace } from "@/components/admin/dashboard-workspace";
import { AdminPageHeader } from "@/components/admin/page-header";
import {
  getAdminAchievements,
  getAdminContactMessages,
  getAdminMedia,
  getAdminResumes,
  getAdminSiteSettings,
} from "@/lib/api/server";
import { getCookieHeader, requireAdminSession } from "@/lib/admin-session";

export default async function AdminDashboardPage() {
  await requireAdminSession();
  const cookieHeader = await getCookieHeader();
  const [settings, achievements, resumes, media, messages] = await Promise.all([
    getAdminSiteSettings(cookieHeader),
    getAdminAchievements(cookieHeader),
    getAdminResumes(cookieHeader),
    getAdminMedia(cookieHeader),
    getAdminContactMessages(cookieHeader),
  ]);

  return (
    <>
      <AdminPageHeader
        eyebrow="운영 개요"
        title="포트폴리오 콘텐츠와 운영 자산을 한 화면에서 관리합니다."
        description="사이트 설정, 성과 카드, 이력서 다운로드, 미디어 라이브러리, 문의 메시지까지 같은 백엔드 계약 위에서 편집할 수 있습니다."
      />
      <DashboardWorkspace
        initialSettings={settings}
        initialAchievements={achievements}
        initialResumes={resumes}
        initialMedia={media}
        initialMessages={messages}
      />
    </>
  );
}
