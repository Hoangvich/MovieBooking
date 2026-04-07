package com.moviebooking.service.impl;

import com.moviebooking.dto.request.BookingRequest;
import com.moviebooking.dto.response.BookingDetailResponse;
import com.moviebooking.dto.response.BookingResponse;
import com.moviebooking.dto.response.PaymentResponse;
import com.moviebooking.entity.*;
import com.moviebooking.enums.BookingStatus;
import com.moviebooking.exception.BadRequestException;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.repository.*;
import com.moviebooking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

    @Override
    public BookingResponse createBooking(BookingRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new ResourceNotFoundException("Showtime", "id", request.getShowtimeId()));

        // Check if seats are already booked
        List<Long> bookedSeatIds = bookingRepository.findBookedSeatIdsByShowtimeId(showtime.getId());
        for (Long seatId : request.getSeatIds()) {
            if (bookedSeatIds.contains(seatId)) {
                throw new BadRequestException("Ghế ID " + seatId + " đã được đặt cho suất chiếu này");
            }
        }

        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());
        if (seats.size() != request.getSeatIds().size()) {
            throw new BadRequestException("Một số ghế không tồn tại");
        }

        // Validate seats belong to the showtime's room
        for (Seat seat : seats) {
            if (!seat.getRoom().getId().equals(showtime.getRoom().getId())) {
                throw new BadRequestException("Ghế " + seat.getRowName() + seat.getSeatNumber() + " không thuộc phòng chiếu này");
            }
        }

        double totalAmount = seats.stream().mapToDouble(Seat::getPrice).sum();

        String bookingCode = "MB" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Booking booking = Booking.builder()
                .bookingCode(bookingCode)
                .user(user)
                .showtime(showtime)
                .totalAmount(totalAmount)
                .status(BookingStatus.PENDING)
                .bookingTime(LocalDateTime.now())
                .build();

        booking = bookingRepository.save(booking);

        Booking finalBooking = booking;
        List<BookingDetail> details = seats.stream()
                .map(seat -> BookingDetail.builder()
                        .booking(finalBooking)
                        .seat(seat)
                        .price(seat.getPrice())
                        .build())
                .toList();
        booking.setBookingDetails(new java.util.ArrayList<>(details));
        booking = bookingRepository.save(booking);

        return toResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
        return toResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return bookingRepository.findByUserIdOrderByBookingTimeDesc(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void cancelBooking(Long id, String username) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        if (!booking.getUser().getUsername().equals(username)) {
            throw new BadRequestException("Bạn không có quyền hủy đặt vé này");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Đặt vé này đã được hủy trước đó");
        }

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            throw new BadRequestException("Không thể hủy vé đã được xác nhận thanh toán");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getByBookingCode(String bookingCode) {
        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "bookingCode", bookingCode));
        return toResponse(booking);
    }

    private BookingResponse toResponse(Booking booking) {
        Showtime showtime = booking.getShowtime();

        List<BookingDetailResponse> seatResponses = booking.getBookingDetails().stream()
                .map(detail -> BookingDetailResponse.builder()
                        .rowName(detail.getSeat().getRowName())
                        .seatNumber(detail.getSeat().getSeatNumber())
                        .seatType(detail.getSeat().getSeatType())
                        .price(detail.getPrice())
                        .build())
                .toList();

        PaymentResponse paymentResponse = null;
        if (booking.getPayment() != null) {
            Payment payment = booking.getPayment();
            paymentResponse = PaymentResponse.builder()
                    .id(payment.getId())
                    .amount(payment.getAmount())
                    .paymentMethod(payment.getPaymentMethod())
                    .status(payment.getStatus())
                    .transactionId(payment.getTransactionId())
                    .paymentTime(payment.getPaymentTime())
                    .build();
        }

        return BookingResponse.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus())
                .bookingTime(booking.getBookingTime())
                .movieTitle(showtime.getMovie().getTitle())
                .cinemaName(showtime.getRoom().getCinema().getName())
                .roomName(showtime.getRoom().getName())
                .showDate(showtime.getShowDate().toString())
                .startTime(showtime.getStartTime().toString())
                .seats(seatResponses)
                .payment(paymentResponse)
                .build();
    }
}
