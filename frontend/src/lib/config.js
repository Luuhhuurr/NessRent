// `import.meta.env` only exists inside Vite; the fallback keeps this module
// importable from plain Node (the unit tests).
const env = import.meta.env ?? {};

const API_URL = env.VITE_API_URL || 'http://localhost:5000/api';

// The API is mounted under /api, but uploaded files are served from the
// server root. VITE_ASSET_URL points at that root; when it is missing we
// derive it from the API URL.
const ASSET_URL =
  env.VITE_ASSET_URL || API_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');

export { API_URL, ASSET_URL };
