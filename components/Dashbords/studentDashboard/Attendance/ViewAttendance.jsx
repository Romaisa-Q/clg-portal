"use client";
import StatsCards from './components/StatsCards';
import SubjectTable from './components/SubjectTable';
import QuickInsights from './components/QuickInsights';

export default function ViewAttendance() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-normal">View Attendance</h1>
          <p className="text-green-700 mt-1">Detailed view of your subject-wise attendance</p>
        </div>
      </div>

      {/* Content */}
      <StatsCards />
      <SubjectTable />
      <QuickInsights />
    </div>
  );
}