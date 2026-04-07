package com.moviebooking.service.impl;

import com.moviebooking.dto.request.MovieRequest;
import com.moviebooking.dto.response.MovieResponse;
import com.moviebooking.entity.Movie;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.mapper.MovieMapper;
import com.moviebooking.repository.MovieRepository;
import com.moviebooking.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;
    private final MovieMapper movieMapper;

    @Override
    public MovieResponse create(MovieRequest request) {
        Movie movie = movieMapper.toEntity(request);
        movie.setActive(true);
        return movieMapper.toResponse(movieRepository.save(movie));
    }

    @Override
    @Transactional(readOnly = true)
    public MovieResponse getById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", id));
        return movieMapper.toResponse(movie);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieResponse> getAll() {
        return movieMapper.toResponseList(movieRepository.findByActiveTrue());
    }

    @Override
    public MovieResponse update(Long id, MovieRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", id));
        movieMapper.updateEntity(request, movie);
        return movieMapper.toResponse(movieRepository.save(movie));
    }

    @Override
    public void delete(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", id));
        movie.setActive(false);
        movieRepository.save(movie);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieResponse> searchByTitle(String title) {
        return movieMapper.toResponseList(movieRepository.findByTitleContainingIgnoreCase(title));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieResponse> searchByGenre(String genre) {
        return movieMapper.toResponseList(movieRepository.findByGenreContainingIgnoreCase(genre));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieResponse> getNowShowing() {
        return movieMapper.toResponseList(movieRepository.findNowShowing(LocalDate.now()));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieResponse> getComingSoon() {
        return movieMapper.toResponseList(movieRepository.findComingSoon(LocalDate.now()));
    }
}
