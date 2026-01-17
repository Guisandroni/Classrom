package com.guisandroni.classroom.management.Resource.Repository;

import com.guisandroni.classroom.management.Resource.Entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByClassEntityId(Long classId);
}
