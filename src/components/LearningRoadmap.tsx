import React, { useState } from 'react';
import { UserSkill, Certification, SkillCategory, Opportunity } from '../types';
import {
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Award,
  Zap,
  TrendingUp,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Target,
  Layers,
  Briefcase
} from 'lucide-react';

interface RoadmapStep {
  id: string;
  levelTitle: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert Master';
  skillName: string;
  category: SkillCategory;
  description: string;
  keyTopics: string[];
  recommendedAssessmentId?: string;
  recommendedAssessmentTitle?: string;
  estimatedWeeks: number;
}

interface CareerGoalRoadmap {
  id: string;
  title: string;
  category: SkillCategory;
  tagline: string;
  description: string;
  zamfaraDemand: string;
  targetJobs: string[];
  averageSalaryRange: string;
  iconBg: string;
  steps: RoadmapStep[];
}

const CAREER_ROADMAPS: CareerGoalRoadmap[] = [
  {
    id: 'web-mobile-dev',
    title: 'Full-Stack Web & Mobile Developer',
    category: 'Information Technology',
    tagline: 'Build web applications, portals, and mobile platforms for businesses and government agencies.',
    description: 'A structured 4-stage pathway taking you from basic web markup to building complete database-driven software applications in high demand across Gusau and commercial hubs.',
    zamfaraDemand: 'Very High (Tech startups, Government digitization, Agro-eCommerce)',
    targetJobs: ['Frontend Developer', 'Full-Stack Engineer', 'Mobile App Developer', 'IT Systems Manager'],
    averageSalaryRange: '₦120,000 - ₦350,000 / month',
    iconBg: 'bg-emerald-900 text-amber-300',
    steps: [
      {
        id: 'web-1',
        levelTitle: 'Beginner',
        skillName: 'HTML5, CSS3 & Responsive Web Design',
        category: 'Information Technology',
        description: 'Master layout structure, responsive grids with Tailwind CSS, and standard web formatting.',
        keyTopics: ['HTML Elements & Forms', 'Tailwind CSS Utility Design', 'Flexbox & Grid Layouts', 'Mobile Responsiveness'],
        estimatedWeeks: 3
      },
      {
        id: 'web-2',
        levelTitle: 'Intermediate',
        skillName: 'JavaScript & React Framework',
        category: 'Information Technology',
        description: 'Build dynamic interactive user interfaces with state management, APIs, and modern React hooks.',
        keyTopics: ['Modern ES6+ JavaScript', 'React Functional Components', 'State & Hooks (useState, useEffect)', 'REST API Consumption'],
        recommendedAssessmentId: 'asm-it-01',
        recommendedAssessmentTitle: 'IT & Digital Literacy Competency',
        estimatedWeeks: 4
      },
      {
        id: 'web-3',
        levelTitle: 'Advanced',
        skillName: 'Node.js, Express & Database Systems',
        category: 'Information Technology',
        description: 'Design secure backend APIs, database schemas, user authentication, and data persistence.',
        keyTopics: ['Node.js & Express API Routes', 'SQL & Relational Databases', 'JWT Authentication & Security', 'Data Validation'],
        estimatedWeeks: 5
      },
      {
        id: 'web-4',
        levelTitle: 'Expert Master',
        skillName: 'Full-Stack Integration & Cloud Deployment',
        category: 'Information Technology',
        description: 'Deploy full-stack web applications to cloud servers, run CI/CD, and optimize web performance.',
        keyTopics: ['Cloud Hosting & Containerization', 'Git Version Control', 'Performance & Security Audits', 'Production Maintenance'],
        estimatedWeeks: 4
      }
    ]
  },
  {
    id: 'solar-renewable-eng',
    title: 'Solar Energy & Microgrid Technician',
    category: 'Electrical Installation',
    tagline: 'Design, install, and maintain solar PV panels, inverters, and off-grid battery systems.',
    description: 'Empower rural households, farms, and businesses with clean solar energy installations across all 14 Zamfara LGAs.',
    zamfaraDemand: 'Critical Priority (Rural Electrification, Off-Grid Farms, Solar Water Pumps)',
    targetJobs: ['Solar PV Installer', 'Microgrid Maintenance Specialist', 'Inverter System Technician'],
    averageSalaryRange: '₦100,000 - ₦280,000 / month',
    iconBg: 'bg-amber-600 text-white',
    steps: [
      {
        id: 'solar-1',
        levelTitle: 'Beginner',
        skillName: 'Electrical Safety & PV Fundamentals',
        category: 'Electrical Installation',
        description: 'Understand AC/DC electrical principles, multimeter diagnostic tools, and roof installation safety standards.',
        keyTopics: ['Ohm\'s Law & DC Circuits', 'PV Panel Efficiency & Orientation', 'Personal Protective Equipment (PPE)', 'Cable Sizing'],
        estimatedWeeks: 2
      },
      {
        id: 'solar-2',
        levelTitle: 'Intermediate',
        skillName: 'Inverter Wiring & Lithium Battery Storage',
        category: 'Electrical Installation',
        description: 'Wire hybrid inverters, calculate battery bank backup hours, and configure charge controllers.',
        keyTopics: ['MPPT Charge Controllers', 'Lithium/Gel Battery Bank Wiring', 'Inverter Programming & Load Sizing', 'Circuit Breakers'],
        recommendedAssessmentId: 'asm-re-01',
        recommendedAssessmentTitle: 'Renewable Energy Systems Assessment',
        estimatedWeeks: 4
      },
      {
        id: 'solar-3',
        levelTitle: 'Advanced',
        skillName: 'Solar Irrigation & Agricultural Pumping',
        category: 'Electrical Installation',
        description: 'Install deep-well submersible solar water pumps for dry-season irrigation and livestock watering.',
        keyTopics: ['Submersible Solar Pumps', 'Flow Rate & Pressure Head Calculations', 'Automated Float Switches', 'Maintenance Protocols'],
        estimatedWeeks: 3
      }
    ]
  },
  {
    id: 'smart-agribusiness',
    title: 'Agribusiness & Smart Farming Specialist',
    category: 'Agriculture',
    tagline: 'Apply modern irrigation, soil testing, and digital supply chain tools to increase crop yields.',
    description: 'Transform traditional farming into high-yield, commercialized agribusiness focused on maize, sorghum, soybeans, and rice value chains.',
    zamfaraDemand: 'High Priority (State Agricultural Expansion, Value Addition, Grain Trade)',
    targetJobs: ['Agribusiness Manager', 'Irrigation Technician', 'Farm Data Analyst', 'Grain Storage Manager'],
    averageSalaryRange: '₦90,000 - ₦250,000 / month',
    iconBg: 'bg-emerald-700 text-white',
    steps: [
      {
        id: 'agri-1',
        levelTitle: 'Beginner',
        skillName: 'Soil Management & Agronomy Basics',
        category: 'Agriculture',
        description: 'Learn soil pH testing, organic fertilizer application, crop rotation, and seed selection for Zamfara soil types.',
        keyTopics: ['Soil Testing & Nutrient Management', 'Seed Viability & Spacing', 'Pest & Weed Identification', 'Climate-Smart Planting'],
        estimatedWeeks: 3
      },
      {
        id: 'agri-2',
        levelTitle: 'Intermediate',
        skillName: 'Drip Irrigation & Solar Pumping Logistics',
        category: 'Agriculture',
        description: 'Setup water-efficient drip irrigation systems for year-round vegetable and grain cultivation.',
        keyTopics: ['Drip Tape & Header Pipe Fitting', 'Water Filtration Systems', 'Fertigation (Fertilizer via Irrigation)', 'Solar Pump Operation'],
        recommendedAssessmentId: 'asm-ag-01',
        recommendedAssessmentTitle: 'Agribusiness & Supply Chain Assessment',
        estimatedWeeks: 3
      },
      {
        id: 'agri-3',
        levelTitle: 'Advanced',
        skillName: 'Agricultural Value Chain & Market Access',
        category: 'Agriculture',
        description: 'Manage post-harvest storage, grain processing quality standards, and digital commodity trading.',
        keyTopics: ['Hermetic Storage Bags & Silos', 'Quality Grading & Moisture Testing', 'Cooperative Management', 'Contract Farming Agreements'],
        estimatedWeeks: 4
      }
    ]
  },
  {
    id: 'digital-fin-services',
    title: 'Digital Financial Services & POS Operator',
    category: 'Entrepreneurship',
    tagline: 'Operate agency banking outlets, POS networks, and digital financial inclusion services.',
    description: 'Provide essential financial connectivity, mobile money transfers, and merchant payment processing in communities across Zamfara State.',
    zamfaraDemand: 'High Demand (Agency Banking, Merchant Terminals, Financial Inclusion)',
    targetJobs: ['POS Hub Operator', 'Agency Banking Supervisor', 'Financial Services Assistant'],
    averageSalaryRange: '₦70,000 - ₦180,000 / month',
    iconBg: 'bg-indigo-900 text-amber-300',
    steps: [
      {
        id: 'fin-1',
        levelTitle: 'Beginner',
        skillName: 'Financial Literacy & Basic Bookkeeping',
        category: 'Entrepreneurship',
        description: 'Master ledger recording, cash balancing, profit calculation, and basic business mathematics.',
        keyTopics: ['Income & Expense Tracking', 'Daily Cash Reconciliation', 'Customer Record Keeping', 'Working Capital Management'],
        estimatedWeeks: 2
      },
      {
        id: 'fin-2',
        levelTitle: 'Intermediate',
        skillName: 'POS Terminal & Agency Banking Systems',
        category: 'Entrepreneurship',
        description: 'Operate mobile money applications, troubleshoot terminal connectivity, and execute instant fund transfers.',
        keyTopics: ['Terminal Network Protocols (USSD/SIM)', 'Cash In / Cash Out Operations', 'Dispute Resolution & Chargebacks', 'Transaction Security'],
        recommendedAssessmentId: 'asm-fin-01',
        recommendedAssessmentTitle: 'Digital Financial Services Assessment',
        estimatedWeeks: 2
      },
      {
        id: 'fin-3',
        levelTitle: 'Advanced',
        skillName: 'Financial Fraud Prevention & Network Management',
        category: 'Entrepreneurship',
        description: 'Implement anti-fraud security measures, customer KYC verification, and manage multi-location POS agents.',
        keyTopics: ['Identity Verification & Anti-Fraud', 'Agent Network Supervision', 'Micro-Credit Administration', 'Compliance Regulations'],
        estimatedWeeks: 3
      }
    ]
  }
];

interface LearningRoadmapProps {
  userSkills: UserSkill[];
  certifications: Certification[];
  onOpenAssessment: (assessmentId: string) => void;
  onSelectOpportunity?: (opp: Opportunity) => void;
  userLga?: string;
}

export const LearningRoadmap: React.FC<LearningRoadmapProps> = ({
  userSkills,
  certifications,
  onOpenAssessment,
  userLga = 'Gusau'
}) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string>('web-mobile-dev');

  const selectedGoal = CAREER_ROADMAPS.find((g) => g.id === selectedGoalId) || CAREER_ROADMAPS[0];

  // Helper to check if user has a skill related to a step
  const checkStepStatus = (step: RoadmapStep) => {
    const hasSkill = userSkills.some((s) =>
      s.skillName.toLowerCase().includes(step.skillName.toLowerCase().split(' ')[0]) ||
      step.skillName.toLowerCase().includes(s.skillName.toLowerCase().split(' ')[0])
    );

    const hasCert = certifications.some((c) =>
      c.status === 'verified' &&
      (c.title.toLowerCase().includes(step.skillName.toLowerCase().split(' ')[0]) ||
       step.skillName.toLowerCase().includes(c.title.toLowerCase().split(' ')[0]))
    );

    if (hasCert) return 'completed';
    if (hasSkill) return 'in_progress';
    return 'recommended';
  };

  return (
    <div className="space-y-6">
      {/* Top Title Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-emerald-700/80 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-400 text-emerald-950 rounded-xl shadow-sm">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                Zamfara Career Guidance Engine
              </span>
              <h2 className="text-xl font-black text-white">Youth Skill-Building & Career Roadmaps</h2>
            </div>
          </div>
          <span className="text-xs bg-emerald-800/90 text-emerald-200 px-3 py-1 rounded-full border border-emerald-600 font-semibold">
            Tailored for {userLga} LGA Market Demand
          </span>
        </div>
        <p className="text-xs text-emerald-100 max-w-3xl leading-relaxed">
          Select a career pathway below to inspect sequential step-by-step milestones. Take platform competency assessments at each stage to gain verified digital badges on your Skills Passport.
        </p>
      </div>

      {/* Career Goal Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CAREER_ROADMAPS.map((goal) => {
          const isSelected = goal.id === selectedGoalId;
          return (
            <button
              key={goal.id}
              onClick={() => setSelectedGoalId(goal.id)}
              className={`text-left p-4 rounded-2xl border transition-all relative flex flex-col justify-between space-y-3 cursor-pointer ${
                isSelected
                  ? 'bg-white border-emerald-700 shadow-md ring-2 ring-emerald-600/30'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${goal.iconBg}`}>
                    {goal.category}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Target className="w-3 h-3 text-emerald-600" />
                      Active Goal
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-slate-900 leading-snug">{goal.title}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-2">{goal.tagline}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-800">
                <span>{goal.steps.length} Milestones</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1 text-emerald-700' : 'text-slate-400'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Roadmap Detail Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        
        {/* Header summary of selected pathway */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-800 text-amber-300 px-2.5 py-0.5 rounded-md">
                  Target Career Pathway
                </span>
                <span className="text-xs text-slate-500 font-semibold">{selectedGoal.category}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1">{selectedGoal.title}</h3>
            </div>
            
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-right shrink-0">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Zamfara Market Potential</span>
              <span className="text-xs font-black text-emerald-800 font-mono">{selectedGoal.averageSalaryRange}</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">{selectedGoal.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-200/80">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Local Employer Demand:</strong>
                <span className="text-slate-600">{selectedGoal.zamfaraDemand}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Briefcase className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Target Job Roles:</strong>
                <span className="text-slate-600">{selectedGoal.targetJobs.join(' · ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Steps Stepper */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-800" />
              <span>Sequential Skill Milestones ({selectedGoal.steps.length} Steps)</span>
            </h4>
            <span className="text-xs text-slate-500 font-semibold">
              Estimated Total Duration: ~{selectedGoal.steps.reduce((acc, s) => acc + s.estimatedWeeks, 0)} Weeks
            </span>
          </div>

          <div className="relative space-y-6 before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200 before:z-0">
            {selectedGoal.steps.map((step, idx) => {
              const status = checkStepStatus(step);

              return (
                <div key={step.id} className="relative z-10 flex items-start gap-4">
                  {/* Step Icon Badge */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-sm border ${
                    status === 'completed'
                      ? 'bg-emerald-800 text-amber-300 border-emerald-700'
                      : status === 'in_progress'
                      ? 'bg-amber-400 text-emerald-950 border-amber-500'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}>
                    {status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-amber-300" />
                    ) : (
                      <span>Step {idx + 1}</span>
                    )}
                  </div>

                  {/* Step Details Box */}
                  <div className="flex-1 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 hover:border-slate-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            step.levelTitle === 'Beginner' ? 'bg-blue-100 text-blue-900' :
                            step.levelTitle === 'Intermediate' ? 'bg-emerald-100 text-emerald-900' :
                            step.levelTitle === 'Advanced' ? 'bg-purple-100 text-purple-900' :
                            'bg-amber-100 text-amber-900'
                          }`}>
                            {step.levelTitle} Level
                          </span>
                          <span className="text-xs font-mono text-slate-500 font-semibold">
                            ~{step.estimatedWeeks} Weeks
                          </span>
                        </div>
                        <h5 className="font-bold text-base text-slate-900 mt-1">{step.skillName}</h5>
                      </div>

                      {/* Status pill */}
                      <div>
                        {status === 'completed' && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Verified on Passport</span>
                          </span>
                        )}
                        {status === 'in_progress' && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>Skill in Profile</span>
                          </span>
                        )}
                        {status === 'recommended' && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">
                            <span>Recommended Milestone</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>

                    {/* Key Learning Topics */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-700 block">Core Competency Modules:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {step.keyTopics.map((topic, tIdx) => (
                          <span key={tIdx} className="text-[11px] bg-white text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action trigger for assessment or skill addition */}
                    <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
                      {step.recommendedAssessmentId ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenAssessment(step.recommendedAssessmentId!)}
                            className="text-xs font-extrabold px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5 text-amber-300" />
                            <span>Take Competency Assessment ({step.recommendedAssessmentTitle})</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-slate-500 italic">
                          <span>Complete self-study modules & add skill to passport</span>
                        </div>
                      )}

                      <span className="text-[11px] text-slate-500 font-semibold">
                        Milestone {idx + 1} of {selectedGoal.steps.length}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
