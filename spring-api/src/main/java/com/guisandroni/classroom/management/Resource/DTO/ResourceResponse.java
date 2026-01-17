package com.guisandroni.classroom.management.Resource.DTO;

import com.guisandroni.classroom.management.Resource.Enum.ResourcesType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceResponse {
    private Long id;
    private Long classId;
    private String className;
    private ResourcesType resourceType;
    private Boolean previousAccess;
    private Boolean draft;
    private String name;
    private String description;
}
