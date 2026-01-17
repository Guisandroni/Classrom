package com.guisandroni.classroom.management.Class.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassResponse {
    private Long id;
    private Long trainingId;
    private String trainingName;
    private String name;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String accessLink;
}
