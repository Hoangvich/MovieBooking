import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HiPlus, HiPencil, HiTrash, HiBuildingOffice2 } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import cinemaApi from '../../api/cinemaApi';
import roomApi from '../../api/roomApi';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';

export default function AdminCinemas() {
  const [cinemaModal, setCinemaModal] = useState(false);
  const [roomModal, setRoomModal] = useState(false);
  const [editCinema, setEditCinema] = useState(null);
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);
  const queryClient = useQueryClient();

  const { data: cinemaData, isLoading } = useQuery({ queryKey: ['cinemas', 'admin'], queryFn: cinemaApi.getAll });
  const cinemas = cinemaData?.data || [];

  const { data: roomData } = useQuery({
    queryKey: ['rooms', selectedCinemaId],
    queryFn: () => roomApi.getByCinema(selectedCinemaId),
    enabled: !!selectedCinemaId,
  });
  const rooms = roomData?.data || [];

  const cinemaForm = useForm();
  const roomForm = useForm();

  const cinemaMutation = useMutation({
    mutationFn: (data) => editCinema ? cinemaApi.update(editCinema.id, data) : cinemaApi.create(data),
    onSuccess: () => {
      toast.success(editCinema ? 'Cập nhật thành công' : 'Thêm rạp thành công');
      queryClient.invalidateQueries({ queryKey: ['cinemas'] });
      setCinemaModal(false); cinemaForm.reset();
    },
    onError: (err) => toast.error(err.message || 'Lỗi'),
  });

  const roomMutation = useMutation({
    mutationFn: roomApi.create,
    onSuccess: () => {
      toast.success('Thêm phòng thành công');
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setRoomModal(false); roomForm.reset();
    },
    onError: (err) => toast.error(err.message || 'Lỗi'),
  });

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Rạp chiếu phim</h2>
        <button onClick={() => { setEditCinema(null); cinemaForm.reset(); setCinemaModal(true); }}
          className="btn-primary flex items-center gap-2">
          <HiPlus className="w-5 h-5" /> Thêm rạp
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cinema list */}
        <div className="space-y-4">
          {cinemas.map((cinema) => (
            <div key={cinema.id}
              className={`card p-5 cursor-pointer transition-all hover:shadow-lg
                ${selectedCinemaId === cinema.id ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => setSelectedCinemaId(cinema.id)}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <HiBuildingOffice2 className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold">{cinema.name}</h3>
                    <p className="text-sm text-dark-500">{cinema.address}</p>
                    <span className="badge bg-dark-100 dark:bg-dark-700 text-xs mt-1">{cinema.city}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={(e) => { e.stopPropagation(); setEditCinema(cinema); Object.keys(cinema).forEach(k => cinemaForm.setValue(k, cinema[k])); setCinemaModal(true); }}
                    className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600"><HiPencil className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Room list */}
        <div>
          {selectedCinemaId ? (
            <div className="card p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Phòng chiếu</h3>
                <button onClick={() => { roomForm.setValue('cinemaId', selectedCinemaId); setRoomModal(true); }}
                  className="btn-primary text-sm !py-1.5 !px-3 flex items-center gap-1">
                  <HiPlus className="w-4 h-4" /> Thêm phòng
                </button>
              </div>
              {rooms.length === 0 ? (
                <p className="text-dark-500 text-sm">Chưa có phòng nào</p>
              ) : (
                <div className="space-y-3">
                  {rooms.map((room) => (
                    <div key={room.id} className="flex justify-between items-center p-3 bg-dark-50 dark:bg-dark-800 rounded-xl">
                      <div>
                        <p className="font-medium">{room.name}</p>
                        <p className="text-xs text-dark-500">{room.seatRows}x{room.seatColumns} = {room.totalSeats} ghế</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="card p-10 text-center text-dark-500">
              Chọn rạp để xem phòng chiếu
            </div>
          )}
        </div>
      </div>

      {/* Cinema Modal */}
      <Modal isOpen={cinemaModal} onClose={() => setCinemaModal(false)} title={editCinema ? 'Sửa rạp' : 'Thêm rạp mới'}>
        <form onSubmit={cinemaForm.handleSubmit((d) => cinemaMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên rạp *</label>
            <input {...cinemaForm.register('name')} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ *</label>
            <input {...cinemaForm.register('address')} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thành phố *</label>
            <input {...cinemaForm.register('city')} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
            <input {...cinemaForm.register('phoneNumber')} className="input-field" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setCinemaModal(false)} className="btn-secondary">Hủy</button>
            <button type="submit" className="btn-primary">Lưu</button>
          </div>
        </form>
      </Modal>

      {/* Room Modal */}
      <Modal isOpen={roomModal} onClose={() => setRoomModal(false)} title="Thêm phòng chiếu">
        <form onSubmit={roomForm.handleSubmit((d) => roomMutation.mutate({ ...d, cinemaId: selectedCinemaId }))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên phòng *</label>
            <input {...roomForm.register('name')} className="input-field" required placeholder="Phòng 1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Số hàng *</label>
              <input {...roomForm.register('seatRows')} type="number" className="input-field" required min="1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Số cột *</label>
              <input {...roomForm.register('seatColumns')} type="number" className="input-field" required min="1" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setRoomModal(false)} className="btn-secondary">Hủy</button>
            <button type="submit" className="btn-primary">Tạo phòng</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
