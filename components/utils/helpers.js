// components/utils/helpers.js
// Helper functions for attendance

// Get all semester attendance data from localStorage
export const getSemesterAttendanceData = () => {
  const dailyRecords = JSON.parse(localStorage.getItem('attendance_records') || '[]');

  if (!dailyRecords || dailyRecords.length === 0) {
    return { students: [], dates: [] }; // empty fallback
  }

  const semesterData = {};
  const allDates = new Set();

  dailyRecords.forEach(record => {
    const { date, data } = record;
    allDates.add(date);

    data.forEach(student => {
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

  const students = Object.values(semesterData);

  // Calculate totals
  students.forEach(student => {
    const records = Object.values(student.attendanceRecord);
    student.totalDays = records.length;
    student.presentDays = records.filter(status => status === 'P').length;
    student.percentage = student.totalDays > 0 ? Math.round((student.presentDays / student.totalDays) * 100) : 0;
  });

  const dates = Array.from(allDates).sort();

  return { students, dates };
};

// Format date for table header
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
};

// Get day of week from date
export const getDayOfWeek = (dateStr) => {
  const date = new Date(dateStr);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};
