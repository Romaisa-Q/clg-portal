import { useState } from 'react';
import { COLLEGE_COLORS } from '../../../constants/colors.js';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card.jsx';
import { Button } from '../../../ui/button.jsx';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Settings, 
  FileText, 
  UserCog,
  Menu,
  X,
  LogOut,
  TrendingUp,
  UserCheck,
  School,
  BookMarked,
  DollarSign,
  Bell
} from 'lucide-react';

// Sidebar Items Configuration
const sidebarItems = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
  { id: 'students', icon: GraduationCap, label: 'Students' },
  { id: 'teachers', icon: UserCog, label: 'Teachers' },
  { id: 'classes', icon: BookOpen, label: 'Classes' },
  { id: 'departments', icon: School, label: 'Departments' },
  { id: 'attendance', icon: UserCheck, label: 'Attendance' },
  { id: 'reports', icon: FileText, label: 'Reports' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

// Sidebar Component
function Sidebar({ sidebarOpen, toggleSidebar, activePage, handleNavClick, onLogout }) {
  const SidebarContent = (
    <div className="flex flex-col h-screen min-h-0" style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
          >
            <School className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Admin Panel</h2>
            <p className="text-green-200 text-sm">Management System</p>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-white hover:bg-white/5 p-1 rounded"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation - scrollable */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <li key={item.id}>
                <div
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors
                    ${isActive
                      ? 'text-white'
                      : 'text-green-100 hover:bg-white/5 hover:text-white'}
                  `}
                  style={isActive ? { backgroundColor: COLLEGE_COLORS.lightGreen } : {}}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
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
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={toggleSidebar}
          />
          <div className="relative w-72 h-screen bg-green-900 shadow-xl">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;