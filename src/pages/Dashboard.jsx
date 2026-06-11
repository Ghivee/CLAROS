import React from 'react';
import { Link } from 'react-router-dom';
import { useAudit } from '../context/AuditContext';

export const Dashboard = () => {
  const { user, audits } = useAudit();

  const hasTakenAudit = audits.length > 0;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center mt-12 mb-24">
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-outline-variant bg-surface-container-high text-pulse font-label-sm text-label-sm mb-6 select-none animate-pulse">
          <span className="material-symbols-outlined text-[16px] mr-2">psychiatry</span>
          Cognitive Sovereignty Platform
        </div>
        <h1 className="font-display-h1-mobile md:font-display-h1 text-display-h1-mobile md:text-display-h1 text-clarity mb-6 max-w-[800px] leading-tight select-none">
          You think you formed your own opinions.
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[600px] mb-8">
          <strong className="text-signal font-semibold">52%</strong> of the beliefs you hold today were not actively chosen. Track your cognitive biases, unravel hidden linguistic layers, and reclaim your sovereignty of thought.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/audit"
            className="px-8 py-4 bg-gradient-signal-dark rounded-full text-white font-headline-h4 text-headline-h4 hover:shadow-[0_0_20px_rgba(124,110,232,0.4)] active:scale-95 transition-all duration-300 flex items-center group shadow-lg"
          >
            {hasTakenAudit ? 'Retake Audit' : 'Start Your Belief Audit'}
            <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
          {hasTakenAudit && (
            <Link
              to="/map"
              className="px-8 py-4 bg-transparent border border-outline rounded-full text-on-surface font-headline-h4 text-headline-h4 hover:border-signal hover:text-signal transition-all duration-300"
            >
              View Your Origin Map
            </Link>
          )}
        </div>
      </section>

      {/* Feature Bento Grid (Meanings & Layers) */}
      <section className="mb-24">
        <div className="flex items-center justify-between mb-6 border-b border-outline-variant pb-2">
          <h2 className="font-headline-h3 text-headline-h3 text-clarity">Linguistic Deconstruction</h2>
          <span className="font-label-sm text-label-sm text-ground uppercase tracking-wider select-none">Analysis Engine</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Latin Card */}
          <div className="bg-abyss p-5 rounded-xl border border-surface-container-highest hover:bg-[#20201f] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-surface-bright rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center mb-4 text-pulse">
              <span className="material-symbols-outlined">history_edu</span>
            </div>
            <h3 className="font-headline-h4 text-headline-h4 text-clarity mb-1">Latin Etymology (Clarus)</h3>
            <p className="font-caption text-caption text-on-surface-variant mb-4">
              Trace the etymological roots of your core concepts. Discover the literal meaning before historical and social media distortion.
            </p>
            <div className="inline-flex px-2 py-1 bg-surface rounded-full text-signal font-code text-code text-[12px] border border-outline-variant">
              Root Extraction
            </div>
          </div>
          {/* Spanish Card */}
          <div className="bg-abyss p-5 rounded-xl border border-surface-container-highest hover:bg-[#20201f] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-surface-bright rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center mb-4 text-pulse">
              <span className="material-symbols-outlined">translate</span>
            </div>
            <h3 className="font-headline-h4 text-headline-h4 text-clarity mb-1">Cultural Context (Claro)</h3>
            <p className="font-caption text-caption text-on-surface-variant mb-4">
              Test semantic shifts across language boundaries. Uncover hidden biases passed down by western media culture.
            </p>
            <div className="inline-flex px-2 py-1 bg-surface rounded-full text-signal font-code text-code text-[12px] border border-outline-variant">
              Cross-Lingual Map
            </div>
          </div>
          {/* Hidden Layer Card */}
          <div className="bg-abyss p-5 rounded-xl border border-surface-container-highest hover:bg-[#20201f] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-surface-bright rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center mb-4 text-pulse">
              <span className="material-symbols-outlined">layers</span>
            </div>
            <h3 className="font-headline-h4 text-headline-h4 text-clarity mb-1">The Hidden Layer</h3>
            <p className="font-caption text-caption text-on-surface-variant mb-4">
              Dissect implicit assumptions and unspoken connotations deeply embedded in your daily opinion-forming vocabulary.
            </p>
            <div className="inline-flex px-2 py-1 bg-surface rounded-full text-signal font-code text-code text-[12px] border border-outline-variant">
              Subtext Scanner
            </div>
          </div>
          {/* Contrast Card */}
          <div className="bg-abyss p-5 rounded-xl border border-surface-container-highest hover:bg-[#20201f] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-surface-bright rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center mb-4 text-pulse">
              <span className="material-symbols-outlined">contrast</span>
            </div>
            <h3 className="font-headline-h4 text-headline-h4 text-clarity mb-1">Contrast Meanings</h3>
            <p className="font-caption text-caption text-on-surface-variant mb-4">
              Test the resilience of your arguments by confronting them directly with extreme dialectically generated antitheses.
            </p>
            <div className="inline-flex px-2 py-1 bg-surface rounded-full text-signal font-code text-code text-[12px] border border-outline-variant">
              Dialectic Engine
            </div>
          </div>
        </div>
      </section>

      {/* CLAROS Acronym / Phases Section */}
      <section className="mb-12 relative">
        <div className="text-center mb-10">
          <h2 className="font-headline-h2 text-headline-h2 text-clarity mb-2">C.L.A.R.O.S Methodology</h2>
          <p className="font-body-md text-body-md text-ground">A process of deconstruction and reconstruction of your cognitive sovereignty.</p>
        </div>
        <div className="flex flex-col space-y-4">
          {/* C */}
          <div className="flex items-start p-5 bg-abyss rounded-lg border border-outline-variant/30 hover:border-outline-variant transition-colors">
            <div className="font-display-h1 text-display-h1 text-signal opacity-30 mr-6 leading-none w-16 text-center select-none">C</div>
            <div>
              <h4 className="font-headline-h4 text-headline-h4 text-clarity mb-1">Confront (BeliefAudit)</h4>
              <p className="font-caption text-caption text-on-surface-variant">Audit 15 reflective questions to inventory your cognitive beliefs without judgment.</p>
            </div>
          </div>
          
          {/* L & A */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start p-5 bg-abyss rounded-lg border border-outline-variant/30 hover:border-outline-variant transition-colors">
              <div className="font-display-h1 text-display-h1 text-pulse opacity-30 mr-6 leading-none w-16 text-center select-none">L</div>
              <div>
                <h4 className="font-headline-h4 text-headline-h4 text-clarity mb-1">Locate (Origin Map)</h4>
                <p className="font-caption text-caption text-on-surface-variant">Track and plot your beliefs on a 2D map: origin of information vs. your confidence level.</p>
              </div>
            </div>
            <div className="flex items-start p-5 bg-abyss rounded-lg border border-outline-variant/30 hover:border-outline-variant transition-colors">
              <div className="font-display-h1 text-display-h1 text-pulse opacity-30 mr-6 leading-none w-16 text-center select-none">A</div>
              <div>
                <h4 className="font-headline-h4 text-headline-h4 text-clarity mb-1">Analyze + Rewire (Gym)</h4>
                <p className="font-caption text-caption text-on-surface-variant">Test your reasoning resilience through steel-manning exercises and bias scenario simulations.</p>
              </div>
            </div>
          </div>

          {/* R */}
          <div className="flex items-start p-5 bg-abyss rounded-lg border-l-4 border-signal bg-opacity-80">
            <div className="font-display-h1 text-display-h1 text-signal opacity-80 mr-6 leading-none w-16 text-center select-none">R</div>
            <div>
              <h4 className="font-headline-h4 text-headline-h4 text-clarity mb-1">Rewire (Active Gymnasium)</h4>
              <p className="font-caption text-caption text-on-surface-variant">Inflection Point. Reconstruct your mindset and develop arguments using concepts that passed active validation.</p>
              <div className="mt-2 inline-flex items-center text-[12px] font-label-sm text-pulse uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-pulse mr-2 animate-pulse"></span> Active Phase
              </div>
            </div>
          </div>

          {/* O & S */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start p-5 bg-abyss rounded-lg border border-outline-variant/30 hover:border-outline-variant transition-colors">
              <div className="font-display-h1 text-display-h1 text-ground opacity-20 mr-6 leading-none w-16 text-center select-none">O</div>
              <div>
                <h4 className="font-headline-h4 text-headline-h4 text-clarity mb-1">Own (Clarity Score)</h4>
                <p className="font-caption text-caption text-on-surface-variant">View the progression of your clarity of thought quantitatively through an integrated clarity score.</p>
              </div>
            </div>
            <div className="flex items-start p-5 bg-abyss rounded-lg border border-outline-variant/30 hover:border-outline-variant transition-colors">
              <div className="font-display-h1 text-display-h1 text-ground opacity-20 mr-6 leading-none w-16 text-center select-none">S</div>
              <div>
                <h4 className="font-headline-h4 text-headline-h4 text-clarity mb-1">Sustain (Progress Ledger)</h4>
                <p className="font-caption text-caption text-on-surface-variant">Perform scheduled re-audits after 7, 14, and 30 days to test the stability of your cognitive shift.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
