package com.moviebooking.mapper;

import com.moviebooking.dto.request.MovieRequest;
import com.moviebooking.dto.response.MovieResponse;
import com.moviebooking.entity.Movie;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MovieMapper {

    MovieResponse toResponse(Movie movie);

    List<MovieResponse> toResponseList(List<Movie> movies);

    Movie toEntity(MovieRequest request);

    void updateEntity(MovieRequest request, @MappingTarget Movie movie);
}
