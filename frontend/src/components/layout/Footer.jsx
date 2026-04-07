import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <span className="text-xl font-black text-gray-900 dark:text-white">H<span className="text-red-600">V</span>ich</span>
            <p className="text-xs text-gray-400 mt-2 max-w-xs">Nen tang dat ve phim truc tuyen hang dau Viet Nam.</p>
          </div>
          <div className="flex gap-12">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Phim</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link to="/movies" className="hover:text-gray-900 dark:hover:text-white">Dang chieu</Link></li>
                <li><Link to="/movies?tab=soon" className="hover:text-gray-900 dark:hover:text-white">Sap chieu</Link></li>
                <li><Link to="/movies?tab=all" className="hover:text-gray-900 dark:hover:text-white">Tat ca phim</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Ho tro</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><span className="hover:text-gray-900 dark:hover:text-white cursor-pointer">Huong dan dat ve</span></li>
                <li><span className="hover:text-gray-900 dark:hover:text-white cursor-pointer">Lien he</span></li>
                <li><span className="hover:text-gray-900 dark:hover:text-white cursor-pointer">Dieu khoan</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 text-center text-xs text-gray-400">
          &copy; 2026 HVich. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
