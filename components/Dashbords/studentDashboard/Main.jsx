"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Layout Components
import { Sidebar } from "./Layout/Sidebar";
import { DashboardHeader } from "./Layout/Header";

// Pages / Sections
import Dashboard from "./dashboard/dashboard";
import Announcements from "./Annoucements/announcements";
import ViewAttendance from "./Attendance/ViewAttendance"; 
import AttendanceReport from "./Attendance/AttendanceReport"; 
import Lectures from "./Lectures & Notes/Lectures";
import StudentAssignments from "./Assignments/assignments";
import StudentProfile from "./Profile/Profile"

export default function Main() {
  const router = useRouter();

  // 🔹 States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  // 🔹 Escape key listener for closing sidebar
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsSidebarOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // 🔹 Logout handler
  const handleLogout = () => {
    try {
      sessionStorage.clear();
      router.back();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // 🔹 Render
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader setSidebarOpen={setIsSidebarOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {activeSection === "dashboard" && <Dashboard />}
          {activeSection === "announcements" && <Announcements />}
          {activeSection === "view-attendance" && <ViewAttendance />}
          {activeSection === "attendance-report" && <AttendanceReport />}
           {activeSection === "lectures" && <Lectures />}
             {activeSection === "assignments" && <StudentAssignments />}


          {/* Placeholder for undeveloped sections */}
          {activeSection == "profile" && <StudentProfile/>

            }
        </main>
      </div>
    </div>
  );
}