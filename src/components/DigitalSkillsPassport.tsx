import React, { useState } from 'react';
import { YouthProfile, UserSkill, Certification, Education, Training, AssessmentResult } from '../types';
import { UserAvatar } from './UserAvatar';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  QrCode,
  Printer,
  Share2,
  Download,
  Loader2,
  GraduationCap,
  Briefcase,
  Sparkles,
  ExternalLink,
  BookOpen,
  Copy,
  Check,
  X
} from 'lucide-react';

interface DigitalSkillsPassportProps {
  passport: YouthProfile;
  skills: UserSkill[];
  certifications: Certification[];
  education: Education[];
  trainings: Training[];
  assessmentResults?: AssessmentResult[];
  isOwner?: boolean;
}

export const DigitalSkillsPassport: React.FC<DigitalSkillsPassportProps> = ({
  passport,
  skills,
  certifications,
  education,
  trainings,
  assessmentResults = [],
  isOwner = false
}) => {
  const verifiedCerts = certifications.filter((c) => c.status === 'verified');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}?passport=${passport.passportId}`
    : `https://skills.zamfara.gov.ng?passport=${passport.passportId}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const passportElement = document.getElementById('printable-passport-card');
      if (!passportElement) {
        window.print();
        setIsGeneratingPdf(false);
        return;
      }

      const canvas = await html2canvas(passportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Digital_Skills_Passport_${passport.passportId}.pdf`);
    } catch (err) {
      console.error('PDF generation error, fallback to print:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Control Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-900">Digital Skills Passport Record</h2>
          <p className="text-xs text-slate-500">Skills Competency Record & Verification Summary</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowShareModal(true)}
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-emerald-700" />
            <span>Share Profile</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="text-xs font-bold px-4 py-2 rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-60 cursor-pointer"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 text-amber-300 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-amber-300" />
                <span>Download PDF</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* THE PRINTABLE PASSPORT CARD */}
      <div id="printable-passport-card" className="bg-white rounded-2xl border-2 border-emerald-800/80 shadow-xl overflow-hidden print:shadow-none print:border-emerald-900">
        
        {/* Official Header Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 relative border-b-4 border-amber-400">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black shadow-md">
                <Award className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
                  Zamfara Youth Skills Competency Registry
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  DIGITAL SKILLS PASSPORT RECORD
                </h1>
                <p className="text-[11px] text-emerald-200">
                  Verification Code: <span className="font-mono font-bold text-amber-300">{passport.passportId}</span>
                </p>
              </div>
            </div>

            <div className="text-right sm:text-right flex sm:flex-col justify-between items-end border-t sm:border-t-0 border-emerald-800 pt-2 sm:pt-0">
              <div className="inline-flex items-center gap-1 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-700/80 text-xs text-amber-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Competency Record</span>
              </div>
              <span className="text-[10px] text-emerald-300/80 block mt-1">
                Issued: {new Date(passport.createdAt).toLocaleDateString('en-NG')}
              </span>
            </div>

          </div>
        </div>

        {/* Passport Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Identity & Profile Overview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-slate-200">
            
            <div className="md:col-span-3 flex flex-col items-center text-center space-y-2">
              <UserAvatar
                name={passport.fullName}
                avatarUrl={passport.avatarUrl}
                isDemo={passport.isDemo}
                size="2xl"
                showDemoBadge={passport.isDemo}
              />
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full mt-1">
                {passport.employmentStatus.replace('_', ' ')}
              </span>
            </div>

            <div className="md:col-span-6 space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">{passport.fullName}</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  {passport.lga} LGA, Zamfara State
                </span>
                <span>·</span>
                <span>Phone: {passport.phone}</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed pt-1">
                {passport.bio || 'Registered youth candidate on Zamfara Skills Passport.'}
              </p>
            </div>

            <div className="md:col-span-3 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between text-center">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">
                  Readiness Score
                </span>
                <span className="text-3xl font-black text-emerald-800">
                  {passport.readinessScore}%
                </span>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-center gap-2">
                <QrCode className="w-10 h-10 text-emerald-950 p-1 bg-white rounded border border-slate-300" />
                <div className="text-left text-[10px] text-slate-500">
                  <p className="font-bold text-slate-700">Scan QR Code</p>
                  <p>Authenticity Check</p>
                </div>
              </div>
            </div>

          </div>

          {/* Verified Skills Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-700" />
                <span>Verified Skills & Competencies</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">{skills.length} Total Skills</span>
            </div>

            {skills.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No skills registered yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className={`p-3 rounded-xl border ${
                      skill.isVerified ? 'bg-emerald-50/50 border-emerald-300/80' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                          {skill.category}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 mt-0.5">{skill.skillName}</h4>
                      </div>

                      {skill.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                          Self-Declared
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-600">
                      <span>Level: <strong className="capitalize text-slate-800">{skill.level}</strong></span>
                      <span>{skill.experienceYears} Year(s) Exp</span>
                    </div>

                    {skill.verifiedBy && (
                      <p className="text-[10px] text-emerald-700 font-medium mt-1">
                        Verified by: {skill.verifiedBy}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verified Certificates & Qualifications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>Uploaded Certificates & Verification Status</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">{certifications.length} Credentials</span>
            </div>

            {certifications.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No certificates uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900">{cert.title}</h4>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          cert.status === 'verified' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          cert.status === 'under_review' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {cert.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{cert.issuingOrganization} · Issued: {cert.issueDate}</p>
                      {cert.credentialId && (
                        <p className="text-[10px] text-slate-500 font-mono">ID: {cert.credentialId}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {cert.documentUrl && (
                        <a
                          href={cert.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-semibold text-emerald-800 hover:underline flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-slate-300"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View Doc</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Platform Assessment Badges */}
          {assessmentResults.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>Platform Competency Assessment Badges</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {assessmentResults.map((asr) => (
                  <div
                    key={asr.id}
                    className={`p-3 rounded-xl border text-xs ${
                      asr.passed ? 'bg-amber-50/80 border-amber-300/80' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{asr.assessmentTitle}</span>
                      <span className="font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                        {asr.scorePercent}%
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Badge ID: <span className="font-mono font-bold text-slate-700">{asr.certificateBadgeId}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Verification Footnote */}
          <div className="pt-4 border-t border-slate-200 text-center text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">
              Zamfara Skills Passport Verification Board · Ministry of Youth & Sports Development
            </p>
            <p>
              This document is an official digital skills ledger. Credential verification status can be audited online at <span className="underline break-all">https://skills.zamfara.gov.ng/verify</span> using Passport Code <strong className="text-slate-800 font-mono break-all">{passport.passportId}</strong>.
            </p>
          </div>

        </div>

      </div>

      {/* Share Profile & QR Code Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Share Digital Skills Passport</h3>
                  <p className="text-xs text-slate-500">Public verification link for employers</p>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Passport Identity Summary */}
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <UserAvatar
                name={passport.fullName}
                avatarUrl={passport.avatarUrl}
                isDemo={passport.isDemo}
                size="md"
                showDemoBadge={passport.isDemo}
              />
              <div className="overflow-hidden">
                <h4 className="font-bold text-sm text-slate-900 truncate">{passport.fullName}</h4>
                <p className="text-xs text-emerald-800 font-mono font-semibold truncate">{passport.passportId}</p>
                <p className="text-[10px] text-slate-500">{passport.lga} LGA, Zamfara State</p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="text-center space-y-2 bg-emerald-950 p-4 rounded-2xl border border-emerald-800 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Scan to Verify Public Passport
              </span>
              <div className="bg-white p-3 rounded-xl inline-block shadow-inner">
                <img
                  src={qrImageUrl}
                  alt={`QR Code for ${passport.passportId}`}
                  className="w-40 h-40 mx-auto rounded"
                  onError={(e) => {
                    // Fallback to simple icon container if QR API unavailable
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <p className="text-[11px] text-emerald-200/90 font-mono">
                Verification Code: <strong className="text-amber-300">{passport.passportId}</strong>
              </p>
            </div>

            {/* Direct Link Input & Copy Button */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Direct Public URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-slate-100 text-slate-800 text-xs font-mono p-2.5 rounded-xl border border-slate-300 select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-amber-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-amber-300" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
