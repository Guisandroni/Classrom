package com.guisandroni.classroom.management.Entity;

import com.guisandroni.classroom.management.Class.Entity.Class;
import com.guisandroni.classroom.management.Enum.ResourcesType;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table (name = "resources")
public class Resource {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "class_id")
    private Class classEntity;

    @Enumerated (EnumType.STRING)
    private ResourcesType resourceType;

    @Column(length = 100, nullable = false)
    private Boolean previousAccess;

    @Column(length = 100, nullable = false)
    private Boolean draft;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 100, nullable = false)
    private String description;
}

