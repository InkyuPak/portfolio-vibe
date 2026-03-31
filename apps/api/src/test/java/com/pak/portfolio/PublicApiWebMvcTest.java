package com.pak.portfolio;

import com.pak.portfolio.project.controller.ProjectController;
import com.pak.portfolio.project.dto.ProjectDtos.PublicProjectDetailResponse;
import com.pak.portfolio.project.dto.ProjectDtos.PublicProjectSummaryResponse;
import com.pak.portfolio.project.service.ProjectQueryService;
import com.pak.portfolio.site.controller.SiteController;
import com.pak.portfolio.site.dto.SiteDtos.PublicAchievementResponse;
import com.pak.portfolio.site.dto.SiteDtos.PublicAwardResponse;
import com.pak.portfolio.site.dto.SiteDtos.PublicEducationResponse;
import com.pak.portfolio.site.dto.SiteDtos.PublicSiteSettingsResponse;
import com.pak.portfolio.site.dto.SiteDtos.ResumeAssetResponse;
import com.pak.portfolio.site.dto.SiteDtos.SiteOverviewResponse;
import com.pak.portfolio.site.service.SiteQueryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {SiteController.class, ProjectController.class})
@AutoConfigureMockMvc(addFilters = false)
class PublicApiWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SiteQueryService siteQueryService;

    @MockBean
    private ProjectQueryService projectQueryService;

    @MockBean
    private com.pak.portfolio.site.service.SiteCommandService siteCommandService;

    @MockBean
    private com.pak.portfolio.project.service.ProjectCommandService projectCommandService;

    @Test
    void shouldRenderSiteOverview() throws Exception {
        when(siteQueryService.overview(anyString())).thenReturn(new SiteOverviewResponse(
                new PublicSiteSettingsResponse("Hero", "Subtitle", "Description", "mail@test.dev", "010-1111-2222", "https://github.com", "https://linkedin.com"),
                List.of(new PublicAchievementResponse("Title", "Summary", "80%", "teal")),
                List.of(new ResumeAssetResponse(1L, "ko", "Resume", "resume.pdf", "/resume.pdf"))));

        mockMvc.perform(get("/api/public/site-settings").param("lang", "ko"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.site.heroTitle").value("Hero"))
                .andExpect(jsonPath("$.achievements[0].metric").value("80%"))
                .andExpect(jsonPath("$.resumes[0].fileName").value("resume.pdf"));
    }

    @Test
    void shouldRenderProjectDetail() throws Exception {
        when(projectQueryService.listPublished(anyString(), anyBoolean())).thenReturn(List.of(
                new PublicProjectSummaryResponse(1L, "project-slug", "Title", "Subtitle", "Overview", true, "#123456", "/cover.png", null)));
        when(projectQueryService.getPublished(anyString(), anyString())).thenReturn(new PublicProjectDetailResponse(
                1L,
                "project-slug",
                "Title",
                "Subtitle",
                "Overview",
                "Problem",
                "Role",
                "Architecture",
                "Outcome",
                true,
                "#123456",
                "/cover.png",
                null,
                List.of()));

        mockMvc.perform(get("/api/public/projects").param("featured", "true").param("lang", "en"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].slug").value("project-slug"));

        mockMvc.perform(get("/api/public/projects/project-slug").param("lang", "en"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Title"))
                .andExpect(jsonPath("$.problem").value("Problem"));
    }

    @Test
    void shouldRenderEducation() throws Exception {
        when(siteQueryService.listPublishedEducation(anyString())).thenReturn(List.of(
                new PublicEducationResponse(
                        "서울과학기술대학교", "수료", "기계시스템디자인공학과", "2013.03 - 2020.08")));

        mockMvc.perform(get("/api/public/education").param("lang", "ko"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].institutionName").value("서울과학기술대학교"))
                .andExpect(jsonPath("$[0].degree").value("수료"));
    }

    @Test
    void shouldRenderAwards() throws Exception {
        when(siteQueryService.listPublishedAwards(anyString())).thenReturn(List.of(
                new PublicAwardResponse(
                        "PUBLICATION", "한국항공우주학회 논문", "한국항공우주학회", "2024.04", "UAV 통신 보안")));

        mockMvc.perform(get("/api/public/awards").param("lang", "ko"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].awardType").value("PUBLICATION"))
                .andExpect(jsonPath("$[0].periodLabel").value("2024.04"));
    }
}
