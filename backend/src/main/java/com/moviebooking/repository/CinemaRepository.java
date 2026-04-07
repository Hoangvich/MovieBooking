package com.moviebooking.repository;

import com.moviebooking.entity.Cinema;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CinemaRepository extends JpaRepository<Cinema, Long> {

    List<Cinema> findByCityIgnoreCase(String city);

    List<Cinema> findByActiveTrue();

    List<Cinema> findByNameContainingIgnoreCase(String name);
}
