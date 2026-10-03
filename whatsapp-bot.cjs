const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers } = require('@whiskeysockets/baileys');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const http = require('http');
const path = require('path');
const fs = require('fs');
const pino = require('pino');

// Attempt to load .env or .env.local if present
const envFiles = ['.env.local', '.env'];
for (const file of envFiles) {
  const p = path.resolve(process.cwd(), file);
  if (fs.existsSync(p)) {
    try {
      if (typeof process.loadEnvFile === 'function') {
        process.loadEnvFile(p);
      }
    } catch (_) {}
  }
}

// Bot state
let currentQrCodeDataUrl = null;
let currentRawQr = null;
let connectionStatus = 'initializing'; // initializing, waiting_qr, connected, disconnected
let connectedUser = null;
let recentLogs = [];
const userCooldowns = new Map(); // Anti-spam cooldown per sender
const botSentMessageIds = new Set(); // Prevent replying to bot's own replies
let lastAiResponseText = ''; // Prevent infinite self-chat loops

function logMessage(direction, from, text, extra = '') {
  const time = new Date().toLocaleTimeString();
  const entry = { time, direction, from, text, extra };
  recentLogs.unshift(entry);
  if (recentLogs.length > 50) recentLogs.pop();
  console.log(`[${time}] [${direction.toUpperCase()}] ${from}: ${text} ${extra ? `(${extra})` : ''}`);
}

/**
 * Load Live Business Knowledge & Product Prices
 */
function getLiveBusinessKnowledge() {
  try {
    const p = path.resolve(process.cwd(), 'data', 'business_knowledge.json');
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf-8'));
    }
  } catch (err) {
    console.warn('[WhatsApp Bot] Could not load live business_knowledge.json:', err.message);
  }
  return null;
}

/**
 * Intelligent AI Reply Generator with Live Knowledge Base
 */
async function generateAiReply(userPrompt, userName) {
  const geminiKey = process.env.GEMINI_API_KEY || '';
  const openAiKey = process.env.OPENAI_API_KEY;

  const knowledge = getLiveBusinessKnowledge();

  let catalogText = '';
  let businessName = 'CyberMate Solutions';
  let ownerName = 'Muzaffar Iqbal Ishaati';
  let address = 'J.J Market, Sanhaula, Bhagalpur, Bihar 813205, India';
  let paymentInfo = '';
  let specialOffer = '';
  let phone = '9934215013';
  let email = 'muzaffarishaati@gmail.com';

  if (knowledge) {
    businessName = knowledge.businessProfile?.businessName || businessName;
    ownerName = knowledge.businessProfile?.ownerName || ownerName;
    address = knowledge.businessProfile?.address || address;
    phone = knowledge.businessProfile?.whatsappNumber || phone;
    email = knowledge.businessProfile?.email || email;
    paymentInfo = knowledge.businessProfile?.paymentDetails || '';
    specialOffer = knowledge.aiInstructions?.specialAnnouncement || '';

    const activeProds = (knowledge.products || []).filter((p) => p.status === 'active');
    catalogText = activeProds
      .map(
        (p) =>
          `*${p.name}* (${p.category} - ${p.itemType || 'service'})\nPrice: ${p.currency} ${Number(p.price).toLocaleString()} (${p.billingType})\nTurnaround: ${p.turnaround || 'Same Day'}\nWarranty: ${p.warranty || 'Available'}\nCompatible: ${p.compatibility || 'All Models'}\nDetails: ${p.description}\nFeatures: ${(p.features || []).join(', ')}`
      )
      .join('\n\n');
  }

  const upiId = knowledge?.paymentConfig?.upiId || '9934215013@upi';
  const payee = knowledge?.paymentConfig?.payeeName || ownerName;

  const systemPrompt = `
You are CyberMate AI, an intelligent, helpful, and courteous assistant for ${businessName}, owned by ${ownerName}.
Location: ${address} (Located in Bhagalpur, Bihar, India. All prices in Indian Rupees INR / ₹).
Mobile / WhatsApp: ${phone}
Official Email: ${email}
${knowledge?.aiInstructions?.systemPrompt || 'Reply concisely, politely, and helpfully.'}

CURRENT SERVICES & PRODUCTS PRICING CATALOG (INR ₹):
${catalogText}

SPECIAL PROMOTION:
${specialOffer}

PAYMENT METHODS (UPI & QR CODE ONLY - NO BANK ACCOUNTS):
- Official UPI ID: ${upiId}
- Payee Name: ${payee}
- Payment QR Code: Official QR Code is automatically sent to the customer
- Apps: PhonePe, Google Pay, Paytm, BHIM UPI
- IMPORTANT RULE: NEVER mention bank accounts, IFSC codes, or net banking.

RULES:
1. Always give the exact price from the catalog in INR (₹) when asked about costs, rates, or prices.
2. The business is located at J.J Market, Sanhaula, Bhagalpur, Bihar 813205, India. Owner is Muzaffar Iqbal Ishaati.
3. LANGUAGE POLICY (CRITICAL): Respond in the EXACT SAME language the customer uses:
   - If the customer writes in English: Reply in clear, polite English.
   - If the customer writes in Hindi (हिंदी script): Reply in polite Hindi.
   - If the customer writes in Roman Urdu or Hinglish: Reply in natural, friendly Roman Urdu / Hinglish.
   - If the customer writes in Urdu: Reply in polite Urdu.
   Always match the customer's language and tone seamlessly.
4. Keep replies clean and concise for WhatsApp mobile screen (use asterisks for bold, bullet points for lists). Avoid HTML or tables.
`.trim();

  // 1. Google Gemini AI Engine
  if (geminiKey) {
    const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
    for (const model of models) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: `${systemPrompt}\n\nCustomer: ${userName}\nMessage: ${userPrompt}\nReply:` },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 350,
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (reply) {
            console.log(`[Gemini AI (${model})] Generated live reply for ${userName}`);
            return reply;
          }
        }
      } catch (err) {
        console.warn(`[Gemini AI (${model}) Error]`, err.message);
      }
    }
  }

  // 2. OpenAI Engine
  if (openAiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: `User Name: ${userName}\nMessage: ${userPrompt}`,
            },
          ],
          max_tokens: 350,
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (reply) return reply;
      }
    } catch (err) {
      console.error('[OpenAI Engine Error]', err);
    }
  }

  // 3. Intelligent Fallback with Live Product Prices (Language Adaptive)
  const lower = userPrompt.toLowerCase();
  const isHindiScript = /[\u0900-\u097F]/.test(userPrompt);
  const isUrduScript = /[\u0600-\u06FF]/.test(userPrompt);
  const isHinglishRomanUrdu = /\b(kahan|kaise|karo|karein|kitna|kitne|kya|hai|hain|nhi|nahi|bhejo|dukan|paise|kharcha|bhai|aap|hum|chahiye|shamil|sampark|batayein|mujhe|mera|meri|karna|hoga|batao)\b/i.test(userPrompt);
  const isEnglish = !isHindiScript && !isUrduScript && !isHinglishRomanUrdu;

  const activeProds = (knowledge?.products || []).filter((p) => p.status === 'active');

  // Match product
  const matched = activeProds.find((p) => {
    const words = p.name.toLowerCase().split(' ');
    return (
      lower.includes(p.name.toLowerCase()) ||
      words.some((w) => w.length > 3 && lower.includes(w))
    );
  });

  if (
    lower.includes('price') ||
    lower.includes('rate') ||
    lower.includes('cost') ||
    lower.includes('charge') ||
    lower.includes('kitna') ||
    lower.includes('kya hai')
  ) {
    if (matched) {
      if (isEnglish) {
        return `Hello ${userName}! 👋\n\n📌 *${matched.name}* rate is *${matched.currency} ${Number(matched.price).toLocaleString()}* (${matched.billingType}).\n\n✨ *Includes:*\n${(matched.features || []).map((f) => `• ${f}`).join('\n')}\n\n${matched.description}\n\n⏱️ *Turnaround:* ${matched.turnaround || 'Fast'}\n🛡️ *Warranty:* ${matched.warranty || 'Available'}\n\nWould you like to book this service or visit our shop?`;
      }
      return `Hello ${userName}! 👋\n\n📌 *${matched.name}* ka current rate *${matched.currency} ${Number(matched.price).toLocaleString()}* (${matched.billingType}) hai.\n\n✨ *Isme shamil hai:*\n${(matched.features || []).map((f) => `• ${f}`).join('\n')}\n\n${matched.description}\n\nAapko iske baare mein mazeed details chahiye ya booking karni hai?`;
    }

    const priceList = activeProds
      .map((p) => `• *${p.name}*: ${p.currency} ${Number(p.price).toLocaleString()} (${p.billingType})`)
      .join('\n');
    if (isEnglish) {
      return `Hello ${userName}! 👋\n\nHere are our official service rates at *${businessName}*:\n\n${priceList}\n\n${specialOffer ? `🎉 *Special Announcement:* ${specialOffer}\n\n` : ''}Which service or product are you interested in?`;
    }
    return `Hello ${userName}! 👋\n\n*${businessName}* ki current service rates yeh hain:\n\n${priceList}\n\n${specialOffer ? `🎉 *Special Offer:* ${specialOffer}\n\n` : ''}Aapko kis service mein interest hai?`;
  }

  if (lower.includes('discount') || lower.includes('kam') || lower.includes('off')) {
    if (isEnglish) {
      return `Hello ${userName}! Our rates are competitive and include genuine warranty. Combo packages receive special concession. ${specialOffer ? `(${specialOffer})` : ''}`;
    }
    return `Hello ${userName}! Hamari pricing competitive aur reasonable hai. Combo offers par 5-10% concession mil sakta hai. ${specialOffer ? `(${specialOffer})` : ''}`;
  }

  if (
    lower.includes('address') ||
    lower.includes('location') ||
    lower.includes('shop') ||
    lower.includes('kahan') ||
    lower.includes('dukan') ||
    lower.includes('bihar') ||
    lower.includes('sanhaula') ||
    lower.includes('bhagalpur')
  ) {
    if (isEnglish) {
      return `Hello ${userName}! 👋\n\n📍 *Store Address:*\n*${businessName}*\n${address}\n\n👤 *Owner:* ${ownerName}\n📱 *Mobile / WhatsApp:* ${phone}\n📧 *Email:* ${email}\n⏰ *Timings:* Mon - Sat: 09:30 AM - 08:30 PM (IST)`;
    }
    return `Hello ${userName}! 👋\n\n📍 *Shop Address:*\n*${businessName}*\n${address}\n\n👤 *Owner:* ${ownerName}\n📱 *Mobile / WhatsApp:* ${phone}\n📧 *Email:* ${email}\n⏰ *Timings:* Mon - Sat: 09:30 AM - 08:30 PM (IST)`;
  }

  if (
    lower.includes('contact') ||
    lower.includes('mobile number') ||
    lower.includes('phone number') ||
    lower.includes('whatsapp number') ||
    lower.includes('owner') ||
    lower.includes('muzaffar') ||
    lower.includes('ishaati')
  ) {
    if (isEnglish) {
      return `Hello ${userName}! 👋\n\n*CyberMate Solutions Contact Information:*\n👤 *Owner:* ${ownerName}\n📱 *Mobile / WhatsApp:* ${phone}\n📧 *Email:* ${email}\n📍 *Address:* ${address}`;
    }
    return `Hello ${userName}! 👋\n\n*CyberMate Solutions Contact:*\n👤 *Owner:* ${ownerName}\n📱 *Mobile / WhatsApp:* ${phone}\n📧 *Email:* ${email}\n📍 *Address:* ${address}`;
  }

  if (
    lower.includes('payment') ||
    lower.includes('pay') ||
    lower.includes('upi') ||
    lower.includes('qr') ||
    lower.includes('scanner') ||
    lower.includes('phonepe') ||
    lower.includes('gpay') ||
    lower.includes('google pay') ||
    lower.includes('paytm') ||
    lower.includes('bhim') ||
    lower.includes('paise kaise') ||
    lower.includes('kharcha kaise') ||
    lower.includes('code bhejo') ||
    lower.includes('scanner bhejo')
  ) {
    if (isEnglish) {
      return {
        type: 'payment_qr',
        upiId,
        payeeName: payee,
        caption: `Hello ${userName}! 👋\n\n💳 *CyberMate Solutions Official Payment Details*\n\n🔹 *UPI ID:* ${upiId}\n👤 *Payee Name:* ${payee}\n📲 *Accepted Apps:* PhonePe, Google Pay, Paytm, BHIM UPI\n\n📌 *Instructions:*\n1. Please scan the official Payment QR Code above or send payment to UPI ID *${upiId}*.\n2. Once paid, kindly share a screenshot on this WhatsApp chat to confirm your order or repair.\n\n*(Note: Instant and secure payment via UPI & QR Code only — no bank accounts required!)*`,
      };
    }
    return {
      type: 'payment_qr',
      upiId,
      payeeName: payee,
      caption: `Hello ${userName}! 👋\n\n💳 *CyberMate Solutions Official Payment Details*\n\n🔹 *UPI ID:* ${upiId}\n👤 *Payee Name:* ${payee}\n📲 *Accepted Apps:* PhonePe, Google Pay, Paytm, BHIM UPI\n\n📌 *Instructions:*\n1. Upar diya gaya official Payment QR Code scan karein ya UPI ID *${upiId}* par bhej dein.\n2. Payment complete hone par screenshot isi WhatsApp number par share kar dein taake aapka order/repair confirm ho sake!\n\n*(Note: Bank account ya net banking ki zaroorat nahi hai - QR code & UPI se turant payment ho jata hai!)*`,
    };
  }

  // Match CMS FAQ
  const faqs = knowledge?.faqs || [];
  const matchedFaq = faqs.find((f) => {
    const qLower = f.question.toLowerCase();
    const words = qLower.split(' ').filter((w) => w.length > 3);
    return words.filter((w) => lower.includes(w)).length >= 2;
  });
  if (matchedFaq && !matched) {
    return `Hello ${userName}! 👋\n\n📌 *${matchedFaq.question}*\n\n${matchedFaq.answer}`;
  }

  if (lower.includes('hi') || lower.includes('hello') || lower.includes('salam') || lower.includes('hey') || lower.includes('namaste')) {
    if (isEnglish) {
      return `Hello ${userName}! 👋\n\nWelcome to *${businessName}* (J.J Market, Sanhaula, Bhagalpur, Bihar).\nOwner: ${ownerName}\n\nI can assist you with live rates for Mobile Repairing, Laptop & PC Servicing, Mobile Accessories, and Website Development. How may I help you today?`;
    }
    return `Namaste & Assalam-o-Alaikum ${userName}! 👋\n\nMain *${businessName}* (J.J Market, Sanhaula, Bhagalpur) ka AI Assistant hoon.\nOwner: ${ownerName}\n\nMain aapko Mobile Repairing, Laptop Service, Mobile Accessories, aur Website Development ke rates aur details bata sakta hoon. Aap kis cheez ki jaankari lena chahte hain?`;
  }

  if (isEnglish) {
    return `Hello ${userName}! Thank you for messaging CyberMate Solutions. How can I assist you with our services, repair rates, or store location?`;
  }
  return `Hello ${userName}! Aapka message mila: "${userPrompt}".\n\nHamari team ya AI system aapki query process kar raha hai. Agar aapko rates ya services jaanni hain toh batayein!`;
}

/**
 * Start Baileys WhatsApp Connection
 */
async function startWhatsAppBot() {
  const authDir = path.resolve(process.cwd(), 'auth_info_baileys');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const { version } = await fetchLatestBaileysVersion();

  console.log(`\n========================================`);
  console.log(`🤖 Starting CyberMate WhatsApp AI Bot (Baileys v${version.join('.')})`);
  console.log(`🌐 Web Dashboard & QR Link: http://localhost:3001`);
  console.log(`========================================\n`);

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    auth: state,
    browser: Browsers.ubuntu('Chrome'),
    syncFullHistory: false,
    generateHighQualityLinkPreview: false,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      currentRawQr = qr;
      connectionStatus = 'waiting_qr';
      try {
        currentQrCodeDataUrl = await QRCode.toDataURL(qr, { margin: 2, scale: 8 });
      } catch (e) {
        console.error('Failed to generate QR data URL:', e);
      }

      console.log('\n📱 --- SCAN THIS QR CODE IN WHATSAPP ---');
      console.log('Open WhatsApp > Settings > Linked Devices > Link a Device\n');
      qrcodeTerminal.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const isLoggedOut = statusCode === DisconnectReason.loggedOut;
      connectionStatus = isLoggedOut ? 'waiting_qr' : 'disconnected';
      currentQrCodeDataUrl = null;
      currentRawQr = null;

      logMessage('system', 'Connection', `Closed (Code ${statusCode || 'unknown'}). Reconnecting...`);

      if (isLoggedOut) {
        console.log('⚠️ Device logged out. Wiping session and generating fresh QR...');
        try {
          fs.rmSync(authDir, { recursive: true, force: true });
        } catch (_) {}
        connectedUser = null;
        setTimeout(startWhatsAppBot, 2000);
      } else {
        setTimeout(startWhatsAppBot, 3000);
      }
    } else if (connection === 'open') {
      connectionStatus = 'connected';
      currentQrCodeDataUrl = null;
      currentRawQr = null;
      connectedUser = sock.user?.id || 'Connected User';
      const cleanPhone = connectedUser.split(':')[0] || connectedUser.split('@')[0];

      logMessage('system', 'WhatsApp', `Connected successfully as +${cleanPhone}`);
      console.log(`\n✅ WHATSAPP CONNECTED SUCCESSFULLY! +${cleanPhone}\n`);
    }
  });

  // Handle incoming messages
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    // Process both incoming external messages ('notify') and self messages sent from phone ('append')
    if (type !== 'notify' && type !== 'append') return;

    for (const msg of messages) {
      // Ignore if this message was sent by the bot itself
      if (msg.key?.id && botSentMessageIds.has(msg.key.id)) {
        botSentMessageIds.delete(msg.key.id);
        continue;
      }

      const remoteJid = msg.key?.remoteJid;
      if (!remoteJid || remoteJid.endsWith('@g.us') || remoteJid === 'status@broadcast') continue;

      // Detect if user is testing by messaging themselves ("Message Yourself" in WhatsApp)
      const myPhone = connectedUser ? connectedUser.split(':')[0].replace(/\D/g, '') : '';
      const cleanRemote = remoteJid.replace('@s.whatsapp.net', '').replace(/:\d+/, '').replace('@lid', '');
      const isChatWithSelf = Boolean(
        (myPhone && (cleanRemote === myPhone || remoteJid.includes(myPhone))) ||
        (sock.user?.lid && remoteJid.includes(sock.user.lid.split(':')[0]))
      );

      // If message is fromMe, only process it if it's sent to self (Self-Test).
      // If sent to someone else from our phone, ignore so we don't interfere with manual chats.
      if (msg.key.fromMe && !isChatWithSelf) {
        continue;
      }

      // Extract message text
      const messageContent =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        '';

      if (!messageContent.trim()) continue;

      // Loop guard: never reply to our own AI reply
      if (lastAiResponseText && messageContent.trim() === lastAiResponseText.trim()) {
        continue;
      }

      const pushName = isChatWithSelf ? 'Boss (Self-Test)' : (msg.pushName || 'Friend');
      const logSender = isChatWithSelf ? `Self (+${cleanRemote})` : `+${cleanRemote}`;

      logMessage('incoming', logSender, messageContent);

      // Anti-spam cooldown: max 1 reply per 3 seconds per user
      const now = Date.now();
      const lastReply = userCooldowns.get(cleanRemote) || 0;
      if (now - lastReply < 3000) {
        console.log(`⏳ Cooldown active for +${cleanRemote}, skipping reply.`);
        continue;
      }
      userCooldowns.set(cleanRemote, now);

      try {
        // Show "typing..." presence indicator
        await sock.sendPresenceUpdate('composing', remoteJid);

        // Generate AI Reply
        const aiResponse = await generateAiReply(messageContent, pushName);
        const textForRecord = typeof aiResponse === 'object' ? aiResponse.caption : String(aiResponse);
        lastAiResponseText = textForRecord;

        // Small realistic typing delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Send AI reply (Photo with QR if payment query, else regular text)
        let sent;
        if (aiResponse && typeof aiResponse === 'object' && aiResponse.type === 'payment_qr') {
          const qrPath = path.resolve(process.cwd(), 'public', 'uploads', 'payment-qr.png');
          if (fs.existsSync(qrPath)) {
            sent = await sock.sendMessage(remoteJid, {
              image: fs.readFileSync(qrPath),
              caption: aiResponse.caption,
            });
          } else {
            sent = await sock.sendMessage(remoteJid, { text: aiResponse.caption });
          }
        } else {
          sent = await sock.sendMessage(remoteJid, { text: textForRecord });
        }

        if (sent?.key?.id) {
          botSentMessageIds.add(sent.key.id);
          setTimeout(() => botSentMessageIds.delete(sent.key.id), 60000);
        }

        await sock.sendPresenceUpdate('paused', remoteJid);

        logMessage('outgoing', logSender, typeof aiResponse === 'object' ? `[📷 Payment QR Photo Sent] ${aiResponse.caption}` : textForRecord);
      } catch (err) {
        console.error(`Failed to send AI reply to +${cleanRemote}:`, err);
      }
    }
  });

  return sock;
}

const DASHBOARD_USER = process.env.DASHBOARD_USER || 'admin';
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'cybermate123';

function checkAuth(req, res) {
  // Allow health check without authentication for uptime monitors (cron-job.org)
  if (req.url === '/health') return true;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Basic ')) {
    const creds = Buffer.from(authHeader.slice(6), 'base64').toString('utf8').split(':');
    const user = creds[0];
    const pass = creds.slice(1).join(':');

    if (user === DASHBOARD_USER && pass === DASHBOARD_PASSWORD) {
      return true;
    }
  }

  res.writeHead(401, {
    'WWW-Authenticate': 'Basic realm="CyberMate Admin Area"',
    'Content-Type': 'text/html; charset=utf-8',
  });
  res.end('<h1>401 Unauthorized</h1><p>CyberMate Dashboard is password-protected. Please enter username and password.</p>');
  return false;
}

/**
 * Lightweight Local Web Dashboard for QR Code & Live Logs
 */
const server = http.createServer((req, res) => {
  if (!checkAuth(req, res)) return;
  if (req.url === '/reset') {
    const authDir = path.resolve(process.cwd(), 'auth_info_baileys');
    try { fs.rmSync(authDir, { recursive: true, force: true }); } catch (_) {}
    connectedUser = null;
    connectionStatus = 'initializing';
    currentQrCodeDataUrl = null;
    currentRawQr = null;
    recentLogs = [];
    logMessage('system', 'Session', 'Manual session reset triggered. Generating new QR...');
    setTimeout(startWhatsAppBot, 1000);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, message: 'Session reset. Generating fresh QR...' }));
  }

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, status: connectionStatus, user: connectedUser }));
  }

  if (req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(
      JSON.stringify({
        status: connectionStatus,
        user: connectedUser,
        qr: currentQrCodeDataUrl,
        logs: recentLogs,
      })
    );
  }

  // HTML Dashboard
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CyberMate WhatsApp AI Gateway</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111726;
      --border: #1f293d;
      --accent: #25d366;
      --text: #f3f4f6;
      --muted: #9ca3af;
    }
    body {
      margin: 0;
      padding: 2rem 1rem;
      background: var(--bg);
      color: var(--text);
      font-family: 'Inter', sans-serif;
      display: flex;
      justify-content: center;
    }
    .container {
      max-width: 680px;
      width: 100%;
    }
    .header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--accent);
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.8rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .status-connected {
      background: rgba(37, 211, 102, 0.15);
      color: #25d366;
      border: 1px solid rgba(37, 211, 102, 0.3);
    }
    .status-waiting {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }
    .qr-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
      background: #ffffff;
      border-radius: 12px;
      width: fit-content;
      margin: 1.5rem auto;
    }
    .qr-box img {
      width: 260px;
      height: 260px;
      display: block;
    }
    .instructions {
      font-size: 0.9rem;
      color: var(--muted);
      line-height: 1.6;
    }
    .instructions ol {
      padding-left: 1.2rem;
      margin-top: 0.5rem;
    }
    .logs-header {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .log-item {
      padding: 0.6rem 0.8rem;
      background: #0d121f;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      font-size: 0.85rem;
      border-left: 3px solid var(--accent);
    }
    .log-item.incoming {
      border-left-color: #3b82f6;
    }
    .log-meta {
      font-size: 0.75rem;
      color: var(--muted);
      margin-bottom: 0.2rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">📱 CyberMate WhatsApp AI Bot</div>
      <p style="color: var(--muted); margin-top: 0.5rem;">Personal WhatsApp Auto-Reply & Intelligent AI Assistant</p>
    </div>

    <div class="card" id="connection-card">
      <div id="status-badge" class="status-badge status-waiting">⏳ Checking Connection...</div>
      
      <div id="qr-container" style="display: none; text-align: center;">
        <h3 style="margin: 0; color: #fff;">Scan to Link Your WhatsApp</h3>
        <p class="instructions" style="text-align: center;">Open WhatsApp on your phone &gt; Settings &gt; Linked Devices &gt; Link a Device</p>
        <div class="qr-box">
          <img id="qr-img" src="" alt="WhatsApp QR Code" />
        </div>
      </div>

      <div id="connected-container" style="display: none; text-align: center; padding: 1.5rem 0;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎉</div>
        <h2 style="margin: 0; color: #25d366;">WhatsApp Connected & Active!</h2>
        <p style="color: var(--muted); margin-top: 0.5rem;" id="user-display">Your personal WhatsApp is now linked.</p>
        <div style="margin-top: 1rem; padding: 1rem; background: rgba(37, 211, 102, 0.08); border-radius: 8px; border: 1px solid rgba(37, 211, 102, 0.2); font-size: 0.9rem;">
          ✨ <b>AI Auto-Reply is running!</b> Jab bhi koi aapke number par direct message karega, AI usko automatic instant reply bhejega.
        </div>
        <div style="margin-top: 1.2rem;">
          <button onclick="resetSession()" style="background: transparent; border: 1px solid var(--border); color: var(--muted); padding: 0.4rem 0.9rem; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">
            🔄 Reconnect / Reset Session
          </button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="logs-header">
        <span>💬 Live Activity Logs</span>
        <span style="font-size: 0.75rem; color: var(--muted);" id="refresh-indicator">Auto-refreshing</span>
      </div>
      <div id="logs-container">
        <div style="color: var(--muted); font-size: 0.85rem; text-align: center; padding: 1rem;">No messages yet. Send a test WhatsApp message to your linked number!</div>
      </div>
    </div>
  </div>

  <script>
    async function updateStatus() {
      try {
        const res = await fetch('/status');
        const data = await res.json();

        const badge = document.getElementById('status-badge');
        const qrContainer = document.getElementById('qr-container');
        const connectedContainer = document.getElementById('connected-container');
        const qrImg = document.getElementById('qr-img');
        const userDisplay = document.getElementById('user-display');
        const logsContainer = document.getElementById('logs-container');

        if (data.status === 'connected') {
          badge.className = 'status-badge status-connected';
          badge.innerHTML = '🟢 Connected & AI Auto-Reply Active';
          qrContainer.style.display = 'none';
          connectedContainer.style.display = 'block';
          if (data.user) {
            userDisplay.innerText = 'Connected Account: +' + data.user.split(':')[0].replace(/\\D/g, '');
          }
        } else if (data.status === 'waiting_qr' && data.qr) {
          badge.className = 'status-badge status-waiting';
          badge.innerHTML = '📱 Scan QR Code with WhatsApp';
          qrContainer.style.display = 'block';
          connectedContainer.style.display = 'none';
          qrImg.src = data.qr;
        } else {
          badge.className = 'status-badge status-waiting';
          badge.innerHTML = '⏳ Initializing WhatsApp client...';
          qrContainer.style.display = 'none';
          connectedContainer.style.display = 'none';
        }

        if (data.logs && data.logs.length > 0) {
          logsContainer.innerHTML = data.logs.map(log => \`
            <div class="log-item \${log.direction}">
              <div class="log-meta">
                <b>\${log.direction === 'incoming' ? '📥 Incoming' : '📤 AI Auto-Reply'}</b> • \${log.from} • \${log.time}
              </div>
              <div>\${log.text}</div>
            </div>
          \`).join('');
        }
      } catch (e) {
        console.error(e);
      }
    }

    async function resetSession() {
      if (!confirm('Kya aap WhatsApp session reset karke naya QR code generate karna chahte hain?')) return;
      try {
        await fetch('/reset');
        setTimeout(updateStatus, 1000);
      } catch (e) {
        alert('Error resetting session: ' + e.message);
      }
    }

    setInterval(updateStatus, 2000);
    updateStatus();
  </script>
</body>
</html>`);
});

const PORT = process.env.PORT || process.env.WHATSAPP_PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Web Dashboard & QR Link running on http://0.0.0.0:${PORT}`);
  startWhatsAppBot().catch((err) => {
    console.error('Fatal error starting WhatsApp Bot:', err);
  });
});
