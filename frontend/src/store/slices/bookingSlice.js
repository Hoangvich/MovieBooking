import { createSlice } from '@reduxjs/toolkit';

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    selectedMovie: null,
    selectedCinema: null,
    selectedShowtime: null,
    selectedSeats: [],
    totalAmount: 0,
  },
  reducers: {
    setSelectedMovie: (state, action) => { state.selectedMovie = action.payload; },
    setSelectedCinema: (state, action) => { state.selectedCinema = action.payload; },
    setSelectedShowtime: (state, action) => { state.selectedShowtime = action.payload; },
    toggleSeat: (state, action) => {
      const seat = action.payload;
      const idx = state.selectedSeats.findIndex((s) => s.id === seat.id);
      if (idx >= 0) {
        state.selectedSeats.splice(idx, 1);
      } else {
        state.selectedSeats.push(seat);
      }
      state.totalAmount = state.selectedSeats.reduce((sum, s) => sum + s.price, 0);
    },
    clearBooking: (state) => {
      state.selectedMovie = null;
      state.selectedCinema = null;
      state.selectedShowtime = null;
      state.selectedSeats = [];
      state.totalAmount = 0;
    },
  },
});

export const { setSelectedMovie, setSelectedCinema, setSelectedShowtime, toggleSeat, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
