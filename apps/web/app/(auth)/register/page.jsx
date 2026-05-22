"use client";

import Link from "next/link";

import { useState } from "react";

import {
  registerUser,
} from "../../../services/auth.service";

export default function RegisterPage() {
  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      className: "",
      school: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
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
        await registerUser(
          formData
        );

      localStorage.setItem(
        "accessToken",
        result.accessToken
      );

      alert(
        "Registration Success"
      );

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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 flex items-center justify-center p-5">
      <form
        onSubmit={
          handleSubmit
        }
        className="w-full max-w-xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl"
      >
        <h1 className="text-4xl font-black text-center text-white mb-8">
          Create Account
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-4 rounded-2xl bg-white text-black outline-none"
            onChange={
              handleChange
            }
          />

          <select
            name="className"
            className="w-full p-4 rounded-2xl bg-white text-black outline-none"
            onChange={
              handleChange
            }
          >
            <option value="">
              Select Class
            </option>

            <option>
              HSC 1st Year
            </option>

            <option>
              HSC 2nd Year
            </option>

            <option>
              SSC
            </option>
          </select>

          <input
            type="text"
            name="school"
            placeholder="School / College"
            className="w-full p-4 rounded-2xl bg-white text-black outline-none"
            onChange={
              handleChange
            }
          />

          <input
            type="text"
            name="phone"
            placeholder="01712345678"
            className="w-full p-4 rounded-2xl bg-white text-black outline-none"
            onChange={
              handleChange
            }
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full p-4 rounded-2xl bg-white text-black outline-none"
            onChange={
              handleChange
            }
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-4 rounded-2xl bg-white text-black outline-none"
            onChange={
              handleChange
            }
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full p-4 rounded-2xl bg-white text-black outline-none"
            onChange={
              handleChange
            }
          />

          <button className="w-full bg-black hover:bg-gray-900 duration-300 text-white py-4 rounded-2xl font-bold text-lg">
            {loading
              ? "Loading..."
              : "Register"}
          </button>
        </div>

        <p className="text-center text-white mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}