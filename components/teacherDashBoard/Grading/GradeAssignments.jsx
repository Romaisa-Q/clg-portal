
import { useState } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import { COLLEGE_COLORS } from '../../constants/colors';

const assignmentsData = [
  {
    id: 1,
    title: 'Network Security Assignment',
    class: 'CS-3A',
    subject: 'Computer Networks',
    dueDate: '2024-12-30',
    submissions: 28,
    totalStudents: 35,
    graded: 15,
    status: 'Active'
  },
  {
    id: 2,
    title: 'Database Design Project',
    class: 'CS-3B',
    subject: 'Database Systems',
    dueDate: '2024-12-25',
    submissions: 30,
    totalStudents: 32,
    graded: 30,
    status: 'Completed'
  },
  {
    id: 3,
    title: 'Software Requirements Analysis',
    class: 'CS-4A',
    subject: 'Software Engineering',
    dueDate: '2025-01-05',
    submissions: 20,
    totalStudents: 28,
    graded: 0,
    status: 'Active'
  }
];

export default function GradeAssignments({ setActiveSection }) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Montserrat' }}>
            Grade Assignments
          </h2>
          <p className="text-gray-600">Review and grade student submissions</p>
        </div>
      </div>

      {/* Assignments List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Graded</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignmentsData.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{assignment.title}</div>
                      <div className="text-sm text-gray-500">{assignment.subject}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{assignment.class}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{assignment.dueDate}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {assignment.submissions}/{assignment.totalStudents}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {assignment.graded}/{assignment.submissions}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: assignment.submissions > 0 ? `${(assignment.graded / assignment.submissions) * 100}%` : '0%' }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      assignment.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setActiveSection('marks-entry')}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs rounded-md text-white"
                      style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Grade
                    </button>
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
