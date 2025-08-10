// frontend/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import BulkPage from './pages/BulkPage';
import ReportsPage from './pages/ReportsPage';
import LeadsPage from './pages/LeadsPage';
import LeadTrackerPage from './pages/LeadTrackerPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import ProposalPage from './pages/ProposalPage';
import { ROUTES } from './utils/constants';
import './index.css';

function RequireAuth({ children }) {
  const isAuthed = (() => {
    try {
      const raw = localStorage.getItem('auth');
      if (!raw) return false;
      const { access_token } = JSON.parse(raw);
      return Boolean(access_token);
    } catch {
      return false;
    }
  })();
  if (!isAuthed) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return children;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex">
          {/* Sidebar spacer for desktop */}
          <div className="hidden md:block md:w-64" />
          <main className="flex-1">
            <Routes>
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.HOME} element={<RequireAuth><HomePage /></RequireAuth>} />
              <Route path={ROUTES.ANALYZE} element={<RequireAuth><AnalyzePage /></RequireAuth>} />
              <Route path={ROUTES.BULK} element={<RequireAuth><BulkPage /></RequireAuth>} />
              <Route path={ROUTES.REPORTS} element={<RequireAuth><ReportsPage /></RequireAuth>} />
              <Route path={ROUTES.PROPOSALS} element={<RequireAuth><ProposalPage /></RequireAuth>} />
              <Route path={ROUTES.LEADS} element={<RequireAuth><LeadsPage /></RequireAuth>} />
              <Route path={ROUTES.LEAD_TRACKER} element={<RequireAuth><LeadTrackerPage /></RequireAuth>} />
              <Route path={ROUTES.SETTINGS} element={<RequireAuth><SettingsPage /></RequireAuth>} />
              
              {/* Catch all route - redirect to home */}
              <Route path="*" element={
                <Navigate to={ROUTES.HOME} replace />
              } />
            </Routes>
          </main>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;