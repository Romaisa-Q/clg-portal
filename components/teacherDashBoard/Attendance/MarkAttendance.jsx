import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle,
  Search,
  Download,
  CheckSquare,
  Square
} from 'lucide-react';
import { COLLEGE_COLORS } from '../../constants/colors.js';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Checkbox } from '../../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { toast } from 'sonner';

// Static student data - no API dependency
const STUDENTS_LIST = [
  { id: 1, name: 'Ahmad Hassan', department: 'CS-3rd', semester: 3 },
  { id: 2, name: 'Fatima Khan', department: 'CS-3rd', semester: 3 },
  { id: 3, name: 'Ali Ahmed', department: 'CS-3rd', semester: 3 },
  { id: 4, name: 'Ayesha Malik', department: 'IT-2nd', semester: 2 },
  { id: 5, name: 'Hassan Ali', department: 'CS-2nd', semester: 2 },
  { id: 6, name: 'Zara Sheikh', department: 'IT-2nd', semester: 2 },
  { id: 7, name: 'Omar Farooq', department: 'CS-3rd', semester: 3 },
  { id: 8, name: 'Sana Riaz', department: 'IT-2nd', semester: 2 },
  { id: 9, name: 'Muhammad Usman', department: 'CS-1st', semester: 1 },
  { id: 10, name: 'Aisha Noor', department: 'IT-1st', semester: 1 },
  { id: 11, name: 'Bilal Ahmad', department: 'CS-1st', semester: 1 },
  { id: 12, name: 'Sara Ali', department: 'IT-3rd', semester: 3 },
  { id: 13, name: 'Usman Khan', department: 'CS-2nd', semester: 2 },
  { id: 14, name: 'Mariam Sheikh', department: 'IT-1st', semester: 1 },
  { id: 15, name: 'Ahmed Raza', department: 'CS-3rd', semester: 3 },
];

// Helper functions
const getDepartmentFilter = (student, filterValue) => {
  if (filterValue === 'all') return true;
  return student.department.toLowerCase().startsWith(filterValue.toLowerCase());
};

// CSV export function
const generateCSV = (attendanceData) => {
  const headers = ['Student Name', 'Department', 'Semester', 'Date', 'Status'];
  const csvContent = headers.join(',') + '\n' + 
    attendanceData.map(record => [
      record.name,
      record.department,
      record.semester,
      new Date().toLocaleDateString(),
      record.present ? 'Present' : 'Absent'
    ].join(',')).join('\n');
  
  return csvContent;
};

const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function Attendance() {
  const [students, setStudents] = useState(() => 
    STUDENTS_LIST.map(student => ({ ...student, present: false }))
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Filter students based on search and department
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = getDepartmentFilter(student, selectedDepartment);
    return matchesSearch && matchesDepartment;
  });

  // Calculate statistics
  const totalStudents = filteredStudents.length;
  const presentStudents = filteredStudents.filter(student => student.present).length;
  const absentStudents = totalStudents - presentStudents;
  const attendancePercentage = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0;

  // Handle individual checkbox change
  const handleStudentAttendance = (studentId, isPresent) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId ? { ...student, present: isPresent } : student
      )
    );
  };

  // Handle check all / uncheck all
  const handleCheckAll = (checkAll) => {
    setStudents(prev => 
      prev.map(student => {
        // Only update students that match current filters
        if (getDepartmentFilter(student, selectedDepartment) && 
            (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             student.department.toLowerCase().includes(searchTerm.toLowerCase()))) {
          return { ...student, present: checkAll };
        }
        return student;
      })
    );
    toast.success(checkAll ? 'All filtered students marked present' : 'All filtered students marked absent');
  };

  // Handle export
  const handleExport = () => {
    const csvContent = generateCSV(filteredStudents);
    const filename = `attendance_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
    toast.success(`Attendance data exported as ${filename}`);
  };

  // Save attendance data
  const handleSaveAttendance = () => {
    const attendanceRecord = {
      date: new Date().toISOString().split('T')[0],
      data: students.map(student => ({
        id: student.id,
        name: student.name,
        department: student.department,
        semester: student.semester,
        present: student.present
      }))
    };
    
    // Save to localStorage for daily attendance
    const existingData = JSON.parse(localStorage.getItem('attendance_records') || '[]');
    const updatedData = existingData.filter((record) => record.date !== attendanceRecord.date);
    updatedData.push(attendanceRecord);
    localStorage.setItem('attendance_records', JSON.stringify(updatedData));
    
    // Also sync with reports system immediately
    syncToReportsSystem(attendanceRecord);
    
    toast.success('Attendance saved successfully and synced with reports!');
  };

  // Function to sync daily attendance with reports system
  const syncToReportsSystem = (dailyRecord) => {
    const existingReportsData = JSON.parse(localStorage.getItem('attendance_data') || '{}');
    
    // Initialize reports data structure if empty
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

    const { date, data } = dailyRecord;
    
    // Convert daily format to reports format
    existingReportsData.daily[date] = data.map((student) => ({
      id: student.id,
      studentName: student.name,
      department: student.department,
      semester: student.semester,
      status: student.present ? 'present' : 'absent',
      date: date,
      markedBy: 'teacher'
    }));

    // Update students historical data
    data.forEach((student) => {
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

      // Update attendance history
      existingReportsData.students[studentKey].attendanceHistory[date] = {
        status: student.present ? 'present' : 'absent',
        semester: student.semester,
        markedBy: 'teacher'
      };

      // Recalculate totals
      const studentData = existingReportsData.students[studentKey];
      const history = studentData.attendanceHistory;
      const totalDays = Object.keys(history).length;
      const presentDays = Object.values(history).filter((day) => day.status === 'present').length;
      
      studentData.totalDays = totalDays;
      studentData.presentDays = presentDays;
      studentData.semesterPercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
    });

    // Save synced data
    localStorage.setItem('attendance_data', JSON.stringify(existingReportsData));
  };

  const calculateSemesterEnd = () => {
    const start = new Date();
    start.setMonth(start.getMonth() + 4); // 4 months semester
    return start.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
            Attendance Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Mark student attendance with simple checkboxes - {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleSaveAttendance}
          >
            <CheckCircle className="w-4 h-4" />
            Save Attendance
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExport}
            disabled={filteredStudents.length === 0}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
                  {totalStudents}
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
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-2xl font-semibold text-green-600">{presentStudents}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-2xl font-semibold text-red-600">{absentStudents}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.lightGreen }}>
                  {attendancePercentage}%
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-[#66bb6a] focus:ring-[#66bb6a]"
          />
        </div>
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
      </div>

      {/* Check All Controls */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-700">
            Quick Actions for {filteredStudents.length} filtered student(s):
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleCheckAll(true)}
            className="flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            Mark All Present
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleCheckAll(false)}
            className="flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Mark All Absent
          </Button>
        </div>
      </div>

      {/* Student Attendance List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Student Attendance - {filteredStudents.length} Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No students found matching the current filters.</p>
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={student.present}
                      onCheckedChange={(checked) => handleStudentAttendance(student.id, !!checked)}
                      className="border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.department} • Semester {student.semester}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      className={student.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    >
                      {student.present ? 'Present' : 'Absent'}
                    </Badge>
                    {student.present ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
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
