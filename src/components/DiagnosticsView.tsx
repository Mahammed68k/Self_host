import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Terminal, 
  Copy, 
  Check, 
  Wifi, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';

export const DiagnosticsView: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testIp, setTestIp] = useState<string>('100.115.42.88');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const validateTailscaleIp = (ip: string) => {
    const parts = ip.trim().split('.');
    if (parts.length !== 4) return { valid: false, message: 'Invalid IPv4 format. Expected 4 decimal octets.' };
    
    const [o1, o2, o3, o4] = parts.map(Number);
    if ([o1, o2, o3, o4].some(isNaN) || [o1, o2, o3, o4].some(n => n < 0 || n > 255)) {
      return { valid: false, message: 'Octets must be integers between 0 and 255.' };
    }

    if (o1 === 100 && o2 >= 64 && o2 <= 127) {
      return { 
        valid: true, 
        message: 'Valid Tailscale IPv4 Address within RFC 6598 Carrier-Grade NAT (CGNAT) space (100.64.0.0/10).' 
      };
    }

    if (o1 === 192 && o2 === 168) {
      return { 
        valid: false, 
        message: 'This is a local LAN IP (192.168.x.x). It will not work when away from home on 5G. Use your 100.x.y.z Tailscale IP.' 
      };
    }

    if (o1 === 10 || (o1 === 172 && o2 >= 16 && o2 <= 31)) {
      return { 
        valid: false, 
        message: 'This is a standard private LAN IP. Connect to Tailscale to get your global 100.x.y.z WireGuard mesh address.' 
      };
    }

    return { 
      valid: false, 
      message: 'Not within the standard Tailscale CGNAT IP range (100.64.0.0 - 100.127.255.255).' 
    };
  };

  const validationResult = validateTailscaleIp(testIp);

  const faqs = [
    {
      id: 'faq-1',
      question: 'Mobile client says "Connection Timed Out" when connecting over 5G',
      answer: 'Ensure both your mobile device and host laptop have Tailscale toggled ON and are logged into the same Tailnet account. Also check that your Windows Defender Firewall has an Inbound rule allowing TCP Port 22 (for SFTP) or Port 443 (for Tailscale Serve).',
      command: 'Get-NetFirewallRule -DisplayName "*FileZilla*"'
    },
    {
      id: 'faq-2',
      question: 'Nextcloud Web shows "Access through untrusted domain"',
      answer: 'This happens when accessing Nextcloud using a domain not yet listed in the trusted_domains array in config.php. When using Tailscale Serve, requests arrive via localhost or your MagicDNS domain name.',
      command: 'docker exec -it nextcloud-aio-nextcloud php occ config:system:set trusted_domains 2 --value="your-laptop.your-tailnet.ts.net"'
    },
    {
      id: 'faq-3',
      question: 'External files copied directly to Drive D: do not appear in Nextcloud',
      answer: 'Nextcloud indexes files inside an internal PostgreSQL database catalog for high performance. If you add or edit files externally (e.g. through FileZilla SFTP or Windows Explorer), run the OCC files scan command to sync the database.',
      command: 'docker exec -it nextcloud-aio-nextcloud php occ files:scan --all'
    },
    {
      id: 'faq-4',
      question: 'Docker Desktop / WSL2 uses too much RAM on the host laptop',
      answer: 'By default, WSL2 can consume up to 50% of total host RAM. You can cap WSL2 memory to 3GB or 4GB by creating a .wslconfig file in your Windows user directory (C:\\Users\\<Username>\\.wslconfig).',
      command: '[wsl2]\nmemory=3GB\nprocessors=2'
    },
    {
      id: 'faq-5',
      question: 'Laptop goes to sleep after 30 minutes even though lid is closed',
      answer: 'Windows Modern Standby (S0) can trigger sleep even when plugged in. Run the powercfg standby disable command and verify "Choose what closing the lid does" is set to "Do Nothing".',
      command: 'powercfg /change standby-timeout-ac 0'
    }
  ];

  return (
    <div className="space-y-10 text-zinc-300">
      {/* Header */}
      <section className="space-y-2 border-b border-zinc-800 pb-4">
        <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
          Diagnostics & Validation
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
          Network & Diagnostics Workbench
        </h1>

        <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Verify Tailscale IPv4 routing parameters, inspect active port listeners, and reference troubleshooting steps for common edge cases.
        </p>
      </section>

      {/* Tailscale IP Validator Card */}
      <section className="p-6 bg-zinc-900/40 rounded-lg border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-100">
            Tailscale CGNAT IPv4 Address Validator
          </h2>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Tailscale assigns addresses exclusively from the RFC 6598 Carrier-Grade NAT block (100.64.0.0/10). Test your host or mobile IP below to ensure you have not accidentally configured a local home LAN IP.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-full sm:w-auto">
            <input
              type="text"
              value={testIp}
              onChange={(e) => setTestIp(e.target.value)}
              placeholder="e.g. 100.115.42.88"
              className="px-3 py-1.5 text-xs font-mono bg-zinc-950 border border-zinc-700 rounded text-zinc-200 focus:outline-none focus:border-zinc-500 w-full sm:w-64"
            />
          </div>

          <div className="p-2.5 rounded border border-zinc-800 bg-zinc-950 text-xs flex items-center gap-2 flex-1">
            {validationResult.valid ? (
              <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-zinc-400 shrink-0" />
            )}
            <span className="text-zinc-300">{validationResult.message}</span>
          </div>
        </div>
      </section>

      {/* Listening Port Verification Guide */}
      <section className="p-6 bg-zinc-900/40 rounded-lg border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-100">
            Port Listening Verification Commands
          </h2>
        </div>

        <p className="text-xs text-zinc-400">
          Run these verification commands in Command Prompt or PowerShell to confirm that your background services are actively accepting connections:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 bg-zinc-950 rounded border border-zinc-800 space-y-2">
            <div className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
              <span>FileZilla SFTP (Port 22)</span>
              <span className="text-[11px] font-mono text-zinc-500">TCP</span>
            </div>
            <pre className="p-2 bg-zinc-900 rounded font-mono text-[11px] text-zinc-300">
              netstat -an | findstr 22
            </pre>
            <button
              onClick={() => copyToClipboard('netstat -an | findstr 22', 'chk-22')}
              className="w-full flex items-center justify-center gap-1.5 py-1 text-[11px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700 cursor-pointer"
            >
              {copiedId === 'chk-22' ? <Check className="w-3 h-3 text-zinc-200" /> : <Copy className="w-3 h-3 text-zinc-400" />}
              <span>Copy netstat</span>
            </button>
          </div>

          <div className="p-3.5 bg-zinc-950 rounded border border-zinc-800 space-y-2">
            <div className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
              <span>Nextcloud Master (8080)</span>
              <span className="text-[11px] font-mono text-zinc-500">CONTAINER</span>
            </div>
            <pre className="p-2 bg-zinc-900 rounded font-mono text-[11px] text-zinc-300">
              docker ps --filter "name=nextcloud"
            </pre>
            <button
              onClick={() => copyToClipboard('docker ps --filter "name=nextcloud"', 'chk-docker')}
              className="w-full flex items-center justify-center gap-1.5 py-1 text-[11px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700 cursor-pointer"
            >
              {copiedId === 'chk-docker' ? <Check className="w-3 h-3 text-zinc-200" /> : <Copy className="w-3 h-3 text-zinc-400" />}
              <span>Copy docker ps</span>
            </button>
          </div>

          <div className="p-3.5 bg-zinc-950 rounded border border-zinc-800 space-y-2">
            <div className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
              <span>Tailscale Serve (Port 443)</span>
              <span className="text-[11px] font-mono text-zinc-500">PROXY</span>
            </div>
            <pre className="p-2 bg-zinc-900 rounded font-mono text-[11px] text-zinc-300">
              tailscale serve status
            </pre>
            <button
              onClick={() => copyToClipboard('tailscale serve status', 'chk-ts')}
              className="w-full flex items-center justify-center gap-1.5 py-1 text-[11px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700 cursor-pointer"
            >
              {copiedId === 'chk-ts' ? <Check className="w-3 h-3 text-zinc-200" /> : <Copy className="w-3 h-3 text-zinc-400" />}
              <span>Copy serve status</span>
            </button>
          </div>
        </div>
      </section>

      {/* Troubleshooting Knowledgebase Accordion */}
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-zinc-400" />
            <span>Troubleshooting & Reference</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Solutions to common configuration edge cases.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq) => {
            const isOpen = expandedFaq === faq.id;
            return (
              <div 
                key={faq.id}
                className="bg-zinc-900/40 rounded border border-zinc-800 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-800/40 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-medium text-zinc-200 pr-4">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 space-y-3 text-xs border-t border-zinc-800 pt-3">
                    <p className="text-zinc-400 leading-relaxed">{faq.answer}</p>
                    
                    {faq.command && (
                      <div className="relative group">
                        <pre className="p-2.5 bg-zinc-950 rounded border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto">
                          {faq.command}
                        </pre>
                        <button
                          onClick={() => copyToClipboard(faq.command, faq.id)}
                          className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-white bg-zinc-800 rounded"
                          title="Copy command"
                        >
                          {copiedId === faq.id ? (
                            <Check className="w-3.5 h-3.5 text-zinc-200" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
