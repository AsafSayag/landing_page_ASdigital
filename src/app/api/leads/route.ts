import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const webAppUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!webAppUrl) {
    return NextResponse.json({ error: "missing webapp url" }, { status: 500 });
  }

  const { name, phone, message, source } = await request.json();

  const sheetResponse = await fetch(webAppUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, message, source }),
  });

  if (!sheetResponse.ok) {
    return NextResponse.json({ error: "sheet append failed" }, { status: 502 });
  }

  return NextResponse.json({ result: "success" });
}
