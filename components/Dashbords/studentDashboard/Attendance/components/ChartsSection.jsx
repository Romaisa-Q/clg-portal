import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../ui/select';
import { Button } from '../../../../ui/button';
import { Download, BookOpen, CheckCircle, AlertCircle, Award } from 'lucide-react';
import { useState } from 'react';

const subjectAttendanceData = [
  { subject: 'Artificial Intelligence', code: 'CS-601', present: 28, absent: 6, total: 34, percentage: 82.4 },
  { subject: 'Machine Learning', code: 'CS-602', present: 32, absent: 3, total: 35, percentage: 91.4 },
  { subject: 'Software Engineering', code: 'CS-603', present: 29, absent: 6, total: 35, percentage: 82.9 },
  { subject: 'Computer Networks', code: 'CS-604', present: 25, absent: 10, total: 35, percentage: 71.4 },
  { subject: 'Web Engineering', code: 'CS-605', present: 31, absent: 4, total: 35, percentage: 88.6 },
  { subject: 'Data Science Lab', code: 'CS-606', present: 14, absent: 1, total: 15, percentage: 93.3 }
];

const monthlyTrendData = [
  { month: 'Jan', attendance: 82 },
  { month: 'Feb', attendance: 85 },
  { month: 'Mar', attendance: 78 },
  { month: 'Apr', attendance: 88 },
  { month: 'May', attendance: 91 },
  { month: 'Jun', attendance: 87 }
];

export default function ChartsSection() {
  const [selectedMonth, setSelectedMonth] = useState('all');

  const attendanceSummary = [
    { name: 'Present', value: subjectAttendanceData.reduce((sum, s) => sum + s.present, 0), color: '#166534' },
    { name: 'Absent', value: subjectAttendanceData.reduce((sum, s) => sum + s.absent, 0), color: '#ef4444' }
  ];

  const summaryCards = [
    {
      title: 'Total Subjects',
      value: subjectAttendanceData.length,
      icon: BookOpen,
      color: 'green'
    },
    {
      title: 'Above 75%',
      value: subjectAttendanceData.filter(s => s.percentage >= 75).length,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Below 75%',
      value: subjectAttendanceData.filter(s => s.percentage < 75).length,
      icon: AlertCircle,
      color: 'red'
    },
    {
      title: 'Excellent (90%+)',
      value: subjectAttendanceData.filter(s => s.percentage >= 90).length,
      icon: Award,
      color: 'green'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-green-900">
            Attendance Analytics
          </h2>
          <p className="text-sm text-green-700 mt-1">
            Visual insights into your attendance patterns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40 border-green-200">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="current">Current Month</SelectItem>
              <SelectItem value="last">Last Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <Card key={index} className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500 uppercase tracking-wide">{card.title}</p>
                <card.icon className={`w-4 h-4 ${
                  card.color === 'green' ? 'text-green-500' : 'text-red-500'
                }`} />
              </div>
              <p className="text-xl font-bold text-green-900">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="border-b bg-green-50">
            <CardTitle className="text-lg text-green-900">
              Subject-wise Comparison
            </CardTitle>
            <p className="text-sm text-green-700 mt-0.5">Attendance percentage by subject</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectAttendanceData} margin={{ top: 10, right: 10, left: 0, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="code" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={11}
                    stroke="#64748b"
                  />
                  <YAxis domain={[0, 100]} fontSize={11} stroke="#64748b" />
                  <Tooltip 
                    formatter={(value) => [`${value.toFixed(1)}%`, 'Attendance']}
                    labelFormatter={(label) => {
                      const subject = subjectAttendanceData.find(s => s.code === label);
                      return subject?.subject || label;
                    }}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="percentage" fill="#166534" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="border-b bg-green-50">
            <CardTitle className="text-lg text-green-900">
              Overall Distribution
            </CardTitle>
            <p className="text-sm text-green-700 mt-0.5">Present vs Absent classes</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceSummary}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {attendanceSummary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row of Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Line Chart */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="border-b bg-green-50">
            <CardTitle className="text-lg text-green-900">
              Monthly Trend
            </CardTitle>
            <p className="text-sm text-green-700 mt-0.5">Attendance trend over the semester</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" fontSize={11} stroke="#64748b" />
                  <YAxis domain={[70, 100]} fontSize={11} stroke="#64748b" />
                  <Tooltip 
                    formatter={(value) => `${value}%`}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#166534"
                    strokeWidth={2.5}
                    dot={{ fill: '#14532d', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Grouped Bar Chart */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="border-b bg-green-50">
            <CardTitle className="text-lg text-green-900">
              Present vs Absent
            </CardTitle>
            <p className="text-sm text-green-700 mt-0.5">Detailed comparison by subject</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectAttendanceData} margin={{ top: 10, right: 10, left: 0, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="code" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={11}
                    stroke="#64748b"
                  />
                  <YAxis fontSize={11} stroke="#64748b" />
                  <Tooltip contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="present" fill="#166534" name="Present" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}