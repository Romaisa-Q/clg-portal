import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Calendar, 
  Clock, 
  BookOpen, 
  Users, 
  Edit, 
  Trash2,
  Eye,
  FileText,
  Download,
  Filter,
  Search,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Upload
} from 'lucide-react';
import { COLLEGE_COLORS } from '../../../constants/colors.js';
import { scheduleData } from '../../../constants/scheduleData.js';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card.jsx';
import { Button } from '../../../ui/button.jsx';
import { Badge } from '../../../ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select.jsx';
import { Input } from '../../../ui/input.jsx';
import { Textarea } from '../../../ui/textarea';
import { Label } from '../../../ui/label.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../ui/dialog.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs.jsx';
import { toast } from 'sonner';

// ==================== API Configuration ====================
const API_BASE = 'http://localhost:5000/api/assignments';

// ==================== Helper Functions ====================

// Get teacher's classes from schedule data
const getTeacherClasses = () => {
  const classes = new Set();
  
  Object.entries(scheduleData).forEach(([day, daySchedule]) => {
    Object.values(daySchedule).forEach(classItem => {
      if (classItem) {
        classes.add(JSON.stringify({
          id: classItem.class.toLowerCase().replace('-', '_'),
          name: classItem.class,
          subject: classItem.subject,
          students: Math.floor(Math.random() * 20) + 25
        }));
      }
    });
  });

  return Array.from(classes).map(classStr => JSON.parse(classStr));
};

const teacherClasses = getTeacherClasses();

// Format date helper
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Get status based on due date
const getAssignmentStatus = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  
  if (now > due) {
    return { label: 'Overdue', color: 'bg-red-100 text-red-800' };
  } else if (due.getTime() - now.getTime() <= 24 * 60 * 60 * 1000) {
    return { label: 'Due Soon', color: 'bg-yellow-100 text-yellow-800' };
  } else {
    return { label: 'Active', color: 'bg-green-100 text-green-800' };
  }
};

// ==================== Stats Card Component ====================
const StatsCard = ({ title, value, icon: Icon, color, bgColor }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold" style={{ color }}>
            {value}
          </p>
        </div>
        <Icon className="w-8 h-8" style={{ color: bgColor }} />
      </div>
    </CardContent>
  </Card>
);

// ==================== Assignment Card Component ====================
const AssignmentCard = ({ assignment, onView, onDelete }) => {
  const status = getAssignmentStatus(assignment.dueDate);
  const submittedCount = assignment.submissions ? assignment.submissions.length : 0;
  const submissionRate = assignment.totalStudents > 0 
    ? Math.round((submittedCount / assignment.totalStudents) * 100) 
    : 0;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {assignment.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {assignment.className} • {assignment.subject}
                </p>
                <Badge className={status.color}>
                  {status.label}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Due: {formatDate(assignment.dueDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{submittedCount}/{assignment.totalStudents} submitted ({submissionRate}%)</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{assignment.maxMarks} marks</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(assignment)}
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(assignment._id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ==================== Create Assignment Form Component ====================
const CreateAssignmentForm = ({ formData, setFormData, onSubmit, onCancel, teacherClasses, COLLEGE_COLORS }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Assignment Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Enter assignment title"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="class">Select Class *</Label>
          <Select 
            value={formData.classId} 
            onValueChange={(value) => setFormData({...formData, classId: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose class" />
            </SelectTrigger>
            <SelectContent>
              {/* ALL CLASSES OPTION */}
              <SelectItem value="all">
                <div className="flex flex-col">
                  <span className="font-semibold">All Classes</span>
                  <span className="text-xs text-gray-500">Assign to all classes</span>
                </div>
              </SelectItem>
              {teacherClasses.map(cls => (
                <SelectItem key={cls.id} value={cls.id}>
                  <div className="flex flex-col">
                    <span>{cls.name}</span>
                    <span className="text-xs text-gray-500">{cls.subject}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date *</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="maxMarks">Maximum Marks</Label>
          <Input
            id="maxMarks"
            type="number"
            value={formData.maxMarks}
            onChange={(e) => setFormData({...formData, maxMarks: e.target.value})}
            placeholder="100"
            min="1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Assignment description and objectives"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => setFormData({...formData, instructions: e.target.value})}
          placeholder="Detailed instructions for students"
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
        >
          Create Assignment
        </Button>
      </div>
    </form>
  );
};

// ==================== View Assignment Dialog Component ====================
const ViewAssignmentDialog = ({ assignment, open, onOpenChange }) => {
  if (!assignment) return null;

  const status = getAssignmentStatus(assignment.dueDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>View Assignment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{assignment.title}</h3>
            <Badge className={status.color}>
              {status.label}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-700">Description</Label>
              <p className="text-sm text-gray-600 mt-1">{assignment.description || 'No description provided.'}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700">Instructions</Label>
              <p className="text-sm text-gray-600 mt-1">{assignment.instructions || 'No instructions provided.'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Class</Label>
                <p className="text-sm text-gray-600">{assignment.className}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Maximum Marks</Label>
                <p className="text-sm text-gray-600">{assignment.maxMarks}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-4 border-t">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Due: {formatDate(assignment.dueDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Created: {formatDate(assignment.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ==================== View Submission Dialog Component ====================
const ViewSubmissionDialog = ({ submission, open, onOpenChange, COLLEGE_COLORS }) => {
  if (!submission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-700">Student Name</Label>
              <p className="text-sm text-gray-900">{submission.studentName}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700">Roll Number</Label>
              <p className="text-sm text-gray-600">{submission.rollNo}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700">Assignment</Label>
              <p className="text-sm text-gray-600">{submission.assignmentTitle}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700">File Name</Label>
              <p className="text-sm text-gray-600">{submission.fileName}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700">Submitted At</Label>
              <p className="text-sm text-gray-600">{formatDate(submission.submittedAt)}</p>
            </div>

            {submission.status === 'graded' && (
              <>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Obtained Marks</Label>
                  <p className="text-sm font-semibold" style={{ color: COLLEGE_COLORS.lightGreen }}>
                    {submission.obtainedMarks || 0}
                  </p>
                </div>
                {submission.feedback && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Feedback</Label>
                    <p className="text-sm text-gray-600">{submission.feedback}</p>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="flex space-x-2 pt-4">
            {submission.filePath && (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => window.open(`http://localhost:5000${submission.filePath}`, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
            {submission.status !== 'graded' && (
              <Button 
                style={{ backgroundColor: COLLEGE_COLORS.lightGreen }} 
                className="flex-1 text-white"
                onClick={() => alert('Grade functionality coming soon!')}
              >
                Grade
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ==================== Empty State Component ====================
const EmptyState = ({ hasAssignments, onCreateClick, COLLEGE_COLORS }) => (
  <Card>
    <CardContent className="p-8 text-center">
      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {!hasAssignments ? 'No assignments yet' : 'No assignments match your filters'}
      </h3>
      <p className="text-gray-600 mb-4">
        {!hasAssignments 
          ? 'Create your first assignment to get started.' 
          : 'Try adjusting your search or filter criteria.'
        }
      </p>
      {!hasAssignments && (
        <Button 
          onClick={onCreateClick}
          style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
        >
          Create First Assignment
        </Button>
      )}
    </CardContent>
  </Card>
);

// ==================== MAIN COMPONENT ====================
export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedClass, setSelectedClass] = useState('all');
  const [submissionClass, setSubmissionClass] = useState('all');
  const [submissionAssignment, setSubmissionAssignment] = useState('all');
  const [submissionStatus, setSubmissionStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('create');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
    dueDate: '',
    maxMarks: '',
    instructions: ''
  });

  // Load assignments from backend
  const loadAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE);
      console.log('✅ Loaded assignments:', response.data);
      setAssignments(response.data);
      
      // Extract all submissions from all assignments
      const allSubmissions = [];
      response.data.forEach(assignment => {
        if (assignment.submissions && assignment.submissions.length > 0) {
          assignment.submissions.forEach(sub => {
            allSubmissions.push({
              ...sub,
              assignmentId: assignment._id,
              assignmentTitle: assignment.title,
              className: assignment.className,
              id: sub._id || sub.studentId + assignment._id
            });
          });
        }
      });
      setSubmissions(allSubmissions);
    } catch (error) {
      console.error('❌ Failed to load assignments:', error);
      toast.error('Failed to load assignments');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  useEffect(() => {
    let filtered = assignments;

    if (selectedClass !== 'all') {
      filtered = filtered.filter(assignment => assignment.classId === selectedClass);
    }

    if (searchTerm) {
      filtered = filtered.filter(assignment => 
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(assignment => {
        const status = getAssignmentStatus(assignment.dueDate);
        return status.label.toLowerCase().replace(' ', '') === statusFilter;
      });
    }

    setFilteredAssignments(filtered);
  }, [assignments, selectedClass, searchTerm, statusFilter]);

  useEffect(() => {
    let filtered = submissions;

    if (submissionClass !== 'all') {
      filtered = filtered.filter(sub => {
        const assignment = assignments.find(a => a._id === sub.assignmentId);
        return assignment && assignment.classId === submissionClass;
      });
    }

    if (submissionAssignment !== 'all') {
      filtered = filtered.filter(sub => sub.assignmentId === submissionAssignment);
    }

    if (submissionStatus !== 'all') {
      filtered = filtered.filter(sub => sub.status === submissionStatus);
    }

    if (submissionSearch) {
      filtered = filtered.filter(sub => 
        sub.studentName.toLowerCase().includes(submissionSearch.toLowerCase()) ||
        sub.rollNo.toLowerCase().includes(submissionSearch.toLowerCase())
      );
    }

    setFilteredSubmissions(filtered);
  }, [submissions, submissionClass, submissionAssignment, submissionStatus, submissionSearch, assignments]);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.classId || !formData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Handle "all" class selection
    let selectedClassData;
    let totalStudents = 0;

    if (formData.classId === 'all') {
      selectedClassData = {
        id: 'all',
        name: 'All Classes',
        subject: 'General'
      };
      // Calculate total students from all classes
      totalStudents = teacherClasses.reduce((total, cls) => total + cls.students, 0);
    } else {
      selectedClassData = teacherClasses.find(cls => cls.id === formData.classId);
      totalStudents = selectedClassData.students;
    }

    try {
      const assignmentData = {
        title: formData.title,
        description: formData.description,
        instructions: formData.instructions,
        classId: formData.classId,
        className: selectedClassData.name,
        subject: selectedClassData.subject,
        dueDate: formData.dueDate,
        maxMarks: formData.maxMarks || 100,
        author: 'Prof. Sarah Ahmed',
        totalStudents: totalStudents
      };

      console.log('📤 Creating assignment:', assignmentData);
      await axios.post(API_BASE, assignmentData);
      await loadAssignments();

      setFormData({
        title: '',
        description: '',
        classId: '',
        dueDate: '',
        maxMarks: '',
        instructions: ''
      });

      setShowCreateDialog(false);
      toast.success('Assignment created successfully!');
    } catch (error) {
      console.error('❌ Failed to create assignment:', error);
      toast.error('Failed to create assignment');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      await axios.delete(`${API_BASE}/${assignmentId}`);
      await loadAssignments();
      toast.success('Assignment deleted successfully!');
    } catch (error) {
      console.error('❌ Failed to delete assignment:', error);
      toast.error('Failed to delete assignment');
    }
  };

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowViewDialog(true);
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowSubmissionDialog(true);
  };

  const getClassOptions = () => {
    return [
      { id: 'all', name: 'All Classes', subject: 'All Subjects' },
      ...teacherClasses
    ];
  };

  const getStatusStats = () => {
    const active = assignments.filter(a => getAssignmentStatus(a.dueDate).label === 'Active').length;
    const dueSoon = assignments.filter(a => getAssignmentStatus(a.dueDate).label === 'Due Soon').length;
    const overdue = assignments.filter(a => getAssignmentStatus(a.dueDate).label === 'Overdue').length;

    return { active, dueSoon, overdue };
  };

  const getSubmissionStats = () => {
    const submitted = submissions.filter(s => s.status === 'submitted').length;
    const graded = submissions.filter(s => s.status === 'graded').length;
    const total = submitted + graded;

    return { submitted, graded, total };
  };

  const stats = getStatusStats();
  const submissionStats = getSubmissionStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="w-8 h-8 mx-auto mb-4 animate-pulse" style={{ color: COLLEGE_COLORS.lightGreen }} />
          <p>Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ==================== Header ==================== */}
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
          Assignment Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Create assignments and track student submissions
        </p>
      </div>

      {/* ==================== Tabs ==================== */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Assignment</TabsTrigger>
          <TabsTrigger value="submissions">Assignment Submissions</TabsTrigger>
        </TabsList>

        {/* ==================== Create Assignment Tab ==================== */}
        <TabsContent value="create" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button 
                  className="flex items-center gap-2"
                  style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
                >
                  <Plus className="w-4 h-4" />
                  Create Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Assignment</DialogTitle>
                </DialogHeader>
                <CreateAssignmentForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleCreateAssignment}
                  onCancel={() => setShowCreateDialog(false)}
                  teacherClasses={teacherClasses}
                  COLLEGE_COLORS={COLLEGE_COLORS}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              title="Total Assignments"
              value={assignments.length}
              icon={FileText}
              color={COLLEGE_COLORS.darkGreen}
              bgColor="#9ca3af"
            />
            <StatsCard
              title="Active"
              value={stats.active}
              icon={Clock}
              color="#16a34a"
              bgColor="#86efac"
            />
            <StatsCard
              title="Due Soon"
              value={stats.dueSoon}
              icon={AlertCircle}
              color="#ca8a04"
              bgColor="#fde047"
            />
            <StatsCard
              title="Overdue"
              value={stats.overdue}
              icon={AlertCircle}
              color={COLLEGE_COLORS.redAccent}
              bgColor={COLLEGE_COLORS.redAccent}
            />
          </div>

          {/* ==================== Filters ==================== */}
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
            
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {teacherClasses.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="duesoon">Due Soon</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ==================== Assignments List ==================== */}
          <div className="space-y-4">
            {filteredAssignments.length === 0 ? (
              <EmptyState
                hasAssignments={assignments.length > 0}
                onCreateClick={() => setShowCreateDialog(true)}
                COLLEGE_COLORS={COLLEGE_COLORS}
              />
            ) : (
              filteredAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment._id}
                  assignment={assignment}
                  onView={handleViewAssignment}
                  onDelete={handleDeleteAssignment}
                />
              ))
            )}
          </div>
        </TabsContent>

        {/* ==================== Submissions Tab ==================== */}
        <TabsContent value="submissions" className="space-y-6">
          {/* Submission Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title="Total Submissions"
              value={submissionStats.total}
              icon={Upload}
              color={COLLEGE_COLORS.darkGreen}
              bgColor="#9ca3af"
            />
            <StatsCard
              title="Submitted"
              value={submissionStats.submitted}
              icon={CheckCircle}
              color="#2563eb"
              bgColor="#93c5fd"
            />
            <StatsCard
              title="Graded"
              value={submissionStats.graded}
              icon={CheckCircle}
              color="#16a34a"
              bgColor="#86efac"
            />
          </div>

          {/* Submission Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search students..." 
                value={submissionSearch}
                onChange={(e) => setSubmissionSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={submissionClass} onValueChange={setSubmissionClass}>
              <SelectTrigger>
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {teacherClasses.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={submissionAssignment} onValueChange={setSubmissionAssignment}>
              <SelectTrigger>
                <SelectValue placeholder="All Assignments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignments</SelectItem>
                {assignments.map(assignment => (
                  <SelectItem key={assignment._id} value={assignment._id}>
                    {assignment.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={submissionStatus} onValueChange={setSubmissionStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submissions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Student Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Student</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Roll No</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Assignment</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Submitted At</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          No submissions found
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((submission) => {
                        return (
                          <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-900">{submission.studentName}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{submission.rollNo}</td>
                            <td className="py-3 px-4 text-sm text-gray-900">{submission.assignmentTitle}</td>
                            <td className="py-3 px-4">
                              <Badge className={submission.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                                {submission.status === 'graded' ? 'Graded' : 'Submitted'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {formatDate(submission.submittedAt)}
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewSubmission(submission)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ==================== View Assignment Dialog ==================== */}
      <ViewAssignmentDialog
        assignment={selectedAssignment}
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
      />

      {/* ==================== View Submission Dialog ==================== */}
      <ViewSubmissionDialog
        submission={selectedSubmission}
        open={showSubmissionDialog}
        onOpenChange={setShowSubmissionDialog}
        COLLEGE_COLORS={COLLEGE_COLORS}
      />
    </div>
  );
}