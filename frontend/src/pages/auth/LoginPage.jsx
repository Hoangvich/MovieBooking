import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { HiFilm, HiEye, HiEyeSlash } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import authApi from '../../api/authApi';
import { setCredentials } from '../../store/slices/authSlice';

const schema = yup.object({
  username: yup.string().required('Vui lòng nhập tên đăng nhập'),
  password: yup.string().required('Vui lòng nhập mật khẩu'),
});

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await authApi.login(formData);
      dispatch(setCredentials(res.data));
      toast.success('Đăng nhập thành công!');
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <HiFilm className="w-12 h-12 text-primary-600 mx-auto mb-3" />
          <h1 className="text-2xl font-bold">Đăng nhập</h1>
          <p className="text-sm text-dark-500 mt-1">Chào mừng bạn quay lại MovieBooking</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Tên đăng nhập</label>
            <input {...register('username')} className="input-field" placeholder="Nhập tên đăng nhập" />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Mật khẩu</label>
            <div className="relative">
              <input {...register('password')} type={showPw ? 'text' : 'password'}
                className="input-field !pr-10" placeholder="Nhập mật khẩu" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
                {showPw ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center text-sm text-dark-500 mt-6">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-primary-600 font-medium hover:underline">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
