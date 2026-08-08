import React, { useState } from 'react';
import { Opportunity, User } from '../types';
import { fetchJson } from '../lib/api';
import { Briefcase, MapPin, CheckCircle2, Award, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface OpportunityDetailsModalProps {
  opportunity: Opportunity;
  currentUser: User | null;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const OpportunityDetailsModal: React.FC<OpportunityDetailsModalProps> = ({
  opportunity,
  currentUser,
  onClose,
  onOpenAuth
}) => {
  const [coverNote, setCoverNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    setSubmitting(true);
    fetchJson(`/api/opportunities/${opportunity.id}/apply`, {
      method: 'POST',
      body: JSON.stringify({
        userId: currentUser.id,
        coverNote
      })
    })
      .then(() => setSubmitted(true))
      .catch((err) => alert(err.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
              {opportunity.type}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">{opportunity.title}</h2>
            <p className="text-xs text-slate-600 mt-0.5">{opportunity.employerName} · {opportunity.lga} LGA, Zamfara State</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-500 font-medium block">Compensation / Stipend</span>
            <span className="font-extrabold text-emerald-800 text-sm">{opportunity.stipendOrSalary}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Application Deadline</span>
            <span className="font-bold text-slate-800">{opportunity.deadline}</span>
          </div>

          <div className="col-span-2 pt-2 border-t border-slate-200">
            <span className="text-slate-500 font-medium block">Minimum Required Qualification</span>
            <span className="font-bold text-slate-800">{opportunity.minQualification}</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Role Description</h3>
          <p className="text-slate-600 leading-relaxed">{opportunity.description}</p>
        </div>

        {/* Required Skills */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {opportunity.requiredSkills.map((sk) => (
              <span key={sk} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md font-semibold text-[11px]">
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Application Form or Status */}
        {submitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-950 text-sm">Application Successfully Submitted!</h4>
            <p className="text-xs text-emerald-800">Your verified Digital Skills Passport has been transmitted directly to {opportunity.employerName}.</p>
            <button onClick={onClose} className="mt-2 text-xs font-bold text-emerald-900 bg-emerald-200 px-4 py-2 rounded-xl">
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-3 pt-2 border-t border-slate-200 text-xs">
            {currentUser && currentUser.role === 'youth' ? (
              <>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Application Note / Message to Employer (Optional)</label>
                  <textarea
                    rows={3}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Briefly state why your verified skills fit this role in Zamfara State..."
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Your Digital Skills Passport will be attached</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs px-6 py-2.5 rounded-xl shadow transition-colors"
                  >
                    {submitting ? 'Transmitting...' : 'Submit Application'}
                  </button>
                </div>
              </>
            ) : currentUser ? (
              <p className="text-xs text-slate-500 italic text-center py-2">
                You are currently signed in as an {currentUser.role}. Switch to a Youth account to apply.
              </p>
            ) : (
              <div className="text-center py-3 space-y-2 bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-700 font-semibold">Sign in as a Youth candidate to apply with your Digital Skills Passport.</p>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="bg-emerald-800 text-white font-bold text-xs px-5 py-2 rounded-xl"
                >
                  Sign In / Register
                </button>
              </div>
            )}
          </form>
        )}

      </div>
    </div>
  );
};
