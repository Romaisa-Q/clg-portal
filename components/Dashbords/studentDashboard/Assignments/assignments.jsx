import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
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
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { COLLEGE_COLORS } from '../../../constants/colors.js';
import { toast } from 'sonner';

// API Base
const API_BASE = 'http://localhost:5000/api/assignments';

// Static Student Data
const studentData = {
  name: 'Ahmed Ali',
  rollNo: 'CS2021001',
  semester: 8,
  department: 'Computer Science',
  section: 'A',
  classId: 'bscs-8a'
};

// Helper functions
const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
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
  if (!dateStr) return '';
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

const getStatusInfo = (assignment) => {
  const submission = assignment.submissions?.find(s => s.studentId === studentData.rollNo);
  
  if (submission) {
    if (submission.status === 'graded') {
      return { label: 'Graded', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    }
    return { label: 'Submitted', color: 'bg-blue-100 text-blue-800', icon: CheckCircle };
  }
  
  return { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
};

const getUrgencyInfo = (daysUntilDue, assignment) => {
  const submission = assignment.submissions?.find(s => s.studentId === studentData.rollNo);
  if (submission) return null;
  
  if (daysUntilDue < 0) {
    return { label: 'Overdue', color: 'bg-red-100 text-red-800', icon: XCircle, borderColor: COLLEGE_COLORS.redAccent };
  } else if (daysUntilDue <= 2) {
    return { label: 'Due Soon', color: 'bg-red-100 text-red-800', icon: AlertTriangle, borderColor: COLLEGE_COLORS.redAccent };
  } else if (daysUntilDue <= 5) {
    return { label: 'Upcoming', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, borderColor: '#F59E0B' };
  }
  return null;
};

// Components
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

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  // Load assignments
  const loadAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/student`, {
        params: { classId: studentData.classId }
      });
      console.log('✅ Loaded student assignments:', response.data);
      setAssignments(response.data);
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

  // Filter assignments
  useEffect(() => {
    let filtered = assignments;

    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => {
        const status = getStatusInfo(a);
        return status.label.toLowerCase() === statusFilter;
      });
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(a => a.subject === subjectFilter);
    }

    filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    setFilteredAssignments(filtered);
  }, [assignments, searchTerm, statusFilter, subjectFilter]);

  // Get unique subjects
  const subjects = [...new Set(assignments.map(a => a.subject).filter(Boolean))];

  // Handle file select
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  // Handle upload
  const handleUpload = (assignment) => {
    setSelectedAssignment(assignment);
    setShowUploadDialog(true);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submit assignment
  const handleSubmitAssignment = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('assignmentId', selectedAssignment._id);
    formData.append('studentId', studentData.rollNo);
    formData.append('studentName', studentData.name);
    formData.append('rollNo', studentData.rollNo);

    try {
      console.log('📤 Submitting assignment...');
      await axios.post(`${API_BASE}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Assignment submitted successfully!');
      setShowUploadDialog(false);
      setSelectedFile(null);
      await loadAssignments();
    } catch (error) {
      console.error('❌ Submission failed:', error);
      toast.error(error.response?.data?.message || 'Failed to submit assignment');
    }
  };

  // Handle view assignment
  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowViewDialog(true);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSubjectFilter('all');
  };

  // Calculate stats
  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => !a.submissions?.some(s => s.studentId === studentData.rollNo)).length,
    submitted: assignments.filter(a => {
      const sub = a.submissions?.find(s => s.studentId === studentData.rollNo);
      return sub && sub.status === 'submitted';
    }).length,
    graded: assignments.filter(a => {
      const sub = a.submissions?.find(s => s.studentId === studentData.rollNo);
      return sub && sub.status === 'graded';
    }).length,
    dueSoon: assignments.filter(a => {
      const days = getDaysUntilDue(a.dueDate);
      const hasSubmission = a.submissions?.some(s => s.studentId === studentData.rollNo);
      return !hasSubmission && days >= 0 && days <= 5;
    }).length
  };

  const hasFilters = searchTerm || statusFilter !== 'all' || subjectFilter !== 'all';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="w-8 h-8 mx-auto mb-4 animate-pulse" style={{ color: COLLEGE_COLORS.darkGreen }} />
          <p>Loading assignments...</p>
        </div>
      </div>
    );
  }

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
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredAssignments.map((assignment) => {
            const daysUntilDue = getDaysUntilDue(assignment.dueDate);
            const statusInfo = getStatusInfo(assignment);
            const urgencyInfo = getUrgencyInfo(daysUntilDue, assignment);
            const submission = assignment.submissions?.find(s => s.studentId === studentData.rollNo);
            const canSubmit = !submission && daysUntilDue >= 0;
            const StatusIcon = statusInfo.icon;

            return (
              <Card 
                key={assignment._id}
                className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleViewAssignment(assignment)}
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
                            <Badge className={statusInfo.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                            {urgencyInfo && (
                              <Badge className={urgencyInfo.color}>
                                <urgencyInfo.icon className="w-3 h-3 mr-1" />
                                {urgencyInfo.label}
                              </Badge>
                            )}
                            {assignment.subject && <Badge variant="secondary">{assignment.subject}</Badge>}
                            <Badge variant="outline">{assignment.maxMarks} Marks</Badge>
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
                            <span>{assignment.author}</span>
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
                              handleUpload(assignment);
                            }}
                            style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            Submit
                          </Button>
                        )}

                        {submission && submission.status === 'graded' && (
                          <div className="text-sm font-semibold" style={{ color: COLLEGE_COLORS.lightGreen }}>
                            {submission.obtainedMarks}/{assignment.maxMarks}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assignment Details</DialogTitle>
          </DialogHeader>
          {selectedAssignment && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{selectedAssignment.title}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  {(() => {
                    const statusInfo = getStatusInfo(selectedAssignment);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    );
                  })()}
                  {(() => {
                    const daysUntilDue = getDaysUntilDue(selectedAssignment.dueDate);
                    const urgencyInfo = getUrgencyInfo(daysUntilDue, selectedAssignment);
                    if (!urgencyInfo) return null;
                    const UrgencyIcon = urgencyInfo.icon;
                    return (
                      <Badge className={urgencyInfo.color}>
                        <UrgencyIcon className="w-3 h-3 mr-1" />
                        {urgencyInfo.label}
                      </Badge>
                    );
                  })()}
                  {selectedAssignment.subject && <Badge variant="secondary">{selectedAssignment.subject}</Badge>}
                </div>
              </div>

              <div className="border-t border-gray-200" />

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {selectedAssignment.description || 'No description provided.'}
                </p>
              </div>

              {selectedAssignment.instructions && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Instructions</h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {selectedAssignment.instructions}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-200" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Assigned By</h3>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                      style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
                    >
                      {selectedAssignment.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <p className="text-sm text-gray-600">{selectedAssignment.author}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Due Date</h3>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{formatDate(selectedAssignment.dueDate)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Total Marks</h3>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{selectedAssignment.maxMarks} marks</p>
                  </div>
                </div>

                {(() => {
                  const submission = selectedAssignment.submissions?.find(s => s.studentId === studentData.rollNo);
                  if (!submission) return null;

                  return (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-1">Submitted On</h3>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <p className="text-sm text-gray-600">{formatDate(submission.submittedAt)}</p>
                        </div>
                      </div>

                      {submission.status === 'graded' && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-1">Obtained Marks</h3>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <p className="text-sm font-semibold" style={{ color: COLLEGE_COLORS.lightGreen }}>
                              {submission.obtainedMarks}/{selectedAssignment.maxMarks}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {(() => {
                const submission = selectedAssignment.submissions?.find(s => s.studentId === studentData.rollNo);
                if (!submission || !submission.feedback) return null;

                return (
                  <>
                    <div className="border-t border-gray-200" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Teacher's Feedback</h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{submission.feedback}</p>
                      </div>
                    </div>
                  </>
                );
              })()}

              {(() => {
                const daysUntilDue = getDaysUntilDue(selectedAssignment.dueDate);
                const submission = selectedAssignment.submissions?.find(s => s.studentId === studentData.rollNo);
                const canSubmit = !submission && daysUntilDue >= 0;

                if (canSubmit) {
                  return (
                    <>
                      <div className="border-t border-gray-200" />
                      <Button
                        className="w-full"
                        onClick={() => {
                          setShowViewDialog(false);
                          handleUpload(selectedAssignment);
                        }}
                        style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Submit Assignment
                      </Button>
                    </>
                  );
                }

                if (!submission && daysUntilDue < 0) {
                  return (
                    <>
                      <div className="border-t border-gray-200" />
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                        <p className="text-sm text-red-700 font-medium">
                          Submission deadline has passed
                        </p>
                      </div>
                    </>
                  );
                }

                return null;
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
          </DialogHeader>
          {selectedAssignment && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{selectedAssignment.title}</h3>
                <p className="text-sm text-gray-600">{selectedAssignment.className}</p>
              </div>

              <div className="border-t border-gray-200" />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Upload File *</label>
                <div className="flex items-center gap-2">
                  <input
                    id="assignment-file"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.zip,.rar"
                    className="hidden"
                  />
                  <div className="flex-1 flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-gray-50">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 flex-1 truncate">
                      {selectedFile ? selectedFile.name : 'No file selected'}
                    </span>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Browse
                  </Button>
                </div>
                {selectedFile && (
                  <p className="text-xs text-green-600">
                    ✓ File selected: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Supported formats: PDF, DOC, DOCX, ZIP, RAR (Max: 10MB)
                </p>
              </div>

              <div className="border-t border-gray-200" />

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowUploadDialog(false);
                    setSelectedFile(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}
                  onClick={handleSubmitAssignment}
                  disabled={!selectedFile}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}