package com.moviebooking.service;

import com.moviebooking.dto.request.CinemaRequest;
import com.moviebooking.dto.response.CinemaResponse;

import java.util.List;

public interface CinemaService {

    CinemaResponse create(CinemaRequest request);

    CinemaResponse getById(Long id);

    List<CinemaResponse> getAll();

    CinemaResponse update(Long id, CinemaRequest request);

    void delete(Long id);

    List<CinemaResponse> getByCity(String city);
}
