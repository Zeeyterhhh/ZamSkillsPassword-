export type UserRole = 'youth' | 'employer' | 'admin';

export type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected';

export type EmploymentStatus = 'unemployed' | 'employed' | 'self_employed' | 'student' | 'intern' | 'apprentice';

export type OpportunityType = 'job' | 'internship' | 'apprenticeship' | 'training' | 'skills_development';

export type ApplicationStatus = 'submitted' | 'under_review' | 'shortlisted' | 'interviewing' | 'accepted' | 'rejected';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export const ZAMFARA_LGAS = [
  'Anka',
  'Bakura',
  'Birnin Magaji/Kiyaw',
  'Bukunyum',
  'Bungudu',
  'Chafe',
  'Gummi',
  'Gusau',
  'Isa',
  'Kaura Namoda',
  'Maradun',
  'Maru',
  'Shinkafi',
  'Talata Mafara'
] as const;

export type ZamfaraLGA = typeof ZAMFARA_LGAS[number];

export const SKILL_CATEGORIES = [
  'Information Technology',
  'Tailoring/Fashion',
  'Carpentry',
  'Welding',
  'Electrical Installation',
  'Catering',
  'Agriculture',
  'Beauty/Cosmetology',
  'Automotive',
  'Construction',
  'Entrepreneurship',
  'Digital Marketing',
  'Graphic Design'
] as const;

export type SkillCategory = typeof SKILL_CATEGORIES[number];

export interface User {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  fullName: string;
  avatarUrl?: string;
  isDemo?: boolean;
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin?: string;
}

export interface YouthProfile {
  id: string;
  userId: string;
  fullName: string;
  lga: ZamfaraLGA;
  phone: string;
  email: string;
  bio: string;
  avatarUrl: string;
  isDemo?: boolean;
  employmentStatus: EmploymentStatus;
  passportId: string; // e.g. ZSP-GUS-2026-0891
  qrCodeUrl?: string;
  verifiedBadgeCount: number;
  totalSkillsCount: number;
  readinessScore: number; // 0 - 100%
  createdAt: string;
  updatedAt: string;
}

export interface EmployerProfile {
  id: string;
  userId: string;
  organizationName: string;
  industry: string;
  lga: ZamfaraLGA;
  address: string;
  website?: string;
  contactPerson: string;
  phone: string;
  email: string;
  description: string;
  isVerified: boolean;
  logoUrl?: string;
  createdAt: string;
}

export interface UserSkill {
  id: string;
  userId: string;
  category: SkillCategory;
  skillName: string;
  level: SkillLevel;
  experienceYears: number;
  evidenceUrl?: string;
  evidenceDescription?: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface Education {
  id: string;
  userId: string;
  institution: string;
  qualification: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number | 'Present';
  certificateUrl?: string;
}

export interface WorkExperience {
  id: string;
  userId: string;
  companyName: string;
  roleTitle: string;
  lga: ZamfaraLGA | string;
  startDate: string;
  endDate: string | 'Present';
  description: string;
}

export interface Training {
  id: string;
  userId: string;
  programTitle: string;
  organization: string;
  durationWeeks: number;
  completionYear: number;
  skillsAcquired: string[];
}

export interface Certification {
  id: string;
  userId: string;
  title: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  documentUrl: string;
  status: VerificationStatus;
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedByAdminId?: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userLga: ZamfaraLGA;
  certificationId: string;
  certificateTitle: string;
  issuingOrganization: string;
  documentUrl: string;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  adminNotes?: string;
}

export interface AssessmentQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Assessment {
  id: string;
  title: string;
  category: SkillCategory;
  description: string;
  timeLimitMinutes: number;
  passingScorePercent: number;
  questions: AssessmentQuestion[];
}

export interface AssessmentResult {
  id: string;
  userId: string;
  assessmentId: string;
  assessmentTitle: string;
  category: SkillCategory;
  scorePercent: number;
  passed: boolean;
  takenAt: string;
  certificateBadgeId: string;
}

export interface Opportunity {
  id: string;
  employerId: string;
  employerName: string;
  employerLogo?: string;
  title: string;
  type: OpportunityType;
  category: SkillCategory;
  lga: ZamfaraLGA;
  stipendOrSalary: string; // e.g. "₦85,000 / month" or "Unpaid Internship"
  requiredSkills: string[];
  minQualification: string;
  description: string;
  responsibilities: string[];
  deadline: string;
  status: 'active' | 'closed';
  applicantCount: number;
  createdAt: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  employerId: string;
  employerName: string;
  youthUserId: string;
  youthName: string;
  youthEmail: string;
  youthPhone: string;
  youthLga: ZamfaraLGA;
  youthPassportId: string;
  status: ApplicationStatus;
  coverNote?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'verification' | 'application' | 'assessment' | 'opportunity' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface AdminActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface AdminStats {
  totalRegisteredUsers: number;
  totalYouth: number;
  totalEmployers: number;
  totalVerifiedCredentials: number;
  pendingVerifications: number;
  totalSkillsRegistered: number;
  activeOpportunities: number;
  totalApplications: number;
  usersByLGA: Record<string, number>;
  popularSkills: { category: string; count: number }[];
  verifiedVsPending: { verified: number; pending: number; rejected: number };
}
