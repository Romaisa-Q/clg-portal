// src/utils/attendanceStorage.js
const RECORDS_KEY = 'attendance_records'; // array of { date, classId, data: [ { id, studentName, department, semester, present } ] }
const REPORTS_KEY = 'attendance_data'; // aggregated reports object (daily, students)
const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null') || fallback;
  } catch (e) {
    return fallback;
  }
};

const writeJson = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const normalizeClassKey = (str = '') => {
  if (!str) return '';
  const s = String(str).trim();
  const m = s.match(/^([A-Za-z]+)[\s-_]?(\d+)/);
  if (m) return `${m[1]}-${m[2]}`;
  return s;
};

const makeStudentId = (classId, studentName) => {
  const nameSafe = (studentName || '').trim().replace(/\s+/g, '_');
  return `${classId}-${nameSafe}`;
};

const attendanceManager = {
  saveDailyRecord(date, classId, studentsArray) {
    const records = readJson(RECORDS_KEY, []);
    const normalizedClassId = normalizeClassKey(classId || '');
    const record = {
      date,
      classId: normalizedClassId,
      data: (studentsArray || []).map(s => ({
        id: s.id || makeStudentId(normalizedClassId, s.studentName),
        studentName: s.studentName,
        department: s.department || (normalizedClassId.split('-')[0] || ''),
        semester: s.semester || (normalizedClassId.split('-')[1] || ''),
        present: !!s.present
      }))
    };

    const idx = records.findIndex(r => r.date === date && normalizeClassKey(r.classId) === normalizedClassId);
    if (idx >= 0) records[idx] = record;
    else records.push(record);

    writeJson(RECORDS_KEY, records);

    // update reports
    this._syncRecordsToReports(records);
    return record;
  },

  // Return a saved daily record for date+classId
  getDailyRecord(date, classId) {
    const records = readJson(RECORDS_KEY, []);
    const normalizedClassId = normalizeClassKey(classId || '');
    return records.find(r => r.date === date && normalizeClassKey(r.classId) === normalizedClassId) || null;
  },

  // Returns filtered data for UI. For daily: returns today's record for classId mapped to UI format.
  // For other periods: returns result of getPeriodData
  getFilteredData(period, classId = 'all') {
    if (period === 'daily') {
      const today = new Date().toISOString().split('T')[0];
      if (classId === 'all') return []; // daily UI expects a specific class
      const rec = this.getDailyRecord(today, classId);
      if (!rec) return [];
      return rec.data.map(s => ({
        id: s.id,
        studentName: s.studentName,
        department: `${s.department}-${s.semester}`,
        subject: s.subject || '',
        status: s.present ? 'present' : 'absent',
        markedBy: 'teacher',
        date: rec.date
      }));
    }

    // For weekly/monthly/semester, delegate to getPeriodData which returns UI-ready aggregated rows
    return this.getPeriodData(period, classId);
  },


  updateAttendanceStatus(date, idOrStudentIdOrName, classId, newStatus) {
    const records = readJson(RECORDS_KEY, []);
    const normalizedClassId = normalizeClassKey(classId || '');

    const recIdx = records.findIndex(r => r.date === date && normalizeClassKey(r.classId) === normalizedClassId);
    if (recIdx < 0) return false;
    const rec = records[recIdx];

    // try to find by id first, then by studentName fallback
    const sIdx = rec.data.findIndex(s =>
      s.id === idOrStudentIdOrName ||
      s.studentName === idOrStudentIdOrName ||
      makeStudentId(normalizedClassId, s.studentName) === idOrStudentIdOrName
    );
    if (sIdx < 0) return false;

    rec.data[sIdx].present = newStatus === 'present';
    records[recIdx] = rec;
    writeJson(RECORDS_KEY, records);

    // sync to reports storage
    this._syncRecordsToReports(records);
    return true;
  },

  // Convert student-side API payload to internal daily records and save
  // Accepts an array of items like { studentName, department, subject, status, markedBy }
  // Groups by classId derived from department+semester pattern and writes saveDailyRecord for each class.
  processDailyAttendance(apiArray = []) {
    if (!Array.isArray(apiArray) || apiArray.length === 0) return [];

    const today = new Date().toISOString().split('T')[0];

    // Build grouped map: classId -> [student objects]
    const groups = {};
    apiArray.forEach(item => {
      // try to parse `department` like 'CS-3rd' or 'CS-1'
      const deptRaw = item.department || '';
      let classId = normalizeClassKey(deptRaw);
      if (!classId) {
        // fallback: if department provided separately
        const dep = item.department || 'GEN';
        const sem = item.semester || '1';
        classId = `${dep}-${sem}`;
      }
      if (!groups[classId]) groups[classId] = [];
      groups[classId].push({
        id: makeStudentId(classId, item.studentName),
        studentName: item.studentName,
        department: (item.department || classId.split('-')[0]),
        semester: item.semester || classId.split('-')[1] || '',
        present: (String(item.status || '').toLowerCase() === 'present') || (item.present === true)
      });
    });

    // Save each class record
    const saved = [];
    Object.keys(groups).forEach(classId => {
      const rec = this.saveDailyRecord(today, classId, groups[classId]);
      saved.push(rec);
    });

    return saved;
  },

  // Internal: sync records array -> reports object { daily: { date: [entries...] }, students: { id: {...} } }
  _syncRecordsToReports(records) {
    // Start from existing aggregated data so we preserve history
    const reports = readJson(REPORTS_KEY, { daily: {}, students: {} });
    // Ensure shapes
    reports.daily = reports.daily || {};
    reports.students = reports.students || {};

    // Rebuild daily and students from full records list (we prefer authoritative source = records)
    // Clear and rebuild for simplicity
    const daily = {};
    const students = {}; // keyed by id

    (records || []).forEach(rec => {
      const date = rec.date;
      const classId = normalizeClassKey(rec.classId || '');
      if (!daily[date]) daily[date] = [];
      (rec.data || []).forEach(s => {
        const id = s.id || makeStudentId(classId, s.studentName);
        const department = s.department || (classId.split('-')[0] || '');
        const semester = s.semester || (classId.split('-')[1] || '');
        const status = s.present ? 'present' : 'absent';

        // daily entry
        daily[date].push({
          id,
          studentName: s.studentName,
          department: `${department}-${semester}`,
          status,
          date,
          classId // include normalized classId
        });

        // student historical entry
        if (!students[id]) {
          students[id] = {
            id,
            studentName: s.studentName,
            department,
            semester,
            attendance: {}
          };
        }
        students[id].attendance[date] = status;
      });
    });

    reports.daily = daily;
    reports.students = students;

    writeJson(REPORTS_KEY, reports);
    return reports;
  },

  // Returns aggregated rows for weekly/monthly/semester in the expected UI shape:
  // { studentName, department, semester, totalClasses, attended, percentage, status }
  
// Paste this inside attendanceManager, replacing the previous getPeriodData
// Simplified: semester-only aggregation
getPeriodData(period, classId = 'all') {
  const reports = readJson(REPORTS_KEY, { daily: {}, students: {}, semester: {} });
  const daily = reports.daily || {};
  const students = reports.students || {};

  const toYMD = (d) => {
    const dt = new Date(d);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Determine semester start date (prefer reports.semester.startDate)
  let startDate;
  if (reports.semester && reports.semester.startDate) {
    startDate = new Date(reports.semester.startDate);
  } else {
    // fallback to earliest daily entry date if available
    const dailyKeys = Object.keys(daily).sort();
    if (dailyKeys.length > 0) {
      startDate = new Date(dailyKeys[0].split('T')[0]);
    } else {
      // last-resort fallback ~120 days ago
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 120);
    }
  }

  const today = new Date();
  const todayYMD = toYMD(today);

  // Build list of YMD dates from startDate -> today (inclusive)
  const periodDates = [];
  for (let d = new Date(startDate); toYMD(d) <= todayYMD; d.setDate(d.getDate() + 1)) {
    periodDates.push(toYMD(d));
  }
  const totalClassDays = periodDates.length;

  const normalizedClassId = normalizeClassKey(classId || '');

  // Collect student ids from daily entries in this period OR from reports.students for this class
  const studentIds = new Set();

  // from daily entries in period
  periodDates.forEach(dateStr => {
    const entries = Array.isArray(daily[dateStr]) ? daily[dateStr] : [];
    entries.forEach(e => {
      const eClass = normalizeClassKey(e.classId || (e.department || ''));
      if (classId !== 'all' && eClass !== normalizedClassId) return;
      if (e.id) studentIds.add(e.id);
      else studentIds.add(makeStudentId(eClass, e.studentName || ''));
    });
  });

  // also include students known from reports.students for this class
  Object.values(students || {}).forEach(stu => {
    const classKey = `${stu.department}-${stu.semester}`;
    if (classId !== 'all' && normalizeClassKey(classKey) !== normalizedClassId) return;
    const sid = stu.id || makeStudentId(classKey, stu.studentName || '');
    studentIds.add(sid);
  });

  // Build rows: count attended across periodDates
  const rows = [];
  studentIds.forEach(id => {
    // find sample info
    let studentName = '';
    let department = '';
    let semester = '';

    // try to locate sample from daily entries
    let foundSample = null;
    for (let i = 0; i < periodDates.length && !foundSample; i++) {
      const dateStr = periodDates[i];
      const entries = Array.isArray(daily[dateStr]) ? daily[dateStr] : [];
      for (let j = 0; j < entries.length; j++) {
        const e = entries[j];
        const eId = e.id || makeStudentId(normalizeClassKey(e.classId || (e.department||'')), e.studentName || '');
        if (eId === id) { foundSample = e; break; }
      }
    }

    if (foundSample) {
      studentName = foundSample.studentName || '';
      const parts = (normalizeClassKey(foundSample.classId || (foundSample.department || '')) || '').split('-');
      department = parts[0] || (foundSample.department || '');
      semester = parts[1] || (foundSample.semester || '');
    } else if (students[id]) {
      studentName = students[id].studentName || '';
      department = students[id].department || '';
      semester = students[id].semester || '';
    } else {
      const idParts = (id || '').split('-');
      if (idParts.length >= 3) {
        department = idParts[0] || '';
        semester = idParts[1] || '';
        studentName = idParts.slice(2).join(' ').replace(/_/g, ' ');
      } else {
        studentName = id.replace(/_/g, ' ');
      }
    }

    // count presents
    let attendedCount = 0;
    periodDates.forEach(dateStr => {
      const entries = Array.isArray(daily[dateStr]) ? daily[dateStr] : [];
      const e = entries.find(en => {
        const eId = en.id || makeStudentId(normalizeClassKey(en.classId || (en.department||'')), en.studentName || '');
        return eId === id;
      });
      if (e && (e.status || '').toLowerCase() === 'present') attendedCount += 1;
    });

    const percentage = totalClassDays > 0 ? Math.round((attendedCount / totalClassDays) * 100) : 0;
    const status = (percentage < 75) ? 'warning' : (percentage < 85 ? 'good' : 'excellent');

    rows.push({
      studentName,
      department,
      semester,
      totalClasses: totalClassDays,
      attended: attendedCount,
      percentage,
      status
    });
  });

  return rows;
},



  // Utility: compute stats used by UI cards
  getAttendanceStats(period = 'daily', classId = undefined) {
    try {
      if (period === 'daily') {
        const classKey = classId || 'all';
        const rows = this.getFilteredData('daily', classKey);
        const total = rows.length;
        const present = rows.filter(r => r.status === 'present').length;
        const absent = rows.filter(r => r.status === 'absent').length;
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
        return { total, present, absent, percentage };
      } else {
        const rows = this.getPeriodData(period, classId || 'all');
        const totalStudents = rows.length;
        const averageAttendance = totalStudents > 0 ? Math.round(rows.reduce((s, r) => s + (r.percentage || 0), 0) / totalStudents) : 0;
        return {
          totalStudents,
          averageAttendance,
          excellent: rows.filter(r => r.status === 'excellent').length,
          good: rows.filter(r => r.status === 'good').length,
          warning: rows.filter(r => r.status === 'warning').length
        };
      }
    } catch (e) {
      return {};
    }
  }
};

// expose on window for debugging in browser console
if (typeof window !== 'undefined') {
  window.attendanceManager = attendanceManager;
}

export { attendanceManager };
export default attendanceManager;
