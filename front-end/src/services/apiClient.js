// API Configuration and HTTP client
const API_BASE = "http://localhost:3000"; // Adjust to your Rails API URL

const apiClient = {
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for cookies
      body: JSON.stringify(data),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw { status: response.status, ...result };
    }

    return result;
  },

  get: async (endpoint) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw { status: response.status, ...result };
    }

    return result;
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw { status: response.status, ...result };
    }

    return true;
  },
};

export default apiClient;
