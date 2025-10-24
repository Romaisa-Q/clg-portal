"use client";
import { BookOpen, Home, Calendar, GraduationCap, FileText, Bell, BarChart3, User, LogOut, X, ChevronDown } from 'lucide-react';
import { COLLEGE_COLORS } from '../../../constants/colors';
import { useState, useEffect } from 'react';

export function Sidebar({ activeSection, onSectionChange, isOpen, onToggle, onLogout }) {
  const [openMenus, setOpenMenus] = useState({});

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { 
      id: 'attendance', 
      label: 'My Attendance', 
      icon: Calendar,
      hasSubmenu: true,
      subItems: [
        { id: 'view-attendance', label: 'View Attendance' },
        { id: 'attendance-report', label: 'Attendance Report' }
      ]
    },
    { id: 'marks', label: 'Marks & Results', icon: BarChart3 },
    { id: 'lectures', label: 'Lectures & Notes', icon: GraduationCap },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  // Automatically open attendance submenu when attendance section is active
  useEffect(() => {
    if (activeSection === 'view-attendance' || activeSection === 'attendance-report') {
      setOpenMenus(prev => ({ ...prev, attendance: true }));
    }
  }, [activeSection]);

  const toggleMenu = (key) => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNavClick = (section) => {
    onSectionChange(section);
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  const handleAttendanceClick = () => {
    toggleMenu('attendance');
    // If opening attendance for first time, select default sub-item
    if (!openMenus.attendance && !(activeSection === 'view-attendance' || activeSection === 'attendance-report')) {
      onSectionChange('view-attendance');
    }
  };

  const SidebarContent = (
    <div className="flex flex-col h-screen min-h-0" style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
          >
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Student Portal</h2>
            <p className="text-green-200 text-sm">Learning Dashboard</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="lg:hidden text-white hover:bg-white/5 p-1 rounded"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation - scrollable */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id || 
                            (item.hasSubmenu && item.subItems?.some(sub => sub.id === activeSection));
            
            return (
              <li key={item.id}>
                {/* Parent Item */}
                <div
                  onClick={() => {
                    if (item.hasSubmenu) {
                      handleAttendanceClick();
                    } else {
                      handleNavClick(item.id);
                    }
                  }}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors
                    ${isActive && !item.hasSubmenu
                      ? 'text-white'
                      : 'text-green-100 hover:bg-white/5 hover:text-white'}
                  `}
                  style={isActive && !item.hasSubmenu ? { backgroundColor: COLLEGE_COLORS.lightGreen } : {}}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.hasSubmenu && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${openMenus.attendance ? 'rotate-180' : ''}`}
                    />
                  )}
                </div>

                {/* Submenu */}
                {item.hasSubmenu && openMenus.attendance && (
                  <ul className="ml-8 mt-2 space-y-1">
                    {item.subItems.map((sub) => (
                      <li
                        key={sub.id}
                        onClick={() => handleNavClick(sub.id)}
                        className={`
                          px-3 py-2 text-sm rounded cursor-pointer
                          ${activeSection === sub.id
                            ? 'text-white'
                            : 'text-green-200 hover:text-white hover:bg-white/5'}
                        `}
                        style={
                          activeSection === sub.id
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
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div
          onClick={onLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-green-100 hover:bg-white/5 hover:text-white cursor-pointer transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: full viewport height */}
      <div className="hidden lg:block lg:w-72 lg:shrink-0 h-screen">
        {SidebarContent}
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={onToggle}
          />
          <div className="relative w-72 h-screen bg-green-900 shadow-xl">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
}