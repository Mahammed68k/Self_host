import React, { useState } from 'react';
import { X, ShieldCheck, Scale, FileText, Check, Copy, ExternalLink, Lock, EyeOff, Server, HardDrive, AlertCircle } from 'lucide-react';

interface TermsPoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy' | 'security';
}

export const TermsPoliciesModal: React.FC<TermsPoliciesModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'terms'
}) => {
  const [activeDoc, setActiveDoc] = useState<'terms' | 'privacy' | 'security'>(initialTab);
  const [copied, setCopied] = useState<boolean>(false);

  // Sync initialTab when opened
  React.useEffect(() => {
    setActiveDoc(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 id="terms-modal-title" className="text-base font-bold text-white tracking-tight">
                VaultHost Compliance, Terms & Policies
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Self-hosted infrastructure guidelines, zero-telemetry commitment, and privacy rights.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-6 py-3 border-b border-slate-800 bg-slate-900/80 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveDoc('terms')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeDoc === 'terms'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => setActiveDoc('privacy')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeDoc === 'privacy'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Privacy & Telemetry Policy</span>
          </button>

          <button
            onClick={() => setActiveDoc('security')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeDoc === 'security'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security & Data Sovereignty</span>
          </button>
        </div>

        {/* Document Content Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed bg-slate-950/40 selection:bg-cyan-500/20 selection:text-cyan-300">
          {activeDoc === 'terms' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-sm">Self-Hosted Architecture Agreement</h3>
                  <p className="text-slate-400 mt-1">
                    Last updated: October 2026. VaultHost is an open-source deployment framework and operations runbook for self-hosted private cloud instances running on Windows 10/11 hosts.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-white">1. Physical Host Machine & Power Management</h4>
                <p>
                  You (the Operator) maintain full operational responsibility for the host hardware (PC/laptop), thermal stability, uninterruptible power supplies (UPS), and Windows power configuration. The provided <code className="text-cyan-300 font-mono">powercfg</code> scripts ensure 24/7 server responsiveness when plugged into AC power. Operators must verify appropriate laptop ventilation and thermal dissipation.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-white">2. Absolute Data Sovereignty & Partition Ownership</h4>
                <p>
                  All files, personal photos, databases, documents, and credentials stored on <code className="text-cyan-300 font-mono">D:\PersonalCloud</code> or equivalent local partitions remain the 100% exclusive property of the Operator. VaultHost has no backdoors, proprietary licensing restrictions, escrow keys, or access privileges to your data.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-white">3. Third-Party Software & Open-Source Licenses</h4>
                <p>
                  VaultHost orchestrates established third-party open-source software, including:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-400">
                  <li><strong>Tailscale:</strong> Governed by the Tailscale terms and BSD-3-Clause WireGuard implementations.</li>
                  <li><strong>Nextcloud AIO:</strong> Licensed under GNU Affero General Public License v3.0 (AGPLv3).</li>
                  <li><strong>FileZilla Server:</strong> Licensed under GNU General Public License v2 (GPLv2).</li>
                  <li><strong>Docker Desktop & WSL2:</strong> Subject to Docker subscription and Microsoft WSL terms.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-white">4. 3-2-1 Backup & Disaster Recovery Disclaimer</h4>
                <p>
                  While VaultHost configures resilient local snapshotting and automated Rclone offsite sync, no filesystem is immune to hardware wear, power surges, or mechanical drive failures. The Operator is strongly advised to maintain the 3-2-1 backup pipeline (3 copies of data, across 2 different storage media, with 1 offsite encrypted snapshot).
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-white">5. Limitation of Liability</h4>
                <p>
                  VaultHost and its contributors shall not be held liable for accidental data loss, hardware malfunctions, ISP network disruptions, or unauthorized access resulting from operator misconfigurations (e.g., manually opening public router ports).
                </p>
              </section>
            </div>
          )}

          {activeDoc === 'privacy' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-sm">Strict Zero-Telemetry Privacy Policy</h3>
                  <p className="text-slate-400 mt-1">
                    Your personal cloud, your rules. We collect zero analytics, zero logs, zero file metadata, and zero personal credentials.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-white">1. No Central Servers & No Telemetry</h4>
                <p>
                  VaultHost contains no tracking beacons, Google Analytics, telemetry pingbacks, or diagnostic phone-homes. When you browse files, stream videos, or upload camera photos over your 5G device, all traffic travels strictly point-to-point via WireGuard encryption directly to your home laptop.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-white">2. End-to-End Cryptographic Tunneling</h4>
                <p>
                  Traffic between your mobile device and your home server is protected with modern 256-bit WireGuard encryption (ChaCha20-Poly1305 authenticated cipher). Even if you connect through untrusted public Wi-Fi or cellular networks, intermediate routers and ISPs cannot inspect your filenames, photos, or data payloads.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-white">3. Local Credentials Storage</h4>
                <p>
                  All authentication details (SFTP server passwords, Nextcloud AIO administrative tokens, Docker container secrets) are generated and stored strictly on your local machine. No credentials ever pass through external servers.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-white">4. Client Device Storage & Cookies</h4>
                <p>
                  This web application stores your selected preferences (such as your chosen theme—Dark vs. Light Mode) in your browser’s local storage (<code className="text-cyan-300 font-mono">localStorage</code>). No advertising cookies or cross-site identifiers are ever placed on your device.
                </p>
              </section>
            </div>
          )}

          {activeDoc === 'security' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-sm">Network Security & Hardening Model</h3>
                  <p className="text-slate-400 mt-1">
                    Technical overview of how VaultHost achieves enterprise security without exposing public router ports.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-white">1. Zero Port Forwarding Principle</h4>
                <p>
                  Traditional self-hosting requires opening router ports 22, 80, or 443 to the open web, exposing your home network to automated bot scans, DDoS attacks, and dictionary brute-force exploits. VaultHost operates exclusively via encrypted Tailscale WireGuard mesh tunnels, leaving <strong>0 inbound listening ports on your router</strong>.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-white">2. Windows Defender Firewall Segmentation</h4>
                <p>
                  The provided automated PowerShell setup scripts bind inbound TCP rules explicitly to local ports and verify that only authenticated Tailscale virtual adapters (<code className="text-cyan-300 font-mono">100.64.0.0/10</code>) can establish socket connections.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-white">3. Automatic HTTPS via Tailscale Serve</h4>
                <p>
                  Nextcloud AIO traffic is served with automated Let's Encrypt TLS certificates provisioned directly by Tailscale MagicDNS. This delivers green padlock HTTPS in mobile browsers without purchasing custom domain names or exposing web ports to ACME challenges.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-950 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-Telemetry · 100% Data Sovereignty Verified</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyText(`VaultHost ${activeDoc === 'terms' ? 'Terms of Service' : activeDoc === 'privacy' ? 'Privacy Policy' : 'Security Model'} - Verified October 2026. Zero Telemetry, 100% Local Storage Sovereignty.`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
