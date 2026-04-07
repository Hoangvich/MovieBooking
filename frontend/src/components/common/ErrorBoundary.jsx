import { Component } from 'react';
import { HiExclamationTriangle } from 'react-icons/hi2';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <HiExclamationTriangle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold">Đã xảy ra lỗi</h2>
            <p className="text-dark-500">Vui lòng tải lại trang hoặc thử lại sau.</p>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
