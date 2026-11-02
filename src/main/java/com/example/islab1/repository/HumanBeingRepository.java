package com.example.islab1.repository;

import com.example.islab1.entity.HumanBeing;
import com.example.islab1.entity.WeaponType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HumanBeingRepository extends JpaRepository<HumanBeing, Integer>,
        JpaSpecificationExecutor<HumanBeing> {

    long countByImpactSpeed(float impactSpeed);

    List<HumanBeing> findByImpactSpeed(float impactSpeed);

    long countByWeaponTypeOrderByWeaponType(WeaponType weaponType);

    long countByImpactSpeedGreaterThan(float impactSpeed);

    List<HumanBeing> findByImpactSpeedGreaterThan(float impactSpeed);

    long countByImpactSpeedLessThan(float impactSpeed);

    @Query("SELECT h FROM HumanBeing h LEFT JOIN FETCH h.car")
    List<HumanBeing> findAllWithCar();

    @Query("SELECT h FROM HumanBeing h WHERE h.realHero = true AND h.hasToothpick = false")
    List<HumanBeing> findRealHeroesWithoutToothpick();

    long countByWeaponTypeIn(List<WeaponType> types);

    List<HumanBeing> findByWeaponTypeIn(List<WeaponType> types);

    List<HumanBeing> findByRealHeroTrueAndCarIsNull();

    long countByCoordinatesId(Long id);

    long countByCarId(Long carId);
}