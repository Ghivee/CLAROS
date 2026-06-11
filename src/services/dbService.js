// LocalStorage-based Database Service mirroring Firebase Firestore schema

const KEYS = {
  USER: 'claros_user',
  AUDITS: 'claros_audits',
  AUDIT_DETAILS: 'claros_audit_details',
  TRAIN_PROGRESS: 'claros_train_progress',
  BADGES: 'claros_badges'
};

// Initialize default mock user data if empty
export const initDB = () => {
  if (!localStorage.getItem(KEYS.USER)) {
    const defaultUser = {
      uid: 'user_123',
      email: 'student@example.edu',
      displayName: 'KognitifSovereign',
      createdAt: new Date().toISOString(),
      totalXP: 4250,
      clarityScore: 84,
      streakDays: 5
    };
    localStorage.setItem(KEYS.USER, JSON.stringify(defaultUser));
  }

  if (!localStorage.getItem(KEYS.AUDITS)) {
    // Generate some mock history audits over the past 30 days
    const mockAudits = [
      {
        auditId: 'audit_init',
        userId: 'user_123',
        completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        algInfluenceScore: 78,
        activeScore: 30,
        passiveScore: 70,
        biasLevel: 'High'
      },
      {
        auditId: 'audit_mid',
        userId: 'user_123',
        completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        algInfluenceScore: 68,
        activeScore: 50,
        passiveScore: 50,
        biasLevel: 'Moderate'
      },
      {
        auditId: 'audit_curr',
        userId: 'user_123',
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        algInfluenceScore: 52,
        activeScore: 78,
        passiveScore: 22,
        biasLevel: 'Low'
      }
    ];
    localStorage.setItem(KEYS.AUDITS, JSON.stringify(mockAudits));
  }

  if (!localStorage.getItem(KEYS.TRAIN_PROGRESS)) {
    const defaultProgress = {
      progressId: 'progress_123',
      userId: 'user_123',
      currentLevel: 2, // Expose (lvl 1) completed, Simulate (lvl 2) in progress
      exposeCompleted: true,
      simulateCompleted: false,
      discussCompleted: false,
      xpEarned: 1200
    };
    localStorage.setItem(KEYS.TRAIN_PROGRESS, JSON.stringify(defaultProgress));
  }

  if (!localStorage.getItem(KEYS.BADGES)) {
    const defaultBadges = [
      {
        badgeId: 'badge_1',
        userId: 'user_123',
        badgeType: 'Cognitive Autonomy Level 1',
        earnedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        badgeImageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809'
      }
    ];
    localStorage.setItem(KEYS.BADGES, JSON.stringify(defaultBadges));
  }
};

export const getUser = () => {
  initDB();
  return JSON.parse(localStorage.getItem(KEYS.USER));
};

export const updateUser = (updates) => {
  const user = getUser();
  const updated = { ...user, ...updates };
  localStorage.setItem(KEYS.USER, JSON.stringify(updated));
  return updated;
};

export const addXP = (amount) => {
  const user = getUser();
  const newXP = user.totalXP + amount;
  
  // Calculate potential new badges based on XP levels
  const updatedUser = updateUser({ totalXP: newXP });
  
  // Check progress update
  const progress = getTrainProgress();
  const newProgressXP = progress.xpEarned + amount;
  updateTrainProgress({ xpEarned: newProgressXP });

  return updatedUser;
};

export const getAudits = () => {
  initDB();
  return JSON.parse(localStorage.getItem(KEYS.AUDITS)) || [];
};

export const getAuditDetails = (auditId) => {
  const details = JSON.parse(localStorage.getItem(KEYS.AUDIT_DETAILS)) || [];
  return details.filter(d => d.auditId === auditId);
};

export const saveAudit = (algInfluenceScore, activeScore, passiveScore, biasLevel, answers) => {
  const user = getUser();
  const auditId = 'audit_' + Date.now();
  const newAudit = {
    auditId,
    userId: user.uid,
    completedAt: new Date().toISOString(),
    algInfluenceScore,
    activeScore,
    passiveScore,
    biasLevel
  };

  const audits = getAudits();
  audits.push(newAudit);
  localStorage.setItem(KEYS.AUDITS, JSON.stringify(audits));

  // Save detailed answers
  const details = JSON.parse(localStorage.getItem(KEYS.AUDIT_DETAILS)) || [];
  const newDetails = answers.map((ans, idx) => ({
    detailId: `detail_${auditId}_${idx}`,
    auditId,
    questionNumber: ans.questionId,
    topic: ans.topic,
    sourceAnswer: ans.sourceAnswer, // 0: Social Media, 1: Aggregator, 2: Primary Source, 3: Peer-Reviewed
    confidenceAnswer: ans.confidenceAnswer, // 1 - 5
    lastExposureAnswer: ans.lastExposureAnswer // "Active search" or "Passive recommendation"
  }));
  
  localStorage.setItem(KEYS.AUDIT_DETAILS, JSON.stringify([...details, ...newDetails]));

  // Recalculate Clarity Score (derived from activeScore and audits quantity)
  // Higher clarity score if algInfluence is low and active search is high
  const clarityScore = Math.round(100 - (algInfluenceScore * 0.6) + (activeScore * 0.4));
  updateUser({ clarityScore });

  return { auditId, clarityScore };
};

export const getTrainProgress = () => {
  initDB();
  return JSON.parse(localStorage.getItem(KEYS.TRAIN_PROGRESS));
};

export const updateTrainProgress = (updates) => {
  const progress = getTrainProgress();
  const updated = { ...progress, ...updates };
  localStorage.setItem(KEYS.TRAIN_PROGRESS, JSON.stringify(updated));
  return updated;
};

export const getBadges = () => {
  initDB();
  return JSON.parse(localStorage.getItem(KEYS.BADGES)) || [];
};

export const earnBadge = (badgeType) => {
  const user = getUser();
  const badges = getBadges();
  
  // Check if user already has this badge
  if (badges.some(b => b.badgeType === badgeType)) return badges;

  const newBadge = {
    badgeId: 'badge_' + Date.now(),
    userId: user.uid,
    badgeType,
    earnedAt: new Date().toISOString(),
    badgeImageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809'
  };

  badges.push(newBadge);
  localStorage.setItem(KEYS.BADGES, JSON.stringify(badges));
  return badges;
};

// Emulated API Contract endpoints: GET /api/benchmark
export const getBenchmarkData = (userScore) => {
  return {
    userScore: userScore || 84,
    averageScore: 72,
    percentile: Math.max(1, Math.min(99, Math.round(((userScore || 84) - 50) * 2))), // Simple dynamic percentile calculation
    sampleSize: 1247,
    distribution: [12, 18, 35, 22, 13]
  };
};
