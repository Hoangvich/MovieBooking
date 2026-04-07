package com.moviebooking.service;

import com.moviebooking.dto.request.ShowtimeRequest;
import com.moviebooking.dto.response.ShowtimeResponse;

import java.time.LocalDate;
import java.util.List;

public interface ShowtimeService {

    ShowtimeResponse create(ShowtimeRequest request);

    ShowtimeResponse getById(Long id);

    List<ShowtimeResponse> getAll();

    ShowtimeResponse update(Long id, ShowtimeRequest request);

    void delete(Long id);

    List<ShowtimeResponse> getByMovie(Long movieId);

    List<ShowtimeResponse> getByMovieAndDate(Long movieId, LocalDate date);

    List<ShowtimeResponse> getByCinemaAndDate(Long cinemaId, LocalDate date);

    List<ShowtimeResponse> getByMovieAndCinemaAndDate(Long movieId, Long cinemaId, LocalDate date);
}
