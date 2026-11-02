package com.example.islab1.controller.api;

import com.example.islab1.entity.WeaponType;
import com.example.islab1.service.HumanBeingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/special-operations")
@RequiredArgsConstructor
public class SpecialOperationsController {

    private final HumanBeingService service;

    @GetMapping("/count-by-impact-speed-equal")
    public ResponseEntity<Map<String, Object>> countByImpactSpeedEqual(@RequestParam float value) {
        var list = service.findByImpactSpeed(value);
        return ResponseEntity.ok(Map.of(
                "count", list.size(),
                "items", list.stream().map(h -> "#" + h.getId() + " (" + h.getName() + ")").toList()
        ));
    }

    @GetMapping("/count-by-impact-speed-greater")
    public ResponseEntity<Map<String, Object>> countByImpactSpeedGreater(@RequestParam float value) {
        var list = service.findByImpactSpeedGreaterThan(value);
        return ResponseEntity.ok(Map.of(
                "count", list.size(),
                "items", list.stream().map(h -> "#" + h.getId() + " (" + h.getName() + ")").toList()
        ));
    }

    @GetMapping("/count-by-weapon-type-less")
    public ResponseEntity<Map<String, Object>> countByWeaponTypeLess(@RequestParam WeaponType value) {
        var list = service.findByWeaponTypeLessThan(value);
        return ResponseEntity.ok(Map.of(
                "count", list.size(),
                "items", list.stream().map(h -> "#" + h.getId() + " (" + h.getName() + ")").toList()
        ));
    }

    @GetMapping("/preview-delete-toothpick")
    public ResponseEntity<List<Map<String, Object>>> previewDeleteToothpick() {
        var list = service.getRealHeroesWithoutToothpickList();
        return ResponseEntity.ok(list.stream().map(h -> Map.of("id", (Object)h.getId(), "name", (Object)h.getName())).toList());
    }

    @GetMapping("/preview-transfer-lada")
    public ResponseEntity<List<Map<String, Object>>> previewTransferLada() {
        var list = service.getHeroesWithoutCarList();
        return ResponseEntity.ok(list.stream().map(h -> Map.of("id", (Object)h.getId(), "name", (Object)h.getName())).toList());
    }

    @DeleteMapping("/delete-heroes-without-toothpick")
    public ResponseEntity<Map<String, Object>> deleteHeroesWithoutToothpick() {
        var list = service.deleteRealHeroesWithoutToothpickList();
        return ResponseEntity.ok(Map.of(
                "deletedCount", list.size(),
                "items", list.stream().map(h -> "#" + h.getId() + " (" + h.getName() + ")").toList()
        ));
    }

    @PostMapping("/transfer-heroes-to-lada")
    public ResponseEntity<Map<String, Object>> transferHeroesToLada() {
        var list = service.transferHeroesToLadaKalinaList();
        return ResponseEntity.ok(Map.of(
                "transferredCount", list.size(),
                "items", list.stream().map(h -> "#" + h.getId() + " (" + h.getName() + ")").toList()
        ));
    }
}