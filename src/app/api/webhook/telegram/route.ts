import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Log incoming Telegram update
    console.log("[OpenClaw Telegram Webhook] Received update:", body.update_id);

    // If message is present
    if (body.message && body.message.text) {
      const chatId = body.message.chat.id;
      const text = body.message.text;
      const user = body.message.from?.username || body.message.from?.first_name || "User";

      console.log(`[OpenClaw] Message from ${user} in ${chatId}: ${text}`);

      // If TELEGRAM_BOT_TOKEN is set, dispatch reply
      if (process.env.TELEGRAM_BOT_TOKEN) {
        const replyUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
        await fetch(replyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `🦅 [OpenClaw on Vercel]: Received "${text}". Processing agentic actions...`,
          }),
        }).catch((err) => console.error("Error sending Telegram reply:", err));
      }
    }

    return NextResponse.json({ ok: true, processedBy: "OpenClaw Vercel Gateway" });
  } catch (err) {
    console.error("Telegram webhook error:", err);
    return NextResponse.json({ ok: false, error: "Failed to parse update" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Telegram Webhook Active",
    endpoint: "/api/webhook/telegram",
    handler: "OpenClaw Serverless Gateway",
  });
}
