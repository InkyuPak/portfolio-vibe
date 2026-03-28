-- 1. Fix experience highlights (V4 replace() didn't match — use direct SET)
UPDATE experience_item
SET highlights_ko = E'총 5개 병원 연동을 안정적으로 완료하고 병원별 상이한 XML 수신, 처방 조회, 리포트 전송 프로세스를 모두 반영\n수동 업로드 중심 XML 수집 시스템을 API, SFTP, FTP, SMB를 지원하는 구조로 리팩토링\nXML 200K+ 처리, AI 솔루션 리포트 820건 전송, 전 구간 운영 장애 0건 (26.03.20 기준)\n현장 적용이 필요한 2개 병원 과제까지 직접 대응하며 운영 범위를 확장',
    highlights_en = E'Completed five hospital integrations while reflecting each hospital''s XML intake, prescription lookup, and report-delivery flow\nRefactored a manual XML upload process into a system supporting API, SFTP, FTP, and SMB\nProcessed 200K+ XML records, delivered 820 AI solution reports — zero incidents across the full pipeline (as of Mar 20, 2026)\nExpanded operational scope by directly handling on-site rollout for two additional hospital deployments',
    updated_at = now()
WHERE company_name = '시너지에이아이(주)'
  AND period_label_ko LIKE '2024.12%';

-- 2. Update hospital project subtitle to include 200K+
UPDATE project
SET subtitle_ko = 'XML 200K+ 처리, AI 솔루션 리포트 820건 전송 — 전 구간 장애 0건',
    subtitle_en = '200K+ XML records processed, 820 AI reports delivered — zero incidents across the full pipeline',
    updated_at = now()
WHERE slug = 'hospital-integration-automation';

-- 3. Add company description to experience summary
UPDATE experience_item
SET summary_ko = 'AI 의료 솔루션 스타트업. 주요 병원 연동 프로젝트의 메인 백엔드로서 병원별 상이한 XML, 처방 조회, 리포트 전송 프로세스를 공통 구조로 정리하고 실제 운영 안정성을 책임졌습니다.',
    summary_en = 'AI medical solutions startup. As the main backend engineer on a hospital-integration program, I unified hospital-specific XML, prescription, and report-delivery flows into a reliable operating structure.',
    updated_at = now()
WHERE company_name = '시너지에이아이(주)'
  AND period_label_ko LIKE '2024.12%';

-- 4. Update achievement from 530건 to 200K+/820건
UPDATE achievement
SET title_ko = 'XML 200K+ 처리 · 리포트 820건 전송',
    title_en = '200K+ XML processed · 820 reports delivered',
    summary_ko = 'XML 200K+ 처리, AI 솔루션 리포트 820건 전송 — 전 구간 장애 0건 (26.03.20 기준). 연동 병원 전산 장애 시에도 독립 정상 운영 유지.',
    summary_en = '200K+ XML records processed, 820 AI solution reports delivered — zero incidents across the full pipeline (as of Mar 20, 2026). Maintained operation independently during a hospital-wide outage.',
    updated_at = now()
WHERE title_ko = '실운영 데이터 처리';
