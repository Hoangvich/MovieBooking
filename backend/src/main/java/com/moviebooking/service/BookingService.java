package com.moviebooking.service;

import com.moviebooking.dto.request.BookingRequest;
import com.moviebooking.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(BookingRequest request, String username);

    BookingResponse getById(Long id);

    List<BookingResponse> getMyBookings(String username);

    void cancelBooking(Long id, String username);

    BookingResponse getByBookingCode(String bookingCode);
}
