package com.example.islab1.service;

import com.example.islab1.dto.request.CoordinatesRequest;
import com.example.islab1.entity.Coordinates;
import com.example.islab1.mapper.HumanBeingMapper;
import com.example.islab1.repository.CoordinatesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CoordinatesService {

    private final CoordinatesRepository coordinatesRepository;
    private final HumanBeingMapper mapper;

    public Coordinates resolve(CoordinatesRequest request) {
        if (request.getExistingId() != null) {
            return coordinatesRepository.findById(request.getExistingId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Coordinates not found: " + request.getExistingId()));
        }
        return coordinatesRepository.save(mapper.toCoordinatesEntity(request));
    }
}