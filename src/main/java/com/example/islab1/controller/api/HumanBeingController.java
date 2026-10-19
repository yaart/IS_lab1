package com.example.islab1.controller.api;

import com.example.islab1.dto.request.HumanBeingRequest;
import com.example.islab1.entity.HumanBeing;
import com.example.islab1.service.HumanBeingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/human-beings")
@RequiredArgsConstructor
public class HumanBeingController {

    private final HumanBeingService service;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String filterName,
            @RequestParam(required = false) String filterMood,
            @RequestParam(required = false) String filterWeaponType,
            @RequestParam(required = false) String filterCarName) {

        Page<HumanBeing> result = service.findAll(page, size, sortBy, sortDir,
                filterName, filterMood, filterWeaponType, filterCarName);

        return ResponseEntity.ok(Map.of(
                "content", result.getContent(),
                "totalPages", result.getTotalPages(),
                "totalElements", result.getTotalElements(),
                "currentPage", result.getNumber(),
                "pageSize", result.getSize()
        ));
    }

    @GetMapping("/{id}")
    public HumanBeing getById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    public HumanBeing create(@Valid @RequestBody HumanBeingRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public HumanBeing update(@PathVariable Integer id,
                              @Valid @RequestBody HumanBeingRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}