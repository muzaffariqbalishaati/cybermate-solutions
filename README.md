# 🦅 OpenClaw Control Plane & Web Gateway

An autonomous AI agent control plane and multi-platform gateway built with Next.js, tailored for seamless serverless deployment on **Vercel** via **GitHub**.

![OpenClaw Vercel Badge](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)
![Next.js Badge](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)

---

## ⚡ Highlights

- **Interactive Agent Console**: Chat with OpenClaw powered by Claude 3.7 / 3.5 Sonnet, GPT-4o, and DeepSeek with live tool execution traces.
- **Serverless Webhook Bus**: Ready-to-go webhook listeners for **Telegram**, **Slack**, **Discord**, and **WhatsApp**.
- **Autonomous Tool Sandbox**: Configurable skill toggles (Web Search, Code Execution, File System, Upstash Vector Memory).
- **Vercel Native**: Configured with `vercel.json` for 60s function timeouts and security headers.
- **Immediate Out-of-the-Box Operation**: Operates in self-contained simulation mode or with direct API keys.

---

## 🚀 Quick Deployment to Vercel

For the detailed step-by-step walkthrough, see **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** or open the **Deploy on Vercel Guide** tab in the running app.

### 1. Push to GitHub
```bash
git add .
git commit -m "feat: initialize openclaw control plane"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/openclaw.git
git push -u origin main
```

### 2. Import on Vercel
Go to [vercel.com/new](https://vercel.com/new), select your `openclaw` repository, and click **Deploy**.

---

## 💻 Local Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Project Structure

```text
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts              # Agent chat & tool execution engine
│   │   │   ├── gateway/route.ts           # Status & health metrics
│   │   │   └── webhook/
│   │   │       ├── telegram/route.ts      # Serverless Telegram bot listener
│   │   │       └── slack/route.ts         # Serverless Slack events listener
│   │   ├── globals.css                    # Cyberpunk obsidian design system
│   │   ├── layout.tsx                     # Root metadata & layout
│   │   └── page.tsx                       # Full interactive control plane UI
├── vercel.json                            # Vercel deployment configuration
├── .env.example                           # Environment variables template
└── DEPLOYMENT_GUIDE.md                    # Step-by-step deployment guide
```

---

## 📜 License
MIT
