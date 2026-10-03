import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
// @ts-ignore
import QRCode from "qrcode";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const QR_FILE_PATH = path.join(UPLOAD_DIR, "payment-qr.png");
const DATA_FILE_PATH = path.join(process.cwd(), "data", "business_knowledge.json");

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    ensureUploadDir();
    const contentType = req.headers.get("content-type") || "";

    // 1. Multipart Form Data (File Upload from file input)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      fs.writeFileSync(QR_FILE_PATH, buffer);

      // Update business_knowledge.json
      if (fs.existsSync(DATA_FILE_PATH)) {
        try {
          const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8");
          const data = JSON.parse(raw);
          if (!data.paymentConfig) data.paymentConfig = {};
          data.paymentConfig.qrImageUrl = `/uploads/payment-qr.png?t=${Date.now()}`;
          data.lastUpdated = new Date().toISOString();
          fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
        } catch (e) {
          console.warn("Could not update knowledge json with upload:", e);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Payment QR Code image uploaded successfully!",
        imageUrl: `/uploads/payment-qr.png?t=${Date.now()}`,
      });
    }

    // 2. JSON Payload: Generate from UPI ID or base64
    const body = await req.json();

    if (body.action === "generate_upi_qr") {
      const upiId = body.upiId?.trim() || "9934215013@upi";
      const payeeName = body.payeeName?.trim() || "Muzaffar Iqbal Ishaati";
      const encodedName = encodeURIComponent(payeeName);
      const upiUri = `upi://pay?pa=${upiId}&pn=${encodedName}&cu=INR&tn=CyberMate%20Solutions%20Payment`;

      await QRCode.toFile(QR_FILE_PATH, upiUri, {
        width: 450,
        margin: 2,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      });

      // Update business_knowledge.json
      if (fs.existsSync(DATA_FILE_PATH)) {
        try {
          const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8");
          const data = JSON.parse(raw);
          if (!data.paymentConfig) data.paymentConfig = {};
          data.paymentConfig.upiId = upiId;
          data.paymentConfig.payeeName = payeeName;
          data.paymentConfig.qrImageUrl = `/uploads/payment-qr.png?t=${Date.now()}`;
          data.lastUpdated = new Date().toISOString();
          fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
        } catch (e) {
          console.warn("Could not update knowledge json with qr generation:", e);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Standard UPI QR Code generated successfully!",
        imageUrl: `/uploads/payment-qr.png?t=${Date.now()}`,
        upiUri,
      });
    }

    if (body.imageBase64) {
      const base64Data = body.imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      fs.writeFileSync(QR_FILE_PATH, buffer);

      if (fs.existsSync(DATA_FILE_PATH)) {
        try {
          const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8");
          const data = JSON.parse(raw);
          if (!data.paymentConfig) data.paymentConfig = {};
          data.paymentConfig.qrImageUrl = `/uploads/payment-qr.png?t=${Date.now()}`;
          data.lastUpdated = new Date().toISOString();
          fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
        } catch (e) {
          console.warn("Could not update knowledge json with base64:", e);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Payment QR code saved from base64 image!",
        imageUrl: `/uploads/payment-qr.png?t=${Date.now()}`,
      });
    }

    return NextResponse.json({ error: "Unsupported upload request" }, { status: 400 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to process image upload" }, { status: 500 });
  }
}
