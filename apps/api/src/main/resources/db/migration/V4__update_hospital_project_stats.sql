-- Update hospital project outcome text (530건 → 200K+/820건, add outage story)
UPDATE project
SET outcome_ko = '5개 대학병원 온프레미스 환경에서 XML 수신 200K+ 건을 전건 처방조회·분류 처리하고, AI 솔루션 리포트 820건을 전송했습니다. 전 구간 운영 장애 0건 (26.03.20 기준). 운영 기간 중 연동 병원의 기간 전산시스템이 수 시간 동안 전면 장애를 겪은 사례가 있었으나, 폐쇄망 내 독립 구동 설계 덕분에 당사 솔루션은 영향 없이 정상 운영을 유지했습니다. 외부 시스템 장애가 내부 서비스로 전파되지 않도록 설계한 격리 구조가 실제 상황에서 검증된 사례입니다.',
    outcome_en = 'Processed 200K+ XML records across 5 university hospitals on on-premises closed networks — prescription lookup and classification completed for every record, 820 AI solution reports delivered. Zero incidents across the full pipeline (as of Mar 20, 2026). During operations, a hospital''s core systems experienced a multi-hour full outage; our solution maintained normal operation without interruption, validating the isolated closed-network architecture that prevents external failures from propagating into our service.',
    updated_at = now()
WHERE slug = 'hospital-integration-automation';

-- Update METRICS section payload for hospital project
UPDATE project_section
SET payload = '{
  "items":[
    {"label":"XML 수신·처리","value":"200K+","note":"전건 처방조회·분류 완료 (26.03.20 기준)"},
    {"label":"솔루션 리포트 전송","value":"820건","note":"AI 진단 리포트 전송 완료 (26.03.20 기준)"},
    {"label":"운영 장애","value":"0건","note":"전 구간 에러 0건 — 외부 전산 장애 시에도 독립 정상 운영 유지"},
    {"label":"연동 병원","value":"5개","note":"온프레미스 폐쇄망 환경 구축·안정화 완료"}
  ]
}',
    updated_at = now()
WHERE project_id = (SELECT id FROM project WHERE slug = 'hospital-integration-automation')
  AND section_type = 'METRICS';

-- Update experience highlights for hospital integration role (530건 → 200K+/820건)
UPDATE experience_item
SET highlights_ko = replace(
        highlights_ko,
        '2026년 1월 2일 기준 약 530건의 실제 운영 데이터를 처리하면서 운영 장애 0건 기록',
        'XML 200K+ 처리, AI 솔루션 리포트 820건 전송, 전 구간 운영 장애 0건 (26.03.20 기준)'
    ),
    highlights_en = replace(
        highlights_en,
        'Processed roughly 530 live production records with zero incidents as of January 2, 2026',
        'Processed 200K+ XML records, delivered 820 AI solution reports — zero incidents across the full pipeline (as of Mar 20, 2026)'
    ),
    updated_at = now()
WHERE company_name = '시너지에이아이'
  AND period_label_ko LIKE '2024.12%';

-- Update achievement summary
UPDATE achievement
SET summary_ko = 'XML 200K+ 처리, AI 솔루션 리포트 820건 전송 — 전 구간 장애 0건 (26.03.20 기준). 연동 병원 전산 장애 시에도 독립 정상 운영 유지.',
    summary_en = '200K+ XML records processed, 820 AI solution reports delivered — zero incidents across the full pipeline (as of Mar 20, 2026). Maintained operation independently during a hospital-wide outage.',
    updated_at = now()
WHERE title_ko = '운영 장애 최소화';
