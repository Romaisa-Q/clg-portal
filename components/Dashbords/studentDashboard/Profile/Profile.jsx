import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Award,
  Edit,
  Camera,
  Save,
  X,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  Building,
  Users,
  Hash,
  MapPinned
} from 'lucide-react';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { COLLEGE_COLORS } from '../../../constants/colors.js';

// Static Student Data
const studentData = {
  // Personal Info
  name: 'Ahmed Ali',
  rollNo: 'CS2021001',
  email: 'ahmed.ali@student.edu.pk',
  phone: '+92 300 1234567',
  cnic: '12345-6789012-3',
  dateOfBirth: '2003-05-15',
  bloodGroup: 'B+',
  gender: 'Male',
  
  // Address
  address: {
    street: 'House # 123, Street 5',
    city: 'Abbottabad',
    province: 'Khyber Pakhtunkhwa',
    postalCode: '22010'
  },
  
  // Academic Info
  department: 'Computer Science',
  program: 'BS Computer Science',
  semester: 8,
  section: 'A',
  classId: 'bscs-8a',
  batch: '2021-2025',
  enrollmentDate: '2021-09-01',
  cgpa: 3.65,
  totalCredits: 120,
  completedCredits: 105,
  
  // Guardian Info
  guardian: {
    name: 'Muhammad Ali',
    relation: 'Father',
    phone: '+92 300 9876543',
    email: 'muhammad.ali@email.com',
    occupation: 'Business'
  },
  
  // Academic Performance
  semesterResults: [
    { semester: 1, sgpa: 3.45, status: 'Completed' },
    { semester: 2, sgpa: 3.52, status: 'Completed' },
    { semester: 3, sgpa: 3.68, status: 'Completed' },
    { semester: 4, sgpa: 3.71, status: 'Completed' },
    { semester: 5, sgpa: 3.80, status: 'Completed' },
    { semester: 6, sgpa: 3.55, status: 'Completed' },
    { semester: 7, sgpa: 3.62, status: 'Completed' },
    { semester: 8, sgpa: null, status: 'In Progress' }
  ],
  
  // Attendance
  attendance: {
    total: 95,
    present: 88,
    absent: 7,
    percentage: 92.6
  }
};

// ============ HELPER FUNCTIONS ============

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

const getAttendanceColor = (percentage) => {
  if (percentage >= 85) return '#10b981';
  if (percentage >= 75) return '#f59e0b';
  return '#ef4444';
};

// ============ REUSABLE COMPONENTS ============

// Profile Header Component
function ProfileHeader({ student, onEditPhoto }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Picture */}
          <div className="relative">
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center text-white text-3xl font-medium shadow-md"
              style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}
            >
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <button
              onClick={onEditPhoto}
              className="absolute bottom-2 right-2 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all border border-gray-200"
              style={{ color: COLLEGE_COLORS.darkGreen }}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Basic Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-medium text-gray-900 mb-2">
              {student.name}
            </h1>
            <p className="text-base text-gray-600 mb-4">{student.program}</p>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
              <Badge variant="secondary" className="text-sm font-normal bg-gray-100 text-gray-700">
                <Hash className="w-3 h-3 mr-1" />
                {student.rollNo}
              </Badge>
              <Badge variant="secondary" className="text-sm font-normal bg-gray-100 text-gray-700">
                <BookOpen className="w-3 h-3 mr-1" />
                Semester {student.semester}
              </Badge>
              <Badge variant="secondary" className="text-sm font-normal bg-gray-100 text-gray-700">
                <Users className="w-3 h-3 mr-1" />
                Section {student.section}
              </Badge>
              <Badge 
                className="text-sm font-normal"
                style={{ backgroundColor: '#f0fdf4', color: COLLEGE_COLORS.darkGreen }}
              >
                <Award className="w-3 h-3 mr-1" />
                CGPA: {student.cgpa}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{student.phone}</span>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{student.address.city}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Info Card Component
function InfoCard({ title, icon: Icon, children }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
          <div className="p-2 rounded-lg bg-gray-50">
            <Icon className="w-4 h-4 text-gray-600" />
          </div>
          <h3 className="text-base font-medium text-gray-900">
            {title}
          </h3>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

// Info Row Component
function InfoRow({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      {Icon && (
        <div className="mt-0.5">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm text-gray-900">{value || 'N/A'}</p>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="p-5 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-600">{title}</p>
        <div className="p-2 rounded-lg" style={{ backgroundColor: color + '15' }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-medium text-gray-900 mb-1">
        {value}
      </p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}

// Semester Result Row Component
function SemesterResultRow({ semester, sgpa, status }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-medium shadow-sm"
          style={{ backgroundColor: status === 'Completed' ? '#10b981' : '#f59e0b' }}
        >
          {semester}
        </div>
        <div>
          <p className="text-sm text-gray-900">Semester {semester}</p>
          <p className="text-xs text-gray-500">{status}</p>
        </div>
      </div>
      <div className="text-right">
        {sgpa ? (
          <>
            <p className="text-lg font-medium text-gray-900">
              {sgpa}
            </p>
            <p className="text-xs text-gray-500">SGPA</p>
          </>
        ) : (
          <Badge variant="outline" className="text-xs font-normal">
            <Clock className="w-3 h-3 mr-1" />
            Ongoing
          </Badge>
        )}
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============

export default function StudentProfile() {
  const [student] = useState(studentData);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editField, setEditField] = useState('');

  const handleEditPhoto = () => {
    alert('Photo upload feature\n\nIn production, this would open file picker to upload new photo.');
  };

  const handleEditField = (field) => {
    setEditField(field);
    setShowEditDialog(true);
  };

  const progressPercentage = (student.completedCredits / student.totalCredits) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">
            Student Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage your profile information
          </p>
        </div>
      </div>

      {/* Profile Header */}
      <ProfileHeader student={student} onEditPhoto={handleEditPhoto} />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Current CGPA"
          value={student.cgpa}
          subtitle="Out of 4.0"
          icon={Award}
          color="#10b981"
        />
        <StatsCard
          title="Credits Completed"
          value={`${student.completedCredits}/${student.totalCredits}`}
          subtitle={`${progressPercentage.toFixed(0)}% Progress`}
          icon={BookOpen}
          color="#3b82f6"
        />
        <StatsCard
          title="Attendance"
          value={`${student.attendance.percentage}%`}
          subtitle={`${student.attendance.present}/${student.attendance.total} classes`}
          icon={CheckCircle}
          color={getAttendanceColor(student.attendance.percentage)}
        />
        <StatsCard
          title="Current Semester"
          value={student.semester}
          subtitle={student.batch}
          icon={GraduationCap}
          color="#8b5cf6"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <InfoCard title="Personal Information" icon={User}>
          <div className="space-y-0">
            <InfoRow label="Full Name" value={student.name} icon={User} />
            <InfoRow label="Roll Number" value={student.rollNo} icon={Hash} />
            <InfoRow label="Email Address" value={student.email} icon={Mail} />
            <InfoRow label="Phone Number" value={student.phone} icon={Phone} />
            <InfoRow label="CNIC" value={student.cnic} icon={FileText} />
            <InfoRow label="Date of Birth" value={formatDate(student.dateOfBirth)} icon={Calendar} />
            <InfoRow label="Blood Group" value={student.bloodGroup} icon={Award} />
            <InfoRow label="Gender" value={student.gender} icon={User} />
          </div>
        </InfoCard>

        {/* Academic Information */}
        <InfoCard title="Academic Information" icon={GraduationCap}>
          <div className="space-y-0">
            <InfoRow label="Program" value={student.program} icon={BookOpen} />
            <InfoRow label="Department" value={student.department} icon={Building} />
            <InfoRow label="Batch" value={student.batch} icon={Calendar} />
            <InfoRow label="Current Semester" value={`Semester ${student.semester}`} icon={BookOpen} />
            <InfoRow label="Section" value={`Section ${student.section}`} icon={Users} />
            <InfoRow label="Enrollment Date" value={formatDate(student.enrollmentDate)} icon={Calendar} />
            <InfoRow label="CGPA" value={student.cgpa.toString()} icon={Award} />
            <InfoRow label="Credits" value={`${student.completedCredits}/${student.totalCredits}`} icon={FileText} />
          </div>
        </InfoCard>

        {/* Address Information */}
        <InfoCard title="Address Information" icon={MapPin}>
          <div className="space-y-0">
            <InfoRow label="Street Address" value={student.address.street} icon={MapPinned} />
            <InfoRow label="City" value={student.address.city} icon={MapPin} />
            <InfoRow label="Province" value={student.address.province} icon={MapPin} />
            <InfoRow label="Postal Code" value={student.address.postalCode} icon={Hash} />
          </div>
        </InfoCard>

        {/* Guardian Information */}
        <InfoCard title="Guardian Information" icon={Users}>
          <div className="space-y-0">
            <InfoRow label="Guardian Name" value={student.guardian.name} icon={User} />
            <InfoRow label="Relation" value={student.guardian.relation} icon={Users} />
            <InfoRow label="Phone Number" value={student.guardian.phone} icon={Phone} />
            <InfoRow label="Email Address" value={student.guardian.email} icon={Mail} />
            <InfoRow label="Occupation" value={student.guardian.occupation} icon={Building} />
          </div>
        </InfoCard>
      </div>

      {/* Academic Performance */}
      <InfoCard title="Academic Performance" icon={Award}>
        <div className="space-y-1">
          {student.semesterResults.map((result) => (
            <SemesterResultRow
              key={result.semester}
              semester={result.semester}
              sgpa={result.sgpa}
              status={result.status}
            />
          ))}
        </div>
        
        <div className="mt-6 p-5 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Overall CGPA</p>
              <p className="text-3xl font-medium text-gray-900">{student.cgpa}</p>
            </div>
            <div className="p-3 rounded-lg bg-white shadow-sm">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="w-full bg-white rounded-full h-2 shadow-inner">
            <div
              className="h-2 rounded-full transition-all"
              style={{ 
                width: `${(student.cgpa / 4.0) * 100}%`,
                backgroundColor: '#3b82f6'
              }}
            />
          </div>
        </div>
      </InfoCard>

      {/* Attendance Details */}
      <InfoCard title="Attendance Overview" icon={CheckCircle}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
            <p className="text-3xl font-medium text-gray-900">{student.attendance.total}</p>
            <p className="text-sm text-gray-600 mt-1">Total Classes</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
            <p className="text-3xl font-medium text-green-600">
              {student.attendance.present}
            </p>
            <p className="text-sm text-gray-600 mt-1">Present</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-red-50 to-rose-50 border border-red-200">
            <p className="text-3xl font-medium text-red-600">{student.attendance.absent}</p>
            <p className="text-sm text-gray-600 mt-1">Absent</p>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Attendance Percentage</p>
              <p className="text-3xl font-medium text-gray-900">{student.attendance.percentage}%</p>
            </div>
            <div className="p-3 rounded-lg bg-white shadow-sm">
              <CheckCircle className="w-6 h-6" style={{ color: getAttendanceColor(student.attendance.percentage) }} />
            </div>
          </div>
          <div className="w-full bg-white rounded-full h-2 shadow-inner mb-3">
            <div
              className="h-2 rounded-full transition-all"
              style={{ 
                width: `${student.attendance.percentage}%`,
                backgroundColor: getAttendanceColor(student.attendance.percentage)
              }}
            />
          </div>
          <p className="text-xs text-gray-600">
            {student.attendance.percentage >= 85 
              ? '✓ Excellent attendance! Keep it up!' 
              : student.attendance.percentage >= 75
              ? '⚠ Warning: Attendance is below 85%'
              : '❌ Critical: Attendance is below 75%'}
          </p>
        </div>
      </InfoCard>

      {/* Edit Dialog (Placeholder) */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Profile editing feature will be available soon. Contact administration for any changes.
            </p>
            <Button
              className="w-full"
              onClick={() => setShowEditDialog(false)}
              style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}