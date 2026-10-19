package com.example.islab1.exception;

import lombok.*;

import java.util.Map;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ValidationErrorResponse {
    private int status;
    private String message;
    private Map<String, String> errors;
}