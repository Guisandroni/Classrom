package com.guisandroni.classroom.management.Training.Controller;

import com.guisandroni.classroom.management.Training.DTO.TrainingRequest;
import com.guisandroni.classroom.management.Training.DTO.TrainingResponse;
import com.guisandroni.classroom.management.Training.Service.TrainingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainings")
@RequiredArgsConstructor
public class TrainingController {

    private final TrainingService trainingService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TrainingResponse>> findAll() {
        return ResponseEntity.ok(trainingService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userAuthService.isEnrolledInTraining(#id)")
    public ResponseEntity<TrainingResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(trainingService.findById(id));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<TrainingResponse>> findMyTrainings() {
        return ResponseEntity.ok(trainingService.findTrainingsForCurrentUser());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrainingResponse> create(@Valid @RequestBody TrainingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(trainingService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrainingResponse> update(@PathVariable Long id, @Valid @RequestBody TrainingRequest request) {
        return ResponseEntity.ok(trainingService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        trainingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
