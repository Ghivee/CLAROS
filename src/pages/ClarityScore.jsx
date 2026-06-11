import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAudit } from '../context/AuditContext';

export const ClarityScore = () => {
  const { user, audits, badges } = useAudit();
  const [timeRange, setTimeRange] = useState('30D');

  if (audits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 bg-abyss border border-outline-variant/30 rounded-xl max-w-[700px] mx-auto">
        <span className="material-symbols-outlined text-signal text-5xl mb-4 animate-bounce">query_stats</span>
        <h2 className="font-headline-h2 text-headline-h2 text-clarity mb-2">Clarity Score Not Active</h2>
        <p className="font-body-md text-body-md text-ground max-w-[500px] mb-8">
          Clarity Score tracks your cognitive clarity progress historically. Please complete the Belief Audit to activate tracking.
        </p>
      </div>
    );
  }

  // Compile history chart data from audits list
  const getChartData = () => {
    // Sort audits by completion date ascending
    const sorted = [...audits].sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
    
    // Map to coordinate objects
    const dataPoints = sorted.map((a, index) => {
      const date = new Date(a.completedAt);
      const label = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      // Clarity score is calculated dynamically indbService: 100 - algInfluence*0.6 + activeScore*0.4
      const clarityVal = Math.round(100 - (a.algInfluenceScore * 0.6) + (a.activeScore * 0.4));
      
      return {
        name: label,
        score: clarityVal,
        baseline: 60 // average initial score baseline
      };
    });

    // If there is only one data point, add a dummy baseline starting point for aesthetic reasons
    if (dataPoints.length === 1) {
      return [
        { name: 'Start', score: 60, baseline: 60 },
        ...dataPoints
      ];
    }

    // Filter based on timeRange
    if (timeRange === '7D') return dataPoints.slice(-3);
    if (timeRange === '14D') return dataPoints.slice(-5);
    return dataPoints;
  };

  const chartData = getChartData();
  const currentScore = user.clarityScore || 84;
  const initialScore = audits.length > 0 
    ? Math.round(100 - (audits[0].algInfluenceScore * 0.6) + (audits[0].activeScore * 0.4)) 
    : 60;
  
  const progressDiff = currentScore - initialScore;

  const handleExportLedger = () => {
    // Compile and download a JSON ledger representation of cognitive audits
    const ledger = {
      userId: user.uid,
      userName: user.displayName,
      exportedAt: new Date().toISOString(),
      clarityScore: currentScore,
      totalAudits: audits.length,
      history: audits.map(a => ({
        completedAt: a.completedAt,
        algorithmicInfluenceScore: a.algInfluenceScore,
        activeScore: a.activeScore,
        passiveScore: a.passiveScore,
        biasLevel: a.biasLevel
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ledger, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `claros_cognitive_ledger_${user.uid}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-signal">
            <span className="material-symbols-outlined text-xl select-none">query_stats</span>
            <span className="font-label-sm text-label-sm text-pulse uppercase tracking-widest font-semibold select-none">Sustain Phase</span>
          </div>
          <h1 className="font-display-h1-mobile text-headline-h2 text-clarity">Clarity Score</h1>
          <p className="font-body-md text-ground max-w-2xl">
            Tracks your level of independent thinking and bias reduction over time. Maintain your cognitive sovereignty.
          </p>
        </div>

        {/* Current Score Panel */}
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4 min-w-[200px] border border-outline-variant/30">
          <div className="flex flex-col">
            <span className="font-caption text-caption text-ground font-medium select-none">Current Score</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display-h1 text-headline-h2 text-signal font-extrabold">{currentScore}</span>
              {progressDiff !== 0 && (
                <span className={`font-label-sm text-label-sm flex items-center gap-0.5 font-bold ${progressDiff >= 0 ? 'text-growth' : 'text-alert'}`}>
                  <span className="material-symbols-outlined text-[16px]">{progressDiff >= 0 ? 'trending_up' : 'trending_down'}</span>
                  {progressDiff >= 0 ? `+${progressDiff}` : progressDiff}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Main Chart Area */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="font-headline-h3 text-headline-h3 text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-ground text-xl select-none">show_chart</span>
              Perkembangan Kognisi
            </h2>
            {/* Time Toggle */}
            <div className="flex bg-surface-container-highest rounded-full p-1 border border-outline-variant/30 self-end sm:self-auto">
              {['7D', '14D', '30D'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-1 rounded-full font-label-sm text-label-sm transition-colors ${
                    timeRange === range
                      ? 'bg-abyss border border-outline-variant/40 text-signal font-bold'
                      : 'text-ground hover:text-on-surface'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Area Chart Card using Recharts */}
          <div className="bg-abyss rounded-xl p-2 sm:p-5 border border-outline-variant/30 relative overflow-hidden h-[380px] flex flex-col justify-end">
            <div className="w-full h-[320px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C6EE8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7C6EE8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(146, 143, 159, 0.05)" />
                  <XAxis dataKey="name" stroke="#888780" fontSize={11} />
                  <YAxis domain={[40, 100]} stroke="#888780" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#2C2C2A', borderColor: 'rgba(146, 143, 159, 0.2)', borderRadius: '8px' }}
                    labelStyle={{ color: '#F3F1FF', fontWeight: 'bold' }}
                  />
                  
                  {/* Baseline Target score path */}
                  <Area 
                    type="monotone" 
                    dataKey="baseline" 
                    stroke="rgba(136, 135, 128, 0.4)" 
                    strokeDasharray="4 4" 
                    fill="none" 
                    strokeWidth={1.5} 
                  />

                  {/* Dynamic user clarity score path */}
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#7C6EE8" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>

              {/* Floating Tooltip Label */}
              <div className="absolute top-2 right-2 bg-[#2c2c2a] border border-outline-variant px-3 py-1.5 rounded-lg shadow-lg flex flex-col z-20 select-none">
                <span className="font-code text-[10px] text-ground font-medium">Kondisi Terkini</span>
                <span className="font-headline-h4 text-headline-h4 text-signal font-extrabold">{currentScore} pts</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar Area */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Certificate Container */}
          <div className="bg-gradient-to-br from-surface-container-highest to-abyss rounded-xl p-5 border border-outline-variant/40 relative overflow-hidden group hover:border-signal/50 transition-all duration-300 shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-signal opacity-5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:opacity-10 transition-opacity"></div>
            
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-headline-h4 text-headline-h4 text-clarity flex items-center gap-1.5 font-bold">
                <span className="material-symbols-outlined text-pulse select-none" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                Cognitive Certificate
              </h3>
              <span className="bg-pulse/10 text-pulse font-code text-[10px] font-bold px-2 py-0.5 rounded border border-pulse/20 select-none">
                VERIFIED
              </span>
            </div>

            <p className="font-caption text-caption text-on-surface-variant mb-6 leading-relaxed">
              Telah mencapai <strong className="text-clarity font-semibold">Tingkat {currentScore > 80 ? '3: Autotelik' : '2: Rekonstruktif'} Otonomi Kognitif</strong> dengan mempertahankan Clarity Score di atas {currentScore > 80 ? '80' : '60'} secara konsisten.
            </p>

            <button
              onClick={handleExportLedger}
              className="w-full bg-transparent border border-outline-variant text-on-surface hover:text-signal hover:border-signal font-label-sm text-label-sm py-2.5 rounded-full transition-colors flex items-center justify-center gap-1.5 active:scale-95 duration-200"
            >
              <span className="material-symbols-outlined text-[16px] select-none">download</span>
              Ekspor Buku Besar Kognitif
            </button>
          </div>

          {/* Shift Overlay Preview */}
          <div className="bg-abyss rounded-xl border border-outline-variant/30 flex flex-col overflow-hidden shadow-lg h-full justify-between">
            <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-highest/40 select-none">
              <h3 className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-semibold">Pergeseran Peta Keyakinan</h3>
              <span className="material-symbols-outlined text-ground text-[18px]">compare</span>
            </div>

            {/* Before / After graphic mockup */}
            <div className="relative flex-grow p-4 flex items-center justify-center min-h-[160px] bg-[#171717]/80">
              
              {/* BEFORE (blurry red indicators) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20 blur-[1px] select-none pointer-events-none">
                <div className="w-12 h-12 rounded-full border border-alert absolute -ml-16 -mt-8 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-alert rounded-full"></span>
                </div>
                <div className="w-16 h-16 rounded-full border border-alert/60 absolute ml-8 mt-6 flex items-center justify-center">
                  <span className="w-1 h-1 bg-alert rounded-full"></span>
                </div>
              </div>

              {/* AFTER / NOW (clean purple/green points) */}
              <div className="absolute inset-0 flex items-center justify-center z-10 select-none pointer-events-none">
                <div className="w-10 h-10 rounded-full border border-signal absolute flex items-center justify-center bg-signal/5 shadow-[0_0_12px_rgba(124,110,232,0.15)]">
                  <span className="w-2 h-2 bg-signal rounded-full"></span>
                </div>
                <div className="w-8 h-8 rounded-full border border-tertiary absolute ml-16 -mt-8 flex items-center justify-center bg-tertiary/5">
                  <span className="w-1.5 h-1.5 bg-tertiary rounded-full"></span>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center z-20 select-none">
                <span className="bg-surface/90 backdrop-blur text-alert font-code text-[9px] px-1.5 py-0.5 rounded border border-alert/20">
                  Dulu (Bias Padat)
                </span>
                <span className="bg-surface/90 backdrop-blur text-signal font-code text-[9px] px-1.5 py-0.5 rounded border border-signal/20">
                  Kini (Objektif)
                </span>
              </div>
            </div>

            <div className="p-3 bg-surface-container-highest/40 text-center border-t border-outline-variant/20 select-none">
              <span className="font-label-sm text-label-sm text-pulse text-[11px] font-semibold">
                Stabilitas bias berkurang signifikan
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* Detailed metrics breakdown row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* Metric 1 */}
        <div className="bg-abyss rounded-xl p-5 border border-outline-variant/30 flex flex-col gap-4 growth-zone shadow-md">
          <div className="flex items-center gap-2 select-none">
            <span className="material-symbols-outlined text-growth text-[20px]">psychology</span>
            <h4 className="font-label-sm text-label-sm text-on-surface font-semibold">Cognitive Flexibility</h4>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-headline-h2 text-headline-h2 text-clarity font-extrabold">92%</span>
            <span className="font-code text-[11px] text-growth font-bold">+5% Minggu Ini</span>
          </div>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mt-1 select-none pointer-events-none">
            <div className="bg-growth h-full rounded-full" style={{ width: '92%' }}></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-abyss rounded-xl p-5 border border-outline-variant/30 flex flex-col gap-4 shadow-md">
          <div className="flex items-center gap-2 select-none">
            <span className="material-symbols-outlined text-pulse text-[20px]">filter_alt_off</span>
            <h4 className="font-label-sm text-label-sm text-on-surface font-semibold">Bias Detection Rate</h4>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-headline-h2 text-headline-h2 text-clarity font-extrabold">
              {Math.round(100 - (audits[audits.length - 1]?.algInfluenceScore || 50))}%
            </span>
            <span className="font-code text-[11px] text-ground font-medium">Kondisi Stabil</span>
          </div>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mt-1 select-none pointer-events-none">
            <div 
              className="bg-pulse h-full rounded-full transition-all duration-500" 
              style={{ width: `${100 - (audits[audits.length - 1]?.algInfluenceScore || 50)}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-abyss rounded-xl p-5 border border-outline-variant/30 flex flex-col gap-4 shadow-md relative overflow-hidden">
          <div className="flex items-center gap-2 select-none">
            <span className="material-symbols-outlined text-tertiary text-[20px]">history_edu</span>
            <h4 className="font-label-sm text-label-sm text-on-surface font-semibold">Total Audits Completed</h4>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-headline-h2 text-headline-h2 text-clarity font-extrabold">{audits.length}</span>
            <span className="font-code text-[11px] text-ground font-medium">In 30 Days</span>
          </div>
          {/* Mini history dots */}
          <div className="flex gap-1 mt-2 h-1.5 w-full select-none pointer-events-none">
            {audits.map((_, i) => (
              <div 
                key={i} 
                className="flex-grow bg-tertiary rounded-full" 
                style={{ opacity: Math.max(0.2, 1 - (audits.length - i - 1) * 0.25) }}
              ></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClarityScore;
