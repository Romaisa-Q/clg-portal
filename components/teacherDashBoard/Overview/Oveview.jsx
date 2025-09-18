import { BookOpen, Users, FileText, Calendar } from 'lucide-react';
import { COLLEGE_COLORS } from '../../constants/colors';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

export default function Overview() {
  const statsData = [
    { title: 'Total Classes', value: '6', icon: BookOpen, color: COLLEGE_COLORS.lightGreen, bgColor: 'bg-green-100' },
    { title: 'Total Students', value: '180', icon: Users, color: '#3B82F6', bgColor: 'bg-blue-100' },
    { title: 'Pending Grades', value: '24', icon: FileText, color: '#F59E0B', bgColor: 'bg-yellow-100' },
    { title: 'Total Semesters', value: '4', icon: Calendar, color: '#8B5CF6', bgColor: 'bg-purple-100' },
  ];

  const scheduleData = [
    { subject: 'Computer Networks', room: 'Room 101', time: '9:00 AM', color: COLLEGE_COLORS.lightGreen },
    { subject: 'Database Systems', room: 'Room 205 • CS-3B', time: '11:00 AM', color: '#3B82F6' },
    { subject: 'Software Engineering', room: 'Room 301 • CS-4A', time: '2:00 PM', color: '#8B5CF6' },
  ];

  const recentActivities = [
    { text: 'Graded Database Systems Assignment', time: '2 hours ago' },
    { text: 'Posted new announcement for CS-4A', time: '4 hours ago' },
    { text: 'Updated attendance for Computer Networks', time: '1 day ago' },
    { text: 'Created new assignment for Software Engineering', time: '2 days ago' },
  ];

  const assignmentsDue = [
    { studentName: 'Ahmed Khan', rollNo: 'CS-2021-101', semester: '6th', section: 'A', assignment: 'Database Design Project', dueDate: 'Jan 5, 2025' },
    { studentName: 'Fatima Ali', rollNo: 'CS-2021-085', semester: '6th', section: 'B', assignment: 'Network Security Report', dueDate: 'Jan 7, 2025' },
    { studentName: 'Hassan Ahmed', rollNo: 'CS-2022-045', semester: '4th', section: 'A', assignment: 'Software Testing Lab', dueDate: 'Jan 8, 2025' },
    { studentName: 'Ayesha Malik', rollNo: 'CS-2021-092', semester: '6th', section: 'A', assignment: 'Web Development Project', dueDate: 'Jan 10, 2025' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {statsData.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Schedule & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle style={{ color: COLLEGE_COLORS.darkGreen }}>Today's Schedule</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {scheduleData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{item.subject}</h4>
                  <p className="text-sm text-gray-600">{item.room}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: item.color }}>
                  {item.time}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle style={{ color: COLLEGE_COLORS.darkGreen }}>Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}></div>
                <div>
                  <p className="text-sm text-gray-900">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Assignments */}
      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle style={{ color: COLLEGE_COLORS.darkGreen }}>Assignments Due</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left">Student Name</th>
                  <th className="py-3 px-4 text-left">Roll No</th>
                  <th className="py-3 px-4 text-left">Semester</th>
                  <th className="py-3 px-4 text-left">Section</th>
                  <th className="py-3 px-4 text-left">Assignment</th>
                  <th className="py-3 px-4 text-left">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {assignmentsDue.map((assignment, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{assignment.studentName}</td>
                    <td className="py-3 px-4">{assignment.rollNo}</td>
                    <td className="py-3 px-4">{assignment.semester}</td>
                    <td className="py-3 px-4">{assignment.section}</td>
                    <td className="py-3 px-4">{assignment.assignment}</td>
                    <td className="py-3 px-4" style={{ color: COLLEGE_COLORS.redAccent }}>{assignment.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
