package com.guisandroni.classroom.management.Class.Repository;

import com.guisandroni.classroom.management.Class.Entity.Class;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassRepository extends JpaRepository<Class, Long> {
    List<Class> findByName(String className);
    List<Class> findByTrainingId(Long trainingId);
}
