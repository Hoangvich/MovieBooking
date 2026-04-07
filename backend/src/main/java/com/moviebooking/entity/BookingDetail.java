package com.moviebooking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "booking_details", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"booking_id", "seat_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDetail extends BaseEntity {

    @Column(nullable = false)
    private Double price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;
}
