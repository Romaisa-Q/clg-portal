import { Card, CardContent, CardHeader, CardTitle } from '../../../../ui/card';
import { Badge } from '../../../../ui/badge';
import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

const subjectAttendanceData = [
  { subject: 'Artificial Intelligence', percentage: 87.5 },
  { subject: 'Machine Learning', percentage: 80.0 },
  { subject: 'Software Engineering-II', percentage: 93.75 },
  { subject: 'Computer Networks', percentage: 73.33 },
  { subject: 'Web Engineering', percentage: 86.67 },
  { subject: 'Data Science Lab', percentage: 93.33 }
];

const studentData = {
  overallAttendance: 87.5
};

export default function PerformanceAnalysis() {
  const excellentSubjects = subjectAttendanceData.filter(s => s.percentage >= 90);
  const warningSubjects = subjectAttendanceData.filter(s => s.percentage < 75);

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="border-b bg-green-50">
        <CardTitle className="text-lg text-green-900">
          Performance Insights
        </CardTitle>
        <p className="text-sm text-green-700 mt-0.5">
          Recommendations based on your attendance record
        </p>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Excellent Performance */}
          {excellentSubjects.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-100 flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-green-900 mb-1.5">Excellent Performance</h4>
                  <p className="text-sm text-green-800 mb-2.5 leading-relaxed">
                    Outstanding attendance record (90%+) in the following subjects:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {excellentSubjects.map((subject, index) => (
                      <Badge key={index} className="bg-green-100 text-green-900 border-green-200">
                        {subject.subject} • {subject.percentage.toFixed(1)}%
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          {warningSubjects.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-100 flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-900 mb-1.5">Action Required</h4>
                  <p className="text-sm text-red-800 mb-2.5 leading-relaxed">
                    Attendance below 75% threshold. Immediate improvement needed:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {warningSubjects.map((subject, index) => (
                      <Badge key={index} className="bg-red-100 text-red-900 border-red-200">
                        {subject.subject} • {subject.percentage.toFixed(1)}%
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Overall Trend */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-100 flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-green-900 mb-1.5">Overall Progress</h4>
                <p className="text-sm text-green-800 leading-relaxed">
                  Your overall attendance is <strong>{studentData.overallAttendance}%</strong>, 
                  showing a positive trend with <strong>+2.3%</strong> improvement from last month. 
                  Keep maintaining this momentum!
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}