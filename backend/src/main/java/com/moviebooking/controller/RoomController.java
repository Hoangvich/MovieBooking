package com.moviebooking.controller;

import com.moviebooking.dto.request.RoomRequest;
import com.moviebooking.dto.response.ApiResponse;
import com.moviebooking.dto.response.RoomResponse;
import com.moviebooking.dto.response.SeatResponse;
import com.moviebooking.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@Tag(name = "Room & Seat", description = "API quản lý phòng chiếu và ghế")
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    @Operation(summary = "Tạo phòng chiếu mới (ADMIN)")
    public ResponseEntity<ApiResponse<RoomResponse>> create(@Valid @RequestBody RoomRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo phòng thành công", roomService.create(request)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết phòng")
    public ResponseEntity<ApiResponse<RoomResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(roomService.getById(id)));
    }

    @GetMapping("/cinema/{cinemaId}")
    @Operation(summary = "Danh sách phòng theo rạp")
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getByCinema(@PathVariable Long cinemaId) {
        return ResponseEntity.ok(ApiResponse.success(roomService.getByCinemaId(cinemaId)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật phòng (ADMIN)")
    public ResponseEntity<ApiResponse<RoomResponse>> update(@PathVariable Long id,
                                                             @Valid @RequestBody RoomRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", roomService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa phòng (ADMIN)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        roomService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa phòng thành công", null));
    }

    @GetMapping("/{roomId}/seats")
    @Operation(summary = "Sơ đồ ghế theo phòng và suất chiếu")
    public ResponseEntity<ApiResponse<List<SeatResponse>>> getSeatMap(@PathVariable Long roomId,
                                                                       @RequestParam Long showtimeId) {
        return ResponseEntity.ok(ApiResponse.success(roomService.getSeatMap(roomId, showtimeId)));
    }
}
