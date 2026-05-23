import api from "../lib/axios";

// =========================
// REGISTER
// =========================
export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data, {
    withCredentials: true,
  });

  return response.data;
};

// =========================
// LOGIN
// =========================
export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data, {
    withCredentials: true,
  });

  return response.data;
};

// =========================
// GET ME (COOKIE BASED)
// =========================
export const getMe = async () => {
  const response = await api.get("/auth/me", {
    withCredentials: true,
  });

  return response.data;
};

// =========================
// LOGOUT
// =========================
export const logoutUser = async () => {
  const response = await api.post("/auth/logout", {}, {
    withCredentials: true,
  });

  return response.data;
};