package com.moviebooking.mapper;

import com.moviebooking.dto.request.CinemaRequest;
import com.moviebooking.dto.response.CinemaResponse;
import com.moviebooking.entity.Cinema;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CinemaMapper {

    CinemaResponse toResponse(Cinema cinema);

    List<CinemaResponse> toResponseList(List<Cinema> cinemas);

    Cinema toEntity(CinemaRequest request);

    void updateEntity(CinemaRequest request, @MappingTarget Cinema cinema);
}
