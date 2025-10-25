import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  Search,
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Eye,
  X,
  Filter,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { COLLEGE_COLORS } from '../../../constants/colors.js';

// Static Student Data
const studentData = {
  name: 'Ahmed Ali',
  rollNo: 'CS2021001',
  semester: 8,
  department: 'Computer Science',
  section: 'A',
  classId: 'bscs-8a'
};

// Static Assignments Data
const assignmentsData = [
  {
    id: 1,
    title: 'Data Structures - Binary Trees Implementation',
    subject: 'Data Structures',
    description: 'Implement Binary Search Tree with insert, delete, and search operations. Include proper documentation and test cases.',
    assignedBy: 'Dr. Muhammad Hassan',
    assignedAt: '2025-10-15T10:00:00',
    dueDate: '2025-10-28T23:59:59',
    totalMarks: 20,
    classId: 'bscs-8a',
    className: 'BSCS-8A',
    status: 'pending', // pending, submitted, graded
    submittedAt: null,
    obtainedMarks: null,
    feedback: null
  },
  {
    id: 2,
    title: 'Database Design Project',
    subject: 'Database Systems',
    description: 'Design a complete database system for a library management system. Include ER diagrams, normalization, and SQL queries.',
    assignedBy: 'Dr. Fatima Khan',
    assignedAt: '2025-10-18T09:00:00',
    dueDate: '2025-10-26T23:59:59',
    totalMarks: 25,
    classId: 'bscs-8a',
    className: 'BSCS-8A',
    status: 'pending',
    submittedAt: null,
    obtainedMarks: null,
    feedback: null
  },
  {
    id: 3,
    title: 'OOP - Inheritance and Polymorphism',
    subject: 'OOP',
    description: 'Create a Java project demonstrating inheritance and polymorphism concepts with real-world examples.',
    assignedBy: 'Dr. Ali Raza',
    assignedAt: '2025-10-12T14:00:00',
    dueDate: '2025-10-30T23:59:59',
    totalMarks: 15,
    classId: 'bscs-8a',
    className: 'BSCS-8A',
    status: 'submitted',
    submittedAt: '2025-10-20T18:30:00',
    obtainedMarks: null,
    feedback: null
  },
  {
    id: 4,
    title: 'Software Requirements Document',
    subject: 'Software Engineering',
    description: 'Prepare a complete Software Requirements Specification (SRS) document for an e-commerce system.',
    assignedBy: 'Dr. Sarah Ahmed',
    assignedAt: '2025-10-10T11:00:00',
    dueDate: '2025-10-27T23:59:59',
    totalMarks: 30,
    classId: 'bscs-8a',
    className: 'BSCS-8A',
    status: 'pending',
    submittedAt: null,
    obtainedMarks: null,
    feedback: null
  },
  {
    id: 5,
    title: 'Network Protocols Analysis',
    subject: 'Computer Networks',
    description: 'Analyze TCP/IP protocol suite and create a detailed report with Wireshark packet captures.',
    assignedBy: 'Dr. Imran Malik',
    assignedAt: '2025-10-08T10:00:00',
    dueDate: '2025-11-05T23:59:59',
    totalMarks: 20,
    classId: 'bscs-8a',
    className: 'BSCS-8A',
    status: 'pending',
    submittedAt: null,
    obtainedMarks: null,
    feedback: null
  },
  {
    id: 6,
    title: 'Algorithm Complexity Assignment',
    subject: 'Algorithms',
    description: 'Solve 10 algorithmic problems with time and space complexity analysis.',
    assignedBy: 'Dr. Ayesha Siddiqui',
    assignedAt: '2025-09-28T09:00:00',
    dueDate: '2025-10-22T23:59:59',
    totalMarks: 15,
    classId: 'bscs-8a',
    className: 'BSCS-8A',
    status: 'graded',
    submittedAt: '2025-10-18T20:15:00',
    obtainedMarks: 13,
    feedback: 'Good work! However, you need to improve your time complexity analysis for problem 7.'
  },
  {
    id: 7,
    title: 'React Web Application',
    subject: 'Web Development',
    description: 'Build a complete CRUD application using React, including state management and API integration.',
    assignedBy: 'Dr. Zainab Ali',
    assignedAt: '2025-10-05T13:00:00',
    dueDate: '2025-11-10T23:59:59',
    totalMarks: 35,
    classId: 'bscs-8a',
    className: 'BSCS-8A',
    status: 'pending',
    submittedAt: null,
    obtainedMarks: null,
    feedback: null
  },
  {
    id: 8,
    title: 'Machine Learning Model Training',
    subject: 'Machine Learning',
    description: 'Train a machine learning model on the given dataset and prepare a comprehensive report.',
    assignedBy: 'Dr. Kamran Shah',
    assignedAt: '2025-09-25T10:30:00',
    dueDate: '2025-10-20T23:59:59',
    totalMarks: 25,
    classId: 'bscs-8a',
    className: 'BSCS-8A',
    status: 'graded',
    submittedAt: '2025-10-19T22:45:00',
    obtainedMarks: 22,
    feedback: 'Excellent work! Your model performance was impressive. Keep it up!'
  }
];

// ============ HELPER FUNCTIONS ============

const formatTimeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks === 1) return '1 week ago';
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const getDaysUntilDue = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffInMs = due - now;
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays;
};

const getStatusInfo = (status) => {
  const statuses = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    graded: { label: 'Graded', color: 'bg-green-100 text-green-800', icon: CheckCircle }
  };
  return statuses[status] || statuses.pending;
};

const getUrgencyInfo = (daysUntilDue, status) => {
  if (status !== 'pending') return null;
  
  if (daysUntilDue < 0) {
    return { label: 'Overdue', color: 'bg-red-100 text-red-800', icon: XCircle, borderColor: COLLEGE_COLORS.redAccent };
  } else if (daysUntilDue <= 2) {
    return { label: 'Due Soon', color: 'bg-red-100 text-red-800', icon: AlertTriangle, borderColor: COLLEGE_COLORS.redAccent };
  } else if (daysUntilDue <= 5) {
    return { label: 'Upcoming', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, borderColor: '#F59E0B' };
  }
  return null;
};

// ============ REUSABLE COMPONENTS ============

// Stats Card Component
function StatsCard({ title, value, icon: Icon, color }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-semibold" style={{ color }}>
              {value}
            </p>
          </div>
          <Icon className="w-8 h-8" style={{ color: color + '66' }} />
        </div>
      </CardContent>
    </Card>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;
  
  return (
    <Badge className={statusInfo.color}>
      <StatusIcon className="w-3 h-3 mr-1" />
      {statusInfo.label}
    </Badge>
  );
}

// Urgency Badge Component
function UrgencyBadge({ daysUntilDue, status }) {
  const urgencyInfo = getUrgencyInfo(daysUntilDue, status);
  
  if (!urgencyInfo) return null;
  
  const UrgencyIcon = urgencyInfo.icon;
  
  return (
    <Badge className={urgencyInfo.color}>
      <UrgencyIcon className="w-3 h-3 mr-1" />
      {urgencyInfo.label}
    </Badge>
  );
}

// Assignment Card Component
function AssignmentCard({ assignment, onClick, onUpload }) {
  const daysUntilDue = getDaysUntilDue(assignment.dueDate);
  const urgencyInfo = getUrgencyInfo(daysUntilDue, assignment.status);
  const canSubmit = assignment.status === 'pending' && daysUntilDue >= 0;

  return (
    <Card 
      className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex gap-4">
          {urgencyInfo && (
            <div className="w-1 rounded-full flex-shrink-0" style={{ backgroundColor: urgencyInfo.borderColor }} />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-2">{assignment.title}</h3>

                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <StatusBadge status={assignment.status} />
                  <UrgencyBadge daysUntilDue={daysUntilDue} status={assignment.status} />
                  <Badge variant="secondary">{assignment.subject}</Badge>
                  <Badge variant="outline">{assignment.totalMarks} Marks</Badge>
                </div>
              </div>

              <Button variant="ghost" size="sm" className="flex-shrink-0">
                <Eye className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{assignment.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{assignment.assignedBy}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Due: {formatDate(assignment.dueDate)}</span>
                </div>
              </div>

              {canSubmit && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpload(assignment);
                  }}
                  style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Submit
                </Button>
              )}

              {assignment.status === 'graded' && (
                <div className="text-sm font-semibold" style={{ color: COLLEGE_COLORS.lightGreen }}>
                  {assignment.obtainedMarks}/{assignment.totalMarks}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty State Component
function EmptyState({ hasFilters, onClearFilters }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-12 text-center">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {hasFilters ? 'No assignments match your filters' : 'No assignments available'}
        </h3>
        <p className="text-gray-600 mb-4">
          {hasFilters ? 'Try adjusting your filters' : 'Check back later for new assignments'}
        </p>
        {hasFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Assignment Detail Dialog Component
function AssignmentDetailDialog({ assignment, open, onClose, onUpload }) {
  if (!assignment) return null;

  const daysUntilDue = getDaysUntilDue(assignment.dueDate);
  const canSubmit = assignment.status === 'pending' && daysUntilDue >= 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assignment Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{assignment.title}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={assignment.status} />
              <UrgencyBadge daysUntilDue={daysUntilDue} status={assignment.status} />
              <Badge variant="secondary">{assignment.subject}</Badge>
              <Badge variant="outline">{assignment.totalMarks} Marks</Badge>
            </div>
          </div>

          <div className="border-t border-gray-200" />

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {assignment.description}
            </p>
          </div>

          <div className="border-t border-gray-200" />

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Assigned By</h3>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                  style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
                >
                  {assignment.assignedBy.split(' ').map(n => n[0]).join('')}
                </div>
                <p className="text-sm text-gray-600">{assignment.assignedBy}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Assigned On</h3>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">{formatDate(assignment.assignedAt)}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Due Date</h3>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">{formatDate(assignment.dueDate)}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Total Marks</h3>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">{assignment.totalMarks} marks</p>
              </div>
            </div>

            {assignment.submittedAt && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Submitted On</h3>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <p className="text-sm text-gray-600">{formatDate(assignment.submittedAt)}</p>
                </div>
              </div>
            )}

            {assignment.status === 'graded' && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Obtained Marks</h3>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <p className="text-sm font-semibold" style={{ color: COLLEGE_COLORS.lightGreen }}>
                    {assignment.obtainedMarks}/{assignment.totalMarks}
                  </p>
                </div>
              </div>
            )}
          </div>

          {assignment.feedback && (
            <>
              <div className="border-t border-gray-200" />
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Teacher's Feedback</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700">{assignment.feedback}</p>
                </div>
              </div>
            </>
          )}

          {canSubmit && (
            <>
              <div className="border-t border-gray-200" />
              <Button
                className="w-full"
                onClick={() => onUpload(assignment)}
                style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}
              >
                <Upload className="w-5 h-5 mr-2" />
                Submit Assignment
              </Button>
            </>
          )}

          {!canSubmit && assignment.status === 'pending' && daysUntilDue < 0 && (
            <>
              <div className="border-t border-gray-200" />
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-sm text-red-700 font-medium">
                  Submission deadline has passed
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============ MAIN COMPONENT ============

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  // Load static data on mount
  useEffect(() => {
    const studentAssignments = assignmentsData.filter(a => a.classId === studentData.classId);
    setAssignments(studentAssignments);
  }, []);

  // Filter assignments
  useEffect(() => {
    let filtered = assignments;

    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(a => a.subject === subjectFilter);
    }

    filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    setFilteredAssignments(filtered);
  }, [assignments, searchTerm, statusFilter, subjectFilter]);

  // Get unique subjects
  const subjects = [...new Set(assignments.map(a => a.subject))];

  // Handle view assignment
  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowViewDialog(true);
  };

  // Handle upload
  const handleUpload = (assignment) => {
    alert(`Upload assignment: ${assignment.title}\n\nIn production, this would open a file picker dialog.`);
    // In real implementation, this would open file picker and handle upload
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSubjectFilter('all');
  };

  // Calculate stats
  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    submitted: assignments.filter(a => a.status === 'submitted').length,
    graded: assignments.filter(a => a.status === 'graded').length,
    dueSoon: assignments.filter(a => {
      const days = getDaysUntilDue(a.dueDate);
      return a.status === 'pending' && days >= 0 && days <= 5;
    }).length
  };

  const hasFilters = searchTerm || statusFilter !== 'all' || subjectFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
            Assignments
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            View and submit assignments for {studentData.department} - Semester {studentData.semester}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard 
          title="Total Assignments" 
          value={stats.total} 
          icon={FileText} 
          color={COLLEGE_COLORS.darkGreen} 
        />
        <StatsCard 
          title="Pending" 
          value={stats.pending} 
          icon={Clock} 
          color="#F59E0B" 
        />
        <StatsCard 
          title="Submitted" 
          value={stats.submitted} 
          icon={CheckCircle} 
          color="#3B82F6" 
        />
        <StatsCard 
          title="Graded" 
          value={stats.graded} 
          icon={CheckCircle} 
          color={COLLEGE_COLORS.lightGreen} 
        />
        <StatsCard 
          title="Due Soon" 
          value={stats.dueSoon} 
          icon={AlertTriangle} 
          color={COLLEGE_COLORS.redAccent} 
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search assignments..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="graded">Graded</SelectItem>
          </SelectContent>
        </Select>

        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map(subject => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onClearFilters={clearFilters} />
        ) : (
          filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onClick={() => handleViewAssignment(assignment)}
              onUpload={handleUpload}
            />
          ))
        )}
      </div>

      {/* View Dialog */}
      <AssignmentDetailDialog
        assignment={selectedAssignment}
        open={showViewDialog}
        onClose={() => setShowViewDialog(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}