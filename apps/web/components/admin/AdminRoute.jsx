"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminRoute({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user"));

    // ❌ not logged in
    if (!token) {
      router.replace("/login");
      return;
    }

    // ❌ not admin
    if (!user || user.role !== "admin") {
      router.replace("/dashboard");
      return;
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking access...
      </div>
    );
  }

  return children;
}