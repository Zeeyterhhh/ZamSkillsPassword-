import React from 'react';
import { ZAMFARA_LGAS } from '../types';
import { Award, GraduationCap, Briefcase, MapPin, CheckCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-800/80 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-emerald-800/60">
          
          {/* Column 1: System Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-500 text-emerald-950 flex items-center justify-center font-bold">
                <Award className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                Zamfara Skills Passport
              </span>
            </div>
            <p className="text-xs text-emerald-300/80 leading-relaxed">
              A Web-Based Skills Verification and Employment Readiness Platform for Youth in Zamfara State, Nigeria. Digitally document, verify, and match youth competencies with real opportunities.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-300 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>Gusau, Zamfara State, Federal Republic of Nigeria</span>
            </div>
          </div>

          {/* Column 2: SDG Alignment */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              UN SDG Alignment
            </h4>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-emerald-900/40 border border-emerald-800 text-xs flex items-start gap-2">
                <Briefcase className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">SDG 8: Decent Work</span>
                  <span className="text-[11px] text-emerald-300/80">
                    Economic growth & youth employment opportunities across all 14 LGAs.
                  </span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-900/40 border border-emerald-800 text-xs flex items-start gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">SDG 4: Quality Education</span>
                  <span className="text-[11px] text-emerald-300/80">
                    Lifelong vocational learning & verified skill development.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: All 14 LGAs in Zamfara State */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Zamfara State LGAs (14)
            </h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-emerald-300/90">
              {ZAMFARA_LGAS.map((lga) => (
                <div key={lga} className="flex items-center gap-1 hover:text-amber-300 transition-colors">
                  <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                  <span>{lga}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Academic Project Declaration */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Academic Project Notice
            </h4>
            <p className="text-xs text-emerald-300/80 leading-relaxed">
              Developed as a University Computer Science Capstone Project focusing on digital identity, cryptographic document verification, and youth workforce enablement.
            </p>
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200">
              <span className="font-semibold block text-amber-300">Official Platform Standard:</span>
              Platform assessments and verification requests are processed by designated board administrators.
            </div>
          </div>

        </div>

        {/* Sub-footer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400/80 gap-3">
          <p>© 2026 Zamfara Skills Passport. Built for Youth Development in Zamfara State, Nigeria.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Verification</span>
            <span>·</span>
            <span>Verification Guidelines</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
