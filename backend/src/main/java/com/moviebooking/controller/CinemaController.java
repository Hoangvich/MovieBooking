package com.moviebooking.controller;

import com.moviebooking.dto.request.CinemaRequest;
import com.moviebooking.dto.response.ApiResponse;
import com.moviebooking.dto.response.CinemaResponse;
import com.moviebooking.service.CinemaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cinemas")
@RequiredArgsConstructor
@Tag(name = "Cinema", description = "API quản lý rạp phim")
public class CinemaController {

    private final CinemaService cinemaService;

    @PostMapping
    @Operation(summary = "Tạo rạp mới (ADMIN)")
    public ResponseEntity<ApiResponse<CinemaResponse>> create(@Valid @RequestBody CinemaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo rạp thành công", cinemaService.create(request)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết rạp")
    public ResponseEntity<ApiResponse<CinemaResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(cinemaService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "Danh sách tất cả rạp")
    public ResponseEntity<ApiResponse<List<CinemaResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(cinemaService.getAll()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật rạp (ADMIN)")
    public ResponseEntity<ApiResponse<CinemaResponse>> update(@PathVariable Long id,
                                                               @Valid @RequestBody CinemaRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", cinemaService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa rạp (ADMIN)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        cinemaService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa rạp thành công", null));
    }

    @GetMapping("/city/{city}")
    @Operation(summary = "Danh sách rạp theo thành phố")
    public ResponseEntity<ApiResponse<List<CinemaResponse>>> getByCity(@PathVariable String city) {
        return ResponseEntity.ok(ApiResponse.success(cinemaService.getByCity(city)));
    }
}
