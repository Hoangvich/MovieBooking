package com.moviebooking.service;

import com.moviebooking.dto.request.MovieRequest;
import com.moviebooking.dto.response.MovieResponse;

import java.util.List;

public interface MovieService {

    MovieResponse create(MovieRequest request);

    MovieResponse getById(Long id);

    List<MovieResponse> getAll();

    MovieResponse update(Long id, MovieRequest request);

    void delete(Long id);

    List<MovieResponse> searchByTitle(String title);

    List<MovieResponse> searchByGenre(String genre);

    List<MovieResponse> getNowShowing();

    List<MovieResponse> getComingSoon();
}
