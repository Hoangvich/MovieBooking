package com.moviebooking.repository;

import com.moviebooking.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByCinemaId(Long cinemaId);

    List<Room> findByCinemaIdAndActiveTrue(Long cinemaId);
}
