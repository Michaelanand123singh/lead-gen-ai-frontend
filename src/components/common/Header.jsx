// frontend/src/components/common/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const authed = (()=>{
    try { const raw = localStorage.getItem('auth'); if (!raw) return false; return Boolean(JSON.parse(raw)?.access_token); } catch { return false; }
  })();
  const logout = () => { localStorage.removeItem('auth'); navigate(ROUTES.LOGIN, { replace: true }); };
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center">
            <button className="md:hidden mr-2 p-2 rounded hover:bg-gray-100" onClick={onMenuClick}>
              <svg className="h-6 w-6 text-gray-600" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to={ROUTES.HOME} className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">WA</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">Website Analyzer</span>
            </Link>
          </div>

          {/* Right side */}
          <div>
            {authed ? (
              <button onClick={logout} className="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200">Logout</button>
            ) : (
              <Link to={ROUTES.LOGIN} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Login</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;