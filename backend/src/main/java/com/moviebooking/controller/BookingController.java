package com.moviebooking.controller;

import com.moviebooking.dto.request.BookingRequest;
import com.moviebooking.dto.response.ApiResponse;
import com.moviebooking.dto.response.BookingResponse;
import com.moviebooking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Booking", description = "API đặt vé xem phim")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Đặt vé xem phim")
    public ResponseEntity<ApiResponse<BookingResponse>> create(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Đặt vé thành công", bookingService.createBooking(request, userDetails.getUsername())));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết đặt vé")
    public ResponseEntity<ApiResponse<BookingResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getById(id)));
    }

    @GetMapping("/me")
    @Operation(summary = "Lịch sử đặt vé của tôi")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getMyBookings(userDetails.getUsername())));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Hủy đặt vé")
    public ResponseEntity<ApiResponse<Void>> cancel(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        bookingService.cancelBooking(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Hủy vé thành công", null));
    }

    @GetMapping("/code/{bookingCode}")
    @Operation(summary = "Tra cứu vé theo mã đặt vé")
    public ResponseEntity<ApiResponse<BookingResponse>> getByCode(@PathVariable String bookingCode) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getByBookingCode(bookingCode)));
    }
}
