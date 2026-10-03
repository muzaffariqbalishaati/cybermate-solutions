"use client";

import React, { useState, useEffect, useRef } from "react";

interface ProductItem {
  id: string;
  name: string;
  category: string;
  itemType?: "service" | "product";
  price: number;
  billingType: string;
  currency: string;
  turnaround?: string;
  warranty?: string;
  compatibility?: string;
  description: string;
  features: string[];
  status: "active" | "inactive";
}

interface PaymentConfig {
  upiId: string;
  payeeName: string;
  businessName?: string;
  qrImageUrl: string;
  acceptedApps: string[];
  instructions: string;
  allowCashAtCounter?: boolean;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface KnowledgePayload {
  businessProfile: {
    businessName: string;
    ownerName?: string;
    tagline: string;
    address?: string;
    country?: string;
    whatsappNumber: string;
    mobileNumber?: string;
    email: string;
    businessHours: string;
    currency: string;
    currencySymbol?: string;
    paymentDetails: string;
  };
  paymentConfig?: PaymentConfig;
  aiInstructions: {
    systemPrompt: string;
    pricingPolicy: string;
    discountPolicy: string;
    specialAnnouncement?: string;
    languageStyle?: string;
    tone?: string;
  };
  faqs?: FaqItem[];
  products: ProductItem[];
  lastUpdated?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  time: string;
  media?: {
    type: "image";
    url: string;
    caption: string;
    upiId?: string;
    payeeName?: string;
  };
  toolCalls?: Array<{ name: string; input: Record<string, unknown>; output: string }>;
}

export default function CyberMateConstructorDashboard() {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Active navigation tab (Default: overview matching Constructor design)
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "payment" | "profile" | "offers" | "faqs" | "instructions" | "tester" | "whatsapp"
  >("overview");

  // Mobile sidebar drawer
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Business Knowledge data
  const [knowledge, setKnowledge] = useState<KnowledgePayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Overview Widget State
  const [dashSearch, setDashSearch] = useState("");
  const [dashCategory, setDashCategory] = useState("all");

  // Product Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // New Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAddCustomCategory, setIsAddCustomCategory] = useState(false);
  const [addCustomCategory, setAddCustomCategory] = useState("");
  const [newProd, setNewProd] = useState<Partial<ProductItem>>({
    name: "",
    category: "Mobile Repairing",
    itemType: "service",
    price: 1499,
    billingType: "Starting from",
    currency: "INR",
    turnaround: "1 - 2 Hours (Same Day)",
    warranty: "30 Days Testing Warranty",
    compatibility: "iPhone, Samsung, All Android",
    description: "",
    features: [],
    status: "active",
  });
  const [newFeaturesInput, setNewFeaturesInput] = useState("");

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editFeaturesInput, setEditFeaturesInput] = useState("");
  const [isEditCustomCategory, setIsEditCustomCategory] = useState(false);
  const [editCustomCategory, setEditCustomCategory] = useState("");

  // Delete Confirmation Modal State
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);

  // FAQ Modal States
  const [showAddFaqModal, setShowAddFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [newFaq, setNewFaq] = useState<Partial<FaqItem>>({
    question: "",
    answer: "",
    category: "General",
  });

  // QR Upload & Generation State
  const [qrTimestamp, setQrTimestamp] = useState(Date.now());
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [isUploadingQr, setIsUploadingQr] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live AI Tester Chat State
  const [testMessages, setTestMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I am CyberMate AI, the official assistant for CyberMate Solutions (J.J Market, Sanhaula, Bhagalpur, Bihar). Owner: Muzaffar Iqbal Ishaati. Feel free to ask about our mobile repair rates, laptop servicing, accessories, store address, or payment details!",
      time: "Now",
    },
  ]);
  const [testInput, setTestInput] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  // Check saved session on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("cybermate_admin_auth");
    if (savedAuth === "true") {
      setIsLoggedIn(true);
    }
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

  // Login handler
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const u = username.trim().toLowerCase();
    const p = password.trim();

    if (
      (u === "admin" ||
        u === "muzaffar" ||
        u === "muzaffarishaati@gmail.com" ||
        u === "muzaffar0641@gmail.com" ||
        u === "9934215013" ||
        u === "") &&
      (p === "admin123" || p === "cybermate" || p === "admin" || p === "123456" || p === "cybermate123")
    ) {
      setIsLoggedIn(true);
      setLoginError("");
      if (rememberMe) {
        localStorage.setItem("cybermate_admin_auth", "true");
      }
      showToast("Welcome Muzaffar Iqbal Ishaati! Constructor CMS Panel loaded.");
    } else {
      setLoginError("Incorrect password. Hint: admin123 or cybermate");
    }
  };

  const handleQuickLogin = () => {
    setIsLoggedIn(true);
    if (rememberMe) {
      localStorage.setItem("cybermate_admin_auth", "true");
    }
    showToast("Logged in successfully!");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("cybermate_admin_auth");
    showToast("Logged out of CMS.");
  };

  // Save Knowledge to Server
  const saveKnowledgeToServer = async (payloadToSave?: KnowledgePayload) => {
    const dataToSave = payloadToSave || knowledge;
    if (!dataToSave) return false;

    setIsSaving(true);
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.data) {
          setKnowledge(result.data);
        }
        showToast("Changes saved successfully! AI & WhatsApp bot updated.");
        return true;
      } else {
        showToast("Failed to save changes. Please try again.");
        return false;
      }
    } catch (err) {
      console.error("Save error:", err);
      showToast("Network error while saving.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Copy UPI ID to clipboard
  const handleCopyUpi = () => {
    const upi = knowledge?.paymentConfig?.upiId || "9934215013@upi";
    navigator.clipboard.writeText(upi);
    showToast(`UPI ID "${upi}" copied to clipboard!`);
  };

  // 1-Click Generate Standard UPI QR
  const handleGenerateUpiQr = async () => {
    const upiId = knowledge?.paymentConfig?.upiId || "9934215013@upi";
    const payeeName = knowledge?.paymentConfig?.payeeName || "Muzaffar Iqbal Ishaati";

    setIsGeneratingQr(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_upi_qr", upiId, payeeName }),
      });

      if (res.ok) {
        const data = await res.json();
        setQrTimestamp(Date.now());
        showToast("Standard UPI Payment QR Code regenerated and active!");
        if (knowledge && knowledge.paymentConfig) {
          const updatedKnowledge: KnowledgePayload = {
            ...knowledge,
            paymentConfig: {
              ...knowledge.paymentConfig,
              qrImageUrl: data.qrImageUrl || "/uploads/payment-qr.png",
            },
          };
          setKnowledge(updatedKnowledge);
        }
      } else {
        showToast("Failed to generate QR code.");
      }
    } catch (err) {
      console.error("QR Generate error:", err);
      showToast("Error generating QR code.");
    } finally {
      setIsGeneratingQr(false);
    }
  };

  // Upload Custom QR Image
  const handleUploadQrFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingQr(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setQrTimestamp(Date.now());
        showToast("Payment QR Code uploaded and synced with AI bot!");
        if (knowledge && knowledge.paymentConfig) {
          const updatedKnowledge: KnowledgePayload = {
            ...knowledge,
            paymentConfig: {
              ...knowledge.paymentConfig,
              qrImageUrl: data.qrImageUrl || "/uploads/payment-qr.png",
            },
          };
          setKnowledge(updatedKnowledge);
        }
      } else {
        showToast("Failed to upload QR image file.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      showToast("Error uploading image.");
    } finally {
      setIsUploadingQr(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Download QR Code image
  const handleDownloadQr = () => {
    const link = document.createElement("a");
    link.href = `/uploads/payment-qr.png?t=${qrTimestamp}`;
    link.download = "cybermate-official-payment-qr.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloading official Payment QR Code...");
  };

  // Add Product Handler
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!knowledge || !newProd.name || !newProd.price) return;

    const category = isAddCustomCategory ? addCustomCategory.trim() || "General" : newProd.category || "General";
    const features = newFeaturesInput
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const productToAdd: ProductItem = {
      id: `prod-${Date.now()}`,
      name: newProd.name.trim(),
      category,
      itemType: newProd.itemType || "service",
      price: Number(newProd.price),
      billingType: newProd.billingType?.trim() || "Starting from",
      currency: "INR",
      turnaround: newProd.turnaround?.trim() || "1 - 2 Hours",
      warranty: newProd.warranty?.trim() || "30 Days Warranty",
      compatibility: newProd.compatibility?.trim() || "All Models",
      description: newProd.description?.trim() || "",
      features,
      status: (newProd.status as "active" | "inactive") || "active",
    };

    const updatedKnowledge: KnowledgePayload = {
      ...knowledge,
      products: [productToAdd, ...knowledge.products],
    };

    setKnowledge(updatedKnowledge);
    setShowAddModal(false);
    setNewProd({
      name: "",
      category: "Mobile Repairing",
      itemType: "service",
      price: 1499,
      billingType: "Starting from",
      currency: "INR",
      turnaround: "1 - 2 Hours",
      warranty: "30 Days Warranty",
      compatibility: "All Models",
      description: "",
      features: [],
      status: "active",
    });
    setNewFeaturesInput("");
    setIsAddCustomCategory(false);
    setAddCustomCategory("");

    await saveKnowledgeToServer(updatedKnowledge);
    showToast(`Added "${productToAdd.name}" to live catalog!`);
  };

  // Edit Product Submit
  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!knowledge || !editingProduct) return;

    const category = isEditCustomCategory ? editCustomCategory.trim() || editingProduct.category : editingProduct.category;
    const features = editFeaturesInput
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const updatedList = knowledge.products.map((p) => {
      if (p.id === editingProduct.id) {
        return {
          ...editingProduct,
          category,
          features,
        };
      }
      return p;
    });

    const updatedKnowledge: KnowledgePayload = {
      ...knowledge,
      products: updatedList,
    };

    setKnowledge(updatedKnowledge);
    setEditingProduct(null);
    setIsEditCustomCategory(false);
    setEditCustomCategory("");

    await saveKnowledgeToServer(updatedKnowledge);
    showToast(`Updated "${editingProduct.name}"!`);
  };

  // Toggle Product Active/Inactive Status
  const toggleProductStatus = async (productId: string) => {
    if (!knowledge) return;

    const updatedList = knowledge.products.map((p) => {
      if (p.id === productId) {
        return { ...p, status: p.status === "active" ? ("inactive" as const) : ("active" as const) };
      }
      return p;
    });

    const updatedKnowledge: KnowledgePayload = {
      ...knowledge,
      products: updatedList,
    };

    setKnowledge(updatedKnowledge);
    await saveKnowledgeToServer(updatedKnowledge);
    showToast("Product availability updated.");
  };

  // Delete Product
  const handleDeleteProduct = async () => {
    if (!knowledge || !productToDelete) return;

    const updatedList = knowledge.products.filter((p) => p.id !== productToDelete.id);
    const updatedKnowledge: KnowledgePayload = {
      ...knowledge,
      products: updatedList,
    };

    setKnowledge(updatedKnowledge);
    const deletedName = productToDelete.name;
    setProductToDelete(null);

    await saveKnowledgeToServer(updatedKnowledge);
    showToast(`Deleted "${deletedName}" from catalog.`);
  };

  // Add FAQ Submit
  const handleAddFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!knowledge || !newFaq.question || !newFaq.answer) return;

    const item: FaqItem = {
      id: `faq-${Date.now()}`,
      question: newFaq.question.trim(),
      answer: newFaq.answer.trim(),
      category: newFaq.category?.trim() || "General",
    };

    const currentFaqs = knowledge.faqs || [];
    const updatedKnowledge: KnowledgePayload = {
      ...knowledge,
      faqs: [...currentFaqs, item],
    };

    setKnowledge(updatedKnowledge);
    setShowAddFaqModal(false);
    setNewFaq({ question: "", answer: "", category: "General" });

    await saveKnowledgeToServer(updatedKnowledge);
    showToast("New FAQ added to AI Knowledge Base!");
  };

  // Edit FAQ Submit
  const handleEditFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!knowledge || !editingFaq) return;

    const currentFaqs = knowledge.faqs || [];
    const updatedFaqs = currentFaqs.map((f) => (f.id === editingFaq.id ? editingFaq : f));
    const updatedKnowledge: KnowledgePayload = {
      ...knowledge,
      faqs: updatedFaqs,
    };

    setKnowledge(updatedKnowledge);
    setEditingFaq(null);

    await saveKnowledgeToServer(updatedKnowledge);
    showToast("FAQ updated successfully!");
  };

  // Delete FAQ
  const handleDeleteFaq = async (faqId: string) => {
    if (!knowledge) return;
    const currentFaqs = knowledge.faqs || [];
    const updatedFaqs = currentFaqs.filter((f) => f.id !== faqId);
    const updatedKnowledge: KnowledgePayload = {
      ...knowledge,
      faqs: updatedFaqs,
    };

    setKnowledge(updatedKnowledge);
    await saveKnowledgeToServer(updatedKnowledge);
    showToast("FAQ removed.");
  };

  // Live AI Chat Simulator Send
  const handleSendTestMessage = async (customPrompt?: string) => {
    const query = customPrompt || testInput.trim();
    if (!query || isTesting) return;

    const newHistory: ChatMessage[] = [
      ...testMessages,
      { role: "user", content: query, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ];
    setTestMessages(newHistory);
    if (!customPrompt) setTestInput("");
    setIsTesting(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTestMessages([
          ...newHistory,
          {
            role: "assistant",
            content: data.reply || "Sorry, I could not process your query right now.",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            media: data.media,
            toolCalls: data.toolCalls,
          },
        ]);
      } else {
        setTestMessages([
          ...newHistory,
          {
            role: "assistant",
            content: "Error retrieving live AI response from server.",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (err) {
      console.error("Test chat error:", err);
    } finally {
      setIsTesting(false);
    }
  };

  // Filter products by category & search
  const allCategories = Array.from(new Set((knowledge?.products || []).map((p) => p.category)));
  const filteredProducts = (knowledge?.products || []).filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.compatibility && p.compatibility.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Dashboard Live Price Master filter
  const dashFilteredProducts = (knowledge?.products || []).filter((p) => {
    const matchesCat = dashCategory === "all" || p.category === dashCategory;
    const matchesQ =
      !dashSearch.trim() ||
      p.name.toLowerCase().includes(dashSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(dashSearch.toLowerCase()) ||
      (p.compatibility && p.compatibility.toLowerCase().includes(dashSearch.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(dashSearch.toLowerCase()));
    return matchesCat && matchesQ;
  });

  // Helper title for current active section
  const getSectionTitle = () => {
    switch (activeTab) {
      case "overview":
        return "Dashboard Overview";
      case "products":
        return "Products & Services Catalog";
      case "payment":
        return "Payment & QR Studio";
      case "profile":
        return "Store Profile & Address";
      case "offers":
        return "Promotional Announcements & Policies";
      case "faqs":
        return "Frequently Asked Questions";
      case "instructions":
        return "AI Persona & System Prompt";
      case "tester":
        return "Live AI Simulator";
      case "whatsapp":
        return "WhatsApp Bot Gateway";
      default:
        return "Dashboard";
    }
  };

  // =========================================================================
  // 1. LOGIN SCREEN (LIGHT CONSTRUCTOR STYLED)
  // =========================================================================
  if (!isLoggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
          backgroundColor: "var(--bg-app)",
        }}
      >
        <div
          className="glass-panel"
          style={{
            width: "100%",
            maxWidth: "460px",
            padding: "2.5rem",
            boxShadow: "0 20px 40px -10px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #7c3aed, #6366f1)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "1.2rem",
                margin: "0 auto 1rem",
                boxShadow: "0 8px 20px rgba(124, 58, 237, 0.3)",
              }}
            >
              CM
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em" }}>
              CyberMate CMS
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              CyberMate Solutions • Owner Control Panel
            </p>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--primary-purple)",
                background: "rgba(124, 58, 237, 0.08)",
                padding: "0.25rem 0.75rem",
                borderRadius: "var(--radius-full)",
                display: "inline-block",
                marginTop: "0.6rem",
                fontWeight: 600,
              }}
            >
              📍 J.J Market, Sanhaula, Bhagalpur, Bihar
            </div>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.35rem" }}>
                Username / Email / Mobile Number
              </label>
              <input
                type="text"
                placeholder="admin or 9934215013"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.35rem" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password (default: admin123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  style={{ width: "100%", paddingRight: "2.5rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? "👁️" : "🔒"}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.8rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "var(--text-body)" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: "var(--primary-purple)" }}
                />
                Remember login
              </label>
              <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Owner Portal</span>
            </div>

            {loginError && (
              <div
                style={{
                  background: "#ffe4e6",
                  color: "#e11d48",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.8rem",
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                {loginError}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.75rem", marginTop: "0.5rem" }}>
              Log In to Control Panel →
            </button>

            <button
              type="button"
              onClick={handleQuickLogin}
              className="btn btn-secondary"
              style={{ width: "100%", padding: "0.65rem", fontSize: "0.8rem" }}
            >
              ⚡ Quick 1-Click Owner Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. MAIN CONSTRUCTOR CMS DASHBOARD LAYOUT
  // =========================================================================
  return (
    <div className="cms-layout">
      {/* Toast Notification */}
      {toastMessage && <div className="toast-notification">{toastMessage}</div>}

      {/* Mobile Drawer Backdrop */}
      <div
        className={`cms-backdrop ${isMobileSidebarOpen ? "mobile-open" : ""}`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      {/* =========================================================================
          LEFT SIDEBAR (MATCHING UPLOADED IMAGE WITH PURPLE ACTIVE PILL & STORE TEAM)
         ========================================================================= */}
      <aside className={`cms-sidebar ${isMobileSidebarOpen ? "mobile-open" : ""}`}>
        {/* Brand Header */}
        <div className="cms-sidebar-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div className="sidebar-logo-icon" onClick={() => setActiveTab("overview")} title="CyberMate CMS">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div>
              <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.01em" }}>
                CyberMate
              </span>
              <div style={{ fontSize: "0.7rem", color: "var(--primary-purple)", fontWeight: 700 }}>
                Solutions CMS
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              fontSize: "1.2rem",
              cursor: "pointer",
              display: "none",
            }}
            className="mobile-close-btn"
          >
            ✕
          </button>
        </div>

        {/* Navigation Group: Real Business Modules */}
        <div className="cms-nav-group">
          <div className="cms-nav-group-title">Business Control</div>

          {/* 1. Dashboard Overview */}
          <button
            className={`cms-nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("overview");
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className="cms-nav-item-icon">
              <span className="nav-icon-box" style={{ background: activeTab === "overview" ? "rgba(255,255,255,0.2)" : "#ffedd5", color: activeTab === "overview" ? "#fff" : "#ea580c" }}>
                📊
              </span>
              <span>Dashboard Overview</span>
            </div>
            <span className="cms-nav-badge">Live</span>
          </button>

          {/* 2. Products & Services Catalog */}
          <button
            className={`cms-nav-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("products");
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className="cms-nav-item-icon">
              <span className="nav-icon-box" style={{ background: activeTab === "products" ? "rgba(255,255,255,0.2)" : "#dcfce7", color: activeTab === "products" ? "#fff" : "#16a34a" }}>
                📱
              </span>
              <span>Repair Catalog & Parts</span>
            </div>
            <span className="cms-nav-badge">{knowledge?.products?.length || 14}</span>
          </button>

          {/* 3. Offers & Announcements */}
          <button
            className={`cms-nav-item ${activeTab === "offers" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("offers");
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className="cms-nav-item-icon">
              <span className="nav-icon-box" style={{ background: activeTab === "offers" ? "rgba(255,255,255,0.2)" : "#fce7f3", color: activeTab === "offers" ? "#fff" : "#db2777" }}>
                📢
              </span>
              <span>Offers & Policies</span>
            </div>
            <span className="badge-new">NEW</span>
          </button>

          {/* 4. Payment & QR Studio */}
          <button
            className={`cms-nav-item ${activeTab === "payment" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("payment");
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className="cms-nav-item-icon">
              <span className="nav-icon-box" style={{ background: activeTab === "payment" ? "rgba(255,255,255,0.2)" : "#e0f2fe", color: activeTab === "payment" ? "#fff" : "#0284c7" }}>
                💳
              </span>
              <span>Payment QR & UPI</span>
            </div>
            <span className="cms-nav-badge">UPI</span>
          </button>

          {/* 5. Store Profile & Address */}
          <button
            className={`cms-nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("profile");
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className="cms-nav-item-icon">
              <span className="nav-icon-box" style={{ background: activeTab === "profile" ? "rgba(255,255,255,0.2)" : "#fef3c7", color: activeTab === "profile" ? "#fff" : "#d97706" }}>
                🏢
              </span>
              <span>Store Profile & Address</span>
            </div>
            <span className="cms-nav-badge">Shop</span>
          </button>
        </div>

        {/* Navigation Group 2: AI & WhatsApp Engine */}
        <div className="cms-nav-group" style={{ marginTop: "0.5rem" }}>
          <div className="cms-nav-group-title">AI & WhatsApp Engine</div>

          <button
            className={`cms-nav-item ${activeTab === "whatsapp" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("whatsapp");
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className="cms-nav-item-icon">
              <span className="nav-icon-box" style={{ background: activeTab === "whatsapp" ? "rgba(255,255,255,0.2)" : "#dcfce7", color: activeTab === "whatsapp" ? "#fff" : "#16a34a" }}>
                📱
              </span>
              <span>WhatsApp Bot Gateway</span>
            </div>
            <span className="cms-nav-badge">Port 3001</span>
          </button>

          <button
            className={`cms-nav-item ${activeTab === "tester" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("tester");
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className="cms-nav-item-icon">
              <span className="nav-icon-box" style={{ background: activeTab === "tester" ? "rgba(255,255,255,0.2)" : "#f1f5f9" }}>
                🧪
              </span>
              <span>Live AI Simulator</span>
            </div>
            <span className="cms-nav-badge" style={{ color: "var(--primary-purple)" }}>Test</span>
          </button>

          <button
            className={`cms-nav-item ${activeTab === "faqs" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("faqs");
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className="cms-nav-item-icon">
              <span className="nav-icon-box" style={{ background: activeTab === "faqs" ? "rgba(255,255,255,0.2)" : "#f1f5f9" }}>
                ❓
              </span>
              <span>FAQ Knowledge Base</span>
            </div>
            <span className="cms-nav-badge">{knowledge?.faqs?.length || 8}</span>
          </button>

          <button
            className={`cms-nav-item ${activeTab === "instructions" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("instructions");
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className="cms-nav-item-icon">
              <span className="nav-icon-box" style={{ background: activeTab === "instructions" ? "rgba(255,255,255,0.2)" : "#f1f5f9" }}>
                🤖
              </span>
              <span>AI Persona & Prompt</span>
            </div>
          </button>
        </div>

        {/* Sidebar Footer */}
        <div className="cms-sidebar-footer">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-main)" }}>Muzaffar Iqbal Ishaati</div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>J.J Market, Sanhaula</div>
            </div>
            <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: "var(--radius-full)", background: "#dcfce7", color: "#16a34a", fontWeight: 700 }}>
              Live
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{ width: "100%", padding: "0.45rem", fontSize: "0.78rem" }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* =========================================================================
          MAIN CMS CONTENT
         ========================================================================= */}
      <div className="cms-main">
        {/* Floating White Top Navigation Bar (Real Business Actions) */}
        <header className="cms-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            {/* Mobile Hamburger button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              style={{
                background: "#f1f4f9",
                border: "none",
                borderRadius: "10px",
                color: "var(--text-main)",
                padding: "0.45rem 0.65rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ☰
            </button>

            {/* Breadcrumb & Section Title */}
            <div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                CyberMate Solutions CMS
              </div>
              <h1 style={{ fontSize: "1.08rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                {getSectionTitle()}
              </h1>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* Search Input: Real Search for Repair Services & Pricing */}
            <div className="topbar-search-pill">
              <input
                type="text"
                placeholder="Search repairs, prices, models..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab === "overview" && e.target.value.trim()) {
                    setActiveTab("products");
                  }
                }}
                className="topbar-search-input"
              />
              <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>
                🔍
              </span>
            </div>

            {/* Store Counter Status Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "#dcfce7",
                color: "#16a34a",
                padding: "0.35rem 0.75rem",
                borderRadius: "var(--radius-full)",
                fontSize: "0.75rem",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              <span className="user-status-dot active" />
              <span>Counter Open</span>
            </div>

            {/* Quick Action: Add Service */}
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
              style={{ padding: "0.42rem 0.85rem", fontSize: "0.78rem", whiteSpace: "nowrap" }}
            >
              ➕ Add Service
            </button>

            {/* Live AI Tester Shortcut */}
            <button
              className="topbar-icon-btn"
              onClick={() => setActiveTab("tester")}
              title="Open Live AI Simulator"
            >
              🤖
            </button>

            {/* Profile Avatar */}
            <div
              className="topbar-avatar"
              onClick={() => setActiveTab("profile")}
              title="Muzaffar Iqbal Ishaati (Store Owner)"
            >
              MI
            </div>
          </div>
        </header>

        {/* =========================================================================
            VIEW 1: CYBERMATE BUSINESS OPERATIONS DASHBOARD (100% REAL BUSINESS DATA)
           ========================================================================= */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* 1. Store Header & Live Promo Announcement */}
            <div
              className="glass-panel"
              style={{
                padding: "1rem 1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                borderRadius: "var(--radius-xl)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.85rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "var(--primary-purple-gradient)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.15rem",
                      fontWeight: 800,
                      boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
                      flexShrink: 0,
                    }}
                  >
                    CM
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.01em" }}>
                        CyberMate Solutions
                      </h2>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "0.15rem 0.6rem", borderRadius: "var(--radius-full)", background: "#dcfce7", color: "#16a34a" }}>
                        ● Counter Open
                      </span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                      📍 J.J Market, Sanhaula, Bhagalpur, Bihar 813205 • 📞 +91 9934215013 • Mon - Sat: 09:30 AM - 08:30 PM (IST)
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap" }}>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary"
                    style={{ padding: "0.45rem 0.9rem", fontSize: "0.8rem" }}
                  >
                    ➕ Add Service
                  </button>
                  <button
                    onClick={() => setActiveTab("tester")}
                    className="btn btn-secondary"
                    style={{ padding: "0.45rem 0.9rem", fontSize: "0.8rem" }}
                  >
                    🤖 Test AI Reply
                  </button>
                </div>
              </div>

              {/* Inline Active Promo Deal Banner */}
              <div
                style={{
                  background: "rgba(124, 58, 237, 0.05)",
                  border: "1px solid rgba(124, 58, 237, 0.15)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.55rem 0.85rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                  fontSize: "0.8rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", overflow: "hidden" }}>
                  <span style={{ fontSize: "1rem" }}>📢</span>
                  <span style={{ fontWeight: 700, color: "var(--primary-purple)", whiteSpace: "nowrap" }}>
                    Active Promo:
                  </span>
                  <span style={{ color: "var(--text-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {knowledge?.aiInstructions?.specialAnnouncement ||
                      "Free 9D Tempered Glass with Mobile Screen Replacement & Free Windows Setup with Laptop SSD Upgrade!"}
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab("offers")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--primary-purple)",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  Edit Promo →
                </button>
              </div>
            </div>

            {/* 2. 4 Core High-Impact KPI Cards (Clean, Balanced & Focused) */}
            <div className="constructor-kpi-grid">
              {/* Card 1: Emerald Green — Repair Catalog */}
              <div className="kpi-card green" onClick={() => setActiveTab("products")}>
                <div className="kpi-top-row">
                  <span className="kpi-pill">Repair Catalog</span>
                </div>
                <div>
                  <div className="kpi-number">{knowledge?.products?.length || 13} Services</div>
                  <div style={{ fontSize: "0.78rem", opacity: 0.92, marginTop: "-4px" }}>
                    Screens, Batteries, SSDs &amp; Accessories
                  </div>
                </div>
                <div className="kpi-bottom-row">
                  <button className="kpi-action-btn">View Catalog →</button>
                </div>
              </div>

              {/* Card 2: Royal Purple — Official UPI Payment */}
              <div className="kpi-card purple" onClick={() => setActiveTab("payment")}>
                <div className="kpi-top-row">
                  <span className="kpi-pill">Official UPI Payment</span>
                </div>
                <div>
                  <div className="kpi-number" style={{ fontSize: "1.45rem" }}>
                    {knowledge?.paymentConfig?.upiId || "9934215013@upi"}
                  </div>
                  <div style={{ fontSize: "0.78rem", opacity: 0.92, marginTop: "-4px" }}>
                    Muzaffar Iqbal Ishaati (Zero Bank Info)
                  </div>
                </div>
                <div className="kpi-bottom-row">
                  <button className="kpi-action-btn">Open QR Studio →</button>
                </div>
              </div>

              {/* Card 3: Sky Blue — WhatsApp AI Engine */}
              <div className="kpi-card blue" onClick={() => setActiveTab("whatsapp")}>
                <div className="kpi-top-row">
                  <span className="kpi-pill">WhatsApp AI Gateway</span>
                </div>
                <div>
                  <div className="kpi-number" style={{ fontSize: "1.55rem" }}>
                    Port 3001 Active
                  </div>
                  <div style={{ fontSize: "0.78rem", opacity: 0.92, marginTop: "-4px" }}>
                    Live Customer Auto-Replies &amp; Sync
                  </div>
                </div>
                <div className="kpi-bottom-row">
                  <button className="kpi-action-btn">Manage Gateway →</button>
                </div>
              </div>

              {/* Card 4: Coral Orange — Store Turnaround */}
              <div className="kpi-card orange" onClick={() => setActiveTab("profile")}>
                <div className="kpi-top-row">
                  <span className="kpi-pill">Service Turnaround</span>
                </div>
                <div>
                  <div className="kpi-number" style={{ fontSize: "1.55rem" }}>
                    1 - 2 Hours
                  </div>
                  <div style={{ fontSize: "0.78rem", opacity: 0.92, marginTop: "-4px" }}>
                    Same-Day Delivery at J.J Market Sanhaula
                  </div>
                </div>
                <div className="kpi-bottom-row">
                  <button className="kpi-action-btn">Store Profile →</button>
                </div>
              </div>
            </div>

            {/* 4. Business Operations & Live Counter Layout (100% Real Business Data) */}
            <div className="constructor-overview-layout">
              {/* Left Column: Live Repair & Service Price Master + Turnaround Standards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                {/* Widget A: Live Repair Services & Pricing Rate Master */}
                <div className="chart-card">
                  <div className="chart-header" style={{ marginBottom: "0.75rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span className="chart-title">Live Repair &amp; Service Price Master</span>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "var(--radius-full)", background: "#dcfce7", color: "#16a34a" }}>
                          Live in Store &amp; WhatsApp
                        </span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                        Real-time service catalog quoted to customers across Sanhaula, Bhagalpur &amp; nearby areas
                      </div>
                    </div>

                    <button
                      onClick={() => setShowAddModal(true)}
                      className="btn btn-primary"
                      style={{ padding: "0.4rem 0.85rem", fontSize: "0.78rem" }}
                    >
                      ➕ Add Service
                    </button>
                  </div>

                  {/* Filter chips & Search bar */}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.6rem", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      <button
                        className={`filter-chip ${dashCategory === "all" ? "active" : ""}`}
                        onClick={() => setDashCategory("all")}
                        style={{ padding: "0.25rem 0.65rem", fontSize: "0.75rem" }}
                      >
                        All ({knowledge?.products?.length || 0})
                      </button>
                      {allCategories.map((cat) => (
                        <button
                          key={cat}
                          className={`filter-chip ${dashCategory === cat ? "active" : ""}`}
                          onClick={() => setDashCategory(cat)}
                          style={{ padding: "0.25rem 0.65rem", fontSize: "0.75rem" }}
                        >
                          {cat} ({(knowledge?.products || []).filter((p) => p.category === cat).length})
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Quick filter price / model..."
                      value={dashSearch}
                      onChange={(e) => setDashSearch(e.target.value)}
                      className="input-field"
                      style={{ padding: "0.35rem 0.75rem", fontSize: "0.78rem", width: "190px" }}
                    />
                  </div>

                  {/* Repair Price Master Table */}
                  <div className="repair-table-wrapper">
                    <table className="repair-table">
                      <thead>
                        <tr>
                          <th>Service / Product</th>
                          <th>Category</th>
                          <th>Price (INR)</th>
                          <th>Turnaround</th>
                          <th>Warranty</th>
                          <th style={{ textAlign: "right" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashFilteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)" }}>
                              No services found matching &quot;{dashSearch}&quot;.
                            </td>
                          </tr>
                        ) : (
                          dashFilteredProducts.slice(0, 8).map((p) => (
                            <tr key={p.id}>
                              <td>
                                <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.83rem" }}>
                                  {p.name}
                                </div>
                                {p.compatibility && (
                                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
                                    📱 {p.compatibility}
                                  </div>
                                )}
                              </td>
                              <td>
                                <span className="badge-category" style={{ fontSize: "0.68rem" }}>
                                  {p.category}
                                </span>
                              </td>
                              <td>
                                <span style={{ fontWeight: 800, color: "var(--primary-purple)", fontSize: "0.95rem" }}>
                                  ₹{p.price.toLocaleString()}
                                </span>
                                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                                  {p.billingType}
                                </div>
                              </td>
                              <td>
                                <span className="info-pill" style={{ fontSize: "0.7rem" }}>
                                  ⏱️ {p.turnaround || "1 - 2 Hours"}
                                </span>
                              </td>
                              <td>
                                <span className="info-pill" style={{ fontSize: "0.7rem" }}>
                                  🛡️ {p.warranty || "30 Days"}
                                </span>
                              </td>
                              <td style={{ textAlign: "right" }}>
                                <button
                                  onClick={() => {
                                    setEditingProduct(p);
                                    setEditFeaturesInput((p.features || []).join("\n"));
                                  }}
                                  className="btn btn-secondary"
                                  style={{ padding: "0.25rem 0.55rem", fontSize: "0.72rem" }}
                                >
                                  ✏️ Edit
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {dashFilteredProducts.length > 8 && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      <span>Showing 8 of {dashFilteredProducts.length} services</span>
                      <button
                        onClick={() => setActiveTab("products")}
                        className="btn btn-secondary"
                        style={{ padding: "0.3rem 0.75rem", fontSize: "0.75rem" }}
                      >
                        View Full Catalog ({knowledge?.products?.length || 0}) →
                      </button>
                    </div>
                  )}
                </div>

                {/* Widget B: Store Quality Standards & Turnaround Commitments */}
                <div className="chart-card">
                  <div className="chart-header">
                    <div>
                      <span className="chart-title">CyberMate Service Standards &amp; Turnaround</span>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                        Guaranteed hand-to-hand delivery standards at J.J Market, Sanhaula counter
                      </div>
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary-purple)" }}>
                      Same-Day Priority
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.85rem" }}>
                    <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                        <span style={{ fontSize: "1.1rem" }}>📱</span>
                        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>Display Replacement</div>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-body)", lineHeight: 1.4 }}>
                        1 - 2 Hours turnaround. Clean fitting with no glue marks. Free 9D Tempered Glass. 30-Day Testing Warranty.
                      </div>
                    </div>

                    <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                        <span style={{ fontSize: "1.1rem" }}>🔋</span>
                        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>Battery Replacement</div>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-body)", lineHeight: 1.4 }}>
                        30 - 45 Minutes. Original grade cells, 100% iPhone battery health, zero heating. 3-Month Warranty.
                      </div>
                    </div>

                    <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                        <span style={{ fontSize: "1.1rem" }}>💻</span>
                        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>Laptop SSD Upgrade</div>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-body)", lineHeight: 1.4 }}>
                        1 Hour (Same Day). 10x speed boost. Includes Genuine Windows 10/11 Pro &amp; MS Office. 1-Year Warranty.
                      </div>
                    </div>

                    <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                        <span style={{ fontSize: "1.1rem" }}>🔌</span>
                        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>Charging Jack &amp; IC Fix</div>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-body)", lineHeight: 1.4 }}>
                        30 - 45 Minutes for Type-C/Jack. 24 - 48 Hours for Motherboard IC &amp; short circuit. Data preserved.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Counter Payment QR Station + Live WhatsApp Activity Stream */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                {/* Widget C: Counter Payment QR Station (Strictly UPI) */}
                <div className="chart-card">
                  <div className="chart-header" style={{ marginBottom: "0.85rem" }}>
                    <div>
                      <span className="chart-title">Payment QR &amp; Counter Station</span>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Official store UPI billing</div>
                    </div>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "var(--radius-full)", background: "#f3e8ff", color: "var(--primary-purple)" }}>
                      UPI Active
                    </span>
                  </div>

                  {/* QR Image Frame */}
                  <div className="qr-showcase-box">
                    <img
                      src={`${knowledge?.paymentConfig?.qrImageUrl || "/uploads/payment-qr.png"}?t=${qrTimestamp}`}
                      alt="CyberMate UPI Payment QR"
                      style={{
                        width: "160px",
                        height: "160px",
                        objectFit: "contain",
                        borderRadius: "12px",
                        margin: "0 auto",
                        display: "block",
                        background: "#fff",
                        padding: "6px",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=9934215013@upi&pn=Muzaffar%20Iqbal%20Ishaati";
                      }}
                    />
                    <div style={{ marginTop: "0.65rem", fontSize: "0.82rem", fontWeight: 800, color: "var(--text-main)" }}>
                      Muzaffar Iqbal Ishaati
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      CyberMate Solutions • J.J Market Sanhaula
                    </div>

                    {/* Copyable UPI ID Pill */}
                    <div
                      onClick={handleCopyUpi}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.4rem",
                        background: "#f1f5f9",
                        padding: "0.45rem 0.75rem",
                        borderRadius: "var(--radius-full)",
                        margin: "0.65rem auto 0",
                        cursor: "pointer",
                        maxWidth: "230px",
                      }}
                      title="Click to copy UPI ID"
                    >
                      <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--primary-purple)", fontFamily: "var(--font-mono)" }}>
                        {knowledge?.paymentConfig?.upiId || "9934215013@upi"}
                      </span>
                      <span style={{ fontSize: "0.75rem" }}>📋</span>
                    </div>
                  </div>

                  {/* Accepted Apps Badges */}
                  <div style={{ display: "flex", justifyContent: "center", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
                    {["PhonePe", "Google Pay", "Paytm", "BHIM", "Cash"].map((app) => (
                      <span
                        key={app}
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          padding: "0.15rem 0.45rem",
                          borderRadius: "4px",
                          background: "#f8fafc",
                          color: "var(--text-body)",
                          border: "1px solid var(--border-light)",
                        }}
                      >
                        ✓ {app}
                      </span>
                    ))}
                  </div>

                  {/* Security Notice */}
                  <div
                    style={{
                      background: "#eff6ff",
                      color: "#1d4ed8",
                      padding: "0.55rem 0.75rem",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.72rem",
                      marginTop: "0.75rem",
                      lineHeight: 1.35,
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                    }}
                  >
                    🔒 <strong>Strict UPI Policy:</strong> Bank accounts &amp; IFSC are permanently hidden to protect against fraud. WhatsApp bot strictly delivers this verified QR code and UPI ID.
                  </div>

                  <button
                    onClick={() => setActiveTab("payment")}
                    className="btn btn-primary"
                    style={{ width: "100%", padding: "0.5rem", fontSize: "0.78rem", marginTop: "0.75rem" }}
                  >
                    Manage Payment &amp; QR Studio →
                  </button>
                </div>

                {/* Widget D: Live WhatsApp Customer Inquiry Stream */}
                <div className="chart-card">
                  <div className="chart-header">
                    <div>
                      <span className="chart-title">Customer WhatsApp &amp; Inquiries</span>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Live interactions from bot &amp; counter</div>
                    </div>
                    <button
                      onClick={() => setActiveTab("tester")}
                      className="btn btn-secondary"
                      style={{ padding: "0.25rem 0.55rem", fontSize: "0.7rem" }}
                    >
                      🧪 Test Bot
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {/* Event 1 */}
                    <div className="event-item">
                      <div className="event-icon green">📱</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
                          <span className="event-time">11:30 AM</span>
                          <span className="event-tag" style={{ background: "#dcfce7", color: "#16a34a" }}>Display Fix</span>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>WhatsApp</span>
                        </div>
                        <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--text-main)" }}>
                          iPhone 13 OLED Display Replacement
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                          Customer quoted ₹3,499 with 30-day warranty and same-day fitting at J.J Market shop.
                        </p>
                      </div>
                    </div>

                    {/* Event 2 */}
                    <div className="event-item">
                      <div className="event-icon purple">💳</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
                          <span className="event-time">11:28 AM</span>
                          <span className="event-tag" style={{ background: "#f3e8ff", color: "#7c3aed" }}>Payment QR</span>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Automated AI</span>
                        </div>
                        <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--text-main)" }}>
                          UPI QR Code Delivered
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                          Sent official Payment QR photo and UPI ID 9934215013@upi directly to customer for Samsung screen.
                        </p>
                      </div>
                    </div>

                    {/* Event 3 */}
                    <div className="event-item">
                      <div className="event-icon blue">💻</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
                          <span className="event-time">11:15 AM</span>
                          <span className="event-tag" style={{ background: "#e0f2fe", color: "#0284c7" }}>Laptop Service</span>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Store Walk-in</span>
                        </div>
                        <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--text-main)" }}>
                          512GB NVMe SSD Upgrade + Windows 11
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                          Walk-in customer at J.J Market, Sanhaula booked laptop speed upgrade and thermal servicing (₹2,499).
                        </p>
                      </div>
                    </div>

                    {/* Event 4 */}
                    <div className="event-item">
                      <div className="event-icon orange">🤖</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
                          <span className="event-time">10:50 AM</span>
                          <span className="event-tag" style={{ background: "#ffedd5", color: "#ea580c" }}>Multi-Lang</span>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Roman Urdu</span>
                        </div>
                        <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--text-main)" }}>
                          Language Auto-Matched
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                          Customer asked in Roman Urdu: <i>&quot;Bhai screen badalne ka kitna kharcha aayega?&quot;</i> — AI responded in friendly Roman Urdu.
                        </p>
                      </div>
                    </div>

                    {/* Event 5 */}
                    <div className="event-item">
                      <div className="event-icon red">🔋</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
                          <span className="event-time">10:15 AM</span>
                          <span className="event-tag" style={{ background: "#ffe4e6", color: "#e11d48" }}>Battery Repair</span>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Sanhaula Desk</span>
                        </div>
                        <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--text-main)" }}>
                          Redmi Note 10 Battery Replacement
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                          Fast 35-minute battery fix with 3-month replacement warranty completed at store.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 2: PRODUCTS & SERVICES CATALOG CMS
           ========================================================================= */}
        {activeTab === "products" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div
              className="chart-card"
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: "260px" }}>
                <input
                  type="text"
                  placeholder="Search mobile screen, battery, charger, SSD, web..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                  style={{ width: "100%", maxWidth: "420px" }}
                />
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  {filteredProducts.length} of {knowledge?.products?.length || 0} items
                </span>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary"
                style={{ padding: "0.55rem 1.1rem" }}
              >
                ➕ Add New Product / Service
              </button>
            </div>

            {/* Category Filter Chips */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                className={`filter-chip ${selectedCategory === "all" ? "active" : ""}`}
                onClick={() => setSelectedCategory("all")}
              >
                All ({knowledge?.products?.length || 0})
              </button>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-chip ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat} ({(knowledge?.products || []).filter((p) => p.category === cat).length})
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="products-grid">
              {filteredProducts.map((p) => (
                <div key={p.id} className="product-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                    <div>
                      <span className="badge-category">{p.category}</span>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-main)", marginTop: "0.4rem" }}>
                        {p.name}
                      </h3>
                    </div>
                    <span
                      onClick={() => toggleProductStatus(p.id)}
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        padding: "0.2rem 0.5rem",
                        borderRadius: "var(--radius-full)",
                        cursor: "pointer",
                        background: p.status === "active" ? "#dcfce7" : "#ffe4e6",
                        color: p.status === "active" ? "#16a34a" : "#e11d48",
                      }}
                      title="Click to toggle status"
                    >
                      ● {p.status === "active" ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", margin: "0.6rem 0" }}>
                    <span style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--primary-purple)", fontFamily: "var(--font-heading)" }}>
                      ₹{p.price.toLocaleString()}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      ({p.billingType})
                    </span>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.6rem" }}>
                    {p.turnaround && <span className="info-pill">⏱️ {p.turnaround}</span>}
                    {p.warranty && <span className="info-pill">🛡️ {p.warranty}</span>}
                    {p.compatibility && <span className="info-pill">📱 {p.compatibility}</span>}
                  </div>

                  <p style={{ fontSize: "0.8rem", color: "var(--text-body)", lineHeight: 1.4, marginBottom: "0.75rem" }}>
                    {p.description}
                  </p>

                  {p.features && p.features.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "1rem" }}>
                      {p.features.map((f, idx) => (
                        <div key={idx} style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <span style={{ color: "#22c55e" }}>✓</span> {f}
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "auto", paddingTop: "0.75rem", borderTop: "1px solid var(--border-light)" }}>
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setEditFeaturesInput((p.features || []).join("\n"));
                      }}
                      className="btn btn-secondary"
                      style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem" }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setProductToDelete(p)}
                      className="btn"
                      style={{
                        padding: "0.35rem 0.65rem",
                        fontSize: "0.75rem",
                        background: "#ffe4e6",
                        color: "#e11d48",
                        border: "none",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 3: PAYMENT & QR STUDIO CMS
           ========================================================================= */}
        {activeTab === "payment" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {/* Left: UPI Settings */}
            <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)" }}>
                  💳 Payment Gateway & UPI Settings
                </h2>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  Configure the official UPI ID and QR code delivered to customers upon payment requests.
                </p>
              </div>

              {/* Zero Bank Details Notice */}
              <div
                style={{
                  background: "#dcfce7",
                  borderRadius: "var(--radius-md)",
                  padding: "0.75rem 1rem",
                  fontSize: "0.8rem",
                  color: "#15803d",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>🛡️</span>
                <div>
                  <b>Privacy & Security Active:</b> Bank account numbers and IFSC are disabled. The AI bot and WhatsApp engine strictly share only the official UPI ID and Payment QR Code photo.
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.4rem" }}>
                  Official UPI ID (Google Pay / PhonePe / Paytm / BHIM)
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={knowledge?.paymentConfig?.upiId || "9934215013@upi"}
                    onChange={(e) => {
                      if (!knowledge) return;
                      setKnowledge({
                        ...knowledge,
                        paymentConfig: { ...knowledge.paymentConfig!, upiId: e.target.value },
                      });
                    }}
                    className="input-field"
                    style={{ flex: 1, fontFamily: "var(--font-mono)", fontWeight: 600 }}
                  />
                  <button onClick={handleCopyUpi} className="btn btn-secondary" style={{ padding: "0.5rem 0.85rem", fontSize: "0.8rem" }}>
                    📋 Copy
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.4rem" }}>
                  Payee Full Name
                </label>
                <input
                  type="text"
                  value={knowledge?.paymentConfig?.payeeName || "Muzaffar Iqbal Ishaati"}
                  onChange={(e) => {
                    if (!knowledge) return;
                    setKnowledge({
                      ...knowledge,
                      paymentConfig: { ...knowledge.paymentConfig!, payeeName: e.target.value },
                    });
                  }}
                  className="input-field"
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.4rem" }}>
                  Customer Payment Instructions (Delivered by AI & WhatsApp)
                </label>
                <textarea
                  rows={3}
                  value={
                    knowledge?.paymentConfig?.instructions ||
                    "Scan official QR code or pay via UPI ID: 9934215013@upi. Please share payment screenshot on WhatsApp to confirm your order or repair."
                  }
                  onChange={(e) => {
                    if (!knowledge) return;
                    setKnowledge({
                      ...knowledge,
                      paymentConfig: { ...knowledge.paymentConfig!, instructions: e.target.value },
                    });
                  }}
                  className="input-field"
                  style={{ width: "100%" }}
                />
              </div>

              <button
                onClick={() => saveKnowledgeToServer()}
                disabled={isSaving}
                className="btn btn-primary"
                style={{ width: "100%", padding: "0.65rem", marginTop: "0.25rem" }}
              >
                {isSaving ? "Saving..." : "Save Payment Settings"}
              </button>
            </div>

            {/* Right: Payment QR Code Studio */}
            <div className="qr-studio-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.25rem" }}>
              <div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--primary-purple)",
                    background: "rgba(124, 58, 237, 0.08)",
                    padding: "0.25rem 0.65rem",
                    borderRadius: "var(--radius-full)",
                  }}
                >
                  LIVE CUSTOMER SCANNER
                </span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-main)", marginTop: "0.5rem" }}>
                  Official Payment QR Code Photo
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  This official QR Code image is sent directly to customers on WhatsApp and web chat when payment details are requested.
                </p>
              </div>

              {/* QR Image Frame */}
              <div className="qr-image-frame">
                <img
                  src={`/uploads/payment-qr.png?t=${qrTimestamp}`}
                  alt="CyberMate Official Payment QR Code"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi%3A%2F%2Fpay%3Fpa%3D9934215013%40upi%26pn%3DMuzaffar%20Iqbal%20Ishaati%26cu%3DINR";
                  }}
                />
                <div className="qr-badge-upi">
                  <span>📱</span>
                  <span>UPI ID: {knowledge?.paymentConfig?.upiId || "9934215013@upi"}</span>
                </div>
              </div>

              {/* QR Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", width: "100%", maxWidth: "320px" }}>
                <button
                  onClick={handleGenerateUpiQr}
                  disabled={isGeneratingQr}
                  className="btn btn-primary"
                  style={{ padding: "0.6rem", fontSize: "0.825rem", width: "100%" }}
                >
                  {isGeneratingQr ? "Generating..." : "⚡ Auto-Generate Standard UPI QR"}
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUploadQrFile}
                  accept="image/png,image/jpeg,image/webp"
                  style={{ display: "none" }}
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingQr}
                  className="btn btn-secondary"
                  style={{ padding: "0.6rem", fontSize: "0.825rem", width: "100%" }}
                >
                  {isUploadingQr ? "Uploading..." : "📷 Upload Custom QR Screenshot"}
                </button>

                <button
                  onClick={handleDownloadQr}
                  className="btn btn-secondary"
                  style={{ padding: "0.5rem", fontSize: "0.75rem" }}
                >
                  📥 Download QR Image File
                </button>
              </div>

              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Supported Apps: PhonePe • Google Pay • Paytm • BHIM UPI • Amazon Pay
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 4: STORE PROFILE CMS
           ========================================================================= */}
        {activeTab === "profile" && (
          <div className="glass-panel" style={{ maxWidth: "850px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-main)" }}>
                🏢 Store Location & Business Profile
              </h2>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                These official business details are used by the AI assistant and WhatsApp bot to provide store location, working hours, and contact information.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-body)", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Business Name
                </label>
                <input
                  type="text"
                  value={knowledge?.businessProfile.businessName || ""}
                  onChange={(e) => {
                    if (!knowledge) return;
                    setKnowledge({
                      ...knowledge,
                      businessProfile: { ...knowledge.businessProfile, businessName: e.target.value },
                    });
                  }}
                  className="input-field"
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-body)", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Business Owner
                </label>
                <input
                  type="text"
                  value={knowledge?.businessProfile.ownerName || ""}
                  onChange={(e) => {
                    if (!knowledge) return;
                    setKnowledge({
                      ...knowledge,
                      businessProfile: { ...knowledge.businessProfile, ownerName: e.target.value },
                    });
                  }}
                  className="input-field"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-body)", fontWeight: 600, marginBottom: "0.35rem" }}>
                Tagline / Core Services
              </label>
              <input
                type="text"
                value={knowledge?.businessProfile.tagline || ""}
                onChange={(e) => {
                  if (!knowledge) return;
                  setKnowledge({
                    ...knowledge,
                    businessProfile: { ...knowledge.businessProfile, tagline: e.target.value },
                  });
                }}
                className="input-field"
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-body)", fontWeight: 600, marginBottom: "0.35rem" }}>
                Physical Store Address (Bhagalpur, Bihar, India)
              </label>
              <textarea
                rows={2}
                value={knowledge?.businessProfile.address || ""}
                onChange={(e) => {
                  if (!knowledge) return;
                  setKnowledge({
                    ...knowledge,
                    businessProfile: { ...knowledge.businessProfile, address: e.target.value },
                  });
                }}
                className="input-field"
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-body)", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Mobile & WhatsApp Number
                </label>
                <input
                  type="text"
                  value={knowledge?.businessProfile.whatsappNumber || ""}
                  onChange={(e) => {
                    if (!knowledge) return;
                    setKnowledge({
                      ...knowledge,
                      businessProfile: {
                        ...knowledge.businessProfile,
                        whatsappNumber: e.target.value,
                        mobileNumber: e.target.value,
                      },
                    });
                  }}
                  className="input-field"
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-body)", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Official Email
                </label>
                <input
                  type="email"
                  value={knowledge?.businessProfile.email || ""}
                  onChange={(e) => {
                    if (!knowledge) return;
                    setKnowledge({
                      ...knowledge,
                      businessProfile: { ...knowledge.businessProfile, email: e.target.value },
                    });
                  }}
                  className="input-field"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-body)", fontWeight: 600, marginBottom: "0.35rem" }}>
                Business Working Hours
              </label>
              <input
                type="text"
                value={knowledge?.businessProfile.businessHours || ""}
                onChange={(e) => {
                  if (!knowledge) return;
                  setKnowledge({
                    ...knowledge,
                    businessProfile: { ...knowledge.businessProfile, businessHours: e.target.value },
                  });
                }}
                className="input-field"
                style={{ width: "100%" }}
              />
            </div>

            <button
              onClick={() => saveKnowledgeToServer()}
              disabled={isSaving}
              className="btn btn-primary"
              style={{ padding: "0.75rem", marginTop: "0.5rem" }}
            >
              {isSaving ? "Saving..." : "Update Business Profile"}
            </button>
          </div>
        )}

        {/* =========================================================================
            VIEW 5: OFFERS & POLICIES CMS
           ========================================================================= */}
        {activeTab === "offers" && (
          <div className="glass-panel" style={{ maxWidth: "850px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-main)" }}>
                📢 Promotional Announcements & Pricing Policies
              </h2>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                Manage special announcements, seasonal promotions, and discount policies. The AI assistant automatically highlights active offers in customer quotes.
              </p>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.4rem" }}>
                Special Promotional Announcement Banner
              </label>
              <textarea
                rows={3}
                value={knowledge?.aiInstructions.specialAnnouncement || ""}
                onChange={(e) => {
                  if (!knowledge) return;
                  setKnowledge({
                    ...knowledge,
                    aiInstructions: { ...knowledge.aiInstructions, specialAnnouncement: e.target.value },
                  });
                }}
                className="input-field"
                style={{ width: "100%" }}
                placeholder="Example: Free 9D Tempered Glass with Mobile Screen Replacement & Free Windows Setup with Laptop SSD Upgrade!"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.4rem" }}>
                Pricing Policy Guidelines
              </label>
              <textarea
                rows={3}
                value={knowledge?.aiInstructions.pricingPolicy || ""}
                onChange={(e) => {
                  if (!knowledge) return;
                  setKnowledge({
                    ...knowledge,
                    aiInstructions: { ...knowledge.aiInstructions, pricingPolicy: e.target.value },
                  });
                }}
                className="input-field"
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.4rem" }}>
                Discount & Concession Rules (Combo Offers)
              </label>
              <textarea
                rows={3}
                value={knowledge?.aiInstructions.discountPolicy || ""}
                onChange={(e) => {
                  if (!knowledge) return;
                  setKnowledge({
                    ...knowledge,
                    aiInstructions: { ...knowledge.aiInstructions, discountPolicy: e.target.value },
                  });
                }}
                className="input-field"
                style={{ width: "100%" }}
              />
            </div>

            <button
              onClick={() => saveKnowledgeToServer()}
              disabled={isSaving}
              className="btn btn-primary"
              style={{ padding: "0.75rem", marginTop: "0.5rem" }}
            >
              {isSaving ? "Saving..." : "Save Offers & Policies"}
            </button>
          </div>
        )}

        {/* =========================================================================
            VIEW 6: FAQ KNOWLEDGE BASE CMS
           ========================================================================= */}
        {activeTab === "faqs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "950px", margin: "0 auto" }}>
            <div
              className="chart-card"
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)" }}>
                  ❓ Frequently Asked Questions (FAQ) Knowledge Base
                </h2>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  The AI assistant references these verified answers to address customer inquiries regarding turnaround times, warranty coverage, and shop timings.
                </p>
              </div>

              <button
                onClick={() => setShowAddFaqModal(true)}
                className="btn btn-primary"
                style={{ padding: "0.5rem 0.9rem", fontSize: "0.825rem" }}
              >
                ➕ Add New FAQ
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {(knowledge?.faqs || []).map((faq) => (
                <div key={faq.id} className="faq-card-item">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div style={{ flex: 1 }}>
                      <span className="badge-category" style={{ marginBottom: "0.35rem" }}>
                        {faq.category || "General"}
                      </span>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)", marginTop: "0.25rem" }}>
                        Q: {faq.question}
                      </h4>
                      <p style={{ fontSize: "0.825rem", color: "var(--text-body)", marginTop: "0.4rem", lineHeight: 1.45 }}>
                        A: {faq.answer}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button
                        onClick={() => setEditingFaq(faq)}
                        className="btn btn-secondary"
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="btn"
                        style={{
                          padding: "0.3rem 0.6rem",
                          fontSize: "0.75rem",
                          background: "#ffe4e6",
                          color: "#e11d48",
                          border: "none",
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 7: AI PERSONA & BEHAVIOR CMS
           ========================================================================= */}
        {activeTab === "instructions" && (
          <div className="glass-panel" style={{ maxWidth: "850px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-main)" }}>
                🤖 AI Persona, Tone & Master System Prompt
              </h2>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                Customize the master system prompt and response guidelines governing the AI assistant across WhatsApp and web channels.
              </p>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.4rem" }}>
                Master System Prompt (Instructions for AI)
              </label>
              <textarea
                rows={10}
                value={knowledge?.aiInstructions.systemPrompt || ""}
                onChange={(e) => {
                  if (!knowledge) return;
                  setKnowledge({
                    ...knowledge,
                    aiInstructions: { ...knowledge.aiInstructions, systemPrompt: e.target.value },
                  });
                }}
                className="input-field"
                style={{ width: "100%", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}
              />
            </div>

            <button
              onClick={() => saveKnowledgeToServer()}
              disabled={isSaving}
              className="btn btn-primary"
              style={{ padding: "0.75rem" }}
            >
              {isSaving ? "Saving..." : "Update AI Persona & Prompt"}
            </button>
          </div>
        )}

        {/* =========================================================================
            VIEW 8: LIVE AI CHAT SIMULATOR & TESTER
           ========================================================================= */}
        {activeTab === "tester" && (
          <div className="glass-panel" style={{ maxWidth: "850px", margin: "0 auto", display: "flex", flexDirection: "column", height: "680px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.75rem", marginBottom: "0.75rem" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
                  🧪 Live AI Simulator & Diagnostics
                </h3>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Verify how the AI retrieves catalog prices, store location, and delivers the Payment QR Code image.
                </p>
              </div>

              <button
                onClick={() =>
                  setTestMessages([
                    {
                      role: "assistant",
                      content: "Chat reset. Ask any question to verify live CMS data retrieval.",
                      time: "Now",
                    },
                  ])
                }
                className="btn btn-secondary"
                style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem" }}
              >
                🔄 Reset Chat
              </button>
            </div>

            {/* Quick Test Prompt Chips */}
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
              <button
                onClick={() => handleSendTestMessage("How can I make a payment? Please share QR code and UPI ID.")}
                className="filter-chip"
                style={{ fontSize: "0.725rem", padding: "0.25rem 0.6rem" }}
              >
                💳 Payment QR Code & UPI
              </button>
              <button
                onClick={() => handleSendTestMessage("What is the cost and warranty for mobile screen replacement?")}
                className="filter-chip"
                style={{ fontSize: "0.725rem", padding: "0.25rem 0.6rem" }}
              >
                📱 Mobile Screen Replacement Price
              </button>
              <button
                onClick={() => handleSendTestMessage("Where is your store located and what are your working hours?")}
                className="filter-chip"
                style={{ fontSize: "0.725rem", padding: "0.25rem 0.6rem" }}
              >
                📍 Store Address & Working Hours
              </button>
              <button
                onClick={() => handleSendTestMessage("How much does a laptop SSD upgrade cost?")}
                className="filter-chip"
                style={{ fontSize: "0.725rem", padding: "0.25rem 0.6rem" }}
              >
                💻 Laptop SSD Upgrade Cost
              </button>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.85rem", paddingRight: "0.5rem" }}>
              {testMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "0.75rem 1rem",
                      borderRadius: "14px",
                      background: msg.role === "user" ? "var(--primary-purple-gradient)" : "#f8fafc",
                      color: msg.role === "user" ? "#fff" : "var(--text-main)",
                      fontSize: "0.85rem",
                      lineHeight: 1.45,
                      border: msg.role === "user" ? "none" : "1px solid var(--border-light)",
                      whiteSpace: "pre-wrap",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                    }}
                  >
                    {msg.content}

                    {/* Media Preview if QR Code returned */}
                    {msg.media && msg.media.type === "image" && (
                      <div className="chat-bubble-media">
                        <img src={`${msg.media.url}?t=${qrTimestamp}`} alt="Payment QR Code" />
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary-purple)", textAlign: "center" }}>
                          {msg.media.caption}
                        </div>
                        {msg.media.upiId && (
                          <button
                            onClick={handleCopyUpi}
                            className="btn btn-secondary"
                            style={{ padding: "0.3rem 0.6rem", fontSize: "0.7rem", width: "100%" }}
                          >
                            📋 Copy UPI ID ({msg.media.upiId})
                          </button>
                        )}
                      </div>
                    )}

                    {/* Tool Calls Inspector */}
                    {msg.toolCalls && msg.toolCalls.length > 0 && (
                      <div
                        style={{
                          marginTop: "0.5rem",
                          paddingTop: "0.5rem",
                          borderTop: msg.role === "user" ? "1px solid rgba(255,255,255,0.2)" : "1px solid var(--border-light)",
                          fontSize: "0.7rem",
                          color: msg.role === "user" ? "#e0e7ff" : "var(--primary-purple)",
                        }}
                      >
                        ⚡ <b>CMS Lookup:</b> {msg.toolCalls[0].output}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                    {msg.role === "user" ? "You" : "CyberMate AI"} • {msg.time}
                  </span>
                </div>
              ))}

              {isTesting && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--primary-purple)", fontSize: "0.8rem", fontWeight: 600 }}>
                  <span>⏳ CyberMate AI consulting live CMS...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-light)" }}>
              <input
                type="text"
                placeholder="Ask about service rates, repair warranties, store address, or payment details..."
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendTestMessage();
                }}
                className="input-field"
                style={{ flex: 1 }}
              />
              <button
                onClick={() => handleSendTestMessage()}
                disabled={isTesting || !testInput.trim()}
                className="btn btn-primary"
                style={{ padding: "0.55rem 1.25rem" }}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 9: WHATSAPP BOT STATUS & GATEWAY
           ========================================================================= */}
        {activeTab === "whatsapp" && (
          <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "650px", margin: "0 auto" }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: "#dcfce7",
                  color: "#16a34a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.676.15-.2.301-.776.979-.952 1.179-.175.2-.351.226-.652.076-.301-.15-1.272-.469-2.424-1.496-.897-.799-1.503-1.787-1.678-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.201-.301.302-.502.1-.2.05-.376-.025-.526-.075-.15-.677-1.631-.928-2.234-.244-.588-.493-.509-.677-.518-.175-.009-.376-.009-.576-.009-.2 0-.526.075-.802.376-.276.301-1.053 1.029-1.053 2.509s1.078 2.909 1.229 3.11c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.634.721.229 1.378.197 1.897.119.578-.087 1.78-.727 2.031-1.43.251-.703.251-1.304.176-1.43-.076-.126-.276-.201-.577-.351z"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.308C8.423 21.523 10.154 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.64 0-3.17-.48-4.46-1.31l-.32-.21-2.95.77.79-2.87-.23-.36C3.96 14.88 3.8 13.48 3.8 12c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2z"/>
                </svg>
              </div>

              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-main)" }}>
                WhatsApp AI Bot & Live QR Scanner
              </h2>
              <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
                The WhatsApp business bot is synchronized in real-time with your catalog pricing, UPI details, and store instructions.
              </p>
            </div>

            <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "10px", border: "1px solid var(--border-light)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-body)" }}>Bot Process Status:</span>
                <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", background: "#dcfce7", color: "#16a34a", borderRadius: "var(--radius-full)", fontWeight: 700 }}>
                  ● READY / LISTENING (Port 3001)
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-body)" }}>Live Sync Source:</span>
                <span style={{ fontSize: "0.75rem", color: "var(--primary-purple)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                  data/business_knowledge.json
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-body)" }}>Active QR Code File:</span>
                <span style={{ fontSize: "0.75rem", color: "var(--primary-purple)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                  public/uploads/payment-qr.png
                </span>
              </div>
            </div>

            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <a
                href="http://localhost:3001"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ display: "inline-flex", width: "100%", padding: "0.75rem", textDecoration: "none" }}
              >
                Scan WhatsApp QR Code & Link Phone Device →
              </a>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Open WhatsApp on your mobile phone &gt; Settings &gt; Linked Devices &gt; Link a Device.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODALS: ADD PRODUCT
         ========================================================================= */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)" }}>
                ➕ Add New Product / Service
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                  Product / Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile Display Replacement"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="input-field"
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                    Category *
                  </label>
                  {!isAddCustomCategory ? (
                    <select
                      value={newProd.category}
                      onChange={(e) => {
                        if (e.target.value === "custom") {
                          setIsAddCustomCategory(true);
                        } else {
                          setNewProd({ ...newProd, category: e.target.value });
                        }
                      }}
                      className="input-field"
                      style={{ width: "100%" }}
                    >
                      {allCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="custom">➕ + Custom Category</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Enter new category..."
                      value={addCustomCategory}
                      onChange={(e) => setAddCustomCategory(e.target.value)}
                      className="input-field"
                      style={{ width: "100%" }}
                    />
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                    Item Type
                  </label>
                  <select
                    value={newProd.itemType}
                    onChange={(e) => setNewProd({ ...newProd, itemType: e.target.value as "service" | "product" })}
                    className="input-field"
                    style={{ width: "100%" }}
                  >
                    <option value="service">🛠️ Repair / Service</option>
                    <option value="product">📦 Physical Product</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                    Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="input-field"
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                    Billing Type
                  </label>
                  <input
                    type="text"
                    value={newProd.billingType}
                    onChange={(e) => setNewProd({ ...newProd, billingType: e.target.value })}
                    className="input-field"
                    style={{ width: "100%" }}
                    placeholder="Starting from / Fixed"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                    Turnaround Time
                  </label>
                  <input
                    type="text"
                    value={newProd.turnaround}
                    onChange={(e) => setNewProd({ ...newProd, turnaround: e.target.value })}
                    className="input-field"
                    style={{ width: "100%" }}
                    placeholder="1 - 2 Hours"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                    Warranty
                  </label>
                  <input
                    type="text"
                    value={newProd.warranty}
                    onChange={(e) => setNewProd({ ...newProd, warranty: e.target.value })}
                    className="input-field"
                    style={{ width: "100%" }}
                    placeholder="30 Days Warranty"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                  Device Compatibility / Models
                </label>
                <input
                  type="text"
                  value={newProd.compatibility}
                  onChange={(e) => setNewProd({ ...newProd, compatibility: e.target.value })}
                  className="input-field"
                  style={{ width: "100%" }}
                  placeholder="iPhone, Samsung, Realme, All Models"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="input-field"
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                  Features (1 per line)
                </label>
                <textarea
                  rows={2}
                  value={newFeaturesInput}
                  onChange={(e) => setNewFeaturesInput(e.target.value)}
                  className="input-field"
                  style={{ width: "100%" }}
                  placeholder="High Quality Display&#10;Free Fitting&#10;Testing Warranty"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                  style={{ padding: "0.5rem 1rem" }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: "0.5rem 1.25rem" }}>
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS: EDIT PRODUCT
         ========================================================================= */}
      {editingProduct && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)" }}>
                ✏️ Edit Product / Service
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="input-field"
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                    Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="input-field"
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                    Billing Type
                  </label>
                  <input
                    type="text"
                    value={editingProduct.billingType}
                    onChange={(e) => setEditingProduct({ ...editingProduct, billingType: e.target.value })}
                    className="input-field"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                    Turnaround Time
                  </label>
                  <input
                    type="text"
                    value={editingProduct.turnaround || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, turnaround: e.target.value })}
                    className="input-field"
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                    Warranty
                  </label>
                  <input
                    type="text"
                    value={editingProduct.warranty || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, warranty: e.target.value })}
                    className="input-field"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="input-field"
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                  Features (1 per line)
                </label>
                <textarea
                  rows={2}
                  value={editFeaturesInput}
                  onChange={(e) => setEditFeaturesInput(e.target.value)}
                  className="input-field"
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="btn btn-secondary"
                  style={{ padding: "0.5rem 1rem" }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: "0.5rem 1.25rem" }}>
                  Update Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS: ADD FAQ
         ========================================================================= */}
      {showAddFaqModal && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)" }}>
                ➕ Add Frequently Asked Question
              </h3>
              <button
                onClick={() => setShowAddFaqModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFaqSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mobile Repairing, Warranty, Payment"
                  value={newFaq.category}
                  onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                  className="input-field"
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                  Question *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How much time does mobile screen replacement take?"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  className="input-field"
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                  Official Answer (Used by AI) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Mobile screen replacement typically takes 1 to 2 hours with same-day hand-to-hand delivery."
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  className="input-field"
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowAddFaqModal(false)}
                  className="btn btn-secondary"
                  style={{ padding: "0.5rem 1rem" }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: "0.5rem 1.25rem" }}>
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS: EDIT FAQ
         ========================================================================= */}
      {editingFaq && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)" }}>
                ✏️ Edit Frequently Asked Question
              </h3>
              <button
                onClick={() => setEditingFaq(null)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditFaqSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                  Category
                </label>
                <input
                  type="text"
                  value={editingFaq.category || ""}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  className="input-field"
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="input-field"
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.3rem" }}>
                  Official Answer (Used by AI) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="input-field"
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="btn btn-secondary"
                  style={{ padding: "0.5rem 1rem" }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: "0.5rem 1.25rem" }}>
                  Update FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS: DELETE CONFIRMATION
         ========================================================================= */}
      {productToDelete && (
        <div className="modal-backdrop">
          <div className="modal-container" style={{ maxWidth: "400px", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>⚠️</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.5rem" }}>
              Delete &quot;{productToDelete.name}&quot;?
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
              Are you sure you want to remove this item from your live catalog? The AI assistant and WhatsApp bot will no longer quote this product.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
              <button
                onClick={() => setProductToDelete(null)}
                className="btn btn-secondary"
                style={{ padding: "0.5rem 1rem" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="btn"
                style={{
                  padding: "0.5rem 1.25rem",
                  background: "#e11d48",
                  color: "#fff",
                  border: "none",
                }}
              >
                Yes, Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
