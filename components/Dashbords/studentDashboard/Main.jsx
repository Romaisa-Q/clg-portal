"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Sidebar } from "./Layout/Sidebar";
import { DashboardHeader } from "./Layout/Header";

export default function Main() {
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsSidebarOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      router.back();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader setSidebarOpen={setIsSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Placeholder for future student sections */}
          <div className="text-center mt-20 text-gray-600">
            <h2 className="text-xl font-semibold">Student Dashboard</h2>
            <p>Select a section from the sidebar to begin.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
