# Self-Hosted Private Cloud & Direct Storage Stack

A comprehensive guide for transforming a host machine or laptop into a secure, private cloud server accessible remotely across mobile and desktop devices—without exposing any ports to the open internet.

---

## Simple Concept Overview

Both setup methods use **Tailscale** to create an encrypted, invisible tunnel between your mobile phone and your home server. This bypasses port forwarding and keeps your server hidden from internet hackers.

                ┌─────────────────────────────────────┐
                │            MOBILE PHONE             │
                │   (Nextcloud App / Mobile SFTP)     │
                └──────────────────┬──────────────────┘
                                   │
                 [ Tailscale Encrypted WireGuard Tunnel ]
                                   │
                ┌──────────────────┴──────────────────┐
                │            LAPTOP SERVER            │
                │                                     │
                │  ┌──────────────┐ ┌──────────────┐  │
                │  │ Nextcloud    │ │ FileZilla    │  │
                │  │ Docker Stack │ │ SFTP Server  │  │
                │  └──────┬───────┘ └──────┬───────┘  │
                │         │                │          │
                │  ┌──────▼────────────────▼───────┐  │
                │  │   Local Storage (C: / D:)     │  │
                │  └───────────────────────────────┘  │
                └─────────────────────────────────────┘
---

## 🛠️ Choose Your Access Method

| Evaluation Metric | Method 1: Direct SFTP (FileZilla) | Method 2: Nextcloud AIO Stack |
| :--- | :--- | :--- |
| **Primary Use Case** | Direct raw filesystem browsing, video streaming & fast transfers | Full Google Drive / Photos alternative with auto-sync & web UI |
| **Client Software** | Solid Explorer, CX File Explorer, FileZilla Client, WinSCP | Official Nextcloud Mobile App, Desktop Sync, Web Portal |
| **Resource Usage** | 🟢 **Extremely Light** (~10–20 MB RAM) | 🟡 **Medium** (~1.5–2.5 GB RAM across Docker) |
| **Storage Control** | Direct access to host drives (`C:\`, `D:\`) with zero indexing lag | Managed database catalog (requires `occ scan` for manual file changes) |
| **Mobile Photo Backup** | Requires 3rd-party tool (e.g., FolderSync) | Native automatic background camera upload & album sorting |
| **Backups & Redundancy** | Manual user copy or custom Robocopy scripts | Automated 3-2-1 BorgBackup snapshotting + Rclone offsite sync |
| **Multi-User Access** | Basic FTP server user accounts with folder mappings | Enterprise user management, public share links, password expirations |
| **Port Forwarding Risk** | 🛡️ **Zero** (Protected by Tailscale WireGuard) | 🛡️ **Zero** (Protected by Tailscale WireGuard & Serve) |
| **Detailed Guide** | [`1.Direct SFTP Access via FileZilla Server.md`](./1.Direct%20SFTP%20Access%20via%20FileZilla%20Server.md) | [`2.Self-Hosted-Private-Cloud-AIO.md`](./2.Self-Hosted-Private-Cloud-AIO.md) |

---

## 🛡️ Quick Security Principles

* **Zero Port Forwarding:** Router ports remain closed. All traffic passes strictly through private Tailscale mesh network addresses (`100.x.y.z`).
* **Root Partition Guard:** Avoid mapping root `C:\` in SFTP to protect critical Windows OS files (`C:\Windows`). Scope access to secondary partitions or dedicated folders (e.g., `D:\PersonalCloud`).
* **Power Management:** Configure Windows Power Settings to `Never Sleep` when plugged in to ensure continuous 24/7 file availability.
