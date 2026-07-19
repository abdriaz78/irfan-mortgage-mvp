// Supabase Edge Function: emails a client whenever a notification row is created.
//
// Triggered by a Database Webhook on INSERT into public.notifications (see the
// README in this folder). Every admin action that alerts a client — moving a
// stage with a note, sending a request/note, or reviewing a document — inserts a
// notifications row, so hooking email here covers all of them.
//
// Sends via Resend (https://resend.com). Requires these Function secrets:
//   RESEND_API_KEY          — your Resend API key (required)
//   EMAIL_FROM              — verified sender, e.g. "Fasttrack Mortgages <no-reply@fasttrackmortgages.co.uk>"
//   SITE_URL                — your site origin, e.g. "https://your-app.example" (for the portal link)
//   NOTIFY_WEBHOOK_SECRET   — shared secret; the webhook must send it as the x-webhook-secret header
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const EMAIL_FROM = Deno.env.get("EMAIL_FROM") ?? "Fasttrack Mortgages <onboarding@resend.dev>";
const SITE_URL = Deno.env.get("SITE_URL") ?? "";
const WEBHOOK_SECRET = Deno.env.get("NOTIFY_WEBHOOK_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

Deno.serve(async (req) => {
  // Reject anything but the webhook (shared-secret check, if configured).
  if (WEBHOOK_SECRET && req.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: { type?: string; record?: Record<string, unknown> };
  try {
    payload = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const record = payload.record;
  // Only act on newly-inserted notification rows.
  if (payload.type !== "INSERT" || !record || typeof record.recipient_id !== "string") {
    return new Response("Ignored", { status: 200 });
  }

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return new Response("Email not configured", { status: 500 });
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // Look up the recipient's email + name.
  const { data: profile } = await admin
    .from("profiles")
    .select("email, full_name")
    .eq("id", record.recipient_id)
    .single();

  if (!profile?.email) {
    return new Response("No recipient email — skipped", { status: 200 });
  }

  // Case number for a friendlier subject (optional).
  let caseNumber = "";
  if (typeof record.case_id === "string") {
    const { data: c } = await admin
      .from("cases")
      .select("case_number")
      .eq("id", record.case_id)
      .single();
    caseNumber = c?.case_number ?? "";
  }

  const message = typeof record.message === "string" ? record.message : "";
  const firstName = (profile.full_name || "").trim().split(" ")[0] || "there";
  const subject = caseNumber
    ? `Update on your mortgage case ${caseNumber}`
    : "An update on your mortgage application";
  const portalUrl = SITE_URL ? `${SITE_URL.replace(/\/$/, "")}/portal` : "";

  const button = portalUrl
    ? `<a href="${esc(portalUrl)}" style="display:inline-block;background:#0f4d3f;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:14px">View your case</a>`
    : "";

  const html = `<!doctype html><html><body style="margin:0;background:#f4f4f2;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a">
    <div style="max-width:520px;margin:0 auto;padding:32px 20px">
      <div style="font-size:18px;font-weight:700;color:#0f4d3f;margin-bottom:24px">Fasttrack Mortgages</div>
      <div style="background:#ffffff;border-radius:16px;padding:28px">
        <p style="margin:0 0 14px;font-size:15px">Hi ${esc(firstName)},</p>
        <p style="margin:0 0 18px;font-size:15px;line-height:1.55">There's an update on your mortgage application${caseNumber ? ` (case ${esc(caseNumber)})` : ""}:</p>
        <div style="background:#f4f4f2;border-left:3px solid #d4a94a;border-radius:8px;padding:14px 16px;font-size:15px;line-height:1.55;margin-bottom:22px">${esc(message)}</div>
        ${button}
      </div>
      <p style="font-size:12px;color:#8a8a8a;margin:20px 2px 0;line-height:1.5">
        You're receiving this because you have an active case with Fasttrack Mortgages.
        Please don't reply to this email — log in to your portal to message your adviser.
      </p>
    </div>
  </body></html>`;

  const text = `Hi ${firstName},

There's an update on your mortgage application${caseNumber ? ` (case ${caseNumber})` : ""}:

${message}
${portalUrl ? `\nView your case: ${portalUrl}` : ""}

— Fasttrack Mortgages`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: EMAIL_FROM, to: [profile.email], subject, html, text }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Resend send failed", res.status, detail);
    return new Response("Email send failed", { status: 500 });
  }

  return new Response("OK", { status: 200 });
});
