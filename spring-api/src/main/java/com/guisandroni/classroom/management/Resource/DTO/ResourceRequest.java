package com.guisandroni.classroom.management.Resource.DTO;

import com.guisandroni.classroom.management.Resource.Enum.ResourcesType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceRequest {

    @NotNull(message = "Class ID is required")
    private Long classId;

    @NotNull(message = "Resource type is required")
    private ResourcesType resourceType;

    @NotNull(message = "Previous access field is required")
    private Boolean previousAccess;

    @NotNull(message = "Draft field is required")
    private Boolean draft;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Size(max = 500, message = "Description must be at most 500 characters")
    private String description;
}
