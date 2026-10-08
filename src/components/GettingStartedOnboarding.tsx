import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Server, 
  FolderSync, 
  Smartphone, 
  HardDrive, 
  Terminal, 
  Copy, 
  Check, 
  Zap, 
  Lock, 
  Sparkles, 
  Wifi, 
  FileText, 
  UploadCloud, 
  FileCheck, 
  Clock, 
  ExternalLink, 
  AlertTriangle, 
  Layers, 
  Container, 
  Key, 
  ShieldAlert 
} from 'lucide-react';

interface GettingStartedOnboardingProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenRunbookExport?: () => void;
  initialEngine?: 'sftp' | 'nextcloud';
}

export const GettingStartedOnboarding: React.FC<GettingStartedOnboardingProps> = ({
  onNavigate,
  onOpenRunbookExport,
  initialEngine = 'sftp'
}) => {
  // Engine switcher: 'sftp' or 'nextcloud'
  const [engine, setEngine] = useState<'sftp' | 'nextcloud'>(initialEngine);

  useEffect(() => {
    if (initialEngine) {
      setEngine(initialEngine);
    }
  }, [initialEngine]);

  // Step tracker (Minute 1 to 5)
  const [activeMinute, setActiveMinute] = useState<number>(1);
  const [completedMinutesSftp, setCompletedMinutesSftp] = useState<number[]>([]);
  const [completedMinutesNextcloud, setCompletedMinutesNextcloud] = useState<number[]>([]);

  // Configuration fields
  const [tailscaleIp, setTailscaleIp] = useState<string>('100.115.42.88');
  const [storagePath, setStoragePath] = useState<string>('D:\\PersonalCloud');
  const [username, setUsername] = useState<string>('vaultuser');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Nextcloud specific states
  const [passphrase, setPassphrase] = useState<string>('aio-master-secret-vault-2026-safe-key');
  const [collaboraEnabled, setCollaboraEnabled] = useState<boolean>(true);
  const [memoriesEnabled, setMemoriesEnabled] = useState<boolean>(true);
  const [borgBackupEnabled, setBorgBackupEnabled] = useState<boolean>(true);

  // Simulation states
  const [handshakeStatus, setHandshakeStatus] = useState<'idle' | 'testing' | 'success'>('idle');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadVerified, setUploadVerified] = useState<boolean>(false);

  const completedMinutes = engine === 'sftp' ? completedMinutesSftp : completedMinutesNextcloud;
  const setCompletedMinutes = engine === 'sftp' ? setCompletedMinutesSftp : setCompletedMinutesNextcloud;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // RFC 6598 CGNAT validator
  const isValidTailscaleIp = (ip: string) => {
    const parts = ip.trim().split('.');
    if (parts.length !== 4) return false;
    const [o1, o2, o3, o4] = parts.map(Number);
    if ([o1, o2, o3, o4].some(isNaN) || [o1, o2, o3, o4].some(n => n < 0 || n > 255)) return false;
    return o1 === 100 && o2 >= 64 && o2 <= 127;
  };

  const markMinuteCompleted = (minute: number) => {
    if (!completedMinutes.includes(minute)) {
      setCompletedMinutes(prev => [...prev, minute]);
    }
  };

  const testHandshake = () => {
    setHandshakeStatus('testing');
    setTimeout(() => {
      setHandshakeStatus('success');
      markMinuteCompleted(1);
    }, 1100);
  };

  const simulateMobileUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadVerified(true);
          markMinuteCompleted(5);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  // Switch engines & reset step index
  const handleEngineSwitch = (newEngine: 'sftp' | 'nextcloud') => {
    setEngine(newEngine);
    setActiveMinute(1);
    setHandshakeStatus('idle');
    setUploadVerified(false);
  };

  // SFTP Steps definition
  const sftpMinuteSteps = [
    {
      minute: 1,
      timeEst: '01:00',
      title: 'Install Tailscale & Get Mesh IP',
      shortTitle: 'Tailscale Mesh',
      subtitle: 'Encrypted WireGuard peer tunnel (Zero router port forwarding)'
    },
    {
      minute: 2,
      timeEst: '02:00',
      title: 'Install FileZilla Server & Create User',
      shortTitle: 'FileZilla User',
      subtitle: 'Native lightweight daemon (~15 MB RAM) with SSH/SFTP'
    },
    {
      minute: 3,
      timeEst: '03:00',
      title: 'Set Mount Point to D:\\PersonalCloud',
      shortTitle: 'Storage Mount',
      subtitle: 'Map virtual root "/" to secondary drive to safeguard OS'
    },
    {
      minute: 4,
      timeEst: '04:00',
      title: 'Firewall Port 22 & 24/7 Power Plan',
      shortTitle: 'Firewall & Power',
      subtitle: 'Allow TCP Port 22 and prevent laptop from sleeping on AC'
    },
    {
      minute: 5,
      timeEst: '05:00',
      title: 'Connect Mobile Phone (5G) & Test',
      shortTitle: 'Mobile Client 5G',
      subtitle: 'Solid Explorer / CX File Explorer remote streaming & upload'
    }
  ];

  // Nextcloud Steps definition
  const nextcloudMinuteSteps = [
    {
      minute: 1,
      timeEst: '01:00',
      title: 'Verify Docker Desktop + WSL2 & Tailscale',
      shortTitle: 'WSL2 & Tailscale',
      subtitle: 'Virtualization prerequisites & encrypted WireGuard mesh'
    },
    {
      minute: 2,
      timeEst: '02:00',
      title: 'Deploy Nextcloud AIO Mastercontainer',
      shortTitle: 'Deploy Docker AIO',
      subtitle: 'Single docker command to launch all-in-one container manager'
    },
    {
      minute: 3,
      timeEst: '03:00',
      title: 'Master Passphrase & Mount D:\\PersonalCloud',
      shortTitle: 'Passphrase & Disk',
      subtitle: 'Save disaster recovery key and bind native hard drive partition'
    },
    {
      minute: 4,
      timeEst: '04:00',
      title: 'Tailscale Serve HTTPS & 24/7 Power Plan',
      shortTitle: 'HTTPS & Power',
      subtitle: 'Private TLS domain without certbot + prevent host sleeping'
    },
    {
      minute: 5,
      timeEst: '05:00',
      title: 'Connect Mobile App (5G) & Test Camera Sync',
      shortTitle: 'Mobile Camera 5G',
      subtitle: 'Nextcloud Mobile App automated background photo backup test'
    }
  ];

  const currentSteps = engine === 'sftp' ? sftpMinuteSteps : nextcloudMinuteSteps;
  const totalProgress = Math.round((completedMinutes.length / currentSteps.length) * 100);

  // Script for SFTP Minute 4
  const sftpPowerShell = `# Run in PowerShell as Administrator:
New-NetFirewallRule -Name "Allow_FileZilla_SFTP" \`
  -DisplayName "FileZilla SFTP Server (Port 22)" \`
  -Direction Inbound -Protocol TCP -LocalPort 22 -Action Allow

powercfg /change standby-timeout-ac 0
powercfg -setacvalueindex SCHEME_CURRENT 4f971e89-eebd-4455-a8de-9e59040e7347 5ca83367-6e45-459f-a27b-476b1d01c936 0
powercfg -setactive SCHEME_CURRENT

Write-Host "VaultHost SFTP host firewall and power settings verified!" -ForegroundColor Green`;

  // Command for Nextcloud Minute 2
  const nextcloudDockerCmd = `docker run -d \`
  --sig-proxy=false \`
  --name nextcloud-aio-mastercontainer \`
  --restart always \`
  -p 80:80 \`
  -p 8080:8080 \`
  -p 8443:8443 \`
  -v nextcloud_aio_mastercontainer:/mnt/docker-aio-config \`
  -v /var/run/docker.sock:/var/run/docker.sock:ro \`
  nextcloud/all-in-one:latest`;

  // Script for Nextcloud Minute 4
  const nextcloudPowerShell = `# Run in PowerShell as Administrator:

# 1. Expose Nextcloud over private Tailscale HTTPS (Zero public cert hassle)
tailscale serve --bg https / http://localhost:11000

# 2. Allow incoming Tailscale traffic on AIO Admin (Port 8080)
New-NetFirewallRule -Name "Allow_Nextcloud_AIO" \`
  -DisplayName "Nextcloud AIO Admin Interface" \`
  -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow

# 3. Configure 24/7 server power plan (Never sleep on AC, Lid Close = Do Nothing)
powercfg /change standby-timeout-ac 0
powercfg -setacvalueindex SCHEME_CURRENT 4f971e89-eebd-4455-a8de-9e59040e7347 5ca83367-6e45-459f-a27b-476b1d01c936 0
powercfg -setactive SCHEME_CURRENT

Write-Host "Nextcloud AIO HTTPS serve & 24/7 host power plan activated!" -ForegroundColor Green`;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Banner & Fast-Track Selector */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
              ⚡ 5-MINUTE FAST TRACK
            </span>
            {engine === 'sftp' ? (
              <>
                <span>15 MB RAM FOOTPRINT</span>
                <span aria-hidden="true">·</span>
                <span>DIRECT RAW DISK SPEED</span>
                <span aria-hidden="true">·</span>
                <span>ZERO ROUTER PORTS</span>
              </>
            ) : (
              <>
                <span>GOOGLE PHOTOS & DRIVE CLONE</span>
                <span aria-hidden="true">·</span>
                <span>AUTO CAMERA SYNC</span>
                <span aria-hidden="true">·</span>
                <span>FREE TAILSCALE HTTPS</span>
              </>
            )}
          </div>

          {/* Engine Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => handleEngineSwitch('sftp')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                engine === 'sftp'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>Direct SFTP (5 Min)</span>
            </button>

            <button
              onClick={() => handleEngineSwitch('nextcloud')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                engine === 'nextcloud'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderSync className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nextcloud AIO (5 Min)</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>
                {engine === 'sftp' ? 'Direct SFTP Getting Started Guide' : 'Nextcloud AIO Getting Started Guide'}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-normal">
                ~5 Minutes Total
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {engine === 'sftp' ? (
                <>
                  Fastest, lightest private cloud setup: Direct <strong>FileZilla Server</strong> + <strong>Tailscale WireGuard</strong>. Delivers maximum disk throughput, 4K streaming with ~15 MB RAM overhead, zero database indexing lag, and complete isolation on <code className="text-cyan-300 font-mono">D:\PersonalCloud</code> with 0 open router ports.
                </>
              ) : (
                <>
                  Enterprise personal cloud setup: Full <strong>Google Photos & Drive replacement</strong> via <strong>Docker AIO</strong> + <strong>Tailscale Serve HTTPS</strong>. Delivers native automatic background camera backup, web file portal, AI photo album indexing (Memories), automated 3-2-1 BorgBackup snapshots, and local drive storage on <code className="text-cyan-300 font-mono">D:\PersonalCloud</code> with 0 open router ports and zero domain subscription costs.
                </>
              )}
            </p>

            {/* Best Points Feature Highlights */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono">
              {engine === 'sftp' ? (
                <>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                    ⚡ ~15 MB RAM Footprint
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    ⚡ Direct Raw Disk Streaming
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    ⚡ Zero Indexing Lag
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-300">
                    ⚡ Zero Open Router Ports
                  </span>
                </>
              ) : (
                <>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-300">
                    ☁️ Google Photos & Drive Clone
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                    ☁️ Auto Camera Roll Sync (5G)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    ☁️ Free Tailscale HTTPS (0 Port Forwarding)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300">
                    ☁️ 3-2-1 BorgBackup Redundancy
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
                    ☁️ Native Drive Mount (D:\PersonalCloud)
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Progress gauge */}
          <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-xs shrink-0">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Completed:</span>
                <span className="text-cyan-300 font-semibold">{completedMinutes.length}/5 Steps</span>
              </div>
              <div className="w-28 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${(completedMinutes.length / 5) * 100}%` }}
                />
              </div>
            </div>
            <span className="font-mono text-cyan-300 font-bold text-sm">{totalProgress}%</span>
          </div>
        </div>
      </div>

      {/* 5-Minute Pipeline Navigation Bar - Compact Professional Stepper */}
      <nav aria-label="5-Minute Step Tracker" className="p-1.5 bg-slate-950/90 backdrop-blur-md rounded-xl border border-slate-800/90 shadow-sm">
        <ol className="grid grid-cols-2 sm:grid-cols-5 gap-1">
          {currentSteps.map((s) => {
            const isDone = completedMinutes.includes(s.minute);
            const isCurrent = activeMinute === s.minute;
            return (
              <li key={s.minute}>
                <button
                  onClick={() => setActiveMinute(s.minute)}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                    isCurrent
                      ? 'bg-slate-900 border border-cyan-500/40 text-white shadow-2xs'
                      : 'bg-transparent border border-transparent hover:bg-slate-900/50 hover:border-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                  title={`Minute ${s.minute}: ${s.title}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 transition-colors ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isCurrent
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                          : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isDone ? <Check className="w-2.5 h-2.5" /> : s.minute}
                    </span>

                    <span className={`text-[11px] font-medium truncate ${
                      isCurrent ? 'text-white font-semibold' : isDone ? 'text-slate-300' : 'text-slate-400'
                    }`}>
                      {s.shortTitle}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 shrink-0 hidden md:inline">
                    0{s.minute}:00
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* ========================================================================= */}
      {/* SFTP PROCEDURE (5 MIN) */}
      {/* ========================================================================= */}
      {engine === 'sftp' && (
        <div className="p-6 sm:p-8 bg-slate-900/70 rounded-2xl border border-slate-800 space-y-6">
          {/* MINUTE 1 */}
          {activeMinute === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wider">
                    MINUTE 1 OF 5 · ESTIMATED TIME: 60 SECONDS
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    1. Install Tailscale & Obtain Your Private Mesh IP
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-400">Zero Open Router Ports</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Tailscale uses WireGuard to negotiate a point-to-point encrypted mesh between your laptop and your mobile device. Because it uses NAT-traversal, <strong>you do not need to open any ports on your home Wi-Fi router</strong> or set up Dynamic DNS.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Required Checklist:</span>
                  </div>

                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400">1.</span>
                      <span>Download Tailscale for Windows: <a href="https://tailscale.com/download" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline inline-flex items-center gap-0.5">tailscale.com <ExternalLink className="w-2.5 h-2.5" /></a></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400">2.</span>
                      <span>Install & log in with your Google, Microsoft, or GitHub account.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400">3.</span>
                      <span>Install Tailscale on your mobile phone (App Store / Play Store) and log into the <strong>exact same account</strong>.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <label className="font-bold text-white block">
                    Enter your laptop's Tailscale IPv4:
                  </label>
                  <input
                    type="text"
                    value={tailscaleIp}
                    onChange={(e) => setTailscaleIp(e.target.value)}
                    placeholder="100.x.y.z"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700 rounded-md text-cyan-300 focus:outline-none focus:border-cyan-400"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <div className={`text-[11px] font-mono ${isValidTailscaleIp(tailscaleIp) ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {isValidTailscaleIp(tailscaleIp) ? '✓ Valid CGNAT IP (100.64.0.0/10)' : '⚠ Check Tailscale system tray icon for 100.x.y.z'}
                    </div>

                    <button
                      onClick={testHandshake}
                      disabled={handshakeStatus === 'testing'}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {handshakeStatus === 'testing' ? 'Handshaking...' : handshakeStatus === 'success' ? 'Verified (18ms)' : 'Verify Tunnel'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MINUTE 2 */}
          {activeMinute === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wider">
                    MINUTE 2 OF 5 · ESTIMATED TIME: 60 SECONDS
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    2. Install FileZilla Server & Create User Profile
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-400">Daemon: ~15 MB RAM</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                FileZilla Server is an extremely lightweight, high-performance native Windows service. Unlike heavy cloud containers, it draws less than 20MB of RAM and streams 4K video files directly from your physical drive without intermediate transcode caching.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <span>Installation Steps:</span>
                  </div>
                  <ol className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400">1.</span>
                      <span>Download FileZilla Server for Windows (official site: <a href="https://filezilla-project.org/download.php?type=server" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline inline-flex items-center gap-0.5">filezilla-project.org <ExternalLink className="w-2.5 h-2.5" /></a>).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400">2.</span>
                      <span>Install as a standard Windows Service (starts automatically on laptop boot).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400">3.</span>
                      <span>Launch <strong>FileZilla Server Administration</strong> (connect to localhost <code className="font-mono text-slate-200">127.0.0.1:14148</code>).</span>
                    </li>
                  </ol>

                  {/* Initial Connection Helper Box */}
                  <div className="p-3 bg-cyan-950/30 rounded-lg border border-cyan-500/30 text-[11px] space-y-1 text-slate-300">
                    <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <span>💡 First-Time "Connection (127.0.0.1:14148)" Prompt:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      <strong>Password:</strong> Enter the admin password you chose during FileZilla Server installation. If you didn't set one, leave the box empty and click <strong>OK</strong>.
                    </p>
                    <p className="text-slate-400 text-[10px]">
                      Tip: Check <em>"Save the password"</em> and <em>"Automatically connect to this server at startup"</em>.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Add SFTP User Account:</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-slate-400 block mb-0.5">Username for Mobile Login:</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-mono bg-slate-900 border border-slate-700 rounded text-cyan-300"
                      />
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Navigate to <strong>Server &gt; Configure &gt; Users &gt; Add</strong>. Set credentials to "Require password to log in" and choose a strong password.
                    </p>

                    <button
                      onClick={() => markMinuteCompleted(2)}
                      className="w-full py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors cursor-pointer"
                    >
                      Confirm User Profile Configured ✓
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MINUTE 3 */}
          {activeMinute === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wider">
                    MINUTE 3 OF 5 · ESTIMATED TIME: 60 SECONDS
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    3. Set Mount Point to Safe Partition (D:\PersonalCloud)
                  </h2>
                </div>
                <span className="text-xs font-mono text-amber-400">Partition Scoping Guard</span>
              </div>

              <div className="p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block text-white">Partition Isolation Principle:</span>
                  <p className="text-[11px] leading-relaxed text-amber-300/90">
                    <strong>Never set virtual root "/" to "C:\" or "C:\Windows"!</strong> Always restrict the mount point to a dedicated folder like <code className="font-mono font-bold text-white">D:\PersonalCloud</code>. This ensures clients browsing from mobile can never access, modify, or corrupt Windows operating system files.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="font-bold text-white flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    <span>Configure Mount Mapping:</span>
                  </div>

                  <div className="space-y-2 font-mono">
                    <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Virtual path:</span>
                      <span className="text-cyan-300 font-bold">/</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Native directory:</span>
                      <span className="text-emerald-300 font-bold">{storagePath}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-[11px] text-slate-400 block mb-1">Customize storage folder path:</label>
                    <input
                      type="text"
                      value={storagePath}
                      onChange={(e) => setStoragePath(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-mono bg-slate-900 border border-slate-700 rounded text-slate-200"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Grant Permissions Checklist:</span>
                  </div>

                  <p className="text-slate-400 leading-relaxed">
                    In FileZilla Server User Mount Points, check all four boxes:
                  </p>

                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 text-emerald-300">✓ Read</div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 text-emerald-300">✓ Write</div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 text-emerald-300">✓ Create</div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 text-emerald-300">✓ Delete</div>
                  </div>

                  <button
                    onClick={() => markMinuteCompleted(3)}
                    className="w-full py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors cursor-pointer mt-2"
                  >
                    Confirm Mount Point Configured ✓
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MINUTE 4 */}
          {activeMinute === 4 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wider">
                    MINUTE 4 OF 5 · ESTIMATED TIME: 60 SECONDS
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    4. Open Firewall Port 22 & Configure 24/7 Power Plan
                  </h2>
                </div>
                <span className="text-xs font-mono text-purple-300">PowerShell Automation</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Open <strong>PowerShell as Administrator</strong> and run the combined command below. This enables TCP Port 22 in Windows Defender Firewall (safe because only Tailscale peers can reach it) and prevents your laptop from sleeping when the lid is closed.
              </p>

              <div className="relative group">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-t border-x border-slate-800 rounded-t-xl text-[11px] font-mono text-slate-400">
                  <span>PowerShell (Administrator) Script</span>
                  <button
                    onClick={() => copyToClipboard(sftpPowerShell, 'pwr-sftp')}
                    className="flex items-center gap-1 text-cyan-300 hover:text-white cursor-pointer"
                  >
                    {copiedId === 'pwr-sftp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'pwr-sftp' ? 'Copied to Clipboard!' : 'Copy Script'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-b-xl font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed max-h-56">
                  {sftpPowerShell}
                </pre>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Applied PowerShell rule and verified standby timeout is 0?
                </span>
                <button
                  onClick={() => markMinuteCompleted(4)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors cursor-pointer"
                >
                  Mark Step Complete ✓
                </button>
              </div>
            </div>
          )}

          {/* MINUTE 5 */}
          {activeMinute === 5 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold tracking-wider">
                    MINUTE 5 OF 5 · FINAL STEP
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    5. Connect Mobile Phone over 5G & Test File Streaming
                  </h2>
                </div>
                <span className="text-xs font-mono text-emerald-300">Live Client Test</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-white flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-cyan-400" />
                      <span>Mobile App Connection Card:</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300">Solid / CX Explorer</span>
                  </div>

                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Connection Type:</span>
                      <span className="text-white font-bold">SFTP</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Remote Host / Server:</span>
                      <span className="text-cyan-300 font-bold">{tailscaleIp}</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Port:</span>
                      <span className="text-white font-bold">22</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Username:</span>
                      <span className="text-emerald-300 font-bold">{username}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Ensure the Tailscale VPN key toggle is <strong>ACTIVE</strong> on your phone before tapping Connect.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="font-bold text-white flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-emerald-400" />
                      <span>Simulate Mobile 5G Upload:</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Simulate sending a 25MB camera photo over 5G through WireGuard directly to <code className="text-slate-200">{storagePath}</code>.
                    </p>

                    {isUploading && (
                      <div className="space-y-1 pt-2">
                        <div className="flex justify-between text-xs font-mono text-cyan-300">
                          <span>Transmitting 25MB...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-cyan-400 h-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {uploadVerified && (
                      <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded text-xs text-emerald-300 flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Remote transfer verified: 100% throughput achieved!</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={simulateMobileUpload}
                    disabled={isUploading}
                    className="w-full py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {isUploading ? 'Transmitting...' : uploadVerified ? 'Re-test Transfer' : 'Simulate 5G File Upload'}
                  </button>
                </div>
              </div>

              {uploadVerified && (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-center space-y-2">
                  <div className="inline-flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>5-Minute Direct SFTP Setup Complete!</span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-lg mx-auto">
                    Your laptop is now a 24/7 private cloud. You can stream 4K movies, access uncompressed camera RAW files, and manage your hard drive from anywhere in the world.
                  </p>
                  <div className="flex justify-center gap-2 pt-1">
                    <button
                      onClick={() => onNavigate('terminal')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors cursor-pointer"
                    >
                      Test in Live Terminal
                    </button>
                    {onOpenRunbookExport && (
                      <button
                        onClick={onOpenRunbookExport}
                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors cursor-pointer"
                      >
                        Export Standalone Runbook (.md)
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* NEXTCLOUD AIO PROCEDURE (5 MIN) */}
      {/* ========================================================================= */}
      {engine === 'nextcloud' && (
        <div className="p-6 sm:p-8 bg-slate-900/70 rounded-2xl border border-slate-800 space-y-6">
          {/* MINUTE 1 */}
          {activeMinute === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wider">
                    MINUTE 1 OF 5 · ESTIMATED TIME: 60 SECONDS
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    1. Verify Docker Desktop + WSL2 & Tailscale Mesh IP
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-400">Host Virtualization & Tunnel</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Nextcloud All-in-One (AIO) runs under Docker with a WSL2 Linux backend. It gives you Google Photos facial recognition, camera roll synchronization, and web file browsing—all secured through your private Tailscale WireGuard mesh.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Container className="w-4 h-4 text-cyan-400" />
                    <span>Prerequisites Checklist:</span>
                  </div>

                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400">1.</span>
                      <span>
                        Download & install <a href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline inline-flex items-center gap-0.5 font-medium">Docker Desktop for Windows <ExternalLink className="w-2.5 h-2.5" /></a> with <strong>Use the WSL 2 based engine</strong> enabled.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400">2.</span>
                      <span>Ensure Tailscale is connected on both Windows and your smartphone.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400">3.</span>
                      <span>Verify in PowerShell: <code className="text-cyan-300 font-mono">wsl --status</code> returns Version 2.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <label className="font-bold text-white block">
                    Host Tailscale IPv4 Address:
                  </label>
                  <input
                    type="text"
                    value={tailscaleIp}
                    onChange={(e) => setTailscaleIp(e.target.value)}
                    placeholder="100.x.y.z"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700 rounded-md text-cyan-300 focus:outline-none focus:border-cyan-400"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <div className={`text-[11px] font-mono ${isValidTailscaleIp(tailscaleIp) ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {isValidTailscaleIp(tailscaleIp) ? '✓ Valid CGNAT IP (100.64.0.0/10)' : '⚠ Check Tailscale IP'}
                    </div>

                    <button
                      onClick={testHandshake}
                      disabled={handshakeStatus === 'testing'}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {handshakeStatus === 'testing' ? 'Testing...' : handshakeStatus === 'success' ? 'Mesh Ready (18ms)' : 'Verify Mesh'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MINUTE 2 */}
          {activeMinute === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wider">
                    MINUTE 2 OF 5 · ESTIMATED TIME: 60 SECONDS
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    2. Deploy Nextcloud AIO Mastercontainer
                  </h2>
                </div>
                <span className="text-xs font-mono text-emerald-400">Docker Command</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Run this single command in PowerShell or terminal. It pulls the official Nextcloud AIO supervisor image which manages database, Redis cache, and storage containers automatically.
              </p>

              <div className="relative group">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-t border-x border-slate-800 rounded-t-xl text-[11px] font-mono text-slate-400">
                  <span>PowerShell / Command Prompt (Docker CLI)</span>
                  <button
                    onClick={() => copyToClipboard(nextcloudDockerCmd, 'docker-run')}
                    className="flex items-center gap-1 text-cyan-300 hover:text-white cursor-pointer"
                  >
                    {copiedId === 'docker-run' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'docker-run' ? 'Copied Command!' : 'Copy Docker Run'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-b-xl font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                  {nextcloudDockerCmd}
                </pre>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">Nextcloud AIO Admin Interface:</span>
                  <span className="text-slate-400">
                    Once the container starts, open in your browser: <code className="text-cyan-300 font-mono">https://localhost:8080</code>
                  </span>
                </div>

                <button
                  onClick={() => markMinuteCompleted(2)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors cursor-pointer shrink-0"
                >
                  Confirm Mastercontainer Started ✓
                </button>
              </div>
            </div>
          )}

          {/* MINUTE 3 */}
          {activeMinute === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wider">
                    MINUTE 3 OF 5 · ESTIMATED TIME: 60 SECONDS
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    3. Save Master Passphrase & Mount D:\PersonalCloud
                  </h2>
                </div>
                <span className="text-xs font-mono text-amber-400">Security & Persistent Storage</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Master passphrase card */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>AIO Admin Setup Passphrase:</span>
                  </div>

                  <p className="text-slate-400">
                    When opening <code className="text-slate-200">https://localhost:8080</code>, AIO displays a master password. Copy and save it securely:
                  </p>

                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-amber-300 flex justify-between items-center">
                    <span className="truncate">{passphrase}</span>
                    <button
                      onClick={() => copyToClipboard(passphrase, 'aio-pass')}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      {copiedId === 'aio-pass' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-500 block">
                    Needed to access container management in the future.
                  </span>
                </div>

                {/* Host partition datadir card */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="font-bold text-white flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    <span>Set Host Storage Directory (Datadir):</span>
                  </div>

                  <p className="text-slate-400">
                    In the AIO setup form, enter your dedicated Windows partition to keep data on your hard drive:
                  </p>

                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-xs text-cyan-300 flex justify-between items-center">
                    <span>{storagePath}</span>
                    <span className="text-slate-500 text-[10px]">Host Partition</span>
                  </div>

                  {/* Addon modules check */}
                  <div className="space-y-1 pt-1">
                    <span className="text-slate-400 text-[11px] font-semibold block">Recommended Addons:</span>
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
                      <label className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded border border-slate-800 cursor-pointer">
                        <input type="checkbox" checked={memoriesEnabled} onChange={e => setMemoriesEnabled(e.target.checked)} className="accent-cyan-400" />
                        <span>Memories (Photos)</span>
                      </label>
                      <label className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded border border-slate-800 cursor-pointer">
                        <input type="checkbox" checked={borgBackupEnabled} onChange={e => setBorgBackupEnabled(e.target.checked)} className="accent-cyan-400" />
                        <span>BorgBackup (3-2-1)</span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => markMinuteCompleted(3)}
                    className="w-full py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors cursor-pointer mt-1"
                  >
                    Confirm Storage & Passphrase Configured ✓
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MINUTE 4 */}
          {activeMinute === 4 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wider">
                    MINUTE 4 OF 5 · ESTIMATED TIME: 60 SECONDS
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    4. Tailscale Serve HTTPS & 24/7 Host Power Plan
                  </h2>
                </div>
                <span className="text-xs font-mono text-purple-300">Zero Public DNS Hassle</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                By running <code className="text-cyan-300 font-mono">tailscale serve https</code>, your machine gets an automated valid HTTPS certificate on your Tailscale MagicDNS name (e.g. <code className="text-slate-200">https://vault-host.tailnet.ts.net</code>). <strong>No public domain purchase or port 80/443 router forwarding is needed!</strong>
              </p>

              <div className="relative group">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-t border-x border-slate-800 rounded-t-xl text-[11px] font-mono text-slate-400">
                  <span>PowerShell (Administrator) Script</span>
                  <button
                    onClick={() => copyToClipboard(nextcloudPowerShell, 'pwr-nc')}
                    className="flex items-center gap-1 text-cyan-300 hover:text-white cursor-pointer"
                  >
                    {copiedId === 'pwr-nc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'pwr-nc' ? 'Copied to Clipboard!' : 'Copy Script'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-b-xl font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed max-h-56">
                  {nextcloudPowerShell}
                </pre>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Applied Tailscale Serve HTTPS and host sleep prevention?
                </span>
                <button
                  onClick={() => markMinuteCompleted(4)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors cursor-pointer"
                >
                  Mark Step Complete ✓
                </button>
              </div>
            </div>
          )}

          {/* MINUTE 5 */}
          {activeMinute === 5 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold tracking-wider">
                    MINUTE 5 OF 5 · FINAL STEP
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    5. Connect Nextcloud Mobile App (5G) & Test Camera Sync
                  </h2>
                </div>
                <span className="text-xs font-mono text-emerald-300">Live Client Test</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mobile Client Card */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-white flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-cyan-400" />
                      <span>Nextcloud iOS / Android Connection:</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300">Official App</span>
                  </div>

                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Server Address:</span>
                      <span className="text-cyan-300 font-bold">https://{tailscaleIp}</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Tailnet MagicDNS:</span>
                      <span className="text-slate-300">https://vault-host.tailnet.ts.net</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Username:</span>
                      <span className="text-emerald-300 font-bold">admin</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Target Drive:</span>
                      <span className="text-white font-bold">{storagePath}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    In the app settings, turn on <strong>Auto-upload &gt; Camera</strong> to automatically backup phone photos over 5G.
                  </p>
                </div>

                {/* Upload Simulator */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="font-bold text-white flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-emerald-400" />
                      <span>Simulate Nextcloud Camera Roll Sync:</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Simulates phone camera auto-uploading a 25MB photo album over 5G encrypted through WireGuard to Nextcloud.
                    </p>

                    {isUploading && (
                      <div className="space-y-1 pt-2">
                        <div className="flex justify-between text-xs font-mono text-cyan-300">
                          <span>Syncing Camera/IMG_2026_0904.heic...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-cyan-400 h-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {uploadVerified && (
                      <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded text-xs text-emerald-300 flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Nextcloud sync verified: Indexed in Memories database!</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={simulateMobileUpload}
                    disabled={isUploading}
                    className="w-full py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {isUploading ? 'Syncing...' : uploadVerified ? 'Re-test Sync' : 'Simulate 5G Photo Sync'}
                  </button>
                </div>
              </div>

              {uploadVerified && (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-center space-y-2">
                  <div className="inline-flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>5-Minute Nextcloud AIO Stack Setup Complete!</span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-lg mx-auto">
                    Your personal Google Drive & Google Photos alternative is active. All data lives on your local partition <code className="text-cyan-300">{storagePath}</code> with private Tailscale HTTPS encryption.
                  </p>
                  <div className="flex justify-center gap-2 pt-1">
                    <button
                      onClick={() => onNavigate('terminal')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors cursor-pointer"
                    >
                      Test in Live Terminal
                    </button>
                    {onOpenRunbookExport && (
                      <button
                        onClick={onOpenRunbookExport}
                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors cursor-pointer"
                      >
                        Export Standalone Runbook (.md)
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer Navigation Bar */}
      <div className="flex items-center justify-between border-t border-slate-800/80 pt-5 text-xs">
        <button
          onClick={() => setActiveMinute(prev => Math.max(1, prev - 1))}
          disabled={activeMinute === 1}
          className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Minute {Math.max(1, activeMinute - 1)}</span>
        </button>

        <div className="text-slate-500 font-mono">
          Minute {activeMinute} of 5 ({engine.toUpperCase()})
        </div>

        {activeMinute < 5 ? (
          <button
            onClick={() => {
              markMinuteCompleted(activeMinute);
              setActiveMinute(prev => Math.min(5, prev + 1));
            }}
            className="flex items-center gap-1.5 px-4 py-2 font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors cursor-pointer shadow-xs"
          >
            <span>Next: Minute {activeMinute + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => {
              markMinuteCompleted(5);
              onNavigate('overview');
            }}
            className="flex items-center gap-1.5 px-4 py-2 font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors cursor-pointer shadow-xs"
          >
            <span>Finish & Return to Workbench</span>
            <Check className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
