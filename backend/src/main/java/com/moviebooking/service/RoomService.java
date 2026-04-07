package com.moviebooking.service;

import com.moviebooking.dto.request.RoomRequest;
import com.moviebooking.dto.response.RoomResponse;
import com.moviebooking.dto.response.SeatResponse;

import java.util.List;

public interface RoomService {

    RoomResponse create(RoomRequest request);

    RoomResponse getById(Long id);

    List<RoomResponse> getByCinemaId(Long cinemaId);

    RoomResponse update(Long id, RoomRequest request);

    void delete(Long id);

    List<SeatResponse> getSeatMap(Long roomId, Long showtimeId);
}
