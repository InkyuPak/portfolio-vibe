-- Add FastAPI inference model serving to hospital project role and architecture
UPDATE project
SET role_ko         = '메인 백엔드 담당자로 데이터 수집 리팩토링, 다중 프로토콜 연동, 병원별 환경 설정 구조화, EMR 송수신 체계 구축, 현장 적용 대응까지 맡았습니다. 연구팀이 개발한 추론 모델을 실제 서비스에 연결하기 위한 FastAPI 서버도 직접 구축했습니다.',
    role_en         = 'Owned the backend core: data-collection refactoring, multi-protocol integration, hospital-specific configuration, EMR exchange, and on-site rollout support. Also built the FastAPI server to serve the research team''s inference model in production.',
    architecture_ko = '수동 업로드 중심 XML 수집 시스템을 API, SFTP, FTP, SMB를 지원하는 구조로 전환하고, 병원별 데이터 수신과 저장 규칙을 환경 설정으로 분리했습니다. EMR 기반 환자 정보와 진단 리포트 송수신 체계를 구축해 운영 단계까지 이어지는 흐름을 하나의 서비스 구조 안에서 관리할 수 있게 만들었습니다. 연구팀이 학습시킨 추론 모델은 FastAPI로 서빙 서버를 구성해 Spring Boot 백엔드와 연동했습니다.',
    architecture_en = 'Rebuilt a manual XML upload process into a system supporting API, SFTP, FTP, and SMB, separated ingest and storage rules by hospital configuration, and standardized patient/report exchange with EMR systems. The research team''s trained inference model was served via a FastAPI server, integrated with the Spring Boot backend.',
    updated_at      = now()
WHERE slug = 'hospital-integration-automation';

-- Update experience_item stack_summary to include FastAPI
UPDATE experience_item
SET stack_summary = 'Spring Boot, FastAPI, Python, Kafka, Docker Compose, XML, API, SFTP, FTP, SMB, EMR',
    updated_at    = now()
WHERE company_name = '시너지에이아이'
  AND period_label_ko LIKE '2024.12%';
