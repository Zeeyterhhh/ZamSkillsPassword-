import React, { useState, useEffect } from 'react';
import { User, EmployerProfile, Opportunity, Application, YouthProfile, SKILL_CATEGORIES, ZAMFARA_LGAS, SkillCategory, OpportunityType } from '../types';
import { fetchJson } from '../lib/api';
import { UserAvatar } from './UserAvatar';
import {
  Building2,
  Plus,
  Briefcase,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  MapPin,
  Award,
  Phone,
  Mail,
  FileText
} from 'lucide-react';

interface EmployerDashboardProps {
  currentUser: User;
  onViewPassport: (passportId: string) => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  currentUser,
  onViewPassport
}) => {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'candidates' | 'applications' | 'profile'>('opportunities');

  // Employer state
  const [employerProfile, setEmployerProfile] = useState<EmployerProfile | null>(null);
  const [myOpportunities, setMyOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [candidates, setCandidates] = useState<YouthProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters for Candidate Search
  const [candidateLgaFilter, setCandidateLgaFilter] = useState<string>('All');
  const [candidateCategoryFilter, setCandidateCategoryFilter] = useState<string>('All');
  const [candidateSearchQuery, setCandidateSearchQuery] = useState<string>('');

  // Post Opportunity Modal
  const [showPostModal, setShowPostModal] = useState(false);
  const [oppTitle, setOppTitle] = useState('');
  const [oppType, setOppType] = useState<OpportunityType>('job');
  const [oppCategory, setOppCategory] = useState<SkillCategory>('Information Technology');
  const [oppLga, setOppLga] = useState<string>('Gusau');
  const [oppSalary, setOppSalary] = useState('₦100,000 / month');
  const [oppQualification, setOppQualification] = useState('ND / HND / B.Sc or Technical Certificate');
  const [oppDescription, setOppDescription] = useState('');
  const [oppSkillsRequired, setOppSkillsRequired] = useState('Web Development, IT Support');
  const [oppDeadline, setOppDeadline] = useState('2026-09-30');

  // Edit Profile
  const [editOrgName, setEditOrgName] = useState('');
  const [editIndustry, setEditIndustry] = useState('');
  const [editLga, setEditLga] = useState('Gusau');
  const [editAddress, setEditAddress] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const loadData = () => {
    setLoading(true);
    fetchJson<{ employer: EmployerProfile }>(`/api/employer/profile/${currentUser.id}`)
      .then((data) => {
        setEmployerProfile(data.employer);
        setEditOrgName(data.employer.organizationName);
        setEditIndustry(data.employer.industry);
        setEditLga(data.employer.lga);
        setEditAddress(data.employer.address);
        setEditDesc(data.employer.description);
        setEditContact(data.employer.contactPerson);
        setEditPhone(data.employer.phone);
      })
      .catch((err) => console.error('Failed to load employer profile:', err));

    fetchJson<{ opportunities: Opportunity[] }>('/api/opportunities')
      .then((data) => {
        const mine = data.opportunities.filter((o) => o.employerId === currentUser.id);
        setMyOpportunities(mine);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetchJson<{ applications: Application[] }>(`/api/applications/employer/${currentUser.id}`)
      .then((data) => setApplications(data.applications))
      .catch(() => {});

    loadCandidates();
  };

  const loadCandidates = () => {
    const params = new URLSearchParams();
    if (candidateLgaFilter !== 'All') params.append('lga', candidateLgaFilter);
    if (candidateCategoryFilter !== 'All') params.append('category', candidateCategoryFilter);
    if (candidateSearchQuery) params.append('search', candidateSearchQuery);

    fetchJson<{ candidates: YouthProfile[] }>(`/api/employer/candidates?${params.toString()}`)
      .then((data) => setCandidates(data.candidates))
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  useEffect(() => {
    loadCandidates();
  }, [candidateLgaFilter, candidateCategoryFilter, candidateSearchQuery]);

  const handlePostOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppTitle.trim() || !oppDescription.trim()) return;

    fetchJson<{ opportunity: Opportunity }>('/api/opportunities', {
      method: 'POST',
      body: JSON.stringify({
        employerId: currentUser.id,
        employerName: employerProfile?.organizationName || currentUser.fullName,
        employerLogo: employerProfile?.logoUrl,
        title: oppTitle.trim(),
        type: oppType,
        category: oppCategory,
        lga: oppLga,
        stipendOrSalary: oppSalary.trim(),
        requiredSkills: oppSkillsRequired.split(',').map((s) => s.trim()).filter(Boolean),
        minQualification: oppQualification,
        description: oppDescription.trim(),
        responsibilities: [oppDescription.trim().slice(0, 100)],
        deadline: oppDeadline
      })
    })
      .then(() => {
        setShowPostModal(false);
        setOppTitle('');
        setOppDescription('');
        loadData();
      })
      .catch((err) => alert(err.message));
  };

  const handleUpdateApplicationStatus = (appId: string, status: Application['status']) => {
    fetchJson(`/api/applications/${appId}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
        employerUserId: currentUser.id
      })
    })
      .then(() => loadData())
      .catch((err) => alert(err.message));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJson(`/api/employer/profile/${currentUser.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        organizationName: editOrgName,
        industry: editIndustry,
        lga: editLga,
        address: editAddress,
        description: editDesc,
        contactPerson: editContact,
        phone: editPhone
      })
    })
      .then(() => {
        alert('Organization details updated!');
        loadData();
      })
      .catch((err) => alert(err.message));
  };

  if (loading || !employerProfile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-800 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-xs font-semibold">Loading Employer Portal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 rounded-2xl shadow-lg border border-emerald-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-xl shadow">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">{employerProfile.organizationName}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-600 px-2 py-0.5 rounded-md">
                Official Employer
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              {employerProfile.industry} · {employerProfile.lga} LGA, Zamfara State
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Post New Opportunity</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold w-full max-w-full min-w-0 no-scrollbar">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'opportunities' ? 'bg-emerald-800 text-amber-300 font-extrabold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4 text-amber-400" />
          <span>My Posted Opportunities ({myOpportunities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'applications' ? 'bg-emerald-800 text-amber-300 font-extrabold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Received Applications ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('candidates')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'candidates' ? 'bg-emerald-800 text-amber-300 font-extrabold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-blue-400" />
          <span>Search Youth Candidate Pool ({candidates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'profile' ? 'bg-emerald-800 text-amber-300 font-extrabold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Organization Profile</span>
        </button>
      </div>

      {/* TAB 1: MY OPPORTUNITIES */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myOpportunities.length === 0 ? (
              <div className="col-span-2 bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No opportunities posted yet</p>
                <p className="text-xs text-slate-500">Post a job, internship, or apprenticeship to attract verified Zamfara youth talents.</p>
                <button
                  onClick={() => setShowPostModal(true)}
                  className="bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Post Opportunity
                </button>
              </div>
            ) : (
              myOpportunities.map((o) => (
                <div key={o.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {o.type}
                      </span>
                      <h4 className="font-bold text-base text-slate-900 mt-1">{o.title}</h4>
                      <p className="text-xs text-slate-500">{o.lga} LGA · Compensation: {o.stipendOrSalary}</p>
                    </div>

                    <span className="text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                      {o.applicantCount} Applicants
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {o.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Deadline: {o.deadline}</span>
                    <span className="text-emerald-700 font-semibold uppercase">Status: {o.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Received Applications</h3>
            <p className="text-xs text-slate-500">Review candidates, inspect verified Skills Passports, and update recruitment status</p>
          </div>

          <div className="space-y-3">
            {applications.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No applications received yet.</p>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={app.youthName} size="md" isDemo={true} />
                      <div>
                        <h4 className="font-bold text-base text-slate-900">{app.youthName}</h4>
                        <p className="text-xs text-slate-600">Applied for: <strong>{app.opportunityTitle}</strong> · {app.youthLga} LGA</p>
                        <p className="text-[10px] font-mono text-emerald-800 mt-0.5">Passport ID: {app.youthPassportId}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewPassport(app.youthPassportId)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>View Passport</span>
                      </button>

                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value as Application['status'])}
                        className="text-xs font-bold p-1.5 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="submitted">Submitted</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="accepted">Accepted / Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {app.coverNote && (
                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <strong>Applicant Note:</strong> {app.coverNote}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CANDIDATE POOL SEARCH */}
      {activeTab === 'candidates' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Filter by LGA in Zamfara</label>
              <select
                value={candidateLgaFilter}
                onChange={(e) => setCandidateLgaFilter(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              >
                <option value="All">All 14 LGAs</option>
                {ZAMFARA_LGAS.map((lga) => (
                  <option key={lga} value={lga}>{lga}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Filter by Skill Category</label>
              <select
                value={candidateCategoryFilter}
                onChange={(e) => setCandidateCategoryFilter(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              >
                <option value="All">All Skill Categories</option>
                {SKILL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Search Candidate Name or Bio</label>
              <input
                type="text"
                value={candidateSearchQuery}
                onChange={(e) => setCandidateSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidates.map((cand) => (
              <div key={cand.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      name={cand.fullName}
                      avatarUrl={cand.avatarUrl}
                      isDemo={cand.isDemo}
                      size="md"
                      showDemoBadge={cand.isDemo}
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900">{cand.fullName}</h4>
                        {cand.isDemo && (
                          <span className="text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                            Demo
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{cand.lga} LGA · {cand.employmentStatus.replace('_', ' ')}</p>
                      <span className="text-[10px] font-mono text-emerald-800 font-semibold">{cand.passportId}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {cand.bio}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Score: {cand.readinessScore}%
                  </span>
                  <button
                    onClick={() => onViewPassport(cand.passportId)}
                    className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    <span>View Digital Passport</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 4: PROFILE EDIT */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 max-w-2xl mx-auto space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Organization Details</h3>
            <p className="text-xs text-slate-500">Update company contact person, industry, and address in Zamfara State</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Organization Name</label>
              <input
                type="text"
                required
                value={editOrgName}
                onChange={(e) => setEditOrgName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Industry Sector</label>
              <input
                type="text"
                required
                value={editIndustry}
                onChange={(e) => setEditIndustry(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">LGA in Zamfara</label>
                <select
                  value={editLga}
                  onChange={(e) => setEditLga(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                >
                  {ZAMFARA_LGAS.map((lga) => (
                    <option key={lga} value={lga}>{lga} LGA</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Physical Address</label>
              <input
                type="text"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Organization Overview</label>
              <textarea
                rows={3}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition-colors"
              >
                Save Organization Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Post Opportunity Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900">Post Opportunity in Zamfara State</h3>
              <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handlePostOpportunity} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Opportunity Title</label>
                <input
                  type="text"
                  required
                  value={oppTitle}
                  onChange={(e) => setOppTitle(e.target.value)}
                  placeholder="e.g. Solar Installation Technician / Junior Web Developer"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Opportunity Type</label>
                  <select
                    value={oppType}
                    onChange={(e) => setOppType(e.target.value as OpportunityType)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                  >
                    <option value="job">Job (Paid Position)</option>
                    <option value="internship">Internship</option>
                    <option value="apprenticeship">Apprenticeship</option>
                    <option value="training">Training Program</option>
                    <option value="skills_development">Skills Development</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Primary Skill Field</label>
                  <select
                    value={oppCategory}
                    onChange={(e) => setOppCategory(e.target.value as SkillCategory)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                  >
                    {SKILL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">LGA Location</label>
                  <select
                    value={oppLga}
                    onChange={(e) => setOppLga(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                  >
                    {ZAMFARA_LGAS.map((lga) => (
                      <option key={lga} value={lga}>{lga} LGA</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Salary / Stipend (₦ Naira)</label>
                  <input
                    type="text"
                    value={oppSalary}
                    onChange={(e) => setOppSalary(e.target.value)}
                    placeholder="e.g. ₦120,000 / month"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Required Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={oppSkillsRequired}
                  onChange={(e) => setOppSkillsRequired(e.target.value)}
                  placeholder="e.g. React.js, UI/UX, REST APIs"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description & Key Responsibilities</label>
                <textarea
                  rows={3}
                  required
                  value={oppDescription}
                  onChange={(e) => setOppDescription(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-800 text-white font-bold hover:bg-emerald-900"
                >
                  Publish Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
