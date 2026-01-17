package com.guisandroni.classroom.management.Training.Repository;

import com.guisandroni.classroom.management.Training.Entity.Training;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrainingRepository extends JpaRepository<Training, Long> {
    Optional<Training> findByName(String name);
    boolean existsByName(String name);
}
