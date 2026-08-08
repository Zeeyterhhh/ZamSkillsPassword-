import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { db } from './src/server/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini AI Client setup
  let aiClient: GoogleGenAI | null = null;
  const getAiClient = () => {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        aiClient = new GoogleGenAI({ apiKey });
      }
    }
    return aiClient;
  };

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), platform: 'Zamfara Skills Passport' });
  });

  // Auth: Login / Session
  app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }
    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Account has been suspended by administrator.' });
    }
    user.lastLogin = new Date().toISOString();
    return res.json({ user });
  });

  // Auth: Register
  app.post('/api/auth/register', (req, res) => {
    const { email, role, fullName, phone } = req.body;
    if (!email || !fullName || !role) {
      return res.status(400).json({ error: 'Email, Full Name, and Role are required' });
    }
    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email address is already registered.' });
    }
    const newUser = db.createUser({ email, role, fullName, phone: phone || '' });
    return res.status(201).json({ user: newUser });
  });

  // Auth: Quick Switch Demo Users
  app.get('/api/auth/demo-users', (req, res) => {
    const users = db.getAllUsers();
    res.json({ users });
  });

  // Youth: Get Passport by ID or User ID
  app.get('/api/youth/passport/:id', (req, res) => {
    const { id } = req.params;
    let youth = db.getYouthProfileById(id);
    if (!youth) {
      youth = db.getYouthProfileByUserId(id);
    }
    if (!youth) {
      return res.status(404).json({ error: 'Skills Passport not found' });
    }
    const skills = db.getUserSkillsByUserId(youth.userId);
    const education = db.getEducationByUserId(youth.userId);
    const trainings = db.getTrainingsByUserId(youth.userId);
    const certifications = db.getCertificationsByUserId(youth.userId);
    const assessmentResults = db.getAssessmentHistoryByUserId(youth.userId);

    return res.json({
      passport: youth,
      skills,
      education,
      trainings,
      certifications,
      assessmentResults
    });
  });

  // Youth: Update Profile
  app.put('/api/youth/profile/:userId', (req, res) => {
    const { userId } = req.params;
    const updated = db.updateYouthProfile(userId, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Youth profile not found' });
    }
    return res.json({ passport: updated });
  });

  // Youth: Manage Skills
  app.post('/api/youth/skills', (req, res) => {
    const { userId, category, skillName, level, experienceYears, evidenceUrl, evidenceDescription } = req.body;
    if (!userId || !category || !skillName) {
      return res.status(400).json({ error: 'User ID, Category, and Skill Name are required' });
    }
    const newSkill = db.addUserSkill({
      userId,
      category,
      skillName,
      level: level || 'intermediate',
      experienceYears: Number(experienceYears) || 1,
      evidenceUrl,
      evidenceDescription
    });
    return res.status(201).json({ skill: newSkill });
  });

  app.delete('/api/youth/skills/:skillId', (req, res) => {
    const { skillId } = req.params;
    const { userId } = req.query;
    const deleted = db.deleteUserSkill(skillId, String(userId));
    if (!deleted) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    return res.json({ success: true });
  });

  // Youth: Education & Trainings
  app.post('/api/youth/education', (req, res) => {
    const edu = db.addEducation(req.body);
    return res.status(201).json({ education: edu });
  });

  app.post('/api/youth/training', (req, res) => {
    const tr = db.addTraining(req.body);
    return res.status(201).json({ training: tr });
  });

  // Certifications & Verification Upload
  app.post('/api/verifications/upload', (req, res) => {
    const { userId, title, issuingOrganization, issueDate, credentialId, documentUrl } = req.body;
    if (!userId || !title || !issuingOrganization || !documentUrl) {
      return res.status(400).json({ error: 'User ID, Title, Issuing Organization, and Document URL are required' });
    }
    const result = db.uploadCertification({
      userId,
      title,
      issuingOrganization,
      issueDate: issueDate || new Date().toISOString().split('T')[0],
      credentialId,
      documentUrl
    });
    return res.status(201).json(result);
  });

  // Verification Requests (Admin Queue)
  app.get('/api/verifications/requests', (req, res) => {
    const requests = db.getVerificationRequests();
    return res.json({ requests });
  });

  app.post('/api/verifications/:id/review', (req, res) => {
    const { id } = req.params;
    const { status, adminNotes, adminId, adminName } = req.body;
    if (!status || !adminId) {
      return res.status(400).json({ error: 'Status and Admin ID are required' });
    }
    const ok = db.reviewVerificationRequest(id, status, adminNotes || '', adminId, adminName || 'Admin');
    if (!ok) {
      return res.status(404).json({ error: 'Verification request not found' });
    }
    return res.json({ success: true });
  });

  // Skills Assessments
  app.get('/api/assessments', (req, res) => {
    const assessments = db.getAssessments();
    return res.json({ assessments });
  });

  app.get('/api/assessments/:id', (req, res) => {
    const assessment = db.getAssessmentById(req.params.id);
    if (!assessment) return res.status(404).json({ error: 'Assessment not found' });
    return res.json({ assessment });
  });

  app.post('/api/assessments/:id/submit', (req, res) => {
    const { userId, selectedOptions } = req.body;
    if (!userId || !selectedOptions) {
      return res.status(400).json({ error: 'User ID and selectedOptions are required' });
    }
    const result = db.submitAssessment(userId, req.params.id, selectedOptions);
    if (!result) {
      return res.status(400).json({ error: 'Failed to process assessment submission' });
    }
    return res.json({ result });
  });

  // Opportunities & Applications
  app.get('/api/opportunities', (req, res) => {
    const { category, lga, search } = req.query;
    const opportunities = db.getOpportunities({
      category: category ? String(category) : undefined,
      lga: lga ? String(lga) : undefined,
      search: search ? String(search) : undefined
    });
    return res.json({ opportunities });
  });

  app.get('/api/opportunities/:id', (req, res) => {
    const opportunity = db.getOpportunityById(req.params.id);
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });
    return res.json({ opportunity });
  });

  app.post('/api/opportunities', (req, res) => {
    const newOpp = db.createOpportunity(req.body);
    return res.status(201).json({ opportunity: newOpp });
  });

  app.post('/api/opportunities/:id/apply', (req, res) => {
    const { userId, coverNote } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });
    const appRecord = db.applyForOpportunity(userId, req.params.id, coverNote);
    if (!appRecord) return res.status(400).json({ error: 'Could not submit application' });
    return res.status(201).json({ application: appRecord });
  });

  app.get('/api/applications/youth/:userId', (req, res) => {
    const apps = db.getApplicationsByYouth(req.params.userId);
    return res.json({ applications: apps });
  });

  app.get('/api/applications/employer/:employerUserId', (req, res) => {
    const apps = db.getApplicationsByEmployer(req.params.employerUserId);
    return res.json({ applications: apps });
  });

  app.put('/api/applications/:id/status', (req, res) => {
    const { status, employerUserId } = req.body;
    if (!status || !employerUserId) return res.status(400).json({ error: 'Status and employerUserId required' });
    const ok = db.updateApplicationStatus(req.params.id, status, employerUserId);
    if (!ok) return res.status(404).json({ error: 'Application record not found' });
    return res.json({ success: true });
  });

  // Employer Candidate Pool Search
  app.get('/api/employer/candidates', (req, res) => {
    const { lga, category, search } = req.query;
    const candidates = db.searchCandidates({
      lga: lga ? String(lga) : undefined,
      category: category ? String(category) : undefined,
      search: search ? String(search) : undefined
    });
    return res.json({ candidates });
  });

  app.get('/api/employer/profile/:userId', (req, res) => {
    const emp = db.getEmployerByUserId(req.params.userId);
    if (!emp) return res.status(404).json({ error: 'Employer profile not found' });
    return res.json({ employer: emp });
  });

  app.put('/api/employer/profile/:userId', (req, res) => {
    const updated = db.updateEmployerProfile(req.params.userId, req.body);
    if (!updated) return res.status(404).json({ error: 'Employer profile not found' });
    return res.json({ employer: updated });
  });

  // Admin Portal Stats & Logs
  app.get('/api/admin/stats', (req, res) => {
    const stats = db.getAdminStats();
    return res.json({ stats });
  });

  app.get('/api/admin/users', (req, res) => {
    const users = db.getAllUsers();
    return res.json({ users });
  });

  app.put('/api/admin/users/:userId/status', (req, res) => {
    const { status, adminName } = req.body;
    const ok = db.updateUserStatus(req.params.userId, status, adminName || 'Board Admin');
    if (!ok) return res.status(404).json({ error: 'User not found' });
    return res.json({ success: true });
  });

  app.get('/api/admin/logs', (req, res) => {
    const logs = db.getAdminActivityLogs();
    return res.json({ logs });
  });

  // Notifications
  app.get('/api/notifications/:userId', (req, res) => {
    const notifs = db.getNotificationsByUserId(req.params.userId);
    return res.json({ notifications: notifs });
  });

  app.put('/api/notifications/:id/read', (req, res) => {
    db.markNotificationAsRead(req.params.id);
    return res.json({ success: true });
  });

  app.put('/api/notifications/user/:userId/read-all', (req, res) => {
    db.markAllNotificationsAsRead(req.params.userId);
    return res.json({ success: true });
  });

  // Gemini AI Assistant Endpoint
  app.post('/api/ai/career-advice', async (req, res) => {
    const { passport, skills, targetLga } = req.body;
    const ai = getAiClient();
    if (!ai) {
      return res.json({
        advice: `Welcome ${passport?.fullName || 'Youth'} from ${targetLga || 'Zamfara State'}! To enhance your employment readiness on the Zamfara Skills Passport:
1. Complete platform competency assessments in your primary skill area.
2. Upload verified vocational certificates from recognized bodies like NDE, NITDA, or ITF.
3. Apply directly to local opportunities in ${targetLga || 'Gusau'} with a tailored cover note highlighting your verified credentials.`
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert career counselor for youth in Zamfara State, Nigeria. 
Analyze the following youth profile and provide 3 crisp, empowering recommendations for career growth, certificate verification, and job application readiness in Zamfara State:

Youth Name: ${passport?.fullName}
LGA: ${passport?.lga || targetLga || 'Gusau'}
Skills: ${skills?.map((s: any) => s.skillName).join(', ') || 'General'}
Bio: ${passport?.bio}
Readiness Score: ${passport?.readinessScore}%`
      });

      return res.json({ advice: response.text });
    } catch (err: any) {
      console.warn('Gemini API call error:', err?.message || err);
      return res.json({
        advice: `To maximize your career readiness in ${passport?.lga || 'Zamfara State'}, complete your profile, obtain platform assessment badges, and connect with active local employers in agriculture, ICT, and trades.`
      });
    }
  });

  // Vite middleware setup for Development & Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Zamfara Skills Passport Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
