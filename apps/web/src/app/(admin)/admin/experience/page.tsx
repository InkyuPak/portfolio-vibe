import { AdminPageHeader } from "@/components/admin/page-header";
import { ExperienceStudio } from "@/components/admin/experience-studio";
import { getAdminExperience } from "@/lib/api/server";
import { getCookieHeader, requireAdminSession } from "@/lib/admin-session";

export default async function AdminExperiencePage() {
  await requireAdminSession();
  const cookieHeader = await getCookieHeader();
  const experiences = await getAdminExperience(cookieHeader);

  return (
    <>
      <AdminPageHeader
        eyebrow="경력 편집"
        title="회사, 역할, 성과를 공개용 서사 구조로 다듬습니다."
        description="채용 담당자는 기술 스택보다 문제 해결 구조를 먼저 읽습니다. 그래서 경력도 문제-역할-성과가 드러나도록 편집하는 흐름으로 구성했습니다."
      />
      <ExperienceStudio initialExperiences={experiences} />
    </>
  );
}
