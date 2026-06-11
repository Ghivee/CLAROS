import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ResponsiveContainer } from 'recharts';
import { useAudit } from '../context/AuditContext';
import { getBenchmarkData } from '../services/dbService';
import { analyzeAuditResults } from '../services/aiService';

export const OriginMap = () => {
  const location = useLocation();
  const { audits } = useAudit();
  
  // State for current selected audit
  const [selectedAudit, setSelectedAudit] = useState(() => {
    if (audits.length > 0) {
      const highlightId = location.state?.highlightAuditId;
      return highlightId 
        ? (audits.find(a => a.auditId === highlightId) || audits[audits.length - 1])
        : audits[audits.length - 1];
    }
    return null;
  });
  
  const [selectedNode, setSelectedNode] = useState(null);
  const [showBenchmark, setShowBenchmark] = useState(false);

  if (audits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 bg-abyss border border-outline-variant/30 rounded-xl max-w-[700px] mx-auto">
        <span className="material-symbols-outlined text-signal text-5xl mb-4 animate-bounce">radar</span>
        <h2 className="font-headline-h2 text-headline-h2 text-clarity mb-2">Confidence Map Not Active</h2>
        <p className="font-body-md text-body-md text-ground max-w-[500px] mb-8">
          The Origin Map requires your belief audit data first. Please take your first Belief Audit to map your beliefs.
        </p>
        <Link to="/audit" className="px-6 py-3 bg-gradient-signal-dark text-white rounded-full font-label-sm text-label-sm shadow-lg shadow-signal/20 active:scale-95 transition-all">
          Start First Audit
        </Link>
      </div>
    );
  }

  // Retrieve details for the selected audit from LocalStorage
  const getSelectedAuditData = () => {
    if (!selectedAudit) return [];
    
    // We can fetch details or compile from saved audit if details not cached
    const allDetails = JSON.parse(localStorage.getItem('claros_audit_details')) || [];
    const auditDetails = allDetails.filter(d => d.auditId === selectedAudit.auditId);

    if (auditDetails.length > 0) {
      // Convert saved details into plot points
      return auditDetails.map((ans, idx) => {
        let minX = 10, maxX = 30;
        let sourceName = "Social Media";
        if (ans.sourceAnswer === 1) { minX = 35; maxX = 55; sourceName = "Aggregator"; }
        else if (ans.sourceAnswer === 2) { minX = 60; maxX = 80; sourceName = "Primary Source"; }
        else if (ans.sourceAnswer === 3) { minX = 85; maxX = 98; sourceName = "Peer-Reviewed"; }

        const x = minX + (idx * 2) % (maxX - minX);
        const y = (ans.confidenceAnswer - 1) * 20 + 12;

        return {
          x,
          y,
          topic: ans.topic,
          source: sourceName,
          confidence: ans.confidenceAnswer * 20,
          rawConfidence: ans.confidenceAnswer,
          lastExposure: ans.lastExposureAnswer === 1 ? "Active search" : "Passive recommendation"
        };
      });
    }

    // Fallback if details aren't stored
    return [
      { x: 20, y: 80, topic: "health", source: "Social Media", confidence: 80, rawConfidence: 4, lastExposure: "Passive" },
      { x: 30, y: 75, topic: "politics", source: "Social Media", confidence: 80, rawConfidence: 4, lastExposure: "Passive" },
      { x: 45, y: 50, topic: "tech", source: "Aggregator", confidence: 60, rawConfidence: 3, lastExposure: "Passive" },
      { x: 88, y: 92, topic: "science", source: "Peer-Reviewed", confidence: 100, rawConfidence: 5, lastExposure: "Active" },
      { x: 70, y: 40, topic: "wealth", source: "Primary Source", confidence: 40, rawConfidence: 2, lastExposure: "Active" }
    ];
  };

  const currentPoints = getSelectedAuditData();

  // Highlight specific selected node in detail panel
  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  // Auto-select first node if none is selected
  if (!selectedNode && currentPoints.length > 0) {
    setSelectedNode(currentPoints[0]);
  }

  // Get benchmark data
  const benchmark = getBenchmarkData(100 - selectedAudit.algInfluenceScore);
  
  // Benchmark mock points
  const benchmarkPoints = [
    { x: 22, y: 72, topic: "health", source: "Social Media", type: 'benchmark' },
    { x: 28, y: 64, topic: "politics", source: "Social Media", type: 'benchmark' },
    { x: 48, y: 56, topic: "tech", source: "Aggregator", type: 'benchmark' },
    { x: 65, y: 48, topic: "wealth", source: "Primary Source", type: 'benchmark' },
    { x: 85, y: 78, topic: "science", source: "Peer-Reviewed", type: 'benchmark' }
  ];

  // Custom tooltips
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (data.type === 'benchmark') {
        return (
          <div className="bg-surface-container-highest border border-outline-variant rounded p-3 shadow-xl z-20">
            <div className="text-ground font-label-sm text-label-sm mb-1 uppercase tracking-wider">Average Benchmark</div>
            <div className="font-caption text-caption text-on-surface-variant">Source: {data.source}</div>
            <div className="font-caption text-caption text-on-surface-variant">Average Confidence: {data.y}%</div>
          </div>
        );
      }
      return (
        <div className="bg-surface-container-highest border border-[#474553]/60 rounded p-3 shadow-xl z-20">
          <div className="text-clarity font-label-sm text-label-sm font-semibold capitalize mb-1">Topic: {data.topic}</div>
          <div className="font-caption text-caption text-on-surface-variant">Source: {data.source}</div>
          <div className="font-caption text-caption text-on-surface-variant">Confidence: {data.confidence}%</div>
          <div className="font-caption text-[11px] text-signal mt-1 border-t border-outline-variant/30 pt-1">{data.lastExposure}</div>
        </div>
      );
    }
    return null;
  };

  // Color coordinate function based on zones
  const getPointColor = (point) => {
    if (point.x < 40 && point.y > 60) return '#E2484A'; // Alert red (Echo chamber)
    if (point.x > 60 && point.y > 60) return '#1D9E75'; // Growth green (Verifiable)
    return '#AF9EC9'; // Pulse purple (Neutral)
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left: Origin Map Visualizer */}
      <div className="flex-grow bg-abyss rounded-xl p-6 shadow-xl border border-outline-variant/30 relative flex flex-col min-h-[500px]">
        {/* Map Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-signal text-xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>radar</span>
              <span className="font-label-sm text-label-sm text-pulse uppercase tracking-wider select-none font-semibold">LOCATE PHASE ACTIVE</span>
            </div>
            <h1 className="font-display-h1-mobile text-headline-h2 text-clarity mb-1">Origin Map</h1>
            <p className="font-caption text-caption text-ground max-w-md">Mapping the source of your belief (X) against your confidence level (Y).</p>
          </div>
          {/* Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Audit History Dropdown Selector */}
            <select
              value={selectedAudit.auditId}
              onChange={(e) => setSelectedAudit(audits.find(a => a.auditId === e.target.value))}
              className="bg-surface-container-high border border-outline-variant rounded-lg px-3 py-1.5 text-xs text-on-surface hover:border-signal outline-none transition-colors"
            >
              {audits.map(a => (
                <option key={a.auditId} value={a.auditId}>
                  Audit: {new Date(a.completedAt).toLocaleDateString('id-ID', {day:'numeric', month:'short'})} ({a.biasLevel})
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowBenchmark(!showBenchmark)}
              className={`flex items-center justify-center p-2 rounded-lg border text-xs font-label-sm transition-colors ${
                showBenchmark 
                  ? 'bg-signal/20 border-signal text-signal' 
                  : 'bg-surface-container-high border-outline-variant hover:bg-surface-bright text-ground'
              }`}
              title="Toggle Anonymous Average Benchmark"
            >
              <span className="material-symbols-outlined text-[18px]">compare</span>
            </button>
          </div>
        </div>

        {/* 2D Interactive Scatter Chart Area using Recharts */}
        <div className="flex-grow bg-surface rounded-lg relative mt-2 border border-outline-variant/30 min-h-[360px] p-2 flex flex-col justify-end">
          
          <div className="w-full h-[320px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 15, right: 15, bottom: 15, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(146, 143, 159, 0.05)" />
                
                {/* Custom X Axis (Source Quality) */}
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Source" 
                  domain={[0, 100]} 
                  ticks={[20, 45, 70, 90]}
                  tickFormatter={(val) => {
                    if (val === 20) return "Social";
                    if (val === 45) return "Aggregate";
                    if (val === 70) return "Primary";
                    if (val === 90) return "Research";
                    return "";
                  }}
                  stroke="#888780"
                  fontSize={11}
                />
                
                {/* Custom Y Axis (Confidence Level) */}
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Confidence" 
                  domain={[0, 100]} 
                  ticks={[15, 50, 85]}
                  tickFormatter={(val) => {
                    if (val === 15) return "Doubt";
                    if (val === 50) return "Moderate";
                    if (val === 85) return "Confident";
                    return "";
                  }}
                  stroke="#888780"
                  fontSize={11}
                />
                
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

                {/* Reference Area for Echo Chamber Zone (Top-Left: Low source quality, High confidence) */}
                <ReferenceArea x1={0} x2={40} y1={60} y2={100} fill="#E2484A" fillOpacity={0.06} stroke="rgba(226, 72, 74, 0.15)" strokeWidth={0.5} />
                
                {/* Reference Area for Verifiable Source Zone (Top-Right: High source quality, High confidence) */}
                <ReferenceArea x1={60} x2={100} y1={60} y2={100} fill="#1D9E75" fillOpacity={0.06} stroke="rgba(29, 158, 117, 0.15)" strokeWidth={0.5} />

                {/* User Points */}
                <Scatter 
                  name="Confidence Anda" 
                  data={currentPoints} 
                  fill="#7C6EE8"
                  onClick={handleNodeClick}
                  cursor="pointer"
                  shape={(props) => {
                    const { cx, cy, payload } = props;
                    const isSelected = selectedNode && selectedNode.topic === payload.topic && selectedNode.source === payload.source;
                    const color = getPointColor(payload);
                    const isAlert = color === '#E2484A';
                    
                    return (
                      <g className="data-point">
                        {/* Glow effect on hover/selection */}
                        <circle cx={cx} cy={cy} r={isSelected ? 10 : 8} fill={color} fillOpacity={0.3} />
                        {/* Core point */}
                        <circle cx={cx} cy={cy} r={isSelected ? 6 : 4} fill={color} stroke="#fff" strokeWidth={isSelected ? 1.5 : 0.5} className={isAlert ? 'data-point-alert' : ''} />
                      </g>
                    );
                  }}
                />

                {/* Benchmark Points */}
                {showBenchmark && (
                  <Scatter 
                    name="Benchmark" 
                    data={benchmarkPoints} 
                    fill="#888780"
                    shape={(props) => {
                      const { cx, cy } = props;
                      return (
                        <circle cx={cx} cy={cy} r={4} fill="#888780" fillOpacity={0.4} stroke="#888780" strokeWidth={1} strokeDasharray="1 1" />
                      );
                    }}
                  />
                )}
              </ScatterChart>
            </ResponsiveContainer>
            
            {/* Visual Zone Labels */}
            <div className="absolute top-4 left-16 text-alert font-caption text-[11px] uppercase tracking-wider flex items-center gap-1 opacity-70 select-none pointer-events-none">
              <span className="material-symbols-outlined text-[14px]">warning</span> Echo Chamber Zone
            </div>
            <div className="absolute top-4 right-6 text-growth font-caption text-[11px] uppercase tracking-wider flex items-center gap-1 opacity-70 select-none pointer-events-none">
              <span className="material-symbols-outlined text-[14px]">verified</span> Zona Terverifikasi
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-ground font-caption text-caption gap-2 border-t border-outline-variant/20 pt-4">
          <span className="select-none">Diperbarui: baru saja</span>
          <div className="flex items-center gap-4 select-none">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-alert"></div> Echo Chamber
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-pulse"></div> Unverified
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-growth"></div> Terverifikasi
            </div>
            {showBenchmark && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full border border-dashed border-ground/60 bg-transparent"></div> Average User
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side Panel: Algorithmic Influence Details */}
      <div className="w-full lg:w-80 flex flex-col gap-5 flex-shrink-0">
        
        {/* Algorithmic Influence Score Metric */}
        <div className="bg-abyss rounded-xl p-5 border border-outline-variant/30 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4 text-signal">
            <span className="material-symbols-outlined text-xl select-none">memory</span>
            <h3 className="font-headline-h4 text-headline-h4 text-clarity">Algorithmic Influence</h3>
          </div>
          
          <div className="flex items-baseline gap-1.5 mb-6">
            <span className={`text-5xl font-display-h1 font-extrabold ${
              selectedAudit.algInfluenceScore > 70 ? 'text-alert' : selectedAudit.algInfluenceScore > 40 ? 'text-caution' : 'text-growth'
            }`}>
              {selectedAudit.algInfluenceScore}
              <span className="text-2xl font-semibold">%</span>
            </span>
            <span className="font-caption text-caption text-ground font-medium">
              {selectedAudit.biasLevel} Distortion
            </span>
          </div>

          <div className="space-y-4">
            {/* Metric 1 */}
            <div>
              <div className="flex justify-between font-caption text-caption mb-1">
                <span className="text-on-surface-variant">Kedalaman Filter Bubble</span>
                <span className={selectedAudit.algInfluenceScore > 75 ? 'text-alert font-semibold' : 'text-ground font-medium'}>
                  {selectedAudit.algInfluenceScore > 75 ? 'Critical' : 'Moderate'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedAudit.algInfluenceScore > 70 ? 'bg-alert' : 'bg-caution'
                  }`}
                  style={{ width: `${selectedAudit.algInfluenceScore}%` }}
                ></div>
              </div>
            </div>
            {/* Metric 2 */}
            <div>
              <div className="flex justify-between font-caption text-caption mb-1">
                <span className="text-on-surface-variant">Rasio Penerimaan Pasif</span>
                <span className="text-caution font-medium">{selectedAudit.passiveScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                <div 
                  className="h-full bg-caution rounded-full transition-all duration-500" 
                  style={{ width: `${selectedAudit.passiveScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Node Details Panel */}
        {selectedNode && (
          <div className="bg-abyss rounded-xl p-5 border border-outline-variant/30 shadow-lg flex-1 flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-outline-variant/30 pb-3">
                <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider select-none font-semibold">Selected Node</h3>
                <span className="bg-signal/15 text-signal text-xs font-semibold px-2 py-0.5 rounded border border-signal/20 select-none animate-pulse">
                  Analyzing
                </span>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-label-sm uppercase tracking-wide mb-3 ${
                selectedNode.x < 40 && selectedNode.y > 60 ? 'bg-alert/10 text-alert border border-alert/20' : 
                selectedNode.x > 60 && selectedNode.y > 60 ? 'bg-growth/10 text-growth border border-growth/20' : 
                'bg-pulse/10 text-pulse border border-pulse/20'
              }`}>
                {selectedNode.x < 40 && selectedNode.y > 60 ? 'Echo Chamber Deteksi' : 
                 selectedNode.x > 60 && selectedNode.y > 60 ? 'Verifiable Node' : 'Unverified Node'}
              </span>
              <h4 className="font-headline-h3 text-headline-h4 text-clarity mb-1 font-bold capitalize">
                Topic: {selectedNode.topic}
              </h4>
              <p className="font-caption text-caption text-ground mb-4">
                Source Awal: <strong className="text-on-surface-variant">{selectedNode.source}</strong> ({selectedNode.lastExposure})
              </p>
              
              {/* Analysis recommendation alert box */}
              <div className={`p-3 rounded-md mb-6 border-l-4 ${
                selectedNode.x < 40 && selectedNode.y > 60 
                  ? 'bg-alert/5 border-alert text-alert' 
                  : 'bg-growth/5 border-growth text-growth'
              }`}>
                <div className="flex items-center gap-1.5 mb-1 text-[13px] font-semibold">
                  <span className="material-symbols-outlined text-[16px]">
                    {selectedNode.x < 40 && selectedNode.y > 60 ? 'warning' : 'done'}
                  </span>
                  Rekomendasi Tindakan
                </div>
                <p className="font-caption text-[12px] text-on-surface-variant leading-relaxed">
                  {selectedNode.x < 40 && selectedNode.y > 60 
                    ? `Your confidence is very high (${selectedNode.confidence}%) but it was obtained from passive social media exposure. Reduce conformity bias by training critical thinking in the Gym.`
                    : "Confidence Anda proporsional dengan kualitas validitas informasi primer. Pertahankan penelusuran aktif Anda."
                  }
                </p>
              </div>
            </div>

            <Link 
              to="/gym"
              className="w-full bg-transparent border border-outline-variant text-on-surface hover:text-signal hover:border-signal font-label-sm text-label-sm py-2 rounded-full transition-colors flex items-center justify-center gap-2 active:scale-95 duration-200"
            >
              <span className="material-symbols-outlined text-[18px]">fitness_center</span>
              Masuk Critical Thinking Gym
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default OriginMap;
