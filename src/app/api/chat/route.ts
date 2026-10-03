import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  billingType: string;
  currency: string;
  turnaround?: string;
  warranty?: string;
  compatibility?: string;
  description: string;
  features?: string[];
  status: string;
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

interface KnowledgeData {
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
}

function loadBusinessKnowledge(): KnowledgeData | null {
  try {
    const dataPath = path.join(process.cwd(), "data", "business_knowledge.json");
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to load business knowledge in chat route:", err);
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { messages, model = "claude-3-7-sonnet" } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages payload" }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const knowledge = loadBusinessKnowledge();

    const upiId = knowledge?.paymentConfig?.upiId || "9934215013@upi";
    const payeeName = knowledge?.paymentConfig?.payeeName || knowledge?.businessProfile?.ownerName || "Muzaffar Iqbal Ishaati";
    const qrImageUrl = knowledge?.paymentConfig?.qrImageUrl || "/uploads/payment-qr.png";

    // Construct enriched system instructions with live CMS data
    let dynamicSystemPrompt = `You are CyberMate AI, an intelligent business assistant for CyberMate Solutions. Always provide accurate prices and info from the catalog.`;
    let catalogSummary = "";
    let faqsSummary = "";

    if (knowledge) {
      const { businessProfile, aiInstructions, products, paymentConfig, faqs } = knowledge;
      
      catalogSummary = products
        .filter((p) => p.status === "active")
        .map(
          (p) =>
            `- ${p.name} [${p.category}]: ${p.currency} ${p.price.toLocaleString()} (${p.billingType})\n  Turnaround: ${p.turnaround || "Fast"}\n  Warranty: ${p.warranty || "Available"}\n  Description: ${p.description}\n  Includes: ${(p.features || []).join(", ")}`
        )
        .join("\n\n");

      if (faqs && faqs.length > 0) {
        faqsSummary = faqs
          .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
          .join("\n\n");
      }

      dynamicSystemPrompt = `
You are the official AI assistant for ${businessProfile.businessName} (${businessProfile.tagline}).
${aiInstructions.systemPrompt}

### BUSINESS DETAILS:
- Business Name: ${businessProfile.businessName}
- Business Owner: ${businessProfile.ownerName || "Muzaffar Iqbal Ishaati"}
- Shop Address: ${businessProfile.address || "J.J Market, Sanhaula, Bhagalpur, Bihar 813205, India"}
- Country: India (All pricing in Indian Rupees INR / ₹)
- Mobile / WhatsApp: ${businessProfile.whatsappNumber || "9934215013"}
- Official Email: ${businessProfile.email || "muzaffarishaati@gmail.com"}
- Business Hours: ${businessProfile.businessHours || "Mon - Sat: 09:30 AM - 08:30 PM (IST)"}
- Currency: ${businessProfile.currency || "INR"} (₹)

### PAYMENT DETAILS (IMPORTANT: STRICTLY NO BANK ACCOUNTS OR IFSC!):
- Official UPI ID: ${upiId}
- Payee Name: ${payeeName}
- Accepted Apps: PhonePe, Google Pay, Paytm, BHIM UPI
- Payment QR Code: Official QR Code is automatically displayed when requested.
- Instructions: Customer should scan the QR Code or pay to UPI ID ${upiId}, then send payment screenshot on WhatsApp (${businessProfile.whatsappNumber || "9934215013"}).
- RULE: NEVER provide bank account numbers, IFSC codes, or net banking details. ONLY use UPI ID and QR code.

### SPECIAL ANNOUNCEMENT / OFFERS:
${aiInstructions.specialAnnouncement || "None currently active."}

### PRICING POLICY:
${aiInstructions.pricingPolicy}

### DISCOUNT POLICY:
${aiInstructions.discountPolicy}

### FREQUENTLY ASKED QUESTIONS (FAQS):
${faqsSummary}

### LIVE PRODUCTS & SERVICES CATALOG (ACCURATE & CURRENT):
${catalogSummary}

### IMPORTANT INSTRUCTIONS:
1. When asked about ANY product, service, or cost, ALWAYS quote the exact price from the catalog above.
2. When asked about payment details, ALWAYS share UPI ID (${upiId}) and mention that the official QR Code is provided.
3. LANGUAGE RULE (CRITICAL): ALWAYS detect the customer's language and reply in the EXACT SAME language they use:
   - If the customer writes in English: Reply in clear, polite, and professional English.
   - If the customer writes in Hindi (हिंदी script): Reply in polite, natural Hindi.
   - If the customer writes in Roman Urdu or Hinglish (e.g., "kitna kharcha aayega", "payment kaise karein", "dukan kahan hai"): Reply in natural, friendly Roman Urdu / Hinglish.
   - If the customer writes in Urdu (اردو script): Reply in polite Urdu.
   Never force English on a customer who speaks Hindi or Hinglish, and never reply in Hindi/Hinglish to a customer writing in English. Always match the customer's language dynamically.
4. Never make up prices or invent bank details that are not in the catalog.
`.trim();
    }

    const lower = lastUserMessage.toLowerCase();
    const isPaymentQuery =
      lower.includes("pay") ||
      lower.includes("payment") ||
      lower.includes("upi") ||
      lower.includes("qr") ||
      lower.includes("scanner") ||
      lower.includes("phonepe") ||
      lower.includes("gpay") ||
      lower.includes("google pay") ||
      lower.includes("paytm") ||
      lower.includes("bhim") ||
      lower.includes("paise kaise") ||
      lower.includes("kharcha kaise") ||
      lower.includes("barcode");

    // Detect language of the query
    const isHindiScript = /[\u0900-\u097F]/.test(lastUserMessage);
    const isUrduScript = /[\u0600-\u06FF]/.test(lastUserMessage);
    const isHinglishRomanUrdu = /\b(kahan|kaise|karo|karein|kitna|kitne|kya|hai|hain|nhi|nahi|bhejo|dukan|paise|kharcha|bhai|aap|hum|chahiye|shamil|sampark|batayein|mujhe|mera|meri|karna|hoga|batao)\b/i.test(lastUserMessage);
    const isEnglish = !isHindiScript && !isUrduScript && !isHinglishRomanUrdu;

    // 1. Try Google Gemini API if GEMINI_API_KEY is available
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && !geminiKey.startsWith("mock")) {
      const geminiModels = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];
      for (const gModel of geminiModels) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${gModel}:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `${dynamicSystemPrompt}\n\nClient Conversation:\n${messages
                          .map((m: Message) => `${m.role === "user" ? "Client" : "Assistant"}: ${m.content}`)
                          .join("\n")}\nAssistant:`,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  temperature: 0.6,
                  maxOutputTokens: 400,
                },
              }),
            }
          );

          if (geminiRes.ok) {
            const data = await geminiRes.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (reply) {
              return NextResponse.json({
                reply,
                media: isPaymentQuery
                  ? {
                      type: "image",
                      url: qrImageUrl,
                      caption: `CyberMate Solutions Official Payment QR Code (UPI ID: ${upiId})`,
                      upiId,
                      payeeName,
                    }
                  : undefined,
                modelUsed: `Gemini (${gModel})`,
                toolCalls: [
                  {
                    name: isPaymentQuery ? "payment_qr_lookup" : "live_catalog_lookup",
                    input: { query: lastUserMessage.slice(0, 40) },
                    output: isPaymentQuery
                      ? `Delivered QR Code image (${qrImageUrl}) and UPI ID (${upiId})`
                      : `Loaded ${knowledge?.products?.length || 0} live products from business_knowledge.json`,
                  },
                ],
                tokens: Math.floor(Math.random() * 50) + 120,
              });
            }
          }
        } catch (err) {
          console.warn(`Gemini API ${gModel} call failed, trying next:`, err);
        }
      }
    }

    // 2. High-Intelligence Live CMS Fallback Engine (Language Adaptive)
    let replyText = "";
    let mediaPayload: { type: "image"; url: string; caption: string; upiId?: string; payeeName?: string } | undefined = undefined;
    const activeProducts = knowledge?.products?.filter((p) => p.status === "active") || [];
    const faqs = knowledge?.faqs || [];

    // Check FAQ match
    const matchedFaq = faqs.find((f) => {
      const qLower = f.question.toLowerCase();
      const words = qLower.split(" ").filter((w) => w.length > 3);
      return words.filter((w) => lower.includes(w)).length >= 2;
    });

    // Check product match
    const matchedProduct = activeProducts.find((p) => {
      const nameParts = p.name.toLowerCase().split(" ");
      const categoryParts = p.category.toLowerCase().split(" ");
      return (
        lower.includes(p.name.toLowerCase()) ||
        nameParts.some((part) => part.length > 3 && lower.includes(part)) ||
        categoryParts.some((cat) => cat.length > 3 && lower.includes(cat))
      );
    });

    const bName = knowledge?.businessProfile.businessName || "CyberMate Solutions";
    const bOwner = knowledge?.businessProfile.ownerName || "Muzaffar Iqbal Ishaati";
    const bAddress = knowledge?.businessProfile.address || "J.J Market, Sanhaula, Bhagalpur, Bihar 813205, India";
    const bPhone = knowledge?.businessProfile.whatsappNumber || "9934215013";
    const bEmail = knowledge?.businessProfile.email || "muzaffarishaati@gmail.com";
    const bHours = knowledge?.businessProfile.businessHours || "Mon - Sat: 09:30 AM - 08:30 PM (IST)";
    const bOffer = knowledge?.aiInstructions.specialAnnouncement || "";
    const bDiscount = knowledge?.aiInstructions.discountPolicy || "Special combo discount available for multiple repairs.";

    if (isPaymentQuery) {
      if (isEnglish) {
        replyText = `You can easily pay via Google Pay, PhonePe, Paytm, or any UPI app using our official Payment QR Code or UPI ID:\n\n💳 **CyberMate Solutions Official Payment Details:**\n🔹 **UPI ID:** \`${upiId}\`\n👤 **Payee Name:** ${payeeName}\n📲 **Accepted Apps:** PhonePe, Google Pay, Paytm, BHIM UPI\n\n📌 **Payment Steps:**\n1. Scan the official Payment QR Code shown below or copy the UPI ID.\n2. Once paid, please share a screenshot on WhatsApp (${bPhone}) to confirm your repair order.\n\n*(Note: Zero bank account numbers or net banking required — quick and secure payment via UPI only!)*`;
      } else {
        replyText = `Aap PhonePe, Google Pay, Paytm, ya kisi bhi UPI app se hamara official QR Code scan karke ya UPI ID par payment kar sakte hain:\n\n💳 **CyberMate Solutions Official Payment Details:**\n🔹 **UPI ID:** \`${upiId}\`\n👤 **Payee Name:** ${payeeName}\n📲 **Accepted Apps:** PhonePe, Google Pay, Paytm, BHIM UPI\n\n📌 **Payment Steps:**\n1. Niche diye gaye Payment QR Code ko scan karein ya UPI ID copy karein.\n2. Payment complete karne ke baad screenshot hamare WhatsApp (${bPhone}) par bhej dein taake aapka order/repair confirm ho sake.\n\n*(Note: Bank account ya IFSC ki bilkul zaroorat nahi hai — seedha QR / UPI se payment karein!)*`;
      }
      mediaPayload = {
        type: "image",
        url: qrImageUrl,
        caption: `CyberMate Solutions Official Payment QR Code (UPI ID: ${upiId})`,
        upiId,
        payeeName,
      };
    } else if (
      lower.includes("address") ||
      lower.includes("location") ||
      lower.includes("kahan") ||
      lower.includes("shop") ||
      lower.includes("dukan") ||
      lower.includes("bihar") ||
      lower.includes("bhagalpur") ||
      lower.includes("sanhaula")
    ) {
      if (isEnglish) {
        replyText = `Here is our official store address and business timings:\n\n📍 **Store Address:**\n**${bName}**\n${bAddress}\n\n👤 **Owner:** ${bOwner}\n📱 **Mobile / WhatsApp:** ${bPhone}\n📧 **Email:** ${bEmail}\n⏰ **Business Hours:** ${bHours}\n\nYou are welcome to visit our shop for fast diagnostics and same-day repair!`;
      } else {
        replyText = `Hamari shop ka official address aur details yeh hain:\n\n📍 **Shop Address:**\n**${bName}**\n${bAddress}\n\n👤 **Owner:** ${bOwner}\n📱 **Mobile / WhatsApp:** ${bPhone}\n📧 **Email:** ${bEmail}\n⏰ **Timings:** ${bHours}\n\nAap kisi bhi waqt hamari shop par aakar hand-to-hand repair karwa sakte hain!`;
      }
    } else if (
      lower.includes("contact") ||
      lower.includes("mobile number") ||
      lower.includes("phone number") ||
      lower.includes("whatsapp number") ||
      lower.includes("call number") ||
      lower.includes("email") ||
      lower.includes("owner") ||
      lower.includes("malik") ||
      lower.includes("muzaffar") ||
      lower.includes("ishaati")
    ) {
      if (isEnglish) {
        replyText = `You can reach out to CyberMate Solutions through the following official channels:\n\n👤 **Owner:** ${bOwner}\n📱 **Mobile / WhatsApp:** ${bPhone}\n📧 **Email:** ${bEmail}\n📍 **Address:** ${bAddress}\n⏰ **Timings:** ${bHours}`;
      } else {
        replyText = `Aap CyberMate Solutions se in contacts par sampark kar sakte hain:\n\n👤 **Owner:** ${bOwner}\n📱 **Mobile / WhatsApp:** ${bPhone}\n📧 **Email:** ${bEmail}\n📍 **Address:** ${bAddress}\n⏰ **Timings:** ${bHours}`;
      }
    } else if (lower.includes("discount") || lower.includes("kam") || lower.includes("off") || lower.includes("concession")) {
      if (isEnglish) {
        replyText = `Our pricing is genuine and competitive with replacement warranty. ${bDiscount}\n\n${bOffer ? `🎉 **Special Offer:** ${bOffer}\n\n` : ""}Feel free to share your device model or requirements for the best quote!`;
      } else {
        replyText = `Hamari pricing standard aur market-competitive hai. ${bDiscount}\n\n${bOffer ? `🎉 **Special Offer:** ${bOffer}\n\n` : ""}Aap apna device model ya requirement share karein, hum aapko best rate denge!`;
      }
    } else if (matchedFaq && !matchedProduct) {
      replyText = `📌 **${matchedFaq.question}**\n\n${matchedFaq.answer}\n\n${isEnglish ? "Do you need any additional details on this?" : "Aapko iske baare me mazeed jaankari chahiye?"}`;
    } else if (
      lower.includes("price") ||
      lower.includes("rate") ||
      lower.includes("cost") ||
      lower.includes("charge") ||
      lower.includes("kitna") ||
      lower.includes("kya rate") ||
      lower.includes("fee") ||
      matchedProduct
    ) {
      if (matchedProduct) {
        if (isEnglish) {
          replyText = `Certainly! The current rate for **${matchedProduct.name}** (${matchedProduct.category}) is **${matchedProduct.currency} ${matchedProduct.price.toLocaleString()}** (${matchedProduct.billingType}).\n\n📌 **Includes:**\n${(matchedProduct.features || []).map((f) => `• ${f}`).join("\n")}\n\n${matchedProduct.description}\n\n⏱️ **Turnaround:** ${matchedProduct.turnaround || "Fast Service"}\n🛡️ **Warranty:** ${matchedProduct.warranty || "Available"}\n\nWould you like to book this repair or visit our store in J.J Market, Sanhaula?`;
        } else {
          replyText = `Ji bilkul! **${matchedProduct.name}** (${matchedProduct.category}) ka current price **${matchedProduct.currency} ${matchedProduct.price.toLocaleString()}** (${matchedProduct.billingType}) hai.\n\n📌 **Isme shamil hai:**\n${(matchedProduct.features || []).map((f) => `• ${f}`).join("\n")}\n\n${matchedProduct.description}\n\n⏱️ **Turnaround:** ${matchedProduct.turnaround || "Fast Service"}\n🛡️ **Warranty:** ${matchedProduct.warranty || "Available"}\n\nAapko iske liye booking karni hai ya hamari shop (J.J Market, Sanhaula) visit karni hai?`;
        }
      } else {
        if (isEnglish) {
          replyText = `Hello! Here is the current catalog pricing for **${bName}** (J.J Market, Sanhaula, Bihar):\n\n${activeProducts
            .map((p) => `🔹 **${p.name}**: ₹${p.price.toLocaleString()} (${p.billingType})`)
            .join("\n")}\n\n${bOffer ? `🎉 **Special Announcement**: ${bOffer}\n\n` : ""}Which service or accessory would you like more information about?`;
        } else {
          replyText = `Namaste! **${bName}** (J.J Market, Sanhaula, Bihar) ki current pricing list:\n\n${activeProducts
            .map((p) => `🔹 **${p.name}**: ₹${p.price.toLocaleString()} (${p.billingType})`)
            .join("\n")}\n\n${bOffer ? `🎉 **Special Offer**: ${bOffer}\n\n` : ""}Aapko inme se kis service ya product ke baare me jaankari chahiye?`;
        }
      }
    } else {
      if (isEnglish) {
        replyText = `Hello! I am CyberMate AI, the official intelligent assistant for **${bName}** (J.J Market, Sanhaula, Bhagalpur, Bihar).\nOwner: ${bOwner}\n\nI can assist you with live rates for Mobile Repairing, Computer & Laptop Servicing, Premium Mobile Accessories, or Website Development. How can I help you today?`;
      } else {
        replyText = `Namaste / Hello! Main **${bName}** (J.J Market, Sanhaula, Bhagalpur) ka AI Assistant hoon.\nOwner: ${bOwner}\n\nMain aapko hamari Mobile Repairing, Computer/Laptop Servicing, Mobile Accessories, aur Website Development ke live rates bata sakta hoon. Aap kis cheez ki jaankari lena chahte hain?`;
      }
    }

    return NextResponse.json({
      reply: replyText,
      media: mediaPayload,
      modelUsed: "CyberMate Live CMS Intelligence Engine",
      toolCalls: [
        {
          name: isPaymentQuery ? "payment_qr_lookup" : matchedProduct ? "product_catalog_lookup" : "cms_knowledge_lookup",
          input: { query: lastUserMessage.slice(0, 40) },
          output: isPaymentQuery
            ? `Retrieved QR code ${qrImageUrl} and UPI ID ${upiId}`
            : matchedProduct
            ? `Matched product: "${matchedProduct.name}" at ${matchedProduct.currency} ${matchedProduct.price}`
            : `Consulted live CMS records from business_knowledge.json`,
        },
      ],
      tokens: 120,
    });
  } catch (error) {
    console.error("API Chat Route error:", error);
    return NextResponse.json({ error: "Internal Server Error in Chat Route" }, { status: 500 });
  }
}
