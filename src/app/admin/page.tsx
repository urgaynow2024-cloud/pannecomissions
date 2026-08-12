"use client";

import { useState } from "react";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setAuthenticated(true);
    } else {
      alert("Invalid password");
    }
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <input
            type="password"
            required
            placeholder="Password"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-purple-500/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white hover:bg-purple-500">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <p className="text-gray-400">Admin functionality coming soon.</p>
      </div>
    </div>
  );
}
