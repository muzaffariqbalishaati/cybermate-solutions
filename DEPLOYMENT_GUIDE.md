# 🚀 Deploying OpenClaw & WhatsApp AI Bot 24/7 (No Local PC Needed)

This guide walks you through keeping your **OpenClaw Control Plane & WhatsApp AI Auto-Reply Bot** running **24/7 in the Cloud** completely free, so you **never need to keep your personal computer turned on**.

---

## ⚡ Quick Summary: Which Cloud Solution to Use?

| Feature | Method 1: Meta Cloud API (Vercel) | Method 2: Personal QR Bot (Render / Railway) |
| :--- | :--- | :--- |
| **Hosting Platform** | **Vercel (Already Live ✅)** | **Render.com / Railway (Free)** |
| **PC Needed?** | ❌ **Never** (100% Cloud Serverless) | ❌ **Never** (100% Cloud Container) |
| **WhatsApp Type** | Official Meta WhatsApp Business Number | Your Personal WhatsApp SIM Number |
| **Connection Method**| Meta Developer Token & Webhook | Scan QR Code Once via Cloud URL |
| **Pricing** | Free (1,000 conversations/month) | Free Tier |
| **Endpoint** | `https://cybermate-solutions-alpha.vercel.app/api/webhook/whatsapp` | `https://<your-render-app>.onrender.com` |

---

## 🌟 Method 1: Meta WhatsApp Cloud API on Vercel (Already Deployed 🟢)

Your Next.js OpenClaw control plane is **already live on Vercel**:
**[https://cybermate-solutions-alpha.vercel.app/](https://cybermate-solutions-alpha.vercel.app/)**

Because Vercel is a serverless platform, it runs on demand 24/7 without needing your computer on.

### 📱 3-Minute Setup on Meta Developer Portal:
1. Go to **[developers.facebook.com](https://developers.facebook.com/)** and log in.
2. Open your App > Click **WhatsApp** > **Configuration**.
3. Under **Webhook**, click **Edit**:
   - **Callback URL:** `https://cybermate-solutions-alpha.vercel.app/api/webhook/whatsapp`
   - **Verify Token:** `openclaw_secret_token`
4. Click **Verify and Save**.
5. Under **Webhook fields**, click **Manage** and subscribe to **`messages`**.
6. In **Vercel Dashboard** ([vercel.com](https://vercel.com)) > Your `openclaw` project > **Settings** > **Environment Variables**, add:
   - `OPENAI_API_KEY`: Your OpenAI API key (for GPT-4o-mini auto-reply)
   - `WHATSAPP_ACCESS_TOKEN`: Your Meta Permanent System User Access Token
   - `WHATSAPP_PHONE_NUMBER_ID`: Your WhatsApp Phone Number ID from Meta
7. **Done!** Whenever anyone sends a message to your WhatsApp number, Vercel wakes up, generates the AI reply with GPT-4o, and replies automatically. Your PC can remain off forever.

---

## 📱 Method 2: Personal WhatsApp QR Bot 24/7 Cloud Hosting (Render / Railway)

If you want to use your **personal SIM card WhatsApp number** (via QR code scan) instead of Meta's Business API:

> **Why not directly on Vercel?**
> Vercel is *Serverless* — functions terminate after 10-15 seconds and cannot keep a continuous 24/7 WebSocket connection open to WhatsApp servers.
> For personal WhatsApp QR bots, you need a persistent Node.js host. **Render.com** provides this **for FREE** and connects directly to your GitHub repository!

### 🚀 4 Steps to Host on Render (Free 24/7):

1. **Sign in to Render**:
   - Go to **[render.com](https://render.com/)** and click **Get Started** / **Log in with GitHub**.

2. **Create New Web Service**:
   - Click the **New +** button at the top and select **Web Service**.
   - Select your GitHub repository: **`muzaffar0641/cybermate-solutions`**.
   *(If not listed, click "Configure account" to grant Render access to your repo).*

3. **Configure Service**:
   - **Name:** `cybermate-whatsapp-bot`
   - **Region:** Singapore / Frankfurt / Oregon (any)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node whatsapp-bot.cjs`
   - **Instance Type:** **Free** ($0/month)
   - **Health Check Path:** `/health`
   *(Optional: Add `OPENAI_API_KEY` under Environment Variables for GPT-4o-mini replies).*
   - Click **Deploy Web Service**!

4. **Scan QR Code from Cloud URL**:
   - Render will build your app and give you a public URL (e.g. `https://cybermate-whatsapp-bot.onrender.com`).
   - Open that URL in your mobile browser or laptop.
   - You will see the **CyberMate WhatsApp AI Gateway Dashboard** with a live QR code.
   - Open WhatsApp on your phone > **Linked Devices** > **Link a Device** > Scan the QR code.
   - **Status turns green: `Connected & AI Auto-Reply Active`**!
   - Now you can close all browser tabs and shut down your computer. The bot is running on Render's cloud servers 24/7!

---

## 🤖 Other Live Webhooks on Vercel

- **Agent Control Plane Web UI:** [https://cybermate-solutions-alpha.vercel.app/](https://cybermate-solutions-alpha.vercel.app/)
- **Telegram Bot Webhook:** `https://cybermate-solutions-alpha.vercel.app/api/webhook/telegram`
  - Connect your Telegram bot with:
  ```text
  https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_TOKEN>/setWebhook?url=https://cybermate-solutions-alpha.vercel.app/api/webhook/telegram
  ```
- **Slack Events Webhook:** `https://cybermate-solutions-alpha.vercel.app/api/webhook/slack`
- **Gateway Health Check:** `https://cybermate-solutions-alpha.vercel.app/api/gateway`
