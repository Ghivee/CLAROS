import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudit } from '../context/AuditContext';

const AUDIT_QUESTIONS = [
  { id: 1, topic: 'politics', text: "Kebijakan Makan Bergizi Gratis Prabowo akan secara signifikan meningkatkan kualitas gizi anak Indonesia, sebanding dengan beban anggarannya." },
  { id: 2, topic: 'economy', text: "Pelemahan nilai tukar Rupiah terhadap Dolar AS saat ini murni disebabkan oleh faktor eksternal (suku bunga The Fed), bukan karena kelemahan fundamental ekonomi domestik." },
  { id: 3, topic: 'policy', text: "Pemindahan ibu kota ke IKN (Nusantara) adalah langkah krusial yang mutlak diperlukan untuk pemerataan ekonomi di luar Pulau Jawa." },
  { id: 4, topic: 'economy', text: "Kenaikan harga BBM (Bensin) adalah satu-satunya solusi logis untuk menyelamatkan APBN dari jebolnya kuota subsidi energi." },
  { id: 5, topic: 'politics', text: "Merosotnya indeks demokrasi di Indonesia merupakan harga yang pantas dibayar demi terwujudnya stabilitas politik dan percepatan pembangunan infrastruktur." },
  { id: 6, topic: 'policy', text: "Privatisasi sebagian aset BUMN akan selalu membuat pengelolaannya menjadi lebih profesional dan menguntungkan negara." },
  { id: 7, topic: 'politics', text: "Koalisi gemuk pemerintah di parlemen secara efektif menghilangkan peran oposisi yang kritis dan sehat dalam negara demokrasi." },
  { id: 8, topic: 'economy', text: "Hutang luar negeri Indonesia yang terus bertambah masih dalam batas yang sangat aman dan terkelola dengan baik untuk mendanai proyek strategis." },
  { id: 9, topic: 'policy', text: "Pembatasan pembelian BBM bersubsidi menggunakan aplikasi digital (seperti MyPertamina) efektif menekan kebocoran subsidi ke golongan menengah ke atas." },
  { id: 10, topic: 'politics', text: "Gaya kepemimpinan militeristik Prabowo adalah exactly apa yang dibutuhkan Indonesia saat ini untuk menjaga ketegasan di mata internasional." },
  { id: 11, topic: 'economy', text: "Kenaikan PPN (Pajak Pertambahan Nilai) menjadi 12% adalah kebijakan yang adil dan tidak membebani daya beli masyarakat kelas menengah-bawah secara signifikan." },
  { id: 12, topic: 'policy', text: "Program lumbung pangan nasional (Food Estate) telah berhasil menjamin ketahanan pangan domestik di tengah ancaman krisis pangan global." },
  { id: 13, topic: 'politics', text: "Aktivis dan mahasiswa yang sering demonstrasi cenderung ditunggangi oleh kepentingan politik tertentu dan menghambat kemajuan ekonomi negara." },
  { id: 14, topic: 'economy', text: "Impor beras dan bahan pangan pokok lainnya adalah keniscayaan yang tidak bisa dihindari meskipun Indonesia adalah negara agraris." },
  { id: 15, topic: 'policy', text: "Hilirisasi industri mineral (seperti nikel) telah terbukti secara signifikan memberikan kesejahteraan ekonomi langsung bagi masyarakat di sekitar area tambang." }
];

const SOURCE_OPTIONS = [
  { value: 0, label: "Media Sosial", icon: "forum", desc: "TikTok, X, Instagram, Facebook, utas viral, dll." },
  { value: 1, label: "Media Populer / Agregator", icon: "newspaper", desc: "Situs berita online, portal informasi populer, rangkuman." },
  { value: 2, label: "Sumber Primer / Wawancara", icon: "menu_book", desc: "Buku rujukan utama, wawancara tokoh kunci secara utuh." },
  { value: 3, label: "Jurnal Riset / Institusi Resmi", icon: "verified", desc: "Artikel ilmiah peer-reviewed, statistik resmi, konsensus ahli." }
];

const EXPOSURE_OPTIONS = [
  { value: 0, label: "Penerimaan Pasif", icon: "sensors", desc: "Muncul di FYP/rekomendasi, dibagikan teman, atau didengar tanpa sengaja." },
  { value: 1, label: "Penelusuran Aktif", icon: "search", desc: "Saya mencari tahu sendiri secara sengaja karena ingin memverifikasi topiknya." }
];

const CONFIDENCE_LEVELS = [
  { value: 1, label: "Sangat Ragu" },
  { value: 2, label: "Ragu" },
  { value: 3, label: "Netral / Sedang" },
  { value: 4, label: "Yakin" },
  { value: 5, label: "Sangat Yakin" }
];

export const BeliefAudit = () => {
  const { submitAudit } = useAudit();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(
    AUDIT_QUESTIONS.map(q => ({
      questionId: q.id,
      topic: q.topic,
      sourceAnswer: 0,
      confidenceAnswer: 3,
      lastExposureAnswer: 0
    }))
  );

  const currentQuestion = AUDIT_QUESTIONS[currentStep];
  const currentAnswer = answers[currentStep];

  const handleUpdateAnswer = (field, value) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = {
      ...newAnswers[currentStep],
      [field]: value
    };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentStep < AUDIT_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final Submit
      const { auditId } = submitAudit(answers);
      // Redirect to Origin Map page and pass the auditId to highlight the results
      navigate('/map', { state: { highlightAuditId: auditId } });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getTopicColor = (topic) => {
    switch(topic) {
      case 'politics': return 'text-alert border-alert/20 bg-alert/5';
      case 'economy': return 'text-caution border-caution/20 bg-caution/5';
      case 'policy': return 'text-signal border-signal/20 bg-signal/5';
      default: return 'text-ground border-outline-variant/30';
    }
  };

  const progressPercentage = Math.round(((currentStep + 1) / AUDIT_QUESTIONS.length) * 100);

  return (
    <div className="max-w-[750px] mx-auto py-6 flex flex-col min-h-[550px]">
      {/* Header with Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2 font-caption text-caption text-ground">
          <span className="flex items-center gap-1 select-none">
            <span className="material-symbols-outlined text-[16px] text-signal">fact_check</span>
            AUDIT KEYAKINAN AKTIF
          </span>
          <span>Pertanyaan {currentStep + 1} dari {AUDIT_QUESTIONS.length}</span>
        </div>
        <div className="w-full bg-[#2c2c2a] h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-signal-dark h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Main Question Panel */}
      <div className="bg-abyss rounded-xl p-6 md:p-8 border border-outline-variant/30 flex-grow flex flex-col justify-between shadow-xl">
        
        {/* Topic & Question Statement */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-label-sm uppercase tracking-wider ${getTopicColor(currentQuestion.topic)}`}>
              {currentQuestion.topic}
            </span>
          </div>
          <h2 className="font-headline-h3 text-headline-h3 text-clarity leading-snug">
            "{currentQuestion.text}"
          </h2>
        </div>

        {/* Audit Inputs */}
        <div className="space-y-6">
          {/* Question 1: Source */}
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-3">
              1. Dari mana Anda pertama kali mendengar opini ini?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SOURCE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleUpdateAnswer('sourceAnswer', opt.value)}
                  className={`flex items-start text-left p-3 rounded-lg border transition-all duration-200 ${
                    currentAnswer.sourceAnswer === opt.value
                      ? 'border-signal bg-signal/5 text-clarity'
                      : 'border-outline-variant/20 bg-surface/50 hover:bg-surface hover:border-outline-variant/60 text-ground'
                  }`}
                >
                  <span className={`material-symbols-outlined mr-3 text-2xl ${
                    currentAnswer.sourceAnswer === opt.value ? 'text-signal' : 'text-ground'
                  }`}>
                    {opt.icon}
                  </span>
                  <div>
                    <div className="font-label-sm text-label-sm font-semibold">{opt.label}</div>
                    <div className="font-caption text-[11px] mt-0.5 leading-tight opacity-80">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Exposure Type */}
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-3">
              2. Bagaimana Anda mendapatkan informasi ini?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXPOSURE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleUpdateAnswer('lastExposureAnswer', opt.value)}
                  className={`flex items-start text-left p-3 rounded-lg border transition-all duration-200 ${
                    currentAnswer.lastExposureAnswer === opt.value
                      ? 'border-signal bg-signal/5 text-clarity'
                      : 'border-outline-variant/20 bg-surface/50 hover:bg-surface hover:border-outline-variant/60 text-ground'
                  }`}
                >
                  <span className={`material-symbols-outlined mr-3 text-2xl ${
                    currentAnswer.lastExposureAnswer === opt.value ? 'text-signal' : 'text-ground'
                  }`}>
                    {opt.icon}
                  </span>
                  <div>
                    <div className="font-label-sm text-label-sm font-semibold">{opt.label}</div>
                    <div className="font-caption text-[11px] mt-0.5 leading-tight opacity-80">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Confidence Slider */}
          <div>
            <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-3">
              <span>3. Seberapa yakin Anda dengan opini ini?</span>
              <span className="text-signal font-semibold font-code">
                {CONFIDENCE_LEVELS.find(c => c.value === currentAnswer.confidenceAnswer)?.label}
              </span>
            </div>
            <div className="flex gap-2 justify-between">
              {CONFIDENCE_LEVELS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleUpdateAnswer('confidenceAnswer', opt.value)}
                  className={`flex-1 py-3 px-1 rounded-lg border font-caption text-caption text-center transition-all ${
                    currentAnswer.confidenceAnswer === opt.value
                      ? 'border-signal bg-signal text-white font-semibold shadow-md shadow-signal/20'
                      : 'border-outline-variant/20 bg-surface/50 hover:border-outline-variant/60 text-ground'
                  }`}
                >
                  {opt.value}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-2 font-caption text-[11px] text-ground opacity-60">
              <span>Sangat Ragu</span>
              <span>Sangat Yakin</span>
            </div>
          </div>
        </div>

        {/* Navigations */}
        <div className="flex justify-between mt-10 pt-6 border-t border-outline-variant/20">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-6 py-2.5 rounded-full border border-outline-variant font-label-sm text-label-sm flex items-center gap-1 transition-all ${
              currentStep === 0
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-surface hover:text-signal hover:border-signal active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Sebelumnya
          </button>
          
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-gradient-signal-dark hover:opacity-90 rounded-full text-white font-label-sm text-label-sm flex items-center gap-1 active:scale-95 transition-all shadow-[0_0_15px_rgba(124,110,232,0.3)]"
          >
            {currentStep === AUDIT_QUESTIONS.length - 1 ? (
              <>
                Selesai & Analisis
                <span className="material-symbols-outlined text-[18px]">done_all</span>
              </>
            ) : (
              <>
                Selanjutnya
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default BeliefAudit;
