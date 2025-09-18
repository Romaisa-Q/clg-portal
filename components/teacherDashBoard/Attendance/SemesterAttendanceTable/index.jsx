import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  Download,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  FileText
} from 'lucide-react';
import { COLLEGE_COLORS } from '../../../constants/colors.js';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { toast } from 'sonner';

// Helper function to get all attendance data from daily records
const getSemesterAttendanceData = function() {
  const dailyRecords = JSON.parse(localStorage.getItem('attendance_records') || '[]');
  const semesterData = {};
  const allDates = new Set();
  
  // Process each daily record
  dailyRecords.forEach(function(record) {
    const { date, data } = record;
    allDates.add(date);
    
    data.forEach(function(student) {
      const studentKey = `${student.name}_${student.department}_${student.semester}`;
      
      if (!semesterData[studentKey]) {
        semesterData[studentKey] = {
          name: student.name,
          department: student.department,
          semester: student.semester,
          attendanceRecord: {},
          totalDays: 0,
          presentDays: 0,
          percentage: 0
        };
      }
      
      semesterData[studentKey].attendanceRecord[date] = student.present ? 'P' : 'A';
    });
  });
  
  // Calculate totals for each student
  Object.values(semesterData).forEach(function(student) {
    const records = Object.values(student.attendanceRecord);
    student.totalDays = records.length;
    student.presentDays = records.filter(function(status) { return status === 'P'; }).length;
    student.percentage = student.totalDays > 0 ? Math.round((student.presentDays / student.totalDays) * 100) : 0;
  });
  
  // Sort dates chronologically
  const sortedDates = Array.from(allDates).sort();
  
  return {
    students: Object.values(semesterData),
    dates: sortedDates
  };
};

// Helper function to format date for display
const formatDate = function(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
};

// Helper function to get day of week
const getDayOfWeek = function(dateStr) {
  const date = new Date(dateStr);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};

function SemesterAttendanceTable({ onBack }) {
  const [semesterData, setSemesterData] = useState({ students: [], dates: [] });
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    const data = getSemesterAttendanceData();
    setSemesterData(data);
    setLoading(false);
  }, []);

  // Filter students based on department and semester
  const filteredStudents = semesterData.students.filter(function(student) {
    const departmentMatch = selectedDepartment === 'all' || 
      student.department.toLowerCase().includes(selectedDepartment.toLowerCase());
    const semesterMatch = selectedSemester === 'all' || 
      student.semester.toString() === selectedSemester;
    return departmentMatch && semesterMatch;
  });

  // Filter dates for current month view
  const currentMonthDates = semesterData.dates.filter(function(date) {
    const dateObj = new Date(date);
    return dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear;
  });

  // Get unique departments and semesters for filters
  const departments = [...new Set(semesterData.students.map(function(s) { return s.department; }))];
  const semesters = [...new Set(semesterData.students.map(function(s) { return s.semester; }))].sort();

  const handleExport = function() {
    if (filteredStudents.length === 0 || currentMonthDates.length === 0) {
      toast.error('No data to export');
      return;
    }

    // Create CSV content
    const headers = ['Student Name', 'Department', 'Semester', ...currentMonthDates.map(function(date) { return formatDate(date); }), 'Total Days', 'Present', 'Percentage'];
    
    const csvContent = headers.join(',') + '\n' + 
      filteredStudents.map(function(student) {
        const row = [
          student.name,
          student.department,
          student.semester,
          ...currentMonthDates.map(function(date) { return student.attendanceRecord[date] || '-'; }),
          student.totalDays,
          student.presentDays,
          student.percentage + '%'
        ];
        return row.join(',');
      }).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `semester_attendance_${currentMonth + 1}_${currentYear}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Semester attendance sheet exported successfully!');
  };

  const navigateMonth = function(direction) {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getStatusBadge = function(percentage) {
    if (percentage >= 85) {
      return React.createElement(Badge, { className: "bg-green-100 text-green-800" }, "Excellent");
    } else if (percentage >= 75) {
      return React.createElement(Badge, { className: "bg-yellow-100 text-yellow-800" }, "Good");
    } else {
      return React.createElement(Badge, { className: "bg-red-100 text-red-800" }, "Warning");
    }
  };

  if (loading) {
    return React.createElement("div", { className: "flex items-center justify-center h-64" },
      React.createElement("div", { className: "text-center" },
        React.createElement(Calendar, { 
          className: "w-8 h-8 mx-auto mb-4 animate-pulse", 
          style: { color: COLLEGE_COLORS.lightGreen } 
        }),
        React.createElement("p", null, "Loading semester attendance data...")
      )
    );
  }

  return React.createElement("div", { className: "space-y-6" },
    // Header
    React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" },
      React.createElement("div", { className: "flex items-center gap-4" },
        React.createElement(Button, { 
          variant: "outline", 
          onClick: onBack,
          className: "flex items-center gap-2"
        },
          React.createElement(ChevronLeft, { className: "w-4 h-4" }),
          "Back to Reports"
        ),
        React.createElement("div", null,
          React.createElement("h1", { 
            className: "text-2xl font-semibold", 
            style: { color: COLLEGE_COLORS.darkGreen } 
          }, "Semester Attendance Sheet"),
          React.createElement("p", { className: "text-sm text-gray-600 mt-1" },
            `Detailed daily attendance records for ${monthNames[currentMonth]} ${currentYear}`
          )
        )
      ),
      
      React.createElement("div", { className: "flex items-center gap-2" },
        React.createElement(Button, { 
          variant: "outline", 
          className: "flex items-center gap-2",
          onClick: handleExport,
          disabled: filteredStudents.length === 0 || currentMonthDates.length === 0
        },
          React.createElement(Download, { className: "w-4 h-4" }),
          "Export Sheet"
        )
      )
    ),

    // Month Navigation
    React.createElement(Card, null,
      React.createElement(CardContent, { className: "p-4" },
        React.createElement("div", { className: "flex items-center justify-between" },
          React.createElement(Button, { 
            variant: "outline", 
            size: "sm", 
            onClick: function() { navigateMonth('prev'); }
          },
            React.createElement(ChevronLeft, { className: "w-4 h-4" })
          ),
          
          React.createElement("h2", { 
            className: "text-lg font-semibold", 
            style: { color: COLLEGE_COLORS.darkGreen } 
          }, `${monthNames[currentMonth]} ${currentYear}`),
          
          React.createElement(Button, { 
            variant: "outline", 
            size: "sm", 
            onClick: function() { navigateMonth('next'); }
          },
            React.createElement(ChevronRight, { className: "w-4 h-4" })
          )
        )
      )
    ),

    // Filters
    React.createElement("div", { className: "flex flex-col sm:flex-row gap-4" },
      React.createElement(Select, { value: selectedDepartment, onValueChange: setSelectedDepartment },
        React.createElement(SelectTrigger, { className: "w-full sm:w-48" },
          React.createElement(SelectValue, { placeholder: "Select Department" })
        ),
        React.createElement(SelectContent, null,
          React.createElement(SelectItem, { value: "all" }, "All Departments"),
          departments.map(function(dept) {
            return React.createElement(SelectItem, { key: dept, value: dept.toLowerCase() }, dept);
          })
        )
      ),
      
      React.createElement(Select, { value: selectedSemester, onValueChange: setSelectedSemester },
        React.createElement(SelectTrigger, { className: "w-full sm:w-48" },
          React.createElement(SelectValue, { placeholder: "Select Semester" })
        ),
        React.createElement(SelectContent, null,
          React.createElement(SelectItem, { value: "all" }, "All Semesters"),
          semesters.map(function(sem) {
            return React.createElement(SelectItem, { key: sem, value: sem.toString() }, `Semester ${sem}`);
          })
        )
      )
    ),

    // Summary Stats
    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4" },
      React.createElement(Card, null,
        React.createElement(CardContent, { className: "p-4" },
          React.createElement("div", { className: "flex items-center justify-between" },
            React.createElement("div", null,
              React.createElement("p", { className: "text-sm text-gray-600" }, "Total Students"),
              React.createElement("p", { 
                className: "text-xl font-semibold", 
                style: { color: COLLEGE_COLORS.darkGreen } 
              }, filteredStudents.length)
            ),
            React.createElement(Users, { className: "w-6 h-6 text-gray-400" })
          )
        )
      ),
      
      React.createElement(Card, null,
        React.createElement(CardContent, { className: "p-4" },
          React.createElement("div", { className: "flex items-center justify-between" },
            React.createElement("div", null,
              React.createElement("p", { className: "text-sm text-gray-600" }, "Days This Month"),
              React.createElement("p", { 
                className: "text-xl font-semibold", 
                style: { color: COLLEGE_COLORS.lightGreen } 
              }, currentMonthDates.length)
            ),
            React.createElement(Calendar, { className: "w-6 h-6 text-gray-400" })
          )
        )
      ),
      
      React.createElement(Card, null,
        React.createElement(CardContent, { className: "p-4" },
          React.createElement("div", { className: "flex items-center justify-between" },
            React.createElement("div", null,
              React.createElement("p", { className: "text-sm text-gray-600" }, "Average Attendance"),
              React.createElement("p", { className: "text-xl font-semibold text-blue-600" },
                (filteredStudents.length > 0 
                  ? Math.round(filteredStudents.reduce(function(sum, s) { return sum + s.percentage; }, 0) / filteredStudents.length)
                  : 0) + '%'
              )
            ),
            React.createElement(Eye, { className: "w-6 h-6 text-gray-400" })
          )
        )
      ),
      
      React.createElement(Card, null,
        React.createElement(CardContent, { className: "p-4" },
          React.createElement("div", { className: "flex items-center justify-between" },
            React.createElement("div", null,
              React.createElement("p", { className: "text-sm text-gray-600" }, "Warning Students"),
              React.createElement("p", { 
                className: "text-xl font-semibold", 
                style: { color: COLLEGE_COLORS.redAccent } 
              }, filteredStudents.filter(function(s) { return s.percentage < 75; }).length)
            ),
            React.createElement(FileText, { className: "w-6 h-6 text-gray-400" })
          )
        )
      )
    ),

    // Attendance Sheet
    React.createElement(Card, null,
      React.createElement(CardHeader, null,
        React.createElement(CardTitle, { className: "flex items-center gap-2" },
          React.createElement(Calendar, { className: "w-5 h-5" }),
          `Daily Attendance Sheet - ${filteredStudents.length} Students`
        )
      ),
      React.createElement(CardContent, null,
        filteredStudents.length === 0 ? (
          React.createElement("div", { className: "text-center py-8" },
            React.createElement(Users, { className: "w-12 h-12 mx-auto mb-4 text-gray-400" }),
            React.createElement("p", { className: "text-gray-600" }, "No students found for the selected filters.")
          )
        ) : currentMonthDates.length === 0 ? (
          React.createElement("div", { className: "text-center py-8" },
            React.createElement(Calendar, { className: "w-12 h-12 mx-auto mb-4 text-gray-400" }),
            React.createElement("p", { className: "text-gray-600" }, `No attendance records found for ${monthNames[currentMonth]} ${currentYear}.`)
          )
        ) : (
          React.createElement("div", { className: "overflow-x-auto" },
            React.createElement("table", { className: "w-full border-collapse border border-gray-300" },
              React.createElement("thead", null,
                React.createElement("tr", { className: "bg-gray-50" },
                  React.createElement("th", { className: "border border-gray-300 p-2 text-left sticky left-0 bg-gray-50 min-w-[200px]" },
                    "Student Details"
                  ),
                  currentMonthDates.map(function(date) {
                    return React.createElement("th", { key: date, className: "border border-gray-300 p-2 text-center min-w-[50px]" },
                      React.createElement("div", { className: "text-xs" },
                        React.createElement("div", null, formatDate(date)),
                        React.createElement("div", { className: "text-gray-500" }, getDayOfWeek(date))
                      )
                    );
                  }),
                  React.createElement("th", { className: "border border-gray-300 p-2 text-center min-w-[80px]" },
                    "Summary"
                  )
                )
              ),
              React.createElement("tbody", null,
                filteredStudents.map(function(student, index) {
                  return React.createElement("tr", { key: index, className: index % 2 === 0 ? 'bg-white' : 'bg-gray-50' },
                    React.createElement("td", { className: "border border-gray-300 p-2 sticky left-0 bg-inherit" },
                      React.createElement("div", null,
                        React.createElement("p", { className: "font-medium text-sm" }, student.name),
                        React.createElement("p", { className: "text-xs text-gray-600" },
                          `${student.department} • Sem ${student.semester}`
                        )
                      )
                    ),
                    currentMonthDates.map(function(date) {
                      const status = student.attendanceRecord[date];
                      return React.createElement("td", { key: date, className: "border border-gray-300 p-1 text-center" },
                        status ? (
                          React.createElement("span", {
                            className: `inline-block w-6 h-6 rounded text-xs flex items-center justify-center font-semibold ${
                              status === 'P' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`
                          }, status)
                        ) : (
                          React.createElement("span", { className: "text-gray-400 text-xs" }, "-")
                        )
                      );
                    }),
                    React.createElement("td", { className: "border border-gray-300 p-2 text-center" },
                      React.createElement("div", { className: "text-xs" },
                        React.createElement("div", { className: "font-semibold" }, student.percentage + '%'),
                        React.createElement("div", { className: "text-gray-600" }, `${student.presentDays}/${student.totalDays}`),
                        React.createElement("div", { className: "mt-1" }, getStatusBadge(student.percentage))
                      )
                    )
                  );
                })
              )
            )
          )
        )
      )
    ),

    // Legend
    React.createElement(Card, null,
      React.createElement(CardContent, { className: "p-4" },
        React.createElement("div", { className: "flex flex-wrap items-center gap-6" },
          React.createElement("div", { className: "flex items-center gap-2" },
            React.createElement("span", { className: "inline-block w-6 h-6 rounded bg-green-100 text-green-800 text-xs flex items-center justify-center font-semibold" }, "P"),
            React.createElement("span", { className: "text-sm" }, "Present")
          ),
          React.createElement("div", { className: "flex items-center gap-2" },
            React.createElement("span", { className: "inline-block w-6 h-6 rounded bg-red-100 text-red-800 text-xs flex items-center justify-center font-semibold" }, "A"),
            React.createElement("span", { className: "text-sm" }, "Absent")
          ),
          React.createElement("div", { className: "flex items-center gap-2" },
            React.createElement("span", { className: "text-gray-400 text-xs" }, "-"),
            React.createElement("span", { className: "text-sm" }, "No Record")
          ),
          React.createElement("div", { className: "flex items-center gap-4 ml-8" },
            React.createElement(Badge, { className: "bg-green-100 text-green-800" }, "Excellent (85%+)"),
            React.createElement(Badge, { className: "bg-yellow-100 text-yellow-800" }, "Good (75-84%)"),
            React.createElement(Badge, { className: "bg-red-100 text-red-800" }, "Warning (<75%)")
          )
        )
      )
    )
  );
}

export default SemesterAttendanceTable;