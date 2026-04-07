import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi2';

export default function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const responseCode = searchParams.get('vnp_ResponseCode');
    setStatus(responseCode === '00' ? 'success' : 'failed');
  }, [searchParams]);

  if (status === 'loading') {
    return <div className="text-center py-20">Đang xử lý thanh toán...</div>;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        {status === 'success' ? (
          <>
            <HiCheckCircle className="w-24 h-24 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold">Thanh toán thành công!</h1>
            <p className="text-dark-500">Vé đã được xác nhận. Bạn có thể xem chi tiết trong mục "Vé của tôi".</p>
          </>
        ) : (
          <>
            <HiXCircle className="w-24 h-24 text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold">Thanh toán thất bại</h1>
            <p className="text-dark-500">Giao dịch không thành công. Vui lòng thử lại.</p>
          </>
        )}
        <div className="flex gap-4 justify-center">
          <Link to="/my-bookings" className="btn-secondary">Vé của tôi</Link>
          <Link to="/" className="btn-primary">Về trang chủ</Link>
        </div>
      </div>
    </div>
  );
}
