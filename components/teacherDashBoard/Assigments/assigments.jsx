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
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "../../ui/dialog";
import { COLLEGE_COLORS } from '../../constants/colors.js';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { toast } from 'sonner';

// Mock data for teacher's classes
const teacherClasses = [
  { id: 'cs_3a', name: 'Computer Science 3A', subject: 'Database Systems', students: 30 },
  { id: 'cs_3b', name: 'Computer Science 3B', subject: 'Computer Networks', students: 28 },
  { id: 'cs_4a', name: 'Computer Science 4A', subject: 'Software Engineering', students: 25 },
  { id: 'se_2a', name: 'Software Engineering 2A', subject: 'Data Structures', students: 32 },
  { id: 'it_3a', name: 'Information Technology 3A', subject: 'Web Development', students: 27 },
];

// Helper functions for localStorage
const getAssignments = () => {
  const stored = localStorage.getItem('teacher_assignments');
  return stored ? JSON.parse(stored) : [];
};

const saveAssignments = (assignments) => {
  localStorage.setItem('teacher_assignments', JSON.stringify(assignments));
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
  const created = new Date(createdDate);
  
  if (now > due) {
    return { label: 'Overdue', color: 'bg-red-100 text-red-800' };
  } else if (due.getTime() - now.getTime() <= 24 * 60 * 60 * 1000) { // 1 day
    return { label: 'Due Soon', color: 'bg-yellow-100 text-yellow-800' };
  } else {
    return { label: 'Active', color: 'bg-green-100 text-green-800' };
  }
};

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

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
    // Load assignments from localStorage
    const loadedAssignments = getAssignments();
    setAssignments(loadedAssignments);
    setFilteredAssignments(loadedAssignments);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Filter assignments based on class, search term, and status
    let filtered = assignments;

    // Filter by class
    if (selectedClass !== 'all') {
      filtered = filtered.filter(assignment => assignment.classId === selectedClass);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(assignment => 
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(assignment => {
        const status = getAssignmentStatus(assignment.dueDate, assignment.createdDate);
        return status.label.toLowerCase().replace(' ', '') === statusFilter;
      });
    }

    setFilteredAssignments(filtered);
  }, [assignments, selectedClass, searchTerm, statusFilter]);

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
    setAssignments(updatedAssignments);
    saveAssignments(updatedAssignments);
    toast.success('Assignment deleted successfully!');
  };

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowViewDialog(true);
  };

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setEditFormData({
      title: assignment.title,
      description: assignment.description,
      classId: assignment.classId,
      dueDate: assignment.dueDate,
      maxMarks: assignment.maxMarks,
      instructions: assignment.instructions
    });
    setShowEditDialog(true);
  };

  const handleUpdateAssignment = (e) => {
    e.preventDefault();
    
    if (!editFormData.title || !editFormData.classId || !editFormData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedClassData = editFormData.classId === 'all' 
      ? { name: 'All Classes', subject: 'Multiple Subjects' }
      : teacherClasses.find(cls => cls.id === editFormData.classId);

    const updatedAssignment = {
      id: selectedAssignment.id,
      title: editFormData.title,
      description: editFormData.description,
      classId: editFormData.classId,
      className: selectedClassData.name,
      subject: selectedClassData.subject,
      dueDate: editFormData.dueDate,
      maxMarks: editFormData.maxMarks || 100,
      instructions: editFormData.instructions,
      createdDate: selectedAssignment.createdDate,
      createdBy: 'Prof. Sarah Ahmed',
      submissions: selectedAssignment.submissions,
      totalStudents: selectedAssignment.totalStudents
    };

    const updatedAssignments = assignments.map(assignment => 
      assignment.id === selectedAssignment.id ? updatedAssignment : assignment
    );
    setAssignments(updatedAssignments);
    saveAssignments(updatedAssignments);

    // Reset form
    setEditFormData({
      title: '',
      description: '',
      classId: '',
      dueDate: '',
      maxMarks: '',
      instructions: ''
    });

    setShowEditDialog(false);
    toast.success('Assignment updated successfully!');
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

  const stats = getStatusStats();

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
            Assignment Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Create and manage assignments for your classes
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button 
              className="flex items-center gap-2 text-amber-50"
              style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
            >
              <Plus className="w-4 h-4 text-amber-50" />
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
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter assignment title"
          required
          className="border border-gray-300"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="class">Select Class *</Label>
        <Select
          value={formData.classId}
          onValueChange={(value) => setFormData({ ...formData, classId: value })}
          required
        >
          <SelectTrigger className="border border-gray-300">
            <SelectValue placeholder="Choose class" />
          </SelectTrigger>
          <SelectContent>
            {getClassOptions().map((cls) => (
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
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          min={new Date().toISOString().split("T")[0]}
          required
          className="border border-gray-300"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxMarks">Maximum Marks</Label>
        <Input
          id="maxMarks"
          type="number"
          value={formData.maxMarks}
          onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
          placeholder="100"
          min="1"
          className="border border-gray-300"
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        placeholder="Assignment description and objectives"
        rows={3}
        className="border border-gray-300"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="instructions">Instructions</Label>
      <Textarea
        id="instructions"
        value={formData.instructions}
        onChange={(e) =>
          setFormData({ ...formData, instructions: e.target.value })
        }
        placeholder="Detailed instructions for students"
        rows={4}
        className="border border-gray-300"
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
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{selectedAssignment.submissions}/{selectedAssignment.totalStudents} submitted ({Math.round((selectedAssignment.submissions / selectedAssignment.totalStudents) * 100) || 0}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Assignment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateAssignment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Assignment Title *</Label>
                  <Input
                    id="edit-title"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                    placeholder="Enter assignment title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-class">Select Class *</Label>
                  <Select 
                    value={editFormData.classId} 
                    onValueChange={(value) => setEditFormData({...editFormData, classId: value})}
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
                  <Label htmlFor="edit-dueDate">Due Date *</Label>
                  <Input
                    id="edit-dueDate"
                    type="date"
                    value={editFormData.dueDate}
                    onChange={(e) => setEditFormData({...editFormData, dueDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-maxMarks">Maximum Marks</Label>
                  <Input
                    id="edit-maxMarks"
                    type="number"
                    value={editFormData.maxMarks}
                    onChange={(e) => setEditFormData({...editFormData, maxMarks: e.target.value})}
                    placeholder="100"
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  placeholder="Assignment description and objectives"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-instructions">Instructions</Label>
                <Textarea
                  id="edit-instructions"
                  value={editFormData.instructions}
                  onChange={(e) => setEditFormData({...editFormData, instructions: e.target.value})}
                  placeholder="Detailed instructions for students"
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowEditDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
                >
                  Update Assignment
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
        <div className="flex-1 ">
          <div className="relative ">
            <Search className="absolute  left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search assignments..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-2 border-gray-200"
            />
          </div>
        </div>
        
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-full sm:w-48 border-2 border-gray-200">
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
          <SelectTrigger className="w-full sm:w-48 border-2 border-gray-200">
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
                  className="text-amber-50"
                >
                  Create First Assignment
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredAssignments.map((assignment) => {
            const status = getAssignmentStatus(assignment.dueDate, assignment.createdDate);
            const submissionRate = Math.round((assignment.submissions / assignment.totalStudents) * 100) || 0;
            
            return (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${COLLEGE_COLORS.lightGreen}20` }}
                        >
                          <FileText className="w-5 h-5" style={{ color: COLLEGE_COLORS.lightGreen }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                            <Badge className={status.color}>
                              {status.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{assignment.className}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Due: {formatDate(assignment.dueDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Created: {formatDate(assignment.createdDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{assignment.submissions}/{assignment.totalStudents} submitted ({submissionRate}%)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewAssignment(assignment)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditAssignment(assignment)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}