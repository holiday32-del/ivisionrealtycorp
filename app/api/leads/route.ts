import { NextResponse } from "next/server";

export const runtime = "nodejs";
const allowedPages = new Set(["/contact", "/appointment", "/lease-up-services/prospects"]);
const clean = (value: unknown, max = 4000) => String(value ?? "").trim().slice(0, max);

export async function POST(request: Request) {
  const endpoint = process.env.LEADS_APPS_SCRIPT_URL;
  const secret = process.env.LEADS_APPS_SCRIPT_SECRET;
  if (!endpoint || !secret) return NextResponse.json({ success: false, error: "Lead processing is unavailable." }, { status: 503 });
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).hostname !== new URL(request.url).hostname) return NextResponse.json({ success: false }, { status: 403 });
  let body: Record<string, unknown>;
  try {
    if (Number(request.headers.get("content-length") || 0) > 16000) throw Error("Oversize");
    body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) throw Error("Invalid");
  } catch { return NextResponse.json({ success: false, error: "Invalid submission." }, { status: 400 }); }
  if (clean(body.website, 200)) return NextResponse.json({ success: true });
  const page = clean(body.page, 100);
  const name = clean(body.name, 200);
  const email = clean(body.email, 254);
  const phone = clean(body.phone, 80);
  const interest = clean(body.interest, 200);
  const message = clean(body.message, 4000);
  if (!allowedPages.has(page) || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message)
    return NextResponse.json({ success: false, error: "Please complete the required fields." }, { status: 400 });
  const id = clean(body.submissionId, 64);
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({success:false,error:"Missing submission ID."},{status:400});
  const payload = { secret, site: "IVISION Realty Corp", page, name, phone, email, interest: interest || "other", message, recipient: "info@ivisionrealtycorp.com", id };
  try {
    const response = await fetch(endpoint, { method: "POST", body: JSON.stringify(payload), redirect: "follow", signal: AbortSignal.timeout(12000) });
    const result = await response.json();
    if (!response.ok || result.success !== true) throw Error("Delivery was not confirmed");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "We could not send your request. Please try again." }, { status: 502 });
  }
}
