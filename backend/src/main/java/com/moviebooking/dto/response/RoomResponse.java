package com.moviebooking.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomResponse {

    private Long id;
    private String name;
    private Integer totalSeats;
    private Integer seatRows;
    private Integer seatColumns;
    private Long cinemaId;
    private String cinemaName;
    private Boolean active;
}
