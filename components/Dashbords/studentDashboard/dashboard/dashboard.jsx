"use client";
import { useState } from "react";
import {
  Bell,
  User,
  Search,
  Calendar,
  TrendingUp,
  BarChart3,
  FileText,
  AlertCircle,
  GraduationCap,
  Clock,
  ChevronRight
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { COLLEGE_COLORS } from "../../../constants/colors";
import { getTodaysSchedule, getCurrentDay } from "../../../constants/scheduleData";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Input } from "../../../ui/input";

/* --- Local helper data/functions (same logic as tumhari snippets) --- */
const studentData = {
  name: "Ahmed Ali",
  rollNo: "CS2021001",
  semester: 6,
  department: "Computer Science",
  section: "A",
  currentCGPA: 3.42,
  overallAttendance: 87.5
};

const subjectAttendanceData = [
  { subject: "Mathematics", present: 28, absent: 4, total: 32 },
  { subject: "Physics", present: 24, absent: 6, total: 30 },
  { subject: "Chemistry", present: 30, absent: 2, total: 32 },
  { subject: "Computer Science", present: 22, absent: 8, total: 30 },
  { subject: "English", present: 26, absent: 4, total: 30 }
];

const getAnnouncements = () => {
  const stored = localStorage.getItem("teacher_announcements");
  return stored
    ? JSON.parse(stored)
    : [
        {
          id: "1",
          title: "Mid-term Exam Schedule Released",
          content:
            "The mid-term examination schedule for all courses has been released. Please check your respective subject pages for detailed timing.",
          type: "urgent",
          createdBy: "Academic Office",
          createdDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          targetAudience: "all"
        },
        {
          id: "2",
          title: "Library Closure Notice",
          content:
            "The central library will remain closed on December 15th for maintenance work. Online resources will remain available.",
          type: "general",
          createdBy: "Library Staff",
          createdDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          targetAudience: "all"
        },
        {
          id: "3",
          title: "New Assignment: Data Structures",
          content:
            "A new assignment on Binary Trees has been posted in the Computer Science portal. Submission deadline: December 20th.",
          type: "academic",
          createdBy: "Prof. Ahmed Khan",
          createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          targetAudience: "cs"
        }
      ];
};

const getPendingAssignments = () => {
  const stored = localStorage.getItem("teacher_assignments");
  const assignments = stored ? JSON.parse(stored) : [];
  return assignments.filter((assignment) => {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    return dueDate > now;
  }).length;
};

const formatTimeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "1 day ago";
  return `${diffInDays} days ago`;
};

/* -------------------- Component -------------------- */
export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const todaysSchedule = getTodaysSchedule();
  const announcements = getAnnouncements();
  const pendingAssignments = getPendingAssignments();

  const chartData = subjectAttendanceData.map((subject) => ({
    name: subject.subject.substring(0, 8),
    present: subject.present,
    absent: subject.absent,
    percentage: Math.round((subject.present / subject.total) * 100)
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      {/* <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
              Welcome back, {studentData.name}!
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Roll No: {studentData.rollNo} • Keep up the great work!
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search lectures, assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Bell className="w-5 h-5" style={{ color: COLLEGE_COLORS.darkGreen }} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                  style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
                >
                  {studentData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{studentData.name}</p>
                  <p className="text-gray-500">{studentData.rollNo}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Overall Attendance</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: COLLEGE_COLORS.lightGreen }} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
                {studentData.overallAttendance}%
              </div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-green-600">+2.3% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current CGPA</p>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-semibold text-blue-600">{studentData.currentCGPA}</div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-green-600">+0.15 from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Assignments</p>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-500" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-semibold text-orange-600">{pendingAssignments}</div>
              <div className="flex items-center gap-1 text-xs">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-red-600">2 from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Semester</p>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-500" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-semibold text-purple-600">{studentData.semester}</div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-green-600">+1 from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Attendance Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle style={{ color: COLLEGE_COLORS.darkGreen }}>Subject-wise Attendance</CardTitle>
          <p className="text-sm text-gray-600">Your attendance record for this semester</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "present" ? `${value} Present` : `${value} Absent`,
                    name === "present" ? "Present" : "Absent"
                  ]}
                />
                <Bar dataKey="present" fill={COLLEGE_COLORS.lightGreen} />
                <Bar dataKey="absent" fill={COLLEGE_COLORS.redAccent} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Lectures */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle style={{ color: COLLEGE_COLORS.darkGreen }}>Today's Lectures</CardTitle>
            <p className="text-sm text-gray-600">Your scheduled classes and recorded lectures</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaysSchedule.length > 0 ? (
              todaysSchedule.map((lecture, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 rounded-full" style={{ backgroundColor: lecture.color }} />
                    <div>
                      <h4 className="font-medium text-gray-900">{lecture.subject}</h4>
                      <p className="text-sm text-gray-600">{lecture.class}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={lecture.type === "Lab" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                      {lecture.type}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{lecture.time}</p>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">10:00 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-sm">No lectures today!</p>
                <p className="text-xs text-gray-400">Enjoy your day off</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle style={{ color: COLLEGE_COLORS.darkGreen }}>Recent Announcements</CardTitle>
                <p className="text-sm text-gray-600">Stay updated with important college notices</p>
              </div>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {announcements.slice(0, 3).map((announcement) => (
              <div
                key={announcement.id}
                className="border-l-4 pl-4 py-2"
                style={{
                  borderLeftColor:
                    announcement.type === "urgent"
                      ? COLLEGE_COLORS.redAccent
                      : announcement.type === "academic"
                      ? COLLEGE_COLORS.lightGreen
                      : "#3B82F6"
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">{announcement.title}</h4>
                      <Badge
                        className={
                          announcement.type === "urgent"
                            ? "bg-red-100 text-red-800"
                            : announcement.type === "academic"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }
                        variant="secondary"
                      >
                        {announcement.type === "urgent" ? "Urgent" : announcement.type === "academic" ? "Academic" : "General"}
                      </Badge>
                    </div>

                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{announcement.content}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{announcement.createdBy}</span>
                      </div>
                      <span>{formatTimeAgo(announcement.createdDate)}</span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            ))}

            {announcements.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No announcements yet</p>
                <p className="text-xs text-gray-400">Check back later for updates</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
