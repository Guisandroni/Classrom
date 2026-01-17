package com.guisandroni.classroom.management.Training.Mapper;

import com.guisandroni.classroom.management.Training.DTO.TrainingRequest;
import com.guisandroni.classroom.management.Training.DTO.TrainingResponse;
import com.guisandroni.classroom.management.Training.Entity.Training;
import lombok.experimental.UtilityClass;

@UtilityClass
public class TrainingMapper {

    public static Training toTraining(TrainingRequest request) {
        return Training.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
    }

    public static TrainingResponse toTrainingResponse(Training training) {
        return TrainingResponse.builder()
                .id(training.getId())
                .name(training.getName())
                .description(training.getDescription())
                .build();
    }

    public static void updateTraining(Training training, TrainingRequest request) {
        training.setName(request.getName());
        training.setDescription(request.getDescription());
    }
}
