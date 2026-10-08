import React from 'react';
import { ActiveTab } from '../types';

interface FooterProps {
  onNavigate?: (tab: ActiveTab) => void;
  onOpenTerms: (tab?: 'terms' | 'privacy' | 'security') => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenTerms 
}) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-md mt-16 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span>© 2026 VaultHost Project · All Rights Reserved</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-cyan-400/90">Open Architecture</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenTerms('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onOpenTerms('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onOpenTerms('security')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Security
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
