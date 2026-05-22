"use client";

import { useEffect, useState } from "react";

import {
  getMe,
} from "../../services/auth.service";

export default function DashboardPage() {
  const [user, setUser] =
    useState(null);

  useEffect(() => {
    const loadUser =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "accessToken"
            );

          if (!token) {
            window.location.href =
              "/login";

            return;
          }

          const result =
            await getMe(
              token
            );

          setUser(
            result.user
          );
        } catch (error) {
          console.log(error);

          localStorage.removeItem(
            "accessToken"
          );

          window.location.href =
            "/login";
        }
      };

    loadUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(
      "accessToken"
    );

    window.location.href =
      "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-5 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-10 shadow-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black">
            Dashboard
          </h1>

          <button
            onClick={
              handleLogout
            }
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-bold"
          >
            Logout
          </button>
        </div>

        {user ? (
          <div className="mt-8 space-y-4">
            <div className="bg-gray-100 p-5 rounded-2xl">
              <p className="text-lg">
                <span className="font-bold">
                  Email:
                </span>{" "}
                {
                  user.email
                }
              </p>
            </div>

            <div className="bg-gray-100 p-5 rounded-2xl">
              <p className="text-lg">
                <span className="font-bold">
                  Role:
                </span>{" "}
                {
                  user.role
                }
              </p>
            </div>

            <div className="bg-gray-100 p-5 rounded-2xl">
              <p className="text-lg">
                <span className="font-bold">
                  User ID:
                </span>{" "}
                {user.id}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-10 text-center text-xl">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}