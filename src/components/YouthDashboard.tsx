import React, { useState, useEffect } from 'react';
import { User, YouthProfile, UserSkill, Certification, Education, Training, AssessmentResult, Opportunity, Application, SKILL_CATEGORIES, ZAMFARA_LGAS, SkillCategory, SkillLevel, EmploymentStatus } from '../types';
import { fetchJson } from '../lib/api';
import { DigitalSkillsPassport } from './DigitalSkillsPassport';
import { ProfileCompletionMeter } from './ProfileCompletionMeter';
import { UserAvatar, getInitials } from './UserAvatar';
import { LearningRoadmap } from './LearningRoadmap';
import {
  Award,
  FileCheck,
  Plus,
  Trash2,
  Upload,
  BookOpen,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Bot,
  User as UserIcon,
  ShieldAlert,
  Search,
  MapPin,
  ChevronRight,
  Compass
} from 'lucide-react';

interface YouthDashboardProps {
  currentUser: User;
  onOpenAssessment: (assessmentId: string) => void;
  onSelectOpportunity: (opp: Opportunity) => void;
}

export const YouthDashboard: React.FC<YouthDashboardProps> = ({
  currentUser,
  onOpenAssessment,
  onSelectOpportunity
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'passport' | 'skills' | 'certificates' | 'assessments' | 'roadmap' | 'applications' | 'profile'>('passport');
  
  // Data state
  const [passport, setPassport] = useState<YouthProfile | null>(null);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [availableOpportunities, setAvailableOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Forms
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('Information Technology');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('intermediate');
  const [newSkillExpYears, setNewSkillExpYears] = useState(1);
  const [newSkillEvidenceUrl, setNewSkillEvidenceUrl] = useState('');
  const [newSkillEvidenceDesc, setNewSkillEvidenceDesc] = useState('');

  // Upload Cert
  const [showUploadCertModal, setShowUploadCertModal] = useState(false);
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certCredId, setCertCredId] = useState('');
  const [certDocUrl, setCertDocUrl] = useState('');

  // AI Career Advice
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [loadingAiAdvice, setLoadingAiAdvice] = useState<boolean>(false);

  // Profile Edit
  const [editBio, setEditBio] = useState('');
  const [editLga, setEditLga] = useState<string>('Gusau');
  const [editPhone, setEditPhone] = useState('');
  const [editEmpStatus, setEditEmpStatus] = useState<EmploymentStatus>('unemployed');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');

  const loadPassportData = () => {
    setLoading(true);
    fetchJson<{
      passport: YouthProfile;
      skills: UserSkill[];
      certifications: Certification[];
      education: Education[];
      trainings: Training[];
      assessmentResults: AssessmentResult[];
    }>(`/api/youth/passport/${currentUser.id}`)
      .then((data) => {
        setPassport(data.passport);
        setSkills(data.skills);
        setCertifications(data.certifications);
        setEducation(data.education);
        setTrainings(data.trainings);
        setAssessmentResults(data.assessmentResults);

        setEditBio(data.passport.bio || '');
        setEditLga(data.passport.lga || 'Gusau');
        setEditPhone(data.passport.phone || '');
        setEditEmpStatus(data.passport.employmentStatus || 'unemployed');
        setEditAvatarUrl(data.passport.avatarUrl || '');
      })
      .catch((err) => console.error('Failed to load passport:', err))
      .finally(() => setLoading(false));

    fetchJson<{ applications: Application[] }>(`/api/applications/youth/${currentUser.id}`)
      .then((data) => setMyApplications(data.applications))
      .catch(() => {});

    fetchJson<{ opportunities: Opportunity[] }>('/api/opportunities')
      .then((data) => setAvailableOpportunities(data.opportunities))
      .catch(() => {});
  };

  useEffect(() => {
    loadPassportData();
  }, [currentUser]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    fetchJson<{ skill: UserSkill }>('/api/youth/skills', {
      method: 'POST',
      body: JSON.stringify({
        userId: currentUser.id,
        category: newSkillCategory,
        skillName: newSkillName.trim(),
        level: newSkillLevel,
        experienceYears: newSkillExpYears,
        evidenceUrl: newSkillEvidenceUrl,
        evidenceDescription: newSkillEvidenceDesc
      })
    })
      .then(() => {
        setShowAddSkillModal(false);
        setNewSkillName('');
        setNewSkillEvidenceUrl('');
        setNewSkillEvidenceDesc('');
        loadPassportData();
      })
      .catch((err) => alert(err.message));
  };

  const handleDeleteSkill = (skillId: string) => {
    if (!confirm('Are you sure you want to remove this skill from your passport?')) return;
    fetchJson(`/api/youth/skills/${skillId}?userId=${currentUser.id}`, { method: 'DELETE' })
      .then(() => loadPassportData())
      .catch((err) => alert(err.message));
  };

  const handleUploadCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certIssuer.trim()) return;

    fetchJson('/api/verifications/upload', {
      method: 'POST',
      body: JSON.stringify({
        userId: currentUser.id,
        title: certTitle.trim(),
        issuingOrganization: certIssuer.trim(),
        issueDate: certDate || new Date().toISOString().split('T')[0],
        credentialId: certCredId.trim(),
        documentUrl: certDocUrl.trim() || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
      })
    })
      .then(() => {
        setShowUploadCertModal(false);
        setCertTitle('');
        setCertIssuer('');
        setCertCredId('');
        setCertDocUrl('');
        loadPassportData();
      })
      .catch((err) => alert(err.message));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJson(`/api/youth/profile/${currentUser.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        bio: editBio,
        lga: editLga,
        phone: editPhone,
        employmentStatus: editEmpStatus,
        avatarUrl: editAvatarUrl
      })
    })
      .then(() => {
        alert('Profile details updated successfully!');
        loadPassportData();
      })
      .catch((err) => alert(err.message));
  };

  const handleMeterNavigate = (
    subTab: 'passport' | 'skills' | 'certificates' | 'assessments' | 'roadmap' | 'applications' | 'profile',
    actionModal?: 'add_skill' | 'upload_cert'
  ) => {
    setActiveSubTab(subTab);
    if (actionModal === 'add_skill') {
      setShowAddSkillModal(true);
    } else if (actionModal === 'upload_cert') {
      setShowUploadCertModal(true);
    }
  };

  const handleGenerateAiAdvice = () => {
    if (!passport) return;
    setLoadingAiAdvice(true);
    fetchJson<{ advice: string }>('/api/ai/career-advice', {
      method: 'POST',
      body: JSON.stringify({
        passport,
        skills,
        targetLga: passport.lga
      })
    })
      .then((res) => setAiAdvice(res.advice))
      .catch(() => setAiAdvice('Focus on obtaining platform verification badges for your top skill category to increase employer response rates in Zamfara State.'))
      .finally(() => setLoadingAiAdvice(false));
  };

  if (loading || !passport) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-800 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-xs font-semibold">Loading your Zamfara Skills Passport Profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 rounded-2xl shadow-lg border border-emerald-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <UserAvatar
            name={passport.fullName}
            avatarUrl={passport.avatarUrl}
            isDemo={passport.isDemo || currentUser.isDemo}
            size="xl"
            showDemoBadge={passport.isDemo || currentUser.isDemo}
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-white">{passport.fullName}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-md">
                Youth Candidate
              </span>
              {(passport.isDemo || currentUser.isDemo) && (
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-300 text-emerald-950 px-2 py-0.5 rounded-md border border-amber-500">
                  Demo Account
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              Passport ID: <strong className="font-mono text-amber-300">{passport.passportId}</strong> · {passport.lga} LGA, Zamfara
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-emerald-800/80 pt-3 md:pt-0">
          <div className="text-right">
            <span className="text-[10px] text-emerald-300 uppercase font-bold block">Readiness Score</span>
            <span className="text-xl font-black text-amber-300">{passport.readinessScore}%</span>
          </div>
          <button
            onClick={handleGenerateAiAdvice}
            disabled={loadingAiAdvice}
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-amber-400 text-emerald-950 hover:bg-amber-300 flex items-center gap-1.5 shadow transition-colors"
          >
            <Bot className="w-4 h-4 text-emerald-950" />
            <span>{loadingAiAdvice ? 'Analyzing...' : 'AI Career Advice'}</span>
          </button>
        </div>
      </div>

      {/* AI Advice Output Box */}
      {aiAdvice && (
        <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-5 text-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
            <Bot className="w-4 h-4 text-amber-600" />
            <span>AI Career Counseling & Verification Strategy</span>
          </div>
          <p className="text-xs leading-relaxed whitespace-pre-line text-slate-700">
            {aiAdvice}
          </p>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold w-full max-w-full min-w-0 no-scrollbar">
        <button
          onClick={() => setActiveSubTab('passport')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shrink-0 ${
            activeSubTab === 'passport' ? 'bg-emerald-800 text-amber-300 font-extrabold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Skills Passport Card</span>
        </button>

        <button
          onClick={() => setActiveSubTab('skills')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shrink-0 ${
            activeSubTab === 'skills' ? 'bg-emerald-800 text-amber-300 font-extrabold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>My Skills ({skills.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('certificates')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shrink-0 ${
            activeSubTab === 'certificates' ? 'bg-emerald-800 text-amber-300 font-extrabold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>Certificates & Verification ({certifications.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('assessments')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shrink-0 ${
            activeSubTab === 'assessments' ? 'bg-emerald-800 text-amber-300 font-extrabold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>Take Assessments</span>
        </button>

        <button
          onClick={() => setActiveSubTab('roadmap')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shrink-0 ${
            activeSubTab === 'roadmap' ? 'bg-emerald-800 text-amber-300 font-extrabold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-400" />
          <span>Learning Roadmap</span>
        </button>

        <button
          onClick={() => setActiveSubTab('applications')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shrink-0 ${
            activeSubTab === 'applications' ? 'bg-emerald-800 text-amber-300 font-extrabold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4 text-purple-400" />
          <span>My Applications ({myApplications.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shrink-0 ${
            activeSubTab === 'profile' ? 'bg-emerald-800 text-amber-300 font-extrabold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Edit Bio & Location</span>
        </button>
      </div>

      {/* Main 2-Column Dashboard Layout with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Sub-Tab View Area */}
        <div className="lg:col-span-8 space-y-6">

      {/* SUB-TAB CONTENT 1: PASSPORT CARD */}
      {activeSubTab === 'passport' && (
        <DigitalSkillsPassport
          passport={passport}
          skills={skills}
          certifications={certifications}
          education={education}
          trainings={trainings}
          assessmentResults={assessmentResults}
          isOwner={true}
        />
      )}

      {/* SUB-TAB CONTENT 2: SKILLS MANAGEMENT */}
      {activeSubTab === 'skills' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Manage Your Competencies</h3>
              <p className="text-xs text-slate-500">Add technical skills, proficiency levels, and work evidence</p>
            </div>
            <button
              onClick={() => setShowAddSkillModal(true)}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Add New Skill</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((s) => (
              <div key={s.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {s.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{s.skillName}</h4>
                  </div>
                  <button
                    onClick={() => handleDeleteSkill(s.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove Skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <span>Proficiency: <strong className="capitalize text-slate-800">{s.level}</strong></span>
                  <span>{s.experienceYears} Year(s) Experience</span>
                </div>

                {s.evidenceDescription && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                    <strong className="text-slate-800">Evidence:</strong> {s.evidenceDescription}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  {s.isVerified ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified ({s.verifiedBy})
                    </span>
                  ) : (
                    <span className="text-slate-500 italic">Unverified (Take Assessment to Verify)</span>
                  )}
                  {s.evidenceUrl && (
                    <a
                      href={s.evidenceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-800 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Link</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Skill Modal */}
          {showAddSkillModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-bold text-base text-slate-900">Add New Skill to Passport</h3>
                  <button onClick={() => setShowAddSkillModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <form onSubmit={handleAddSkill} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Select Skill Category</label>
                    <select
                      value={newSkillCategory}
                      onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-1 focus:ring-emerald-600"
                    >
                      {SKILL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Skill Title / Specific Competency</label>
                    <input
                      type="text"
                      required
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="e.g. Inverter Wiring & Solar Sizing, Modern Kaftan Tailoring..."
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Proficiency Level</label>
                      <select
                        value={newSkillLevel}
                        onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Years of Practical Experience</label>
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={newSkillExpYears}
                        onChange={(e) => setNewSkillExpYears(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Evidence Description (Optional)</label>
                    <textarea
                      rows={2}
                      value={newSkillEvidenceDesc}
                      onChange={(e) => setNewSkillEvidenceDesc(e.target.value)}
                      placeholder="Briefly describe practical projects or work done using this skill..."
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Evidence URL / Portfolio Link (Optional)</label>
                    <input
                      type="url"
                      value={newSkillEvidenceUrl}
                      onChange={(e) => setNewSkillEvidenceUrl(e.target.value)}
                      placeholder="https://github.com/my-project or https://drive.google.com/..."
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                    />
                  </div>

                  <div className="pt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddSkillModal(false)}
                      className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-emerald-800 text-white font-bold hover:bg-emerald-900"
                    >
                      Save Skill
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* SUB-TAB CONTENT 3: CERTIFICATE UPLOADER */}
      {activeSubTab === 'certificates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Certificates & Credentials Verification</h3>
              <p className="text-xs text-slate-500">Upload vocational certificates, diplomas, and licenses for official board verification</p>
            </div>
            <button
              onClick={() => setShowUploadCertModal(true)}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors"
            >
              <Upload className="w-4 h-4 text-amber-300" />
              <span>Upload Certificate</span>
            </button>
          </div>

          <div className="space-y-3">
            {certifications.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-base text-slate-900">{c.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Issuing Body: <strong>{c.issuingOrganization}</strong> · Issue Date: {c.issueDate}</p>
                    {c.credentialId && <p className="text-[10px] text-slate-500 font-mono">Credential ID: {c.credentialId}</p>}
                  </div>

                  <span className={`self-start sm:self-auto text-xs font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1.5 ${
                    c.status === 'verified' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    c.status === 'under_review' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {c.status === 'verified' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {c.status === 'under_review' && <Clock className="w-4 h-4 text-amber-600 animate-spin" />}
                    {c.status === 'rejected' && <XCircle className="w-4 h-4 text-red-600" />}
                    <span>{c.status.replace('_', ' ')}</span>
                  </span>
                </div>

                {c.rejectionReason && (
                  <p className="text-xs text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-200">
                    <strong>Admin Note:</strong> {c.rejectionReason}
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <a
                    href={c.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-800 font-semibold hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Uploaded Document</span>
                  </a>
                  {c.verifiedAt && <span className="text-slate-400 text-[10px]">Verified on {new Date(c.verifiedAt).toLocaleDateString('en-NG')}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Upload Modal */}
          {showUploadCertModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-bold text-base text-slate-900">Upload Certificate for Verification</h3>
                  <button onClick={() => setShowUploadCertModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <form onSubmit={handleUploadCert} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Certificate Title</label>
                    <input
                      type="text"
                      required
                      value={certTitle}
                      onChange={(e) => setCertTitle(e.target.value)}
                      placeholder="e.g. Certified Web Developer / Level 2 Solar Specialist"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Issuing Organization</label>
                    <input
                      type="text"
                      required
                      value={certIssuer}
                      onChange={(e) => setCertIssuer(e.target.value)}
                      placeholder="e.g. NITDA, NDE, Industrial Training Fund (ITF), NABTEB"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Issue Date</label>
                      <input
                        type="date"
                        value={certDate}
                        onChange={(e) => setCertDate(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Credential ID (Optional)</label>
                      <input
                        type="text"
                        value={certCredId}
                        onChange={(e) => setCertCredId(e.target.value)}
                        placeholder="e.g. NITDA-2025-881"
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Document Image / PDF URL</label>
                    <input
                      type="url"
                      required
                      value={certDocUrl}
                      onChange={(e) => setCertDocUrl(e.target.value)}
                      placeholder="Paste image/PDF link (e.g. Google Drive / Unsplash link)"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                    />
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
                    <strong>Note:</strong> Uploaded credentials undergo review by official board administrators. Upon approval, a <strong>Verified</strong> badge is added to your Skills Passport.
                  </div>

                  <div className="pt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowUploadCertModal(false)}
                      className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-emerald-800 text-white font-bold hover:bg-emerald-900"
                    >
                      Submit for Verification
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* SUB-TAB CONTENT 4: ASSESSMENT HUB */}
      {activeSubTab === 'assessments' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Platform Competency Assessments</h3>
            <p className="text-xs text-slate-500">Take multiple-choice tests to earn official Platform Verified Skill Badges for your Skills Passport</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['asm-it-01', 'asm-tailor-01', 'asm-agric-01', 'asm-elec-01', 'asm-mktg-01'].map((asmId) => (
              <div key={asmId} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      Competency Assessment
                    </span>
                    <span className="text-xs font-semibold text-slate-500">10 Mins · 5 Qs</span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900">
                    {asmId === 'asm-it-01' ? 'IT & Digital Literacy Competency' :
                     asmId === 'asm-tailor-01' ? 'Tailoring & Garment Construction' :
                     asmId === 'asm-agric-01' ? 'Modern Agriculture & Agribusiness' :
                     asmId === 'asm-elec-01' ? 'Electrical & Solar PV Installation' : 'Digital Marketing & E-Commerce'}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Evaluate practical knowledge and earn a platform-verified badge displaying score performance on your Skills Passport.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-amber-700 font-bold">Pass Mark: 70%</span>
                  <button
                    onClick={() => onOpenAssessment(asmId)}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <span>Start Quiz</span>
                    <ChevronRight className="w-4 h-4 text-amber-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB CONTENT 5: APPLICATIONS TRACKER */}
      {activeSubTab === 'applications' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Application Tracking Hub</h3>
            <p className="text-xs text-slate-500">Track current status of submitted applications across Zamfara State</p>
          </div>

          <div className="space-y-3">
            {myApplications.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">You have not submitted any applications yet.</p>
                <button
                  onClick={() => setActiveSubTab('passport')}
                  className="bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Explore Available Opportunities
                </button>
              </div>
            ) : (
              myApplications.map((app) => (
                <div key={app.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-base text-slate-900">{app.opportunityTitle}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{app.employerName} · Submitted: {new Date(app.submittedAt).toLocaleDateString('en-NG')}</p>
                    </div>

                    <span className={`self-start sm:self-auto text-xs font-extrabold uppercase px-3 py-1 rounded-full ${
                      app.status === 'shortlisted' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      app.status === 'accepted' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                      'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}>
                      {app.status.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>

                  {app.coverNote && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <strong>Submitted Cover Note:</strong> {app.coverNote}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB CONTENT: LEARNING ROADMAP */}
      {activeSubTab === 'roadmap' && (
        <LearningRoadmap
          userSkills={skills}
          certifications={certifications}
          onOpenAssessment={onOpenAssessment}
          onSelectOpportunity={onSelectOpportunity}
          userLga={passport.lga}
        />
      )}

      {/* SUB-TAB CONTENT 6: PROFILE & BIO EDIT */}
      {activeSubTab === 'profile' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 max-w-2xl mx-auto space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Edit Youth Profile Details</h3>
            <p className="text-xs text-slate-500">Update biography, phone, location/LGA in Zamfara State, and employment status</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            {/* Profile Photo Avatar Input */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                User Profile Photo (Linked to User ID)
              </label>
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <UserAvatar
                  name={passport.fullName}
                  avatarUrl={editAvatarUrl}
                  isDemo={passport.isDemo || currentUser.isDemo}
                  size="lg"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm">
                      <Upload className="w-3.5 h-3.5 text-amber-300" />
                      <span>Upload Photo File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setEditAvatarUrl(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {editAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => setEditAvatarUrl('')}
                        className="text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-1"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>

                  <input
                    type="url"
                    value={editAvatarUrl.startsWith('data:') ? '' : editAvatarUrl}
                    onChange={(e) => setEditAvatarUrl(e.target.value)}
                    placeholder="Or paste image URL (https://...)"
                    className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 text-xs"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                Registered user photo is permanently associated with User ID <strong className="font-mono text-emerald-800">{currentUser.id}</strong>. If no custom photo is uploaded, your neutral initials avatar ({getInitials(passport.fullName)}) will be displayed across your Skills Passport, Applications, and Public Profile.
              </p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Select LGA in Zamfara State</label>
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
              <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Current Employment Status</label>
              <select
                value={editEmpStatus}
                onChange={(e) => setEditEmpStatus(e.target.value as EmploymentStatus)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
              >
                <option value="unemployed">Unemployed (Seeking Placement)</option>
                <option value="employed">Employed (Full-Time / Part-Time)</option>
                <option value="self_employed">Self-Employed / Artisan Entrepreneur</option>
                <option value="student">Student</option>
                <option value="intern">Intern / Trainee</option>
                <option value="apprentice">Apprentice</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Short Biography / Personal Summary</label>
              <textarea
                rows={4}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 leading-relaxed"
              />
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition-colors"
              >
                Save Profile Details
              </button>
            </div>
          </form>
        </div>
      )}

        </div>

        {/* Right Sidebar Column: Profile Completion Meter & Quick Insights */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Profile Completion Meter Component */}
          <ProfileCompletionMeter
            passport={passport}
            skills={skills}
            certifications={certifications}
            assessmentResults={assessmentResults}
            trainings={trainings}
            onNavigate={handleMeterNavigate}
          />

          {/* Candidate Summary Stats Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3 shadow-sm text-xs">
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">Passport Quick Overview</h4>
            
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Verified Skills</span>
                <span className="text-base font-black text-emerald-800">{skills.filter(s => s.isVerified).length}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Valid Badges</span>
                <span className="text-base font-black text-amber-600">{passport.verifiedBadgeCount}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600">
              <span>National ID (NIN):</span>
              {passport.isNinVerified ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified
                </span>
              ) : (
                <span className="text-slate-500 italic">Unverified</span>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
