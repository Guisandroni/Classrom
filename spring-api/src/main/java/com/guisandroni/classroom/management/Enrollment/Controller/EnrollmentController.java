package com.guisandroni.classroom.management.Enrollment.Controller;

import com.guisandroni.classroom.management.Enrollment.DTO.EnrollmentRequest;
import com.guisandroni.classroom.management.Enrollment.DTO.EnrollmentResponse;
import com.guisandroni.classroom.management.Enrollment.Service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping
    public ResponseEntity<List<EnrollmentResponse>> findAll() {
        return ResponseEntity.ok(enrollmentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnrollmentResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(enrollmentService.findById(id));
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<EnrollmentResponse>> findByClassId(@PathVariable Long classId) {
        return ResponseEntity.ok(enrollmentService.findByClassId(classId));
    }


    @PostMapping
    public ResponseEntity<EnrollmentResponse> create(@Valid @RequestBody EnrollmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollmentService.create(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        enrollmentService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
