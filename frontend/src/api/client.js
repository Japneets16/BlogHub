const API_BASE_URL = (() => {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (configured && configured.trim().length > 0) {
    return configured;
  }
  if (typeof window !== "undefined") {
    const { hostname } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000";
    }
    return ""; // use same-origin when not on localhost
  }
  return "http://localhost:5000";
})();

function buildHeaders(token, body, extraHeaders = {}) {
  const headers = new Headers(extraHeaders);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (body && !(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return headers;
}

export async function request(path, options = {}) {
  const { method = "GET", body = null, token = null, headers: customHeaders } = options;
  const headers = buildHeaders(token, body, customHeaders);
  const payload = body && !(body instanceof FormData) ? JSON.stringify(body) : body;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: payload,
    credentials: "include",
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      data = { raw: text };
    }
  }

  if (!response.ok) {
    const message = data?.message ?? "Request failed";
    throw new Error(message);
  }

  return data;
}

export { API_BASE_URL };
