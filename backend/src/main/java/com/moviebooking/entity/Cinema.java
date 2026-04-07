package com.moviebooking.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cinemas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cinema extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 500)
    private String address;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @Column(nullable = false)
    private Boolean active = true;

    @OneToMany(mappedBy = "cinema", cascade = CascadeType.ALL)
    private List<Room> rooms = new ArrayList<>();
}
