import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { HiFilm, HiEye, HiEyeSlash } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import authApi from '../../api/authApi';
import { setCredentials } from '../../store/slices/authSlice';

const schema = yup.object({
  fullName: yup.string().required('Vui lòng nhập họ tên'),
  username: yup.string().required('Vui lòng nhập tên đăng nhập').min(3, 'Tối thiểu 3 ký tự'),
  email: yup.string().required('Vui lòng nhập email').email('Email không hợp lệ'),
  phoneNumber: yup.string().matches(/^[0-9]*$/, 'Số điện thoại không hợp lệ'),
  password: yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Tối thiểu 6 ký tự'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
});

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ confirmPassword, ...formData }) => {
    setLoading(true);
    try {
      const res = await authApi.register(formData);
      dispatch(setCredentials(res.data));
      toast.success('Đăng ký thành công!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <HiFilm className="w-12 h-12 text-primary-600 mx-auto mb-3" />
          <h1 className="text-2xl font-bold">Đăng ký tài khoản</h1>
          <p className="text-sm text-dark-500 mt-1">Tạo tài khoản để đặt vé nhanh hơn</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Họ và tên</label>
            <input {...register('fullName')} className="input-field" placeholder="Nguyễn Văn A" />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Tên đăng nhập</label>
            <input {...register('username')} className="input-field" placeholder="username" />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input {...register('email')} type="email" className="input-field" placeholder="email@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Số điện thoại</label>
            <input {...register('phoneNumber')} className="input-field" placeholder="0901234567" />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Mật khẩu</label>
            <div className="relative">
              <input {...register('password')} type={showPw ? 'text' : 'password'}
                className="input-field !pr-10" placeholder="Tối thiểu 6 ký tự" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
                {showPw ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Xác nhận mật khẩu</label>
            <input {...register('confirmPassword')} type="password" className="input-field" placeholder="Nhập lại mật khẩu" />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full !mt-6">
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center text-sm text-dark-500 mt-6">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
