package com.pak.portfolio.media.controller;

import com.pak.portfolio.media.dto.MediaDtos.MediaAssetResponse;
import com.pak.portfolio.media.service.MediaCommandService;
import com.pak.portfolio.media.service.MediaQueryService;
import java.io.IOException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/media")
public class MediaController {

    private final MediaCommandService mediaCommandService;
    private final MediaQueryService mediaQueryService;

    public MediaController(MediaCommandService mediaCommandService, MediaQueryService mediaQueryService) {
        this.mediaCommandService = mediaCommandService;
        this.mediaQueryService = mediaQueryService;
    }

    @GetMapping
    public List<MediaAssetResponse> list() {
        return mediaQueryService.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MediaAssetResponse upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("altKo") String altKo,
            @RequestParam(value = "altEn", required = false) String altEn,
            @RequestParam(value = "captionKo", required = false) String captionKo,
            @RequestParam(value = "captionEn", required = false) String captionEn) throws IOException {
        return mediaCommandService.upload(file, altKo, altEn, captionKo, captionEn);
    }
}
