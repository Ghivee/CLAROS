import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';
import { evaluateSteelManning, SCENARIO_STEPS } from '../services/aiService';

export const CriticalGym = () => {
  const { user, trainProgress, addXP, updateGymProgress } = useAudit();
  
  // Navigation states within gym
  const [activeExercise, setActiveExercise] = useState(null); // 'level1', 'level2', null
  
  // Level 1: Steel-manning states
  const [steelManInput, setSteelManInput] = useState('');
  const [steelManResult, setSteelManResult] = useState(null);
  const [steelManLoading, setSteelManLoading] = useState(false);

  // Level 2: Dialogue Simulation states
  const [scenarioStep, setScenarioStep] = useState('start');
  const [accumulatedXP, setAccumulatedXP] = useState(0);

  // Level 3: Debate states
  const [debateMessages, setDebateMessages] = useState([
    { id: 1, author: "AnonSocrates", text: "Kenaikan harga BBM adalah realita ekonomi global, subsidi hanya membakar uang negara untuk pihak yang tidak tepat sasaran.", role: "pro" },
    { id: 2, author: "KognitifEmpati", text: "Namun mencabut subsidi di saat daya beli anjlok justru memicu inflasi harga pangan yang mencekik kelas menengah ke bawah.", role: "contra" }
  ]);
  const [debateInput, setDebateInput] = useState('');

  // Level 1 Handlers
  const handleSteelManSubmit = () => {
    setSteelManLoading(true);
    setTimeout(() => {
      const res = evaluateSteelManning(steelManInput);
      setSteelManResult(res);
      setSteelManLoading(false);
      
      if (res.success && res.score >= 50) {
        updateGymProgress(2, 'expose', res.xpEarned);
      }
    }, 1200);
  };

  // Level 2 Handlers
  const handleScenarioChoice = (option) => {
    setAccumulatedXP(prev => prev + option.xp);
    
    if (option.isCompleted) {
      updateGymProgress(3, 'simulate', accumulatedXP + option.xp);
      setScenarioStep('success_end');
    } else {
      setScenarioStep(option.nextStep);
    }
  };

  const handleResetScenario = () => {
    setScenarioStep('start');
    setAccumulatedXP(0);
  };

  // Level 3 Handlers
  const handleSendDebateMessage = (e) => {
    e.preventDefault();
    if (!debateInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      author: user.displayName || 'You',
      text: debateInput,
      role: 'pro'
    };
    
    setDebateMessages([...debateMessages, newMsg]);
    setDebateInput('');
    
    // Award debate XP and complete gym level 3
    if (!trainProgress.discussCompleted) {
      updateGymProgress(3, 'discuss', 200);
    }
  };

  const currentScenario = SCENARIO_STEPS[scenarioStep];

  return (
    <div className="space-y-8">
      {/* Exercise Workspaces (Render overlays when active) */}
      {activeExercise === 'level1' && (
        <div className="bg-abyss rounded-xl p-6 md:p-8 border-l-4 border-signal border border-outline-variant/30 shadow-2xl relative">
          <button 
            onClick={() => { setActiveExercise(null); setSteelManResult(null); }}
            className="absolute top-4 right-4 text-ground hover:text-clarity transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          
          <div className="mb-6">
            <span className="font-label-sm text-label-sm text-pulse uppercase tracking-wider font-semibold">LEVEL 1: EXPOSE (ACTIVE)</span>
            <h2 className="font-headline-h3 text-headline-h3 text-clarity mt-1">Steel-manning Challenge</h2>
            <p className="font-caption text-caption text-ground mt-1">Lawan bias konformitas dengan menyusun argumen terkuat untuk perspektif yang Anda tentang.</p>
          </div>

          <div className="bg-surface p-4 rounded-lg border border-outline-variant/30 mb-6">
            <div className="font-label-sm text-label-sm text-alert flex items-center gap-1.5 mb-2 font-semibold select-none">
              <span className="material-symbols-outlined text-[16px]">info</span>
              Opini Oposisi Untuk Didekonstruksi
            </div>
            <p className="font-body-md text-on-surface-variant italic">
              "Program Makan Bergizi Gratis Prabowo hanyalah pemborosan APBN triliunan rupiah yang berisiko menciptakan hiperinflasi tanpa menyelesaikan akar kemiskinan."
            </p>
          </div>

          {!steelManResult ? (
            <div className="space-y-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">
                  Tulis pembelaan terbaik Anda untuk argumen di atas (Gunakan nada logis, netral, tanpa kata-kata emosional):
                </label>
                <textarea
                  value={steelManInput}
                  onChange={(e) => setSteelManInput(e.target.value)}
                  placeholder="Meskipun membebani APBN, investasi gizi sejak dini dapat dibenarkan karena peningkatan kualitas kognitif generasi akan berdampak eksponensial pada ekonomi..."
                  rows={5}
                  className="w-full bg-[#1c1b1b] border border-outline-variant rounded-lg p-3 text-on-surface focus:border-signal outline-none transition-colors"
                ></textarea>
              </div>
              <button
                onClick={handleSteelManSubmit}
                disabled={steelManLoading || steelManInput.trim().length < 30}
                className={`w-full py-3 rounded-full font-label-sm text-label-sm font-semibold transition-all ${
                  steelManLoading || steelManInput.trim().length < 30
                    ? 'bg-surface-container-high border border-outline-variant/30 text-ground cursor-not-allowed'
                    : 'bg-gradient-signal-dark text-white hover:opacity-90 active:scale-95 shadow-lg shadow-signal/20'
                }`}
              >
                {steelManLoading ? 'AI Sedang Menganalisis Struktur Argumen...' : 'Kirim & Uji Validitas'}
              </button>
              {steelManInput.trim().length < 30 && (
                <div className="text-[11px] text-caution text-center">Argumen terlalu pendek (Min. 30 karakter)</div>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-surface-container-high p-5 rounded-lg border border-outline-variant/30">
                <div className="flex justify-between items-baseline mb-4">
                  <div className="font-headline-h4 text-headline-h4 text-clarity">Hasil Analisis Argumen</div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    steelManResult.score >= 80 ? 'bg-growth/20 text-growth' : steelManResult.score >= 50 ? 'bg-pulse/20 text-pulse' : 'bg-alert/20 text-alert'
                  }`}>
                    {steelManResult.rating}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="text-4xl font-display-h1 font-extrabold text-signal">{steelManResult.score}</span>
                  <span className="font-caption text-caption text-ground">/ 100 Skor Objektivitas</span>
                </div>

                {/* Fallacies */}
                {steelManResult.fallacies.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-alert uppercase tracking-wider mb-2 select-none">Bias/Fallacy Terdeteksi:</div>
                    <ul className="list-disc list-inside text-caption text-on-surface-variant space-y-1">
                      {steelManResult.fallacies.map((fal, i) => (
                        <li key={i} className="text-alert">{fal}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                <div>
                  <div className="text-xs font-semibold text-growth uppercase tracking-wider mb-2 select-none">Saran Penyempurnaan:</div>
                  <ul className="list-disc list-inside text-caption text-on-surface-variant space-y-1">
                    {steelManResult.suggestions.map((sug, i) => (
                      <li key={i}>{sug}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSteelManResult(null)}
                  className="px-5 py-2 bg-transparent border border-outline-variant text-on-surface hover:bg-surface-bright rounded-full font-label-sm text-label-sm"
                >
                  Latih Lagi
                </button>
                <button
                  onClick={() => setActiveExercise(null)}
                  className="px-6 py-2 bg-gradient-signal-dark text-white rounded-full font-label-sm text-label-sm"
                >
                  Kembali ke Regimen
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeExercise === 'level2' && (
        <div className="bg-abyss rounded-xl p-6 md:p-8 border-l-4 border-signal border border-outline-variant/30 shadow-2xl relative">
          <button 
            onClick={() => { setActiveExercise(null); handleResetScenario(); }}
            className="absolute top-4 right-4 text-ground hover:text-clarity transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          <div className="mb-6">
            <span className="font-label-sm text-label-sm text-signal uppercase tracking-wider font-semibold">LEVEL 2: SIMULATE (ACTIVE)</span>
            <h2 className="font-headline-h3 text-headline-h3 text-clarity mt-1">Scenario Simulator</h2>
            <p className="font-caption text-caption text-ground mt-1">Navigasi pohon dialog melawan bias kognitif Anda untuk mempertahankan kedaulatan berpikir.</p>
          </div>

          <div className="bg-surface p-5 rounded-lg border border-outline-variant/30 min-h-[120px] mb-8 relative flex items-start gap-4">
            <span className="material-symbols-outlined text-signal text-3xl">psychology</span>
            <div>
              <div className="text-[12px] font-semibold text-pulse uppercase tracking-wider mb-1 select-none">AI Agent / Keadaan:</div>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                {currentScenario.dialogue}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {currentScenario.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleScenarioChoice(opt)}
                className="w-full text-left p-4 bg-surface-container-high hover:bg-surface-bright border border-outline-variant/30 hover:border-signal/50 rounded-lg text-caption text-on-surface transition-all duration-200 active:scale-[0.99] flex items-center justify-between group"
              >
                <span>{opt.text}</span>
                <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 text-signal transition-opacity ml-2">
                  arrow_forward
                </span>
              </button>
            ))}
          </div>

          {/* XP Tracking within scenario */}
          {accumulatedXP > 0 && (
            <div className="mt-6 text-center text-xs font-code text-pulse">
              XP Terkumpul Sementara: +{accumulatedXP} XP
            </div>
          )}

          {/* Reset option for failed / successful terminals */}
          {(scenarioStep === 'fail_end' || scenarioStep === 'success_end' || scenarioStep === 'aggression_fail') && (
            <div className="mt-8 pt-4 border-t border-outline-variant/20 flex justify-center">
              <button
                onClick={handleResetScenario}
                className="px-6 py-2.5 bg-transparent border border-outline-variant text-on-surface hover:text-signal hover:border-signal rounded-full font-label-sm text-label-sm active:scale-95 transition-all"
              >
                Mulai Ulang Skenario
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Regimen Screen */}
      {!activeExercise && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Gym Overview Header */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Regimen Cards */}
            <div className="flex items-center gap-4 mb-2">
              <h2 className="font-headline-h2 text-headline-h2 text-clarity">Latihan Hari Ini</h2>
              <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
              <span className="font-label-sm text-label-sm text-ground select-none">3 Tingkatan Latihan</span>
            </div>

            <div className="space-y-4">
              {/* Level 1 Expose */}
              <div className="bg-abyss rounded-xl p-5 border border-outline-variant/30 hover:border-outline-variant transition-colors duration-300 flex flex-col md:flex-row gap-5 items-start md:items-center">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-growth border border-growth/30 flex-shrink-0 select-none">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-label-sm text-label-sm text-pulse uppercase tracking-wider font-semibold select-none">Level 1</span>
                    <h3 className="font-headline-h4 text-headline-h4 text-clarity">Expose: Steel-manning</h3>
                  </div>
                  <p className="font-caption text-caption text-ground">
                    Konstruksi argumen terkuat untuk pandangan oposisi tanpa fallacy. Melatih objektivitas kognitif.
                  </p>
                </div>
                <button
                  onClick={() => setActiveExercise('level1')}
                  className="w-full md:w-auto bg-surface text-signal border border-outline-variant px-5 py-2 rounded-full font-label-sm text-label-sm hover:border-signal transition-colors text-center cursor-pointer"
                >
                  Ulangi Latihan
                </button>
              </div>

              {/* Level 2 Simulate */}
              <div className="bg-abyss rounded-xl p-5 border-l-4 border-signal border border-outline-variant/30 shadow-lg flex flex-col md:flex-row gap-5 items-start md:items-center relative">
                <div className="absolute top-2 right-2 flex h-3 w-3 select-none pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-signal"></span>
                </div>
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-signal border border-signal/30 flex-shrink-0 select-none">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-label-sm text-label-sm text-signal uppercase tracking-wider font-semibold select-none">Level 2</span>
                    <h3 className="font-headline-h4 text-headline-h4 text-clarity">Simulate: Scenario Simulator</h3>
                  </div>
                  <p className="font-caption text-caption text-ground">
                    Navigasi skenario propaganda sosial media untuk memutus filter bubble algoritma secara mandiri.
                  </p>
                </div>
                <button
                  onClick={() => setActiveExercise('level2')}
                  className="w-full md:w-auto bg-gradient-signal-dark text-white px-5 py-2 rounded-full font-label-sm text-label-sm hover:opacity-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-signal/20 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  Mulai Latihan
                </button>
              </div>

              {/* Level 3 Discuss */}
              <div className={`bg-abyss rounded-xl p-5 border border-outline-variant/30 transition-all duration-300 flex flex-col md:flex-row gap-5 items-start md:items-center ${
                !trainProgress.exposeCompleted || !trainProgress.simulateCompleted
                  ? 'grayscale opacity-60'
                  : 'border-l-4 border-pulse shadow-lg'
              }`}>
                <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center text-outline border border-outline-variant/30 flex-shrink-0 select-none">
                  <span className="material-symbols-outlined">
                    {!trainProgress.exposeCompleted || !trainProgress.simulateCompleted ? 'lock' : 'forum'}
                  </span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold select-none">Level 3</span>
                    <h3 className="font-headline-h4 text-headline-h4 text-clarity">Discuss: Structured Debate</h3>
                  </div>
                  <p className="font-caption text-caption text-ground">
                    Debat kognitif peer-to-peer terstruktur dengan moderasi netral. Selesaikan Level 2 untuk membuka.
                  </p>
                </div>
                
                {!trainProgress.exposeCompleted || !trainProgress.simulateCompleted ? (
                  <button
                    disabled
                    className="w-full md:w-auto bg-surface-container-lowest text-outline border border-outline-variant/30 px-5 py-2 rounded-full font-label-sm text-label-sm cursor-not-allowed text-center flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                    Terkunci
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveExercise('level3')}
                    className="w-full md:w-auto bg-gradient-to-r from-pulse to-[#9a84b8] text-white px-5 py-2 rounded-full font-label-sm text-label-sm hover:brightness-105 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                    Buka Forum
                  </button>
                )}
              </div>
            </div>
            
            {/* Render Level 3 Forum if active and unlocked */}
            {activeExercise === 'level3' && (
              <div className="bg-abyss rounded-xl p-5 border border-outline-variant/30 shadow-lg mt-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4 border-b border-outline-variant/20 pb-3">
                  <h3 className="font-headline-h4 text-headline-h4 text-clarity">Forum Debat Dialektis</h3>
                  <button 
                    onClick={() => setActiveExercise(null)}
                    className="text-ground hover:text-clarity transition-colors text-xs font-label-sm"
                  >
                    Tutup Forum
                  </button>
                </div>
                
                {/* Messages ledger */}
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 mb-4">
                  {debateMessages.map(msg => (
                    <div key={msg.id} className="bg-surface p-3 rounded-lg border border-outline-variant/10">
                      <div className="flex justify-between font-caption text-[11px] text-ground mb-1">
                        <span className="font-semibold text-pulse font-code">@{msg.author}</span>
                        <span className="uppercase tracking-widest text-growth">{msg.role}</span>
                      </div>
                      <p className="font-caption text-caption text-on-surface-variant">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendDebateMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={debateInput}
                    onChange={(e) => setDebateInput(e.target.value)}
                    placeholder="Tulis sanggahan netral Anda..."
                    className="flex-grow bg-[#1c1b1b] border border-outline-variant rounded-full px-4 py-2 text-xs text-on-surface outline-none focus:border-pulse"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 bg-pulse hover:bg-[#9a84b8] text-white rounded-full text-xs font-semibold active:scale-95 transition-all"
                  >
                    Kirim
                  </button>
                </form>
                {trainProgress.discussCompleted && (
                  <div className="mt-3 text-center text-[11px] text-growth font-medium select-none">
                    Latihan selesai! Badge "Philosopher King" telah didapatkan.
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Column: User XP & Stats */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Status overview card */}
            <div className="bg-abyss rounded-xl p-5 border border-outline-variant/30 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[200px]">
              <div className="absolute inset-0 bg-gradient-to-br from-signal/5 to-transparent pointer-events-none z-0"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-surface-container-high px-3 py-1 rounded-full mb-3 select-none">
                  <span className="material-symbols-outlined text-signal text-[16px]">fitness_center</span>
                  <span className="font-label-sm text-label-sm text-signal font-semibold">Cognitive Conditioning</span>
                </div>
                <h2 className="font-display-h1-mobile text-headline-h2 text-clarity mb-1">Level {trainProgress.currentLevel}</h2>
                <p className="font-caption text-caption text-ground">Status: {trainProgress.currentLevel === 3 ? 'Kemandirian Penuh' : 'Restrukturisasi Aktif'}</p>
              </div>

              <div className="relative z-10 pt-4 mt-auto border-t border-outline-variant/20 flex justify-between items-end">
                <div>
                  <p className="font-caption text-[11px] text-ground uppercase tracking-widest">Spesialisasi</p>
                  <p className="font-label-sm text-label-sm text-clarity font-semibold">Objektivitas Logika</p>
                </div>
                <span className="text-xs font-code text-pulse font-bold select-none">Rank #42</span>
              </div>
            </div>

            {/* Gamification XP Card */}
            <div className="bg-abyss rounded-xl p-5 border border-outline-variant/30 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-lg">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pulse to-signal opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-20 h-20 rounded-full border-4 border-surface-container-high flex items-center justify-center mb-3 relative">
                {/* Circular indicator mock */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90 select-none pointer-events-none" viewBox="0 0 100 100">
                  <circle className="text-surface-container-high" cx="50" cy="50" fill="none" r="44" stroke="currentColor" strokeWidth="6"></circle>
                  <circle className="text-pulse" cx="50" cy="50" fill="none" r="44" stroke="currentColor" strokeDasharray="276" strokeDashoffset={276 - (276 * (user.totalXP % 1000)) / 1000} strokeLinecap="round" strokeWidth="6"></circle>
                </svg>
                <span className="material-symbols-outlined text-pulse text-3xl animate-bounce">bolt</span>
              </div>

              <h3 className="font-headline-h3 text-headline-h3 text-clarity mb-1 font-extrabold">
                {user.totalXP.toLocaleString()} XP
              </h3>
              <p className="font-caption text-caption text-ground font-medium">Mental Reps Selesai</p>
              
              <div className="mt-4 w-full px-2 pt-3 border-t border-outline-variant/20">
                <div className="flex justify-between font-caption text-caption text-ground mb-1.5">
                  <span>Level {Math.floor(user.totalXP / 1000)}</span>
                  <span>Lvl {Math.floor(user.totalXP / 1000) + 1} ({user.totalXP % 1000}/1000)</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div className="bg-pulse h-1.5 rounded-full" style={{ width: `${(user.totalXP % 1000) / 10}%` }}></div>
                </div>
              </div>
            </div>

          </aside>
        </div>
      )}
    </div>
  );
};

export default CriticalGym;
