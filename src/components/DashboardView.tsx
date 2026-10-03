"use client";

import React, { useState, useMemo } from "react";

export interface DashboardViewProps {
  onNavigateTab: (tab: "chat" | "channels" | "tools" | "logs" | "deploy") => void;
  onAddLog: (level: "INFO" | "SUCCESS" | "WARN" | "GATEWAY", message: string) => void;
}

interface StreamEvent {
  id: string;
  time: string;
  channel: "whatsapp" | "telegram" | "system" | "tool";
  channelLabel: string;
  title: string;
  detail: string;
  badge: string;
}

export default function DashboardView({ onNavigateTab, onAddLog }: DashboardViewProps) {
  const [timeframe, setTimeframe] = useState<"1h" | "6h" | "24h" | "7d">("24h");
  const [hoveredPoint, setHoveredPoint] = useState<{
    index: number;
    time: string;
    inbound: number;
    outbound: number;
    latency: number;
    x: number;
    y: number;
  } | null>(null);

  // Dynamic metrics state
  const [totalRequests, setTotalRequests] = useState(34892);
  const [tokensUsed, setTokensUsed] = useState(2.84);
  const [activeFleetCount, setActiveFleetCount] = useState(4);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSimulateModal, setShowSimulateModal] = useState(false);

  // Quick toggles state
  const [autonomousExecution, setAutonomousExecution] = useState(true);
  const [vectorMemory, setVectorMemory] = useState(true);
  const [rateLimiter, setRateLimiter] = useState(true);
  const [safeMode, setSafeMode] = useState(false);

  // Channels state
  const [channelPings, setChannelPings] = useState<Record<string, number>>({
    whatsapp: 24,
    telegram: 14,
    slack: 22,
    discord: 0,
  });

  // Agent workers list
  const [agents, setAgents] = useState([
    {
      id: "master",
      name: "OpenClaw Master Orchestrator",
      role: "Multi-channel routing & intent classification",
      model: "Claude 3.7 Sonnet",
      status: "active" as "active" | "paused",
      lastActive: "Just now",
      icon: "🦅",
      tasksDone: 1420,
    },
    {
      id: "whatsapp",
      name: "WhatsApp Concierge Agent",
      role: "Real-time Baileys auto-reply & FAQs",
      model: "GPT-4o",
      status: "active" as "active" | "paused",
      lastActive: "1m ago",
      icon: "💬",
      tasksDone: 890,
    },
    {
      id: "devops",
      name: "DevOps & Code Sandbox Operator",
      role: "Executes sandbox bash & git commits",
      model: "DeepSeek-R1",
      status: "active" as "active" | "paused",
      lastActive: "3m ago",
      icon: "🛠️",
      tasksDone: 432,
    },
    {
      id: "cron",
      name: "Vector Memory Syncer",
      role: "Cron `*/30 * * * *` Upstash sync",
      model: "Embeddings-v3",
      status: "active" as "active" | "paused",
      lastActive: "12m ago",
      icon: "⚡",
      tasksDone: 288,
    },
  ]);

  // Live Activity Stream
  const [eventStream, setEventStream] = useState<StreamEvent[]>([
    {
      id: "ev-1",
      time: "15:38:12",
      channel: "whatsapp",
      channelLabel: "WhatsApp",
      title: "Inbound Message Received",
      detail: "+1 (555) 019-2834: 'Can you check status of serverless build?'",
      badge: "200 OK",
    },
    {
      id: "ev-2",
      time: "15:37:45",
      channel: "tool",
      channelLabel: "Tool Engine",
      title: "Autonomous Tool Invoked",
      detail: "web_search: 'Next.js 16 Edge runtime serverless timeout limits'",
      badge: "SUCCESS",
    },
    {
      id: "ev-3",
      time: "15:36:20",
      channel: "telegram",
      channelLabel: "Telegram",
      title: "Bot Command Executed",
      detail: "@OpenClawAgentBot received /status in #dev-ops group",
      badge: "DISPATCHED",
    },
    {
      id: "ev-4",
      time: "15:35:02",
      channel: "system",
      channelLabel: "Memory Bus",
      title: "Vector Embeddings Cached",
      detail: "Indexed 18 dialogue turns to Upstash Vector DB (12ms)",
      badge: "SYNCED",
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Chart data based on timeframe
  const chartPoints = useMemo(() => {
    if (timeframe === "1h") {
      return [
        { label: "15:00", inbound: 24, outbound: 22, latency: 12 },
        { label: "15:10", inbound: 42, outbound: 38, latency: 15 },
        { label: "15:20", inbound: 31, outbound: 30, latency: 13 },
        { label: "15:30", inbound: 65, outbound: 61, latency: 18 },
        { label: "15:40", inbound: 89, outbound: 84, latency: 16 },
        { label: "15:50", inbound: 112, outbound: 108, latency: 14 },
        { label: "16:00", inbound: 94, outbound: 91, latency: 15 },
      ];
    } else if (timeframe === "6h") {
      return [
        { label: "10:00", inbound: 180, outbound: 172, latency: 14 },
        { label: "11:00", inbound: 310, outbound: 298, latency: 16 },
        { label: "12:00", inbound: 520, outbound: 504, latency: 22 },
        { label: "13:00", inbound: 410, outbound: 395, latency: 15 },
        { label: "14:00", inbound: 680, outbound: 660, latency: 17 },
        { label: "15:00", inbound: 890, outbound: 870, latency: 14 },
      ];
    } else if (timeframe === "24h") {
      return [
        { label: "00:00", inbound: 410, outbound: 398, latency: 12 },
        { label: "04:00", inbound: 180, outbound: 175, latency: 11 },
        { label: "08:00", inbound: 920, outbound: 890, latency: 18 },
        { label: "12:00", inbound: 1850, outbound: 1810, latency: 21 },
        { label: "16:00", inbound: 2420, outbound: 2360, latency: 16 },
        { label: "20:00", inbound: 1640, outbound: 1590, latency: 14 },
        { label: "23:59", inbound: 820, outbound: 800, latency: 13 },
      ];
    } else {
      // 7d
      return [
        { label: "Mon", inbound: 4800, outbound: 4650, latency: 14 },
        { label: "Tue", inbound: 5900, outbound: 5740, latency: 16 },
        { label: "Wed", inbound: 7200, outbound: 7010, latency: 15 },
        { label: "Thu", inbound: 6400, outbound: 6220, latency: 14 },
        { label: "Fri", inbound: 8100, outbound: 7920, latency: 19 },
        { label: "Sat", inbound: 4100, outbound: 3990, latency: 12 },
        { label: "Sun", inbound: 3600, outbound: 3510, latency: 11 },
      ];
    }
  }, [timeframe]);

  // Generate SVG path strings
  const { pathInbound, areaInbound, pathOutbound, areaOutbound, pointsData } = useMemo(() => {
    const width = 800;
    const height = 210;
    const padding = 30;

    const maxVal = Math.max(
      ...chartPoints.map((p) => Math.max(p.inbound, p.outbound)),
      10
    );

    const pts = chartPoints.map((p, i) => {
      const x = padding + (i / (chartPoints.length - 1)) * (width - padding * 2);
      const yIn = height - padding - (p.inbound / maxVal) * (height - padding * 2);
      const yOut = height - padding - (p.outbound / maxVal) * (height - padding * 2);
      return { x, yIn, yOut, ...p };
    });

    // Smooth Bezier Curve generator
    const makeBezierPath = (key: "yIn" | "yOut") => {
      if (pts.length === 0) return "";
      let d = `M ${pts[0].x} ${pts[0][key]}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const xMid = (pts[i].x + pts[i + 1].x) / 2;
        d += ` C ${xMid} ${pts[i][key]}, ${xMid} ${pts[i + 1][key]}, ${pts[i + 1].x} ${pts[i + 1][key]}`;
      }
      return d;
    };

    const pathIn = makeBezierPath("yIn");
    const pathOut = makeBezierPath("yOut");

    const areaIn = `${pathIn} L ${pts[pts.length - 1].x} ${height - padding} L ${pts[0].x} ${
      height - padding
    } Z`;
    const areaOut = `${pathOut} L ${pts[pts.length - 1].x} ${height - padding} L ${pts[0].x} ${
      height - padding
    } Z`;

    return {
      pathInbound: pathIn,
      areaInbound: areaIn,
      pathOutbound: pathOut,
      areaOutbound: areaOut,
      pointsData: pts,
    };
  }, [chartPoints]);

  // Handle Event Simulation
  const handleSimulate = (type: "whatsapp" | "telegram" | "slack" | "system") => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    let newEvent: StreamEvent;

    if (type === "whatsapp") {
      newEvent = {
        id: `ev-${Date.now()}`,
        time: timeStr,
        channel: "whatsapp",
        channelLabel: "WhatsApp",
        title: "⚡ Simulated Customer Query",
        detail: "+92 300 1234567: 'OpenClaw, generate executive summary of pending tasks.'",
        badge: "PROCESSED",
      };
      onAddLog("GATEWAY", "Inbound WhatsApp event received from +92 300 1234567. Baileys dispatched to Agent router.");
      showToast("✅ Inbound WhatsApp event simulated successfully! (+1 Request)");
    } else if (type === "telegram") {
      newEvent = {
        id: `ev-${Date.now()}`,
        time: timeStr,
        channel: "telegram",
        channelLabel: "Telegram",
        title: "⚡ Simulated Telegram /analyze Command",
        detail: "User @AlexDev sent '/analyze --deep' in channel #ops-monitoring",
        badge: "EXECUTED",
      };
      onAddLog("INFO", "Telegram webhook triggered: /analyze command processed by Claude 3.7 Sonnet.");
      showToast("✅ Telegram command simulated successfully! (14ms latency)");
    } else if (type === "slack") {
      newEvent = {
        id: `ev-${Date.now()}`,
        time: timeStr,
        channel: "system",
        channelLabel: "Slack",
        title: "⚡ Simulated Slack Event Mention",
        detail: "Channel #engineering: '@OpenClaw deploy current staging commit to Vercel'",
        badge: "VERIFIED",
      };
      onAddLog("SUCCESS", "Slack signature verified. Event bus queued deployment verification task.");
      showToast("✅ Slack mention simulated and routed!");
    } else {
      newEvent = {
        id: `ev-${Date.now()}`,
        time: timeStr,
        channel: "tool",
        channelLabel: "Cron Worker",
        title: "⚡ Scheduled Memory Sync Executed",
        detail: "Synchronized 48 contextual memory vectors to Upstash database.",
        badge: "COMPLETED",
      };
      onAddLog("INFO", "Memory Vector worker completed routine sync (0.42s).");
      showToast("✅ Memory sync worker triggered!");
    }

    setEventStream((prev) => [newEvent, ...prev.slice(0, 19)]);
    setTotalRequests((prev) => prev + 1);
    setTokensUsed((prev) => +(prev + 0.01).toFixed(2));
    setShowSimulateModal(false);
  };

  // Ping channel action
  const handlePingChannel = (ch: string) => {
    const lat = Math.floor(Math.random() * 15) + 10;
    setChannelPings((prev) => ({ ...prev, [ch]: lat }));
    showToast(`⚡ ${ch.toUpperCase()} gateway ping successful: ${lat}ms`);
    onAddLog("INFO", `Gateway heartbeat ping to ${ch} verified: ${lat}ms latency.`);
  };

  // Toggle agent status
  const handleToggleAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextStatus = a.status === "active" ? "paused" : "active";
          showToast(`Agent ${a.name} is now ${nextStatus.toUpperCase()}`);
          onAddLog("GATEWAY", `Agent "${a.name}" state updated to: ${nextStatus}`);
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  // Flush cache
  const handleFlushCache = () => {
    showToast("🧹 Session cache & temporary buffers flushed successfully!");
    onAddLog("SUCCESS", "Manual cache flush executed. 14 stale conversation context buffers cleared.");
  };

  // Export audit log
  const handleExportAudit = () => {
    const reportData = {
      gateway: "OpenClaw v2026.9.2",
      timestamp: new Date().toISOString(),
      uptime: "99.98%",
      totalRequests,
      tokensUsed: `${tokensUsed}M`,
      channels: channelPings,
      agents,
      recentEvents: eventStream,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `openclaw-audit-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("📥 OpenClaw Telemetry & Audit report exported!");
  };

  return (
    <div className="dashboard-container animate-fade-in">
      {/* Top Operations Status Ribbon */}
      <div className="dashboard-ribbon">
        <div className="ribbon-info">
          <div className="ribbon-badge-group">
            <span className="ribbon-tag online">
              <span className="pulse-dot"></span>
              GATEWAY: ONLINE
            </span>
            <span className="ribbon-tag region">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              VERCEL EDGE (iad1)
            </span>
            <span className="ribbon-tag uptime">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              UPTIME: 99.98%
            </span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Avg Roundtrip: <b style={{ color: "var(--accent-cyan)", fontFamily: "var(--font-mono)" }}>16ms</b> • Active
            Fleet: <b style={{ color: "#34d399", fontFamily: "var(--font-mono)" }}>{activeFleetCount} Workers</b>
          </div>
        </div>

        <div className="ribbon-actions">
          <button
            className="btn btn-primary"
            style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem" }}
            onClick={() => setShowSimulateModal(true)}
            id="dash-simulate-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Simulate Inbound Event
          </button>

          <button
            className="btn btn-secondary"
            style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
            onClick={handleFlushCache}
            title="Flush context & session cache"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Flush Cache
          </button>

          <button
            className="btn btn-secondary"
            style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
            onClick={handleExportAudit}
            title="Download Telemetry JSON"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* 4 Core KPI Metric Cards */}
      <div className="dashboard-kpi-grid">
        {/* KPI 1: Total Gateway Throughput */}
        <div className="kpi-card">
          <div>
            <div className="kpi-header">
              <span className="kpi-title">24h Inbound / Outbound</span>
              <div className="kpi-icon-badge cyan">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-value">{totalRequests.toLocaleString()}</span>
              <span className="kpi-trend positive">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
                +14.8%
              </span>
            </div>
          </div>
          <div>
            <div className="kpi-footer-text">
              19.4k Webhook triggers • 15.4k Agent dispatches
            </div>
            {/* Mini sparkline SVG */}
            <div style={{ height: "24px", marginTop: "0.5rem" }}>
              <svg width="100%" height="24" viewBox="0 0 180 24" fill="none">
                <path
                  d="M0 18 Q 30 22 60 12 T 120 8 T 180 4"
                  stroke="var(--accent-cyan)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* KPI 2: Token Consumption */}
        <div className="kpi-card">
          <div>
            <div className="kpi-header">
              <span className="kpi-title">LLM Token Burn Rate</span>
              <div className="kpi-icon-badge violet">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                  <line x1="6" y1="6" x2="6.01" y2="6" />
                  <line x1="6" y1="18" x2="6.01" y2="18" />
                </svg>
              </div>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-value">{tokensUsed}M</span>
              <span className="kpi-trend neutral">Est. $5.12</span>
            </div>
          </div>
          <div>
            <div className="kpi-footer-text">Claude 3.7: 58% • GPT-4o: 28% • DeepSeek: 14%</div>
            {/* Mini progress bar */}
            <div
              style={{
                height: "6px",
                background: "rgba(255, 255, 255, 0.08)",
                borderRadius: "999px",
                marginTop: "0.6rem",
                overflow: "hidden",
                display: "flex",
              }}
            >
              <div style={{ width: "58%", background: "var(--accent-cyan)" }}></div>
              <div style={{ width: "28%", background: "var(--accent-violet)" }}></div>
              <div style={{ width: "14%", background: "#10b981" }}></div>
            </div>
          </div>
        </div>

        {/* KPI 3: Channel Connectivity */}
        <div className="kpi-card">
          <div>
            <div className="kpi-header">
              <span className="kpi-title">Channels & Webhooks</span>
              <div className="kpi-icon-badge emerald">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-value">4 / 4</span>
              <span className="kpi-trend positive">100% HEALTH</span>
            </div>
          </div>
          <div>
            <div className="kpi-footer-text">
              WhatsApp Socket, Telegram, Slack & Discord
            </div>
            <div style={{ display: "flex", gap: "0.35rem", marginTop: "0.5rem" }}>
              <span style={{ fontSize: "0.7rem", padding: "0.15rem 0.4rem", background: "rgba(37, 211, 102, 0.15)", color: "#25d366", borderRadius: "4px" }}>
                WhatsApp: Ready
              </span>
              <span style={{ fontSize: "0.7rem", padding: "0.15rem 0.4rem", background: "rgba(36, 161, 222, 0.15)", color: "#24a1de", borderRadius: "4px" }}>
                Telegram: OK
              </span>
            </div>
          </div>
        </div>

        {/* KPI 4: Autonomous Tools & Success Rate */}
        <div className="kpi-card">
          <div>
            <div className="kpi-header">
              <span className="kpi-title">Tool Execution Health</span>
              <div className="kpi-icon-badge amber">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-value">99.4%</span>
              <span className="kpi-trend positive">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                8,421 runs
              </span>
            </div>
          </div>
          <div>
            <div className="kpi-footer-text">Web Search, Sandboxed Shell & Vector Lookup</div>
            <div style={{ fontSize: "0.725rem", color: "var(--accent-cyan)", marginTop: "0.5rem" }}>
              Avg tool latency: <b>380ms</b>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row: Traffic Flow & Model Distribution */}
      <div className="dashboard-grid-2-1">
        {/* Interactive SVG Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title-group">
              <h3>Gateway Event Throughput & Traffic Flow</h3>
              <p>Real-time telemetry showing Inbound Webhook Triggers vs Outbound Agent Responses</p>
            </div>

            <div className="timeframe-pill-group">
              {(["1h", "6h", "24h", "7d"] as const).map((tf) => (
                <button
                  key={tf}
                  className={`timeframe-pill ${timeframe === tf ? "active" : ""}`}
                  onClick={() => setTimeframe(tf)}
                >
                  {tf.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Chart Container */}
          <div className="svg-chart-container">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 800 210"
              preserveAspectRatio="none"
              style={{ overflow: "visible" }}
            >
              <defs>
                {/* Inbound Gradient (Cyan) */}
                <linearGradient id="gradientCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>

                {/* Outbound Gradient (Violet) */}
                <linearGradient id="gradientViolet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>

                {/* Neon filters */}
                <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.6" />
                </filter>
                <filter id="glowViolet" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#8b5cf6" floodOpacity="0.6" />
                </filter>
              </defs>

              {/* Grid Lines */}
              <line x1="30" y1="30" x2="770" y2="30" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />
              <line x1="30" y1="90" x2="770" y2="90" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />
              <line x1="30" y1="150" x2="770" y2="150" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />
              <line x1="30" y1="180" x2="770" y2="180" stroke="rgba(255, 255, 255, 0.1)" />

              {/* Area Fills */}
              <path d={areaInbound} fill="url(#gradientCyan)" />
              <path d={areaOutbound} fill="url(#gradientViolet)" />

              {/* Smooth Stroke Lines */}
              <path
                d={pathOutbound}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                filter="url(#glowViolet)"
                strokeLinecap="round"
              />
              <path
                d={pathInbound}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                filter="url(#glowCyan)"
                strokeLinecap="round"
              />

              {/* Interactive Points */}
              {pointsData.map((pt, idx) => (
                <g key={idx}>
                  {/* Point for Inbound */}
                  <circle
                    cx={pt.x}
                    cy={pt.yIn}
                    r={hoveredPoint?.index === idx ? 6 : 4}
                    fill="#06b6d4"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    style={{ cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={() =>
                      setHoveredPoint({
                        index: idx,
                        time: pt.label,
                        inbound: pt.inbound,
                        outbound: pt.outbound,
                        latency: pt.latency,
                        x: pt.x,
                        y: pt.yIn,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />

                  {/* X Axis Labels */}
                  <text
                    x={pt.x}
                    y="202"
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="11"
                    fontFamily="var(--font-mono)"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover Tooltip Card */}
            {hoveredPoint && (
              <div
                style={{
                  position: "absolute",
                  left: `${(hoveredPoint.x / 800) * 100}%`,
                  top: `${(hoveredPoint.y / 210) * 100}%`,
                  transform: "translate(-50%, -125%)",
                  background: "rgba(10, 15, 24, 0.95)",
                  border: "1px solid var(--accent-cyan)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                  zIndex: 20,
                }}
              >
                <div style={{ color: "var(--text-muted)", marginBottom: "0.2rem", fontFamily: "var(--font-mono)" }}>
                  Timestamp: {hoveredPoint.time}
                </div>
                <div style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>
                  ● Inbound: {hoveredPoint.inbound.toLocaleString()} reqs
                </div>
                <div style={{ color: "var(--accent-violet)", fontWeight: 600 }}>
                  ● Outbound: {hoveredPoint.outbound.toLocaleString()} replies
                </div>
                <div style={{ color: "#34d399", fontSize: "0.7rem", marginTop: "0.2rem" }}>
                  Roundtrip Latency: {hoveredPoint.latency}ms
                </div>
              </div>
            )}
          </div>

          {/* Chart Legend */}
          <div className="chart-legend">
            <div>
              <span className="legend-dot" style={{ background: "#06b6d4", boxShadow: "0 0 8px #06b6d4" }}></span>
              Inbound Webhooks
            </div>
            <div>
              <span className="legend-dot" style={{ background: "#8b5cf6", boxShadow: "0 0 8px #8b5cf6" }}></span>
              Agent Replies
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>
              Sampled every {timeframe === "1h" ? "10m" : timeframe === "6h" ? "1h" : "4h"}
            </div>
          </div>
        </div>

        {/* AI Model Allocation & Quotas */}
        <div className="chart-card models-breakdown-card">
          <div className="chart-header">
            <div className="chart-title-group">
              <h3>Model Routing & Cost Quotas</h3>
              <p>Dynamic token distribution across registered LLMs</p>
            </div>
          </div>

          <div>
            {/* Model 1: Claude 3.7 Sonnet */}
            <div className="model-bar-item">
              <div className="model-bar-label">
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Claude 3.7 Sonnet</span>
                <span style={{ color: "var(--accent-cyan)", fontFamily: "var(--font-mono)" }}>58% (1.64M tok)</span>
              </div>
              <div className="model-bar-track">
                <div className="model-bar-fill" style={{ width: "58%", background: "linear-gradient(90deg, #06b6d4, #0284c7)" }}></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                <span>Primary Agent Reasoning</span>
                <span>$3.28</span>
              </div>
            </div>

            {/* Model 2: GPT-4o */}
            <div className="model-bar-item">
              <div className="model-bar-label">
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>GPT-4o (Omni)</span>
                <span style={{ color: "var(--accent-violet)", fontFamily: "var(--font-mono)" }}>28% (795k tok)</span>
              </div>
              <div className="model-bar-track">
                <div className="model-bar-fill" style={{ width: "28%", background: "linear-gradient(90deg, #8b5cf6, #7c3aed)" }}></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                <span>WhatsApp Real-time Concierge</span>
                <span>$1.42</span>
              </div>
            </div>

            {/* Model 3: DeepSeek-R1 */}
            <div className="model-bar-item">
              <div className="model-bar-label">
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>DeepSeek-R1</span>
                <span style={{ color: "#10b981", fontFamily: "var(--font-mono)" }}>14% (397k tok)</span>
              </div>
              <div className="model-bar-track">
                <div className="model-bar-fill" style={{ width: "14%", background: "linear-gradient(90deg, #10b981, #059669)" }}></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                <span>Code Sandbox & Bash Synthesis</span>
                <span>$0.42</span>
              </div>
            </div>
          </div>

          {/* Quick jump to console button */}
          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem", marginTop: "1rem" }}>
            <button
              className="btn btn-secondary"
              style={{ width: "100%", justifyContent: "space-between" }}
              onClick={() => onNavigateTab("chat")}
            >
              <span>Switch to Agent Console</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Connected Channels & Webhook Matrix */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Connected Gateway Channels
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Serverless webhook bus and persistent socket integrations
            </p>
          </div>
          <button
            className="btn btn-ghost"
            style={{ fontSize: "0.8rem" }}
            onClick={() => onNavigateTab("channels")}
          >
            Configure Webhook Keys & Secrets →
          </button>
        </div>

        <div className="channels-grid">
          {/* Channel 1: WhatsApp */}
          <div className="channel-status-card">
            <div className="channel-card-top">
              <div className="channel-avatar whatsapp">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.676.15-.2.301-.776.979-.952 1.179-.175.2-.351.226-.652.076-.301-.15-1.272-.469-2.424-1.496-.897-.799-1.503-1.787-1.678-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.201-.301.302-.502.1-.2.05-.376-.025-.526-.075-.15-.677-1.631-.928-2.234-.244-.588-.493-.509-.677-.518-.175-.009-.376-.009-.576-.009-.2 0-.526.075-.802.376-.276.301-1.053 1.029-1.053 2.509s1.078 2.909 1.229 3.11c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.634.721.229 1.378.197 1.897.119.578-.087 1.78-.727 2.031-1.43.251-.703.251-1.304.176-1.43-.076-.126-.276-.201-.577-.351z"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.308C8.423 21.523 10.154 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.64 0-3.17-.48-4.46-1.31l-.32-.21-2.95.77.79-2.87-.23-.36C3.96 14.88 3.8 13.48 3.8 12c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2z"/>
                </svg>
              </div>
              <span className="status-indicator ready">
                <span className="pulse-dot"></span>
                SOCKET READY
              </span>
            </div>

            <div className="channel-details">
              <h4>WhatsApp Multi-Device</h4>
              <p>Baileys Socket • Auto-reconnect active</p>
            </div>

            <div className="channel-meta-row">
              <span style={{ color: "var(--text-muted)" }}>Ping:</span>
              <span style={{ color: "var(--accent-cyan)" }}>{channelPings.whatsapp}ms</span>
            </div>

            <button
              className="btn btn-secondary"
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.6rem" }}
              onClick={() => handlePingChannel("whatsapp")}
            >
              Ping Heartbeat
            </button>
          </div>

          {/* Channel 2: Telegram */}
          <div className="channel-status-card">
            <div className="channel-card-top">
              <div className="channel-avatar telegram">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 3.99-1.74 6.66-2.88 7.99-3.44 3.81-1.59 4.6-1.87 5.12-1.88.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.13-.04.2z"/>
                </svg>
              </div>
              <span className="status-indicator ready">
                <span className="pulse-dot"></span>
                WEBHOOK VERIFIED
              </span>
            </div>

            <div className="channel-details">
              <h4>Telegram Bot API</h4>
              <p>/api/webhook/telegram • TLS 1.3</p>
            </div>

            <div className="channel-meta-row">
              <span style={{ color: "var(--text-muted)" }}>Ping:</span>
              <span style={{ color: "var(--accent-cyan)" }}>{channelPings.telegram}ms</span>
            </div>

            <button
              className="btn btn-secondary"
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.6rem" }}
              onClick={() => handlePingChannel("telegram")}
            >
              Ping Webhook
            </button>
          </div>

          {/* Channel 3: Slack */}
          <div className="channel-status-card">
            <div className="channel-card-top">
              <div className="channel-avatar slack">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 15a2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-5zm2-8a2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2v2H9zm0 1a2 2 0 0 1 2 2 2 2 0 0 1-2 2H4a2 2 0 0 1-2-2 2 2 0 0 1 2-2h5zm8 2a2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 1-2 2h-2v-2zm-1 0a2 2 0 0 1-2 2 2 2 0 0 1-2-2V5a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5zm-2 8a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2 2 2 0 0 1 2-2h5a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-5z"/>
                </svg>
              </div>
              <span className="status-indicator ready">
                <span className="pulse-dot"></span>
                EVENTS 200 OK
              </span>
            </div>

            <div className="channel-details">
              <h4>Slack Events Bus</h4>
              <p>/api/webhook/slack • Signature verified</p>
            </div>

            <div className="channel-meta-row">
              <span style={{ color: "var(--text-muted)" }}>Ping:</span>
              <span style={{ color: "var(--accent-cyan)" }}>{channelPings.slack}ms</span>
            </div>

            <button
              className="btn btn-secondary"
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.6rem" }}
              onClick={() => handlePingChannel("slack")}
            >
              Ping Endpoint
            </button>
          </div>

          {/* Channel 4: Discord */}
          <div className="channel-status-card">
            <div className="channel-card-top">
              <div className="channel-avatar discord">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <span className="status-indicator standby">
                STANDBY
              </span>
            </div>

            <div className="channel-details">
              <h4>Discord Gateway</h4>
              <p>Bot Token ready for configuration</p>
            </div>

            <div className="channel-meta-row">
              <span style={{ color: "var(--text-muted)" }}>Shard:</span>
              <span style={{ color: "var(--accent-amber)" }}>0 / 1</span>
            </div>

            <button
              className="btn btn-secondary"
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.6rem" }}
              onClick={() => onNavigateTab("channels")}
            >
              Configure Token
            </button>
          </div>
        </div>
      </div>

      {/* Autonomous Agent Fleet & Live Stream Section */}
      <div className="dashboard-grid-fleet">
        {/* Agent Fleet Card */}
        <div className="fleet-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--text-primary)" }}>
                Active Agent Fleet & Workers
              </h3>
              <p style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
                Autonomous task workers coordinating multi-channel jobs
              </p>
            </div>
            <button
              className="btn btn-ghost"
              style={{ fontSize: "0.75rem" }}
              onClick={() => onNavigateTab("tools")}
            >
              Manage Skills →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {agents.map((agent) => (
              <div key={agent.id} className="agent-row-item">
                <div className="agent-identity">
                  <div className="agent-icon">{agent.icon}</div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className="agent-name">{agent.name}</span>
                      <span
                        style={{
                          fontSize: "0.65rem",
                          fontFamily: "var(--font-mono)",
                          padding: "0.1rem 0.4rem",
                          borderRadius: "4px",
                          background: "rgba(6, 182, 212, 0.12)",
                          color: "var(--accent-cyan)",
                        }}
                      >
                        {agent.model}
                      </span>
                    </div>
                    <div className="agent-desc">{agent.role}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
                      {agent.tasksDone.toLocaleString()} runs
                    </div>
                    <div style={{ fontSize: "0.7rem", color: agent.status === "active" ? "#34d399" : "var(--accent-amber)" }}>
                      ● {agent.status.toUpperCase()}
                    </div>
                  </div>

                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: "0.7rem", padding: "0.3rem 0.6rem" }}
                    onClick={() => handleToggleAgent(agent.id)}
                  >
                    {agent.status === "active" ? "Pause" : "Resume"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Security & Operations Switches */}
          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem", marginTop: "0.5rem" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
              Sandbox Security & Policy Controls
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.75rem", background: "rgba(0,0,0,0.2)", borderRadius: "6px" }}>
                <span style={{ fontSize: "0.75rem" }}>Autonomous Tooling</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={autonomousExecution}
                    onChange={(e) => setAutonomousExecution(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.75rem", background: "rgba(0,0,0,0.2)", borderRadius: "6px" }}>
                <span style={{ fontSize: "0.75rem" }}>Deep Vector Memory</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={vectorMemory}
                    onChange={(e) => setVectorMemory(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.75rem", background: "rgba(0,0,0,0.2)", borderRadius: "6px" }}>
                <span style={{ fontSize: "0.75rem" }}>Rate Limiting Guard</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={rateLimiter}
                    onChange={(e) => setRateLimiter(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.75rem", background: "rgba(0,0,0,0.2)", borderRadius: "6px" }}>
                <span style={{ fontSize: "0.75rem" }}>Safe Mode Only</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={safeMode}
                    onChange={(e) => setSafeMode(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Live Event Stream Card */}
        <div className="fleet-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--text-primary)" }}>
                Live Gateway Event Stream
              </h3>
              <p style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
                Inbound hooks, tool calls & telemetry feed
              </p>
            </div>
            <button
              className="btn btn-ghost"
              style={{ fontSize: "0.75rem" }}
              onClick={() => onNavigateTab("logs")}
            >
              Full Terminal →
            </button>
          </div>

          <div className="event-stream-container">
            {eventStream.map((ev) => (
              <div key={ev.id} className={`stream-event-item ${ev.channel}`}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem", minWidth: "55px" }}>
                  <span className="event-time">{ev.time}</span>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      color:
                        ev.channel === "whatsapp"
                          ? "#25d366"
                          : ev.channel === "telegram"
                          ? "#24a1de"
                          : ev.channel === "tool"
                          ? "var(--accent-amber)"
                          : "var(--accent-violet)",
                    }}
                  >
                    {ev.channelLabel}
                  </span>
                </div>

                <div className="event-content">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{ev.title}</span>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        fontFamily: "var(--font-mono)",
                        color: "var(--accent-cyan)",
                        background: "rgba(6, 182, 212, 0.1)",
                        padding: "0.1rem 0.35rem",
                        borderRadius: "3px",
                      }}
                    >
                      {ev.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.725rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                    {ev.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick simulation buttons row */}
          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem", marginTop: "auto" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              Quick Test Inbound Simulation:
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                className="btn btn-secondary"
                style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                onClick={() => handleSimulate("whatsapp")}
              >
                + WhatsApp Msg
              </button>
              <button
                className="btn btn-secondary"
                style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                onClick={() => handleSimulate("telegram")}
              >
                + Telegram /cmd
              </button>
              <button
                className="btn btn-secondary"
                style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                onClick={() => handleSimulate("slack")}
              >
                + Slack Mention
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Modal Drawer */}
      {showSimulateModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setShowSimulateModal(false)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: "520px",
              width: "100%",
              background: "rgba(13, 18, 29, 0.95)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
                ⚡ Simulate Inbound Gateway Event
              </h3>
              <button
                className="btn btn-ghost"
                style={{ padding: "0.2rem 0.5rem" }}
                onClick={() => setShowSimulateModal(false)}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
              Test how OpenClaw routes inbound webhooks, processes agent reasoning, and updates live telemetry metrics in real time.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button
                className="btn btn-secondary"
                style={{ justifyContent: "flex-start", padding: "0.75rem 1rem", textAlign: "left" }}
                onClick={() => handleSimulate("whatsapp")}
              >
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <div className="channel-avatar whatsapp" style={{ width: "32px", height: "32px" }}>
                    💬
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>WhatsApp Customer Inbound</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Simulate a customer message sent to Baileys socket gateway
                    </div>
                  </div>
                </div>
              </button>

              <button
                className="btn btn-secondary"
                style={{ justifyContent: "flex-start", padding: "0.75rem 1rem", textAlign: "left" }}
                onClick={() => handleSimulate("telegram")}
              >
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <div className="channel-avatar telegram" style={{ width: "32px", height: "32px" }}>
                    ✈️
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>Telegram /analyze Slash Command</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Simulate bot webhook trigger to /api/webhook/telegram
                    </div>
                  </div>
                </div>
              </button>

              <button
                className="btn btn-secondary"
                style={{ justifyContent: "flex-start", padding: "0.75rem 1rem", textAlign: "left" }}
                onClick={() => handleSimulate("slack")}
              >
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <div className="channel-avatar slack" style={{ width: "32px", height: "32px" }}>
                    #
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>Slack Channel @OpenClaw Mention</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Simulate signed Slack event delivery with challenge handshake
                    </div>
                  </div>
                </div>
              </button>

              <button
                className="btn btn-secondary"
                style={{ justifyContent: "flex-start", padding: "0.75rem 1rem", textAlign: "left" }}
                onClick={() => handleSimulate("system")}
              >
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <div className="channel-avatar" style={{ width: "32px", height: "32px", background: "rgba(139, 92, 246, 0.2)" }}>
                    ⏰
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>Trigger Scheduled Memory Vector Worker</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Simulate background cron task execution and embeddings sync
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Toast Alert Notification */}
      {toastMessage && (
        <div className="dashboard-toast">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
