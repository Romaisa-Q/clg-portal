import { Menu, Bell, UserCog } from 'lucide-react';
import { COLLEGE_COLORS } from '../../../constants/colors.js';

const sidebarItems = [
  // same as above, ya phir import kar sakti ho agar alag file banao
  { id: 'overview', label: 'Overview' },
  { id: 'students', label: 'Students' },
  // ... baqi
];

export default function TopBar({ activePage, toggleSidebar }) {
  const currentLabel = sidebarItems.find(item => item.id === activePage)?.label || 'Overview';

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-gray-100" style={{ color: COLLEGE_COLORS.darkGreen }}>
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-gray-800">{currentLabel}</h2>
            <p className="text-sm text-gray-500">Administrator Dashboard</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 relative" style={{ color: COLLEGE_COLORS.darkGreen }}>
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: COLLEGE_COLORS.redAccent }} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}>
              <UserCog className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm text-gray-800">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}