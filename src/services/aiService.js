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
    health: "Kami mendeteksi tingkat bias sedang pada topik Kesehatan. Algoritma Anda condong menyajikan klaim kebugaran instan. Cobalah membaca minimal satu artikel riset biologi dari jurnal peer-reviewed terkemuka minggu ini.",
    politics: "Echo chamber terdeteksi kuat pada topik Sosial-Politik. Perspektif Anda didominasi rekomendasi feed video pendek. Lakukan latihan Steel-manning dengan menulis kembali argumen oposisi politik Anda secara netral.",
    tech: "Opini Teknologi Anda terbentuk pasif oleh influencer industri. Rujuklah ke repositori open source resmi atau jurnal teknik IEEE untuk menyeimbangkan pemahaman regulasi AI.",
    science: "Keyakinan Sains Anda banyak bersumber dari media sosial pop-science. Cari sumber primer di publikasi resmi BRIN atau jurnal Nature sebelum membagikan utas ilmiah berikutnya.",
    wealth: "Perspektif Keuangan/Investasi Anda sangat berisiko terpengaruh FOMO media sosial. Batasi akun finansial pop dan bandingkan analisis teknis pasar modal di media ekonomi teregulasi.",
    general: "Tingkat paparan pasif media sosial Anda cukup signifikan. Lakukan detoks feed algoritma selama 24 jam dan biasakan melakukan penelusuran aktif menggunakan kata kunci netral."
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
      error: "Argumen terlalu pendek. Minimal 30 karakter untuk analisis bermakna."
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
    suggestions.push("Gunakan kalimat transisi netral seperti 'Argumen pendukung posisi ini bersandar pada...' untuk merepresentasikan klaim awal mereka.");
  }

  if (hasEmotionalTone) {
    score -= 20;
    fallacies.push("Emotional Loading");
    suggestions.push("Hindari kata sifat bermuatan emosi negatif (seperti 'bodoh', 'salah besar') yang mendiskreditkan lawan secara tidak adil.");
  } else {
    score += 10;
  }

  score = Math.max(10, Math.min(100, score));
  const rating = score >= 80 ? "Sangat Objektif" : score >= 50 ? "Cukup Objektif" : "Bias Terdeteksi";

  return {
    success: true,
    score,
    rating,
    fallacies,
    suggestions: suggestions.length > 0 ? suggestions : ["Luar biasa! Argumen Anda terstruktur secara logis dan menyajikan sudut pandang lawan dengan integritas intelektual."],
    xpEarned: score >= 50 ? 150 : 50
  };
};

/**
 * Level 2: Dialogue scenario state machine
 */
export const SCENARIO_STEPS = {
  start: {
    dialogue: "Sebuah artikel opini viral di media sosial mengeklaim bahwa Program Makan Bergizi Gratis pemerintah akan memicu hiperinflasi yang setara dengan krisis moneter 1998 dalam 2 tahun ke depan. Kolom komentar dipenuhi influencer ekonomi independen yang setuju. Apa respons awal Anda sebelum meretweet?",
    options: [
      {
        text: "Bagikan segera! Para influencer itu biasanya punya 'orang dalam' yang tahu data asli, peringatan ini penting untuk masyarakat.",
        nextStep: "fallacy_trap",
        xp: 10
      },
      {
        text: "Lakukan pencarian silang di portal berita ekonomi arus utama (misal: CNBC Indonesia/Bisnis.com) untuk melihat analisis rasio utang dan PDB yang sebenarnya.",
        nextStep: "verification_start",
        xp: 50
      },
      {
        text: "Tanyakan pendapat di grup chat keluarga apakah harga sembako di pasar memang sudah mulai naik drastis.",
        nextStep: "anecdotal_trap",
        xp: 20
      }
    ]
  },
  fallacy_trap: {
    dialogue: "Anda memilih percaya penuh karena bias otoritas (influencer). Tiba-tiba salah satu jurnalis investigasi mengungkap bahwa influencer tersebut dibayar oleh kubu oposisi untuk membuat framing negatif tanpa data APBN yang solid. Algoritma Anda sekarang mendominasi feeds dengan teori konspirasi kebangkrutan negara. Bagaimana Anda merekonstruksi filter bubble ini?",
    options: [
      {
        text: "Abaikan saja, biarkan feed berjalan normal, toh politik memang kotor.",
        nextStep: "fail_end",
        xp: 0
      },
      {
        text: "Gunakan menu 'Tidak Tertarik' pada semua konten agitasi tersebut, lalu cari 3 analisis ekonomi makro dari akademisi universitas terkemuka secara aktif untuk melatih ulang algoritma.",
        nextStep: "success_end",
        xp: 100
      }
    ]
  },
  anecdotal_trap: {
    dialogue: "Keluarga Anda merespons dengan keluhan bahwa harga telur memang naik minggu ini (bukti anekdot). Anda merasa teori krisis 1998 itu pasti benar karena harga kebutuhan pokok mulai naik. Langkah apa yang bisa memperkuat kognisi Anda?",
    options: [
      {
        text: "Menerima realita pasar tradisional sebagai indikator tunggal bahwa ekonomi makro negara akan hancur besok.",
        nextStep: "fail_end",
        xp: 10
      },
      {
        text: "Memahami bias ketersediaan (Availability Heuristic) ini, lalu mengecek laporan inflasi resmi BPS (Badan Pusat Statistik) untuk melihat tren harga pangan nasional vs global.",
        nextStep: "verification_start",
        xp: 60
      }
    ]
  },
  verification_start: {
    dialogue: "Dari riset data sekunder resmi, Anda menemukan bahwa program ini memang melebarkan defisit APBN mendekati batas 3%, namun tidak ada indikator dari Bank Dunia atau IMF yang memprediksi hiperinflasi, dan nilai tukar Rupiah masih sesuai dengan tren regional. Bagaimana Anda merespons di kolom komentar asal?",
    options: [
      {
        text: "Tulis komentar provokatif: 'Kalian penyebar hoax oposisi! Inflasi kita masih aman 2.5%, dasar buzzer pembuat panik!'",
        nextStep: "aggression_fail",
        xp: 20
      },
      {
        text: "Tulis penjelasan tenang: 'Sebagai pelengkap informasi, laporan Bank Dunia dan data BPS menunjukkan defisit fiskal kita memang melebar ke 2.8%, namun likuiditas masih kuat dan inflasi inti terjaga, jauh dari risiko krisis struktural ala 1998.'",
        nextStep: "success_end",
        xp: 150
      }
    ]
  },
  aggression_fail: {
    dialogue: "Komentar agresif Anda memicu debat kusir emosional. Influencer memblokir Anda, dan algoritma media sosial menandai interaksi Anda sebagai 'konfrontatif', membuat Anda mendapat lebih banyak konten kontroversial. Level gagal. Mau coba lagi?",
    options: [
      {
        text: "Ulangi latihan dari awal",
        nextStep: "start",
        xp: 0
      }
    ]
  },
  fail_end: {
    dialogue: "Latihan selesai. Anda membiarkan filter bubble dan emosi mengendalikan proses penalaran Anda. Skor penalaran Anda rendah (+30 XP). Silakan ulangi untuk melatih kedaulatan kognitif Anda.",
    options: [
      {
        text: "Mulai Ulang Gym",
        nextStep: "start",
        xp: 0
      }
    ]
  },
  success_end: {
    dialogue: "Luar biasa! Anda berhasil menepis jebakan bias konformitas sosial dan membongkar bias anekdotal. Anda juga berhasil melatih ulang feeds algoritma Anda secara proaktif. Kedaulatan kognitif berhasil dipertahankan (+200 XP).",
    options: [
      {
        text: "Selesaikan Latihan",
        nextStep: "start", // loops back to start for replayability
        xp: 0,
        isCompleted: true
      }
    ]
  }
};
