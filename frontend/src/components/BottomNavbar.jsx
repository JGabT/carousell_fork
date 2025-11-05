import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {/* Home */}
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive('/') ? 'text-primary' : 'text-gray-600 hover:text-primary'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>

          {/* Sell */}
          {user && (
            <button
              onClick={() => navigate('/create-product')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive('/create-product') ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              <div className="relative">
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-xs font-medium">Sell</span>
            </button>
          )}

          {/* Profile or Login */}
          {user ? (
            <button
              onClick={() => navigate('/profile')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive('/profile') ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs font-medium">Profile</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive('/login') ? 'text-primary' : 'text-gray-600 hover:text-primary'
                }`}
              >
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="text-xs font-medium">Login</span>
              </button>
              <button
                onClick={() => navigate('/signup')}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive('/signup') ? 'text-primary' : 'text-gray-600 hover:text-primary'
                }`}
              >
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="text-xs font-medium">Sign Up</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavbar;
