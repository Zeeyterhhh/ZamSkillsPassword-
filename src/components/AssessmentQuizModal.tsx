import React, { useState, useEffect } from 'react';
import { Assessment, AssessmentResult, User } from '../types';
import { fetchJson } from '../lib/api';
import { BookOpen, CheckCircle2, XCircle, Clock, Award, ArrowRight, ShieldCheck } from 'lucide-react';

interface AssessmentQuizModalProps {
  assessmentId: string;
  currentUser: User;
  onClose: () => void;
  onCompleted: () => void;
}

export const AssessmentQuizModal: React.FC<AssessmentQuizModalProps> = ({
  assessmentId,
  currentUser,
  onClose,
  onCompleted
}) => {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 mins
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJson<{ assessment: Assessment }>(`/api/assessments/${assessmentId}`)
      .then((data) => {
        setAssessment(data.assessment);
        setTimeLeft(data.assessment.timeLimitMinutes * 60);
      })
      .catch((err) => alert(err.message));
  }, [assessmentId]);

  useEffect(() => {
    if (result || !assessment) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [result, assessment, selectedOptions]);

  const handleSelectOption = (qId: string, optIdx: number) => {
    setSelectedOptions((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    if (submitting || !assessment) return;
    setSubmitting(true);

    fetchJson<{ result: AssessmentResult }>(`/api/assessments/${assessment.id}/submit`, {
      method: 'POST',
      body: JSON.stringify({
        userId: currentUser.id,
        selectedOptions
      })
    })
      .then((data) => {
        setResult(data.result);
      })
      .catch((err) => alert(err.message))
      .finally(() => setSubmitting(false));
  };

  if (!assessment) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-800 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-xs font-semibold text-slate-600">Loading Assessment Questions...</p>
        </div>
      </div>
    );
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQ = assessment.questions[currentQuestionIdx];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Platform Competency Assessment
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-1">{assessment.title}</h2>
          </div>

          {!result && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-xl text-amber-900 font-extrabold text-xs">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* RESULTS VIEW IF SUBMITTED */}
        {result ? (
          <div className="space-y-6 text-center py-4">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-lg ${
              result.passed ? 'bg-amber-400 text-emerald-950' : 'bg-slate-200 text-slate-700'
            }`}>
              <Award className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">
                {result.passed ? 'Assessment Passed!' : 'Assessment Completed'}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {result.passed
                  ? 'Congratulations! You achieved passing threshold. Your verified platform competency badge has been issued directly to your Skills Passport.'
                  : `You scored ${result.scorePercent}%. Passing mark is ${assessment.passingScorePercent}%. You can retake this assessment anytime.`}
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 max-w-sm mx-auto space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Score Achieved</span>
                <span className="font-extrabold text-emerald-800 text-base">{result.scorePercent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Status</span>
                <span className={`font-bold uppercase ${result.passed ? 'text-emerald-700' : 'text-slate-600'}`}>
                  {result.passed ? 'PASSED' : 'RETAKE RECOMMENDED'}
                </span>
              </div>
              {result.passed && (
                <div className="flex justify-between pt-2 border-t border-slate-200 text-[11px]">
                  <span className="text-slate-500">Badge Code</span>
                  <span className="font-mono font-bold text-amber-700">{result.certificateBadgeId}</span>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  onCompleted();
                  onClose();
                }}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition-colors"
              >
                Return to Skills Passport
              </button>
            </div>
          </div>
        ) : (
          /* QUIZ QUESTIONS FLOW */
          <div className="space-y-6">
            
            {/* Question Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Question {currentQuestionIdx + 1} of {assessment.questions.length}</span>
                <span>{Math.round(((currentQuestionIdx + 1) / assessment.questions.length) * 100)}% Complete</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-800 rounded-full transition-all"
                  style={{ width: `${((currentQuestionIdx + 1) / assessment.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Box */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-slate-900 leading-snug">
                {currentQ.questionText}
              </h3>

              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOptions[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(currentQ.id, idx)}
                      className={`w-full text-left p-4 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-800 text-emerald-950 font-bold shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <span>{opt}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                        isSelected ? 'border-emerald-800 bg-emerald-800 text-amber-300 font-extrabold' : 'border-slate-300'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx((p) => p - 1)}
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 text-slate-700 disabled:opacity-40"
              >
                Previous
              </button>

              {currentQuestionIdx < assessment.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                  className="text-xs font-bold px-5 py-2 rounded-xl bg-emerald-800 text-white hover:bg-emerald-900 flex items-center gap-1"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  className="text-xs font-extrabold px-6 py-2.5 rounded-xl bg-amber-400 text-emerald-950 hover:bg-amber-300 shadow transition-colors"
                >
                  {submitting ? 'Submitting...' : 'Submit Assessment'}
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
