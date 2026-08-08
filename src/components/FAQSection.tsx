import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Search,
  CheckCircle2,
  FileCheck,
  Award,
  Download,
  Building2,
  Sparkles,
  X
} from 'lucide-react';

export interface FAQItem {
  id: string;
  category: 'general' | 'verification' | 'employers' | 'passport';
  question: string;
  answer: string;
  badge?: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'What is the Zamfara Youth Digital Skills Passport?',
    answer: 'The Zamfara Youth Digital Skills Passport is an official competency and verification platform established to record, evaluate, and verify technical and vocational skills for youth across all 14 Local Government Areas (LGAs) of Zamfara State. Each registered candidate receives a unique Passport Code (e.g., ZSP-GUS-2026-0891) and a QR-verified profile.',
    badge: 'Core Concept'
  },
  {
    id: 'faq-2',
    category: 'verification',
    question: 'How does a skill or certificate receive the "Verified" State Badge?',
    answer: 'Skills and certificates earn the State Verified Badge through two pathways: (1) Scoring 70%+ on official platform technical competency assessments, or (2) Submitting vocational training certificates from recognized institutes for administrative review. Once verified, a green state seal badge appears on your passport.',
    badge: 'State Verification'
  },
  {
    id: 'faq-3',
    category: 'verification',
    question: 'How can employers verify a candidate\'s Skills Passport?',
    answer: 'Employers can navigate to the Public Verification Portal and type in the candidate\'s Passport Verification Code or scan the QR code printed on their Skills Passport document. The system renders the live, tamper-proof record without requiring login credentials.',
    badge: 'Employer Verification'
  },
  {
    id: 'faq-4',
    category: 'passport',
    question: 'How do I download my Digital Skills Passport as a PDF?',
    answer: 'Open "My Skills Passport" in your Youth Candidate Portal and click the "Download PDF" button in the control panel. The platform generates an official, high-resolution A4 PDF document containing your credentials, LGA verification seal, verified skills list, and QR code.',
    badge: 'PDF Generation'
  },
  {
    id: 'faq-5',
    category: 'general',
    question: 'Is registration free for youth candidates across all 14 LGAs?',
    answer: 'Yes, registration and competency assessments are 100% free for all youth jobseekers and vocational trainees in Gusau, Anka, Bakura, Bukkuyum, Bungudu, Gummi, Kauran Namoda, Maradun, Maru, Shinkafi, Talata Mafara, Tsafe, Zurmi, and Birnin Magaji.',
    badge: '100% Free'
  },
  {
    id: 'faq-6',
    category: 'employers',
    question: 'How can employers post job and apprenticeship opportunities?',
    answer: 'Employers, government ministries, and master artisans can create an Employer Portal account to publish job vacancies, artisan apprenticeships, or skill sponsorship schemes, set required skill badges, and review candidate applications directly.',
    badge: 'Employer Access'
  }
];

export const FAQSection: React.FC<{ isModal?: boolean; onClose?: () => void }> = ({
  isModal = false,
  onClose
}) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const content = (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 rounded-2xl border border-emerald-800 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-400 text-emerald-950 rounded-xl shadow-sm">
              <HelpCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 block">
                Zamfara State Support Hub
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Frequently Asked Questions (FAQ)
              </h2>
            </div>
          </div>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-emerald-900/80 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
        <p className="text-xs sm:text-sm text-emerald-200 mt-2 max-w-2xl leading-relaxed">
          Learn how the Zamfara Youth Digital Skills Passport works, how skill badges are verified by state authorities, and how candidates and employers connect.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'general', label: 'General' },
            { id: 'verification', label: 'Verification' },
            { id: 'passport', label: 'Passport & PDF' },
            { id: 'employers', label: 'Employers' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-emerald-800 text-amber-300 shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQ questions..."
            className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-emerald-700"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
        </div>
      </div>

      {/* Verified State Badge Guarantee Banner */}
      <div className="bg-amber-500/10 border-2 border-amber-400/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-400 text-emerald-950 rounded-xl font-bold shadow-sm shrink-0">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-slate-900">Official State Verification Guarantee</h4>
              <span className="bg-emerald-800 text-amber-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-emerald-700">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Every verified record bears the official seal of the Zamfara State Youth Competency Board, backed by tamper-proof digital signatures.
            </p>
          </div>
        </div>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No matching questions found</p>
            <p className="text-xs text-slate-500 mt-1">Try searching with a different term like "verification", "PDF", or "employers".</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'border-emerald-700 ring-2 ring-emerald-600/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full text-left p-4 flex items-center justify-between gap-3 cursor-pointer bg-white hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isOpen ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">
                        {faq.question}
                      </h4>
                      {faq.badge && (
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1">
                          {faq.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-700' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-4 pt-1 border-t border-slate-100 bg-slate-50/60 text-xs text-slate-700 leading-relaxed space-y-2 animate-in fade-in duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-slate-50 rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
