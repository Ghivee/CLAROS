import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 py-8 mt-auto z-10">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-[1000px] mx-auto px-padding-mobile md:px-padding-desktop gap-4">
        {/* Brand */}
        <div className="font-headline-h4 text-headline-h4 text-on-surface">
          Claros
        </div>
        {/* Links */}
        <div className="flex space-x-6 text-caption text-ground font-caption">
          <Link to="/" className="hover:text-pulse underline decoration-pulse transition-colors">About</Link>
          <a href="#" className="hover:text-pulse underline decoration-pulse transition-colors">Tech Stack</a>
          <a href="#" className="hover:text-pulse underline decoration-pulse transition-colors">Documentation</a>
        </div>
        {/* Copyright */}
        <div className="text-caption text-ground font-caption text-center md:text-right">
          © 2026 Claros. See through the noise. Think for yourself.
        </div>
      </div>
    </footer>
  );
};
export default Footer;
