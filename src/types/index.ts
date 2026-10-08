export type ActiveTab = 
  | 'overview' 
  | 'onboarding'
  | 'backup' 
  | 'diagnostics' 
  | 'terminal';

export type AppTheme = 'dark' | 'light';

export interface StepItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  commands?: string[];
  verification: string;
  tip?: string;
  warning?: string;
}

export interface CloudProviderOption {
  id: string;
  name: string;
  defaultRemote: string;
  bucketExample: string;
  pricingNote: string;
}

export interface SearchItem {
  id: string;
  title: string;
  category: 'Command' | 'Guide' | 'Troubleshooting' | 'Architecture';
  targetTab: ActiveTab;
  codeSnippet?: string;
  description: string;
}

export interface ScriptVersion {
  id: string;
  versionNumber: number;
  timestamp: string;
  scriptType: 'rclone' | 'scheduler' | 'firewall' | 'power';
  description: string;
  configSnapshot: {
    localSource: string;
    selectedProvider: string;
    remoteName: string;
    bucketName: string;
    logPath: string;
    transfers: number;
    isDryRun: boolean;
    scheduleTime: string;
    taskName: string;
    ruleName: string;
    firewallPort: number;
    firewallProtocol: 'TCP' | 'UDP';
  };
}
