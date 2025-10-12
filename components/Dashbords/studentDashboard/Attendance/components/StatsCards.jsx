import { Calendar, BookOpen, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../../../../ui/card';
import { Badge } from '../../../../ui/badge';
import { Progress } from '../../../../ui/progress';

const studentData = {
  overallAttendance: 87.5
};

const subjectAttendanceData = [
  { present: 28, absent: 4, total: 32 },
  { present: 24, absent: 6, total: 30 },
  { present: 30, absent: 2, total: 32 },
  { present: 22, absent: 8, total: 30 },
  { present: 26, absent: 4, total: 30 },
  { present: 14, absent: 1, total: 15 }
];

export default function StatsCards() {
  const totalClasses = subjectAttendanceData.reduce((sum, subject) => sum + subject.total, 0);
  const totalPresent = subjectAttendanceData.reduce((sum, subject) => sum + subject.present, 0);
  const totalAbsent = subjectAttendanceData.reduce((sum, subject) => sum + subject.absent, 0);

  const stats = [
    {
      icon: Calendar,
      badge: "Overall",
      title: "Overall Attendance",
      value: `${studentData.overallAttendance}%`,
      trend: "+2.3% this month",
      progress: studentData.overallAttendance,
      color: "green"
    },
    {
      icon: BookOpen,
      badge: "Total",
      title: "Total Classes",
      value: totalClasses.toString(),
      description: "This semester",
      color: "green"
    },
    {
      icon: CheckCircle,
      badge: "Attended",
      title: "Classes Present",
      value: totalPresent.toString(),
      description: `${((totalPresent/totalClasses)*100).toFixed(1)}% of total`,
      color: "green"
    },
    {
      icon: XCircle,
      badge: "Missed",
      title: "Classes Absent",
      value: totalAbsent.toString(),
      description: `${((totalAbsent/totalClasses)*100).toFixed(1)}% of total`,
      color: "red"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`flex items-center justify-center w-11 h-11 rounded-lg ${
                stat.color === 'green' ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <stat.icon className={`w-5 h-5 ${
                  stat.color === 'green' ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
              <Badge variant="outline" className={`text-xs ${
                stat.color === 'green' ? 'border-green-200 text-green-700' : 'border-slate-200 text-slate-600'
              }`}>
                {stat.badge}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wide">{stat.title}</p>
              <p className="text-2xl font-normal text-slate-900">{stat.value}</p>
              {stat.trend && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>{stat.trend}</span>
                </div>
              )}
              {stat.description && (
                <p className="text-xs text-slate-500">{stat.description}</p>
              )}
            </div>
            {stat.progress && (
              <Progress value={stat.progress} className="mt-3 h-1.5 bg-green-100" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}