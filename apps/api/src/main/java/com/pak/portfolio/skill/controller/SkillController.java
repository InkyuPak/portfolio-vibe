package com.pak.portfolio.skill.controller;

import com.pak.portfolio.skill.dto.SkillDtos.AdminSkillGroupResponse;
import com.pak.portfolio.skill.dto.SkillDtos.PublicSkillGroupResponse;
import com.pak.portfolio.skill.dto.SkillDtos.SkillGroupRequest;
import com.pak.portfolio.skill.service.SkillCommandService;
import com.pak.portfolio.skill.service.SkillQueryService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SkillController {

    private final SkillQueryService skillQueryService;
    private final SkillCommandService skillCommandService;

    public SkillController(SkillQueryService skillQueryService, SkillCommandService skillCommandService) {
        this.skillQueryService = skillQueryService;
        this.skillCommandService = skillCommandService;
    }

    @GetMapping("/api/public/skills")
    public List<PublicSkillGroupResponse> publicSkills(@RequestParam(defaultValue = "ko") String lang) {
        return skillQueryService.getPublished(lang);
    }

    @GetMapping("/api/admin/skills")
    public List<AdminSkillGroupResponse> adminSkills() {
        return skillQueryService.getAdminList();
    }

    @PostMapping("/api/admin/skills")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminSkillGroupResponse create(@Valid @RequestBody SkillGroupRequest request) {
        return skillCommandService.create(request);
    }

    @PutMapping("/api/admin/skills/{id}")
    public AdminSkillGroupResponse update(@PathVariable Long id, @Valid @RequestBody SkillGroupRequest request) {
        return skillCommandService.update(id, request);
    }

    @DeleteMapping("/api/admin/skills/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        skillCommandService.delete(id);
    }
}
