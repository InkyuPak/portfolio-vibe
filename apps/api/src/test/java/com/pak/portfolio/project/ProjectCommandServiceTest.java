package com.pak.portfolio.project.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pak.portfolio.common.dto.CommonDtos.LocalizedTextPayload;
import com.pak.portfolio.project.dto.ProjectDtos.AdminProjectResponse;
import com.pak.portfolio.project.dto.ProjectDtos.ProjectRequest;
import com.pak.portfolio.project.dto.ProjectDtos.ProjectSectionRequest;
import com.pak.portfolio.project.repository.ProjectRepository;
import com.pak.portfolio.site.port.RevalidationPort;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ProjectCommandServiceTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void shouldCreateProjectAndTriggerRevalidation() throws Exception {
        ProjectRepository repository = mock(ProjectRepository.class);
        ProjectQueryService queryService = mock(ProjectQueryService.class);
        RevalidationPort revalidationPort = mock(RevalidationPort.class);
        ProjectCommandService service = new ProjectCommandService(repository, queryService, revalidationPort);

        ProjectRequest request = new ProjectRequest(
                "test-slug",
                new LocalizedTextPayload("제목", "Title"),
                new LocalizedTextPayload("부제", "Subtitle"),
                new LocalizedTextPayload("개요", "Overview"),
                new LocalizedTextPayload("문제", "Problem"),
                new LocalizedTextPayload("역할", "Role"),
                new LocalizedTextPayload("구조", "Architecture"),
                new LocalizedTextPayload("성과", "Outcome"),
                true,
                "#123456",
                "/cover.png",
                null,
                1,
                List.of(new ProjectSectionRequest(
                        "MARKDOWN",
                        new LocalizedTextPayload("섹션", "Section"),
                        objectMapper.readTree("{\"markdown\":\"content\"}"),
                        1)));

        when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(queryService.toAdmin(any())).thenReturn(new AdminProjectResponse(
                1L,
                "test-slug",
                new LocalizedTextPayload("제목", "Title"),
                new LocalizedTextPayload("부제", "Subtitle"),
                new LocalizedTextPayload("개요", "Overview"),
                new LocalizedTextPayload("문제", "Problem"),
                new LocalizedTextPayload("역할", "Role"),
                new LocalizedTextPayload("구조", "Architecture"),
                new LocalizedTextPayload("성과", "Outcome"),
                true,
                "#123456",
                "/cover.png",
                null,
                "PUBLISHED",
                1,
                List.of()));
        doNothing().when(revalidationPort).revalidateAll();

        AdminProjectResponse response = service.create(request);

        assertThat(response.slug()).isEqualTo("test-slug");
        verify(repository).save(any());
        verify(revalidationPort).revalidateAll();
    }
}
