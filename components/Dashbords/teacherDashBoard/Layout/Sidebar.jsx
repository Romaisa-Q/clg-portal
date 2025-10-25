// components/TeacherDashboard/Layout/Sidebar.jsx
import { useState } from 'react';
import { 
  BookOpen, Calendar, Users, FileText, BarChart3, ClipboardCheck, LogOut, X, ChevronDown 
} from 'lucide-react';
import { COLLEGE_COLORS } from '../../../constants/colors';

const sidebarItems = [
  { key: 'overview', label: 'Overview', icon: BarChart3 },
  { key: 'Lectures', label: 'Lectures & Notes', icon: BookOpen },
  { 
    key: 'grading', 
    label: 'Grading', 
    icon: Users, 
    hasSubmenu: true,
    submenu: [
      { key: 'grade-assignments', label: 'Grade Assignments' },
      { key: 'marks-entry', label: 'Marks Entry' },
      { key: 'reports', label: 'Reports' }
    ]
  },
  {
    key: 'attendance',
    label: 'Attendance',
    icon: Calendar,
    hasSubmenu: true,
    submenu: [
      { key: 'mark', label: 'Mark Attendance' },
      { key: 'reports', label: 'Attendance Report' },
    ]
  },
  { 
    key: 'assignments', 
    label: 'Assignments', 
    icon: FileText, 
  },
  { key: 'announcements', label: 'Announcements', icon: ClipboardCheck },
  { key: 'schedule', label: 'Schedule', icon: Calendar },
];

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  setActiveSection,
  gradingSection,
  setGradingSection,
  attendanceSection,
  setAttendanceSection,
  assigmentSection,
  setAssigmentSection,
  announcementSection,
  setAnnouncementSection,
  scheduleSection,          
  setScheduleSection,         
  onLogout = () => {}
}) {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (key) => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmenuClick = (itemKey, subKey) => {
    if (itemKey === 'grading') {
      setActiveSection('grading');
      setGradingSection(subKey);
    } else if (itemKey === 'attendance') {
      setActiveSection('attendance');
      setAttendanceSection(subKey);
    } else if (itemKey === 'assignments') {
      setActiveSection('assignments');
      setAssigmentSection(subKey); // ← YE HAI MAGIC
    }
    setSidebarOpen(false);
  };

  const SidebarContent = (
    <div className="flex flex-col h-screen min-h-0" style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div

 className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}>
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Teacher Portal</h2>
            <p className="text-green-200 text-sm">Learning Dashboard</p>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white hover:bg-white/5 p-1 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.key}>
              {/* Parent Item */}
              <div
                onClick={() => {
                  if (item.hasSubmenu) {
                    toggleMenu(item.key);
                  } else {
                    setActiveSection(item.key);
                    setSidebarOpen(false);
                  }
                }}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors
                  ${activeSection === item.key && !item.hasSubmenu ? 'text-white' : 'text-green-100 hover:bg-white/5 hover:text-white'}
                `}
                style={activeSection === item.key && !item.hasSubmenu ? { backgroundColor: COLLEGE_COLORS.lightGreen } : {}}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.hasSubmenu && (
                  <ChevronDown className={`w-4 h-4 transition-transform ${openMenus[item.key] ? 'rotate-180' : ''}`} />
                )}
              </div>

              {/* Submenu */}
              {item.hasSubmenu && openMenus[item.key] && (
                <ul className="ml-8 mt-2 space-y-1">
                  {item.submenu.map((sub) => (
                    <li
                      key={sub.key}
                      onClick={() => handleSubmenuClick(item.key, sub.key)}
                      className={`
                        px-3 py-2 text-sm rounded cursor-pointer
                        ${
                          (item.key === 'grading' && gradingSection === sub.key && activeSection === 'grading') ||
                          (item.key === 'attendance' && attendanceSection === sub.key && activeSection === 'attendance') ||
                          (item.key === 'assignments' && assigmentSection === sub.key && activeSection === 'assignments')
                            ? 'text-white'
                            : 'text-green-200 hover:text-white hover:bg-white/5'
                        }
                      `}
                      style={
                        (item.key === 'grading' && gradingSection === sub.key && activeSection === 'grading') ||
                        (item.key === 'attendance' && attendanceSection === sub.key && activeSection === 'attendance') ||
                        (item.key === 'assignments' && assigmentSection === sub.key && activeSection === 'assignments')
                          ? { backgroundColor: COLLEGE_COLORS.lightGreen }
                          : {}
                      }
                    >
                      • {sub.label}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <div onClick={onLogout} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-green-100 hover:bg-white/5 hover:text-white cursor-pointer">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block lg:w-72 lg:shrink-0 h-screen">{SidebarContent}</div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-72 h-screen bg-green-900 shadow-xl">{SidebarContent}</div>
        </div>
      )}
    </>
  );
}