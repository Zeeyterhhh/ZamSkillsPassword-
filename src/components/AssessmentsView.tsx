import React, { useState, useEffect } from 'react';
import { Assessment, SKILL_CATEGORIES } from '../types';
import { fetchJson } from '../lib/api';
import { BookOpen, Clock, Award, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';

interface AssessmentsViewProps {
  onOpenAssessment: (assessmentId: string) => void;
}

export const AssessmentsView: React.FC<AssessmentsViewProps> = ({ onOpenAssessment }) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchJson<{ assessments: Assessment[] }>('/api/assessments')
      .then((data) => setAssessments(data.assessments))
      .catch((err) => console.error('Failed to load assessments:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = selectedCategory === 'All' ? assessments : assessments.filter((a) => a.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800 space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-800/80 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-600">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Platform Competency Assessment Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Take Platform Skill Assessments
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200 max-w-2xl leading-relaxed">
          Verify your practical skills through platform competency quizzes. Passing an assessment awards a verified badge directly to your Digital Skills Passport.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-xl transition-colors shrink-0 ${
            selectedCategory === 'All' ? 'bg-emerald-800 text-amber-300 font-extrabold shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Categories
        </button>
        {SKILL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl transition-colors shrink-0 ${
              selectedCategory === cat ? 'bg-emerald-800 text-amber-300 font-extrabold shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-800 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-xs font-semibold">Loading assessment quizzes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((asm) => (
            <div key={asm.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {asm.category}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    {asm.timeLimitMinutes} Mins · {asm.questions.length} Questions
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900">{asm.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{asm.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-amber-700 font-bold">Pass Mark: {asm.passingScorePercent}%</span>
                <button
                  onClick={() => onOpenAssessment(asm.id)}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <span>Start Assessment</span>
                  <ChevronRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
