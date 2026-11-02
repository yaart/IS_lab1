package com.example.islab1.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CoordinatesRequest {
    private Long existingId;

    @Max(value = 256, message = "X must be <= 256")
    private Float x;

    @Min(value = -532, message = "Y must be > -533")
    private float y;
}