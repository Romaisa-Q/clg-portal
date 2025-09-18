// components/TeacherDashboard/Main.jsx
import { useState, useEffect } from 'react';
import Sidebar from './Layout/Sidebar';
import Overview from './Overview/Oveview';
import DashboardHeader from './Layout/Header';
import { useRouter } from 'next/router';
import Grading from './Grading/Grading';
import ClassList from './MyClasses/ClassList';
import Attendance from './Attendance/Attendance';
export default function Main() {
  const router = useRouter();

  // 🔹 Logout handler
  const handleLogout = () => {
    try {
      // Clear any stored auth/session data
      localStorage.clear();
      sessionStorage.clear();

      // Option 1: Go to login page
      router.back();

    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gradingSection, setGradingSection] = useState('grade-assignments');
  const [attendanceSection, setAttendanceSection] = useState('marks');

  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // ✅ Renamed state
  const [activeSection, setActiveSection] = useState('overview'); // default section

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        gradingSection={gradingSection}
        setGradingSection={setGradingSection}
        attendanceSection={attendanceSection}
        setAttendanceSection={setAttendanceSection} 
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <DashboardHeader setSidebarOpen={setSidebarOpen} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {activeSection === 'overview' && <Overview />}
          {activeSection === 'classList' && <ClassList />}
          {activeSection === 'grading' && (
            <Grading defaultSection={gradingSection} />
          )}
          {activeSection === 'attendance' && (
            <Attendance defaultSection={attendanceSection} />
          )}
        </main>
      </div>
    </div>
  );
}

