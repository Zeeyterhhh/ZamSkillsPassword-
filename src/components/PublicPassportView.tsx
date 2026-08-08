import React, { useState, useEffect } from 'react';
import { YouthProfile, UserSkill, Certification, Education, Training, AssessmentResult } from '../types';
import { fetchJson } from '../lib/api';
import { DigitalSkillsPassport } from './DigitalSkillsPassport';
import { Search, Award, ShieldAlert } from 'lucide-react';

interface PublicPassportViewProps {
  initialPassportId?: string;
}

export const PublicPassportView: React.FC<PublicPassportViewProps> = ({ initialPassportId = 'ZSP-GUS-2026-0891' }) => {
  const [passportIdInput, setPassportIdInput] = useState<string>(initialPassportId);
  const [passportData, setPassportData] = useState<{
    passport: YouthProfile;
    skills: UserSkill[];
    certifications: Certification[];
    education: Education[];
    trainings: Training[];
    assessmentResults: AssessmentResult[];
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSearchPassport = (idToFetch: string) => {
    if (!idToFetch.trim()) return;
    setLoading(true);
    setError('');

    fetchJson<{
      passport: YouthProfile;
      skills: UserSkill[];
      certifications: Certification[];
      education: Education[];
      trainings: Training[];
      assessmentResults: AssessmentResult[];
    }>(`/api/passport/verify/${idToFetch.trim()}`)
      .then((data) => {
        setPassportData(data);
      })
      .catch((err) => {
        setPassportData(null);
        setError(err.message || 'Passport ID not found in official Zamfara register.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (initialPassportId) {
      handleSearchPassport(initialPassportId);
    }
  }, [initialPassportId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Search Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800 space-y-4">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-emerald-800 px-3 py-1 rounded-full border border-emerald-600">
            Public Verification Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Verify Zamfara Youth Digital Skills Passport
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 max-w-2xl leading-relaxed">
            Enter a candidate's Passport Verification Code (e.g., <strong className="text-amber-300 font-mono">ZSP-GUS-2026-0891</strong>) to inspect verified skills, certifications, and educational achievements.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchPassport(passportIdInput);
          }}
          className="flex flex-col sm:flex-row gap-2 max-w-lg"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={passportIdInput}
              onChange={(e) => setPassportIdInput(e.target.value)}
              placeholder="e.g. ZSP-GUS-2026-0891"
              className="w-full bg-white text-slate-900 placeholder-slate-400 font-mono text-xs font-bold px-4 py-3 rounded-xl border border-slate-300"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
          </div>

          <button
            type="submit"
            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs px-6 py-3 rounded-xl shadow transition-colors"
          >
            Verify Passport
          </button>
        </form>

        {/* Quick Sample Selector */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-emerald-200/90">
          <span className="text-[11px] font-semibold text-emerald-300">Try Demo Passports:</span>
          <button
            onClick={() => {
              setPassportIdInput('ZSP-GUS-2026-0891');
              handleSearchPassport('ZSP-GUS-2026-0891');
            }}
            className="font-mono text-[11px] bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 px-2.5 py-1 rounded-lg border border-emerald-700 transition-colors"
          >
            ZSP-GUS-2026-0891 (Aminu)
          </button>
          <button
            onClick={() => {
              setPassportIdInput('ZSP-TLM-2026-1104');
              handleSearchPassport('ZSP-TLM-2026-1104');
            }}
            className="font-mono text-[11px] bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 px-2.5 py-1 rounded-lg border border-emerald-700 transition-colors"
          >
            ZSP-TLM-2026-1104 (Fatima)
          </button>
          <button
            onClick={() => {
              setPassportIdInput('ZSP-KRN-2026-0412');
              handleSearchPassport('ZSP-KRN-2026-0412');
            }}
            className="font-mono text-[11px] bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 px-2.5 py-1 rounded-lg border border-emerald-700 transition-colors"
          >
            ZSP-KRN-2026-0412 (Ibrahim)
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-800 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-xs font-semibold">Validating Digital Skills Passport credentials...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto space-y-3">
          <ShieldAlert className="w-10 h-10 text-red-600 mx-auto" />
          <h3 className="font-bold text-red-950 text-base">Verification Failed</h3>
          <p className="text-xs text-red-800">{error}</p>
        </div>
      ) : passportData ? (
        <DigitalSkillsPassport
          passport={passportData.passport}
          skills={passportData.skills}
          certifications={passportData.certifications}
          education={passportData.education}
          trainings={passportData.trainings}
          assessmentResults={passportData.assessmentResults}
          isOwner={false}
        />
      ) : null}

    </div>
  );
};
