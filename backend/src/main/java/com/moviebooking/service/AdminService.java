package com.moviebooking.service;

import com.moviebooking.dto.response.RevenueResponse;

import java.time.LocalDate;
import java.util.List;

public interface AdminService {

    RevenueResponse getRevenue(LocalDate startDate, LocalDate endDate);

    RevenueResponse getDailyRevenue(LocalDate date);

    RevenueResponse getMonthlyRevenue(int year, int month);

    List<RevenueResponse> getYearlyBreakdown(int year);

    List<RevenueResponse> getWeeklyBreakdown(LocalDate endDate);
}
