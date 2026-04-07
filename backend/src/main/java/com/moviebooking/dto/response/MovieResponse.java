package com.moviebooking.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieResponse {

    private Long id;
    private String title;
    private String description;
    private Integer durationMinutes;
    private String genre;
    private String director;
    private String castMembers;
    private String posterUrl;
    private String trailerUrl;
    private LocalDate releaseDate;
    private LocalDate endDate;
    private String language;
    private String rated;
    private Boolean active;
}
