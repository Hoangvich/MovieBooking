package com.moviebooking.dto.response;

import com.moviebooking.enums.BookingStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

    private Long id;
    private String bookingCode;
    private Double totalAmount;
    private BookingStatus status;
    private LocalDateTime bookingTime;
    private String movieTitle;
    private String cinemaName;
    private String roomName;
    private String showDate;
    private String startTime;
    private List<BookingDetailResponse> seats;
    private PaymentResponse payment;
}
