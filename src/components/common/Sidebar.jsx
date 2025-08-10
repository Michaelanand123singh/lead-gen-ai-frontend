// frontend/src/components/common/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const NavLink = ({ to, label, onClick }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {label}
    </Link>
  );
};

const SidebarContent = ({ onItemClick }) => (
  <nav className="p-4 space-y-1">
    <NavLink to={ROUTES.HOME} label="Home" onClick={onItemClick} />
    <NavLink to={ROUTES.ANALYZE} label="Analyze" onClick={onItemClick} />
    <NavLink to={ROUTES.BULK} label="Bulk Process" onClick={onItemClick} />
    <NavLink to={ROUTES.REPORTS} label="Reports" onClick={onItemClick} />
    <NavLink to={ROUTES.PROPOSALS} label="Proposal Generation" onClick={onItemClick} />
    <NavLink to={ROUTES.LEADS} label="Leads" onClick={onItemClick} />
    <NavLink to={ROUTES.LEAD_TRACKER} label="Lead Tracker" onClick={onItemClick} />
    <NavLink to={ROUTES.SETTINGS} label="Settings" onClick={onItemClick} />
  </nav>
);

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r">
        <div className="h-16 border-b px-4 flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">WA</span>
          </div>
          <span className="ml-2 text-lg font-semibold text-gray-900">Website Analyzer</span>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg">
            <div className="h-16 border-b px-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">WA</span>
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-900">Website Analyzer</span>
              </div>
              <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidebarContent onItemClick={onClose} />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;


