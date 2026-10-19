package com.example.islab1.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.Check;
import org.hibernate.annotations.Checks;
import java.time.LocalDateTime;

@Entity
@Table(name = "human_being")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Checks({
    @Check(constraints = "char_length(trim(name)) > 0"),
    @Check(constraints = "impact_speed <= 738")
})
public class HumanBeing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false)
    @NotBlank(message = "Name must not be empty")
    private String name;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "coordinates_id", nullable = false)
    @NotNull(message = "Coordinates must not be null")
    private Coordinates coordinates;

    @Column(name = "creation_date", nullable = false, updatable = false)
    private LocalDateTime creationDate;

    @Column(name = "real_hero", nullable = false)
    private boolean realHero;

    @Column(name = "has_toothpick", nullable = false)
    private boolean hasToothpick;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "car_id")
    private Car car;

    @Enumerated(EnumType.STRING)
    @Column(name = "mood")
    private Mood mood;

    @Column(name = "impact_speed")
    @Max(738)
    private float impactSpeed;

    @Enumerated(EnumType.STRING)
    @Column(name = "weapon_type", nullable = false)
    @NotNull(message = "Weapon type must not be null")
    private WeaponType weaponType;

    @PrePersist
    protected void onCreate() {
        if (creationDate == null) {
            creationDate = LocalDateTime.now();
        }
    }
}