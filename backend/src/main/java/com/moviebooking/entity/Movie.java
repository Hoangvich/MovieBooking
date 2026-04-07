package com.moviebooking.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "movies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(length = 100)
    private String genre;

    @Column(length = 100)
    private String director;

    @Column(name = "cast_members", length = 500)
    private String castMembers;

    @Column(name = "poster_url", length = 500)
    private String posterUrl;

    @Column(name = "trailer_url", length = 500)
    private String trailerUrl;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(length = 10)
    private String language;

    @Column(length = 10)
    private String rated;

    @Column(nullable = false)
    private Boolean active = true;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    private List<Showtime> showtimes = new ArrayList<>();
}
