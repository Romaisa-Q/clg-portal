import { Bell, Search, User as UserIcon, Menu } from 'lucide-react';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { COLLEGE_COLORS } from '../../../constants/colors';

export function DashboardHeader({ setSidebarOpen }) {
  const user = { name: "Student Name", rollNo: "12345" };

  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 lg:py-4">
      <div className="flex items-center justify-between">
        {/* Menu + title */}
        <div className="flex items-center space-x-3 lg:space-x-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" style={{ color: COLLEGE_COLORS.darkGreen }} />
          </Button>

          <div>
            <h1 className="text-xl lg:text-2xl text-gray-900" style={{ color: COLLEGE_COLORS.darkGreen }}>
              Welcome back, {user.name}!
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
              Roll No: {user.rollNo}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" style={{ color: COLLEGE_COLORS.gray }} />
            <Badge className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center p-0 text-xs"
              style={{ backgroundColor: COLLEGE_COLORS.redAccent }}>
              5
            </Badge>
          </Button>
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
            <UserIcon className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
