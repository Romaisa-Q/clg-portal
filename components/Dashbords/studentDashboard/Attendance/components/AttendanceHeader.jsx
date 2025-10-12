import { FileText, BarChart3 } from 'lucide-react';

export default function AttendanceHeader({ activeTab, setActiveTab }) {
  return (
    <div className="bg-white rounded-lg border border-green-200 shadow-sm p-1">
      <div className="flex items-center gap-1">
        <button
          onClick={() => setActiveTab('view')}
          className={`flex-1 px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
            activeTab === 'view'
              ? 'bg-green-900 text-white shadow-sm'
              : 'text-green-700 hover:text-green-900 hover:bg-green-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" />
            <span>View Attendance</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`flex-1 px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
            activeTab === 'report'
              ? 'bg-green-900 text-white shadow-sm'
              : 'text-green-700 hover:text-green-900 hover:bg-green-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span>Attendance Report</span>
          </div>
        </button>
      </div>
    </div>
  );
}