import React, { useState, useEffect } from 'react';
import { ActiveTab, SearchItem } from '../types';
import { Search, ArrowRight, Copy, Check } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const searchItems: SearchItem[] = [
    {
      id: 'cmd-tailscale-serve',
      title: 'Map Tailscale HTTPS to Port 443',
      category: 'Command',
      targetTab: 'onboarding',
      codeSnippet: 'tailscale serve https / http://localhost:443',
      description: 'Establishes TLS reverse proxy with automatic MagicDNS Let\'s Encrypt certificates'
    },
    {
      id: 'cmd-occ-scan',
      title: 'Nextcloud Catalog Re-Index (OCC)',
      category: 'Command',
      targetTab: 'onboarding',
      codeSnippet: 'docker exec -it nextcloud-aio-nextcloud php occ files:scan --all',
      description: 'Synchronizes external drive D: file additions into Nextcloud database'
    },
    {
      id: 'cmd-firewall-sftp',
      title: 'Open Inbound Port 22 in Windows Firewall',
      category: 'Command',
      targetTab: 'onboarding',
      codeSnippet: 'New-NetFirewallRule -Name "Allow_FileZilla_SFTP" -Protocol TCP -LocalPort 22 -Action Allow',
      description: 'Creates Windows Defender rule allowing Tailscale SFTP mobile access'
    },
    {
      id: 'cmd-powercfg-sleep',
      title: 'Disable Sleep When Plugged In (Never Sleep)',
      category: 'Command',
      targetTab: 'onboarding',
      codeSnippet: 'powercfg /change standby-timeout-ac 0',
      description: 'Configures Windows power plan for uninterrupted 24/7 host uptime'
    },
    {
      id: 'cmd-rclone-sync',
      title: 'Offsite Cloud Backup Sync Script',
      category: 'Command',
      targetTab: 'terminal',
      codeSnippet: 'C:\\rclone\\rclone.exe sync E:\\NextcloudBorgBackup b2-cloud:my-bucket --fast-list',
      description: 'Pushes BorgBackup encrypted chunks to Backblaze B2 / AWS S3'
    },
    {
      id: 'guide-sftp',
      title: 'Direct SFTP Access via FileZilla Server',
      category: 'Guide',
      targetTab: 'onboarding',
      description: 'Lightweight (15MB RAM) direct hard drive browsing for mobile'
    },
    {
      id: 'guide-nextcloud',
      title: 'Nextcloud All-in-One Docker Setup',
      category: 'Guide',
      targetTab: 'onboarding',
      description: 'Deploy Google Photos & Google Drive alternative with auto-sync'
    },
    {
      id: 'guide-backup',
      title: '3-2-1 Automated Disaster Recovery Strategy',
      category: 'Guide',
      targetTab: 'backup',
      description: '3 copies, 2 media types, 1 offsite cloud with Borg & Rclone'
    },
    {
      id: 'diag-cgnat',
      title: 'Tailscale RFC 6598 CGNAT IP Validator',
      category: 'Troubleshooting',
      targetTab: 'diagnostics',
      description: 'Validate 100.64.0.0/10 address space vs local LAN IPs'
    },
    {
      id: 'diag-untrusted',
      title: 'Fix "Access through untrusted domain" error',
      category: 'Troubleshooting',
      targetTab: 'diagnostics',
      codeSnippet: 'docker exec -it nextcloud-aio-nextcloud php occ config:system:set trusted_domains 2 --value="your-domain.ts.net"',
      description: 'Add Tailscale domain to Nextcloud config.php'
    }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setCopiedId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const trimmed = query.trim();
  const filtered = !trimmed
    ? []
    : searchItems.filter(item => {
        const q = trimmed.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.codeSnippet && item.codeSnippet.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q)
        );
      });

  const copySnippet = (e: React.MouseEvent, snippet: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSelect = (item: SearchItem) => {
    onNavigate(item.targetTab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-zinc-950/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Bar */}
        <div className="flex items-center px-4 py-3 bg-zinc-950 border-b border-zinc-800">
          <Search className="w-4 h-4 text-zinc-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, guides, and configs..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-800 rounded border border-zinc-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1">
          {!trimmed ? (
            <div className="py-12 px-4 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800/80 text-zinc-400 mb-3 border border-zinc-700/60">
                <Search className="w-4 h-4" />
              </div>
              <p className="text-xs font-medium text-zinc-300">
                Type to search
              </p>
              <p className="text-[11px] text-zinc-500 mt-1 max-w-xs mx-auto">
                Search commands, guides, and network configs by keyword.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No matching items found for "{query}".
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className="group p-3 rounded hover:bg-zinc-800/80 cursor-pointer transition-colors flex items-start justify-between gap-3 border border-transparent hover:border-zinc-700"
              >
                <div className="space-y-1 overflow-hidden pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {item.category}
                    </span>
                    <span className="text-xs font-medium text-zinc-200 group-hover:text-white transition-colors">
                      {item.title}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-1">
                    {item.description}
                  </p>

                  {item.codeSnippet && (
                    <code className="text-[11px] font-mono text-zinc-300 bg-zinc-950 px-2 py-0.5 rounded block truncate max-w-lg mt-1 border border-zinc-800">
                      {item.codeSnippet}
                    </code>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0 self-center">
                  {item.codeSnippet && (
                    <button
                      onClick={(e) => copySnippet(e, item.codeSnippet!, item.id)}
                      className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 rounded border border-zinc-800 hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Copy code"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-zinc-200" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-200 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Press <kbd className="font-mono text-zinc-400">↵</kbd> to jump</span>
            <span>·</span>
            <span><kbd className="font-mono text-zinc-400">ESC</kbd> to close</span>
          </div>
          <span className="font-mono text-zinc-400">VaultHost Search</span>
        </div>
      </div>
    </div>
  );
};
