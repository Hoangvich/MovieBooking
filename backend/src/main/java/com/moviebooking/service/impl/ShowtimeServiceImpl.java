package com.moviebooking.service.impl;

import com.moviebooking.dto.request.ShowtimeRequest;
import com.moviebooking.dto.response.ShowtimeResponse;
import com.moviebooking.entity.Movie;
import com.moviebooking.entity.Room;
import com.moviebooking.entity.Showtime;
import com.moviebooking.exception.BadRequestException;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.repository.*;
import com.moviebooking.service.ShowtimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ShowtimeServiceImpl implements ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;

    @Override
    public ShowtimeResponse create(ShowtimeRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", request.getMovieId()));
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", request.getRoomId()));

        LocalTime endTime = request.getStartTime().plusMinutes(movie.getDurationMinutes());

        // Check for time conflicts in the same room on the same date
        List<Showtime> existingShowtimes = showtimeRepository.findByRoomIdAndShowDate(room.getId(), request.getShowDate());
        for (Showtime existing : existingShowtimes) {
            if (request.getStartTime().isBefore(existing.getEndTime()) && endTime.isAfter(existing.getStartTime())) {
                throw new BadRequestException("Suất chiếu bị trùng thời gian với suất chiếu khác trong cùng phòng");
            }
        }

        Showtime showtime = Showtime.builder()
                .movie(movie)
                .room(room)
                .showDate(request.getShowDate())
                .startTime(request.getStartTime())
                .endTime(endTime)
                .basePrice(request.getBasePrice())
                .active(true)
                .build();

        return toResponse(showtimeRepository.save(showtime));
    }

    @Override
    @Transactional(readOnly = true)
    public ShowtimeResponse getById(Long id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime", "id", id));
        return toResponse(showtime);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShowtimeResponse> getAll() {
        return showtimeRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public ShowtimeResponse update(Long id, ShowtimeRequest request) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime", "id", id));

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", request.getMovieId()));
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", request.getRoomId()));

        showtime.setMovie(movie);
        showtime.setRoom(room);
        showtime.setShowDate(request.getShowDate());
        showtime.setStartTime(request.getStartTime());
        showtime.setEndTime(request.getStartTime().plusMinutes(movie.getDurationMinutes()));
        showtime.setBasePrice(request.getBasePrice());

        return toResponse(showtimeRepository.save(showtime));
    }

    @Override
    public void delete(Long id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime", "id", id));
        showtime.setActive(false);
        showtimeRepository.save(showtime);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShowtimeResponse> getByMovie(Long movieId) {
        return showtimeRepository.findByMovieIdAndActiveTrue(movieId).stream()
                .map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShowtimeResponse> getByMovieAndDate(Long movieId, LocalDate date) {
        return showtimeRepository.findByMovieAndDate(movieId, date).stream()
                .map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShowtimeResponse> getByCinemaAndDate(Long cinemaId, LocalDate date) {
        return showtimeRepository.findByCinemaAndDate(cinemaId, date).stream()
                .map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShowtimeResponse> getByMovieAndCinemaAndDate(Long movieId, Long cinemaId, LocalDate date) {
        return showtimeRepository.findByMovieAndCinemaAndDate(movieId, cinemaId, date).stream()
                .map(this::toResponse).toList();
    }

    private ShowtimeResponse toResponse(Showtime showtime) {
        int totalSeats = showtime.getRoom().getTotalSeats();
        List<Long> bookedSeatIds = bookingRepository.findBookedSeatIdsByShowtimeId(showtime.getId());

        return ShowtimeResponse.builder()
                .id(showtime.getId())
                .showDate(showtime.getShowDate())
                .startTime(showtime.getStartTime())
                .endTime(showtime.getEndTime())
                .basePrice(showtime.getBasePrice())
                .movieId(showtime.getMovie().getId())
                .movieTitle(showtime.getMovie().getTitle())
                .posterUrl(showtime.getMovie().getPosterUrl())
                .trailerUrl(showtime.getMovie().getTrailerUrl())
                .genre(showtime.getMovie().getGenre())
                .durationMinutes(showtime.getMovie().getDurationMinutes())
                .rated(showtime.getMovie().getRated())
                .roomId(showtime.getRoom().getId())
                .roomName(showtime.getRoom().getName())
                .cinemaId(showtime.getRoom().getCinema().getId())
                .cinemaName(showtime.getRoom().getCinema().getName())
                .availableSeats(totalSeats - bookedSeatIds.size())
                .build();
    }
}
