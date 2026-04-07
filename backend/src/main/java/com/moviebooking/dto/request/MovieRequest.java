package com.moviebooking.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieRequest {

    @NotBlank(message = "Tên phim không được để trống")
    private String title;

    private String description;

    @NotNull(message = "Thời lượng không được để trống")
    @Min(value = 1, message = "Thời lượng phải lớn hơn 0")
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
}
