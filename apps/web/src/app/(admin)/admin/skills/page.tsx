import { AdminPageHeader } from "@/components/admin/page-header";
import { SkillsStudio } from "@/components/admin/skills-studio";
import { getAdminSkills } from "@/lib/api/server";
import { getCookieHeader, requireAdminSession } from "@/lib/admin-session";

export default async function AdminSkillsPage() {
  await requireAdminSession();
  const cookieHeader = await getCookieHeader();
  const skills = await getAdminSkills(cookieHeader);

  return (
    <>
      <AdminPageHeader
        eyebrow="기술 스택 편집"
        title="Backend, Data/Infra, AI 역량을 구조적으로 관리합니다."
        description="스킬도 단순 태그가 아니라 설명 가능한 역량 단위로 저장합니다. 그룹과 아이템이 분리되어 있어 공개 페이지에서 목적에 맞게 재조합할 수 있습니다."
      />
      <SkillsStudio initialGroups={skills} />
    </>
  );
}
