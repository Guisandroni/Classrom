package com.guisandroni.classroom.management.Class.Mapper;

import com.guisandroni.classroom.management.Class.DTO.ClassRequest;
import com.guisandroni.classroom.management.Class.DTO.ClassResponse;
import com.guisandroni.classroom.management.Class.Entity.Class;
import com.guisandroni.classroom.management.Training.Entity.Training;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ClassMapper {

    public static Class toClass(ClassRequest request, Training training) {
        return Class.builder()
                .training(training)
                .name(request.getName())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .accessLink(request.getAccessLink())
                .build();
    }

    public static ClassResponse toClassResponse(Class classEntity) {
        return ClassResponse.builder()
                .id(classEntity.getId())
                .trainingId(classEntity.getTraining().getId())
                .trainingName(classEntity.getTraining().getName())
                .name(classEntity.getName())
                .startDate(classEntity.getStartDate())
                .endDate(classEntity.getEndDate())
                .accessLink(classEntity.getAccessLink())
                .build();
    }

    public static void updateClass(Class classEntity, ClassRequest request, Training training) {
        classEntity.setTraining(training);
        classEntity.setName(request.getName());
        classEntity.setStartDate(request.getStartDate());
        classEntity.setEndDate(request.getEndDate());
        classEntity.setAccessLink(request.getAccessLink());
    }
}
