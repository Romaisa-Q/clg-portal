// components/TeacherDashboard/Main.jsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "../ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import Sidebar from './Layout/Sidebar';
import Overview from './Overview/Oveview';
import DashboardHeader from './Layout/Header';
import { useRouter } from 'next/router';
import Grading from './Grading/Grading';
import ClassList from './MyClasses/ClassList';
import Attendance from './Attendance/Attendance';
import Assignments from './Assigments/assigments';
import Announcements from './Annoucements/Annoucements';

export default function Main() {
  const router = useRouter();

  const handleLogout = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      router.back();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gradingSection, setGradingSection] = useState('grade-assignments');
  const [attendanceSection, setAttendanceSection] = useState('mark');
  const [assigmentSection, setAssigmentSection] = useState('assignments');
  const [announcementSection, setAnnouncementSection] = useState('announcements');

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="flex h-screen bg-gray-50">
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
        assigmentSection={assigmentSection}
        setAssigmentSection={setAssigmentSection}
        announcementSection={announcementSection}
        setAnnouncementSection={setAnnouncementSection}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {activeSection === 'overview' && <Overview />}
          {activeSection === 'classList' && <ClassList />}
          {activeSection === 'grading' && <Grading defaultSection={gradingSection} />}
          {activeSection === 'attendance' && <Attendance defaultSection={attendanceSection} />}
          {activeSection === 'assignments' && <Assignments defaultSection={assigmentSection} />}
          {activeSection === 'announcements' && <Announcements defaultSection={announcementSection} />}
        </main>
      </div>
    </div>
  );
}
