import { Award, Target, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '../../../../ui/card';

const subjectAttendanceData = [
  { subject: 'Artificial Intelligence', percentage: 87.5 },
  { subject: 'Machine Learning', percentage: 80.0 },
  { subject: 'Software Engineering-II', percentage: 93.75 },
  { subject: 'Computer Networks', percentage: 73.33 },
  { subject: 'Web Engineering', percentage: 86.67 },
  { subject: 'Data Science Lab', percentage: 93.33 }
];

export default function QuickInsights() {
  const highestPercentage = Math.max(...subjectAttendanceData.map(s => s.percentage));
  const lowestPercentage = Math.min(...subjectAttendanceData.map(s => s.percentage));
  const averagePercentage = subjectAttendanceData.reduce((sum, s) => sum + s.percentage, 0) / subjectAttendanceData.length;

  const highestSubject = subjectAttendanceData.find(s => s.percentage === highestPercentage)?.subject;
  const lowestSubject = subjectAttendanceData.find(s => s.percentage === lowestPercentage)?.subject;

  const insights = [
    {
      icon: Award,
      trendIcon: TrendingUp,
      title: 'Highest Attendance',
      value: `${highestPercentage.toFixed(1)}%`,
      description: highestSubject,
      color: 'green'
    },
    {
      icon: Target,
      trendIcon: TrendingDown,
      title: 'Needs Improvement',
      value: `${lowestPercentage.toFixed(1)}%`,
      description: lowestSubject,
      color: 'red'
    },
    {
      icon: BarChart3,
      title: 'Average Attendance',
      value: `${averagePercentage.toFixed(1)}%`,
      description: `Across ${subjectAttendanceData.length} subjects`,
      color: 'green'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {insights.map((insight, index) => (
        <Card key={index} className="border-0 shadow-sm bg-white">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`flex items-center justify-center w-11 h-11 rounded-lg ${
                insight.color === 'green' ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <insight.icon className={`w-6 h-6 ${
                  insight.color === 'green' ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
              {insight.trendIcon && (
                <insight.trendIcon className={`w-4 h-4 ${
                  insight.color === 'green' ? 'text-green-500' : 'text-red-500'
                }`} />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wide">{insight.title}</p>
              <p className="text-2xl font-normal text-green-900">{insight.value}</p>
              <p className="text-xs text-green-600 mt-1">{insight.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}