package com.guisandroni.classroom.management.Repository;

import com.guisandroni.classroom.management.Entity.Enrollment;
import com.guisandroni.classroom.management.Entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository  extends JpaRepository<Resource, Long> {
}
