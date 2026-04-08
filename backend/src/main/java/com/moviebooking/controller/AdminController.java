package com.moviebooking.controller;

import com.moviebooking.dto.response.ApiResponse;
import com.moviebooking.dto.response.RevenueResponse;
import com.moviebooking.entity.User;
import com.moviebooking.repository.UserRepository;
import com.moviebooking.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "API quản trị")
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;

    @GetMapping("/users")
    @Operation(summary = "Lấy danh sách tất cả người dùng")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "username", u.getUsername(),
                        "fullName", u.getFullName(),
                        "email", u.getEmail(),
                        "phoneNumber", u.getPhoneNumber() != null ? u.getPhoneNumber() : "",
                        "role", u.getRole().name(),
                        "active", u.getActive(),
                        "createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : ""
                ))
                .toList();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/revenue")
    @Operation(summary = "Thống kê doanh thu theo khoảng thời gian")
    public ResponseEntity<ApiResponse<RevenueResponse>> getRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getRevenue(startDate, endDate)));
    }

    @GetMapping("/revenue/daily")
    @Operation(summary = "Doanh thu theo ngày")
    public ResponseEntity<ApiResponse<RevenueResponse>> getDailyRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDailyRevenue(date)));
    }

    @GetMapping("/revenue/monthly")
    @Operation(summary = "Doanh thu theo tháng")
    public ResponseEntity<ApiResponse<RevenueResponse>> getMonthlyRevenue(
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getMonthlyRevenue(year, month)));
    }

    @GetMapping("/revenue/yearly-breakdown")
    @Operation(summary = "Doanh thu từng tháng trong năm")
    public ResponseEntity<ApiResponse<List<RevenueResponse>>> getYearlyBreakdown(@RequestParam int year) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getYearlyBreakdown(year)));
    }

    @GetMapping("/revenue/weekly-breakdown")
    @Operation(summary = "Doanh thu 7 ngày gần nhất")
    public ResponseEntity<ApiResponse<List<RevenueResponse>>> getWeeklyBreakdown(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        if (endDate == null) endDate = LocalDate.now();
        return ResponseEntity.ok(ApiResponse.success(adminService.getWeeklyBreakdown(endDate)));
    }
}
