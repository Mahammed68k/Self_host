import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { TopologyInspector } from './TopologyInspector';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Smartphone, 
  Laptop, 
  HardDrive, 
  Lock, 
  Unlock, 
  Server, 
  FolderSync,
  HelpCircle,
  Sparkles,
  Zap,
  Layers,
  ChevronRight,
  ArrowRight,
  Activity,
  Terminal,
  CheckCircle2
} from 'lucide-react';

interface ArchitectureViewProps {
  onSelectTab: (tab: ActiveTab) => void;
  onSelectOnboarding?: (engine: 'sftp' | 'nextcloud') => void;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ onSelectTab, onSelectOnboarding }) => {
  const [networkMode, setNetworkMode] = useState<'tailscale' | 'portForward'>('tailscale');

  const handleLaunchTab = (tab: ActiveTab) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    onSelectTab(tab);
  };

  return (
    <div className="space-y-12">
      {/* Hero Showcase with Engineering Asset */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono tracking-wide">
            <span>ZERO PORT FORWARDING</span>
            <span aria-hidden="true">·</span>
            <span>WIREGUARD ENCRYPTED MESH</span>
            <span aria-hidden="true">·</span>
            <span>WINDOWS 10/11 HOST</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Self-Hosted Private Cloud & Direct Storage Stack
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Transform your home PC or laptop into an enterprise-grade private cloud server accessible worldwide over 5G and Wi-Fi. 
            Bypass fragile dynamic DNS, avoid risky router port forwarding, and preserve complete data ownership on your local hard drives.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectOnboarding ? onSelectOnboarding('sftp') : onSelectTab('onboarding')}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct SFTP Getting Started (5 Min)</span>
            </button>
            <button
              onClick={() => onSelectOnboarding ? onSelectOnboarding('nextcloud') : onSelectTab('onboarding')}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nextcloud AIO Getting Started (5 Min)</span>
            </button>
          </div>
        </div>

        {/* Hero Visual Showcase Graphic with zero-broken-image fallback */}
        <div className="lg:col-span-5 relative group">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl aspect-[16/9]">
            <img
              src="/src/assets/images/server_mesh_node_1791216991425.jpg"
              alt="VaultGuide mesh server node illustration"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Subtle Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-300">
              <span className="font-mono text-cyan-300 font-semibold">100.64.0.0/10 WireGuard Mesh</span>
              <span className="font-mono text-slate-400">Zero Open Ports</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Topology Node Inspector */}
      <TopologyInspector />

      {/* Interactive Network Security Simulator */}
      <section className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Network Architecture & Security Model</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate how traffic flows from your mobile device through the encrypted WireGuard mesh vs direct exposure.
            </p>
          </div>

          {/* Interactive Mode Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setNetworkMode('tailscale')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                networkMode === 'tailscale'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Tailscale Mesh (Safe)</span>
            </button>
            <button
              onClick={() => setNetworkMode('portForward')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                networkMode === 'portForward'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Port Forwarding (Vulnerable)</span>
            </button>
          </div>
        </div>

        {/* Visual Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center py-4">
          {/* Node 1: Mobile Phone */}
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300">
              <Smartphone className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Mobile Device</div>
              <div className="text-xs text-slate-400">5G Cellular / Remote Wi-Fi</div>
            </div>
            <div className="text-[11px] font-mono text-cyan-300/80 pt-1">
              {networkMode === 'tailscale' ? 'Node: 100.x.y.z' : 'IP: Dynamic Cell'}
            </div>
          </div>

          {/* Node 2: Network Gateway / Tunnel */}
          <div className={`p-4 rounded-lg border text-center space-y-2 transition-all ${
            networkMode === 'tailscale'
              ? 'bg-cyan-950/20 border-cyan-500/30 text-cyan-200'
              : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
          }`}>
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-900 border flex items-center justify-center">
              {networkMode === 'tailscale' ? (
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                {networkMode === 'tailscale' ? 'Tailscale Mesh Node' : 'Public Router Gateway'}
              </div>
              <div className="text-xs text-slate-400">
                {networkMode === 'tailscale' ? 'WireGuard 256-bit Tunnel' : 'Exposed Port Forwarding'}
              </div>
            </div>
            <div className="text-[11px] font-mono pt-1">
              {networkMode === 'tailscale' ? 'Ports Open: 0 (Closed)' : 'Ports Open: 22, 8080 (Scannable)'}
            </div>
          </div>

          {/* Node 3: Laptop Server */}
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300">
              <Laptop className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Host Laptop Server</div>
              <div className="text-xs text-slate-400">Windows 10/11 Host Machine</div>
            </div>
            <div className="text-[11px] font-mono text-amber-300/80 pt-1">
              Power: Always On / Plugged
            </div>
          </div>

          {/* Node 4: Target Storage */}
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300">
              <HardDrive className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Local Drive Partition</div>
              <div className="text-xs text-slate-400">D:\PersonalCloud (500GB)</div>
            </div>
            <div className="text-[11px] font-mono text-emerald-300/80 pt-1">
              Read / Write / Delete
            </div>
          </div>
        </div>
      </section>

      {/* 3 Primary Action Simulators & Workbenches */}
      <section className="p-6 sm:p-8 bg-slate-900/60 rounded-xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-semibold tracking-wider uppercase text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">
                Operational Workbenches
              </span>
              <span className="text-xs text-slate-400 font-mono">3 Interactive Tools</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Operations, Resilience & Interactive Simulators
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Directly simulate backup disaster recovery pipelines, validate your Tailscale CGNAT mesh network, or run interactive live console commands.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Action 1: Resilience & Recovery */}
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 hover:border-cyan-500/50 flex flex-col justify-between transition-all duration-200 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <FolderSync className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-semibold">
                  3-2-1 Strategy
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Resilience & Recovery
                </h3>
                <p className="text-xs font-mono text-cyan-400/80 mt-0.5">
                  3-2-1 Backup Simulator
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Test automated BorgBackup client-side encrypted repository deduplication, local disk mirroring, and offsite cloud sync with instant RPO/RTO calculation.
              </p>

              <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>3 Copies · 2 Media · 1 Cloud</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Borg + Rclone Pipeline</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleLaunchTab('backup')}
              className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <span>Launch Resilience & Recovery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action 2: Network & Diagnostics Workbench */}
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 hover:border-emerald-500/50 flex flex-col justify-between transition-all duration-200 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Diagnostics & Validation
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Network & Diagnostics Workbench
                </h3>
                <p className="text-xs font-mono text-emerald-400/80 mt-0.5">
                  Diagnostics & Validation
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Inspect 100.64.0.0/10 CGNAT carrier address spaces, validate Tailscale peer handshake state, test Windows Firewall port binding, and fix untrusted domain errors.
              </p>

              <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>RFC 6598 CGNAT Verifier</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Port Binding & TLS Inspection</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleLaunchTab('diagnostics')}
              className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-400/60 rounded-lg transition-colors cursor-pointer"
            >
              <span>Open Diagnostics Workbench</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action 3: Interactive Console Simulator */}
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 hover:border-purple-500/50 flex flex-col justify-between transition-all duration-200 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30 font-semibold">
                  Live Terminal
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  Interactive Console Simulator
                </h3>
                <p className="text-xs font-mono text-purple-400/80 mt-0.5">
                  Live Terminal & CLI Sandbox
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Run live command executions in an interactive terminal environment. Test Tailscale CLI ping, Docker AIO container management, robocopy, and powercfg scripts.
              </p>

              <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Interactive Shell & History</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Tailscale & Docker Simulation</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleLaunchTab('terminal')}
              className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-purple-400/60 rounded-lg transition-colors cursor-pointer"
            >
              <span>Launch Live Terminal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
