import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Slack URL Verification Challenge (Required when saving webhook URL in Slack App Console)
    if (body.type === "url_verification") {
      return NextResponse.json({ challenge: body.challenge });
    }

    // Process Slack Event (e.g. app_mention, message)
    if (body.event) {
      console.log("[OpenClaw Slack Event]:", body.event.type, body.event.text);
    }

    return NextResponse.json({ ok: true, source: "OpenClaw Slack Gateway" });
  } catch (err) {
    console.error("Slack webhook error:", err);
    return NextResponse.json({ ok: false, error: "Failed to process event" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Slack Webhook Ready",
    challengeSupport: true,
  });
}
