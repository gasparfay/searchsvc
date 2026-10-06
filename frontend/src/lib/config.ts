/**
 * Centralized API and Endpoint Configuration.
 * Configured via NEXT_PUBLIC_API_URL environment variable with fallback for development.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const SEARCH_ENDPOINT_PATH = "/search";

export const SEARCH_ENDPOINT_BASE_URL = `${API_BASE_URL}${SEARCH_ENDPOINT_PATH}`;
