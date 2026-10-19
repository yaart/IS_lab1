package com.example.islab1.dto.request;

import com.example.islab1.entity.Mood;
import com.example.islab1.entity.WeaponType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class HumanBeingRequest {
    @NotBlank(message = "Name must not be empty")
    private String name;

    @Valid
    @NotNull(message = "Coordinates must not be null")
    private CoordinatesRequest coordinates;

    private boolean realHero;

    private boolean hasToothpick;

    @Valid
    private CarRequest car;

    private Mood mood;

    @Max(value = 738, message = "Impact speed max is 738")
    private float impactSpeed;

    @NotNull(message = "Weapon type must not be null")
    private WeaponType weaponType;
}