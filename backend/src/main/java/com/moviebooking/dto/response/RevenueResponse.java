package com.moviebooking.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevenueResponse {

    private Double totalRevenue;
    private Long totalBookings;
    private Long totalTicketsSold;
    private String period;
}
