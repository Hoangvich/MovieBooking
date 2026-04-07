package com.moviebooking.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowtimeRequest {

    @NotNull(message = "Movie ID không được để trống")
    private Long movieId;

    @NotNull(message = "Room ID không được để trống")
    private Long roomId;

    @NotNull(message = "Ngày chiếu không được để trống")
    private LocalDate showDate;

    @NotNull(message = "Giờ bắt đầu không được để trống")
    private LocalTime startTime;

    @NotNull(message = "Giá vé cơ bản không được để trống")
    private Double basePrice;
}
