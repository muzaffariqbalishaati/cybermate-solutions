"use client";

import React, { useState, useEffect } from "react";

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  billingType: string;
  currency: string;
  description: string;
  features: string[];
  status: "active" | "inactive";
}

export interface KnowledgePayload {
  businessProfile: {
    businessName: string;
    tagline: string;
    whatsappNumber: string;
    email: string;
    businessHours: string;
    currency: string;
    paymentDetails: string;
  };
  aiInstructions: {
    systemPrompt: string;
    pricingPolicy: string;
    discountPolicy: string;
    specialAnnouncement?: string;
    languageStyle?: string;
  };
  products: ProductItem[];
  lastUpdated?: string;
}

export default function PricingDashboardView() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Sub-tabs
  const [portalTab, setPortalTab] = useState<"products" | "instructions" | "business" | "test">("products");

  // Knowledge Data State
  const [knowledge, setKnowledge] = useState<KnowledgePayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // New Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProd, setNewProd] = useState<Partial<ProductItem>>({
    name: "",
    category: "Web Development",
    price: 20000,
    billingType: "One-time",
    currency: "PKR",
    description: "",
    features: [],
    status: "active",
  });
  const [newFeaturesInput, setNewFeaturesInput] = useState("");

  // AI Live Tester State
  const [testMessages, setTestMessages] = useState<Array<{ role: "user" | "assistant"; content: string; time: string }>>([
    {
      role: "assistant",
      content:
        "Assalam-o-Alaikum! Main CyberMate AI hoon. Main aapke business catalog aur current prices ke mutabiq trained hoon. Aap mujhse kisi bhi service ka rate pooch kar test kar sakte hain!",
      time: "Now",
    },
  ]);
  const [testInput, setTestInput] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  // Fetch initial knowledge
  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/knowledge");
      if (res.ok) {
        const data = await res.json();
        setKnowledge(data);
      }
    } catch (err) {
      console.error("Failed to load knowledge:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Login
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loginPassword.trim() === "admin123" || loginPassword.trim() === "cybermate" || loginPassword.trim() === "admin") {
      setIsLoggedIn(true);
      setLoginError("");
      showToast("✅ Welcome back! Logged in as Admin.");
    } else {
      setLoginError("Invalid password. Hint: admin123 or cybermate");
    }
  };

  // Save changes to API & Disk
  const saveKnowledgeChanges = async (customData?: KnowledgePayload) => {
    const dataToSave = customData || knowledge;
    if (!dataToSave) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (res.ok) {
        const resData = await res.json();
        setKnowledge(resData.data);
        showToast("💾 Saved! AI & WhatsApp Bot are now updated with the new prices & instructions!");
      } else {
        showToast("❌ Failed to save knowledge to server.");
      }
    } catch (err) {
      console.error(err);
      showToast("❌ Network error while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  // Quick inline price change
  const handlePriceChange = (productId: string, newPrice: number) => {
    if (!knowledge) return;
    const updated = {
      ...knowledge,
      products: knowledge.products.map((p) => (p.id === productId ? { ...p, price: newPrice } : p)),
    };
    setKnowledge(updated);
  };

  // Toggle Product Status
  const handleToggleStatus = (productId: string) => {
    if (!knowledge) return;
    const updated = {
      ...knowledge,
      products: knowledge.products.map((p) =>
        p.id === productId ? { ...p, status: p.status === "active" ? ("inactive" as const) : ("active" as const) } : p
      ),
    };
    setKnowledge(updated);
    saveKnowledgeChanges(updated);
  };

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    if (!knowledge) return;
    if (!confirm("Are you sure you want to remove this product/service?")) return;
    const updated = {
      ...knowledge,
      products: knowledge.products.filter((p) => p.id !== productId),
    };
    setKnowledge(updated);
    saveKnowledgeChanges(updated);
    showToast("🗑️ Product removed from catalog and AI context.");
  };

  // Add Product
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!knowledge || !newProd.name || !newProd.price) return;

    const featuresList = newFeaturesInput
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const productToAdd: ProductItem = {
      id: `prod-${Date.now()}`,
      name: newProd.name,
      category: newProd.category || "General",
      price: Number(newProd.price),
      billingType: newProd.billingType || "One-time",
      currency: knowledge.businessProfile.currency || "PKR",
      description: newProd.description || "",
      features: featuresList.length > 0 ? featuresList : ["Standard Support", "Quality Assurance"],
      status: "active",
    };

    const updated = {
      ...knowledge,
      products: [productToAdd, ...knowledge.products],
    };

    setKnowledge(updated);
    saveKnowledgeChanges(updated);
    setShowAddModal(false);
    setNewProd({
      name: "",
      category: "Web Development",
      price: 20000,
      billingType: "One-time",
      currency: "PKR",
      description: "",
      features: [],
      status: "active",
    });
    setNewFeaturesInput("");
    showToast(`✅ "${productToAdd.name}" added to catalog!`);
  };

  // Live Test Message
  const handleSendTestMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || testInput;
    if (!textToSend.trim() || isTesting) return;

    const userMsg = {
      role: "user" as const,
      content: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setTestMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setTestInput("");
    setIsTesting(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...testMessages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const aiReply = {
        role: "assistant" as const,
        content: data.reply || "Maaf kijiye, response receive nahi hua.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setTestMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error(err);
      setTestMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Connection error with AI endpoint.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTesting(false);
    }
  };

  // Filtered Products
  const filteredProducts = (knowledge?.products || []).filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set((knowledge?.products || []).map((p) => p.category)));

  // If locked, show Admin Login Portal
  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: "460px", margin: "4rem auto", padding: "1rem" }} className="animate-fade-in">
        <div className="glass-panel" style={{ textAlign: "center", padding: "2.5rem 2rem" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
              boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Business Knowledge & AI Login
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.3rem", marginBottom: "1.5rem" }}>
            Apne products ki pricing aur AI instructions update karne ke liye password enter karein.
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ textAlign: "left" }}>
              <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.35rem", display: "block" }}>
                Admin Password / PIN
              </label>
              <input
                type="password"
                className="chat-input-field"
                placeholder="Enter password (e.g. admin123)"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoFocus
                style={{ width: "100%", padding: "0.7rem 0.9rem" }}
              />
            </div>

            {loginError && (
              <div style={{ fontSize: "0.75rem", color: "var(--accent-rose)", textAlign: "left" }}>
                {loginError}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.7rem" }}>
              Login to Control Dashboard
            </button>

            <button
              type="button"
              className="btn btn-ghost"
              style={{ fontSize: "0.75rem", color: "var(--accent-cyan)" }}
              onClick={() => {
                setLoginPassword("admin123");
                setIsLoggedIn(true);
                showToast("✅ Logged in as Admin!");
              }}
            >
              ⚡ Quick 1-Click Demo Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isLoading || !knowledge) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-secondary)" }}>
        <span className="pulse-dot" style={{ display: "inline-block", marginRight: "0.5rem" }}></span>
        Loading business catalog & AI instructions...
      </div>
    );
  }

  return (
    <div className="dashboard-container animate-fade-in" style={{ gap: "1.25rem" }}>
      {/* Top Banner Ribbon */}
      <div className="dashboard-ribbon">
        <div className="ribbon-info">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {knowledge.businessProfile.businessName} — AI Knowledge & Pricing Hub
              </h2>
              <span className="ribbon-tag online">
                <span className="pulse-dot"></span>
                AI LIVE SYNCED
              </span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              Agar kal rate change ho, toh yahan price change karke <b>Save</b> karein — Web Chat aur WhatsApp Bot foran naya price batayenge!
            </div>
          </div>
        </div>

        <div className="ribbon-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
            id="btn-add-product"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            + Add Product / Service
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => saveKnowledgeChanges()}
            disabled={isSaving}
            style={{ borderColor: "var(--accent-cyan)", color: "var(--accent-cyan)" }}
            id="btn-save-all"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {isSaving ? "Saving..." : "Save & Sync to AI"}
          </button>

          <button
            className="btn btn-ghost"
            style={{ fontSize: "0.8rem" }}
            onClick={() => {
              setIsLoggedIn(false);
              showToast("Logged out of Admin.");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Portal Tabs Bar */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem", overflowX: "auto" }}>
        <button
          className={`nav-tab-button ${portalTab === "products" ? "active" : ""}`}
          onClick={() => setPortalTab("products")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          Products & Services Pricing ({knowledge.products.length})
        </button>

        <button
          className={`nav-tab-button ${portalTab === "instructions" ? "active" : ""}`}
          onClick={() => setPortalTab("instructions")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          AI Instructions & Behavior Rules
        </button>

        <button
          className={`nav-tab-button ${portalTab === "business" ? "active" : ""}`}
          onClick={() => setPortalTab("business")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          Business Profile & Payments
        </button>

        <button
          className={`nav-tab-button ${portalTab === "test" ? "active" : ""}`}
          onClick={() => setPortalTab("test")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          🧪 Test AI Pricing Live
        </button>
      </div>

      {/* TAB 1: PRODUCTS & SERVICES PRICING */}
      {portalTab === "products" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Quick Filter Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
              <input
                type="text"
                className="chat-input-field"
                placeholder="Search products or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "260px", padding: "0.45rem 0.8rem", fontSize: "0.825rem" }}
              />

              <div style={{ display: "flex", gap: "0.35rem" }}>
                <button
                  className={`timeframe-pill ${selectedCategory === "all" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("all")}
                >
                  All ({knowledge.products.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`timeframe-pill ${selectedCategory === cat ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Tip: Click directly on any price box to edit it instantly!
            </div>
          </div>

          {/* Product Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1.25rem" }}>
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="glass-panel"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "1rem",
                  borderColor: prod.status === "active" ? "rgba(6, 182, 212, 0.25)" : "rgba(255, 255, 255, 0.05)",
                  opacity: prod.status === "active" ? 1 : 0.6,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "4px",
                        background: "rgba(139, 92, 246, 0.15)",
                        color: "var(--accent-violet)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {prod.category}
                    </span>

                    <button
                      onClick={() => handleToggleStatus(prod.id)}
                      style={{
                        background: prod.status === "active" ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.08)",
                        color: prod.status === "active" ? "#34d399" : "var(--text-muted)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "var(--radius-full)",
                        padding: "0.15rem 0.55rem",
                        fontSize: "0.7rem",
                        cursor: "pointer",
                      }}
                    >
                      ● {prod.status === "active" ? "ACTIVE FOR AI" : "DRAFT (HIDDEN)"}
                    </button>
                  </div>

                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)" }}>{prod.name}</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>{prod.description}</p>

                  {/* Feature Pills */}
                  {prod.features && prod.features.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.75rem" }}>
                      {prod.features.map((f, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: "0.68rem",
                            padding: "0.1rem 0.4rem",
                            background: "rgba(255, 255, 255, 0.05)",
                            borderRadius: "4px",
                            color: "var(--text-muted)",
                          }}
                        >
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Editor Box */}
                <div
                  style={{
                    background: "rgba(10, 15, 24, 0.6)",
                    border: "1px solid rgba(6, 182, 212, 0.2)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                      Current AI Price ({prod.billingType})
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
                      <span style={{ fontSize: "0.9rem", color: "var(--accent-cyan)", fontWeight: 700 }}>
                        {prod.currency}
                      </span>
                      <input
                        type="number"
                        value={prod.price}
                        onChange={(e) => handlePriceChange(prod.id, Number(e.target.value))}
                        style={{
                          background: "transparent",
                          border: "1px solid rgba(6, 182, 212, 0.4)",
                          borderRadius: "4px",
                          color: "#ffffff",
                          fontSize: "1.2rem",
                          fontWeight: 700,
                          fontFamily: "var(--font-heading)",
                          padding: "0.2rem 0.5rem",
                          width: "130px",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: "0.75rem", padding: "0.35rem 0.6rem" }}
                      onClick={() => saveKnowledgeChanges()}
                      title="Save this price to AI"
                    >
                      Update AI
                    </button>
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: "0.75rem", padding: "0.35rem 0.5rem", color: "var(--accent-rose)" }}
                      onClick={() => handleDeleteProduct(prod.id)}
                      title="Delete Product"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AI INSTRUCTIONS & RULES */}
      {portalTab === "instructions" && (
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
              🤖 AI Behavior & System Prompt Instructions
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Yahan aap jo bhi likhenge, AI chat aur WhatsApp Bot usi lehje aur rules ke mutabiq jawab denge.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "0.4rem" }}>
                1. General System Prompt (AI Persona & Tone)
              </label>
              <textarea
                rows={4}
                className="chat-input-field"
                style={{ width: "100%", padding: "0.75rem", fontSize: "0.85rem", lineHeight: 1.6 }}
                value={knowledge.aiInstructions.systemPrompt}
                onChange={(e) =>
                  setKnowledge({
                    ...knowledge,
                    aiInstructions: { ...knowledge.aiInstructions, systemPrompt: e.target.value },
                  })
                }
              />
            </div>

            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "0.4rem" }}>
                2. Pricing Inquiries Policy (Jab customer rate pooche toh AI kaise handle kare)
              </label>
              <textarea
                rows={3}
                className="chat-input-field"
                style={{ width: "100%", padding: "0.75rem", fontSize: "0.85rem", lineHeight: 1.6 }}
                value={knowledge.aiInstructions.pricingPolicy}
                onChange={(e) =>
                  setKnowledge({
                    ...knowledge,
                    aiInstructions: { ...knowledge.aiInstructions, pricingPolicy: e.target.value },
                  })
                }
              />
            </div>

            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "0.4rem" }}>
                3. Discount & Negotiation Rules (Kya AI discount offer kar sakta hai?)
              </label>
              <input
                type="text"
                className="chat-input-field"
                style={{ width: "100%", padding: "0.65rem 0.8rem", fontSize: "0.85rem" }}
                value={knowledge.aiInstructions.discountPolicy}
                onChange={(e) =>
                  setKnowledge({
                    ...knowledge,
                    aiInstructions: { ...knowledge.aiInstructions, discountPolicy: e.target.value },
                  })
                }
              />
            </div>

            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "0.4rem" }}>
                4. Special Offer / Aaj Ka Announcement (AI har customer ko yeh offer batayega)
              </label>
              <input
                type="text"
                className="chat-input-field"
                style={{ width: "100%", padding: "0.65rem 0.8rem", fontSize: "0.85rem", borderColor: "var(--accent-amber)" }}
                value={knowledge.aiInstructions.specialAnnouncement || ""}
                placeholder="e.g. Special 10% discount on all Web & Chatbot packages this week!"
                onChange={(e) =>
                  setKnowledge({
                    ...knowledge,
                    aiInstructions: { ...knowledge.aiInstructions, specialAnnouncement: e.target.value },
                  })
                }
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
              <button className="btn btn-primary" onClick={() => saveKnowledgeChanges()} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save AI Instructions"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BUSINESS PROFILE & PAYMENTS */}
      {portalTab === "business" && (
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
              🏢 Business Profile & Bank Payment Details
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Jab koi customer payment ya contact mangega, AI yeh information share karega.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                Business Name
              </label>
              <input
                type="text"
                className="chat-input-field"
                style={{ width: "100%", padding: "0.6rem" }}
                value={knowledge.businessProfile.businessName}
                onChange={(e) =>
                  setKnowledge({
                    ...knowledge,
                    businessProfile: { ...knowledge.businessProfile, businessName: e.target.value },
                  })
                }
              />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                WhatsApp Contact Number
              </label>
              <input
                type="text"
                className="chat-input-field"
                style={{ width: "100%", padding: "0.6rem" }}
                value={knowledge.businessProfile.whatsappNumber}
                onChange={(e) =>
                  setKnowledge({
                    ...knowledge,
                    businessProfile: { ...knowledge.businessProfile, whatsappNumber: e.target.value },
                  })
                }
              />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                Official Email
              </label>
              <input
                type="text"
                className="chat-input-field"
                style={{ width: "100%", padding: "0.6rem" }}
                value={knowledge.businessProfile.email}
                onChange={(e) =>
                  setKnowledge({
                    ...knowledge,
                    businessProfile: { ...knowledge.businessProfile, email: e.target.value },
                  })
                }
              />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                Business Hours / Timings
              </label>
              <input
                type="text"
                className="chat-input-field"
                style={{ width: "100%", padding: "0.6rem" }}
                value={knowledge.businessProfile.businessHours}
                onChange={(e) =>
                  setKnowledge({
                    ...knowledge,
                    businessProfile: { ...knowledge.businessProfile, businessHours: e.target.value },
                  })
                }
              />
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                Payment Methods & Bank Details (EasyPaisa / JazzCash / Bank Accounts)
              </label>
              <textarea
                rows={3}
                className="chat-input-field"
                style={{ width: "100%", padding: "0.6rem" }}
                value={knowledge.businessProfile.paymentDetails}
                onChange={(e) =>
                  setKnowledge({
                    ...knowledge,
                    businessProfile: { ...knowledge.businessProfile, paymentDetails: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-primary" onClick={() => saveKnowledgeChanges()} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Business Info"}
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE AI PRICE TESTER */}
      {portalTab === "test" && (
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", height: "550px" }}>
          <div style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.75rem", marginBottom: "0.75rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)" }}>
              🧪 Live AI Customer Pricing Simulator
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Aapne jo bhi prices aur instructions set ki hain, unhe test karein. Yeh wohi AI hai jo WhatsApp aur Web par jawab deta hai!
            </p>

            {/* Quick Test Chips */}
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", overflowX: "auto" }}>
              {[
                "Website banwane ka kitna charge hai?",
                "WhatsApp AI Chatbot ki price kya hai?",
                "Kya koi discount milega?",
                "Payment kahan send karni hai?",
                "Aapki total services ki list dikhao",
              ].map((chip, idx) => (
                <button
                  key={idx}
                  className="timeframe-pill"
                  onClick={() => handleSendTestMessage(chip)}
                  disabled={isTesting}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Test Messages Area */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.85rem", padding: "0.5rem" }}>
            {testMessages.map((msg, i) => (
              <div key={i} className={`message-row ${msg.role}`}>
                <div className={`avatar-badge ${msg.role === "assistant" ? "avatar-assistant" : "avatar-user"}`}>
                  {msg.role === "assistant" ? "🤖" : "👤"}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <div className="message-bubble" style={{ whiteSpace: "pre-wrap" }}>
                    {msg.content}
                  </div>
                  <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", alignSelf: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isTesting && (
              <div className="message-row assistant">
                <div className="avatar-badge avatar-assistant">🤖</div>
                <div className="message-bubble" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-cyan)" }}>
                  <span className="pulse-dot"></span>
                  <span>AI reading live product catalog and replying...</span>
                </div>
              </div>
            )}
          </div>

          {/* Test Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendTestMessage();
            }}
            style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}
          >
            <input
              type="text"
              className="chat-input-field"
              placeholder="Ask anything about prices (e.g. 'Web development kitne ki hai?')"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              disabled={isTesting}
              style={{ flex: 1, padding: "0.6rem 0.8rem" }}
            />
            <button type="submit" className="btn btn-primary" disabled={isTesting || !testInput.trim()}>
              Test
            </button>
          </form>
        </div>
      )}

      {/* Modal: Add New Product / Service */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="glass-panel"
            style={{ maxWidth: "520px", width: "100%", background: "#0d121d", border: "1px solid rgba(6, 182, 212, 0.3)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
                + Add New Product or Service
              </h3>
              <button className="btn btn-ghost" style={{ padding: "0.2rem 0.5rem" }} onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
                  Product / Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shopify Store Setup or AI Agent Automation"
                  className="chat-input-field"
                  style={{ width: "100%", padding: "0.55rem" }}
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
                    Category
                  </label>
                  <select
                    className="select-control"
                    style={{ width: "100%", padding: "0.55rem" }}
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="AI Automation">AI Automation</option>
                    <option value="Mobile Apps">Mobile Apps</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Software & Cloud">Software & Cloud</option>
                    <option value="General Products">General Products</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
                    Price ({knowledge.businessProfile.currency}) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="25000"
                    className="chat-input-field"
                    style={{ width: "100%", padding: "0.55rem" }}
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
                  Billing Type
                </label>
                <select
                  className="select-control"
                  style={{ width: "100%", padding: "0.55rem" }}
                  value={newProd.billingType}
                  onChange={(e) => setNewProd({ ...newProd, billingType: e.target.value })}
                >
                  <option value="One-time">One-time</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Starting from">Starting from</option>
                  <option value="Per Hour">Per Hour</option>
                  <option value="Custom Quote">Custom Quote</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Details of what the service covers..."
                  className="chat-input-field"
                  style={{ width: "100%", padding: "0.55rem" }}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
                  Included Features (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Free Domain, 24/7 Support, Responsive Design"
                  className="chat-input-field"
                  style={{ width: "100%", padding: "0.55rem" }}
                  value={newFeaturesInput}
                  onChange={(e) => setNewFeaturesInput(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save to Catalog & AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="dashboard-toast">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span style={{ fontSize: "0.85rem", color: "#ffffff" }}>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
