package com.moviebooking.repository;

import com.moviebooking.entity.Booking;
import com.moviebooking.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByBookingTimeDesc(Long userId);

    Optional<Booking> findByBookingCode(String bookingCode);

    @Query("SELECT bd.seat.id FROM BookingDetail bd WHERE bd.booking.showtime.id = :showtimeId AND bd.booking.status != 'CANCELLED'")
    List<Long> findBookedSeatIdsByShowtimeId(@Param("showtimeId") Long showtimeId);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.status = 'CONFIRMED' AND CAST(b.bookingTime AS LocalDate) BETWEEN :startDate AND :endDate")
    Double getTotalRevenue(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'CONFIRMED' AND CAST(b.bookingTime AS LocalDate) BETWEEN :startDate AND :endDate")
    Long getTotalBookings(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(bd) FROM BookingDetail bd WHERE bd.booking.status = 'CONFIRMED' AND CAST(bd.booking.bookingTime AS LocalDate) BETWEEN :startDate AND :endDate")
    Long getTotalTicketsSold(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    List<Booking> findByStatus(BookingStatus status);
}
