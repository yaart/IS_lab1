package com.example.islab1.service;

import com.example.islab1.dto.request.HumanBeingRequest;
import com.example.islab1.entity.HumanBeing;
import com.example.islab1.entity.WeaponType;
import com.example.islab1.exception.BusinessException;
import com.example.islab1.repository.HumanBeingRepository;
import com.example.islab1.specification.HumanBeingSpecification;
import com.example.islab1.websocket.ChangeType;
import com.example.islab1.websocket.EntityChangePublisher;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Validated
public class HumanBeingService {

    private final HumanBeingRepository repository;
    private final CoordinatesService coordinatesService;
    private final CarService carService;
    private final EntityChangePublisher publisher;

    public Page<HumanBeing> findAll(int page, int size, String sortBy, String sortDir,
                                     String filterName, String filterMood, String filterWeaponType,
                                     String filterCarName) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Specification<HumanBeing> spec = Specification.where(null);
        if (filterName != null && !filterName.isBlank()) {
            spec = spec.and(HumanBeingSpecification.filterByName(filterName));
        }
        if (filterMood != null && !filterMood.isBlank()) {
            spec = spec.and(HumanBeingSpecification.filterByMood(filterMood));
        }
        if (filterWeaponType != null && !filterWeaponType.isBlank()) {
            spec = spec.and(HumanBeingSpecification.filterByWeaponType(filterWeaponType));
        }
        if (filterCarName != null && !filterCarName.isBlank()) {
            spec = spec.and(HumanBeingSpecification.filterByCarName(filterCarName));
        }
        return repository.findAll(spec, PageRequest.of(page, size, sort));
    }

    public HumanBeing findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("HumanBeing not found: " + id));
    }

    public HumanBeing create(@Valid HumanBeingRequest request) {
        var human = HumanBeing.builder()
                .name(request.getName())
                .coordinates(coordinatesService.resolve(request.getCoordinates()))
                .realHero(request.isRealHero())
                .hasToothpick(request.isHasToothpick())
                .car(carService.resolve(request.getCar()))
                .mood(request.getMood())
                .impactSpeed(request.getImpactSpeed())
                .weaponType(request.getWeaponType())
                .build();
        var saved = repository.save(human);
        publisher.publish(saved.getId(), ChangeType.CREATED);
        return saved;
    }

    public HumanBeing update(Integer id, @Valid HumanBeingRequest request) {
        var existing = findById(id);
        existing.setName(request.getName());
        existing.setCoordinates(coordinatesService.resolve(request.getCoordinates()));
        existing.setRealHero(request.isRealHero());
        existing.setHasToothpick(request.isHasToothpick());
        existing.setCar(carService.resolve(request.getCar()));
        existing.setMood(request.getMood());
        existing.setImpactSpeed(request.getImpactSpeed());
        existing.setWeaponType(request.getWeaponType());
        var saved = repository.save(existing);
        publisher.publish(saved.getId(), ChangeType.UPDATED);
        return saved;
    }

    public void delete(Integer id) {
        var human = findById(id);

        var coordsId = human.getCoordinates().getId();
        var coordsUsed = repository.countByCoordinatesId(coordsId);
        if (coordsUsed > 1) {
            throw new BusinessException(
                "Невозможно удалить объект #" + id + ": его координаты используются " +
                (coordsUsed) + " объектами. Удалите связанные объекты сначала.");
        }

        if (human.getCar() != null) {
            var carId = human.getCar().getId();
            var carUsed = repository.countByCarId(carId);
            if (carUsed > 1) {
                throw new BusinessException(
                    "Невозможно удалить объект #" + id + ": его машина используется " +
                    (carUsed) + " объектами. Удалите связанные объекты сначала.");
            }
        }

        repository.delete(human);
        publisher.publish(id, ChangeType.DELETED);
    }

    public boolean canDelete(Integer id) {
        return repository.findById(id).isPresent();
    }


    public long countByImpactSpeed(float impactSpeed) {
        return repository.countByImpactSpeed(impactSpeed);
    }

    public long countByWeaponTypeLessThan(WeaponType weaponType) {
        var types = Arrays.stream(WeaponType.values())
                .filter(w -> w.ordinal() < weaponType.ordinal())
                .toList();
        if (types.isEmpty()) return 0;
        return repository.countByWeaponTypeIn(types);
    }

    public long countByImpactSpeedGreaterThan(float impactSpeed) {
        return repository.countByImpactSpeedGreaterThan(impactSpeed);
    }

    public int deleteRealHeroesWithoutToothpick() {
        var heroes = repository.findRealHeroesWithoutToothpick();
        repository.deleteAll(heroes);
        for (var h : heroes) {
            publisher.publish(h.getId(), ChangeType.DELETED);
        }
        return heroes.size();
    }

    public int transferHeroesToLadaKalina() {
        var lada = carService.getOrCreateLadaKalina();
        var heroes = repository.findByRealHeroTrueAndCarIsNull();
        for (var h : heroes) {
            h.setCar(lada);
        }
        repository.saveAll(heroes);
        for (var h : heroes) {
            publisher.publish(h.getId(), ChangeType.UPDATED);
        }
        return heroes.size();
    }
}