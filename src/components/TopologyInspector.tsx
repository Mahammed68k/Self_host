import React, { useState } from 'react';
import { Smartphone, Shield, Laptop, Server, HardDrive, Cloud, Layers, ChevronRight, Lock } from 'lucide-react';

export const TopologyInspector: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string>('tailscale');

  const nodes = [
    {
      id: 'mobile',
      label: 'Mobile Client (5G)',
      sub: 'Solid / CX / Nextcloud App',
      icon: Smartphone,
      details: {
        title: 'Mobile Client Device (Remote Node)',
        description: 'Connects over cellular 5G or foreign Wi-Fi with Tailscale active. WireGuard tunnel routes directly to your host machine.',
        protocol: 'WireGuard / ChaCha20-Poly1305 (256-bit)',
        mtu: '1280 bytes (MSS clamped)',
        portExposure: 'Zero inbound listening ports on phone',
        apps: 'Solid Explorer, CX File Explorer, Nextcloud Android/iOS'
      }
    },
    {
      id: 'tailscale',
      label: 'Tailscale Mesh VPN',
      sub: 'WireGuard Overlay Network',
      icon: Shield,
      details: {
        title: 'Tailscale Encrypted Mesh Overlay',
        description: 'Traverses NAT and dynamic ISP home IPs via STUN/DERP. Router firewall keeps all public inbound ports completely closed.',
        protocol: 'WireGuard UDP (Point-to-point mesh)',
        ipRange: '100.64.0.0/10 (RFC 6598 CGNAT Space)',
        security: 'Zero Trust Network Architecture (ZTNA), MagicDNS TLS',
        portExposure: 'All public router ports remain 100% closed'
      }
    },
    {
      id: 'host',
      label: 'Host Laptop Server',
      sub: 'Windows 11 / 10 Machine',
      icon: Laptop,
      details: {
        title: 'Host Machine & Windows OS Environment',
        description: 'Runs native Windows services and Docker virtualization with power settings configured for 24/7 continuous operation without sleeping.',
        powerState: 'AC Standby: NEVER / Lid Action: DO NOTHING',
        osServices: 'FileZilla Server Service + Docker Desktop (WSL2)',
        firewall: 'Windows Defender Inbound Rule (TCP 22 / 8080 / 443)',
        ramAllocation: '15 MB (SFTP only) to ~2 GB (Nextcloud Docker)'
      }
    },
    {
      id: 'sftpService',
      label: 'FileZilla SFTP Service',
      sub: 'Port 22 Native Daemon',
      icon: Server,
      details: {
        title: 'FileZilla Server (SSH / SFTP Protocol)',
        description: 'High performance native daemon mapping virtual root "/" to physical partitions (e.g. D:\\) with zero intermediate database overhead.',
        port: 'TCP 22 (SSH File Transfer Protocol)',
        resourceProfile: 'Extremely lightweight (~12–20 MB RAM)',
        scopeGuard: 'Safeguards C:\\Windows by restricting mount point to D:\\',
        bestFor: 'High-speed 4K media streaming and direct raw disk transfers'
      }
    },
    {
      id: 'dockerAio',
      label: 'Nextcloud AIO Stack',
      sub: 'Containerized Cloud Engine',
      icon: Layers,
      details: {
        title: 'Nextcloud All-in-One Containerized Stack',
        description: 'Orchestrated container group: Apache web server, PostgreSQL database, Redis caching, Imaginary preview generation, and Notify-Push websockets.',
        ports: '80 (HTTP), 8080 (Master Setup), 443 (Tailscale HTTPS Serve)',
        features: 'Automated background mobile photo upload, web office, public shares',
        fileIndexing: 'Transactional PostgreSQL catalog (synced with occ files:scan)'
      }
    },
    {
      id: 'backupStorage',
      label: '3-2-1 Backup Engine',
      sub: 'BorgBackup + Rclone Cloud',
      icon: Cloud,
      details: {
        title: 'Automated 3-2-1 Backup Pipeline',
        description: 'Local deduplicated Borg snapshots written nightly to USB Drive E:\\, then synchronized offsite to Backblaze B2 / AWS S3 via Rclone PowerShell task at 4:00 AM.',
        localEngine: 'BorgBackup (Client-side AES-256 deduplicated chunking)',
        offsiteEngine: 'Rclone multi-thread sync with transcript logging',
        resilience: 'Immune to host drive failure, accidental deletion, and ransomware'
      }
    }
  ];

  const activeNode = nodes.find(n => n.id === selectedNode) || nodes[1];
  const ActiveIcon = activeNode.icon;

  return (
    <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-800 space-y-6 shadow-xs">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" />
          <span>Interactive Component Inspector</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Select any node in the stack to inspect its protocols, port exposure, and security boundaries.
        </p>
      </div>

      {/* Nodes Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {nodes.map((node) => {
          const isSelected = selectedNode === node.id;
          const NodeIcon = node.icon;
          return (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-2xs'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="space-y-2">
                <NodeIcon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                <div>
                  <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {node.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate font-mono">
                    {node.sub}
                  </div>
                </div>
              </div>

              <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] font-mono ${
                isSelected ? 'border-cyan-500/30 text-cyan-300 font-semibold' : 'border-slate-800/80 text-slate-400'
              }`}>
                <span>{isSelected ? 'Viewing' : 'Inspect'}</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Node Details Box */}
      <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-cyan-400 shadow-2xs">
              <ActiveIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{activeNode.details.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl leading-relaxed">{activeNode.details.description}</p>
            </div>
          </div>

          <div className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-[11px] font-mono text-cyan-300 font-semibold shrink-0">
            {activeNode.id}
          </div>
        </div>

        {/* Technical Specs List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {Object.entries(activeNode.details)
            .filter(([k]) => k !== 'title' && k !== 'description')
            .map(([key, val], idx) => (
              <div key={idx} className="p-3 bg-slate-900/70 rounded-lg border border-slate-800/90 space-y-1 shadow-2xs">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold block">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span className="font-bold text-slate-100 block text-xs leading-snug">
                  {val}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
