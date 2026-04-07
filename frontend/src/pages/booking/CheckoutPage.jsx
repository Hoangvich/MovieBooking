import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HiCreditCard, HiDevicePhoneMobile, HiTicket, HiQrCode, HiBanknotes } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import bookingApi from '../../api/bookingApi';
import paymentApi from '../../api/paymentApi';
import { clearBooking } from '../../store/slices/bookingSlice';
import { formatCurrency, formatTime } from '../../utils/formatters';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('QRCODE');
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedShowtime, selectedSeats, totalAmount } = useSelector((s) => s.booking);

  if (!selectedShowtime || selectedSeats.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-dark-500 mb-4">Không có thông tin đặt vé</p>
        <button onClick={() => navigate('/movies')} className="btn-primary">Chọn phim</button>
      </div>
    );
  }

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Create booking
      const bookingRes = await bookingApi.create({
        showtimeId: selectedShowtime.id,
        seatIds: selectedSeats.map((s) => s.id),
      });
      const booking = bookingRes.data;

      if (paymentMethod === 'VNPAY') {
        const paymentRes = await paymentApi.createVNPay(booking.id);
        window.location.href = paymentRes.data;
      } else if (paymentMethod === 'QRCODE') {
        setCurrentBookingId(booking.id);
        setShowQR(true);
      } else {
        toast.success('Đặt vé thành công!');
        dispatch(clearBooking());
        navigate(`/booking/confirm/${booking.id}`);
      }
    } catch (err) {
      toast.error(err.message || 'Đặt vé thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <HiTicket className="w-7 h-7 text-primary-600" /> Thanh toán
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Movie info */}
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-4">Thông tin vé</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-500">Phim:</span>
                <span className="font-medium">{selectedShowtime.movieTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-500">Rạp:</span>
                <span>{selectedShowtime.cinemaName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-500">Phòng:</span>
                <span>{selectedShowtime.roomName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-500">Suất chiếu:</span>
                <span>{selectedShowtime.showDate} | {formatTime(selectedShowtime.startTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-500">Ghế:</span>
                <span className="font-medium text-primary-600">
                  {selectedSeats.map((s) => `${s.rowName}${s.seatNumber}`).join(', ')}
                </span>
              </div>
            </div>

            <hr className="my-4 border-dark-100 dark:border-dark-700" />

            <div className="space-y-2">
              {selectedSeats.map((seat) => (
                <div key={seat.id} className="flex justify-between text-sm">
                  <span>Ghế {seat.rowName}{seat.seatNumber} ({seat.seatType})</span>
                  <span>{formatCurrency(seat.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment method */}
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-4">Phương thức thanh toán</h2>
            <div className="space-y-3">
              {[
                { value: 'QRCODE', label: 'Quét mã QR', desc: 'Quét mã QR để thanh toán chuyển khoản', icon: HiQrCode },
                { value: 'VNPAY', label: 'VNPay', desc: 'Thanh toán qua VNPay (ATM/Visa/MasterCard)', icon: HiCreditCard },
                { value: 'MOMO', label: 'MoMo', desc: 'Thanh toán qua ví MoMo', icon: HiDevicePhoneMobile },
              ].map((method) => (
                <label key={method.value}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${paymentMethod === method.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-dark-200 dark:border-dark-700 hover:border-dark-300'}`}>
                  <input type="radio" name="payment" value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-primary-600" />
                  <method.icon className="w-8 h-8 text-primary-600" />
                  <div>
                    <p className="font-medium">{method.label}</p>
                    <p className="text-xs text-dark-500">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Price summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-500">{selectedSeats.length} vé</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <hr className="border-dark-100 dark:border-dark-700" />
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span className="text-primary-600">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <button onClick={handlePayment} disabled={loading} className="btn-primary w-full mt-6">
              {loading ? 'Đang xử lý...' : `Thanh toán ${formatCurrency(totalAmount)}`}
            </button>

            <p className="text-xs text-dark-500 text-center mt-3">
              Vé đã mua không được hoàn trả
            </p>
          </div>
        </div>
      </div>

      {/* QR Payment Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowQR(false)} />
          <div className="relative card w-full max-w-md p-8 text-center">
            <h2 className="text-xl font-bold mb-2">Quét mã QR để thanh toán</h2>
            <p className="text-dark-500 text-sm mb-6">
              Số tiền: <span className="font-bold text-primary-600">{formatCurrency(totalAmount)}</span>
            </p>

            <div className="flex justify-center mb-6">
              <img
                src="/qr-payment.png"
                alt="QR thanh toán"
                className="w-64 h-64 rounded-xl border-2 border-dark-200 dark:border-dark-700 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-64 h-64 rounded-xl border-2 border-dashed border-dark-300 items-center justify-center hidden">
                <div className="text-center">
                  <HiQrCode className="w-20 h-20 text-dark-400 mx-auto" />
                  <p className="text-sm text-dark-500 mt-2">Đặt ảnh QR tại<br/><code>frontend/public/qr-payment.png</code></p>
                </div>
              </div>
            </div>

            <p className="text-sm text-dark-500 mb-6">
              Sau khi chuyển khoản xong, nhấn nút bên dưới để xác nhận
            </p>

            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowQR(false)} className="btn-secondary">Hủy</button>
              <button
                onClick={async () => {
                  try {
                    await paymentApi.payDirectly(currentBookingId);
                    toast.success('Thanh toán thành công!');
                    dispatch(clearBooking());
                    navigate(`/booking/confirm/${currentBookingId}`);
                  } catch (err) {
                    toast.error(err.message || 'Thanh toán thất bại');
                  }
                }}
                className="btn-primary flex items-center gap-2"
              >
                Đã thanh toán xong
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
