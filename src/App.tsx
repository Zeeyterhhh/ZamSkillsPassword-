import React, { useState, useEffect } from 'react';
import { User, Opportunity } from './types';
import { fetchJson } from './lib/api';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { YouthDashboard } from './components/YouthDashboard';
import { EmployerDashboard } from './components/EmployerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { OpportunitiesView } from './components/OpportunitiesView';
import { AssessmentsView } from './components/AssessmentsView';
import { PublicPassportView } from './components/PublicPassportView';

import { AuthModal } from './components/AuthModal';
import { AssessmentQuizModal } from './components/AssessmentQuizModal';
import { OpportunityDetailsModal } from './components/OpportunityDetailsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'landing' | 'youth_dashboard' | 'employer_dashboard' | 'admin_dashboard' | 'opportunities' | 'assessments' | 'verify_passport'
  >('landing');

  // Currently logged in user session
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modals
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [activeAssessmentId, setActiveAssessmentId] = useState<string | null>(null);
  const [publicVerifyId, setPublicVerifyId] = useState<string>('ZSP-2026-8801');

  // Load default demo user on startup
  useEffect(() => {
    fetchJson<{ users: User[] }>('/api/auth/demo-users')
      .then((data) => {
        if (data.users && data.users.length > 0) {
          // Default to youth candidate Aminu Gusau
          setCurrentUser(data.users[0]);
        }
      })
      .catch((err) => console.error('Failed to load demo user session:', err));
  }, []);

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'youth') {
      setActiveTab('youth_dashboard');
    } else if (user.role === 'employer') {
      setActiveTab('employer_dashboard');
    } else if (user.role === 'admin') {
      setActiveTab('admin_dashboard');
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthInitialMode(mode);
    setShowAuthModal(true);
  };

  const handleViewPublicPassport = (passportId: string) => {
    setPublicVerifyId(passportId);
    setActiveTab('verify_passport');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-amber-300 selection:text-emerald-950">
      
      {/* Top Main Navigation */}
      <Navbar
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={handleOpenAuth}
        onSelectPassportId={handleViewPublicPassport}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            onOpenAuth={handleOpenAuth}
            onSelectCategory={(cat) => {
              setActiveTab('opportunities');
            }}
            onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'youth_dashboard' && (
          currentUser && currentUser.role === 'youth' ? (
            <YouthDashboard
              currentUser={currentUser}
              onOpenAssessment={(asmId) => setActiveAssessmentId(asmId)}
              onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
            />
          ) : (
            <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
              <div className="w-14 h-14 bg-amber-100 text-amber-900 rounded-2xl mx-auto flex items-center justify-center font-bold text-xl">
                ZSP
              </div>
              <h2 className="text-xl font-bold text-slate-900">Youth Candidate Portal Access</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {currentUser ? `You are currently logged in as ${currentUser.fullName} (${currentUser.role}). Please switch to a Youth Candidate account to view this dashboard.` : 'Please log in or select a Youth candidate demo account to access the Skills Passport dashboard.'}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="px-4 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900 transition-colors"
                >
                  Sign In / Register
                </button>
                <button
                  onClick={() => {
                    fetchJson<{ users: User[] }>('/api/auth/demo-users').then((d) => {
                      const youth = d.users?.find((u) => u.role === 'youth');
                      if (youth) handleSelectUser(youth);
                    });
                  }}
                  className="px-4 py-2 bg-amber-100 text-amber-900 text-xs font-bold rounded-xl hover:bg-amber-200 border border-amber-300 transition-colors"
                >
                  Switch to Demo Youth Candidate
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'employer_dashboard' && (
          currentUser && currentUser.role === 'employer' ? (
            <EmployerDashboard
              currentUser={currentUser}
              onViewPassport={handleViewPublicPassport}
            />
          ) : (
            <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-900 rounded-2xl mx-auto flex items-center justify-center font-bold text-xl">
                EMP
              </div>
              <h2 className="text-xl font-bold text-slate-900">Employer Portal Access</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {currentUser ? `You are currently logged in as ${currentUser.fullName} (${currentUser.role}). Please switch to an Employer account to post opportunities and review applicants.` : 'Please log in or select an Employer demo account to manage jobs and candidates.'}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="px-4 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900 transition-colors"
                >
                  Sign In / Register
                </button>
                <button
                  onClick={() => {
                    fetchJson<{ users: User[] }>('/api/auth/demo-users').then((d) => {
                      const emp = d.users?.find((u) => u.role === 'employer');
                      if (emp) handleSelectUser(emp);
                    });
                  }}
                  className="px-4 py-2 bg-amber-100 text-amber-900 text-xs font-bold rounded-xl hover:bg-amber-200 border border-amber-300 transition-colors"
                >
                  Switch to Demo Employer
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'admin_dashboard' && (
          currentUser && currentUser.role === 'admin' ? (
            <AdminDashboard
              currentUser={currentUser}
              onViewPassport={handleViewPublicPassport}
            />
          ) : (
            <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
              <div className="w-14 h-14 bg-slate-100 text-slate-900 rounded-2xl mx-auto flex items-center justify-center font-bold text-xl">
                ADM
              </div>
              <h2 className="text-xl font-bold text-slate-900">Verification Board Admin Access</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {currentUser ? `You are currently logged in as ${currentUser.fullName} (${currentUser.role}). Please switch to an Admin account to access verification queues.` : 'Please log in or switch to the Admin demo account.'}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="px-4 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900 transition-colors"
                >
                  Sign In / Register
                </button>
                <button
                  onClick={() => {
                    fetchJson<{ users: User[] }>('/api/auth/demo-users').then((d) => {
                      const admin = d.users?.find((u) => u.role === 'admin');
                      if (admin) handleSelectUser(admin);
                    });
                  }}
                  className="px-4 py-2 bg-amber-100 text-amber-900 text-xs font-bold rounded-xl hover:bg-amber-200 border border-amber-300 transition-colors"
                >
                  Switch to Demo Admin
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'opportunities' && (
          <OpportunitiesView
            onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
          />
        )}

        {activeTab === 'assessments' && (
          <AssessmentsView
            onOpenAssessment={(asmId) => setActiveAssessmentId(asmId)}
          />
        )}

        {activeTab === 'verify_passport' && (
          <PublicPassportView
            initialPassportId={publicVerifyId}
          />
        )}
      </main>

      {/* Global Modals */}
      {showAuthModal && (
        <AuthModal
          initialMode={authInitialMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={(user) => {
            handleSelectUser(user);
          }}
        />
      )}

      {selectedOpportunity && (
        <OpportunityDetailsModal
          opportunity={selectedOpportunity}
          currentUser={currentUser}
          onClose={() => setSelectedOpportunity(null)}
          onOpenAuth={() => handleOpenAuth('login')}
        />
      )}

      {activeAssessmentId && currentUser && (
        <AssessmentQuizModal
          assessmentId={activeAssessmentId}
          currentUser={currentUser}
          onClose={() => setActiveAssessmentId(null)}
          onCompleted={() => {
            // refresh
          }}
        />
      )}

      {/* Global Footer */}
      <Footer onSelectTab={setActiveTab} />

    </div>
  );
}
