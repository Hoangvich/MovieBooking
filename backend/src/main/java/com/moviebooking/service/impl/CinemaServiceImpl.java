package com.moviebooking.service.impl;

import com.moviebooking.dto.request.CinemaRequest;
import com.moviebooking.dto.response.CinemaResponse;
import com.moviebooking.entity.Cinema;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.mapper.CinemaMapper;
import com.moviebooking.repository.CinemaRepository;
import com.moviebooking.service.CinemaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CinemaServiceImpl implements CinemaService {

    private final CinemaRepository cinemaRepository;
    private final CinemaMapper cinemaMapper;

    @Override
    public CinemaResponse create(CinemaRequest request) {
        Cinema cinema = cinemaMapper.toEntity(request);
        cinema.setActive(true);
        return cinemaMapper.toResponse(cinemaRepository.save(cinema));
    }

    @Override
    @Transactional(readOnly = true)
    public CinemaResponse getById(Long id) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cinema", "id", id));
        return cinemaMapper.toResponse(cinema);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CinemaResponse> getAll() {
        return cinemaMapper.toResponseList(cinemaRepository.findByActiveTrue());
    }

    @Override
    public CinemaResponse update(Long id, CinemaRequest request) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cinema", "id", id));
        cinemaMapper.updateEntity(request, cinema);
        return cinemaMapper.toResponse(cinemaRepository.save(cinema));
    }

    @Override
    public void delete(Long id) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cinema", "id", id));
        cinema.setActive(false);
        cinemaRepository.save(cinema);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CinemaResponse> getByCity(String city) {
        return cinemaMapper.toResponseList(cinemaRepository.findByCityIgnoreCase(city));
    }
}
