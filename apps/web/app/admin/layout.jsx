"use client";

import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-950 text-white">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-5 border-r border-gray-800">
        <h1 className="text-xl font-bold mb-8">
          ⚡ Admin Panel
        </h1>

        <nav className="space-y-4 text-gray-300">
          <Link href="/admin/dashboard" className="block hover:text-white">
            📊 Dashboard
          </Link>
          <Link href="/admin/users" className="block hover:text-white">
            👥 Users
          </Link>
          <Link href="/admin/questions" className="block hover:text-white">
            ❓ Questions
          </Link>
          <Link href="/admin/analytics" className="block hover:text-white">
            📈 Analytics
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        {children}
      </main>
    </div>
  );
}