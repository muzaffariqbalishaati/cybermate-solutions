import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "business_knowledge.json");

function getKnowledgeData() {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading business_knowledge.json:", err);
  }
  return null;
}

export async function GET() {
  const data = getKnowledgeData();
  if (!data) {
    return NextResponse.json({ error: "Failed to read knowledge file" }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const updatedData = {
      ...payload,
      lastUpdated: new Date().toISOString(),
    };

    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(updatedData, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "AI Knowledge Base & Product Prices updated successfully!",
      lastUpdated: updatedData.lastUpdated,
      data: updatedData,
    });
  } catch (err) {
    console.error("Error updating business_knowledge.json:", err);
    return NextResponse.json({ error: "Failed to write knowledge file" }, { status: 500 });
  }
}
