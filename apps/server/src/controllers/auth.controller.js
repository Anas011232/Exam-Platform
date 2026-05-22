import { getClient } from "../config/db.js";
import { hashPassword, comparePassword } from "../services/password.service.js";
import { generateAccessToken, generateRefreshToken } from "../services/token.service.js";
import { validateRegistration } from "../utils/validators.js";

/* =========================
   REGISTER
========================= */
export const register = async (req, res) => {
  try {
    const validationError = validateRegistration(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const db = getClient().db(process.env.DB_NAME);
    const usersCollection = db.collection("users");

    const { name, className, school, phone, email, password } = req.body;

    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = {
      name,
      class: className,
      school,
      phone,
      email,
      password: hashedPassword,
      role: "student",
      isPremium: false,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(user);

    const accessToken = generateAccessToken({
      _id: result.insertedId,
      email,
      role: "student",
    });

    const refreshToken = generateRefreshToken({
      _id: result.insertedId,
    });

    /* 🔥 IMPORTANT: COOKIE FIX */
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("role", "student", {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      accessToken,
      role: "student",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const db = getClient().db(process.env.DB_NAME);
    const usersCollection = db.collection("users");

    /* ================= ADMIN LOGIN ================= */
    if (email === process.env.ADMIN_EMAIL) {
      const isAdminPasswordCorrect =
        password === process.env.ADMIN_PASSWORD;

      if (!isAdminPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message: "Invalid admin credentials",
        });
      }

      const accessToken = generateAccessToken({
        _id: "admin",
        email,
        role: "admin",
      });

      /* 🔥 ADMIN COOKIE FIX */
      res.cookie("accessToken", accessToken, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        path: "/",
      });

      res.cookie("role", "admin", {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        path: "/",
      });

      return res.json({
        success: true,
        role: "admin",
        accessToken,
      });
    }

    /* ================= USER LOGIN ================= */
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    /* 🔥 USER COOKIE FIX */
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("role", user.role, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      role: user.role,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

/* =========================
   GET ME
========================= */
export const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
};

/* =========================
   LOGOUT
========================= */
export const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.clearCookie("role");

  return res.json({
    success: true,
    message: "Logout successful",
  });
};