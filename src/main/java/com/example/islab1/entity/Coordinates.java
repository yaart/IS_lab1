package com.example.islab1.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Check;
import org.hibernate.annotations.Checks;

@Entity
@Table(name = "coordinates")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Checks({
    @Check(constraints = "x <= 256"),
    @Check(constraints = "y > -533")
})
public class Coordinates {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "x", nullable = false)
    private Float x;

    @Column(name = "y", nullable = false)
    private float y;
}