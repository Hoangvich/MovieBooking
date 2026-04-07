package com.moviebooking.controller;

import com.moviebooking.dto.request.ShowtimeRequest;
import com.moviebooking.dto.response.ApiResponse;
import com.moviebooking.dto.response.ShowtimeResponse;
import com.moviebooking.service.ShowtimeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/showtimes")
@RequiredArgsConstructor
@Tag(name = "Showtime", description = "API quản lý suất chiếu")
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    @PostMapping
    @Operation(summary = "Tạo suất chiếu mới (ADMIN)")
    public ResponseEntity<ApiResponse<ShowtimeResponse>> create(@Valid @RequestBody ShowtimeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo suất chiếu thành công", showtimeService.create(request)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết suất chiếu")
    public ResponseEntity<ApiResponse<ShowtimeResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(showtimeService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "Danh sách suất chiếu")
    public ResponseEntity<ApiResponse<List<ShowtimeResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(showtimeService.getAll()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật suất chiếu (ADMIN)")
    public ResponseEntity<ApiResponse<ShowtimeResponse>> update(@PathVariable Long id,
                                                                  @Valid @RequestBody ShowtimeRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", showtimeService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa suất chiếu (ADMIN)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        showtimeService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa suất chiếu thành công", null));
    }

    @GetMapping("/movie/{movieId}")
    @Operation(summary = "Suất chiếu theo phim")
    public ResponseEntity<ApiResponse<List<ShowtimeResponse>>> getByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(ApiResponse.success(showtimeService.getByMovie(movieId)));
    }

    @GetMapping("/movie/{movieId}/date")
    @Operation(summary = "Suất chiếu theo phim và ngày")
    public ResponseEntity<ApiResponse<List<ShowtimeResponse>>> getByMovieAndDate(
            @PathVariable Long movieId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success(showtimeService.getByMovieAndDate(movieId, date)));
    }

    @GetMapping("/cinema/{cinemaId}/date")
    @Operation(summary = "Suất chiếu theo rạp và ngày")
    public ResponseEntity<ApiResponse<List<ShowtimeResponse>>> getByCinemaAndDate(
            @PathVariable Long cinemaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success(showtimeService.getByCinemaAndDate(cinemaId, date)));
    }

    @GetMapping("/filter")
    @Operation(summary = "Lọc suất chiếu theo phim, rạp và ngày")
    public ResponseEntity<ApiResponse<List<ShowtimeResponse>>> filter(
            @RequestParam Long movieId,
            @RequestParam Long cinemaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success(
                showtimeService.getByMovieAndCinemaAndDate(movieId, cinemaId, date)));
    }
}
