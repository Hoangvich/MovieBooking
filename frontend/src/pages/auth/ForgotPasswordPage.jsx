import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { HiFilm, HiEnvelope, HiKey } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import authApi from '../../api/authApi';

const emailSchema = yup.object({
  email: yup.string().required('Vui lòng nhập email').email('Email không hợp lệ'),
});

const resetSchema = yup.object({
  token: yup.string().required('Vui lòng nhập mã xác nhận'),
  newPassword: yup.string().required('Vui lòng nhập mật khẩu mới').min(6, 'Tối thiểu 6 ký tự'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Mật khẩu không khớp'),
});

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const emailForm = useForm({ resolver: yupResolver(emailSchema) });
  const resetForm = useForm({ resolver: yupResolver(resetSchema) });

  const onSendEmail = async (data) => {
    setLoading(true);
    try {
      await authApi.forgotPassword({ email: data.email });
      setEmail(data.email);
      setStep(2);
      toast.success('Đã gửi mã xác nhận đến email của bạn!');
    } catch (err) {
      toast.error(err.message || 'Email không tồn tại trong hệ thống');
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async ({ confirmPassword, ...data }) => {
    setLoading(true);
    try {
      await authApi.resetPassword(data);
      setStep(3);
      toast.success('Đặt lại mật khẩu thành công!');
    } catch (err) {
      toast.error(err.message || 'Mã xác nhận không hợp lệ hoặc đã hết hạn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <HiFilm className="w-12 h-12 text-primary-600 mx-auto mb-3" />
          <h1 className="text-2xl font-bold">Quên mật khẩu</h1>
          <p className="text-sm text-dark-500 mt-1">
            {step === 1 && 'Nhập email để nhận mã xác nhận'}
            {step === 2 && `Đã gửi mã đến ${email}`}
            {step === 3 && 'Mật khẩu đã được đặt lại'}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={emailForm.handleSubmit(onSendEmail)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <HiEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input {...emailForm.register('email')} className="input-field !pl-10" placeholder="Nhập email đã đăng ký" />
              </div>
              {emailForm.formState.errors.email && <p className="text-red-500 text-xs mt-1">{emailForm.formState.errors.email.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Mã xác nhận</label>
              <div className="relative">
                <HiKey className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input {...resetForm.register('token')} className="input-field !pl-10" placeholder="Dán mã từ email" />
              </div>
              {resetForm.formState.errors.token && <p className="text-red-500 text-xs mt-1">{resetForm.formState.errors.token.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Mật khẩu mới</label>
              <input {...resetForm.register('newPassword')} type="password" className="input-field" placeholder="Tối thiểu 6 ký tự" />
              {resetForm.formState.errors.newPassword && <p className="text-red-500 text-xs mt-1">{resetForm.formState.errors.newPassword.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Xác nhận mật khẩu</label>
              <input {...resetForm.register('confirmPassword')} type="password" className="input-field" placeholder="Nhập lại mật khẩu mới" />
              {resetForm.formState.errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{resetForm.formState.errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </button>
            <button type="button" onClick={() => { setStep(1); resetForm.reset(); }} className="w-full text-sm text-dark-500 hover:text-primary-600">
              Gửi lại mã
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">&#10003;</span>
            </div>
            <p className="text-sm text-dark-500">Bạn có thể đăng nhập bằng mật khẩu mới.</p>
            <Link to="/login" className="btn-primary inline-block px-8">
              Đăng nhập
            </Link>
          </div>
        )}

        {step !== 3 && (
          <p className="text-center text-sm text-dark-500 mt-6">
            Nhớ mật khẩu?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">Đăng nhập</Link>
          </p>
        )}
      </div>
    </div>
  );
}
