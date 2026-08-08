import React, { useState, useEffect } from 'react';
import { SKILL_CATEGORIES, ZAMFARA_LGAS, Opportunity } from '../types';
import { fetchJson } from '../lib/api';
import { UserAvatar } from './UserAvatar';
import { FAQSection } from './FAQSection';
import {
  Award,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Search,
  Building2,
  Users,
  FileCheck,
  QrCode,
  MapPin,
  TrendingUp,
  Cpu,
  Scissors,
  Hammer,
  Wrench,
  Zap,
  Utensils,
  Sprout,
  Heart,
  Car,
  HardHat,
  Rocket,
  Globe,
  Palette
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onSelectCategory: (category: string) => void;
  onSelectOpportunity: (opp: Opportunity) => void;
  setActiveTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onSelectCategory,
  onSelectOpportunity,
  setActiveTab
}) => {
  const [featuredOpportunities, setFeaturedOpportunities] = useState<Opportunity[]>([]);
  const [selectedLgaFilter, setSelectedLgaFilter] = useState<string>('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  useEffect(() => {
    fetchJson<{ opportunities: Opportunity[] }>('/api/opportunities')
      .then((data) => setFeaturedOpportunities(data.opportunities.slice(0, 3)))
      .catch(() => {});
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Information Technology': return <Cpu className="w-5 h-5 text-blue-600" />;
      case 'Tailoring/Fashion': return <Scissors className="w-5 h-5 text-purple-600" />;
      case 'Carpentry': return <Hammer className="w-5 h-5 text-amber-700" />;
      case 'Welding': return <Wrench className="w-5 h-5 text-slate-700" />;
      case 'Electrical Installation': return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'Catering': return <Utensils className="w-5 h-5 text-orange-500" />;
      case 'Agriculture': return <Sprout className="w-5 h-5 text-emerald-600" />;
      case 'Beauty/Cosmetology': return <Heart className="w-5 h-5 text-pink-500" />;
      case 'Automotive': return <Car className="w-5 h-5 text-red-600" />;
      case 'Construction': return <HardHat className="w-5 h-5 text-amber-600" />;
      case 'Entrepreneurship': return <Rocket className="w-5 h-5 text-indigo-600" />;
      case 'Digital Marketing': return <Globe className="w-5 h-5 text-cyan-600" />;
      case 'Graphic Design': return <Palette className="w-5 h-5 text-rose-500" />;
      default: return <Award className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-16 pb-12 bg-slate-50 text-slate-800">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white overflow-hidden py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-600/50 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Zamfara State Youth Competency & Verification System</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              Digitally Verify Your Skills.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-200 to-emerald-400">
                Unlock Real Employment Opportunities
              </span>{' '}
              in Zamfara State.
            </h1>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              A Web-Based Skills Verification and Employment Readiness Platform connecting young workforce talents across all 14 LGAs with verified credentials, competency assessments, and active employer placements.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onOpenAuth('register')}
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>Create Your Skills Passport</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('opportunities')}
                className="bg-emerald-900/80 hover:bg-emerald-800 text-white font-semibold text-sm px-6 py-3.5 rounded-xl border border-emerald-700/80 flex items-center gap-2 transition-all"
              >
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Explore Open Opportunities</span>
              </button>
            </div>

            {/* Quick Metrics Badge */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-emerald-800/60 max-w-lg">
              <div>
                <p className="text-2xl font-black text-amber-300">14 / 14</p>
                <p className="text-xs text-emerald-200">Zamfara LGAs Covered</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-xs text-emerald-200">Verified Credentials</p>
              </div>
              <div>
                <p className="text-2xl font-black text-amber-300">13</p>
                <p className="text-xs text-emerald-200">Vocational Categories</p>
              </div>
            </div>

          </div>

          {/* Hero Visual Card - Sample Skills Passport Preview */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-emerald-900/90 to-teal-950/90 p-6 rounded-2xl border border-emerald-600/40 shadow-2xl space-y-5 relative">
              <div className="absolute -top-3 -right-3 bg-amber-400 text-emerald-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Official Digital Identity
              </div>

              <div className="flex items-center gap-4">
                <UserAvatar
                  name="Aminu Bello Gusau"
                  size="xl"
                  isDemo={true}
                  showDemoBadge={true}
                />
                <div>
                  <h3 className="font-bold text-lg text-white">Aminu Bello Gusau</h3>
                  <div className="flex items-center gap-2 text-xs text-emerald-200 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Gusau LGA, Zamfara State</span>
                  </div>
                  <span className="inline-block text-[10px] font-mono font-semibold text-amber-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/60 mt-1">
                    ZSP-GUS-2026-0891
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-emerald-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-300">Verified Competencies</span>
                  <span className="text-amber-300 font-bold">3 Badges</span>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs bg-emerald-950/60 p-2 rounded-lg border border-emerald-800">
                    <span className="text-white font-medium">Web Development (React & Node.js)</span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-900/80 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-emerald-950/60 p-2 rounded-lg border border-emerald-800">
                    <span className="text-white font-medium">Digital Marketing & SEO</span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded">
                      <Award className="w-3 h-3 text-amber-400" /> Assessed (88%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-emerald-800 text-xs">
                <div className="flex items-center gap-2">
                  <QrCode className="w-8 h-8 text-white p-1 bg-emerald-950 rounded border border-emerald-700" />
                  <span className="text-[11px] text-emerald-300">Scan to Verify Official Record</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold block">Readiness Score</span>
                  <span className="text-lg font-black text-amber-300">88%</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* EXPLANATION OF ZAMFARA SKILLS PASSPORT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full inline-block">
            Platform Vision & Mission
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
            What is the Zamfara Skills Passport?
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            The Zamfara Skills Passport bridges the critical gap between vocational skills acquisition and employment readiness. It gives young artisans, technicians, graduates, and entrepreneurs across all 14 Local Government Areas a tamper-proof digital profile that consolidates work experience, verified certificates, and objective competency assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <FileCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Digitally Document Skills</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Record technical qualifications, training bootcamps, apprentice years, and portfolio evidence in one standardized Digital Skills Passport card.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Authentic Credential Verification</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Uploaded certificates undergo admin review against official issuing bodies (NITDA, NDE, ITF, COREN) to ensure employers receive trustworthy candidate data.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Briefcase className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Direct Opportunity Matching</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Employers in Gusau, Talata Mafara, Kaura Namoda, and beyond post real jobs, internships, and apprenticeships, filtering candidates directly by verified skills and LGA.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-emerald-900/5 py-16 border-y border-emerald-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-200/60 px-3 py-1 rounded-full inline-block">
              Simple 4-Step Process
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              How the Platform Works
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                1
              </div>
              <h4 className="font-bold text-sm text-slate-900">1. Register Profile</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Sign up as Youth, select your LGA in Zamfara State, and generate your unique Digital Passport ID.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                2
              </div>
              <h4 className="font-bold text-sm text-slate-900">2. Add Skills & Documents</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                List your competencies, upload certificates (PDF/Images), and attach work evidence links.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                3
              </div>
              <h4 className="font-bold text-sm text-slate-900">3. Complete Assessment</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Take platform competency quizzes to earn objective platform-verified skill badges.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-emerald-950 font-extrabold text-sm flex items-center justify-center mb-4">
                4
              </div>
              <h4 className="font-bold text-sm text-slate-900">4. Apply & Get Hired</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Apply to jobs, internships, and apprenticeships with 1-click verified Passport submission.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SKILLS CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full inline-block">
              13 Vocational & Technical Fields
            </h2>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">
              Browse Skills Categories
            </h3>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Supporting both modern digital economy skills and critical technical artisan trades across Zamfara State.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                onSelectCategory(cat);
                setActiveTab('opportunities');
              }}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group text-left"
            >
              <div className="p-3 rounded-lg bg-slate-100 group-hover:bg-emerald-50 transition-colors">
                {getCategoryIcon(cat)}
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 transition-colors leading-tight">
                {cat}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* EMPLOYMENT & OPPORTUNITY FEATURED SECTION */}
      <section className="bg-slate-900 text-white py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Active Local Opportunities
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2">
                Featured Jobs, Internships & Apprenticeships
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('opportunities')}
              className="text-xs font-bold text-emerald-300 hover:text-white flex items-center gap-1 bg-emerald-950 px-4 py-2 rounded-lg border border-emerald-800"
            >
              <span>View All Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredOpportunities.map((opp) => (
              <div
                key={opp.id}
                onClick={() => onSelectOpportunity(opp)}
                className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md ${
                      opp.type === 'job' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {opp.type}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">{opp.stipendOrSalary}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                      {opp.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">{opp.employerName}</p>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {opp.lga} LGA
                  </span>
                  <span className="text-amber-400 font-semibold text-[11px]">
                    Deadline: {opp.deadline}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* UN SDG ALIGNMENT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full inline-block">
            Global Impact Goals
          </h2>
          <h3 className="text-2xl font-bold text-slate-900">
            Aligned with United Nations Sustainable Development Goals
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-gradient-to-br from-amber-900 to-amber-950 text-white p-8 rounded-2xl shadow-lg border border-amber-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-amber-300 tracking-tight">SDG 8</span>
              <Briefcase className="w-8 h-8 text-amber-400" />
            </div>
            <h4 className="text-xl font-bold">Decent Work and Economic Growth</h4>
            <p className="text-xs text-amber-100/90 leading-relaxed">
              Promoting sustained, inclusive and sustainable economic growth, full and productive employment, and decent work for youth across all 14 Local Government Areas in Zamfara State.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-300 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Target 8.6: Substantially reduce the proportion of youth not in employment or training.</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-8 rounded-2xl shadow-lg border border-emerald-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-emerald-300 tracking-tight">SDG 4</span>
              <GraduationCap className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="text-xl font-bold">Quality Education & Skills Training</h4>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Ensuring inclusive and equitable quality education while promoting lifelong learning opportunities, technical vocational competency assessments, and certified skills recognition.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Target 4.4: Increase the number of youth with relevant technical and vocational skills.</span>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FAQSection />
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden border border-emerald-700">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Verify Your Skills or Post Opportunities in Zamfara?
            </h3>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Join hundreds of youth jobseekers, master artisans, technical instructors, and employers building a transparent, skill-first workforce economy in Zamfara State.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-3">
              <button
                onClick={() => onOpenAuth('register')}
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all"
              >
                Register Free Account
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="bg-emerald-900 hover:bg-emerald-800 text-white font-semibold text-sm px-6 py-3 rounded-xl border border-emerald-700 transition-all"
              >
                Sign In to Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
