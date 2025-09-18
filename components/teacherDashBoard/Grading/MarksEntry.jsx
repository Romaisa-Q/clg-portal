import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { COLLEGE_COLORS } from '../../constants/colors';

const marksDataInitial = [
  {
    id: 1,
    studentName: 'Ahmed Hassan',
    rollNo: 'CS21001',
    assignment: 'Network Security Assignment',
    submittedAt: '2024-12-28',
    marks: null,
    totalMarks: 100,
    status: 'Pending'
  },
  {
    id: 2,
    studentName: 'Fatima Khan',
    rollNo: 'CS21002',
    assignment: 'Network Security Assignment',
    submittedAt: '2024-12-27',
    marks: 85,
    totalMarks: 100,
    status: 'Graded'
  },
  {
    id: 3,
    studentName: 'Ali Ahmed',
    rollNo: 'CS21003',
    assignment: 'Database Design Project',
    submittedAt: '2024-12-24',
    marks: 92,
    totalMarks: 100,
    status: 'Graded'
  }
];

export default function MarksEntry() {
  const [currentMarks, setCurrentMarks] = useState({});
  const [marksData, setMarksData] = useState(marksDataInitial);

  const handleMarksChange = (studentId, marks) => {
    setCurrentMarks(prev => ({
      ...prev,
      [studentId]: marks
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Montserrat' }}>
        Marks Entry
      </h2>
      
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Quick Marks Entry</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option>Select Class</option>
              <option>CS-3A</option>
              <option>CS-3B</option>
              <option>CS-4A</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option>Select Subject</option>
              <option>Computer Networks</option>
              <option>Database Systems</option>
              <option>Software Engineering</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option>Exam Type</option>
              <option>Quiz</option>
              <option>Assignment</option>
              <option>Midterm</option>
              <option>Final</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {marksData.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.studentName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{student.rollNo}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{student.assignment}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        max={student.totalMarks}
                        value={currentMarks[student.id] || student.marks || ''}
                        onChange={(e) => handleMarksChange(student.id, e.target.value)}
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-500">/ {student.totalMarks}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      student.status === 'Graded' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <Check className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
