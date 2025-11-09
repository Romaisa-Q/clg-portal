import { useState } from 'react';
import Sidebar from './Layout/Sidebar.jsx';
import TopBar from './layout/TopBar';
import OverviewPage from './overview/OverviewPage';
import { useRouter } from "next/router";

export default function AdminDashboard() {
   const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('overview');
const onLogout = () => {
    try {
      sessionStorage.clear();
      router.back();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} activePage={activePage} handleNavClick={handleNavClick} onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar activePage={activePage} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6">
          {activePage === 'overview' ? <OverviewPage /> : <div className="flex items-center justify-center h-full"><p className="text-gray-500">This section is under development.</p></div>}
        </main>
      </div>
    </div>
  );
}