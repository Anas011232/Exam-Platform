"use client";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-gray-400">Total Users</h2>
          <p className="text-3xl font-bold mt-2">12,450</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-gray-400">Total Questions</h2>
          <p className="text-3xl font-bold mt-2">8,200</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-gray-400">Active Battles</h2>
          <p className="text-3xl font-bold mt-2">342</p>
        </div>

      </div>

      {/* Extra section */}
      <div className="mt-10 bg-gray-900 p-6 rounded-2xl border border-gray-800">
        <h2 className="text-xl font-bold mb-4">
          🔥 Recent Activity
        </h2>

        <ul className="space-y-2 text-gray-400">
          <li>• New user registered</li>
          <li>• 120 questions added</li>
          <li>• Battle mode peak active users: 1,240</li>
        </ul>
      </div>
    </div>
  );
}