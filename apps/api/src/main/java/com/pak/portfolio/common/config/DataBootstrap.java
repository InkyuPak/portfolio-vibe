package com.pak.portfolio.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pak.portfolio.auth.domain.AdminUser;
import com.pak.portfolio.auth.repository.AdminUserRepository;
import com.pak.portfolio.common.domain.LocalizedText;
import com.pak.portfolio.experience.domain.ExperienceItem;
import com.pak.portfolio.experience.repository.ExperienceItemRepository;
import com.pak.portfolio.project.domain.Project;
import com.pak.portfolio.project.domain.ProjectSection;
import com.pak.portfolio.project.domain.ProjectSectionType;
import com.pak.portfolio.project.repository.ProjectRepository;
import com.pak.portfolio.site.domain.Achievement;
import com.pak.portfolio.site.domain.Award;
import com.pak.portfolio.site.domain.Education;
import com.pak.portfolio.site.domain.ResumeAsset;
import com.pak.portfolio.site.domain.SiteSettings;
import com.pak.portfolio.site.repository.AchievementRepository;
import com.pak.portfolio.site.repository.AwardRepository;
import com.pak.portfolio.site.repository.EducationRepository;
import com.pak.portfolio.site.repository.ResumeAssetRepository;
import com.pak.portfolio.site.repository.SiteSettingsRepository;
import com.pak.portfolio.skill.domain.SkillGroup;
import com.pak.portfolio.skill.domain.SkillItem;
import com.pak.portfolio.skill.repository.SkillGroupRepository;
import java.util.List;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataBootstrap implements ApplicationRunner {

    private final PortfolioProperties properties;
    private final PasswordEncoder passwordEncoder;
    private final AdminUserRepository adminUserRepository;
    private final SiteSettingsRepository siteSettingsRepository;
    private final AchievementRepository achievementRepository;
    private final ResumeAssetRepository resumeAssetRepository;
    private final SkillGroupRepository skillGroupRepository;
    private final ExperienceItemRepository experienceItemRepository;
    private final ProjectRepository projectRepository;
    private final ObjectMapper objectMapper;
    private final EducationRepository educationRepository;
    private final AwardRepository awardRepository;

    public DataBootstrap(
            PortfolioProperties properties,
            PasswordEncoder passwordEncoder,
            AdminUserRepository adminUserRepository,
            SiteSettingsRepository siteSettingsRepository,
            AchievementRepository achievementRepository,
            ResumeAssetRepository resumeAssetRepository,
            SkillGroupRepository skillGroupRepository,
            ExperienceItemRepository experienceItemRepository,
            ProjectRepository projectRepository,
            ObjectMapper objectMapper,
            EducationRepository educationRepository,
            AwardRepository awardRepository) {
        this.properties = properties;
        this.passwordEncoder = passwordEncoder;
        this.adminUserRepository = adminUserRepository;
        this.siteSettingsRepository = siteSettingsRepository;
        this.achievementRepository = achievementRepository;
        this.resumeAssetRepository = resumeAssetRepository;
        this.skillGroupRepository = skillGroupRepository;
        this.experienceItemRepository = experienceItemRepository;
        this.projectRepository = projectRepository;
        this.objectMapper = objectMapper;
        this.educationRepository = educationRepository;
        this.awardRepository = awardRepository;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        bootstrapAdmin();
        bootstrapSite();
        bootstrapAchievements();
        bootstrapResume();
        bootstrapSkills();
        bootstrapExperience();
        bootstrapProjects();
        bootstrapEducation();
        bootstrapAwards();
    }

    private void bootstrapAdmin() {
        adminUserRepository.findByUsername(properties.getAdmin().getUsername())
                .ifPresentOrElse(
                        user -> {
                        },
                        () -> adminUserRepository.save(new AdminUser(
                                properties.getAdmin().getUsername(),
                                passwordEncoder.encode(properties.getAdmin().getPassword()),
                                "Park Inkyu")));
    }

    private void bootstrapSite() {
        if (siteSettingsRepository.count() > 0) {
            return;
        }
        siteSettingsRepository.save(new SiteSettings(
                text("복잡한 병원 연동과 데이터 흐름을 안정적인 운영 시스템으로 바꾸는 Java 백엔드 엔지니어",
                        "A Java backend engineer who turns complex hospital integrations into reliable operating systems"),
                text("Spring Boot 중심으로 병원별 XML, 처방 조회, 리포트 전송 흐름을 표준화하고, 테스트 프레임워크와 운영 자동화까지 설계합니다.",
                        "I standardize hospital-specific XML, prescription, and report delivery flows with Spring Boot, then back them with testing frameworks and operational automation."),
                text("최근에는 주요 병원 연동 프로젝트의 메인 백엔드로 5개 병원 연동을 안정적으로 완료했고, 테스트 설계와 운영 가시성까지 함께 책임지는 구조를 만드는 데 집중하고 있습니다.",
                        "Most recently, I served as the main backend engineer for a hospital-integration program, delivering five integrations while treating test design and operational visibility as part of the architecture itself."),
                "zzz563214@gmail.com",
                "+82 10-3444-4136",
                "https://github.com/pak-inkyu",
                "https://www.linkedin.com"));
    }

    private void bootstrapAchievements() {
        if (achievementRepository.count() > 0) {
            return;
        }
        achievementRepository.saveAll(List.of(
                achievement("병원 연동 안정화 완료",
                        "Hospital integrations delivered",
                        "병원별 상이한 XML 수신, 처방 조회, 리포트 전송 흐름을 정리해 총 5개 병원 연동을 안정적으로 완료했습니다.",
                        "Standardized XML intake, prescription lookup, and report delivery flows across five hospital integrations.",
                        "5 hospitals",
                        "copper",
                        1),
                achievement("실운영 데이터 처리",
                        "Live production data processed",
                        "2026년 1월 2일 기준 약 530건의 실제 운영 데이터를 안정적으로 처리했습니다.",
                        "Processed approximately 530 live production records as of January 2, 2026.",
                        "530+ cases",
                        "teal",
                        2),
                achievement("운영 장애 최소화",
                        "Production incidents minimized",
                        "동일 기준 실제 운영 데이터 처리 중 단 1건의 장애도 발생하지 않았습니다.",
                        "Recorded zero production incidents across the same live processing window.",
                        "0 incidents",
                        "slate",
                        3)));
    }

    private void bootstrapResume() {
        if (resumeAssetRepository.count() > 0) {
            return;
        }
        ResumeAsset resume = new ResumeAsset("ko", text("국문 이력서 PDF", "Korean resume PDF"), "park-inkyu-resume-ko.pdf", "/resume/park-inkyu-resume-ko.pdf");
        resume.setSortOrder(1);
        resume.publish();
        resumeAssetRepository.save(resume);
    }

    private void bootstrapSkills() {
        if (skillGroupRepository.count() > 0) {
            return;
        }
        SkillGroup backend = new SkillGroup("backend", text("Backend", "Backend"));
        backend.setSortOrder(1);
        backend.publish();
        backend.replaceItems(List.of(
                new SkillItem("Spring Boot", text("병원 연동, MSA, 관리자 API까지 실무형 백엔드 구조를 설계하고 구현", "Applied to production backend systems spanning hospital integrations, MSA, and admin-facing APIs"), 1),
                new SkillItem("Java 21", text("명시적인 도메인 모델링과 유지보수 가능한 객체 구조를 선호", "Favors explicit domain modeling and maintainable object design"), 2),
                new SkillItem("Spring Security", text("세션, JWT, 인증/인가 서버 고도화 경험 보유", "Hands-on with session auth, JWT, and auth-server refinement"), 3),
                new SkillItem("PostgreSQL", text("정규화 모델링과 운영 시점의 쿼리 안정성을 함께 고려", "Designs normalized schemas with production query behavior in mind"), 4)));
        SkillGroup infrastructure = new SkillGroup("infra", text("Data / Infra", "Data / Infra"));
        infrastructure.setSortOrder(2);
        infrastructure.publish();
        infrastructure.replaceItems(List.of(
                new SkillItem("Kafka / RabbitMQ", text("비동기 흐름, 메시지 기반 설정 반영, 대용량 데이터 처리 경험", "Used for async processing, message-driven config propagation, and large data flows"), 1),
                new SkillItem("Docker / Docker Compose", text("개발-테스트-배포 환경을 동일한 조건으로 재현하고 운영", "Keeps development, test, and deployment environments reproducible"), 2),
                new SkillItem("SFTP / SMB / FTP", text("파일 연동 중심 병원 시스템을 운영 가능한 구조로 자동화", "Automates file-heavy hospital integrations into operable systems"), 3),
                new SkillItem("Prometheus / Grafana", text("과부하 시점과 장애 징후를 수치로 읽을 수 있는 대시보드 구성", "Builds dashboards that expose overload points and operational signals"), 4)));
        SkillGroup ai = new SkillGroup("ai", text("AI / Applied Research", "AI / Applied Research"));
        ai.setSortOrder(3);
        ai.publish();
        ai.replaceItems(List.of(
                new SkillItem("LangChain", text("LLM 기반 워크플로와 애플리케이션 연동 프로토타이핑 경험", "Used for LLM workflow prototyping and application integration"), 1),
                new SkillItem("LLaVA / VLM", text("시설 관리 도메인에 맞춘 멀티모달 PoC 설계 및 평가 경험", "Designed and evaluated multimodal proof-of-concepts for facility-management use cases"), 2),
                new SkillItem("YOLOv8", text("실시간 객체 탐지와 트래킹, 데이터셋 구축 및 적용 경험", "Hands-on with real-time object detection, tracking, and dataset preparation"), 3),
                new SkillItem("DeepSpeed", text("실험 환경 최적화와 모델 실행 파이프라인 구성 경험", "Configured optimized model execution environments"), 4)));
        skillGroupRepository.saveAll(List.of(backend, infrastructure, ai));
    }

    private void bootstrapExperience() {
        if (experienceItemRepository.count() > 0) {
            return;
        }
        ExperienceItem synergy = new ExperienceItem(
                "시너지에이아이(주)",
                text("Java 백엔드 개발자", "Java Backend Engineer"),
                text("주요 병원 연동 프로젝트의 메인 백엔드로서 병원별 상이한 XML, 처방 조회, 리포트 전송 프로세스를 공통 구조로 정리하고 실제 운영 안정성을 책임졌습니다.",
                        "As the main backend engineer on a hospital-integration program, I unified hospital-specific XML, prescription, and report-delivery flows into a reliable operating structure."),
                text("2024.12 - 현재", "Dec 2024 - Present"),
                text("총 5개 병원 연동을 안정적으로 완료하고 병원별 상이한 XML 수신, 처방 조회, 리포트 전송 프로세스를 모두 반영\n수동 업로드 중심 XML 수집 시스템을 API, SFTP, FTP, SMB를 지원하는 구조로 리팩토링\n2026년 1월 2일 기준 약 530건의 실제 운영 데이터를 처리하면서 운영 장애 0건 기록\n현장 적용이 필요한 2개 병원 과제까지 직접 대응하며 운영 범위를 확장",
                        "Completed five hospital integrations while reflecting each hospital’s XML intake, prescription lookup, and report-delivery flow\nRefactored a manual XML upload process into a system supporting API, SFTP, FTP, and SMB\nProcessed roughly 530 live production records with zero incidents as of January 2, 2026\nHandled two on-site hospital rollout assignments to extend operational ownership"),
                "Spring Boot, Kafka, Docker Compose, XML, API, SFTP, FTP, SMB, EMR",
                "Jeju");
        synergy.setSortOrder(1);
        synergy.publish();
        ExperienceItem cloburo = new ExperienceItem(
                "주식회사클로버스튜디오(CLOBURO Co.,Ltd)",
                text("AI / 백엔드 개발자", "AI / Backend Engineer"),
                text("AI 프로토타이핑, 군중 인파 분석, MSA 고도화, 드론 관제 API 개발을 함께 경험하며 Spring Boot 기반 서비스 구조와 운영 가시성 역량을 넓혔습니다.",
                        "Worked across AI prototyping, crowd-analysis systems, MSA modernization, and drone-control APIs, expanding both Spring service architecture and operational visibility skills."),
                text("2023.10 - 2024.10", "Oct 2023 - Oct 2024"),
                text("Spring Cloud, ApiGateway, Kafka, RabbitMQ, Prometheus, Grafana 기반 MSA 고도화 작업 수행\nYOLOv8 기반 군중 인파 분석 시스템에서 탐지, 추적, 데이터셋 구축과 영상 처리 흐름 구현\n드론 통합 관제 시스템 API와 배포 자동화, 장애 대응 로직 구현\nLLM/VLM 기반 서비스 제안 프로젝트의 모델 검토와 실험 환경 구성",
                        "Contributed to MSA modernization using Spring Cloud, ApiGateway, Kafka, RabbitMQ, Prometheus, and Grafana\nBuilt detection, tracking, dataset, and video-processing flows for a YOLOv8-based crowd-analysis system\nBuilt drone-control APIs, deployment automation, and failure-handling logic\nEvaluated models and built experiment environments for LLM/VLM service proposals"),
                "Spring Boot, Spring Cloud, Kafka, RabbitMQ, Prometheus, Grafana, Docker, PostgreSQL, LLaVA, LangChain",
                "Seoul");
        cloburo.setSortOrder(2);
        cloburo.publish();
        experienceItemRepository.saveAll(List.of(synergy, cloburo));
    }

    private void bootstrapProjects() throws Exception {
        if (projectRepository.count() > 0) {
            return;
        }
        Project testing = new Project(
                "hospital-integration-test-framework",
                text("병원 연동 테스트 프레임워크 설계 및 구현", "Hospital Integration Test Framework"),
                text("XML, 처방 조회, 리포트 전송을 공통 검증 흐름으로 표준화한 테스트 기반", "A reusable test foundation for XML, prescription, and report delivery flows"),
                text("병원별 데이터 형식과 운영 시나리오가 달라도 같은 기준으로 검증할 수 있도록 Spring Boot, Kafka, Docker Compose 기반 테스트 프레임워크를 설계하고 구현했습니다.",
                        "Designed and implemented a Spring Boot, Kafka, and Docker Compose testing framework so hospital-specific data and runtime scenarios could be validated under one standard."),
                text("병원 연동이 늘어날수록 수작업 검증과 회귀 비용이 커졌고, 운영 직전까지도 XML 수신과 리포트 전송 흐름을 안전하게 재현하기 어려웠습니다.",
                        "As hospital integrations increased, manual verification and regression costs grew, while XML intake and report-delivery behavior remained difficult to reproduce safely before release."),
                text("테스트 프레임워크 구조 설계, 환경 표준화, XML 샘플 데이터 구성, 시나리오 자동화, 품질 기준 정의를 주도했습니다.",
                        "Led the framework design, environment standardization, XML sample-data generation, scenario automation, and quality criteria."),
                text("병원별 차이는 설정으로 분리하고 XML 수신, 처방 조회, 리포트 전송을 공통 코어 흐름으로 모델링했습니다. Docker Compose로 Kafka 기반 의존성을 동일한 조건에서 재현하고, 실제 운영과 유사한 데이터 케이스를 자동 검증 흐름으로 연결했습니다.",
                        "Separated hospital-specific behavior into configuration, modeled XML intake, prescription lookup, and report delivery as shared core flows, and reproduced Kafka-backed dependencies in a repeatable Docker Compose environment."),
                text("신규 병원 연동이 들어와도 핵심 흐름을 반복 가능하게 검증할 수 있는 기반을 마련했고, 운영 전 품질 확인과 배포 안정성을 구조적으로 끌어올렸습니다.",
                        "Established a repeatable verification baseline for new hospital rollouts, structurally improving pre-production quality checks and release stability."),
                true,
                "#0D8B8B",
                "/images/project-testing-grid.svg");
        testing.setSortOrder(1);
        testing.publish();
        testing.replaceSections(List.of(
                new ProjectSection(ProjectSectionType.METRICS, text("핵심 성과", "Impact"), objectMapper.readTree("""
                        {"items":[
                          {"label":"Core flows","value":"3","note":"XML intake · Prescription lookup · Report delivery"},
                          {"label":"Execution mode","value":"Dockerized","note":"Docker Compose based repeatable environment"},
                          {"label":"Primary stack","value":"Spring Boot + Kafka","note":"Reusable test architecture for hospital integrations"}
                        ]}
                        """), 1),
                new ProjectSection(ProjectSectionType.TIMELINE, text("설계 흐름", "Delivery timeline"), objectMapper.readTree("""
                        {"items":[
                          {"title":"환경 표준화","description":"Docker Compose 기반 공통 테스트 환경을 설계해 병원별 차이를 동일 조건에서 검증"},
                          {"title":"시나리오 모델링","description":"XML 수신, 처방 조회, 리포트 전송을 핵심 코어 흐름으로 템플릿화"},
                          {"title":"샘플 데이터 자동화","description":"실제 의료 시나리오를 재현할 수 있는 XML 기반 샘플 데이터를 구성"},
                          {"title":"회귀 기반 축적","description":"장애 가능성이 높은 케이스를 중심으로 회귀 시나리오를 누적"}
                        ]}
                        """), 2),
                new ProjectSection(ProjectSectionType.MARKDOWN, text("다음 고도화 단계", "Next engineering step"), objectMapper.readTree("""
                        {"markdown":"- 핵심 코어 로직(XML 수신, 처방 조회, 리포트 전송) 기준으로 테스트 커버리지를 80% 이상까지 확대\\n- 신규 병원 연동 시 공통 로직에 test-first 방식을 적용해 개발 초반부터 품질 기준을 고정\\n- 장애 가능성이 높은 케이스를 중심으로 회귀 시나리오를 지속적으로 축적해 운영 리스크를 사전에 차단"}
                        """), 3)));
        Project hospital = new Project(
                "hospital-integration-automation",
                text("병원 연동 백엔드 자동화와 EMR 리포트 전송 체계 구축", "Hospital Integration Automation and EMR Report Delivery"),
                text("5개 병원별 상이한 연동 조건을 하나의 운영 가능한 백엔드 구조로 통합한 프로젝트", "A backend system that unified five hospital-specific integration flows into one operable structure"),
                text("주요 병원 연동 프로젝트의 메인 백엔드로서 XML 수신, 처방 조회, 리포트 전송까지 병원별 상이한 프로세스를 안정적으로 구현하고 운영까지 책임졌습니다.",
                        "Served as the main backend engineer for a hospital-integration program, implementing XML intake, prescription lookup, and report delivery across hospitals with different operational requirements."),
                text("병원마다 파일 수집 방식, EMR 연동 조건, 전송 프로토콜, 운영 환경이 모두 달라 신규 연동마다 커스텀 대응과 수동 확인이 반복되고 있었습니다.",
                        "Each hospital had different ingest methods, EMR constraints, transfer protocols, and runtime environments, forcing repeated one-off implementations and manual checks."),
                text("메인 백엔드 담당자로 데이터 수집 리팩토링, 다중 프로토콜 연동, 병원별 환경 설정 구조화, EMR 송수신 체계 구축, 현장 적용 대응까지 맡았습니다.",
                        "Owned the backend core: data-collection refactoring, multi-protocol integration, hospital-specific configuration, EMR exchange, and on-site rollout support."),
                text("수동 업로드 중심 XML 수집 시스템을 API, SFTP, FTP, SMB를 지원하는 구조로 전환하고, 병원별 데이터 수신과 저장 규칙을 환경 설정으로 분리했습니다. EMR 기반 환자 정보와 진단 리포트 송수신 체계를 구축해 운영 단계까지 이어지는 흐름을 하나의 서비스 구조 안에서 관리할 수 있게 만들었습니다.",
                        "Rebuilt a manual XML upload process into a system supporting API, SFTP, FTP, and SMB, separated ingest and storage rules by hospital configuration, and standardized patient/report exchange with EMR systems."),
                text("총 5개 병원 연동을 안정적으로 완료했고, 2026년 1월 2일 기준 약 530건의 실제 운영 데이터를 처리하면서 운영 장애 0건을 유지했습니다. 현장 적용이 필요한 2개 병원 과제까지 직접 대응해 시스템의 운영 범위를 넓혔습니다.",
                        "Delivered five hospital integrations, processed about 530 live production records with zero incidents as of January 2, 2026, and handled two on-site rollouts that extended operational ownership."),
                true,
                "#B66A3C",
                "/images/project-emr-wave.svg");
        hospital.setSortOrder(2);
        hospital.publish();
        hospital.replaceSections(List.of(
                new ProjectSection(ProjectSectionType.METRICS, text("운영 결과", "Operational outcomes"), objectMapper.readTree("""
                        {"items":[
                          {"label":"Integrated hospitals","value":"5","note":"Delivered and stabilized across different hospital environments"},
                          {"label":"Live cases","value":"530+","note":"Production data processed as of Jan 2, 2026"},
                          {"label":"Incidents","value":"0","note":"No production failure recorded in the same window"},
                          {"label":"On-site rollouts","value":"2","note":"Handled field assignments requiring direct operational support"}
                        ]}
                        """), 1),
                new ProjectSection(ProjectSectionType.DIAGRAM, text("시스템 흐름", "System flow"), objectMapper.readTree("""
                        {"nodes":["XML Intake","Prescription Lookup","Report Generation","Protocol Transfer","EMR Sync"],"edges":[[0,1],[1,2],[2,3],[3,4]]}
                        """), 2),
                new ProjectSection(ProjectSectionType.MARKDOWN, text("설계 포인트", "Design notes"), objectMapper.readTree("""
                        {"markdown":"- 병원마다 다른 XML 수신, 처방 조회, 리포트 전송 규칙을 환경 설정으로 분리해 신규 연동 시 변경 범위를 제어\\n- API, SFTP, FTP, SMB를 모두 수용하는 구조로 바꿔 반복되던 수동 업로드와 현장 대응 비용을 줄임\\n- EMR 기반 환자 정보와 리포트 송수신 체계를 구축해 운영 흐름을 한 시스템 안에서 추적 가능하게 만듦"}
                        """), 3)));
        Project msa = new Project(
                "msa-observability-upgrade",
                text("MSA 고도화 및 관측성 구축", "MSA Modernization and Observability Upgrade"),
                text("Spring Cloud, Kafka, Prometheus, Grafana 기반 운영 구조를 정리한 프로젝트", "A modernization effort that clarified distributed operations with Spring Cloud, Kafka, Prometheus, and Grafana"),
                text("API Gateway, Config Server, Kafka Connect, CircuitBreaker, Prometheus/Grafana를 이용해 분산 서비스 구조를 안정화하고 운영 시점을 수치로 읽을 수 있게 만든 작업입니다.",
                        "Stabilized a distributed service architecture with API Gateway, Config Server, Kafka Connect, CircuitBreaker, and Prometheus/Grafana so the team could reason about operations quantitatively."),
                text("서비스가 분리될수록 장애 전파, 설정 동기화, 대용량 데이터 처리, 과부하 시점 파악이 점점 더 어려워지고 있었습니다.",
                        "As services split apart, failure propagation, config synchronization, large-data handling, and overload detection became progressively harder."),
                text("Eureka Server, ApiGateway 통신 테스트, Config Server 반영, Kafka Connect, CircuitBreaker, 인증/인가 서버 고도화, 관측성 대시보드 구축을 맡았습니다.",
                        "Worked across Eureka, ApiGateway communication, Config Server propagation, Kafka Connect, CircuitBreaker, auth-server refinement, and observability dashboards."),
                text("서비스 등록, 설정 반영, 데이터 처리, 장애 격리, 인증, 메트릭 수집을 각각 명확한 계층으로 분리했습니다. RestTemplate에서 FeignClient로의 리팩토링과 Spring Cloud Bus + RabbitMQ 기반 설정 반영 구조를 통해 운영 일관성을 높였습니다.",
                        "Separated service registration, config propagation, data handling, fault isolation, auth, and metrics into clearer layers, while improving consistency through RestTemplate-to-Feign refactoring and Spring Cloud Bus with RabbitMQ."),
                text("분산 환경의 안정화, 운영 시점 가시화, 서버 증설 판단 근거 확보, 배포 관리 체계 정리에 기여했습니다.",
                        "Improved distributed-system stability, operational visibility, capacity-planning signals, and deployment discipline."),
                true,
                "#415063",
                "/images/project-ai-fabric.svg");
        msa.setSortOrder(3);
        msa.publish();
        msa.replaceSections(List.of(
                new ProjectSection(ProjectSectionType.GALLERY, text("핵심 구성요소", "Core building blocks"), objectMapper.readTree("""
                        {"items":[
                          {"title":"Service discovery","description":"Eureka Server 기반 서비스 등록과 상태 관리"},
                          {"title":"Gateway and config","description":"ApiGateway, Config Server, Spring Cloud Bus + RabbitMQ를 통한 운영 일관성 확보"},
                          {"title":"Resilience and async","description":"Kafka Connect, Kafka, CircuitBreaker로 대용량 데이터 흐름과 장애 전파 제어"},
                          {"title":"Observability","description":"Prometheus와 Grafana로 과부하 시점과 메트릭을 시각화"}
                        ]}
                        """), 1)));
        Project crowd = new Project(
                "crowd-analysis-vision-system",
                text("군중 인파 분석 시스템", "Crowd Analysis Vision System"),
                text("YOLOv8 기반 실시간 탐지와 추적, 데이터셋 운영을 정리한 비전 프로젝트", "A YOLOv8-based vision project for real-time detection, tracking, and dataset operations"),
                text("군중 밀집 환경을 영상으로 분석하기 위해 YOLOv8 기반 탐지와 추적, RTSP 영상 처리, 데이터셋 구축 흐름을 함께 다뤘습니다.",
                        "Built a YOLOv8-based pipeline for crowd-scene detection, tracking, RTSP video handling, and dataset operations."),
                text("영상 도메인은 모델 성능만으로 끝나지 않고, 관심 영역 정의, 추적 안정성, 데이터셋 품질, 현장 입력 조건이 함께 맞아야 실제 시스템으로 연결됩니다.",
                        "In video systems, model quality alone is insufficient. Region-of-interest design, tracking stability, dataset quality, and field input conditions all have to align."),
                text("탐지 및 추적 로직 적용, 데이터셋 구축과 보정, 관심 영역 설정, 영상 처리 파이프라인 관리에 참여했습니다.",
                        "Worked on detection and tracking logic, dataset preparation and refinement, field-of-view setup, and video-processing pipeline management."),
                text("YOLOv8을 중심으로 탐지와 추적을 구성하고, RTSP 입력과 관심 영역 기반 후처리를 조합해 실제 운영 환경에 맞는 분석 흐름을 만들었습니다. 데이터셋을 직접 보정하면서 모델 결과와 입력 품질을 함께 다뤘습니다.",
                        "Built detection and tracking on top of YOLOv8, combined RTSP inputs with region-based post-processing, and iterated on datasets so model results and input quality could be improved together."),
                text("실시간 탐지와 추적이 가능한 기반을 정리했고, 비전 시스템을 운영 가능한 형태로 만들기 위해 데이터와 영상 처리까지 함께 다뤄야 한다는 감각을 확보했습니다.",
                        "Delivered a foundation for real-time detection and tracking while learning how data operations and video processing must be treated as part of the system, not separate concerns."),
                false,
                "#415063",
                "/images/project-testing-grid.svg");
        crowd.setSortOrder(4);
        crowd.publish();
        crowd.replaceSections(List.of(
                new ProjectSection(ProjectSectionType.GALLERY, text("구성 요소", "Key elements"), objectMapper.readTree("""
                        {"items":[
                          {"title":"Detection and tracking","description":"YOLOv8 기반 객체 탐지와 추적 흐름 적용"},
                          {"title":"Dataset refinement","description":"모델 성능 개선을 위한 데이터셋 보정과 재구성"},
                          {"title":"Field of view","description":"관심 영역 설정으로 현장 조건에 맞는 분석 범위 정의"},
                          {"title":"Video pipeline","description":"RTSP 입력과 영상 처리 흐름을 안정적으로 관리"}
                        ]}
                        """), 1)));
        Project drone = new Project(
                "drone-control-api",
                text("물류 드론 통합 관제 시스템 API", "Integrated Logistics Drone Control API"),
                text("Spring Boot, PostgreSQL, Docker 기반 드론 관제 백엔드", "A Spring Boot, PostgreSQL, and Docker backend for drone-control operations"),
                text("물류 드론 관제 시나리오를 다루는 API를 설계하고 배포 및 운영 관점까지 고려한 백엔드 구조를 구축했습니다.",
                        "Designed APIs for logistics-drone control scenarios and built a backend structure that accounted for deployment and operations from the start."),
                text("드론 관제는 실시간 제어 요청과 상태 반영, 장애 대응, 배포 관리가 한 번에 맞물려야 해서 단순 CRUD보다 운영 관점의 설계가 더 중요했습니다.",
                        "Drone-control systems require real-time command handling, state reflection, failure handling, and deployment discipline, making operational design more important than simple CRUD."),
                text("API 개발, 데이터 모델링, Docker 기반 실행 환경 구성, 장애 대응 로직 구현을 담당했습니다.",
                        "Handled API development, data modeling, Docker-based runtime setup, and failure-handling logic."),
                text("Spring Boot와 PostgreSQL을 중심으로 관제 API를 구성하고, Docker 기반으로 실행 환경을 표준화했습니다. 운영 중 발생 가능한 실패 상황을 고려해 장애 대응 로직과 배포 관리 흐름을 함께 설계했습니다.",
                        "Built the control APIs on Spring Boot and PostgreSQL, standardized runtime environments with Docker, and designed failure-handling logic with deployment management in mind."),
                text("단기간 프로젝트에서도 API 설계와 운영 구조를 함께 봐야 한다는 기준을 세웠고, 이후 MSA와 병원 연동 프로젝트를 더 안정적으로 다루는 기반 경험이 되었습니다.",
                        "Even in a short project, it reinforced the standard that API design and operational structure must be solved together, which later informed both MSA and hospital-integration work."),
                false,
                "#B66A3C",
                "/images/project-emr-wave.svg");
        drone.setSortOrder(5);
        drone.publish();
        drone.replaceSections(List.of(
                new ProjectSection(ProjectSectionType.TIMELINE, text("구현 포인트", "Implementation focus"), objectMapper.readTree("""
                        {"items":[
                          {"title":"API design","description":"드론 제어와 상태 반영을 위한 API 계약 설계"},
                          {"title":"Data modeling","description":"관제 시나리오를 지원하는 PostgreSQL 기반 모델 구성"},
                          {"title":"Docker runtime","description":"실행 환경과 배포 흐름을 표준화해 재현 가능성 확보"},
                          {"title":"Failure handling","description":"운영 중단 상황을 고려한 장애 대응 로직 추가"}
                        ]}
                        """), 1)));
        projectRepository.saveAll(List.of(testing, hospital, msa, crowd, drone));
    }

    private Achievement achievement(
            String koTitle,
            String enTitle,
            String koSummary,
            String enSummary,
            String metric,
            String accent,
            int sortOrder) {
        Achievement item = new Achievement(text(koTitle, enTitle), text(koSummary, enSummary), metric, accent);
        item.setSortOrder(sortOrder);
        item.publish();
        return item;
    }

    private LocalizedText text(String ko, String en) {
        return new LocalizedText(ko, en);
    }

    private void bootstrapEducation() {
        if (educationRepository.count() > 0) {
            return;
        }
        Education seoulTech = new Education(
                "서울과학기술대학교",
                text("수료", "Completed"),
                text("기계시스템디자인공학과", "Mechanical System Design Engineering"),
                text("2013.03 - 2020.08", "Mar 2013 - Aug 2020"));
        seoulTech.setSortOrder(1);
        seoulTech.publish();
        educationRepository.save(seoulTech);
    }

    private void bootstrapAwards() {
        if (awardRepository.count() > 0) {
            return;
        }
        awardRepository.saveAll(List.of(
                award("PUBLICATION",
                        text("한국항공우주학회 2024 춘계학술대회 논문 투고",
                                "KSAS 2024 Spring Conference — Paper Submitted"),
                        text("한국항공우주학회", "Korean Society for Aeronautical and Space Sciences"),
                        "2024.04",
                        text("다수 그룹 UAV관제의 통신 보안을 위한 경량 고속의 그룹 암호화 키 관리 시스템",
                                "Lightweight high-speed group encryption key management for multi-group UAV control communication security"),
                        1),
                award("COMPETITION",
                        text("2019 CES 공모전 참가 — 교내 최우수상", "2019 CES Competition — Top University Award"),
                        text("서울과학기술대학교", "Seoul National University of Science and Technology"),
                        "2018.12",
                        text("학교 대표로 CES에 참가해 교내 최우수상 수상. 자동화 로봇 설계 및 프로그래밍 담당.",
                                "Represented the university at CES, received the top internal award. Responsible for automation robot design and programming."),
                        2),
                award("EDUCATION_COURSE",
                        text("[NCIA교육센터] ChatGPT 기술 구현", "[NCIA] ChatGPT Technology Implementation"),
                        text("NCIA교육센터", "NCIA Training Center"),
                        "2024.06",
                        text("자연어 처리 및 언어 생성 모델 이해, 문장 생성 원리, AI 애플리케이션 개발 과정",
                                "Natural language processing, language generation models, and AI application development"),
                        3),
                award("EDUCATION_COURSE",
                        text("[NCIA교육센터] 딥러닝 기반 객체탐지 및 고성능 비전 프레임워크 활용",
                                "[NCIA] Deep Learning Object Detection and High-Performance Vision Frameworks"),
                        text("NCIA교육센터", "NCIA Training Center"),
                        "2024.04",
                        text("객체 탐지 인공지능 모델 설계, CNN/R-CNN/YOLO, 성능 평가 및 딥러닝 프레임워크(PyTorch/mmDetection)",
                                "Object detection model design, CNN/R-CNN/YOLO, performance evaluation, PyTorch and mmDetection"),
                        4),
                award("EDUCATION_COURSE",
                        text("[KEA] 파이썬을 활용한 알고리즘&머신러닝 활용",
                                "[KEA] Algorithms & Machine Learning with Python"),
                        text("한국전기기술인협회(KEA)", "Korea Electrical Engineers Association"),
                        "2024.03",
                        text("SVM, XGBoost, Decision Trees, Random Forest 등 머신러닝 알고리즘 실습 및 데이터 분석",
                                "Hands-on practice with SVM, XGBoost, Decision Trees, Random Forest, and data analysis"),
                        5)));
    }

    private Award award(String awardType, LocalizedText title, LocalizedText issuer,
                        String periodLabel, LocalizedText description, int sortOrder) {
        Award item = new Award(awardType, title, issuer, periodLabel, description);
        item.setSortOrder(sortOrder);
        item.publish();
        return item;
    }
}
