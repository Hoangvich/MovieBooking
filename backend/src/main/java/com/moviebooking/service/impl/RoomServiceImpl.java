package com.moviebooking.service.impl;

import com.moviebooking.dto.request.RoomRequest;
import com.moviebooking.dto.response.RoomResponse;
import com.moviebooking.dto.response.SeatResponse;
import com.moviebooking.entity.Cinema;
import com.moviebooking.entity.Room;
import com.moviebooking.entity.Seat;
import com.moviebooking.enums.SeatType;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.repository.*;
import com.moviebooking.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final CinemaRepository cinemaRepository;
    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;

    @Override
    public RoomResponse create(RoomRequest request) {
        Cinema cinema = cinemaRepository.findById(request.getCinemaId())
                .orElseThrow(() -> new ResourceNotFoundException("Cinema", "id", request.getCinemaId()));

        Room room = Room.builder()
                .name(request.getName())
                .cinema(cinema)
                .seatRows(request.getSeatRows())
                .seatColumns(request.getSeatColumns())
                .totalSeats(request.getSeatRows() * request.getSeatColumns())
                .active(true)
                .build();

        room = roomRepository.save(room);

        // Auto-generate seats
        List<Seat> seats = new ArrayList<>();
        for (int row = 0; row < request.getSeatRows(); row++) {
            String rowName = String.valueOf((char) ('A' + row));
            for (int col = 1; col <= request.getSeatColumns(); col++) {
                SeatType seatType = (row >= request.getSeatRows() - 2) ? SeatType.VIP : SeatType.STANDARD;
                double price = seatType == SeatType.VIP ? 90000 : 75000;

                seats.add(Seat.builder()
                        .rowName(rowName)
                        .seatNumber(col)
                        .seatType(seatType)
                        .price(price)
                        .room(room)
                        .active(true)
                        .build());
            }
        }
        seatRepository.saveAll(seats);

        return toResponse(room);
    }

    @Override
    @Transactional(readOnly = true)
    public RoomResponse getById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", id));
        return toResponse(room);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> getByCinemaId(Long cinemaId) {
        return roomRepository.findByCinemaIdAndActiveTrue(cinemaId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public RoomResponse update(Long id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", id));
        room.setName(request.getName());
        return toResponse(roomRepository.save(room));
    }

    @Override
    public void delete(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", id));
        room.setActive(false);
        roomRepository.save(room);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SeatResponse> getSeatMap(Long roomId, Long showtimeId) {
        List<Seat> seats = seatRepository.findByRoomIdAndActiveTrue(roomId);
        List<Long> bookedSeatIds = bookingRepository.findBookedSeatIdsByShowtimeId(showtimeId);

        return seats.stream()
                .map(seat -> SeatResponse.builder()
                        .id(seat.getId())
                        .rowName(seat.getRowName())
                        .seatNumber(seat.getSeatNumber())
                        .seatType(seat.getSeatType())
                        .price(seat.getPrice())
                        .available(!bookedSeatIds.contains(seat.getId()))
                        .build())
                .toList();
    }

    private RoomResponse toResponse(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .totalSeats(room.getTotalSeats())
                .seatRows(room.getSeatRows())
                .seatColumns(room.getSeatColumns())
                .cinemaId(room.getCinema().getId())
                .cinemaName(room.getCinema().getName())
                .active(room.getActive())
                .build();
    }
}
