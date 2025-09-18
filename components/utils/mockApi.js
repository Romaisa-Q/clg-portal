// src/utils/mockApi.js
// Dummy API to simulate backend for classes (combined department+semester) and students


const delay = (ms = 600) => new Promise(res => setTimeout(res, ms));


// Sample teacher data mapping — in a real app you'd use teacherId to fetch
const TEACHER_CLASSES = [
{ id: 'CS-1', name: 'CS 1' },
{ id: 'CS-2', name: 'CS 2' },
{ id: 'IT-1', name: 'IT 1' },
{ id: 'BI-1', name: 'BI 1' }
];


const STUDENTS_BY_CLASS = {
'CS-1': [
{ id: 'stu-cs1-1', studentName: 'Ahmad Hassan', department: 'CS', semester: '1' },
{ id: 'stu-cs1-2', studentName: 'Fatima Khan', department: 'CS', semester: '1' },
{ id: 'stu-cs1-3', studentName: 'Ali Ahmed', department: 'CS', semester: '1' }
],
'CS-2': [
{ id: 'stu-cs2-1', studentName: 'Hassan Ali', department: 'CS', semester: '2' },
{ id: 'stu-cs2-2', studentName: 'Omar Farooq', department: 'CS', semester: '2' }
],
'IT-1': [
{ id: 'stu-it1-1', studentName: 'Aisha Noor', department: 'IT', semester: '1' },
{ id: 'stu-it1-2', studentName: 'Zara Sheikh', department: 'IT', semester: '1' }
],
'BI-1': [
{ id: 'stu-bi1-1', studentName: 'Sadaf Riaz', department: 'BI', semester: '1' }
]
};


export async function getTeacherClasses(/* teacherId */) {
await delay();
// in real API, filter by teacherId
return TEACHER_CLASSES;
}


export async function getStudentsByClass(classId) {
await delay();
return STUDENTS_BY_CLASS[classId] || [];
}


// Helper to simulate daily attendance submitted by students (unused for teacher flow but useful)
export async function fetchDailyAttendanceFromStudentApi() {
await delay();
// Return a flattened sample — kept for backward compatibility
const all = [];
Object.keys(STUDENTS_BY_CLASS).forEach(c => {
STUDENTS_BY_CLASS[c].forEach(s => {
all.push({
studentName: s.studentName,
department: `${s.department}-${s.semester}`,
subject: 'Auto-subject',
status: Math.random() > 0.2 ? 'present' : 'absent',
markedBy: 'student',
classId: c
});
});
});
return all;
}
// TODO: Replace above with real API calls when backend is ready.