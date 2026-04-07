package com.moviebooking.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequest {

    @NotNull(message = "Showtime ID không được để trống")
    private Long showtimeId;

    @NotEmpty(message = "Danh sách ghế không được để trống")
    private List<Long> seatIds;
}
