import React, { useState, useRef, useEffect } from 'react';
import { Terminal, CornerDownLeft, Trash2 } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'info';
  content: string;
}

export const InteractiveTerminal: React.FC = () => {
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    const newLines: TerminalLine[] = [
      ...history,
      { id: `cmd-${Date.now()}`, type: 'input', content: `PS C:\\NextcloudAIO> ${trimmed}` }
    ];

    const lower = trimmed.toLowerCase();

    if (lower === 'clear' || lower === 'cls') {
      setHistory([]);
      setInputVal('');
      return;
    }

    if (lower === 'help') {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        content: `Available commands:
  tailscale ip -4              Inspect assigned Tailscale CGNAT IPv4 address
  tailscale serve status       Check HTTPS WireGuard reverse proxy status
  netstat -an | findstr 22     Verify if FileZilla SFTP is listening on port 22
  docker ps                    List active Nextcloud AIO containers
  occ files:scan --all         Run Nextcloud internal filesystem catalog scan
  rclone check                 Test offsite Borg backup integrity in Cloud S3/B2
  powercfg /query              Check host sleep and closed-lid power plan
  clear                        Clear the console screen`
      });
    } else if (lower.includes('tailscale ip')) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        content: `100.115.42.88
fd7a:115c:a1e0::88`
      });
    } else if (lower.includes('tailscale serve status')) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        content: `https://my-laptop.tailnet-zone.ts.net (tailnet only)
|-- / proxy http://localhost:443
    TLS: Active (Let's Encrypt managed by Tailscale)
    WireGuard Peer: 5G Mobile Node (100.84.19.12) connected`
      });
    } else if (lower.includes('netstat')) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        content: `  TCP    0.0.0.0:22             0.0.0.0:0              LISTENING       [FileZilla Server.exe]
  TCP    [::]:22                [::]:0                 LISTENING       [FileZilla Server.exe]`
      });
    } else if (lower.includes('docker ps')) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        content: `CONTAINER ID   IMAGE                               COMMAND                  CREATED         STATUS                   PORTS
a14b5c7d8e9f   nextcloud/all-in-one:latest         "/bin/sh -c /start.sh"   3 hours ago     Up 3 hours (healthy)     0.0.0.0:80->80/tcp, 0.0.0.0:8080->8080/tcp, 0.0.0.0:8443->8443/tcp
b25c6d7e8f0a   nextcloud/aio-apache:latest         "/entrypoint.sh"         3 hours ago     Up 3 hours (healthy)     127.0.0.1:443->443/tcp
c36d7e8f9a1b   nextcloud/aio-postgresql:latest     "docker-entrypoint.s…"   3 hours ago     Up 3 hours (healthy)     5432/tcp
d47e8f9a0b2c   nextcloud/aio-redis:latest          "docker-entrypoint.s…"   3 hours ago     Up 3 hours (healthy)     6379/tcp
e58f9a0b1c3d   nextcloud/aio-borgbackup:latest     "/entrypoint.sh"         3 hours ago     Up 3 hours (healthy)     `
      });
    } else if (lower.includes('occ files:scan') || lower.includes('files:scan')) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        content: `Starting scan for user 1/1 (admin)...
+---------+-------+--------------+
| Folders | Files | Elapsed time |
+---------+-------+--------------+
| 312     | 4,892 | 00:00:04     |
+---------+-------+--------------+
Files catalog successfully synced with Drive D:\\PersonalCloud.`
      });
    } else if (lower.includes('rclone check') || lower.includes('rclone sync')) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        content: `2026/10/05 09:18:22 NOTICE: b2-cloud:my-vault-borg-backups/NextcloudBorgBackup: 0 differences found
2026/10/05 09:18:22 NOTICE: 489 matching files checked across 12 Borg segment indexes.
Cloud offsite repository is 100% consistent with local USB drive.`
      });
    } else if (lower.includes('powercfg')) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        content: `Power Scheme GUID: 381b4222-f694-41f0-9685-ff5bb260df2e (Balanced - Server Profile)
  Subgroup: SLEEP
    Setting: Standby Timeout (AC): 0 minutes (NEVER)
  Subgroup: POWER BUTTONS AND LID
    Setting: Lid Close Action (AC): 0 (DO NOTHING)
  Status: Configured for 24/7 continuous operation.`
      });
    } else {
      newLines.push({
        id: `err-${Date.now()}`,
        type: 'error',
        content: `Command not recognized: "${trimmed}". Type "help" for a list of available commands.`
      });
    }

    setHistory(newLines);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    }
  };

  const quickBadges = [
    { label: 'tailscale ip -4', cmd: 'tailscale ip -4' },
    { label: 'tailscale serve status', cmd: 'tailscale serve status' },
    { label: 'netstat port 22', cmd: 'netstat -an | findstr 22' },
    { label: 'docker ps', cmd: 'docker ps' },
    { label: 'occ files:scan', cmd: 'docker exec -it nextcloud-aio-nextcloud php occ files:scan --all' },
    { label: 'rclone check', cmd: 'rclone check E:\\NextcloudBorgBackup b2-cloud:my-vault-borg-backups' },
    { label: 'powercfg /query', cmd: 'powercfg /query' }
  ];

  return (
    <div className="space-y-4 text-slate-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <span>Interactive Console Simulator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test and inspect standard command responses for Tailscale, Docker, and system diagnostics.
          </p>
        </div>

        <button
          onClick={() => setHistory([])}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      {/* Quick Run Items */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase shrink-0 pr-1">
          Presets:
        </span>
        {quickBadges.map((badge, idx) => (
          <button
            key={idx}
            onClick={() => executeCommand(badge.cmd)}
            className="px-2.5 py-1 font-mono text-[11px] text-cyan-300 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-800 rounded-md transition-all whitespace-nowrap cursor-pointer shadow-2xs"
          >
            {badge.label}
          </button>
        ))}
      </div>

      {/* Console Window */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs shadow-xs">
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/60">
          <span className="text-cyan-400 font-bold shrink-0 font-mono">PS C:\NextcloudAIO&gt;</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command (or click a preset above)..."
            className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-slate-500"
            autoFocus
          />
          <button
            onClick={() => executeCommand(inputVal)}
            className="p-1.5 text-slate-400 hover:text-cyan-300 bg-slate-900 rounded-md border border-slate-800 cursor-pointer transition-colors"
            title="Execute"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {history.length > 0 && (
          <div className="p-4 space-y-2.5 max-h-[360px] overflow-y-auto select-text leading-relaxed bg-slate-950/80 border-t border-slate-800">
            {history.map((line) => {
              if (line.type === 'input') {
                return (
                  <div key={line.id} className="text-cyan-300 font-bold">
                    {line.content}
                  </div>
                );
              }
              if (line.type === 'error') {
                return (
                  <div key={line.id} className="text-rose-400 pl-3 border-l-2 border-rose-500 font-medium">
                    {line.content}
                  </div>
                );
              }
              if (line.type === 'info') {
                return (
                  <div key={line.id} className="text-slate-400 italic">
                    {line.content}
                  </div>
                );
              }
              return (
                <pre key={line.id} className="text-slate-200 whitespace-pre-wrap pl-2 leading-relaxed bg-transparent border-0 shadow-none font-mono">
                  {line.content}
                </pre>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
};
