import StatsCard from './StatsCard';
import RecentActivities from './RecentActivities';
import UpcomingEvents from './UpcomingEvents';
import DepartmentOverview from './DepartmentOverview';
import QuickActions from './QuickActions';
import { GraduationCap, UserCog, BookOpen, School } from 'lucide-react';
import { COLLEGE_COLORS } from '../../../constants/colors.js';

export default function OverviewPage() {
  // === STATS DATA ===
  const stats = [
    {
      title: 'Total Students',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: GraduationCap,
      color: COLLEGE_COLORS.lightGreen
    },
    {
      title: 'Total Teachers',
      value: '142',
      change: '+3.2%',
      trend: 'up',
      icon: UserCog,
      color: COLLEGE_COLORS.darkGreen
    },
    {
      title: 'Active Classes',
      value: '89',
      change: '+5.1%',
      trend: 'up',
      icon: BookOpen,
      color: '#2196F3'
    },
    {
      title: 'Departments',
      value: '12',
      change: '0%',
      trend: 'neutral',
      icon: School,
      color: '#FF9800'
    }
  ];

  // === RECENT ACTIVITIES DATA ===
  const recentActivities = [
    { action: 'New teacher registered', user: 'Dr. Ahmed Khan', time: '2 hours ago', type: 'teacher' },
    { action: 'Student enrollment completed', user: '25 new students', time: '4 hours ago', type: 'student' },
    { action: 'Semester results published', user: 'Fall 2024', time: '1 day ago', type: 'result' },
    { action: 'New class created', user: 'Advanced Programming', time: '2 days ago', type: 'class' },
    { action: 'Fee collection completed', user: 'Computer Science Dept', time: '3 days ago', type: 'fee' }
  ];

  // === UPCOMING EVENTS DATA ===
  const upcomingEvents = [
    { title: 'Semester Examinations', date: 'Nov 15-25, 2024', status: 'upcoming' },
    { title: 'Faculty Meeting', date: 'Nov 12, 2024', status: 'upcoming' },
    { title: 'Admission Deadline', date: 'Nov 30, 2024', status: 'important' },
    { title: 'Parent-Teacher Conference', date: 'Dec 5, 2024', status: 'scheduled' }
  ];

  // === DEPARTMENT STATS DATA ===
  const departmentStats = [
    { name: 'Computer Science', students: 456, teachers: 24 },
    { name: 'Engineering', students: 523, teachers: 28 },
    { name: 'Business Administration', students: 389, teachers: 19 },
    { name: 'Mathematics', students: 267, teachers: 15 },
    { name: 'Physics', students: 198, teachers: 12 }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} stat={stat} />
        ))}
      </div>

      {/* Activities + Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities activities={recentActivities} />
        <UpcomingEvents events={upcomingEvents} />
      </div>

      {/* Department Table */}
      <DepartmentOverview departments={departmentStats} />

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}