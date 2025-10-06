
import { useState, useEffect } from 'react';
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
import { COLLEGE_COLORS } from '../../constants/colors.js';
import { scheduleData } from '../../constants/scheduleData.js';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { toast } from 'sonner';

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
          students: Math.floor(Math.random() * 20) + 25 // Random student count
        }));
      }
    });
  });

  return Array.from(classes).map(classStr => JSON.parse(classStr));
};

const teacherClasses = getTeacherClasses();

// Helper functions for localStorage
const getAssignments = () => {
  const stored = localStorage.getItem('teacher_assignments');
  return stored ? JSON.parse(stored) : [];
};

const saveAssignments = (assignments) => {
  localStorage.setItem('teacher_assignments', JSON.stringify(assignments));
};

const getSubmissions = () => {
  const stored = localStorage.getItem('assignment_submissions');
  return stored ? JSON.parse(stored) : [];
};

const saveSubmissions = (submissions) => {
  localStorage.setItem('assignment_submissions', JSON.stringify(submissions));
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Format date helper
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Get status based on due date
const getAssignmentStatus = (dueDate, createdDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  
  if (now > due) {
    return { label: 'Overdue', color: 'bg-red-100 text-red-800' };
  } else if (due.getTime() - now.getTime() <= 24 * 60 * 60 * 1000) { // 1 day
    return { label: 'Due Soon', color: 'bg-yellow-100 text-yellow-800' };
  } else {
    return { label: 'Active', color: 'bg-green-100 text-green-800' };
  }
};

// Sample submission data
const generateSampleSubmissions = (assignmentId, classId) => {
  const classData = teacherClasses.find(cls => cls.id === classId);
  if (!classData) return [];

  const studentNames = [
    'Ahmed Khan', 'Fatima Ali', 'Hassan Ahmed', 'Ayesha Malik', 'Ali Hassan',
    'Sara Ahmad', 'Omar Sheikh', 'Zainab Khan', 'Bilal Ahmed', 'Mariam Ali',
    'Hamza Sheikh', 'Noor Fatima', 'Usman Khan', 'Hira Ahmed', 'Faisal Ali'
  ];

  const submissions = [];
  const totalStudents = classData.students;
  const submissionRate = Math.random() * 0.7 + 0.3; // 30-100% submission rate
  const numSubmissions = Math.floor(totalStudents * submissionRate);

  for (let i = 0; i < numSubmissions; i++) {
    const studentName = studentNames[i % studentNames.length];
    const rollNo = `${classData.name.split(' ')[0].toUpperCase()}-2021-${String(i + 1).padStart(3, '0')}`;
    
    submissions.push({
      id: generateId(),
      assignmentId,
      studentName: `${studentName} ${i + 1}`,
      rollNo,
      className: classData.name,
      submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      fileName: `assignment_${rollNo}.pdf`,
      fileSize: `${Math.floor(Math.random() * 5 + 1)} MB`,
      status: 'submitted'
    });
  }

  // Add non-submitted students
  for (let i = numSubmissions; i < totalStudents; i++) {
    const studentName = studentNames[i % studentNames.length];
    const rollNo = `${classData.name.split(' ')[0].toUpperCase()}-2021-${String(i + 1).padStart(3, '0')}`;
    
    submissions.push({
      id: generateId(),
      assignmentId,
      studentName: `${studentName} ${i + 1}`,
      rollNo,
      className: classData.name,
      submittedAt: null,
      fileName: null,
      fileSize: null,
      status: 'not_submitted'
    });
  }

  return submissions;
};

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
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

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    classId: '',
    dueDate: '',
    maxMarks: '',
    instructions: ''
  });

  useEffect(() => {
    // Load assignments and submissions from localStorage
    const loadedAssignments = getAssignments();
    const loadedSubmissions = getSubmissions();
    
    setAssignments(loadedAssignments);
    setFilteredAssignments(loadedAssignments);
    setSubmissions(loadedSubmissions);
    setFilteredSubmissions(loadedSubmissions);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Filter assignments based on class, search term, and status
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
        const status = getAssignmentStatus(assignment.dueDate, assignment.createdDate);
        return status.label.toLowerCase().replace(' ', '') === statusFilter;
      });
    }

    setFilteredAssignments(filtered);
  }, [assignments, selectedClass, searchTerm, statusFilter]);

  useEffect(() => {
    // Filter submissions
    let filtered = submissions;

    if (submissionClass !== 'all') {
      filtered = filtered.filter(sub => {
        const assignment = assignments.find(a => a.id === sub.assignmentId);
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

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.classId || !formData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedClassData = formData.classId === 'all' 
      ? { name: 'All Classes', subject: 'Multiple Subjects' }
      : teacherClasses.find(cls => cls.id === formData.classId);

    const newAssignment = {
      id: generateId(),
      title: formData.title,
      description: formData.description,
      classId: formData.classId,
      className: selectedClassData.name,
      subject: selectedClassData.subject,
      dueDate: formData.dueDate,
      maxMarks: formData.maxMarks || 100,
      instructions: formData.instructions,
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: 'Prof. Sarah Ahmed',
      submissions: 0,
      totalStudents: formData.classId === 'all' 
        ? teacherClasses.reduce((total, cls) => total + cls.students, 0)
        : selectedClassData.students
    };

    const updatedAssignments = [...assignments, newAssignment];
    setAssignments(updatedAssignments);
    saveAssignments(updatedAssignments);

    // Generate sample submissions
    if (formData.classId !== 'all') {
      const newSubmissions = generateSampleSubmissions(newAssignment.id, formData.classId);
      const updatedSubmissions = [...submissions, ...newSubmissions];
      setSubmissions(updatedSubmissions);
      saveSubmissions(updatedSubmissions);
    }

    // Reset form
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
  };

  const handleDeleteAssignment = (assignmentId) => {
    const updatedAssignments = assignments.filter(assignment => assignment.id !== assignmentId);
    const updatedSubmissions = submissions.filter(sub => sub.assignmentId !== assignmentId);
    
    setAssignments(updatedAssignments);
    setSubmissions(updatedSubmissions);
    saveAssignments(updatedAssignments);
    saveSubmissions(updatedSubmissions);
    toast.success('Assignment deleted successfully!');
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
    const active = assignments.filter(a => getAssignmentStatus(a.dueDate, a.createdDate).label === 'Active').length;
    const dueSoon = assignments.filter(a => getAssignmentStatus(a.dueDate, a.createdDate).label === 'Due Soon').length;
    const overdue = assignments.filter(a => getAssignmentStatus(a.dueDate, a.createdDate).label === 'Overdue').length;

    return { active, dueSoon, overdue };
  };

  const getSubmissionStats = () => {
    const submitted = submissions.filter(s => s.status === 'submitted').length;
    const notSubmitted = submissions.filter(s => s.status === 'not_submitted').length;
    const total = submitted + notSubmitted;
    const submissionRate = total > 0 ? Math.round((submitted / total) * 100) : 0;

    return { submitted, notSubmitted, total, submissionRate };
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
          Assignment Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Create assignments and track student submissions
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Assignment</TabsTrigger>
          <TabsTrigger value="submissions">Assignment Submissions</TabsTrigger>
        </TabsList>

        {/* Create Assignment Tab */}
        <TabsContent value="create" className="space-y-6">
          {/* Create Assignment Header */}
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
                <form onSubmit={handleCreateAssignment} className="space-y-4">
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
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose class" />
                        </SelectTrigger>
                        <SelectContent>
                          {getClassOptions().map(cls => (
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
                      onClick={() => setShowCreateDialog(false)}
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
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Assignments</p>
                    <p className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
                      {assignments.length}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-semibold text-green-600">
                      {stats.active}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Due Soon</p>
                    <p className="text-2xl font-semibold text-yellow-600">
                      {stats.dueSoon}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Overdue</p>
                    <p className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.redAccent }}>
                      {stats.overdue}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8" style={{ color: COLLEGE_COLORS.redAccent }} />
                </div>
              </CardContent>
            </Card>
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

          {/* Assignments List */}
          <div className="space-y-4">
            {filteredAssignments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {assignments.length === 0 ? 'No assignments yet' : 'No assignments match your filters'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {assignments.length === 0 
                      ? 'Create your first assignment to get started.' 
                      : 'Try adjusting your search or filter criteria.'
                    }
                  </p>
                  {assignments.length === 0 && (
                    <Button 
                      onClick={() => setShowCreateDialog(true)}
                      style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
                    >
                      Create First Assignment
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredAssignments.map((assignment) => {
                const status = getAssignmentStatus(assignment.dueDate, assignment.createdDate);
                const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignment.id);
                const submittedCount = assignmentSubmissions.filter(s => s.status === 'submitted').length;
                const submissionRate = assignmentSubmissions.length > 0 ? Math.round((submittedCount / assignmentSubmissions.length) * 100) : 0;
                
                return (
                  <Card key={assignment.id} className="hover:shadow-md transition-shadow">
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
                              <span>{submittedCount}/{assignmentSubmissions.length} submitted ({submissionRate}%)</span>
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
                            onClick={() => handleViewAssignment(assignment)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAssignment(assignment.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-6">
          {/* Submission Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Submissions</p>
                    <p className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
                      {submissionStats.total}
                    </p>
                  </div>
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="text-2xl font-semibold text-green-600">
                      {submissionStats.submitted}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Not Submitted</p>
                    <p className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.redAccent }}>
                      {submissionStats.notSubmitted}
                    </p>
                  </div>
                  <XCircle className="w-8 h-8" style={{ color: COLLEGE_COLORS.redAccent }} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Submission Rate</p>
                    <p className="text-2xl font-semibold text-blue-600">
                      {submissionStats.submissionRate}%
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
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
                  <SelectItem key={assignment.id} value={assignment.id}>
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
                <SelectItem value="not_submitted">Not Submitted</SelectItem>
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
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Class</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Submitted At</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500">
                          No submissions found
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((submission) => {
                        const assignment = assignments.find(a => a.id === submission.assignmentId);
                        
                        return (
                          <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-900">{submission.studentName}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{submission.rollNo}</td>
                            <td className="py-3 px-4 text-sm text-gray-900">{assignment?.title || 'Unknown'}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{submission.className}</td>
                            <td className="py-3 px-4">
                              <Badge className={submission.status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {submission.status === 'submitted' ? 'Submitted' : 'Not Submitted'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {submission.submittedAt ? formatDate(submission.submittedAt) : '-'}
                            </td>
                            <td className="py-3 px-4">
                              {submission.status === 'submitted' ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewSubmission(submission)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Button>
                              ) : (
                                <span className="text-gray-400 text-sm">No submission</span>
                              )}
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

      {/* View Assignment Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>View Assignment</DialogTitle>
          </DialogHeader>
          {selectedAssignment && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedAssignment.title}</h3>
                <Badge className={getAssignmentStatus(selectedAssignment.dueDate, selectedAssignment.createdDate).color}>
                  {getAssignmentStatus(selectedAssignment.dueDate, selectedAssignment.createdDate).label}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                  <p className="text-sm text-gray-600 mt-1">{selectedAssignment.description || 'No description provided.'}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Instructions</Label>
                  <p className="text-sm text-gray-600 mt-1">{selectedAssignment.instructions || 'No instructions provided.'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Class</Label>
                    <p className="text-sm text-gray-600">{selectedAssignment.className}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Maximum Marks</Label>
                    <p className="text-sm text-gray-600">{selectedAssignment.maxMarks}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-4 border-t">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {formatDate(selectedAssignment.dueDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Created: {formatDate(selectedAssignment.createdDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Submission Dialog */}
      <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Student Name</Label>
                  <p className="text-sm text-gray-900">{selectedSubmission.studentName}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Roll Number</Label>
                  <p className="text-sm text-gray-600">{selectedSubmission.rollNo}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">File Name</Label>
                  <p className="text-sm text-gray-600">{selectedSubmission.fileName}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">File Size</Label>
                  <p className="text-sm text-gray-600">{selectedSubmission.fileSize}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Submitted At</Label>
                  <p className="text-sm text-gray-600">{formatDate(selectedSubmission.submittedAt)}</p>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button 
                  style={{ backgroundColor: COLLEGE_COLORS.lightGreen }} 
                  className="flex-1 text-white"
                >
                  Grade
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}