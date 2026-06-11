import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#131313] text-[#e5e2e1] relative overflow-hidden">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-[1000px] mx-auto bg-surface-dim main-container-shadow min-h-screen pt-8 pb-16 px-padding-mobile md:px-padding-desktop relative">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-signal opacity-5 blur-[150px] rounded-full pointer-events-none z-0"></div>
        
        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col h-full">
          {children}
        </div>
      </main>

      {/* Bottom Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
