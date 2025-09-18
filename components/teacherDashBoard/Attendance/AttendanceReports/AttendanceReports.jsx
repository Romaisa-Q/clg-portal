import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  TrendingUp,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Clock,
  Table
} from 'lucide-react';
import { COLLEGE_COLORS } from '../../../constants/colors.js';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card.jsx';
import { Button } from '../../../ui/button.jsx';
import { Badge } from '../../../ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select.jsx';


import { toast } from 'sonner';
import SemesterAttendanceTable from '../SemesterAttendanceTable/index.jsx';

// Helper function to sync daily attendance with reports system
const syncDailyAttendanceToReports = () => {
  const dailyRecords = JSON.parse(localStorage.getItem('attendance_records') || '[]');
  const existingReportsData = JSON.parse(localStorage.getItem('attendance_data') || '{}');
  
  if (!existingReportsData.daily) {
    existingReportsData.daily = {};
    existingReportsData.students = {};
    existingReportsData.semester = {
      startDate: new Date().toISOString().split('T')[0],
      endDate: calculateSemesterEnd(),
      totalWeeks: 20,
      currentWeek: 1
    };
  }

  dailyRecords.forEach(record => {
    const { date, data } = record;
    
    existingReportsData.daily[date] = data.map(student => ({
      id: student.id,
      studentName: student.name,
      department: student.department,
      semester: student.semester,
      status: student.present ? 'present' : 'absent',
      date: date,
      markedBy: 'teacher'
    }));

    data.forEach(student => {
      const studentKey = `${student.name}_${student.department}`;
      
      if (!existingReportsData.students[studentKey]) {
        existingReportsData.students[studentKey] = {
          studentName: student.name,
          department: student.department,
          semester: student.semester,
          attendanceHistory: {},
          totalDays: 0,
          presentDays: 0,
          semesterPercentage: 0
        };
      }

      existingReportsData.students[studentKey].attendanceHistory[date] = {
        status: student.present ? 'present' : 'absent',
        semester: student.semester,
        markedBy: 'teacher'
      };

      const studentData = existingReportsData.students[studentKey];
      const history = studentData.attendanceHistory;
      const totalDays = Object.keys(history).length;
      const presentDays = Object.values(history).filter(day => day.status === 'present').length;
      
      studentData.totalDays = totalDays;
      studentData.presentDays = presentDays;
      studentData.semesterPercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
    });
  });

  localStorage.setItem('attendance_data', JSON.stringify(existingReportsData));
  return existingReportsData;
};

const calculateSemesterEnd = () => {
  const start = new Date();
  start.setMonth(start.getMonth() + 4); 
  return start.toISOString().split('T')[0];
};

const getStatusFromPercentage = (percentage) => {
  if (percentage < 75) return 'warning';   
  else if (percentage >= 75 && percentage < 85) return 'good';      
  else return 'excellent'; 
};

const getWeeklyAttendance = (studentsData) => {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  
  const weekDates = [];
  for (let i = 0; i < 5; i++) { 
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    weekDates.push(date.toISOString().split('T')[0]);
  }

  return Object.values(studentsData).map(student => {
    let weekTotalClasses = 0;
    let weekAttended = 0;

    weekDates.forEach(date => {
      if (student.attendanceHistory[date]) {
        weekTotalClasses++;
        if (student.attendanceHistory[date].status === 'present') {
          weekAttended++;
        }
      }
    });

    const weekPercentage = weekTotalClasses > 0 ? Math.round((weekAttended / weekTotalClasses) * 100) : 0;

    return {
      studentName: student.studentName,
      department: student.department,
      semester: student.semester,
      totalClasses: weekTotalClasses,
      attended: weekAttended,
      percentage: weekPercentage,
      status: getStatusFromPercentage(weekPercentage)
    };
  }).filter(student => student.totalClasses > 0);
};

const getMonthlyAttendance = (studentsData) => {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  return Object.values(studentsData).map(student => {
    let monthTotalClasses = 0;
    let monthAttended = 0;

    for (let date = new Date(monthStart); date <= monthEnd; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      if (student.attendanceHistory[dateStr]) {
        monthTotalClasses++;
        if (student.attendanceHistory[dateStr].status === 'present') {
          monthAttended++;
        }
      }
    }

    const monthPercentage = monthTotalClasses > 0 ? Math.round((monthAttended / monthTotalClasses) * 100) : 0;

    return {
      studentName: student.studentName,
      department: student.department,
      semester: student.semester,
      totalClasses: monthTotalClasses,
      attended: monthAttended,
      percentage: monthPercentage,
      status: getStatusFromPercentage(monthPercentage)
    };
  }).filter(student => student.totalClasses > 0);
};

export default function AttendanceReports() {
  const [reportData, setReportData] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showDetailedTable, setShowDetailedTable] = useState(false);

  useEffect(() => {
    const syncedData = syncDailyAttendanceToReports();
    setReportData(syncedData);
    setLoading(false);
  }, []);

  const getCurrentPeriodData = () => {
    if (!reportData.students) return [];

    switch (selectedPeriod) {
      case 'weekly':
        return getWeeklyAttendance(reportData.students);
      case 'monthly':
        return getMonthlyAttendance(reportData.students);
      case 'semester':
        return Object.values(reportData.students).map(student => ({
          studentName: student.studentName,
          department: student.department,
          semester: student.semester,
          totalClasses: student.totalDays,
          attended: student.presentDays,
          percentage: student.semesterPercentage,
          status: getStatusFromPercentage(student.semesterPercentage)
        })).filter(student => student.totalClasses > 0);
      default:
        return [];
    }
  };

  const filteredData = getCurrentPeriodData().filter(student => {
    if (selectedDepartment === 'all') return true;
    return student.department.toLowerCase().includes(selectedDepartment.toLowerCase());
  });

  const getOverallStats = () => {
    if (filteredData.length === 0) {
      return { totalStudents: 0, averageAttendance: 0, excellent: 0, good: 0, warning: 0 };
    }

    const totalStudents = filteredData.length;
    const averageAttendance = Math.round(
      filteredData.reduce((sum, student) => sum + student.percentage, 0) / totalStudents
    );
    
    return {
      totalStudents,
      averageAttendance,
      excellent: filteredData.filter(s => s.status === 'excellent').length,
      good: filteredData.filter(s => s.status === 'good').length,
      warning: filteredData.filter(s => s.status === 'warning').length
    };
  };

  const stats = getOverallStats();

  const handleExport = () => {
    const csvHeaders = ['Student Name', 'Department', 'Semester', 'Total Classes', 'Attended', 'Percentage', 'Status'];
    const csvContent = csvHeaders.join(',') + '\n' + 
      filteredData.map(student => [
        student.studentName,
        student.department,
        student.semester,
        student.totalClasses,
        student.attended,
        student.percentage + '%',
        student.status
      ].join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_report_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${selectedPeriod} attendance report exported successfully!`);
  };

  const getPeriodTitle = () => {
    switch (selectedPeriod) {
      case 'weekly': return 'This Week\'s';
      case 'monthly': return 'This Month\'s';
      case 'semester': return 'Full Semester';
      default: return 'Current';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="w-8 h-8 mx-auto mb-4 animate-spin" style={{ color: COLLEGE_COLORS.lightGreen }} />
          <p>Loading attendance reports...</p>
        </div>
      </div>
    );
  }

  if (showDetailedTable) {
    return <SemesterAttendanceTable onBack={() => setShowDetailedTable(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
            Attendance Reports
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {getPeriodTitle()} attendance analytics and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExport}
            disabled={filteredData.length === 0}
          >
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly Report</SelectItem>
            <SelectItem value="monthly">Monthly Report</SelectItem>
            <SelectItem value="semester">Semester Report</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="cs">Computer Science</SelectItem>
            <SelectItem value="it">Information Technology</SelectItem>
            <SelectItem value="se">Software Engineering</SelectItem>
          </SelectContent>
        </Select>

        {selectedPeriod === 'semester' && (
          <Button 
            className="flex items-center gap-2"
            onClick={() => setShowDetailedTable(true)}
            style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
          >
            <Table className="w-4 h-4" />
            View Daily Attendance
          </Button>
        )}
      </div>

      {/* Overall Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
                  {stats.totalStudents}
                </p>
              </div>
              <Users className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Attendance</p>
                <p className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.lightGreen }}>
                  {stats.averageAttendance}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Excellent (85%+)</p>
                <p className="text-2xl font-semibold text-green-600">{stats.excellent}</p>
              </div>
              <div className="w-3 h-8 bg-green-500 rounded"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Good (75-84%)</p>
                <p className="text-2xl font-semibold text-yellow-600">{stats.good}</p>
              </div>
              <div className="w-3 h-8 bg-yellow-500 rounded"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Warning (&lt;75%)</p>
                <p className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.redAccent }}>
                  {stats.warning}
                </p>
              </div>
              <div className="w-3 h-8 rounded" style={{ backgroundColor: COLLEGE_COLORS.redAccent }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {getPeriodTitle()} Attendance Report - {filteredData.length} Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredData.length === 0 ? (
              <div className="text-center py-8">
                <PieChart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No attendance data found for the selected filters.</p>
                <p className="text-sm text-gray-500 mt-1">Make sure daily attendance has been marked.</p>
              </div>
            ) : (
              filteredData.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div 
                        className="w-3 h-12 rounded"
                        style={{
                          backgroundColor: student.status === 'excellent' ? '#10b981' :
                                         student.status === 'good' ? '#f59e0b' :
                                         COLLEGE_COLORS.redAccent
                        }}
                      ></div>
                    </div>
                    <div>
                      <p className="font-medium">{student.studentName}</p>
                      <p className="text-sm text-gray-600">
                        {student.department} • Semester {student.semester}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {student.attended}/{student.totalClasses} classes
                      </p>
                      <p className="font-medium">{student.percentage}% attendance</p>
                    </div>
                    <Badge 
                      className={
                        student.status === 'excellent' ? 'bg-green-100 text-green-800' :
                        student.status === 'good' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {student.status === 'excellent' ? 'Excellent' :
                       student.status === 'good' ? 'Good' : 'Warning'}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
