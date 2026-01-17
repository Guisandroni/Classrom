package com.guisandroni.classroom.management.Resource.Service;

import com.guisandroni.classroom.management.Class.Entity.Class;
import com.guisandroni.classroom.management.Class.Repository.ClassRepository;
import com.guisandroni.classroom.management.Resource.DTO.ResourceRequest;
import com.guisandroni.classroom.management.Resource.DTO.ResourceResponse;
import com.guisandroni.classroom.management.Resource.Entity.Resource;
import com.guisandroni.classroom.management.Resource.Mapper.ResourceMapper;
import com.guisandroni.classroom.management.Resource.Repository.ResourceRepository;
import com.guisandroni.classroom.management.Exception.ResourceNotFoundException;
import com.guisandroni.classroom.management.Training.DTO.TrainingRequest;
import com.guisandroni.classroom.management.Training.DTO.TrainingResponse;
import com.guisandroni.classroom.management.Training.Entity.Training;
import com.guisandroni.classroom.management.Training.Mapper.TrainingMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final ClassRepository classRepository;

    @Transactional(readOnly = true)
    public List<ResourceResponse> findAll() {
        return resourceRepository.findAll()
                .stream()
                .map(ResourceMapper::toResourceResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ResourceResponse findById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        return ResourceMapper.toResourceResponse(resource);
    }

    @Transactional(readOnly = true)
    public List<ResourceResponse> findByClassId(Long classId) {
        return resourceRepository.findByClassEntityId(classId)
                .stream()
                .map(ResourceMapper::toResourceResponse)
                .toList();
    }

    @Transactional
    public ResourceResponse create(ResourceRequest request) {

        Resource resource = ResourceMapper.toResource(request);
        resource = resourceRepository.save(resource);
        return ResourceMapper.toResourceResponse(resource);
    }


    @Transactional
    public ResourceResponse update(Long id, ResourceRequest request) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        Class classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));

        ResourceMapper.updateResource(resource, request, classEntity);
        resource = resourceRepository.save(resource);
        return ResourceMapper.toResourceResponse(resource);
    }

    @Transactional
    public void delete(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new RuntimeException("Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }
}
