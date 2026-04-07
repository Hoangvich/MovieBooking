package com.moviebooking.dto.response;

import com.moviebooking.enums.SeatType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatResponse {

    private Long id;
    private String rowName;
    private Integer seatNumber;
    private SeatType seatType;
    private Double price;
    private Boolean available;
}
