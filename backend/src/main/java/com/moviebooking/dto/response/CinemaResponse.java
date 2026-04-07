package com.moviebooking.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CinemaResponse {

    private Long id;
    private String name;
    private String address;
    private String city;
    private String phoneNumber;
    private Boolean active;
}
