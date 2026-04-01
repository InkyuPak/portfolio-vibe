ALTER TABLE project ADD COLUMN context_label VARCHAR(100);

UPDATE project SET context_label = '시너지에이아이'
WHERE slug IN ('hospital-integration-test-framework', 'hospital-integration-automation');

UPDATE project SET context_label = '클로버스튜디오'
WHERE slug IN ('crowd-analysis-vision-system', 'msa-observability-upgrade');

UPDATE project SET context_label = '팀 프로젝트 · 2인'
WHERE slug IN ('rfp-hunter', 'adsync-engine');
