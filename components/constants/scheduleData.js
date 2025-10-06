// Shared schedule data for the entire semester
export const scheduleData = {
  Monday: {
    '9:00 AM': { subject: 'Computer Networks', class: 'CS-6TH', type: 'Lecture' },
    '11:00 AM': { subject: 'Database Systems', class: 'CS-4TH', type: 'Lecture' },
    '2:00 PM': { subject: 'Networks Lab', class: 'CS-6TH', type: 'Lab' }
  },
  Tuesday: {
    '8:00 AM': { subject: 'Software Engineering', class: 'CS-5TH', type: 'Lecture' },
    '10:00 AM': { subject: 'Computer Networks', class: 'CS-6TH', type: 'Lecture' },
    '1:00 PM': { subject: 'Database Lab', class: 'CS-4TH', type: 'Lab' }
  },
  Wednesday: {
    '9:00 AM': { subject: 'Computer Networks', class: 'CS-6TH', type: 'Lecture' },
    '11:00 AM': { subject: 'Software Engineering', class: 'CS-5TH', type: 'Lecture' },
    '3:00 PM': { subject: 'Programming Lab', class: 'CS-3RD', type: 'Lab' }
  },
  Thursday: {
    '8:00 AM': { subject: 'Database Systems', class: 'CS-4TH', type: 'Lecture' },
    '10:00 AM': { subject: 'Software Engineering', class: 'CS-5TH', type: 'Lecture' },
    '2:00 PM': { subject: 'SE Lab', class: 'CS-5TH', type: 'Lab' }
  },
  Friday: {
    '9:00 AM': { subject: 'Computer Networks', class: 'CS-6TH', type: 'Lecture' },
    '11:00 AM': { subject: 'Database Systems', class: 'CS-4TH', type: 'Lecture' },
    '1:00 PM': { subject: 'Programming', class: 'CS-3RD', type: 'Lecture' }
  },
  Saturday: {},
  Sunday: {}
};

export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Get current day name
export const getCurrentDay = () => {
  const today = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[today.getDay()];
};

// Get today's schedule
export const getTodaysSchedule = () => {
  const currentDay = getCurrentDay();
  const todaySchedule = scheduleData[currentDay] || {};
  
  return Object.entries(todaySchedule).map(([time, classInfo]) => ({
    time,
    subject: classInfo.subject,
    class: classInfo.class,
    type: classInfo.type,
    color: classInfo.type === 'Lab' ? '#2196F3' : '#66bb6a'
  }));
};