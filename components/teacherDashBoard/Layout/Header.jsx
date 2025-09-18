import { Menu, Bell, Search } from 'lucide-react';
import { COLLEGE_COLORS } from '../../constants/colors';
// import { Import } from 'lucide-react';
export default function DashboardHeader({ setSidebarOpen }) {
  return (
      <header className="bg-white border-b px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
                  Welcome back, Prof. Sarah Ahmed!
                </h1>
                <p className="text-sm text-gray-600">Manage your classes and track student progress</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students, classes..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-sm font-medium" style={{ color: COLLEGE_COLORS.darkGreen }}>SA</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Prof. Sarah Ahmed</p>
                  <p className="text-xs text-gray-500">Computer Science</p>
                </div>
              </div>
            </div>
          </div>
        </header>
  );
}
