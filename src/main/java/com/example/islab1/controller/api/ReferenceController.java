package com.example.islab1.controller.api;

import com.example.islab1.repository.CarRepository;
import com.example.islab1.repository.CoordinatesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReferenceController {

    private final CoordinatesRepository coordinatesRepo;
    private final CarRepository carRepo;

    @GetMapping("/coordinates")
    public Object getAllCordinates() {
        return coordinatesRepo.findAll();
    }

    @GetMapping("/cars")
    public Object getAllCars() {
        return carRepo.findAll();
    }
}
