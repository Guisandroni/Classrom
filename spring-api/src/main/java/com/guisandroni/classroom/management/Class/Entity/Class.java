package com.guisandroni.classroom.management.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table (name = "class")
public class Class {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private Training training;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 100, nullable = false)
    private LocalDateTime StartDate;

    @Column(length = 100, nullable = false)
    private LocalDateTime EndDate;

    @Column(length = 100, nullable = false)
    private String acessLink;


    @OneToMany(mappedBy = "resource")
    private List<Resource> resources;

    @OneToMany(mappedBy = "enrollment")
    private List<Enrollment> enrollments;

}
