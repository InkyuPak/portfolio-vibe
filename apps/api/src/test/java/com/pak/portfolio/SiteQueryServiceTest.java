package com.pak.portfolio;

import com.pak.portfolio.common.domain.LocalizedText;
import com.pak.portfolio.common.domain.PublicationStatus;
import com.pak.portfolio.site.domain.Award;
import com.pak.portfolio.site.domain.Education;
import com.pak.portfolio.site.dto.SiteDtos.PublicAwardResponse;
import com.pak.portfolio.site.dto.SiteDtos.PublicEducationResponse;
import com.pak.portfolio.site.repository.AchievementRepository;
import com.pak.portfolio.site.repository.AwardRepository;
import com.pak.portfolio.site.repository.EducationRepository;
import com.pak.portfolio.site.repository.ResumeAssetRepository;
import com.pak.portfolio.site.repository.SiteSettingsRepository;
import com.pak.portfolio.site.service.SiteQueryService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SiteQueryServiceTest {

    @Mock private SiteSettingsRepository siteSettingsRepository;
    @Mock private AchievementRepository achievementRepository;
    @Mock private ResumeAssetRepository resumeAssetRepository;
    @Mock private EducationRepository educationRepository;
    @Mock private AwardRepository awardRepository;

    @InjectMocks private SiteQueryService sut;

    @Test
    void listPublishedEducation_returnsKoreanFields() {
        Education edu = new Education(
                "서울과학기술대학교",
                new LocalizedText("수료", "Completed"),
                new LocalizedText("기계시스템디자인공학과", "Mechanical System Design Engineering"),
                new LocalizedText("2013.03 - 2020.08", "Mar 2013 - Aug 2020"));
        edu.publish();
        when(educationRepository.findByStatusOrderBySortOrderAscIdAsc(eq(PublicationStatus.PUBLISHED)))
                .thenReturn(List.of(edu));

        List<PublicEducationResponse> result = sut.listPublishedEducation("ko");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).institutionName()).isEqualTo("서울과학기술대학교");
        assertThat(result.get(0).degree()).isEqualTo("수료");
        assertThat(result.get(0).major()).isEqualTo("기계시스템디자인공학과");
        assertThat(result.get(0).periodLabel()).isEqualTo("2013.03 - 2020.08");
    }

    @Test
    void listPublishedEducation_returnsEnglishFields() {
        Education edu = new Education(
                "Seoul National University of Science and Technology",
                new LocalizedText("수료", "Completed"),
                new LocalizedText("기계시스템디자인공학과", "Mechanical System Design Engineering"),
                new LocalizedText("2013.03 - 2020.08", "Mar 2013 - Aug 2020"));
        edu.publish();
        when(educationRepository.findByStatusOrderBySortOrderAscIdAsc(eq(PublicationStatus.PUBLISHED)))
                .thenReturn(List.of(edu));

        List<PublicEducationResponse> result = sut.listPublishedEducation("en");

        assertThat(result.get(0).degree()).isEqualTo("Completed");
        assertThat(result.get(0).major()).isEqualTo("Mechanical System Design Engineering");
    }

    @Test
    void listPublishedAwards_returnsCorrectFields() {
        Award award = new Award(
                "PUBLICATION",
                new LocalizedText("한국항공우주학회 2024 춘계학술대회 논문 투고", "KSAS 2024 Spring Conference Paper"),
                new LocalizedText("한국항공우주학회", "Korean Society for Aeronautical and Space Sciences"),
                "2024.04",
                new LocalizedText("UAV 통신 보안 관련 논문", "UAV communication security paper"));
        award.publish();
        when(awardRepository.findByStatusOrderBySortOrderAscIdAsc(eq(PublicationStatus.PUBLISHED)))
                .thenReturn(List.of(award));

        List<PublicAwardResponse> result = sut.listPublishedAwards("ko");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).awardType()).isEqualTo("PUBLICATION");
        assertThat(result.get(0).periodLabel()).isEqualTo("2024.04");
        assertThat(result.get(0).title()).isEqualTo("한국항공우주학회 2024 춘계학술대회 논문 투고");
    }
}
