import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import OnboardingPage from './pages/auth/OnboardingPage';
import DashboardLayout from './components/layouts/DashboardLayout';
import ProfilePage from './pages/profile/ProfilePage';
import TeamDirectoryPage from './pages/team/TeamDirectoryPage';
import SettingsPage from './pages/settings/SettingsPage';
import BdeDashboardPage from './pages/bde/DashboardPage';
import LeadsPage from './pages/bde/LeadsPage';
import LeadDetailPage from './pages/bde/LeadDetailPage';
import NewLeadPage from './pages/bde/NewLeadPage';
import EmailComposerPage from './pages/bde/EmailComposerPage';
import ConversionRequestPage from './pages/bde/ConversionRequestPage';
import CompaniesPage from './pages/bde/CompaniesPage';
import CompanyDetailPage from './pages/bde/CompanyDetailPage';
import MasterDashboardPage from './pages/master/DashboardPage';
import ConversionRequestsPage from './pages/master/ConversionRequestsPage';
import MasterCompaniesPage from './pages/master/CompaniesPage';
import MasterUsersPage from './pages/master/UsersPage';
import MasterAnalyticsPage from './pages/master/AnalyticsPage';
import MasterAdminPage from './pages/master/AdminPage';
import MeetingsPage from './pages/communications/MeetingsPage';
import LoadingPage from './pages/utils/LoadingPage';
import NotificationCenterPage from './pages/notifications/NotificationCenterPage';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  return (
    <HashRouter>
      <NotificationProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Dashboard Routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/bde/dashboard" />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="team" element={<TeamDirectoryPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="notifications" element={<NotificationCenterPage />} />
            
            {/* BDE Routes */}
            <Route path="bde/dashboard" element={<BdeDashboardPage />} />
            <Route path="bde/leads" element={<LeadsPage />} />
            <Route path="bde/leads/new" element={<NewLeadPage />} />
            <Route path="bde/leads/:leadId" element={<LeadDetailPage />} />
            <Route path="bde/email/compose" element={<EmailComposerPage />} />
            <Route path="bde/conversion/:leadId" element={<ConversionRequestPage />} />
            <Route path="bde/companies" element={<CompaniesPage />} />
            <Route path="bde/companies/:companyId" element={<CompanyDetailPage />} />

            {/* Masterclass Admin Routes */}
            <Route path="master/dashboard" element={<MasterDashboardPage />} />
            <Route path="master/conversion-requests" element={<ConversionRequestsPage />} />
            <Route path="master/companies" element={<MasterCompaniesPage />} />
            <Route path="master/users" element={<MasterUsersPage />} />
            <Route path="master/analytics" element={<MasterAnalyticsPage />} />
            <Route path="master/admin" element={<MasterAdminPage />} />
            
            {/* Communications Routes */}
            <Route path="communications/meetings" element={<MeetingsPage />} />

          </Route>

          {/* Redirect root to login for any other path */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </NotificationProvider>
    </HashRouter>
  );
}

export default App;