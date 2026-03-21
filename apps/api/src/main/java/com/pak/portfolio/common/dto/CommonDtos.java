package com.pak.portfolio.common.dto;

import jakarta.validation.constraints.NotBlank;

public final class CommonDtos {

    private CommonDtos() {
    }

    public record LocalizedTextPayload(@NotBlank String ko, String en) {
    }
}
