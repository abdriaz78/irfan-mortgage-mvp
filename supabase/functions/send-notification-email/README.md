# Client notification emails

Emails a client automatically whenever the app creates a notification for them —
i.e. every time an admin **moves a stage (with a note)**, **sends a request/note**,
or **reviews a document**. All of those insert a row into `public.notifications`,
and a Database Webhook on that insert calls this Edge Function, which sends the
email through [Resend](https://resend.com).

Nothing in the app code needs to change — this is entirely server-side.

## 1. Get a Resend API key

1. Create a free account at https://resend.com.
2. **Verify a sender.** For production, add your domain (Resend → Domains) and use
   a sender like `no-reply@fasttrackmortgages.co.uk`. For a quick test you can use
   `onboarding@resend.dev`, but Resend will only deliver to **your own account
   email** until a domain is verified.
3. Copy your API key (Resend → API Keys).

## 2. Deploy the function

Requires the [Supabase CLI](https://supabase.com/docs/guides/cli) and `supabase login`.
From the project root (where `supabase/` lives):

```bash
# Link once (project ref is in supabase/README.md)
supabase link --project-ref bjtiaotqcpotxyfgkzrc

# Deploy — public endpoint; we protect it with our own secret header instead of a JWT
supabase functions deploy send-notification-email --no-verify-jwt
```

## 3. Set the function secrets

```bash
supabase secrets set \
  RESEND_API_KEY="re_xxxxxxxx" \
  EMAIL_FROM="Fasttrack Mortgages <no-reply@fasttrackmortgages.co.uk>" \
  SITE_URL="https://your-deployed-site.example" \
  NOTIFY_WEBHOOK_SECRET="pick-a-long-random-string"
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided to the function
automatically — don't set them yourself.

## 4. Create the Database Webhook

In the Supabase dashboard → **Database → Webhooks → Create a new hook**:

- **Table:** `public.notifications`
- **Events:** `Insert`
- **Type:** `Supabase Edge Function` → select `send-notification-email`
- **HTTP Headers:** add `x-webhook-secret` = the same value you used for
  `NOTIFY_WEBHOOK_SECRET` above.

Save. From now on, every client notification also sends an email.

## 5. Test

1. As an admin, open a case and **move a stage with a note** (or send a request).
2. The client should get an in-app notification **and** an email within a few seconds.
3. If no email arrives, check **Edge Functions → send-notification-email → Logs**
   in the dashboard. Common causes: `RESEND_API_KEY` unset, unverified sender
   domain (Resend test mode only mails your own address), or a mismatched
   `x-webhook-secret`.

## Notes

- The email intentionally has no reply address — it tells clients to log in to the
  portal to message their adviser.
- To change the email wording, edit the `html` / `text` in `index.ts` and redeploy.
- Delivery is best-effort: if Resend is down the in-app notification still succeeds
  (the webhook is fire-and-forget, so a failed email never blocks an admin action).
