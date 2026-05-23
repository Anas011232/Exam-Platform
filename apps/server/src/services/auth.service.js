// services/auth.service.js

import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

// =========================
// REGISTER
// =========================
export const registerUser = async (data) => {
  try {
    const response = await axios.post(
      `${API}/api/auth/register`,
      data,
      {
        withCredentials: true, // 🔥 IMPORTANT
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// =========================
// LOGIN
// =========================
export const loginUser = async (data) => {
  try {
    const response = await axios.post(
      `${API}/api/auth/login`,
      data,
      {
        withCredentials: true, // 🔥 IMPORTANT
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// =========================
// GET ME
// =========================
export const getMe = async () => {
  try {
    const response = await axios.get(
      `${API}/api/auth/me`,
      {
        withCredentials: true, // 🔥 IMPORTANT
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// =========================
// LOGOUT
// =========================
export const logoutUser = async () => {
  try {
    const response = await axios.post(
      `${API}/api/auth/logout`,
      {},
      {
        withCredentials: true, // 🔥 IMPORTANT
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};