package com.moviebooking.service.impl;

import com.moviebooking.dto.response.RevenueResponse;
import com.moviebooking.repository.BookingRepository;
import com.moviebooking.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminServiceImpl implements AdminService {

    private final BookingRepository bookingRepository;

    @Override
    public RevenueResponse getRevenue(LocalDate startDate, LocalDate endDate) {
        return RevenueResponse.builder()
                .totalRevenue(bookingRepository.getTotalRevenue(startDate, endDate))
                .totalBookings(bookingRepository.getTotalBookings(startDate, endDate))
                .totalTicketsSold(bookingRepository.getTotalTicketsSold(startDate, endDate))
                .period(startDate + " - " + endDate)
                .build();
    }

    @Override
    public RevenueResponse getDailyRevenue(LocalDate date) {
        return getRevenue(date, date);
    }

    @Override
    public RevenueResponse getMonthlyRevenue(int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        return getRevenue(startDate, endDate);
    }

    @Override
    public List<RevenueResponse> getYearlyBreakdown(int year) {
        List<RevenueResponse> result = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            YearMonth ym = YearMonth.of(year, m);
            LocalDate start = ym.atDay(1);
            LocalDate end = ym.atEndOfMonth();
            result.add(RevenueResponse.builder()
                    .totalRevenue(bookingRepository.getTotalRevenue(start, end))
                    .totalBookings(bookingRepository.getTotalBookings(start, end))
                    .totalTicketsSold(bookingRepository.getTotalTicketsSold(start, end))
                    .period("T" + m)
                    .build());
        }
        return result;
    }

    @Override
    public List<RevenueResponse> getWeeklyBreakdown(LocalDate endDate) {
        List<RevenueResponse> result = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = endDate.minusDays(i);
            String dayName = date.getDayOfWeek().getDisplayName(TextStyle.SHORT, new Locale("vi"));
            String label = dayName + " " + date.getDayOfMonth() + "/" + date.getMonthValue();
            result.add(RevenueResponse.builder()
                    .totalRevenue(bookingRepository.getTotalRevenue(date, date))
                    .totalBookings(bookingRepository.getTotalBookings(date, date))
                    .totalTicketsSold(bookingRepository.getTotalTicketsSold(date, date))
                    .period(label)
                    .build());
        }
        return result;
    }
}
