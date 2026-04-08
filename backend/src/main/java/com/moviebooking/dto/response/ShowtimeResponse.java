package com.moviebooking.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowtimeResponse {

    private Long id;
    private LocalDate showDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Double basePrice;
    private Long movieId;
    private String movieTitle;
    private String posterUrl;
    private String trailerUrl;
    private String genre;
    private Integer durationMinutes;
    private String rated;
    private Long roomId;
    private String roomName;
    private Long cinemaId;
    private String cinemaName;
    private Integer availableSeats;
}
