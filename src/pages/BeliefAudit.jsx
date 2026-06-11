import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudit } from '../context/AuditContext';

const AUDIT_QUESTIONS = [
  { id: 1, topic: 'politics', text: "Prabowo's Free Nutritious Meal policy will significantly improve the nutritional quality of Indonesian children, commensurate with its budgetary burden." },
  { id: 2, topic: 'economy', text: "The current weakening of the Rupiah against the US Dollar is purely due to external factors (The Fed's interest rates), not domestic economic fundamental weaknesses." },
  { id: 3, topic: 'policy', text: "The relocation of the capital to IKN (Nusantara) is a crucial step absolutely necessary for economic equality outside Java Island." },
  { id: 4, topic: 'economy', text: "The increase in fuel prices (BBM) is the only logical solution to save the state budget (APBN) from a blown energy subsidy quota." },
  { id: 5, topic: 'politics', text: "The decline of the democracy index in Indonesia is a fair price to pay for realizing political stability and accelerated infrastructure development." },
  { id: 6, topic: 'policy', text: "The partial privatization of state-owned enterprises (BUMN) assets will always make their management more professional and profitable for the state." },
  { id: 7, topic: 'politics', text: "The fat government coalition in parliament effectively eliminates the role of a critical and healthy opposition in a democratic state." },
  { id: 8, topic: 'economy', text: "Indonesia's ever-growing foreign debt is still within very safe and well-managed limits to fund strategic projects." },
  { id: 9, topic: 'policy', text: "The restriction of subsidized fuel purchases using digital apps (like MyPertamina) effectively suppresses subsidy leakage to the upper middle class." },
  { id: 10, topic: 'politics', text: "Prabowo's militaristic leadership style is exactly what Indonesia needs right now to maintain firmness internationally." },
  { id: 11, topic: 'economy', text: "The VAT (Value Added Tax) increase to 12% is a fair policy and does not significantly burden the purchasing power of the lower-middle class." },
  { id: 12, topic: 'policy', text: "The national food estate program has successfully guaranteed domestic food security amid the threat of a global food crisis." },
  { id: 13, topic: 'politics', text: "Activists and students who frequently demonstrate tend to be ridden by certain political interests and hinder the country's economic progress." },
  { id: 14, topic: 'economy', text: "The import of rice and other staple foods is an unavoidable necessity even though Indonesia is an agrarian country." },
  { id: 15, topic: 'policy', text: "The downstreaming of the mineral industry (like nickel) has proven to significantly provide direct economic welfare for the communities around the mining areas." }
];

const SOURCE_OPTIONS = [
  { value: 0, label: "Social Media", icon: "forum", desc: "TikTok, X, Instagram, Facebook, viral threads, etc." },
  { value: 1, label: "Popular Media / Aggregator", icon: "newspaper", desc: "Online news sites, popular info portals, summaries." },
  { value: 2, label: "Primary Source / Interview", icon: "menu_book", desc: "Main reference books, full interviews of key figures." },
  { value: 3, label: "Research Journal / Official Institution", icon: "verified", desc: "Peer-reviewed scientific articles, official stats, expert consensus." }
];

const EXPOSURE_OPTIONS = [
  { value: 0, label: "Passive Reception", icon: "sensors", desc: "Appeared on FYP/recommendations, shared by friends, or overheard." },
  { value: 1, label: "Active Search", icon: "search", desc: "I actively searched for it deliberately because I wanted to verify the topic." }
];

const CONFIDENCE_LEVELS = [
  { value: 1, label: "Very Doubtful" },
  { value: 2, label: "Doubtful" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Confident" },
  { value: 5, label: "Very Confident" }
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
            ACTIVE BELIEF AUDIT
          </span>
          <span>Question {currentStep + 1} of {AUDIT_QUESTIONS.length}</span>
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
              1. Where did you first hear this opinion?
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
              2. How did you get this information?
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
              <span>3. How confident are you in this opinion?</span>
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
            Previous
          </button>
          
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-gradient-signal-dark hover:opacity-90 rounded-full text-white font-label-sm text-label-sm flex items-center gap-1 active:scale-95 transition-all shadow-[0_0_15px_rgba(124,110,232,0.3)]"
          >
            {currentStep === AUDIT_QUESTIONS.length - 1 ? (
              <>
                Complete & Analyze
                <span className="material-symbols-outlined text-[18px]">done_all</span>
              </>
            ) : (
              <>
                Next
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
