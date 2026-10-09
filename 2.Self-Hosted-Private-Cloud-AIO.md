# Self-Hosted-Private-Cloud-AIO
## Architecture Overview

           ┌──────────────────────────────────────────────────┐
           │                  MOBILE PHONE                    │
           │   (Nextcloud Mobile App / SFTP Client App)       │
           └────────────────────────┬─────────────────────────┘
                                    │
                      [ Tailscale Encrypted Tunnel ]
                      [ (WireGuard VPN / 100.x.y.z) ]
                                    │
           ┌────────────────────────┴─────────────────────────┐
           │                  LAPTOP SERVER                   │
           │                                                  │
           │  ┌──────────────────────┐ ┌───────────────────┐  │
           │  │ Docker Engine        │ │ FileZilla SFTP    │  │
           │  │  └─ Nextcloud AIO    │ │ Service (Port 22) │  │
           │  └──────────┬───────────┘ └─────────┬─────────┘  │
           │             │                       │            │
           │  ┌──────────▼───────────────────────▼─────────┐  │
           │  │      Local Storage Partition (C: / D:)     │  │
           │  │                (500 GB / 1 TB)             │  │
           │  └────────────────────────────────────────────┘  │
           └──────────────────────────────────────────────────┘

**🛡️ 1. Tailscale vs. Direct Port Forwarding**

Think of your laptop as your house and your files as valuables inside.

**Direct Port Forwarding (The Risky Way):**
Analogy: You leave your front door wide open onto a busy public highway so you can easily walk back inside whenever you want. Anyone walking by on the street can see your door, attempt to walk in, or try to pick the lock.

Technical Reality: When you open a port (like Port 80 or 21) on your Wi-Fi router, your laptop's server is exposed to the entire internet. Automated hacker bots constantly scan IP addresses worldwide looking for open ports to try thousands of random password combinations.

**Tailscale (The Safe Way):**
Analogy: Your front door stays completely locked, bolted, and invisible from the street. Instead, you build a private underground tunnel that connects only your phone directly to your laptop.

Technical Reality: Tailscale uses WireGuard technology to create a private virtual network. Your laptop does not open any ports to the public internet.

Example Scenario:
| Action | Direct Port Forwarding | Tailscale |
| :--- | :--- | :--- |
| **Public Internet Visibility** | Visible to everyone. Anyone typing your public IP address can reach your Nextcloud login screen. | Invisible. Only authorized devices on your private Tailscale network can see it. |
| **Connecting from Phone** | You type `http://122.160.x.x:8080` into your mobile browser while on 5G. | You type your private Tailscale IP (e.g., `http://100.115.x.x:8080`) or MagicDNS domain into your phone. |
| **Hacker Attempt** | A bot finds your open port and launches 10,000 automated password guesses. | A hacker cannot even find the server because it is not exposed on the open web. |

---

## ⚡ Prerequisites & Power Management

To allow continuous remote access, your host machine must remain powered on and connected to your network.

### 1. Power Plan Configuration (Windows)
1. Press `Win + R`, type `powercfg.cpl`, and press **Enter**.
2. Click **Change plan settings** next to your active power plan.
3. Set **Put the computer to sleep** to **Never** when **Plugged in**.
4. Click **Save changes**.

### 2. Closed-Lid Operation (Optional)
1. In `powercfg.cpl`, click **Choose what closing the lid does** in the left sidebar.
2. Under **When I close the lid**, set **Plugged in** to **Do nothing**.
3. Click **Save changes**.

> ⚠️ **Thermal Caution:** Ensure your laptop is placed on a hard, well-ventilated surface or cooling pad to prevent thermal throttling during 24/7 operation.

---

## 📂 Nextcloud AIO Personal Cloud Setup

This procedure configures **Nextcloud All-in-One (AIO)** using Docker, enabling a web dashboard, automatic mobile photo backup, file sharing, and web interface management for a designated storage drive (e.g., 500 GB on Drive D:).

    ┌─────────────────────────────────────────────────────────────────┐
    │  Step 1: Install Docker Desktop & WSL2 Engine                   │
    └────────────────────────────────┬────────────────────────────────┘
                                     │
    ┌────────────────────────────────▼────────────────────────────────┐
    │  Step 2: Deploy Nextcloud AIO Master Container                  │
    └────────────────────────────────┬────────────────────────────────┘
                                     │
    ┌────────────────────────────────▼────────────────────────────────┐
    │  Step 3: Configure Storage Path & Admin Credentials             │
    └────────────────────────────────┬────────────────────────────────┘
                                     │
    ┌────────────────────────────────▼────────────────────────────────┐
    │  Step 4: Link Tailscale Private Mesh VPN Tunnel                 │
    └────────────────────────────────┬────────────────────────────────┘
                                     │
    ┌────────────────────────────────▼────────────────────────────────┐
    │  Step 5: Connect Mobile App & Verify Remote Access              │
    └─────────────────────────────────────────────────────────────────┘

## 📂 Nextcloud AIO Personal Cloud Setup

This procedure configures **Nextcloud All-in-One (AIO)** using Docker Compose, enabling local file storage, automatic photo backup, and encrypted remote access via Tailscale.

### Step 1: Install Docker Desktop Engine
1. Download and run the official [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) installer.
2. Ensure **Use WSL 2 instead of Hyper-V** is selected during installation.
3. Complete installation, restart your PC, and confirm Docker displays **Engine Running**.

### Step 2: Create `docker-compose.yml` Configuration
1. Create a dedicated folder on your laptop (e.g., `C:\NextcloudAIO\`).
2. Inside that folder, create a file named `docker-compose.yml` and paste the following:
```yaml
version: '3.8'

services:
  nextcloud-aio-mastercontainer:
    image: nextcloud/all-in-one:latest
    container_name: nextcloud-aio-mastercontainer
    restart: always
    ports:
      - "80:80"
      - "8080:8080"
      - "8443:8443"
    environment:
      # Bypasses public Let's Encrypt domain checks for Tailscale/local setups
      - SKIP_DOMAIN_VALIDATION=true
    volumes:
      - nextcloud_aio_mastercontainer:/mnt/docker-aio-mastercontainer
      - //var/run/docker.sock:/var/run/docker.sock:ro

volumes:
  nextcloud_aio_mastercontainer:
    name: nextcloud_aio_mastercontainer
```
### Step 3: Launch Stack & Setup Admin Account
1. Open PowerShell as Administrator in C:\NextcloudAIO\ and run:
   ```powershell
    docker compose up -d
Verification: Run docker ps to ensure nextcloud-aio-mastercontainer shows status Up.

2.	Open your browser and go to: https://localhost:8080
3.	Copy the administrative passphrase displayed on screen.
4.	Set your storage path (e.g., D:\PersonalCloud) and create your Admin credentials.
5.	Click Start Containers and wait until all containers report Healthy.
### Step 4: Configure Tailscale Encrypted Route (Port 443)
1. Install and sign into Tailscale on your laptop.
2. Enable MagicDNS and HTTPS Certificates in the Tailscale Admin Console.
3. Open PowerShell as Administrator and map Tailscale to Nextcloud's web server on port 443:
   ```powershell
   tailscale serve https / http://localhost:443
Verification: Run `tailscale serve status` to verify `https://your-laptop-name.your-tailnet.ts.net` proxies to `http://localhost:443`.

### Step 5: Connect Mobile App & Index External SFTP Files
1. Install Tailscale on your mobile phone, connect to your account, and switch to 5G cellular data.
2. Open the Nextcloud app on your phone and set the server URL to your Tailscale domain (`https://your-laptop-name.your-tailnet.ts.net`).
3. Optional SFTP Sync: If you modify files on Drive D: directly via FileZilla SFTP, force Nextcloud to index those changes by running:
   ```powershell
   docker exec -it nextcloud-aio-nextcloud php occ files:scan --all
**Comparison: 🏠 Self-Hosted Laptop Cloud**

| Feature | Advantages (Pros) | Disadvantages (Cons) |
| :--- | :--- | :--- |
| **Storage & Cost** | 1 TB space (33x–66x more than free cloud accounts) with zero monthly subscription fees. | Laptop must stay plugged in 24/7, slightly increasing your electricity bill. |
| **Privacy & Security** | Data stays on your local hardware at home, not on corporate servers. | No automatic backups—if your laptop drive fails, files are lost forever. |
| **File Access** | Remotely browse your entire drive (C: or D:) with no file size or type limits. | System goes offline during home Wi-Fi drops, power cuts, or Windows updates. |
| **Hardware Health** | repurposes existing hardware into a dedicated personal storage server. | Continuous operation generates heat, wearing down battery and cooling fans. |

### 🛡️ Automated 3-2-1 Backup Strategy
Implementing a 3-2-1 backup strategy ensures your Nextcloud data is completely resilient against drive failures, accidental deletion, ransomware, or physical loss.

### 📐 The 3-2-1 Strategy Breakdown
  1. 3 Copies of Data: Primary live data + 1 local backup + 1 offsite cloud backup.
  2. 2 Different Storage Media: Laptop internal SSD (`C:`/`D`: drive) + External USB Drive or NAS.
  3. 1 Offsite Location: Encrypted cloud storage (e.g., Backblaze B2, AWS S3, Hetzner, or Google Drive).

### Step 1: Local Backup via Nextcloud AIO (Copy 1 ➔ Copy 2)
Nextcloud AIO includes a built-in, production-grade BorgBackup engine. It safely stops active database transactions, creates an incremental backup archive of all Docker volumes and user files, and restarts containers automatically.

1.	Connect an External Drive: Plug in a secondary drive or external USB disk formatted as NTFS/exFAT (e.g.,`E:\NextcloudBorgBackup`).
2.	Open AIO Dashboard: Go to `https://localhost:8080` in your web browser.
3.	Configure Backup Path:
    1. Locate the Backup and restore section.
    2. Set the backup destination directory to your external path (e.g.,`E:\NextcloudBorgBackup` or `/run/desktop/mnt/host/e/NextcloudBorgBackup`).

5.	Set Password & Run Initial Backup:
    1. Create and record a strong Borg Encryption Password.
    2. Click Create Backup.
6.  Enable Daily Backups: Check Enable daily automated backups in the AIO panel to schedule hands-off local backups every night.

### Step 2: Offsite Cloud Sync via Rclone (Copy 2 ➔ Copy 3)
To fulfill the offsite requirement without exposing raw Nextcloud files to the cloud, use Rclone to push your encrypted Borg backup directory to cloud object storage (e.g., Backblaze B2, AWS S3, Wasabi).

1. Install & Configure Rclone
    1. Download Rclone for Windows and extract it to `C:\rclone\`.
    2. Open PowerShell as Administrator and run:
       ```powershell
       C:\rclone\rclone.exe config
    3. Follow the interactive setup to create a new remote (e.g., named b2-cloud for Backblaze B2 or S3).
2. Create the PowerShell Automation Script

Create a script at C:\NextcloudAIO\sync-offsite.ps1 with the following content:
```powershell
  # C:\NextcloudAIO\sync-offsite.ps1
  $Source = "E:\NextcloudBorgBackup"
  $Destination = "b2-cloud:your-bucket-name/NextcloudBorgBackup"
  $LogFile = "C:\NextcloudAIO\rclone-sync.log"
  
  Start-Transcript -Path $LogFile -Append
  Write-Output "Starting offsite cloud sync at $(Get-Date)..."
  
  # Syncs encrypted Borg archives to the cloud bucket
  C:\rclone\rclone.exe sync $Source $Destination --fast-list --transfers 4 --verbose
  
  Write-Output "Cloud sync completed at $(Get-Date)."
  Stop-Transcript
```
### Step 3: Automate Offsite Sync with Windows Task Scheduler
Set the offsite sync to execute automatically every night after Nextcloud finishes its local Borg backup.
1.	Press `Win + R`, type `taskschd.msc`, and press Enter.
2.	Click Create Task in the right sidebar.
3.	General Tab:
  	1. Name: `Nextcloud Offsite Backup Sync`
  	2. Select `Run whether user is logged on or not` and check `Run with highest privileges`.
5.  Triggers Tab:
    1. Click New... ➔ Choose On a schedule ➔ Daily at 4:00 AM (1–2 hours after AIO's local daily backup).
7.  Actions Tab:
    1. Click New... ➔ Action: Start a program
    2. Program/script: `powershell.exe`
    3. Add arguments: `-ExecutionPolicy Bypass -File "C:\NextcloudAIO\sync-offsite.ps1`"
8.  Click OK and enter your Windows user password when prompted.
### 🔍 Verification & Disaster Recovery Test

| Step | Action | Expected Result |
| :--- | :--- | :--- |
| **Local Backup Test** | Check `E:\NextcloudBorgBackup` after running an AIO backup. | Directory contains non-zero Borg archive data chunks. |
| **Cloud Sync Test** | Run `C:\NextcloudAIO\sync-offsite.ps1` manually in PowerShell. | Check `C:\NextcloudAIO\rclone-sync.log` for a `Sync completed successfully` message. |
| **Disaster Recovery** | On a new PC, install AIO, point to your Borg backup repository, enter your encryption key, and click Restore. | Nextcloud instance, database, settings, and files are completely restored. | 
