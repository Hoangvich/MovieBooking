package com.moviebooking.repository;

import com.moviebooking.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    List<Movie> findByTitleContainingIgnoreCase(String title);

    List<Movie> findByGenreContainingIgnoreCase(String genre);

    @Query("SELECT m FROM Movie m WHERE m.releaseDate <= :date AND (m.endDate IS NULL OR m.endDate >= :date) AND m.active = true")
    List<Movie> findNowShowing(@Param("date") LocalDate date);

    @Query("SELECT m FROM Movie m WHERE m.releaseDate > :date AND m.active = true")
    List<Movie> findComingSoon(@Param("date") LocalDate date);

    List<Movie> findByActiveTrue();
}
