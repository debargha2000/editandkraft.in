/**
 * Authorized emails for the admin dashboard.
 * Only users in this list can access the admin portal and write to Firestore.
 */
export const ALLOWED_EMAILS = [
  "debarghapakhira@gmail.com"
];

/**
 * Helper to check if an email is authorized.
 */
export const isAuthorized = (email) => {
  return email && ALLOWED_EMAILS.includes(email.toLowerCase());
};
