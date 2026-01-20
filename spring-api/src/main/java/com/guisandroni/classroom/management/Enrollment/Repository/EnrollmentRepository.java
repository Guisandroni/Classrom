package com.guisandroni.classroom.management.Enrollment.Repository;

import com.guisandroni.classroom.management.Enrollment.Entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByClassEntityId(Long classId);
    List<Enrollment> findByStudentEntityId(Long studentId);
    Optional<Enrollment> findByClassEntityIdAndStudentEntityId(Long classId, Long studentId);
    boolean existsByClassEntityIdAndStudentEntityId(Long classId, Long studentId);

    @Query("SELECT COUNT(e) > 0 FROM Enrollment e WHERE e.studentEntity.id = :studentId AND e.classEntity.training.id = :trainingId")
    boolean existsByStudentIdAndTrainingId(@Param("studentId") Long studentId, @Param("trainingId") Long trainingId);
}
