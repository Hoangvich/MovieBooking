package com.moviebooking.repository;

import com.moviebooking.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {

    List<Showtime> findByMovieIdAndActiveTrue(Long movieId);

    List<Showtime> findByRoomIdAndShowDate(Long roomId, LocalDate showDate);

    @Query("SELECT s FROM Showtime s WHERE s.movie.id = :movieId AND s.showDate = :date AND s.active = true")
    List<Showtime> findByMovieAndDate(@Param("movieId") Long movieId, @Param("date") LocalDate date);

    @Query("SELECT s FROM Showtime s WHERE s.room.cinema.id = :cinemaId AND s.showDate = :date AND s.active = true")
    List<Showtime> findByCinemaAndDate(@Param("cinemaId") Long cinemaId, @Param("date") LocalDate date);

    @Query("SELECT s FROM Showtime s WHERE s.movie.id = :movieId AND s.room.cinema.id = :cinemaId AND s.showDate = :date AND s.active = true")
    List<Showtime> findByMovieAndCinemaAndDate(@Param("movieId") Long movieId,
                                                @Param("cinemaId") Long cinemaId,
                                                @Param("date") LocalDate date);

    List<Showtime> findByShowDateAndActiveTrue(LocalDate date);
}
