import React, { useState } from 'react';
import { YouthProfile, UserSkill, Certification, AssessmentResult, Training } from '../types';
import {
  CheckCircle2,
  AlertCircle,
  Camera,
  FileText,
  Phone,
  Award,
  Briefcase,
  FileCheck,
  BookOpen,
  ChevronRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ProfileCompletionMeterProps {
  passport: YouthProfile;
  skills: UserSkill[];
  certifications: Certification[];
  assessmentResults: AssessmentResult[];
  trainings: Training[];
  onNavigate: (
    subTab: 'passport' | 'skills' | 'certificates' | 'assessments' | 'applications' | 'profile',
    actionModal?: 'add_skill' | 'upload_cert'
  ) => void;
}

interface CompletionTask {
  id: string;
  title: string;
  description: string;
  weight: number;
  isComplete: boolean;
  subTab: 'passport' | 'skills' | 'certificates' | 'assessments' | 'applications' | 'profile';
  actionModal?: 'add_skill' | 'upload_cert';
  actionLabel: string;
  icon: React.ElementType;
}

export const ProfileCompletionMeter: React.FC<ProfileCompletionMeterProps> = ({
  passport,
  skills,
  certifications,
  assessmentResults,
  trainings,
  onNavigate
}) => {
  const [showCompletedList, setShowCompletedList] = useState(false);

  // Define completion tasks with dynamic completion checks
  const tasks: CompletionTask[] = [
    {
      id: 'photo',
      title: 'Upload Profile Photo',
      description: 'Add a clear headshot or profile photo to build trust with employers in Zamfara.',
      weight: 15,
      isComplete: Boolean(passport.avatarUrl && passport.avatarUrl.trim().length > 0),
      subTab: 'profile',
      actionLabel: 'Upload Photo',
      icon: Camera
    },
    {
      id: 'bio',
      title: 'Add Short Biography',
      description: 'Write a brief 2-3 sentence summary about your career goals and competencies.',
      weight: 15,
      isComplete: Boolean(passport.bio && passport.bio.trim().length >= 10),
      subTab: 'profile',
      actionLabel: 'Add Bio',
      icon: FileText
    },
    {
      id: 'skills',
      title: 'Add 3+ Technical/Vocational Skills',
      description: skills.length === 0
        ? 'Add technical or trade skills to display on your passport.'
        : `Currently added ${skills.length} skill(s). Add at least 3 for a strong passport.`,
      weight: 20,
      isComplete: skills.length >= 3,
      subTab: 'skills',
      actionModal: 'add_skill',
      actionLabel: skills.length === 0 ? 'Add Skills' : `Add ${3 - skills.length} More`,
      icon: Award
    },
    {
      id: 'experience',
      title: 'Add Work Experience / Evidence',
      description: 'Provide work history, apprenticeship detail, or practical evidence for your skills.',
      weight: 15,
      isComplete: skills.some(s => (s.evidenceDescription && s.evidenceDescription.length > 5) || s.experienceYears > 0) || trainings.length > 0,
      subTab: 'skills',
      actionModal: 'add_skill',
      actionLabel: 'Add Evidence',
      icon: Briefcase
    },
    {
      id: 'phone',
      title: 'Add Mobile Phone Contact',
      description: 'Provide an active phone number so hiring employers can reach out directly.',
      weight: 10,
      isComplete: Boolean(passport.phone && passport.phone.trim().length >= 7),
      subTab: 'profile',
      actionLabel: 'Add Phone',
      icon: Phone
    },
    {
      id: 'certificate',
      title: 'Upload Certification / Credential',
      description: 'Upload an official training certificate, trade test, or diploma for review.',
      weight: 12.5,
      isComplete: certifications.length > 0,
      subTab: 'certificates',
      actionModal: 'upload_cert',
      actionLabel: 'Upload Cert',
      icon: FileCheck
    },
    {
      id: 'assessment',
      title: 'Pass a Competency Assessment',
      description: 'Take a multiple-choice quiz to earn an official Platform Verified Skill Badge.',
      weight: 12.5,
      isComplete: assessmentResults.length > 0,
      subTab: 'assessments',
      actionLabel: 'Take Quiz',
      icon: BookOpen
    }
  ];

  // Calculate score
  const totalCompletedWeight = tasks.reduce(
    (acc, task) => (task.isComplete ? acc + task.weight : acc),
    0
  );
  const percentage = Math.min(100, Math.round(totalCompletedWeight));

  const missingTasks = tasks.filter((t) => !t.isComplete);
  const completedTasks = tasks.filter((t) => t.isComplete);

  // Determine meter badge color & title
  const getMeterStatus = () => {
    if (percentage === 100) return { label: '100% Complete 🏆', color: 'bg-emerald-500 text-white', ringColor: 'stroke-emerald-500' };
    if (percentage >= 80) return { label: 'High Strength ✨', color: 'bg-emerald-100 text-emerald-900 border border-emerald-300', ringColor: 'stroke-emerald-600' };
    if (percentage >= 50) return { label: 'Moderate Strength ⚡', color: 'bg-amber-100 text-amber-900 border border-amber-300', ringColor: 'stroke-amber-500' };
    return { label: 'Needs Improvement ⚠️', color: 'bg-rose-100 text-rose-900 border border-rose-300', ringColor: 'stroke-rose-500' };
  };

  const status = getMeterStatus();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Profile Completion</h3>
            <p className="text-[11px] text-slate-500">Zamfara Skills Passport Strength</p>
          </div>
        </div>

        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Meter Bar / Gauge */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">Passport Completeness</span>
          <span className="font-black text-emerald-800 text-sm">{percentage}%</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 relative">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-emerald-500 to-emerald-700 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium pt-0.5">
          <span>0%</span>
          <span>50%</span>
          <span className="text-emerald-700 font-bold">100% Target</span>
        </div>
      </div>

      {/* Suggested Actions for Missing Sections */}
      {missingTasks.length > 0 ? (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Suggested Actions to reach 100%
            </p>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {missingTasks.length} Pending
            </span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {missingTasks.map((task) => {
              const IconComp = task.icon;
              return (
                <div
                  key={task.id}
                  onClick={() => onNavigate(task.subTab, task.actionModal)}
                  className="group bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200/80 p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 hover:shadow-sm"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="p-2 bg-amber-500/20 text-amber-900 rounded-lg shrink-0 mt-0.5 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-xs text-slate-900 truncate">{task.title}</p>
                        <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded shrink-0">
                          +{task.weight}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug line-clamp-2">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <button className="text-[11px] font-bold px-2.5 py-1.5 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 group-hover:scale-105 transition-all shrink-0 flex items-center gap-1 shadow-sm">
                    <span>{task.actionLabel}</span>
                    <ChevronRight className="w-3 h-3 text-amber-300" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center space-y-1.5">
          <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
          <h4 className="font-bold text-xs text-emerald-950">Outstanding! Your Passport is 100% Complete</h4>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            Your candidate profile is fully optimized for top employer visibility and state deployment programs in Zamfara State.
          </p>
        </div>
      )}

      {/* Completed Sections Accordion */}
      {completedTasks.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => setShowCompletedList(!showCompletedList)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-600 hover:text-slate-900 py-1"
          >
            <span className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Completed Sections ({completedTasks.length}/{tasks.length})
            </span>
            {showCompletedList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showCompletedList && (
            <div className="space-y-1.5 mt-2.5 pt-2 border-t border-slate-100">
              {completedTasks.map((t) => {
                const Icon = t.icon;
                return (
                  <div key={t.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="font-semibold text-slate-800 text-[11px]">{t.title}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Done
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Benefit Callout */}
      <div className="p-3 bg-gradient-to-r from-emerald-950 to-teal-950 rounded-xl text-white space-y-1 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Why reach 100% Completion?</span>
        </div>
        <p className="text-[11px] text-emerald-200/90 leading-relaxed">
          Candidates with complete profiles are <strong>4x more likely</strong> to receive employer interview calls and state placement invitations across Zamfara State.
        </p>
      </div>

    </div>
  );
};
