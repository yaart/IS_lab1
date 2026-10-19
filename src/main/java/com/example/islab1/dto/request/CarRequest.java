package com.example.islab1.dto.request;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CarRequest {
    private Long existingId;
    private String name;
}