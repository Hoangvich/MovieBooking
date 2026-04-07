package com.moviebooking.controller;

import com.moviebooking.dto.request.MovieRequest;
import com.moviebooking.dto.response.ApiResponse;
import com.moviebooking.dto.response.MovieResponse;
import com.moviebooking.service.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@Tag(name = "Movie", description = "API quản lý phim")
public class MovieController {

    private final MovieService movieService;

    @PostMapping
    @Operation(summary = "Tạo phim mới (ADMIN)")
    public ResponseEntity<ApiResponse<MovieResponse>> create(@Valid @RequestBody MovieRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo phim thành công", movieService.create(request)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết phim")
    public ResponseEntity<ApiResponse<MovieResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(movieService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "Danh sách tất cả phim")
    public ResponseEntity<ApiResponse<List<MovieResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(movieService.getAll()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật phim (ADMIN)")
    public ResponseEntity<ApiResponse<MovieResponse>> update(@PathVariable Long id,
                                                              @Valid @RequestBody MovieRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", movieService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa phim (ADMIN)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        movieService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa phim thành công", null));
    }

    @GetMapping("/search")
    @Operation(summary = "Tìm phim theo tên")
    public ResponseEntity<ApiResponse<List<MovieResponse>>> searchByTitle(@RequestParam String title) {
        return ResponseEntity.ok(ApiResponse.success(movieService.searchByTitle(title)));
    }

    @GetMapping("/genre/{genre}")
    @Operation(summary = "Tìm phim theo thể loại")
    public ResponseEntity<ApiResponse<List<MovieResponse>>> searchByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(ApiResponse.success(movieService.searchByGenre(genre)));
    }

    @GetMapping("/now-showing")
    @Operation(summary = "Phim đang chiếu")
    public ResponseEntity<ApiResponse<List<MovieResponse>>> getNowShowing() {
        return ResponseEntity.ok(ApiResponse.success(movieService.getNowShowing()));
    }

    @GetMapping("/coming-soon")
    @Operation(summary = "Phim sắp chiếu")
    public ResponseEntity<ApiResponse<List<MovieResponse>>> getComingSoon() {
        return ResponseEntity.ok(ApiResponse.success(movieService.getComingSoon()));
    }
}
