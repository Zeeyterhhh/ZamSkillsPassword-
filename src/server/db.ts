import fs from 'fs';
import path from 'path';
import {
  AdminActivityLog,
  AdminStats,
  Application,
  Assessment,
  AssessmentResult,
  Certification,
  Education,
  EmployerProfile,
  Notification,
  Opportunity,
  Training,
  User,
  UserSkill,
  VerificationRequest,
  YouthProfile
} from '../types';
import { INITIAL_ASSESSMENTS, ZAMFARA_INFO } from '../data/zamfaraData';

interface DatabaseSchema {
  users: User[];
  youthProfiles: YouthProfile[];
  employerProfiles: EmployerProfile[];
  userSkills: UserSkill[];
  education: Education[];
  workExperiences: any[];
  trainings: Training[];
  certifications: Certification[];
  verificationRequests: VerificationRequest[];
  assessments: Assessment[];
  assessmentResults: AssessmentResult[];
  opportunities: Opportunity[];
  applications: Application[];
  notifications: Notification[];
  adminActivityLogs: AdminActivityLog[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initial seed data generator
function getInitialSeedData(): DatabaseSchema {
  const users: User[] = [
    {
      id: 'usr-youth-01',
      email: 'aminu.gusau@gmail.com',
      phone: '+234 803 123 4567',
      role: 'youth',
      fullName: 'Aminu Bello Gusau',
      avatarUrl: '',
      isDemo: true,
      status: 'active',
      createdAt: '2026-01-15T09:00:00Z',
      lastLogin: '2026-08-07T14:20:00Z'
    },
    {
      id: 'usr-youth-02',
      email: 'fatima.mafara@gmail.com',
      phone: '+234 814 987 6543',
      role: 'youth',
      fullName: 'Fatima Abubakar Mafara',
      avatarUrl: '',
      isDemo: true,
      status: 'active',
      createdAt: '2026-02-10T11:30:00Z',
      lastLogin: '2026-08-06T16:45:00Z'
    },
    {
      id: 'usr-youth-03',
      email: 'ibrahim.kaura@gmail.com',
      phone: '+234 706 555 1212',
      role: 'youth',
      fullName: 'Ibrahim Hassan Kaura',
      avatarUrl: '',
      isDemo: true,
      status: 'active',
      createdAt: '2026-03-01T10:15:00Z',
      lastLogin: '2026-08-07T11:10:00Z'
    },
    {
      id: 'usr-emp-01',
      email: 'hr@zamfaratechhub.ng',
      phone: '+234 802 333 9988',
      role: 'employer',
      fullName: 'Zamfara Innovation & Tech Hub',
      avatarUrl: '',
      isDemo: true,
      status: 'active',
      createdAt: '2026-01-05T08:00:00Z'
    },
    {
      id: 'usr-emp-02',
      email: 'contact@bakura-agric.org',
      phone: '+234 818 777 4411',
      role: 'employer',
      fullName: 'Bakura Agribusiness Development Co.',
      avatarUrl: '',
      isDemo: true,
      status: 'active',
      createdAt: '2026-01-20T14:00:00Z'
    },
    {
      id: 'usr-admin-01',
      email: 'admin@skills.zamfara.gov.ng',
      phone: '+234 803 000 0001',
      role: 'admin',
      fullName: 'Zamfara Skills Verification Board Admin',
      avatarUrl: '',
      isDemo: true,
      status: 'active',
      createdAt: '2026-01-01T00:00:00Z'
    }
  ];

  const youthProfiles: YouthProfile[] = [
    {
      id: 'yp-01',
      userId: 'usr-youth-01',
      fullName: 'Aminu Bello Gusau',
      lga: 'Gusau',
      phone: '+234 803 123 4567',
      email: 'aminu.gusau@gmail.com',
      bio: 'Enthusiastic full-stack web developer and IT technician based in Gusau. Certified in web development with practical experience building modern web apps for local businesses.',
      avatarUrl: '',
      isDemo: true,
      employmentStatus: 'unemployed',
      passportId: 'ZSP-GUS-2026-0891',
      verifiedBadgeCount: 3,
      totalSkillsCount: 5,
      readinessScore: 88,
      createdAt: '2026-01-15T09:00:00Z',
      updatedAt: '2026-08-07T12:00:00Z'
    },
    {
      id: 'yp-02',
      userId: 'usr-youth-02',
      fullName: 'Fatima Abubakar Mafara',
      lga: 'Talata Mafara',
      phone: '+234 814 987 6543',
      email: 'fatima.mafara@gmail.com',
      bio: 'Skilled fashion designer, pattern maker, and tailoring instructor in Talata Mafara. Specialized in traditional embroidery, bridal kaftans, and modern ready-to-wear garments.',
      avatarUrl: '',
      isDemo: true,
      employmentStatus: 'self_employed',
      passportId: 'ZSP-TLM-2026-1104',
      verifiedBadgeCount: 2,
      totalSkillsCount: 4,
      readinessScore: 92,
      createdAt: '2026-02-10T11:30:00Z',
      updatedAt: '2026-08-05T10:00:00Z'
    },
    {
      id: 'yp-03',
      userId: 'usr-youth-03',
      fullName: 'Ibrahim Hassan Kaura',
      lga: 'Kaura Namoda',
      phone: '+234 706 555 1212',
      email: 'ibrahim.kaura@gmail.com',
      bio: 'Certified Solar PV Installer and Electrical Maintenance Technician from Kaura Namoda. Experienced with inverter sizing, solar pumping systems, and commercial panel setups.',
      avatarUrl: '',
      isDemo: true,
      employmentStatus: 'intern',
      passportId: 'ZSP-KRN-2026-0412',
      verifiedBadgeCount: 2,
      totalSkillsCount: 4,
      readinessScore: 82,
      createdAt: '2026-03-01T10:15:00Z',
      updatedAt: '2026-08-06T15:00:00Z'
    }
  ];

  const employerProfiles: EmployerProfile[] = [
    {
      id: 'emp-p-01',
      userId: 'usr-emp-01',
      organizationName: 'Zamfara Innovation & Tech Hub',
      industry: 'Information Technology & Training',
      lga: 'Gusau',
      address: 'No. 14 Canteen Road, Opposite Central Mosque, Gusau, Zamfara State',
      website: 'https://zamfaratechhub.ng',
      contactPerson: 'Murtala Ahmed',
      phone: '+234 802 333 9988',
      email: 'hr@zamfaratechhub.ng',
      description: 'The premier technology incubator and digital skills development hub driving youth digital transformation across Zamfara State.',
      isVerified: true,
      logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-05T08:00:00Z'
    },
    {
      id: 'emp-p-02',
      userId: 'usr-emp-02',
      organizationName: 'Bakura Agribusiness Development Co.',
      industry: 'Agriculture & Food Processing',
      lga: 'Bakura',
      address: 'Bakura Irrigation Expressway, Bakura, Zamfara State',
      website: 'https://bakura-agric.org',
      contactPerson: 'Dr. Usman Bakura',
      phone: '+234 818 777 4411',
      email: 'contact@bakura-agric.org',
      description: 'Leading agricultural development enterprise specializing in modern irrigation farming, rice milling, and youth agricultural entrepreneurship in Zamfara.',
      isVerified: true,
      logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-20T14:00:00Z'
    }
  ];

  const userSkills: UserSkill[] = [
    {
      id: 'usk-01',
      userId: 'usr-youth-01',
      category: 'Information Technology',
      skillName: 'Web Development (React & Node.js)',
      level: 'advanced',
      experienceYears: 3,
      evidenceUrl: 'https://github.com/aminu-gusau-dev/zamfara-portal',
      evidenceDescription: 'Built custom portal website for local Gusau cooperative.',
      isVerified: true,
      verifiedBy: 'Zamfara Skills Board Admin',
      verifiedAt: '2026-02-01T10:00:00Z'
    },
    {
      id: 'usk-02',
      userId: 'usr-youth-01',
      category: 'Digital Marketing',
      skillName: 'Social Media Strategy & SEO',
      level: 'intermediate',
      experienceYears: 2,
      evidenceUrl: 'https://instagram.com/gusau_digital_showcase',
      evidenceDescription: 'Managed online publicity for Gusau Trade Fair 2025.',
      isVerified: true,
      verifiedBy: 'Platform Assessment Engine',
      verifiedAt: '2026-03-10T14:30:00Z'
    },
    {
      id: 'usk-03',
      userId: 'usr-youth-01',
      category: 'Graphic Design',
      skillName: 'UI/UX & Brand Design',
      level: 'intermediate',
      experienceYears: 2,
      evidenceDescription: 'Designed logos and brand identity kits for 10 local SMEs in Gusau.',
      isVerified: false
    },
    {
      id: 'usk-04',
      userId: 'usr-youth-02',
      category: 'Tailoring/Fashion',
      skillName: 'Garment Construction & Embroidery',
      level: 'expert',
      experienceYears: 5,
      evidenceUrl: 'https://drive.google.com/portfolio-fatima-mafara.pdf',
      evidenceDescription: 'Professional portfolio with 50+ bespoke kaftans and bridal attire.',
      isVerified: true,
      verifiedBy: 'National Directorate of Employment (NDE)',
      verifiedAt: '2026-02-15T11:00:00Z'
    },
    {
      id: 'usk-05',
      userId: 'usr-youth-02',
      category: 'Entrepreneurship',
      skillName: 'Fashion Enterprise Management',
      level: 'advanced',
      experienceYears: 3,
      evidenceDescription: 'Runs active tailoring shop employing 3 apprentice tailors in Talata Mafara.',
      isVerified: true,
      verifiedBy: 'Zamfara Enterprise Board',
      verifiedAt: '2026-04-02T09:00:00Z'
    },
    {
      id: 'usk-06',
      userId: 'usr-youth-03',
      category: 'Electrical Installation',
      skillName: 'Solar PV Sizing & Inverter Wiring',
      level: 'advanced',
      experienceYears: 3,
      evidenceUrl: 'https://drive.google.com/solar-installations-kaura.pdf',
      evidenceDescription: 'Completed 15 domestic solar installs across Kaura Namoda and Shinkafi LGAs.',
      isVerified: true,
      verifiedBy: 'Council for the Regulation of Engineering in Nigeria (COREN-certified training)',
      verifiedAt: '2026-03-20T16:00:00Z'
    }
  ];

  const education: Education[] = [
    {
      id: 'edu-01',
      userId: 'usr-youth-01',
      institution: 'Federal Polytechnic Kaura Namoda',
      qualification: 'Higher National Diploma (HND)',
      fieldOfStudy: 'Computer Science',
      startYear: 2021,
      endYear: 2025
    },
    {
      id: 'edu-02',
      userId: 'usr-youth-02',
      institution: 'Abdu Gusau Polytechnic Talata Mafara',
      qualification: 'National Diploma (ND)',
      fieldOfStudy: 'Fashion Design & Clothing Technology',
      startYear: 2022,
      endYear: 2024
    },
    {
      id: 'edu-03',
      userId: 'usr-youth-03',
      institution: 'Zamfara State Vocational Training Centre Gusau',
      qualification: 'National Technical Certificate (NTC)',
      fieldOfStudy: 'Electrical Installation & Maintenance Practice',
      startYear: 2022,
      endYear: 2024
    }
  ];

  const trainings: Training[] = [
    {
      id: 'tr-01',
      userId: 'usr-youth-01',
      programTitle: 'Zamfara Digital Youth Empowerment Bootcamp',
      organization: 'Zamfara State Ministry of Science & Technology',
      durationWeeks: 12,
      completionYear: 2025,
      skillsAcquired: ['React.js', 'Node.js', 'REST APIs', 'Cloud Deployment']
    },
    {
      id: 'tr-02',
      userId: 'usr-youth-02',
      programTitle: 'Advanced Garment Pattern Drafting Masterclass',
      organization: 'Industrial Training Fund (ITF) Nigeria',
      durationWeeks: 8,
      completionYear: 2025,
      skillsAcquired: ['Pattern Drafting', 'Embroidery Digitizing', 'Quality Control']
    },
    {
      id: 'tr-03',
      userId: 'usr-youth-03',
      programTitle: 'Renewable Energy & Solar Microgrid Installation',
      organization: 'Energy Commission of Nigeria (ECN)',
      durationWeeks: 6,
      completionYear: 2025,
      skillsAcquired: ['MPPT Controllers', 'Lithium Battery Storage', 'Solar Pumping']
    }
  ];

  const certifications: Certification[] = [
    {
      id: 'cert-01',
      userId: 'usr-youth-01',
      title: 'Certified Full-Stack Web Developer',
      issuingOrganization: 'National Information Technology Development Agency (NITDA)',
      issueDate: '2025-11-20',
      credentialId: 'NITDA-ZAM-2025-8841',
      documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      status: 'verified',
      verifiedAt: '2026-02-01T10:00:00Z',
      verifiedByAdminId: 'usr-admin-01'
    },
    {
      id: 'cert-02',
      userId: 'usr-youth-01',
      title: 'Google Digital Marketing Professional Certificate',
      issuingOrganization: 'Google Growth with Africa',
      issueDate: '2026-01-10',
      credentialId: 'GGL-AFR-99214',
      documentUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
      status: 'verified',
      verifiedAt: '2026-03-10T14:30:00Z',
      verifiedByAdminId: 'usr-admin-01'
    },
    {
      id: 'cert-03',
      userId: 'usr-youth-02',
      title: 'Master Fashion Artisan Certificate',
      issuingOrganization: 'National Directorate of Employment (NDE)',
      issueDate: '2025-08-15',
      credentialId: 'NDE-FASH-2025-091',
      documentUrl: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=600&auto=format&fit=crop&q=80',
      status: 'verified',
      verifiedAt: '2026-02-15T11:00:00Z',
      verifiedByAdminId: 'usr-admin-01'
    },
    {
      id: 'cert-04',
      userId: 'usr-youth-03',
      title: 'Level 2 Solar PV Design & Installation Specialist',
      issuingOrganization: 'Nigerian Energy Support Programme (NESP / GIZ)',
      issueDate: '2025-10-05',
      credentialId: 'NESP-SOL-2025-442',
      documentUrl: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=600&auto=format&fit=crop&q=80',
      status: 'verified',
      verifiedAt: '2026-03-20T16:00:00Z',
      verifiedByAdminId: 'usr-admin-01'
    },
    {
      id: 'cert-05',
      userId: 'usr-youth-03',
      title: 'Advanced Heavy Equipment Electrical Safety',
      issuingOrganization: 'Federal Ministry of Labour & Employment',
      issueDate: '2026-07-01',
      credentialId: 'FMLE-ELEC-2026-319',
      documentUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      status: 'under_review'
    }
  ];

  const verificationRequests: VerificationRequest[] = [
    {
      id: 'vr-01',
      userId: 'usr-youth-03',
      userName: 'Ibrahim Hassan Kaura',
      userLga: 'Kaura Namoda',
      certificationId: 'cert-05',
      certificateTitle: 'Advanced Heavy Equipment Electrical Safety',
      issuingOrganization: 'Federal Ministry of Labour & Employment',
      documentUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      status: 'under_review',
      submittedAt: '2026-08-01T09:30:00Z'
    }
  ];

  const opportunities: Opportunity[] = [
    {
      id: 'opp-01',
      employerId: 'usr-emp-01',
      employerName: 'Zamfara Innovation & Tech Hub',
      employerLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
      title: 'Junior Web Developer & IT Assistant',
      type: 'job',
      category: 'Information Technology',
      lga: 'Gusau',
      stipendOrSalary: '₦120,000 / month',
      requiredSkills: ['Web Development (React & Node.js)', 'UI/UX & Brand Design', 'Information Technology'],
      minQualification: 'ND / HND / B.Sc in Computer Science or related field',
      description: 'We are seeking an enthusiastic web developer to assist in designing and deploying digital solutions for local government and SME clients in Gusau.',
      responsibilities: [
        'Maintain front-end React components and back-end REST APIs',
        'Troubleshoot network and hardware systems at the Innovation Hub',
        'Conduct monthly digital literacy workshops for youth cohort'
      ],
      deadline: '2026-08-31',
      status: 'active',
      applicantCount: 2,
      createdAt: '2026-07-20T10:00:00Z'
    },
    {
      id: 'opp-02',
      employerId: 'usr-emp-02',
      employerName: 'Bakura Agribusiness Development Co.',
      employerLogo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80',
      title: 'Solar Water Pump Installation Technician',
      type: 'internship',
      category: 'Electrical Installation',
      lga: 'Bakura',
      stipendOrSalary: '₦85,000 / month + Stipend',
      requiredSkills: ['Solar PV Sizing & Inverter Wiring', 'Electrical Installation', 'Agriculture'],
      minQualification: 'Technical Certificate or Vocational Diploma in Electrical Engineering',
      description: 'Hands-on solar installer needed to manage modern solar irrigation pumping stations across Bakura agricultural farmlands.',
      responsibilities: [
        'Assemble and test solar PV arrays for groundwater pumping',
        'Perform preventive maintenance on DC solar inverters',
        'Train local farmer groups on basic solar pump troubleshooting'
      ],
      deadline: '2026-09-15',
      status: 'active',
      applicantCount: 1,
      createdAt: '2026-07-25T14:30:00Z'
    },
    {
      id: 'opp-03',
      employerId: 'usr-emp-01',
      employerName: 'Zamfara Innovation & Tech Hub',
      employerLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
      title: 'Digital Marketing & Community Manager Trainee',
      type: 'training',
      category: 'Digital Marketing',
      lga: 'Talata Mafara',
      stipendOrSalary: '₦50,000 / month Stipend during training',
      requiredSkills: ['Social Media Strategy & SEO', 'Digital Marketing'],
      minQualification: 'SSCE / ND in Mass Communication, Business, or IT',
      description: 'Intensive 3-month digital marketing fellowship designed to equip young entrepreneurs with online publicity and e-commerce capabilities.',
      responsibilities: [
        'Manage social media campaigns for Zamfara artisan cooperatives',
        'Create engaging content showcasing local craft products',
        'Track campaign reach and customer conversion statistics'
      ],
      deadline: '2026-09-01',
      status: 'active',
      applicantCount: 3,
      createdAt: '2026-08-01T08:00:00Z'
    }
  ];

  const applications: Application[] = [
    {
      id: 'app-01',
      opportunityId: 'opp-01',
      opportunityTitle: 'Junior Web Developer & IT Assistant',
      employerId: 'usr-emp-01',
      employerName: 'Zamfara Innovation & Tech Hub',
      youthUserId: 'usr-youth-01',
      youthName: 'Aminu Bello Gusau',
      youthEmail: 'aminu.gusau@gmail.com',
      youthPhone: '+234 803 123 4567',
      youthLga: 'Gusau',
      youthPassportId: 'ZSP-GUS-2026-0891',
      status: 'shortlisted',
      coverNote: 'I am a passionate web developer with a verified HND in Computer Science and NITDA certification. I look forward to contributing to youth tech growth in Zamfara.',
      submittedAt: '2026-07-22T11:00:00Z',
      updatedAt: '2026-07-28T09:30:00Z'
    },
    {
      id: 'app-02',
      opportunityId: 'opp-02',
      opportunityTitle: 'Solar Water Pump Installation Technician',
      employerId: 'usr-emp-02',
      employerName: 'Bakura Agribusiness Development Co.',
      youthUserId: 'usr-youth-03',
      youthName: 'Ibrahim Hassan Kaura',
      youthEmail: 'ibrahim.kaura@gmail.com',
      youthPhone: '+234 706 555 1212',
      youthLga: 'Kaura Namoda',
      youthPassportId: 'ZSP-KRN-2026-0412',
      status: 'submitted',
      coverNote: 'My NESP/GIZ Level 2 Solar certification and practical experience with solar pumps in Kaura Namoda align perfectly with your agricultural solar projects.',
      submittedAt: '2026-07-26T15:20:00Z',
      updatedAt: '2026-07-26T15:20:00Z'
    }
  ];

  const notifications: Notification[] = [
    {
      id: 'notif-01',
      userId: 'usr-youth-01',
      title: 'Application Shortlisted!',
      message: 'Your application for "Junior Web Developer & IT Assistant" at Zamfara Innovation & Tech Hub has been shortlisted!',
      type: 'application',
      isRead: false,
      createdAt: '2026-07-28T09:30:00Z'
    },
    {
      id: 'notif-02',
      userId: 'usr-youth-03',
      title: 'Certificate Under Review',
      message: 'Your uploaded certificate "Advanced Heavy Equipment Electrical Safety" has been received and is currently under review by the Verification Board.',
      type: 'verification',
      isRead: true,
      createdAt: '2026-08-01T09:30:00Z'
    }
  ];

  const adminActivityLogs: AdminActivityLog[] = [
    {
      id: 'log-01',
      adminId: 'usr-admin-01',
      adminName: 'Board Admin',
      action: 'CERTIFICATE_VERIFIED',
      target: 'Ibrahim Hassan Kaura (ZSP-KRN-2026-0412)',
      details: 'Approved NESP/GIZ Level 2 Solar PV Specialist Certificate',
      timestamp: '2026-03-20T16:00:00Z'
    },
    {
      id: 'log-02',
      adminId: 'usr-admin-01',
      adminName: 'Board Admin',
      action: 'EMPLOYER_APPROVED',
      target: 'Bakura Agribusiness Development Co.',
      details: 'Verified organization CAC documents and approved official employer account.',
      timestamp: '2026-01-20T14:15:00Z'
    }
  ];

  return {
    users,
    youthProfiles,
    employerProfiles,
    userSkills,
    education,
    workExperiences: [],
    trainings,
    certifications,
    verificationRequests,
    assessments: INITIAL_ASSESSMENTS,
    assessmentResults: [],
    opportunities,
    applications,
    notifications,
    adminActivityLogs
  };
}

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed: DatabaseSchema = JSON.parse(raw);
        // Sanitize seed/demo accounts so unsplash face images are removed
        if (parsed.users) {
          parsed.users.forEach((u) => {
            if (u.id.startsWith('usr-') || u.email.includes('gmail') || u.email.includes('zamfara')) {
              if (u.id === 'usr-youth-01' || u.id === 'usr-youth-02' || u.id === 'usr-youth-03' || u.id === 'usr-emp-01' || u.id === 'usr-emp-02' || u.id === 'usr-admin-01') {
                u.isDemo = true;
                if (u.avatarUrl && (u.avatarUrl.includes('unsplash.com') || u.avatarUrl.includes('dicebear'))) {
                  u.avatarUrl = '';
                }
              }
            }
          });
        }
        if (parsed.youthProfiles) {
          parsed.youthProfiles.forEach((yp) => {
            if (yp.id === 'yp-01' || yp.id === 'yp-02' || yp.id === 'yp-03') {
              yp.isDemo = true;
              if (yp.avatarUrl && (yp.avatarUrl.includes('unsplash.com') || yp.avatarUrl.includes('dicebear'))) {
                yp.avatarUrl = '';
              }
            }
          });
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read db.json file, initializing in-memory fallback:', e);
    }
    const seed = getInitialSeedData();
    this.saveData(seed);
    return seed;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Failed to write db.json to disk (operating in memory mode):', e);
    }
  }

  // --- AUTH OPERATIONS ---
  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(userData: Omit<User, 'id' | 'createdAt' | 'status'>): User {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);

    if (newUser.role === 'youth') {
      const lgaCode = (userData.fullName || 'GUS').substring(0, 3).toUpperCase();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const passportId = `ZSP-${lgaCode}-2026-${randomNum}`;

      const newYouth: YouthProfile = {
        id: `yp-${Date.now()}`,
        userId: newUser.id,
        fullName: newUser.fullName,
        lga: 'Gusau',
        phone: newUser.phone,
        email: newUser.email,
        bio: 'Youth registered on Zamfara Skills Passport. Add skills and certifications to complete profile.',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newUser.fullName)}`,
        employmentStatus: 'unemployed',
        passportId,
        verifiedBadgeCount: 0,
        totalSkillsCount: 0,
        readinessScore: 40,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.data.youthProfiles.push(newYouth);
    } else if (newUser.role === 'employer') {
      const newEmployer: EmployerProfile = {
        id: `emp-${Date.now()}`,
        userId: newUser.id,
        organizationName: newUser.fullName,
        industry: 'General Enterprise',
        lga: 'Gusau',
        address: 'Gusau Industrial Area, Zamfara State',
        contactPerson: newUser.fullName,
        phone: newUser.phone,
        email: newUser.email,
        description: 'Registered organization profile on Zamfara Skills Passport.',
        isVerified: true,
        logoUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(newUser.fullName)}`,
        createdAt: new Date().toISOString()
      };
      this.data.employerProfiles.push(newEmployer);
    }

    this.saveData();
    return newUser;
  }

  public updateUserStatus(userId: string, status: 'active' | 'suspended', adminName: string): boolean {
    const user = this.getUserById(userId);
    if (!user) return false;
    user.status = status;
    this.addAdminLog('usr-admin-01', adminName, 'USER_STATUS_CHANGE', user.fullName, `Account status changed to ${status}`);
    this.saveData();
    return true;
  }

  // --- YOUTH & SKILLS PASSPORT OPERATIONS ---
  public getYouthProfileByUserId(userId: string): YouthProfile | undefined {
    return this.data.youthProfiles.find((yp) => yp.userId === userId);
  }

  public getYouthProfileById(id: string): YouthProfile | undefined {
    return this.data.youthProfiles.find((yp) => yp.id === id || yp.passportId === id);
  }

  public updateYouthProfile(userId: string, updates: Partial<YouthProfile>): YouthProfile | undefined {
    const profile = this.getYouthProfileByUserId(userId);
    if (!profile) return undefined;
    Object.assign(profile, updates, { updatedAt: new Date().toISOString() });
    
    // Recalculate readiness score
    const userSkills = this.getUserSkillsByUserId(userId);
    const certs = this.getCertificationsByUserId(userId);
    const verifiedCerts = certs.filter(c => c.status === 'verified');
    
    profile.totalSkillsCount = userSkills.length;
    profile.verifiedBadgeCount = verifiedCerts.length;
    
    let score = 30; // base score for registration
    if (profile.bio && profile.bio.length > 20) score += 15;
    if (userSkills.length > 0) score += Math.min(25, userSkills.length * 8);
    if (certs.length > 0) score += 15;
    if (verifiedCerts.length > 0) score += 15;
    profile.readinessScore = Math.min(100, score);

    this.saveData();
    return profile;
  }

  public getUserSkillsByUserId(userId: string): UserSkill[] {
    return this.data.userSkills.filter((s) => s.userId === userId);
  }

  public addUserSkill(skill: Omit<UserSkill, 'id' | 'isVerified'>): UserSkill {
    const newSkill: UserSkill = {
      ...skill,
      id: `usk-${Date.now()}`,
      isVerified: false
    };
    this.data.userSkills.push(newSkill);
    this.updateYouthProfile(skill.userId, {});
    this.saveData();
    return newSkill;
  }

  public deleteUserSkill(skillId: string, userId: string): boolean {
    const idx = this.data.userSkills.findIndex(s => s.id === skillId && s.userId === userId);
    if (idx !== -1) {
      this.data.userSkills.splice(idx, 1);
      this.updateYouthProfile(userId, {});
      this.saveData();
      return true;
    }
    return false;
  }

  public getEducationByUserId(userId: string): Education[] {
    return this.data.education.filter((e) => e.userId === userId);
  }

  public addEducation(edu: Omit<Education, 'id'>): Education {
    const newEdu: Education = { ...edu, id: `edu-${Date.now()}` };
    this.data.education.push(newEdu);
    this.saveData();
    return newEdu;
  }

  public getTrainingsByUserId(userId: string): Training[] {
    return this.data.trainings.filter((t) => t.userId === userId);
  }

  public addTraining(tr: Omit<Training, 'id'>): Training {
    const newTr: Training = { ...tr, id: `tr-${Date.now()}` };
    this.data.trainings.push(newTr);
    this.saveData();
    return newTr;
  }

  // --- CERTIFICATION & VERIFICATION OPERATIONS ---
  public getCertificationsByUserId(userId: string): Certification[] {
    return this.data.certifications.filter((c) => c.userId === userId);
  }

  public uploadCertification(certData: Omit<Certification, 'id' | 'status'>): { cert: Certification; request: VerificationRequest } {
    const newCert: Certification = {
      ...certData,
      id: `cert-${Date.now()}`,
      status: 'under_review'
    };
    this.data.certifications.push(newCert);

    const youth = this.getYouthProfileByUserId(certData.userId);

    const newReq: VerificationRequest = {
      id: `vr-${Date.now()}`,
      userId: certData.userId,
      userName: youth?.fullName || 'Youth User',
      userLga: youth?.lga || 'Gusau',
      certificationId: newCert.id,
      certificateTitle: certData.title,
      issuingOrganization: certData.issuingOrganization,
      documentUrl: certData.documentUrl,
      status: 'under_review',
      submittedAt: new Date().toISOString()
    };
    this.data.verificationRequests.push(newReq);

    this.addNotification(
      certData.userId,
      'Certificate Verification Submitted',
      `Your certificate "${certData.title}" was submitted for review.`,
      'verification'
    );

    this.updateYouthProfile(certData.userId, {});
    this.saveData();
    return { cert: newCert, request: newReq };
  }

  public getVerificationRequests(): VerificationRequest[] {
    return this.data.verificationRequests;
  }

  public reviewVerificationRequest(
    requestId: string,
    status: 'verified' | 'rejected',
    adminNotes: string,
    adminId: string,
    adminName: string
  ): boolean {
    const req = this.data.verificationRequests.find((r) => r.id === requestId);
    if (!req) return false;

    req.status = status;
    req.reviewedAt = new Date().toISOString();
    req.adminNotes = adminNotes;

    const cert = this.data.certifications.find((c) => c.id === req.certificationId);
    if (cert) {
      cert.status = status;
      cert.rejectionReason = status === 'rejected' ? adminNotes : undefined;
      if (status === 'verified') {
        cert.verifiedAt = new Date().toISOString();
        cert.verifiedByAdminId = adminId;
      }
    }

    this.addNotification(
      req.userId,
      status === 'verified' ? 'Certificate Verified!' : 'Verification Request Notice',
      status === 'verified'
        ? `Your certificate "${req.certificateTitle}" has been official verified by the board!`
        : `Your certificate verification was not approved: ${adminNotes}`,
      'verification'
    );

    this.addAdminLog(
      adminId,
      adminName,
      status === 'verified' ? 'CERTIFICATE_VERIFIED' : 'CERTIFICATE_REJECTED',
      req.userName,
      `${status.toUpperCase()}: ${req.certificateTitle} (${adminNotes || 'No notes'})`
    );

    this.updateYouthProfile(req.userId, {});
    this.saveData();
    return true;
  }

  // --- ASSESSMENT OPERATIONS ---
  public getAssessments(): Assessment[] {
    return this.data.assessments;
  }

  public getAssessmentById(id: string): Assessment | undefined {
    return this.data.assessments.find((a) => a.id === id);
  }

  public submitAssessment(
    userId: string,
    assessmentId: string,
    selectedOptions: Record<string, number>
  ): AssessmentResult | undefined {
    const assessment = this.getAssessmentById(assessmentId);
    if (!assessment) return undefined;

    let correctCount = 0;
    assessment.questions.forEach((q) => {
      if (selectedOptions[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / assessment.questions.length) * 100);
    const passed = scorePercent >= assessment.passingScorePercent;
    const badgeId = `ZSP-BADGE-${Date.now().toString().slice(-6)}`;

    const result: AssessmentResult = {
      id: `asr-${Date.now()}`,
      userId,
      assessmentId,
      assessmentTitle: assessment.title,
      category: assessment.category,
      scorePercent,
      passed,
      takenAt: new Date().toISOString(),
      certificateBadgeId: badgeId
    };

    this.data.assessmentResults.push(result);

    if (passed) {
      // Automatically add a verified platform skill badge
      const existingSkill = this.data.userSkills.find(
        (s) => s.userId === userId && s.category === assessment.category
      );

      if (existingSkill) {
        existingSkill.isVerified = true;
        existingSkill.verifiedBy = 'Platform Competency Assessment';
        existingSkill.verifiedAt = new Date().toISOString();
      } else {
        this.data.userSkills.push({
          id: `usk-${Date.now()}`,
          userId,
          category: assessment.category,
          skillName: `${assessment.category} (Platform Assessed)`,
          level: scorePercent >= 90 ? 'expert' : 'advanced',
          experienceYears: 1,
          evidenceDescription: `Passed platform competency assessment with ${scorePercent}% score (Badge #${badgeId}).`,
          isVerified: true,
          verifiedBy: 'Platform Competency Assessment',
          verifiedAt: new Date().toISOString()
        });
      }

      this.addNotification(
        userId,
        'Assessment Passed!',
        `Congratulations! You passed the "${assessment.title}" with ${scorePercent}%. Your verified skill badge has been added to your passport.`,
        'assessment'
      );
    } else {
      this.addNotification(
        userId,
        'Assessment Score Result',
        `You scored ${scorePercent}% on "${assessment.title}". Passing threshold is ${assessment.passingScorePercent}%. You can retake the assessment anytime!`,
        'assessment'
      );
    }

    this.updateYouthProfile(userId, {});
    this.saveData();
    return result;
  }

  public getAssessmentHistoryByUserId(userId: string): AssessmentResult[] {
    return this.data.assessmentResults.filter((r) => r.userId === userId);
  }

  // --- OPPORTUNITY & APPLICATION OPERATIONS ---
  public getOpportunities(filters?: { category?: string; lga?: string; search?: string }): Opportunity[] {
    let list = this.data.opportunities.filter((o) => o.status === 'active');
    if (filters?.category) {
      list = list.filter((o) => o.category.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters?.lga) {
      list = list.filter((o) => o.lga.toLowerCase() === filters.lga!.toLowerCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q) ||
          o.employerName.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getOpportunityById(id: string): Opportunity | undefined {
    return this.data.opportunities.find((o) => o.id === id);
  }

  public createOpportunity(opp: Omit<Opportunity, 'id' | 'applicantCount' | 'createdAt' | 'status'>): Opportunity {
    const newOpp: Opportunity = {
      ...opp,
      id: `opp-${Date.now()}`,
      applicantCount: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    this.data.opportunities.push(newOpp);

    // Notify registered youth users about the new opportunity
    const youthUsers = this.data.users.filter((u) => u.role === 'youth');
    youthUsers.forEach((user) => {
      this.addNotification(
        user.id,
        'New Opportunity Posted!',
        `New ${opp.type || 'opportunity'} in ${opp.category}: "${opp.title}" at ${opp.employerName} (${opp.lga} LGA). Deadline: ${opp.deadline}.`,
        'opportunity'
      );
    });

    this.saveData();
    return newOpp;
  }

  public applyForOpportunity(userId: string, opportunityId: string, coverNote?: string): Application | undefined {
    const opp = this.getOpportunityById(opportunityId);
    const youth = this.getYouthProfileByUserId(userId);
    if (!opp || !youth) return undefined;

    // Check if already applied
    const existing = this.data.applications.find((a) => a.opportunityId === opportunityId && a.youthUserId === userId);
    if (existing) return existing;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      opportunityId,
      opportunityTitle: opp.title,
      employerId: opp.employerId,
      employerName: opp.employerName,
      youthUserId: userId,
      youthName: youth.fullName,
      youthEmail: youth.email,
      youthPhone: youth.phone,
      youthLga: youth.lga,
      youthPassportId: youth.passportId,
      status: 'submitted',
      coverNote,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.applications.push(newApp);
    opp.applicantCount += 1;

    this.addNotification(
      userId,
      'Application Submitted',
      `Your application for "${opp.title}" at ${opp.employerName} was successfully received.`,
      'application'
    );

    // Notify the employer about the new applicant
    this.addNotification(
      opp.employerId,
      'New Applicant Received',
      `${youth.fullName} (${youth.lga} LGA) applied for "${opp.title}". Passport ID: ${youth.passportId}.`,
      'application'
    );

    this.saveData();
    return newApp;
  }

  public getApplicationsByYouth(userId: string): Application[] {
    return this.data.applications.filter((a) => a.youthUserId === userId);
  }

  public getApplicationsByEmployer(employerUserId: string): Application[] {
    return this.data.applications.filter((a) => a.employerId === employerUserId);
  }

  public updateApplicationStatus(
    applicationId: string,
    status: Application['status'],
    employerUserId: string
  ): boolean {
    const app = this.data.applications.find((a) => a.id === applicationId && a.employerId === employerUserId);
    if (!app) return false;

    app.status = status;
    app.updatedAt = new Date().toISOString();

    const statusDisplayNames: Record<string, string> = {
      submitted: 'Submitted',
      under_review: 'Under Review',
      shortlisted: 'Shortlisted 🎉',
      interviewing: 'Invited for Interview 📅',
      accepted: 'Accepted / Offer Extended 🏆',
      rejected: 'Not Selected'
    };

    const statusText = statusDisplayNames[status] || status.toUpperCase();

    this.addNotification(
      app.youthUserId,
      'Application Status Updated',
      `Your application for "${app.opportunityTitle}" with ${app.employerName} has been updated to: ${statusText}.`,
      'application'
    );

    this.saveData();
    return true;
  }

  // --- EMPLOYER OPERATIONS ---
  public getEmployerByUserId(userId: string): EmployerProfile | undefined {
    return this.data.employerProfiles.find((e) => e.userId === userId);
  }

  public updateEmployerProfile(userId: string, updates: Partial<EmployerProfile>): EmployerProfile | undefined {
    const emp = this.getEmployerByUserId(userId);
    if (!emp) return undefined;
    Object.assign(emp, updates);
    this.saveData();
    return emp;
  }

  public searchCandidates(filters?: { lga?: string; category?: string; search?: string }): YouthProfile[] {
    let list = [...this.data.youthProfiles];
    if (filters?.lga) {
      list = list.filter((y) => y.lga.toLowerCase() === filters.lga!.toLowerCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (y) => y.fullName.toLowerCase().includes(q) || y.bio.toLowerCase().includes(q) || y.passportId.toLowerCase().includes(q)
      );
    }
    if (filters?.category) {
      const matchingUserIds = this.data.userSkills
        .filter((s) => s.category.toLowerCase() === filters.category!.toLowerCase())
        .map((s) => s.userId);
      list = list.filter((y) => matchingUserIds.includes(y.userId));
    }
    return list;
  }

  // --- ADMIN & STATS OPERATIONS ---
  public getAdminStats(): AdminStats {
    const totalRegisteredUsers = this.data.users.length;
    const totalYouth = this.data.youthProfiles.length;
    const totalEmployers = this.data.employerProfiles.length;
    const totalVerifiedCredentials = this.data.certifications.filter((c) => c.status === 'verified').length;
    const pendingVerifications = this.data.verificationRequests.filter((v) => v.status === 'under_review').length;
    const totalSkillsRegistered = this.data.userSkills.length;
    const activeOpportunities = this.data.opportunities.filter((o) => o.status === 'active').length;
    const totalApplications = this.data.applications.length;

    // Users by LGA
    const usersByLGA: Record<string, number> = {};
    ZAMFARA_INFO.lgas.forEach((lga) => {
      usersByLGA[lga] = 0;
    });
    this.data.youthProfiles.forEach((yp) => {
      if (usersByLGA[yp.lga] !== undefined) {
        usersByLGA[yp.lga]++;
      } else {
        usersByLGA[yp.lga] = 1;
      }
    });

    // Popular skills
    const categoryCounts: Record<string, number> = {};
    this.data.userSkills.forEach((s) => {
      categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
    });
    const popularSkills = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    const verified = this.data.certifications.filter((c) => c.status === 'verified').length;
    const pending = this.data.certifications.filter((c) => c.status === 'under_review' || c.status === 'pending').length;
    const rejected = this.data.certifications.filter((c) => c.status === 'rejected').length;

    return {
      totalRegisteredUsers,
      totalYouth,
      totalEmployers,
      totalVerifiedCredentials,
      pendingVerifications,
      totalSkillsRegistered,
      activeOpportunities,
      totalApplications,
      usersByLGA,
      popularSkills,
      verifiedVsPending: { verified, pending, rejected }
    };
  }

  public getAllUsers(): User[] {
    return this.data.users;
  }

  public getAdminActivityLogs(): AdminActivityLog[] {
    return this.data.adminActivityLogs;
  }

  public addAdminLog(
    adminId: string,
    adminName: string,
    action: string,
    target: string,
    details: string
  ) {
    this.data.adminActivityLogs.unshift({
      id: `log-${Date.now()}`,
      adminId,
      adminName,
      action,
      target,
      details,
      timestamp: new Date().toISOString()
    });
    if (this.data.adminActivityLogs.length > 50) {
      this.data.adminActivityLogs.pop();
    }
  }

  // --- NOTIFICATION HELPERS ---
  public getNotificationsByUserId(userId: string): Notification[] {
    return this.data.notifications.filter((n) => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public markNotificationAsRead(id: string) {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.saveData();
    }
  }

  public markAllNotificationsAsRead(userId: string) {
    this.data.notifications.forEach((n) => {
      if (n.userId === userId) {
        n.isRead = true;
      }
    });
    this.saveData();
  }

  public addNotification(
    userId: string,
    title: string,
    message: string,
    type: Notification['type']
  ) {
    this.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    });
    this.saveData();
  }
}

export const db = new DatabaseManager();
