import React, { useState, useEffect } from 'react';
import { ActiveTab, AppTheme } from './types';
import { ArchitectureView } from './components/ArchitectureView';
import { BackupSimulatorView } from './components/BackupSimulatorView';
import { DiagnosticsView } from './components/DiagnosticsView';
import { InteractiveTerminal } from './components/InteractiveTerminal';
import { GettingStartedOnboarding } from './components/GettingStartedOnboarding';
import { CommandPalette } from './components/CommandPalette';
import { Footer } from './components/Footer';
import { TermsPoliciesModal } from './components/TermsPoliciesModal';
import IntroScreen from './components/IntroScreen';
import { Shield, ArrowLeft, Sun, Moon } from 'lucide-react';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('vaulthost-theme');
    return saved === 'light' ? 'light' : 'dark';
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [onboardingEngine, setOnboardingEngine] = useState<'sftp' | 'nextcloud'>('sftp');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [termsInitialTab, setTermsInitialTab] = useState<'terms' | 'privacy' | 'security'>('terms');

  useEffect(() => {
    document.documentElement.classList.remove('theme-midnight');
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
    localStorage.setItem('vaulthost-theme', theme);
  }, [theme]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev: AppTheme) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSelectOnboarding = (engine: 'sftp' | 'nextcloud') => {
    setOnboardingEngine(engine);
    setActiveTab('onboarding');
  };

  const handleOpenTerms = (tab: 'terms' | 'privacy' | 'security' = 'terms') => {
    setTermsInitialTab(tab);
    setIsTermsOpen(true);
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300 transition-colors duration-200 ${
      theme === 'light' ? 'theme-light' : ''
    }`}>
      {/* Cinematic Intro Splash Screen */}
      {showIntro && (
        <IntroScreen onComplete={() => setShowIntro(false)} />
      )}

      {/* Sleek Minimal Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/90 transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              VaultGuide
            </span>
          </button>

          {activeTab !== 'overview' && (
            <button
              onClick={() => setActiveTab('overview')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-md transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Overview</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md border transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 shadow-xs'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title={theme === 'light' ? 'Switch to Dark mode' : 'Switch to Light mode'}
            aria-label="Toggle theme mode"
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-semibold text-[11px]">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-[11px]">Dark</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Viewport Content Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'overview' && (
          <ArchitectureView 
            onSelectTab={setActiveTab} 
            onSelectOnboarding={handleSelectOnboarding}
          />
        )}

        {activeTab === 'onboarding' && (
          <GettingStartedOnboarding 
            onNavigate={setActiveTab} 
            initialEngine={onboardingEngine}
          />
        )}

        {activeTab === 'backup' && (
          <BackupSimulatorView />
        )}

        {activeTab === 'terminal' && (
          <InteractiveTerminal />
        )}

        {activeTab === 'diagnostics' && (
          <DiagnosticsView />
        )}
      </main>

      {/* Global Application Footer */}
      <Footer 
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenTerms={handleOpenTerms}
      />

      {/* Modals & Overlays */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      <TermsPoliciesModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        initialTab={termsInitialTab}
      />
    </div>
  );
}
