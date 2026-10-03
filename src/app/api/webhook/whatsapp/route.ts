import { NextResponse } from "next/server";

// Verification token configured in Meta Developer Portal
const DEFAULT_VERIFY_TOKEN = "openclaw_secret_token";
const DEFAULT_GEMINI_KEY = "";

/**
 * Intelligent AI Reply Generator
 * Routes incoming WhatsApp messages to OpenAI GPT-4o-mini (or custom model)
 * with a friendly fallback engine if API key is not yet set.
 */
async function generateAiReply(userPrompt: string, userName: string): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY || DEFAULT_GEMINI_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  const systemPrompt =
    process.env.AI_SYSTEM_PROMPT ||
    "You are CyberMate AI, an intelligent, helpful, and courteous assistant for CyberMate Solutions. Reply to WhatsApp messages concisely, politely, and helpfully. Keep messages natural and easy to read on mobile. You can respond in the language the user speaks (Hindi, English, Hinglish, etc.). Avoid markdown tables and keep formatting clean for WhatsApp.";

  // 1. Google Gemini AI Engine (Free & Fast)
  if (geminiKey) {
    const models = ["gemini-3.5-flash-lite", "gemini-3.8-flash"];
    for (const model of models) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: `${systemPrompt}\n\nUser Name: ${userName}\nUser Message: ${userPrompt}` },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 350,
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (reply) {
            console.log(`[WhatsApp AI Webhook (Gemini ${model})] Reply sent to ${userName}`);
            return reply;
          }
        }
      } catch (err) {
        console.warn(`[WhatsApp AI Webhook (Gemini ${model}) Error]`, err);
      }
    }
  }

  // 2. OpenAI Engine
  if (openAiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: `User Name: ${userName}\nMessage: ${userPrompt}`,
            },
          ],
          max_tokens: 350,
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMessage = data.choices?.[0]?.message?.content?.trim();
        if (aiMessage) return aiMessage;
      } else {
        const errText = await res.text();
        console.error("[WhatsApp AI] OpenAI error:", errText);
      }
    } catch (e) {
      console.error("[WhatsApp AI] Failed to generate AI reply:", e);
    }
  }

  // Fallback intelligent agent rules if API call fails
  const lower = userPrompt.toLowerCase();
  if (
    lower.includes("hi") ||
    lower.includes("hello") ||
    lower.includes("hey") ||
    lower.includes("namaste") ||
    lower.includes("salam") ||
    lower.includes("kaise ho")
  ) {
    return `Namaste ${userName}! 🙏\n\nMain CyberMate Solutions ka AI Assistant hoon. Main aapki kya madad kar sakta hoon?`;
  }

  if (
    lower.includes("service") ||
    lower.includes("kaam") ||
    lower.includes("price") ||
    lower.includes("cost") ||
    lower.includes("charge")
  ) {
    return `Hello ${userName}! CyberMate Solutions IT, Software, AI Automation aur Cloud solutions provide karta hai. Aapko kis project ya service ke baare mein jaankari chahiye?`;
  }

  if (lower.includes("contact") || lower.includes("call") || lower.includes("number")) {
    return `Aap humse email: muzaffar0641@gmail.com par ya is WhatsApp number par direct sampark kar sakte hain.`;
  }

  return `Hello ${userName}! Aapka message mila: "${userPrompt}".\n\nHamara automated AI system aapki query process kar raha hai. Agar aapko turant sahayata chahiye toh kripya apna sawaal detail mein batayein!`;
}

/**
 * GET Handler - Webhook Verification Challenge from Meta (Facebook)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || DEFAULT_VERIFY_TOKEN;

  // Check if this is Meta's verification challenge
  if (mode && token) {
    if (mode === "subscribe" && token === verifyToken) {
      console.log("[WhatsApp Webhook] Verification successful!");
      return new Response(challenge || "", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    } else {
      console.warn("[WhatsApp Webhook] Verification token mismatch:", token);
      return new Response("Forbidden: Invalid verification token", { status: 403 });
    }
  }

  // Fallback status check
  return NextResponse.json({
    status: "WhatsApp Webhook Active",
    endpoint: "/api/webhook/whatsapp",
    handler: "OpenClaw Meta Cloud API Gateway",
    verificationStatus: "Ready",
    aiEngine: (process.env.GEMINI_API_KEY || DEFAULT_GEMINI_KEY)
      ? "Google Gemini AI (Active)"
      : process.env.OPENAI_API_KEY
      ? "OpenAI GPT-4o-mini (Active)"
      : "Intelligent Fallback Engine (Ready)",
    defaultVerifyToken: verifyToken,
    instructions: {
      callbackUrl: "https://cybermate-solutions-alpha.vercel.app/api/webhook/whatsapp",
      verifyToken: verifyToken,
      webhookFields: ["messages"],
    },
  });
}

/**
 * POST Handler - Receiving messages from WhatsApp users and sending AI replies
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check if this is a WhatsApp API event
    if (body.object === "whatsapp_business_account" || body.entry) {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          const value = change.value;
          if (value?.messages && value.messages.length > 0) {
            const message = value.messages[0];
            const senderPhone = message.from; // Sender's WhatsApp phone number
            const messageId = message.id;
            const messageType = message.type;
            const messageText = message.text?.body || `[Media: ${messageType}]`;
            const contactName = value.contacts?.[0]?.profile?.name || "Friend";

            console.log(
              `[OpenClaw WhatsApp] Incoming from ${contactName} (+${senderPhone}): "${messageText}"`
            );

            // Generate AI Response
            const aiReply = await generateAiReply(messageText, contactName);

            // If Meta WhatsApp Cloud credentials are set, dispatch automated reply
            const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
            const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || value.metadata?.phone_number_id;

            if (accessToken && phoneNumberId) {
              const replyUrl = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;
              const replyBody = {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: senderPhone,
                type: "text",
                text: {
                  preview_url: false,
                  body: aiReply,
                },
              };

              const dispatchRes = await fetch(replyUrl, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(replyBody),
              });

              if (!dispatchRes.ok) {
                const errDetail = await dispatchRes.text();
                console.error("[OpenClaw WhatsApp] Error dispatching reply to Meta:", errDetail);
              } else {
                console.log(`[OpenClaw WhatsApp] Successfully sent AI reply to +${senderPhone}`);
              }
            } else {
              console.warn(
                "[OpenClaw WhatsApp] WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID missing in env vars. Reply generated but not dispatched to Meta."
              );
            }
          }
        }
      }

      // Meta requires a 200 OK fast response to acknowledge receipt
      return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
    }

    return NextResponse.json({ status: "Ignored, non-WhatsApp event" }, { status: 200 });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return NextResponse.json({ error: "Failed to process WhatsApp webhook" }, { status: 500 });
  }
}
