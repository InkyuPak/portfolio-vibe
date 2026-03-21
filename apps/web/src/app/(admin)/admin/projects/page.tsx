import { AdminPageHeader } from "@/components/admin/page-header";
import { ProjectStudio } from "@/components/admin/project-studio";
import { getAdminProjects } from "@/lib/api/server";
import { getCookieHeader, requireAdminSession } from "@/lib/admin-session";

export default async function AdminProjectsPage() {
  await requireAdminSession();
  const cookieHeader = await getCookieHeader();
  const projects = await getAdminProjects(cookieHeader);

  return (
    <>
      <AdminPageHeader
        eyebrow="프로젝트 편집"
        title="대표 프로젝트와 케이스 스터디 섹션을 직접 관리합니다."
        description="문제 정의, 역할, 아키텍처, 성과, 섹션 블록을 모두 구조화해서 저장합니다. 설계 의도 자체가 이 페이지의 핵심입니다."
      />
      <ProjectStudio initialProjects={projects} />
    </>
  );
}
