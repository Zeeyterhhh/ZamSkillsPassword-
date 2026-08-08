import React, { useState, useEffect } from 'react';
import { User, AdminStats, VerificationRequest, AdminActivityLog, ZAMFARA_LGAS } from '../types';
import { fetchJson } from '../lib/api';
import { UserAvatar } from './UserAvatar';
import {
  ShieldAlert,
  Users,
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Search,
  Activity,
  Award,
  Briefcase,
  GraduationCap,
  TrendingUp,
  MapPin,
  Building2
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  onViewPassport: (passportId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onViewPassport
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'verifications' | 'users' | 'activity'>('analytics');

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activityLogs, setActivityLogs] = useState<AdminActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Review Modal
  const [selectedReq, setSelectedReq] = useState<VerificationRequest | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  // User search filter
  const [userSearch, setUserSearch] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetchJson<{ stats: AdminStats }>('/api/admin/stats'),
      fetchJson<{ requests: VerificationRequest[] }>('/api/verifications/requests'),
      fetchJson<{ users: User[] }>('/api/admin/users'),
      fetchJson<{ logs: AdminActivityLog[] }>('/api/admin/logs')
    ])
      .then(([statsRes, verifRes, usersRes, logsRes]) => {
        setStats(statsRes.stats);
        setVerificationRequests(verifRes.requests);
        setUsers(usersRes.users);
        setActivityLogs(logsRes.logs);
      })
      .catch((err) => console.error('Failed to load admin portal:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleReviewVerification = (status: 'verified' | 'rejected') => {
    if (!selectedReq) return;

    fetchJson(`/api/verifications/${selectedReq.id}/review`, {
      method: 'POST',
      body: JSON.stringify({
        status,
        adminNotes: reviewNote || (status === 'verified' ? 'Credential verified against official board register.' : 'Document unreadable or invalid credentials.'),
        adminId: currentUser.id,
        adminName: currentUser.fullName
      })
    })
      .then(() => {
        setSelectedReq(null);
        setReviewNote('');
        loadData();
      })
      .catch((err) => alert(err.message));
  };

  const handleToggleUserStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    fetchJson(`/api/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status: newStatus,
        adminName: currentUser.fullName
      })
    })
      .then(() => loadData())
      .catch((err) => alert(err.message));
  };

  if (loading || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-800 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-xs font-semibold">Loading Administrator Dashboard...</p>
      </div>
    );
  }

  const pendingRequests = verificationRequests.filter((r) => r.status === 'under_review');
  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 rounded-2xl shadow-lg border border-emerald-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-xl shadow">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Verification Board Admin Portal</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-md">
                System Administrator
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              Zamfara State Ministry of Youth & Sports Development
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-900/80 p-3 rounded-xl border border-emerald-700 text-xs text-right">
            <span className="text-[10px] uppercase text-emerald-300 block font-bold">Pending Review Queue</span>
            <span className="text-lg font-black text-amber-300">{pendingRequests.length} Requests</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold w-full max-w-full min-w-0 no-scrollbar">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'analytics' ? 'bg-emerald-800 text-amber-300 font-extrabold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>Analytics & Statistical Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('verifications')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'verifications' ? 'bg-emerald-800 text-amber-300 font-extrabold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>Verification Queue ({pendingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'users' ? 'bg-emerald-800 text-amber-300 font-extrabold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-blue-400" />
          <span>User & Employer Management ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'activity' ? 'bg-emerald-800 text-amber-300 font-extrabold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4 text-purple-400" />
          <span>Audit Activity Trail</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS PORTAL */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* Key KPI Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Registered Users</span>
              <p className="text-2xl font-black text-slate-900">{stats.totalRegisteredUsers}</p>
              <p className="text-[11px] text-emerald-700 font-medium">Youth ({stats.totalYouth}) · Employers ({stats.totalEmployers})</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Verified Credentials</span>
              <p className="text-2xl font-black text-emerald-800">{stats.totalVerifiedCredentials}</p>
              <p className="text-[11px] text-amber-700 font-medium">{stats.pendingVerifications} Pending Review</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Opportunities</span>
              <p className="text-2xl font-black text-slate-900">{stats.activeOpportunities}</p>
              <p className="text-[11px] text-purple-700 font-medium">{stats.totalApplications} Applications</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Registered Skills</span>
              <p className="text-2xl font-black text-slate-900">{stats.totalSkillsRegistered}</p>
              <p className="text-[11px] text-blue-700 font-medium">13 Vocational Categories</p>
            </div>

          </div>

          {/* Charts & Breakdown Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* LGA Youth Distribution */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Youth Registered by Zamfara State LGA</span>
                </h3>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  All 14 LGAs
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
                {ZAMFARA_LGAS.map((lga) => {
                  const count = stats.usersByLGA[lga] || 0;
                  const percent = Math.min(100, Math.round((count / (stats.totalYouth || 1)) * 100));
                  return (
                    <div key={lga} className="space-y-1">
                      <div className="flex justify-between font-medium text-slate-700">
                        <span>{lga} LGA</span>
                        <span className="font-bold text-slate-900">{count} Candidates ({percent}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                          style={{ width: `${Math.max(8, percent)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Popular Skills Categories */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Popular Skill Categories in Platform</span>
              </h3>

              <div className="space-y-3 text-xs">
                {stats.popularSkills.map((sk) => (
                  <div key={sk.category} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{sk.category}</span>
                      <span className="text-[10px] text-slate-500">Registered youth competency entries</span>
                    </div>
                    <span className="font-black text-sm text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
                      {sk.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: VERIFICATION REQUESTS QUEUE */}
      {activeTab === 'verifications' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Certificate Verification Queue</h3>
            <p className="text-xs text-slate-500">Review uploaded youth credentials, audit issuing institutions, and issue official verification badges</p>
          </div>

          <div className="space-y-3">
            {verificationRequests.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No verification requests submitted.</p>
            ) : (
              verificationRequests.map((req) => (
                <div key={req.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-slate-900">{req.certificateTitle}</h4>
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          req.status === 'verified' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          req.status === 'under_review' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {req.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Candidate: <strong>{req.userName}</strong> ({req.userLga} LGA) · Issuing Body: <strong>{req.issuingOrganization}</strong>
                      </p>
                      <p className="text-[10px] text-slate-400">Submitted: {new Date(req.submittedAt).toLocaleDateString('en-NG')}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={req.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Inspect Doc</span>
                      </a>

                      {req.status === 'under_review' && (
                        <button
                          onClick={() => setSelectedReq(req)}
                          className="text-xs font-bold px-4 py-1.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm"
                        >
                          Review & Decision
                        </button>
                      )}
                    </div>
                  </div>

                  {req.adminNotes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <strong>Admin Note:</strong> {req.adminNotes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Review Decision Modal */}
          {selectedReq && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-bold text-base text-slate-900">Review Verification Request</h3>
                  <button onClick={() => setSelectedReq(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <p><strong>Candidate:</strong> {selectedReq.userName} ({selectedReq.userLga} LGA)</p>
                  <p><strong>Title:</strong> {selectedReq.certificateTitle}</p>
                  <p><strong>Issuing Body:</strong> {selectedReq.issuingOrganization}</p>
                  <a
                    href={selectedReq.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-800 font-bold hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View Certificate Document
                  </a>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-700 block">Verification Feedback Note (Optional)</label>
                  <textarea
                    rows={3}
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="e.g. Credential verified against official NITDA / NDE database."
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    onClick={() => handleReviewVerification('rejected')}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 text-xs flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" /> Reject Request
                  </button>
                  <button
                    onClick={() => handleReviewVerification('verified')}
                    className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 text-xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" /> Verify & Approve
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">User Account Management</h3>
              <p className="text-xs text-slate-500">Search registered youth candidates and employers across Zamfara State</p>
            </div>

            <div className="relative w-64">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search accounts..."
                className="w-full border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm w-full min-w-0">
            <table className="w-full min-w-[550px] text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">User / Name</th>
                  <th className="p-3">Email & Phone</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar name={u.fullName} avatarUrl={u.avatarUrl} isDemo={u.isDemo} size="sm" showDemoBadge={u.isDemo} />
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{u.fullName}</p>
                          {u.isDemo && (
                            <span className="text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 font-extrabold">
                              Demo
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{u.email}<br /><span className="text-[10px] text-slate-500">{u.phone}</span></td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        u.role === 'youth' ? 'bg-blue-100 text-blue-800' : u.role === 'employer' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleUserStatus(u.id, u.status)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                          u.status === 'active' ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT ACTIVITY LOGS */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">System Activity Audit Trail</h3>
            <p className="text-xs text-slate-500">Log of administrative decisions and verification actions</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            {activityLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-[10px] text-slate-500">by {log.adminName}</span>
                  </div>
                  <p className="text-slate-700 mt-0.5">Target: <strong>{log.target}</strong></p>
                  <p className="text-slate-500 text-[11px]">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleString('en-NG')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
