package com.example.islab1.service;

import com.example.islab1.dto.request.CarRequest;
import com.example.islab1.entity.Car;
import com.example.islab1.mapper.HumanBeingMapper;
import com.example.islab1.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CarService {

    private final CarRepository carRepository;
    private final HumanBeingMapper mapper;

    public Car resolve(CarRequest request) {
        if (request == null) return null;
        if (request.getExistingId() != null) {
            return carRepository.findById(request.getExistingId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Car not found: " + request.getExistingId()));
        }
        if (request.getName() == null) return null;
        return carRepository.save(mapper.toCarEntity(request));
    }

    public Car getOrCreateLadaKalina() {
        return carRepository.findByName("Lada Kalina")
                .orElseGet(() -> carRepository.save(Car.builder().name("Lada Kalina").build()));
    }
}