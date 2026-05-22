"use client";

import Link from "next/link";

import { useState } from "react";

import {
  loginUser,
} from "../../../services/auth.service";

export default function LoginPage() {
  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const result =
        await loginUser(
          formData
        );

      localStorage.setItem(
        "accessToken",
        result.accessToken
      );

      alert("Login Success");

      window.location.href =
        "/dashboard";
    } catch (error) {
      alert(
        error.response?.data
          ?.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-700 flex items-center justify-center p-5">
      <form
        onSubmit={
          handleSubmit
        }
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
      >
        <h1 className="text-4xl font-black text-center mb-8">
          Login
        </h1>

        <div className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-4 rounded-2xl outline-none"
            onChange={
              handleChange
            }
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-4 rounded-2xl outline-none"
            onChange={
              handleChange
            }
          />

          <button className="w-full bg-black hover:bg-gray-800 duration-300 text-white p-4 rounded-2xl font-bold text-lg">
            {loading
              ? "Loading..."
              : "Login"}
          </button>
        </div>

        

        <p className="text-center mt-6">
          Don't have account?{" "}
          <Link
            href="/register"
            className="font-bold underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}