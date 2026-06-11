// AI Processing Engine (Simulating Claude API interactions)

/**
 * Generates personal insight and recommendations based on audit answers
 * Matches the POST /api/analyze contract
 */
export const analyzeAuditResults = (answers) => {
  // Calculate scores
  // sourceAnswer mapping: 0 = Social Media, 1 = Aggregator, 2 = Primary Source, 3 = Peer-Reviewed
  // lastExposureAnswer mapping: 0 = Passive recommendation, 1 = Active search

  let totalWeight = 0;
  let sourceScore = 0; // Higher = better source (Primary/Peer-reviewed)
  let exposureScore = 0; // Higher = active search, Lower = passive recommendation
  let confidenceWeightSum = 0;

  answers.forEach((ans) => {
    const confidence = ans.confidenceAnswer; // 1 to 5
    confidenceWeightSum += confidence;

    // Source values: Social Media (0 pts), Aggregators (1.5 pts), Primary Source (3 pts), Peer-Reviewed (4 pts)
    const sourcePoints = ans.sourceAnswer === 3 ? 4 : ans.sourceAnswer === 2 ? 3 : ans.sourceAnswer === 1 ? 1.5 : 0;
    sourceScore += sourcePoints * confidence;

    // Exposure: Passive (0 pts), Active (4 pts)
    const exposurePoints = ans.lastExposureAnswer === 1 ? 4 : 0;
    exposureScore += exposurePoints * confidence;

    totalWeight += 4 * confidence; // Max weight possible per question is 4 points
  });

  const sourcePercentage = Math.round((sourceScore / totalWeight) * 100);
  const activePercentage = Math.round((exposureScore / totalWeight) * 100);

  // Algorithmic Influence: high when confidence is high but sources are unverified and passive exposure is high
  const passivePercentage = 100 - activePercentage;
  const unverifiedPercentage = 100 - sourcePercentage;
  
  // Algorithmic Influence Score: average of passive exposure and unverified sources weighted by confidence
  const algorithmicInfluenceScore = Math.max(0, Math.min(100, Math.round((passivePercentage + unverifiedPercentage) / 2)));
  const activeScore = Math.max(0, Math.min(100, Math.round((activePercentage + sourcePercentage) / 2)));
  const passiveScore = 100 - activeScore;

  let biasLevel = "Low";
  if (algorithmicInfluenceScore > 70) biasLevel = "Critical";
  else if (algorithmicInfluenceScore > 40) biasLevel = "Moderate";

  // Generate recommendation based on worst scoring topic
  const topicCounts = {};
  const topicAlgWeights = {};
  answers.forEach(ans => {
    topicCounts[ans.topic] = (topicCounts[ans.topic] || 0) + 1;
    const isPassive = ans.lastExposureAnswer === 0;
    const isUnverified = ans.sourceAnswer <= 1;
    if (isPassive || isUnverified) {
      topicAlgWeights[ans.topic] = (topicAlgWeights[ans.topic] || 0) + (ans.confidenceAnswer * (isPassive ? 2 : 1));
    }
  });

  let worstTopic = "general";
  let maxWeight = -1;
  Object.keys(topicAlgWeights).forEach(topic => {
    if (topicAlgWeights[topic] > maxWeight) {
      maxWeight = topicAlgWeights[topic];
      worstTopic = topic;
    }
  });

  const recommendations = {
    health: "We detected a moderate bias level in the Health topic. Your algorithm tends to present instant fitness claims. Try reading at least one biology research article from a leading peer-reviewed journal this week.",
    politics: "Strong echo chamber detected in the Socio-Political topic. Your perspective is dominated by short video feed recommendations. Do a Steel-manning exercise by rewriting your political opposition's argument neutrally.",
    tech: "Your Tech opinions are passively shaped by industry influencers. Refer to official open source repositories or IEEE engineering journals to balance your understanding of AI regulations.",
    science: "Your Science beliefs are largely sourced from pop-science social media. Seek primary sources in official BRIN publications or Nature journal before sharing the next scientific thread.",
    wealth: "Your Financial/Investment perspective is highly at risk of being influenced by social media FOMO. Limit pop finance accounts and compare capital market technical analysis in regulated economic media.",
    general: "Your level of passive social media exposure is quite significant. Detox your algorithm feed for 24 hours and make it a habit to do active searches using neutral keywords."
  };

  // Generate dynamic origin map points
  const originMapData = answers.map((ans) => {
    // X-axis: Source (Social Media = 10-30, Aggregators = 35-55, Primary = 60-80, Peer-Reviewed = 85-98)
    let minX = 10, maxX = 30;
    let sourceName = "Social Media";
    if (ans.sourceAnswer === 1) { minX = 35; maxX = 55; sourceName = "Aggregator"; }
    else if (ans.sourceAnswer === 2) { minX = 60; maxX = 80; sourceName = "Primary Source"; }
    else if (ans.sourceAnswer === 3) { minX = 85; maxX = 98; sourceName = "Peer-Reviewed"; }

    const x = Math.round(minX + Math.random() * (maxX - minX));
    // Y-axis: Confidence (Confidence level 1 = 10-25, 2 = 30-45, 3 = 50-65, 4 = 70-85, 5 = 90-98)
    const minY = (ans.confidenceAnswer - 1) * 20 + 10;
    const maxY = ans.confidenceAnswer * 20 - 2;
    const y = Math.round(minY + Math.random() * (maxY - minY));

    return {
      x,
      y,
      topic: ans.topic,
      source: sourceName,
      confidence: ans.confidenceAnswer * 20 // as percentage
    };
  });

  return {
    algorithmicInfluenceScore,
    activeScore,
    passiveScore,
    biasLevel,
    recommendation: recommendations[worstTopic] || recommendations.general,
    originMapData
  };
};

/**
 * Level 1: Evaluating user steel-manning input
 */
export const evaluateSteelManning = (inputText) => {
  const length = inputText.trim().length;
  if (length < 30) {
    return {
      success: false,
      error: "Argument too short. Minimum 30 characters for meaningful analysis."
    };
  }

  // Basic checking heuristics
  const hasOpposingPerspective = inputText.toLowerCase().includes("meskipun") || 
                                 inputText.toLowerCase().includes("namun") || 
                                 inputText.toLowerCase().includes("sisi lain") || 
                                 inputText.toLowerCase().includes("argumen mereka") ||
                                 inputText.toLowerCase().includes("pendukung") ||
                                 inputText.toLowerCase().includes("karena");

  const hasEmotionalTone = inputText.toLowerCase().includes("bodoh") || 
                           inputText.toLowerCase().includes("tidak masuk akal") || 
                           inputText.toLowerCase().includes("gila") || 
                           inputText.toLowerCase().includes("jelas sekali") ||
                           inputText.toLowerCase().includes("salah besar");

  let score = 50;
  const fallacies = [];
  const suggestions = [];

  if (length > 100) score += 15;
  if (hasOpposingPerspective) {
    score += 25;
  } else {
    fallacies.push("Straw Man Tendency");
    suggestions.push("Use neutral transition sentences like 'The supporting argument for this position relies on...' to represent their initial claim.");
  }

  if (hasEmotionalTone) {
    score -= 20;
    fallacies.push("Emotional Loading");
    suggestions.push("Avoid negative emotionally loaded adjectives (like 'stupid', 'completely wrong') that unfairly discredit the opponent.");
  } else {
    score += 10;
  }

  score = Math.max(10, Math.min(100, score));
  const rating = score >= 80 ? "Highly Objective" : score >= 50 ? "Fairly Objective" : "Bias Detected";

  return {
    success: true,
    score,
    rating,
    fallacies,
    suggestions: suggestions.length > 0 ? suggestions : ["Excellent! Your argument is logically structured and presents the opponent's point of view with intellectual integrity."],
    xpEarned: score >= 50 ? 150 : 50
  };
};

/**
 * Level 2: Dialogue scenario state machine
 */
export const SCENARIO_STEPS = {
  start: {
    dialogue: "A viral opinion article on social media claims that the government's Free Nutritious Meal Program will trigger hyperinflation equivalent to the 1998 monetary crisis within the next 2 years. The comments section is filled with independent economic influencers who agree. What is your initial response before retweeting?",
    options: [
      {
        text: "Share immediately! Those influencers usually have 'insiders' who know the real data, this warning is important for the public.",
        nextStep: "fallacy_trap",
        xp: 10
      },
      {
        text: "Cross-search on mainstream economic news portals (e.g., CNBC Indonesia/Bisnis.com) to see the actual debt-to-GDP ratio analysis.",
        nextStep: "verification_start",
        xp: 50
      },
      {
        text: "Ask for opinions in the family group chat whether the price of basic necessities in the market has indeed started to rise drastically.",
        nextStep: "anecdotal_trap",
        xp: 20
      }
    ]
  },
  fallacy_trap: {
    dialogue: "You chose to trust completely due to authority bias (influencer). Suddenly an investigative journalist reveals that the influencer was paid by the opposition to create negative framing without solid APBN data. Your algorithm now dominates feeds with state bankruptcy conspiracy theories. How do you reconstruct this filter bubble?",
    options: [
      {
        text: "Just ignore it, let the feed run normally, politics is dirty anyway.",
        nextStep: "fail_end",
        xp: 0
      },
      {
        text: "Use the 'Not Interested' menu on all such agitation content, then actively search for 3 macroeconomic analyses from leading university academics to retrain the algorithm.",
        nextStep: "success_end",
        xp: 100
      }
    ]
  },
  anecdotal_trap: {
    dialogue: "Your family responded with complaints that egg prices did rise this week (anecdotal evidence). You feel the 1998 crisis theory must be true because basic necessity prices are rising. What step can strengthen your cognition?",
    options: [
      {
        text: "Accepting traditional market realities as the sole indicator that the country's macroeconomy will collapse tomorrow.",
        nextStep: "fail_end",
        xp: 10
      },
      {
        text: "Understanding this Availability Heuristic bias, then checking the official BPS (Statistics Indonesia) inflation report to see national vs. global food price trends.",
        nextStep: "verification_start",
        xp: 60
      }
    ]
  },
  verification_start: {
    dialogue: "From official secondary data research, you found that this program does widen the APBN deficit approaching the 3% limit, but there are no indicators from the World Bank or IMF predicting hyperinflation, and the Rupiah exchange rate is still in line with regional trends. How do you respond in the original comment section?",
    options: [
      {
        text: "Write a provocative comment: 'You opposition hoax spreaders! Our inflation is still safely at 2.5%, you panic-inducing buzzers!'",
        nextStep: "aggression_fail",
        xp: 20
      },
      {
        text: "Write a calm explanation: 'As additional info, World Bank reports and BPS data show our fiscal deficit has indeed widened to 2.8%, but liquidity remains strong and core inflation is maintained, far from the risk of a 1998-style structural crisis.'",
        nextStep: "success_end",
        xp: 150
      }
    ]
  },
  aggression_fail: {
    dialogue: "Your aggressive comment triggers an emotional, pointless debate. The influencer blocks you, and the social media algorithm flags your interaction as 'confrontational', feeding you more controversial content. Level failed. Want to try again?",
    options: [
      {
        text: "Restart the exercise from the beginning",
        nextStep: "start",
        xp: 0
      }
    ]
  },
  fail_end: {
    dialogue: "Exercise finished. You let your filter bubble and emotions control your reasoning process. Your reasoning score is low (+30 XP). Please repeat to train your cognitive sovereignty.",
    options: [
      {
        text: "Restart Gym",
        nextStep: "start",
        xp: 0
      }
    ]
  },
  success_end: {
    dialogue: "Excellent! You successfully deflected the social conformity bias trap and dismantled the anecdotal bias. You also successfully retrained your algorithm feeds proactively. Cognitive sovereignty defended (+200 XP).",
    options: [
      {
        text: "Finish Exercise",
        nextStep: "start", // loops back to start for replayability
        xp: 0,
        isCompleted: true
      }
    ]
  }
};
