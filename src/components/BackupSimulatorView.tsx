import React, { useState } from 'react';
import { 
  HardDrive, 
  Cloud, 
  Database, 
  RefreshCw, 
  Copy, 
  Check, 
  Flame,
  FileX,
  AlertTriangle
} from 'lucide-react';

export const BackupSimulatorView: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<'ssdFail' | 'accidental' | 'ransomware'>('ssdFail');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const scenarios = {
    ssdFail: {
      title: 'Host Laptop SSD / Hardware Failure',
      icon: Flame,
      severity: 'Complete Hardware Loss',
      description: 'Your host laptop internal SSD dies completely or the laptop is stolen or physically damaged.',
      restorationSteps: [
        {
          step: '1. Set up clean replacement PC or Laptop',
          detail: 'Install Windows 11 and Docker Desktop with WSL2 engine.',
          command: 'winget install Docker.DockerDesktop'
        },
        {
          step: '2. Connect External Backup Drive or Pull from Cloud',
          detail: 'Plug in external USB drive (E:\\NextcloudBorgBackup) containing Borg archives, OR pull latest chunks via Rclone from Backblaze B2/S3.',
          command: 'C:\\rclone\\rclone.exe sync b2-cloud:my-vault-borg-backups/NextcloudBorgBackup E:\\NextcloudBorgBackup --transfers 8'
        },
        {
          step: '3. Deploy clean Nextcloud AIO Mastercontainer',
          detail: 'Deploy docker-compose.yml on the new PC.',
          command: 'docker compose up -d'
        },
        {
          step: '4. Decrypt & Restore in AIO Web Panel',
          detail: 'Navigate to https://localhost:8080, point backup path to E:\\NextcloudBorgBackup, input your Borg Encryption Password, and click "Restore Selected Backup".',
          command: '# Done via AIO Web GUI: Automatically restores PostgreSQL database, Redis cache, and all user files.'
        }
      ]
    },
    accidental: {
      title: 'Accidental Folder Deletion on Host Drive',
      icon: FileX,
      severity: 'User Error',
      description: 'A 50GB photo directory on D:\\PersonalCloud was accidentally deleted or overwritten.',
      restorationSteps: [
        {
          step: '1. Check Nextcloud Deleted Files (Trashbin)',
          detail: 'Nextcloud preserves deleted files with original folder structures and version history for 30 days.',
          command: '# Open Web UI -> Deleted files tab -> Click "Restore" on the target folder'
        },
        {
          step: '2. Restore from Last Night\'s Borg Snapshot',
          detail: 'If emptied from trashbin, mount the read-only Borg archive snapshot directly to inspect historical files.',
          command: 'docker exec -it nextcloud-aio-borgbackup borg list /mnt/borgbackup'
        }
      ]
    },
    ransomware: {
      title: 'Ransomware Infection on Host Windows OS',
      icon: AlertTriangle,
      severity: 'System Compromise',
      description: 'Malware encrypts your C:\\ and D:\\ drives. However, Borg archives and cloud objects are append-only/versioned.',
      restorationSteps: [
        {
          step: '1. Wipe System Completely',
          detail: 'Reformat drives cleanly with a fresh Windows installation to purge malware.',
          command: '# Fresh Windows ISO installation'
        },
        {
          step: '2. Cloud Object Lock / Immutability',
          detail: 'Backblaze B2 / AWS S3 Object Lock prevents ransomware from modifying or deleting historical offsite backups.',
          command: 'C:\\rclone\\rclone.exe sync b2-cloud:my-vault-borg-backups E:\\CleanRecovery'
        },
        {
          step: '3. Decrypt Clean Snapshot',
          detail: 'Restore from the known uninfected timestamp in Borg.',
          command: '# Select snapshot from date preceding infection in Nextcloud AIO panel'
        }
      ]
    }
  };

  const activeScenarioData = scenarios[selectedScenario];

  return (
    <div className="space-y-10 text-zinc-300">
      {/* Header */}
      <section className="space-y-2 border-b border-zinc-800 pb-4">
        <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
          Resilience & Recovery
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
          3-2-1 Automated Backup Strategy & Recovery Playbook
        </h1>

        <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
          Hosting on local hardware carries physical risks (drive wear, hardware failure). 
          By combining Nextcloud AIO's transactional BorgBackup engine with automated Rclone cloud object sync, 
          you ensure complete resilience against data loss.
        </p>
      </section>

      {/* The 3-2-1 Rule Visual Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-zinc-900/40 rounded-lg border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>COPY 1 OF 3</span>
            <Database className="w-4 h-4 text-zinc-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Primary Working Copy</h2>
            <div className="text-xs text-zinc-500 mt-0.5">Laptop NVMe SSD (Drive D:\)</div>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The live, active file system served to your devices. Fast read/write performance.
          </p>
          <div className="text-[11px] font-mono text-zinc-500 pt-1">
            Media: Internal NVMe / SATA
          </div>
        </div>

        <div className="p-5 bg-zinc-900/40 rounded-lg border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>COPY 2 OF 3</span>
            <HardDrive className="w-4 h-4 text-zinc-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Local Borg Snapshot Archive</h2>
            <div className="text-xs text-zinc-500 mt-0.5">External USB Drive (Drive E:\)</div>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Encrypted, deduplicated incremental snapshots generated nightly by Nextcloud AIO at 02:00 AM.
          </p>
          <div className="text-[11px] font-mono text-zinc-500 pt-1">
            Media: External USB HDD / SSD
          </div>
        </div>

        <div className="p-5 bg-zinc-900/40 rounded-lg border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>COPY 3 OF 3</span>
            <Cloud className="w-4 h-4 text-zinc-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Offsite Cloud Object Sync</h2>
            <div className="text-xs text-zinc-500 mt-0.5">Backblaze B2 / AWS S3 / Wasabi</div>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Pushed nightly at 04:00 AM via Rclone. Resilient against physical theft, house fire, or surge damage.
          </p>
          <div className="text-[11px] font-mono text-zinc-500 pt-1">
            Media: Georeplicated Cloud Storage
          </div>
        </div>
      </section>

      {/* Interactive Disaster Recovery Simulator */}
      <section className="p-6 bg-zinc-900/40 rounded-lg border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-zinc-400" />
              <span>Disaster Recovery Playbook</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select a failure scenario to view step-by-step restoration procedures:
            </p>
          </div>

          <div className="flex flex-wrap gap-1 p-1 bg-zinc-950 rounded border border-zinc-800 text-xs">
            <button
              onClick={() => setSelectedScenario('ssdFail')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                selectedScenario === 'ssdFail'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Laptop Drive Failure
            </button>
            <button
              onClick={() => setSelectedScenario('accidental')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                selectedScenario === 'accidental'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Accidental Deletion
            </button>
            <button
              onClick={() => setSelectedScenario('ransomware')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                selectedScenario === 'ransomware'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Ransomware Attack
            </button>
          </div>
        </div>

        {/* Selected Scenario Walkthrough */}
        <div className="space-y-4">
          <div className="p-4 bg-zinc-950 rounded border border-zinc-800 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-zinc-100">{activeScenarioData.title}</h3>
              <span className="text-[11px] font-mono text-zinc-400 px-1.5 py-0.5 bg-zinc-900 rounded border border-zinc-700">
                {activeScenarioData.severity}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {activeScenarioData.description}
            </p>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {activeScenarioData.restorationSteps.map((s, idx) => (
              <div key={idx} className="p-4 bg-zinc-950 rounded border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-zinc-200">{s.step}</h4>
                  <span className="text-[11px] font-mono text-zinc-500">Step 0{idx + 1}</span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">{s.detail}</p>

                {s.command && (
                  <div className="relative group mt-2">
                    <pre className="p-2.5 bg-zinc-900 rounded border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto">
                      {s.command}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(s.command, `recov-step-${idx}`)}
                      className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-white bg-zinc-800 rounded"
                      title="Copy command"
                    >
                      {copiedId === `recov-step-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-zinc-200" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Routine Verification Test Matrix */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-100">
          Routine Verification & Integrity Checks
        </h2>

        <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/30">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950 font-medium text-zinc-400">
                <th className="py-3 px-4 w-1/4">Stage</th>
                <th className="py-3 px-4 w-1/3">Diagnostic Action</th>
                <th className="py-3 px-4 w-1/3">Expected Healthy Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              <tr className="hover:bg-zinc-800/20">
                <td className="py-3 px-4 font-medium text-zinc-200">Local Borg Snapshot</td>
                <td className="py-3 px-4 text-zinc-400">
                  Inspect <code className="font-mono text-zinc-300">E:\NextcloudBorgBackup</code> after 02:00 AM.
                </td>
                <td className="py-3 px-4 text-zinc-400">
                  Directory contains non-zero Borg archive chunk data with recent timestamps.
                </td>
              </tr>
              <tr className="hover:bg-zinc-800/20">
                <td className="py-3 px-4 font-medium text-zinc-200">Cloud Sync Run</td>
                <td className="py-3 px-4 text-zinc-400">
                  Execute <code className="font-mono text-zinc-300">C:\NextcloudAIO\sync-offsite.ps1</code> manually.
                </td>
                <td className="py-3 px-4 text-zinc-400">
                  Check <code className="font-mono text-zinc-300">C:\NextcloudAIO\rclone-sync.log</code> for "Cloud sync completed successfully".
                </td>
              </tr>
              <tr className="hover:bg-zinc-800/20">
                <td className="py-3 px-4 font-medium text-zinc-200">Disaster Recovery Drill</td>
                <td className="py-3 px-4 text-zinc-400">
                  On a secondary PC, install AIO, point to Borg repo, enter key, and click Restore.
                </td>
                <td className="py-3 px-4 text-zinc-400">
                  All Nextcloud database rows, user accounts, and files are 100% restored.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
