import React, { createContext, useContext, useState, useEffect } from 'react';
import * as db from '../services/dbService';
import * as ai from '../services/aiService';

const AuditContext = createContext();

export const AuditProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [audits, setAudits] = useState([]);
  const [trainProgress, setTrainProgress] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize DB and load initial data
  const loadData = () => {
    db.initDB();
    setUser(db.getUser());
    setAudits(db.getAudits());
    setTrainProgress(db.getTrainProgress());
    setBadges(db.getBadges());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = () => {
    loadData();
  };

  const handleAddXP = (amount) => {
    const updatedUser = db.addXP(amount);
    setUser(updatedUser);
    setTrainProgress(db.getTrainProgress());
  };

  const handleSubmitAudit = (answers) => {
    // 1. Process answers via AI engine to get scores & recommendations
    const analysis = ai.analyzeAuditResults(answers);
    
    // 2. Save audit to db
    const { auditId, clarityScore } = db.saveAudit(
      analysis.algorithmicInfluenceScore,
      analysis.activeScore,
      analysis.passiveScore,
      analysis.biasLevel,
      answers
    );

    // 3. Increment XP for completing audit (+500 XP)
    const updatedUser = db.addXP(500);

    // 4. Earn "Cognitive Sovereignty Level 1" badge if clarityScore > 80
    if (clarityScore >= 80) {
      db.earnBadge("Cognitive Autonomy Level " + (clarityScore > 90 ? "3" : "2"));
    }

    // 5. Reload stats
    loadData();

    return { auditId, analysis };
  };

  const handleUpdateGymProgress = (levelNum, exerciseType, xpAwarded) => {
    const progress = db.getTrainProgress();
    const updates = { currentLevel: levelNum };
    
    if (exerciseType === 'expose') {
      updates.exposeCompleted = true;
    } else if (exerciseType === 'simulate') {
      updates.simulateCompleted = true;
    } else if (exerciseType === 'discuss') {
      updates.discussCompleted = true;
      db.earnBadge("Philosopher King");
    }

    db.updateTrainProgress(updates);
    handleAddXP(xpAwarded);
  };

  return (
    <AuditContext.Provider value={{
      user,
      audits,
      trainProgress,
      badges,
      loading,
      refreshData,
      addXP: handleAddXP,
      submitAudit: handleSubmitAudit,
      updateGymProgress: handleUpdateGymProgress
    }}>
      {!loading && children}
    </AuditContext.Provider>
  );
};

export const useAudit = () => useContext(AuditContext);
