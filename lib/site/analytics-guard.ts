/**
 * Inline runtime guard shared by every analytics/ads loader: true when the page
 * is viewed from a local/private environment, where tracking and ads must not fire.
 * Used inside generated <script> strings, so it is a JS expression, not TS.
 */
export const ANALYTICS_LOCAL_HOSTNAME_GUARD =
  `"localhost"===location.hostname||"127.0.0.1"===location.hostname||"::1"===location.hostname||location.hostname.endsWith(".local")||/^(10\\.|192\\.168\\.|172\\.(1[6-9]|2\\d|3[01])\\.)/.test(location.hostname)`;
