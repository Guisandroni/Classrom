package com.guisandroni.classroom.management.Resource.Entity;

import com.guisandroni.classroom.management.Class.Entity.Class;
import com.guisandroni.classroom.management.Resource.Enum.ResourcesType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private Class classEntity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourcesType resourceType;

    @Column(nullable = false)
    private Boolean previousAccess;

    @Column(nullable = false)
    private Boolean draft;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 500)
    private String description;
}

