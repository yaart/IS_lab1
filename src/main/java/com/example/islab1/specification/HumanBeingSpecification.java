package com.example.islab1.specification;

import com.example.islab1.entity.HumanBeing;
import org.springframework.data.jpa.domain.Specification;

public class HumanBeingSpecification {

    public static Specification<HumanBeing> filterByName(String name) {
        return (root, query, cb) -> {
            if (name == null || name.isBlank()) return null;
            return cb.equal(cb.lower(root.get("name")), name.toLowerCase().trim());
        };
    }

    public static Specification<HumanBeing> filterByMood(String mood) {
        return (root, query, cb) -> {
            if (mood == null || mood.isBlank()) return null;
            return cb.equal(cb.lower(root.get("mood").as(String.class)), mood.toLowerCase().trim());
        };
    }

    public static Specification<HumanBeing> filterByWeaponType(String weaponType) {
        return (root, query, cb) -> {
            if (weaponType == null || weaponType.isBlank()) return null;
            return cb.equal(cb.lower(root.get("weaponType").as(String.class)), weaponType.toLowerCase().trim());
        };
    }

    public static Specification<HumanBeing> filterByCarName(String carName) {
        return (root, query, cb) -> {
            if (carName == null || carName.isBlank()) return null;
            return cb.equal(cb.lower(root.get("car").get("name")), carName.toLowerCase().trim());
        };
    }
}