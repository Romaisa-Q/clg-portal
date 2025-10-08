import { BookOpen, Home, Calendar, GraduationCap, FileText, Bell, BarChart3, User, LogOut, X } from 'lucide-react';
import { COLLEGE_COLORS } from '../../../constants/colors';

export function Sidebar({ activeSection, onSectionChange, isOpen, onToggle, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'attendance', label: 'My Attendance', icon: Calendar },
    { id: 'marks', label: 'Marks & Results', icon: BarChart3 },
    { id: 'lectures', label: 'Lectures & Notes', icon: GraduationCap },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const handleNavClick = (section) => {
    onSectionChange(section);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div 
        className={`
          fixed lg:relative top-0 left-0 z-30 h-full
          w-64 lg:w-64 flex flex-col shadow-lg lg:shadow-none
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end p-4">
          <button 
            onClick={onToggle}
            className="text-white hover:bg-white/10 p-2 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logo Section */}
        <div className="p-4 lg:p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 lg:w-10 h-8 lg:h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
            >
              <BookOpen className="w-4 lg:w-6 h-4 lg:h-6 text-white" />
            </div>
            <div>
              <h1 
                className="text-lg lg:text-xl font-semibold text-white"
                style={{ fontFamily: 'Montserrat, system-ui, sans-serif' }}
              >
                Student Portal
              </h1>
              <p 
                className="text-xs lg:text-sm text-white/70"
                style={{ fontFamily: 'Lato, system-ui, sans-serif' }}
              >
                Learning Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-sm' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
                style={{ fontFamily: 'Lato, system-ui, sans-serif' }}
              >
                <Icon className="w-4 lg:w-5 h-4 lg:h-5 flex-shrink-0" />
                <span className="font-medium text-sm lg:text-base">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 lg:p-4 border-t border-white/10">
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200"
            style={{ fontFamily: 'Lato, system-ui, sans-serif' }}
          >
            <LogOut className="w-4 lg:w-5 h-4 lg:h-5" />
            <span className="font-medium text-sm lg:text-base">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
