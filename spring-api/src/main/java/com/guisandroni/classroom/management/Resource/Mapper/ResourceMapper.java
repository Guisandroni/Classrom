package com.guisandroni.classroom.management.Resource.Mapper;

import com.guisandroni.classroom.management.Class.Entity.Class;
import com.guisandroni.classroom.management.Resource.DTO.ResourceRequest;
import com.guisandroni.classroom.management.Resource.DTO.ResourceResponse;
import com.guisandroni.classroom.management.Resource.Entity.Resource;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ResourceMapper {

    public static Resource toResource(ResourceRequest request) {
        return Resource.builder()
                .resourceType(request.getResourceType())
                .previousAccess(request.getPreviousAccess())
                .draft(request.getDraft())
                .name(request.getName())
                .description(request.getDescription())
                .build();
    }

    public static ResourceResponse toResourceResponse(Resource resource) {
        return ResourceResponse.builder()
                .id(resource.getId())
                .classId(resource.getClassEntity().getId())
                .className(resource.getClassEntity().getName())
                .resourceType(resource.getResourceType())
                .previousAccess(resource.getPreviousAccess())
                .draft(resource.getDraft())
                .name(resource.getName())
                .description(resource.getDescription())
                .build();
    }

    public static void updateResource(Resource resource, ResourceRequest request, Class classEntity) {
        resource.setClassEntity(classEntity);
        resource.setResourceType(request.getResourceType());
        resource.setPreviousAccess(request.getPreviousAccess());
        resource.setDraft(request.getDraft());
        resource.setName(request.getName());
        resource.setDescription(request.getDescription());
    }
}
