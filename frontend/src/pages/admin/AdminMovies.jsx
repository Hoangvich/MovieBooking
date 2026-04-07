import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HiPlus, HiPencil, HiTrash, HiMagnifyingGlass } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import movieApi from '../../api/movieApi';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';

export default function AdminMovies() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editMovie, setEditMovie] = useState(null);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['movies', 'admin'], queryFn: movieApi.getAll });
  const movies = (data?.data || []).filter((m) => m.title.toLowerCase().includes(search.toLowerCase()));

  const { register, handleSubmit, reset, setValue } = useForm();

  const saveMutation = useMutation({
    mutationFn: (data) => editMovie ? movieApi.update(editMovie.id, data) : movieApi.create(data),
    onSuccess: () => {
      toast.success(editMovie ? 'Cập nhật thành công' : 'Thêm phim thành công');
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      closeModal();
    },
    onError: (err) => toast.error(err.message || 'Lỗi'),
  });

  const deleteMutation = useMutation({
    mutationFn: movieApi.delete,
    onSuccess: () => {
      toast.success('Xóa phim thành công');
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });

  const openCreate = () => { setEditMovie(null); reset({}); setModalOpen(true); };

  const openEdit = (movie) => {
    setEditMovie(movie);
    Object.keys(movie).forEach((key) => setValue(key, movie[key]));
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditMovie(null); reset({}); };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input type="text" placeholder="Tìm phim..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-field !pl-10" />
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <HiPlus className="w-5 h-5" /> Thêm phim
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-dark-50 dark:bg-dark-800">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Phim</th>
              <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Thể loại</th>
              <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Thời lượng</th>
              <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Khởi chiếu</th>
              <th className="px-4 py-3 text-center font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-100 dark:divide-dark-800">
            {movies.map((movie) => (
              <tr key={movie.id} className="hover:bg-dark-50 dark:hover:bg-dark-800/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={movie.posterUrl || `https://placehold.co/40x60/1e293b/64748b?text=${movie.title[0]}`}
                      className="w-10 h-14 rounded object-cover" alt="" />
                    <div>
                      <p className="font-medium">{movie.title}</p>
                      <p className="text-xs text-dark-500">{movie.rated}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-dark-500">{movie.genre}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-dark-500">{movie.durationMinutes} phút</td>
                <td className="px-4 py-3 hidden lg:table-cell text-dark-500">{movie.releaseDate}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openEdit(movie)}
                      className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600">
                      <HiPencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => { if (confirm('Xóa phim này?')) deleteMutation.mutate(movie.id); }}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600">
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editMovie ? 'Sửa phim' : 'Thêm phim mới'} size="lg">
        <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Tên phim *</label>
              <input {...register('title')} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thể loại</label>
              <input {...register('genre')} className="input-field" placeholder="Hành động, Hài" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thời lượng (phút) *</label>
              <input {...register('durationMinutes')} type="number" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Đạo diễn</label>
              <input {...register('director')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Diễn viên</label>
              <input {...register('castMembers')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngày khởi chiếu</label>
              <input {...register('releaseDate')} type="date" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
              <input {...register('endDate')} type="date" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngôn ngữ</label>
              <input {...register('language')} className="input-field" placeholder="Tiếng Việt" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phân loại</label>
              <select {...register('rated')} className="input-field">
                <option value="P">P - Phổ thông</option>
                <option value="C13">C13</option>
                <option value="C16">C16</option>
                <option value="C18">C18</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">URL Poster</label>
              <input {...register('posterUrl')} className="input-field" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <textarea {...register('description')} rows={3} className="input-field" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={closeModal} className="btn-secondary">Hủy</button>
            <button type="submit" disabled={saveMutation.isPending} className="btn-primary">
              {saveMutation.isPending ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
