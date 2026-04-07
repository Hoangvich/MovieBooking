import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HiPlus, HiTrash } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import showtimeApi from '../../api/showtimeApi';
import movieApi from '../../api/movieApi';
import cinemaApi from '../../api/cinemaApi';
import roomApi from '../../api/roomApi';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import { formatTime, formatCurrency } from '../../utils/formatters';

export default function AdminShowtimes() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCinemaId, setSelectedCinemaId] = useState('');
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, watch } = useForm();

  const { data: showtimeData, isLoading } = useQuery({ queryKey: ['showtimes', 'admin'], queryFn: showtimeApi.getAll });
  const { data: movieData } = useQuery({ queryKey: ['movies'], queryFn: movieApi.getAll });
  const { data: cinemaData } = useQuery({ queryKey: ['cinemas'], queryFn: cinemaApi.getAll });

  const formCinemaId = watch('cinemaId');
  const { data: roomData } = useQuery({
    queryKey: ['rooms', formCinemaId],
    queryFn: () => roomApi.getByCinema(formCinemaId),
    enabled: !!formCinemaId,
  });

  const showtimes = showtimeData?.data || [];
  const movies = movieData?.data || [];
  const cinemas = cinemaData?.data || [];
  const rooms = roomData?.data || [];

  const saveMutation = useMutation({
    mutationFn: showtimeApi.create,
    onSuccess: () => {
      toast.success('Thêm suất chiếu thành công');
      queryClient.invalidateQueries({ queryKey: ['showtimes'] });
      setModalOpen(false); reset();
    },
    onError: (err) => toast.error(err.message || 'Lỗi'),
  });

  const deleteMutation = useMutation({
    mutationFn: showtimeApi.delete,
    onSuccess: () => {
      toast.success('Xóa suất chiếu thành công');
      queryClient.invalidateQueries({ queryKey: ['showtimes'] });
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Suất chiếu ({showtimes.length})</h2>
        <button onClick={() => { reset(); setModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <HiPlus className="w-5 h-5" /> Thêm suất chiếu
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-dark-50 dark:bg-dark-800">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Phim</th>
              <th className="px-4 py-3 text-left font-medium">Rạp / Phòng</th>
              <th className="px-4 py-3 text-left font-medium">Ngày</th>
              <th className="px-4 py-3 text-left font-medium">Giờ</th>
              <th className="px-4 py-3 text-left font-medium">Giá</th>
              <th className="px-4 py-3 text-left font-medium">Ghế trống</th>
              <th className="px-4 py-3 text-center font-medium">Xóa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-100 dark:divide-dark-800">
            {showtimes.map((st) => (
              <tr key={st.id} className="hover:bg-dark-50 dark:hover:bg-dark-800/50">
                <td className="px-4 py-3 font-medium">{st.movieTitle}</td>
                <td className="px-4 py-3 text-dark-500">{st.cinemaName} - {st.roomName}</td>
                <td className="px-4 py-3">{st.showDate}</td>
                <td className="px-4 py-3">{formatTime(st.startTime)} - {formatTime(st.endTime)}</td>
                <td className="px-4 py-3">{formatCurrency(st.basePrice)}</td>
                <td className="px-4 py-3">{st.availableSeats}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => { if (confirm('Xóa suất chiếu?')) deleteMutation.mutate(st.id); }}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"><HiTrash className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Thêm suất chiếu">
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phim *</label>
            <select {...register('movieId')} className="input-field" required>
              <option value="">-- Chọn phim --</option>
              {movies.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rạp *</label>
            <select {...register('cinemaId')} className="input-field" required>
              <option value="">-- Chọn rạp --</option>
              {cinemas.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phòng *</label>
            <select {...register('roomId')} className="input-field" required>
              <option value="">-- Chọn phòng --</option>
              {rooms.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.totalSeats} ghế)</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ngày chiếu *</label>
              <input {...register('showDate')} type="date" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giờ bắt đầu *</label>
              <input {...register('startTime')} type="time" className="input-field" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Giá vé cơ bản (VND) *</label>
            <input {...register('basePrice')} type="number" className="input-field" required placeholder="75000" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Hủy</button>
            <button type="submit" className="btn-primary">Tạo suất chiếu</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
