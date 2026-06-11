const fs = require('fs');

function translateFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [id, en] of Object.entries(replacements)) {
    content = content.replace(new RegExp(id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), en);
  }
  fs.writeFileSync(filePath, content);
}

translateFile('src/services/dbService.js', {
  "KognitifSovereign": "CognitiveSovereign"
});

translateFile('src/pages/OriginMap.jsx', {
  "Peta Confidence Belum Aktif": "Confidence Map Not Active",
  "Origin Map memerlukan data audit keyakinan Anda terlebih dahulu. Silakan ikuti tes Belief Audit pertama Anda untuk memetakan keyakinan.": "The Origin Map requires your belief audit data first. Please take your first Belief Audit to map your beliefs.",
  "Mulai Audit Pertama": "Start First Audit",
  "Benchmark Rata-rata": "Average Benchmark",
  "Confidence Rata-rata:": "Average Confidence:",
  "Memetakan sumber keyakinan Anda (X) terhadap tingkat keyakinan Anda (Y).": "Mapping the source of your belief (X) against your confidence level (Y).",
  "Toggle Rata-rata Benchmark Anonim": "Toggle Anonymous Average Benchmark",
  "Belum Terverifikasi": "Unverified",
  "Rata-rata Pengguna": "Average User",
  "Node Terpilih": "Selected Node",
  "Confidence Anda sangat tinggi": "Your confidence is very high",
  "namun didapat dari paparan pasif media sosial. Kurangi bias konformitas dengan melatih pemikiran kritis di Gym.": "but it was obtained from passive social media exposure. Reduce conformity bias by training critical thinking in the Gym.",
  "Sedang": "Moderate",
  "Kritis": "Critical"
});

translateFile('src/pages/CriticalGym.jsx', {
  "Lawan bias konformitas dengan menyusun argumen terkuat untuk perspektif yang Anda tentang.": "Counter conformity bias by structuring the strongest argument for the perspective you oppose.",
  "Tulis pembelaan terbaik Anda untuk argumen di atas (Gunakan nada logis, netral, tanpa kata-kata emosional):": "Write your best defense for the argument above (Use a logical, neutral tone, without emotional words):",
  "AI Sedang Menganalisis Struktur Argumen...": "AI is Analyzing Argument Structure...",
  "Kirim & Uji Validitas": "Submit & Test Validity",
  "Argumen terlalu pendek (Min. 30 karakter)": "Argument is too short (Min. 30 characters)",
  "Hasil Analisis Argumen": "Argument Analysis Results",
  "Kembali ke Regimen": "Back to Regimen",
  "Navigasi pohon dialog melawan bias kognitif Anda untuk mempertahankan kedaulatan berpikir.": "Navigate the dialogue tree against your cognitive biases to maintain sovereignty of thought.",
  "Mulai Ulang Skenario": "Restart Scenario",
  "Latihan Hari Ini": "Today's Training",
  "3 Tingkatan Latihan": "3 Training Levels",
  "Konstruksi argumen terkuat untuk pandangan oposisi tanpa fallacy. Melatih objektivitas kognitif.": "Construct the strongest argument for opposing views without fallacy. Train cognitive objectivity.",
  "Mulai Latihan": "Start Training",
  "Debat kognitif peer-to-peer terstruktur dengan moderasi netral. Completedkan Level 2 untuk membuka.": "Structured peer-to-peer cognitive debate with neutral moderation. Complete Level 2 to unlock.",
  "Tulis sanggahan netral Anda...": "Write your neutral rebuttal...",
  "Latihan selesai! Badge \"Philosopher King\" telah didapatkan.": "Training complete! \"Philosopher King\" badge acquired.",
  "Kirim": "Send"
});

translateFile('src/pages/ClarityScore.jsx', {
  "Clarity Score Belum Aktif": "Clarity Score Not Active",
  "Clarity Score melacak kemajuan kejernihan berpikir Anda secara historis. Silakan selesaikan Belief Audit untuk mengaktifkan pelacakan.": "Clarity Score tracks your cognitive clarity progress historically. Please complete the Belief Audit to activate tracking.",
  "Melacak tingkat kemandirian berpikir dan reduksi bias Anda dari waktu ke waktu. Pertahankan kedaulatan kognisi Anda.": "Tracks your level of independent thinking and bias reduction over time. Maintain your cognitive sovereignty.",
  "Sertifikat Kognitif": "Cognitive Certificate",
  "Buka Potensi Penuh": "Unlock Full Potential",
  "Latih pikiran Anda untuk mencapai tingkat Objectivity maksimum": "Train your mind to reach maximum Objectivity level",
  "Dapatkan XP": "Earn XP"
});
