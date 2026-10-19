package com.example.islab1.mapper;

import com.example.islab1.dto.request.CarRequest;
import com.example.islab1.dto.request.CoordinatesRequest;
import com.example.islab1.entity.Car;
import com.example.islab1.entity.Coordinates;
import org.springframework.stereotype.Component;

@Component
public class HumanBeingMapper {

    public Coordinates toCoordinatesEntity(CoordinatesRequest req) {
        return Coordinates.builder()
                .x(req.getX())
                .y(req.getY())
                .build();
    }

    public Car toCarEntity(CarRequest req) {
        if (req == null || req.getName() == null) return null;
        return Car.builder()
                .name(req.getName())
                .build();
    }
}