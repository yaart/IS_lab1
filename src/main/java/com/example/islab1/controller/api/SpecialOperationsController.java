package com.example.islab1.controller.api;

import com.example.islab1.entity.WeaponType;
import com.example.islab1.service.HumanBeingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/special-operations")
@RequiredArgsConstructor
public class SpecialOperationsController {

    private final HumanBeingService service;

    @GetMapping("/count-by-impact-speed-equal")
    public ResponseEntity<Map<String, Long>> countByImpactSpeedEqual(@RequestParam float value) {
        return ResponseEntity.ok(Map.of("count", service.countByImpactSpeed(value)));
    }

    @GetMapping("/count-by-impact-speed-greater")
    public ResponseEntity<Map<String, Long>> countByImpactSpeedGreater(@RequestParam float value) {
        return ResponseEntity.ok(Map.of("count", service.countByImpactSpeedGreaterThan(value)));
    }

    @GetMapping("/count-by-weapon-type-less")
    public ResponseEntity<Map<String, Long>> countByWeaponTypeLess(@RequestParam WeaponType value) {
        return ResponseEntity.ok(Map.of("count", service.countByWeaponTypeLessThan(value)));
    }

    @DeleteMapping("/delete-heroes-without-toothpick")
    public ResponseEntity<Map<String, Integer>> deleteHeroesWithoutToothpick() {
        int count = service.deleteRealHeroesWithoutToothpick();
        return ResponseEntity.ok(Map.of("deletedCount", count));
    }

    @PostMapping ("/transfer-heroes-to-lada")
    public ResponseEntity<Map<String, Integer>> transferHeroesToLada() {
        int count = service.transferHeroesToLadaKalina();
        return ResponseEntity.ok(Map.of("transferredCount", count));
    }
}