import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL, SITE_HOST } from "@/lib/constants";

/**
 * Collab form → email via Resend (free tier).
 * Needs RESEND_API_KEY (.env.local locally, Vercel env vars in production),
 * and gaurav-raj.in verified as a sending domain in the Resend dashboard.
 * Limits match the client-side schema in collab-modal.tsx.
 */
const LIMITS = { name: 100, email: 254, projectType: 60, message: 5000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Collab API: RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Email is not configured" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const name = str(body.name);
    const email = str(body.email);
    const projectType = str(body.projectType);
    const message = str(body.message);

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (
      !EMAIL_RE.test(email) ||
      name.length > LIMITS.name ||
      email.length > LIMITS.email ||
      projectType.length > LIMITS.projectType ||
      message.length > LIMITS.message
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const resend = new Resend(apiKey);
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeProjectType = escapeHtml(projectType || "—");
    const safeMessage = escapeHtml(message);

    const { data, error } = await resend.emails.send({
      from: "Gaurav Raj <hello@gaurav-raj.in>",
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `New Collab Request — ${name.replace(/[\r\n]+/g, " ")}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Collab Request</title>
</head>
<body style="margin:0;padding:0;background:#080808;color:#f0f0ef;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:600px;margin:0 auto;padding:48px 32px;">

    <p style="font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:0.3em;color:#c93a2a;text-transform:uppercase;margin:0 0 16px;">✦ GAURAV RAJ × COLLAB</p>

    <h1 style="font-size:48px;font-weight:normal;line-height:0.9;margin:0 0 28px;letter-spacing:-0.02em;">
      New<br/><span style="color:#c93a2a;">Request.</span>
    </h1>

    <div style="height:1px;background:linear-gradient(to right,#c93a2a,transparent);margin-bottom:40px;"></div>

    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.25em;color:rgba(255,255,255,0.35);text-transform:uppercase;padding-bottom:6px;white-space:nowrap;padding-right:28px;vertical-align:top;width:80px;">FROM</td>
        <td style="font-size:20px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.08);">${safeName}</td>
      </tr>
      <tr><td colspan="2" style="height:20px;"></td></tr>
      <tr>
        <td style="font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.25em;color:rgba(255,255,255,0.35);text-transform:uppercase;padding-bottom:6px;white-space:nowrap;padding-right:28px;vertical-align:top;">EMAIL</td>
        <td style="font-size:20px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.08);">
          <a href="mailto:${safeEmail}" style="color:#c93a2a;text-decoration:none;">${safeEmail}</a>
        </td>
      </tr>
      <tr><td colspan="2" style="height:20px;"></td></tr>
      <tr>
        <td style="font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.25em;color:rgba(255,255,255,0.35);text-transform:uppercase;padding-bottom:6px;white-space:nowrap;padding-right:28px;vertical-align:top;">TYPE</td>
        <td style="font-size:20px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.08);">${safeProjectType}</td>
      </tr>
      <tr><td colspan="2" style="height:20px;"></td></tr>
      <tr>
        <td style="font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.25em;color:rgba(255,255,255,0.35);text-transform:uppercase;padding-bottom:6px;white-space:nowrap;padding-right:28px;vertical-align:top;">MESSAGE</td>
        <td style="font-size:16px;line-height:1.75;color:rgba(255,255,255,0.7);white-space:pre-wrap;">${safeMessage}</td>
      </tr>
    </table>

    <div style="margin-top:48px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.07);">
      <p style="font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.25em;color:rgba(255,255,255,0.2);text-transform:uppercase;margin:0;">${SITE_HOST.toUpperCase()}</p>
    </div>
  </div>
</body>
</html>`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Collab API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
