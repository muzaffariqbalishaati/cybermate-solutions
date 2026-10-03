import { NextResponse } from "next/server";

export async function GET() {
  const isVercel = !!process.env.VERCEL;
  const environment = process.env.NODE_ENV || "development";

  return NextResponse.json({
    name: "OpenClaw AI Gateway",
    version: "2026.9.2-serverless",
    status: "healthy",
    deployment: isVercel ? "Vercel Serverless" : "Local Development",
    region: process.env.VERCEL_REGION || "local-iad1",
    timestamp: new Date().toISOString(),
    channels: {
      telegram: { status: "ready", webhook: "/api/webhook/telegram" },
      slack: { status: "ready", webhook: "/api/webhook/slack" },
      discord: { status: "standby" },
      whatsapp: { status: "ready", webhook: "/api/webhook/whatsapp" },
    },
    capabilities: [
      "autonomous_tools",
      "model_routing",
      "multi_channel_bus",
      "persistent_memory",
      "vercel_ai_gateway",
    ],
    uptimeSec: Math.floor(process.uptime()),
  });
}
