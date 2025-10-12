import { CheckCircle, XCircle, Clock, User, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../ui/card';
import { Button } from '../../../../ui/button';
import { Badge } from '../../../../ui/badge';
import { Progress } from '../../../../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../ui/table';

const subjectAttendanceData = [
  { 
    subject: 'Artificial Intelligence', 
    code: 'CS-601',
    teacher: 'Dr. Sarah Ahmed',
    present: 28, 
    absent: 4, 
    total: 32,
    percentage: 87.5,
    status: 'good',
    lastClass: '2025-10-10',
    credits: 3
  },
  { 
    subject: 'Machine Learning', 
    code: 'CS-602',
    teacher: 'Prof. Hassan Khan',
    present: 24, 
    absent: 6, 
    total: 30,
    percentage: 80.0,
    status: 'good',
    lastClass: '2025-10-09',
    credits: 4
  },
  { 
    subject: 'Software Engineering-II', 
    code: 'CS-603',
    teacher: 'Dr. Fatima Noor',
    present: 30, 
    absent: 2, 
    total: 32,
    percentage: 93.75,
    status: 'excellent',
    lastClass: '2025-10-11',
    credits: 3
  },
  { 
    subject: 'Computer Networks', 
    code: 'CS-604',
    teacher: 'Prof. Ahmed Raza',
    present: 22, 
    absent: 8, 
    total: 30,
    percentage: 73.33,
    status: 'warning',
    lastClass: '2025-10-10',
    credits: 3
  },
  { 
    subject: 'Web Engineering', 
    code: 'CS-605',
    teacher: 'Dr. Ayesha Malik',
    present: 26, 
    absent: 4, 
    total: 30,
    percentage: 86.67,
    status: 'good',
    lastClass: '2025-10-12',
    credits: 3
  },
  { 
    subject: 'Data Science Lab', 
    code: 'CS-606',
    teacher: 'Lab Instructor - Ali Hamza',
    present: 14, 
    absent: 1, 
    total: 15,
    percentage: 93.33,
    status: 'excellent',
    lastClass: '2025-10-11',
    credits: 1
  }
];

const getStatusBadge = (status) => {
  const badges = {
    excellent: { label: 'Excellent', className: 'bg-green-50 text-green-700 border-green-200' },
    good: { label: 'Good', className: 'bg-green-50 text-green-700 border-green-200' },
    warning: { label: 'Low', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    danger: { label: 'Critical', className: 'bg-red-50 text-red-700 border-red-200' }
  };
  return badges[status] || badges.good;
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

export default function SubjectTable() {
  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="border-b bg-green-50 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg text-green-900">
              Subject-wise Attendance
            </CardTitle>
            <p className="text-sm text-green-700 mt-1">
              Detailed attendance record for Semester 6
            </p>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-green-50 hover:bg-green-50">
                <TableHead className="text-green-900 font-semibold">Subject Details</TableHead>
                <TableHead className="text-green-900 font-semibold">Teacher</TableHead>
                <TableHead className="text-center text-green-900 font-semibold">Present</TableHead>
                <TableHead className="text-center text-green-900 font-semibold">Absent</TableHead>
                <TableHead className="text-center text-green-900 font-semibold">Total</TableHead>
                <TableHead className="text-center text-green-900 font-semibold">Attendance</TableHead>
                <TableHead className="text-center text-green-900 font-semibold">Status</TableHead>
                <TableHead className="text-green-900 font-semibold">Last Class</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjectAttendanceData.map((subject, index) => {
                const statusBadge = getStatusBadge(subject.status);
                
                return (
                  <TableRow key={index} className="hover:bg-green-50/50 border-b border-green-100">
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <p className="font-medium text-green-900">{subject.subject}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs font-mono bg-green-100 text-green-700">
                            {subject.code}
                          </Badge>
                          <span className="text-xs text-green-600">{subject.credits} Credits</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-green-500" />
                        </div>
                        <span className="line-clamp-1">{subject.teacher}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-md">
                        <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">{subject.present}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 rounded-md">
                        <XCircle className="w-3.5 h-3.5 text-red-600" />
                        <span className="text-sm font-medium text-red-700">{subject.absent}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-normal text-green-900">{subject.total}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-lg font-normal text-green-900">
                          {subject.percentage.toFixed(1)}%
                        </span>
                        <Progress value={subject.percentage} className="w-20 h-1.5 bg-green-100" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`${statusBadge.className} border`} variant="outline">
                        {statusBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-green-600">
                        <Clock className="w-3.5 h-3.5 text-green-400" />
                        {formatDate(subject.lastClass)}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}