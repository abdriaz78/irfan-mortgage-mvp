# Supabase setup

1. Open your Supabase project (`bjtiaotqcpotxyfgkzrc`) → **SQL Editor** → **New query**.
2. Paste the full contents of `migrations/0001_init.sql` and run it. This creates all tables, RLS policies, the `case-documents` storage bucket, and the stage/notification functions.
3. Sign up one client account through the app (`/signup`) so a `profiles` row exists.
4. Promote that account to admin by running in the SQL Editor:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```
   Log out and back in — you'll land on `/admin` instead of `/portal`.
5. In **Authentication → Settings**, you may want to disable "Confirm email" while testing locally so signup logs the user in immediately (otherwise they must click the confirmation email before their session is active).

No further admin signup surface exists in the app on purpose — new admins are always promoted this way.
