# Supabase setup

1. Open your Supabase project (`bjtiaotqcpotxyfgkzrc`) → **SQL Editor** → **New query**.
2. Paste the full contents of `migrations/0001_init.sql` and run it. This creates all tables, RLS policies, the `case-documents` storage bucket, and the stage/notification functions.
   Then run the later migrations in order — `0002_link_documents_to_requests.sql`, `0003_full_information_form.sql`, `0004_app_settings.sql` (admin-editable settings, incl. the review-request message), `0005_public_applications.sql` (stores no-login "Get Started" mortgage applications for admins to review), and `0006_referrals.sql` (stores "Refer a Client" submissions). Each is a plain SQL script you paste and run once.
3. Sign up one client account through the app (`/signup`) so a `profiles` row exists.
4. Promote that account to admin by running in the SQL Editor:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```
   Log out and back in — you'll land on `/admin` instead of `/portal`.
5. In **Authentication → Settings**, you may want to disable "Confirm email" while testing locally so signup logs the user in immediately (otherwise they must click the confirmation email before their session is active).

No further admin signup surface exists in the app on purpose — new admins are always promoted this way.

## Email notifications (optional)

To email clients automatically when an admin moves a stage, sends a note/request, or
reviews a document, deploy the `send-notification-email` Edge Function and add a
Database Webhook on `notifications` inserts. Full steps are in
[`functions/send-notification-email/README.md`](functions/send-notification-email/README.md).
In-app notifications work with or without this — email is an additive layer.
