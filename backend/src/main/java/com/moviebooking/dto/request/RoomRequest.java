package com.moviebooking.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomRequest {

    @NotBlank(message = "Tên phòng không được để trống")
    private String name;

    @NotNull(message = "Cinema ID không được để trống")
    private Long cinemaId;

    @NotNull(message = "Số hàng ghế không được để trống")
    @Min(value = 1)
    private Integer seatRows;

    @NotNull(message = "Số cột ghế không được để trống")
    @Min(value = 1)
    private Integer seatColumns;
}
