// Admin-configurable app settings (stored in the public.app_settings table).

export const REVIEW_MESSAGE_KEY = "review_request_message";

// Fallback used before the setting is loaded, or if the app_settings row/table
// isn't present yet (e.g. the migration hasn't been run).
export const DEFAULT_REVIEW_MESSAGE =
  "Recommend Fasttrack Mortgages to friends and family and leave us a review on Google — as a thank-you, we'll give you 50% off our advice fee on your next mortgage. It only takes a minute, and it means the world to us.";

// Google review destination (link + QR code both point here).
export const GOOGLE_REVIEW_URL = "https://g.page/r/CVmfEGQ_wufFEAE/review";
