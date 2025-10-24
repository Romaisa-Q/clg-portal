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
  Megaphone,
  AlertTriangle,
  Info,
  CheckCircle,
  Search,
  Filter,
  ChevronDown
} from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "../../../ui/dialog";
import { COLLEGE_COLORS } from '../../../constants/colors.js';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Input } from '../../../ui/input';
import { Textarea } from '../../../ui/textarea';
import { Label } from '../../../ui/label';
import { toast } from 'sonner';

// Backend API base URL
const API_BASE = 'http://localhost:5000/api/announcements';

// Mock data for teacher's classes
const teacherClasses = [
  { id: 'cs_3a', name: 'Computer Science 3A', subject: 'Database Systems', students: 30 },
  { id: 'cs_3b', name: 'Computer Science 3B', subject: 'Computer Networks', students: 28 },
  { id: 'cs_4a', name: 'Computer Science 4A', subject: 'Software Engineering', students: 25 },
  { id: 'se_2a', name: 'Software Engineering 2A', subject: 'Data Structures', students: 32 },
  { id: 'it_3a', name: 'Information Technology 3A', subject: 'Web Development', students: 27 },
  { id: 'bscs-8a', name: 'BSCS-8A', subject: 'Final Year Project', students: 42 },
];

// Priority options
const priorityOptions = [
  { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800', icon: Info },
  { value: 'important', label: 'Important', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
];

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

// Format time helper
const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get priority info
const getPriorityInfo = (priority) => {
  return priorityOptions.find(p => p.value === priority) || priorityOptions[0];
};

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedClass, setSelectedClass] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    classId: '',
    priority: 'normal',
    type: 'general'
  });

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    title: '',
    message: '',
    classId: '',
    priority: 'normal',
    type: 'general'
  });

  // Map backend response to frontend format
  const mapAnnouncementFromBackend = (item) => {
    const classData = item.classId === 'all' 
      ? { name: 'All Classes', subject: 'All Subjects', students: teacherClasses.reduce((total, cls) => total + cls.students, 0) }
      : teacherClasses.find(cls => cls.id === item.classId) || { name: item.className || 'Unknown', subject: 'Unknown', students: item.totalStudents || 0 };

    return {
      id: item._id,
      title: item.title || 'Untitled',
      message: item.content || item.message || '',
      classId: item.classId || 'all',
      className: classData.name,
      subject: classData.subject,
      priority: item.priority || 'normal',
      type: item.type || 'general',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      createdBy: item.author || 'Teacher',
      totalStudents: classData.students,
      views: item.readBy ? item.readBy.length : 0,
      readBy: item.readBy || []
    };
  };

  // Load announcements from backend
  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE, {
        headers: { 'Cache-Control': 'no-cache' },
        params: { _t: Date.now() }
      });
      
      console.log('✅ Loaded announcements:', response.data);
      const mapped = response.data.map(mapAnnouncementFromBackend);
      setAnnouncements(mapped);
      setFilteredAnnouncements(mapped);
    } catch (error) {
      console.error('❌ Failed to load announcements:', error);
      toast.error('Failed to load announcements from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  useEffect(() => {
    // Filter announcements based on class, priority, and search term
    let filtered = announcements;

    // Filter by class
    if (selectedClass !== 'all') {
      filtered = filtered.filter(announcement => announcement.classId === selectedClass);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(announcement => announcement.priority === priorityFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(announcement => 
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredAnnouncements(filtered);
  }, [announcements, selectedClass, priorityFilter, searchTerm]);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.message || !formData.classId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedClassData = formData.classId === 'all' 
      ? { name: 'All Classes', subject: 'All Subjects', students: teacherClasses.reduce((total, cls) => total + cls.students, 0) }
      : teacherClasses.find(cls => cls.id === formData.classId);

    try {
      // Prepare data for backend
      const announcementData = {
        title: formData.title,
        content: formData.message,
        author: 'Prof. Sarah Ahmed', // Replace with actual logged-in teacher name
        priority: formData.priority,
        type: formData.type,
        classId: formData.classId,
        className: selectedClassData.name,
        totalStudents: selectedClassData.students
      };

      console.log('📤 Creating announcement:', announcementData);
      const response = await axios.post(API_BASE, announcementData);
      console.log('✅ Created announcement:', response.data);

      // Reload announcements from server
      await loadAnnouncements();

      // Reset form
      setFormData({
        title: '',
        message: '',
        classId: '',
        priority: 'normal',
        type: 'general'
      });

      setShowCreateDialog(false);
      toast.success('Announcement created successfully!');
    } catch (error) {
      console.error('❌ Failed to create announcement:', error);
      toast.error('Failed to create announcement. Please try again.');
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      console.log('🗑️ Deleting announcement:', announcementId);
      await axios.delete(`${API_BASE}/${announcementId}`);
      console.log('✅ Deleted announcement');

      // Reload announcements from server
      await loadAnnouncements();
      toast.success('Announcement deleted successfully!');
    } catch (error) {
      console.error('❌ Failed to delete announcement:', error);
      toast.error('Failed to delete announcement. Please try again.');
    }
  };

  const handleViewAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowViewDialog(true);
  };

  const handleEditAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    setEditFormData({
      title: announcement.title,
      message: announcement.message,
      classId: announcement.classId,
      priority: announcement.priority,
      type: announcement.type
    });
    setShowEditDialog(true);
  };

  const handleUpdateAnnouncement = async (e) => {
    e.preventDefault();
    
    if (!editFormData.title || !editFormData.message || !editFormData.classId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedClassData = editFormData.classId === 'all' 
      ? { name: 'All Classes', subject: 'All Subjects', students: teacherClasses.reduce((total, cls) => total + cls.students, 0) }
      : teacherClasses.find(cls => cls.id === editFormData.classId);

    try {
      // Prepare update data
      const updateData = {
        title: editFormData.title,
        content: editFormData.message,
        priority: editFormData.priority,
        type: editFormData.type,
        classId: editFormData.classId,
        className: selectedClassData.name,
        totalStudents: selectedClassData.students
      };

      console.log('📝 Updating announcement:', selectedAnnouncement.id, updateData);
      const response = await axios.patch(`${API_BASE}/${selectedAnnouncement.id}`, updateData);
      console.log('✅ Updated announcement:', response.data);

      // Reload announcements from server
      await loadAnnouncements();

      // Reset form
      setEditFormData({
        title: '',
        message: '',
        classId: '',
        priority: 'normal',
        type: 'general'
      });

      setShowEditDialog(false);
      toast.success('Announcement updated successfully!');
    } catch (error) {
      console.error('❌ Failed to update announcement:', error);
      toast.error('Failed to update announcement. Please try again.');
    }
  };

  const getClassOptions = () => {
    return [
      { id: 'all', name: 'All Classes', subject: 'All Subjects' },
      ...teacherClasses
    ];
  };

  const getPriorityStats = () => {
    const normal = announcements.filter(a => a.priority === 'normal').length;
    const important = announcements.filter(a => a.priority === 'important').length;
    const urgent = announcements.filter(a => a.priority === 'urgent').length;

    return { normal, important, urgent };
  };

  const stats = getPriorityStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Megaphone className="w-8 h-8 mx-auto mb-4 animate-pulse" style={{ color: COLLEGE_COLORS.lightGreen }} />
          <p>Loading announcements...</p>
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
            Announcements
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Create and manage announcements for your classes
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button 
              className="flex items-center gap-2 text-amber-50"
              style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
            >
              <Plus className="w-4 h-4" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Announcement Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter announcement title"
                    required
                    className="border border-gray-300 rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Select Class *</Label>
                  <Select
                    value={formData.classId}
                    onValueChange={(value) => setFormData({ ...formData, classId: value })}
                    required
                  >
                    <SelectTrigger className="border border-gray-300 rounded-md">
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
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger className="border border-gray-300 rounded-md">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((priority) => {
                        const IconComponent = priority.icon;
                        return (
                          <SelectItem key={priority.value} value={priority.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4" />
                              <span>{priority.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Announcement Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="border border-gray-300 rounded-md">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="quiz">Quiz/Test</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="schedule">Schedule Change</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="holiday">Holiday/Break</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Enter your announcement message..."
                  rows={4}
                  required
                  className="border border-gray-300 rounded-md"
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
                  className="text-amber-50"
                >
                  Create Announcement
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* View Announcement Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>View Announcement</DialogTitle>
          </DialogHeader>
          {selectedAnnouncement && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedAnnouncement.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityInfo(selectedAnnouncement.priority).color}>
                    {(() => {
                      const IconComponent = getPriorityInfo(selectedAnnouncement.priority).icon;
                      return <IconComponent className="w-3 h-3 mr-1" />;
                    })()}
                    {getPriorityInfo(selectedAnnouncement.priority).label}
                  </Badge>
                  <Badge variant="outline">{selectedAnnouncement.type}</Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Message</Label>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{selectedAnnouncement.message}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Class</Label>
                    <p className="text-sm text-gray-600">{selectedAnnouncement.className}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Students Reached</Label>
                    <p className="text-sm text-gray-600">{selectedAnnouncement.totalStudents}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-4 border-t">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Created: {formatDateTime(selectedAnnouncement.createdAt)}</span>
                  </div>
                  {selectedAnnouncement.updatedAt && (
                    <div className="flex items-center gap-1">
                      <Edit className="w-4 h-4" />
                      <span>Updated: {formatDateTime(selectedAnnouncement.updatedAt)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{selectedAnnouncement.views} views</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Announcement Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateAnnouncement} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Announcement Title *</Label>
                <Input
                  id="edit-title"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                  placeholder="Enter announcement title"
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
                <Label htmlFor="edit-priority">Priority Level</Label>
                <Select 
                  value={editFormData.priority} 
                  onValueChange={(value) => setEditFormData({...editFormData, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map(priority => {
                      const IconComponent = priority.icon;
                      return (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" />
                            <span>{priority.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-type">Announcement Type</Label>
                <Select 
                  value={editFormData.type} 
                  onValueChange={(value) => setEditFormData({...editFormData, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="quiz">Quiz/Test</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="schedule">Schedule Change</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="holiday">Holiday/Break</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-message">Message *</Label>
              <Textarea
                id="edit-message"
                value={editFormData.message}
                onChange={(e) => setEditFormData({...editFormData, message: e.target.value})}
                placeholder="Enter your announcement message..."
                rows={4}
                required
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
                Update Announcement
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Announcements</p>
                <p className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
                  {announcements.length}
                </p>
              </div>
              <Megaphone className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Normal</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {stats.normal}
                </p>
              </div>
              <Info className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Important</p>
                <p className="text-2xl font-semibold text-yellow-600">
                  {stats.important}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgent</p>
                <p className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.redAccent }}>
                  {stats.urgent}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8" style={{ color: COLLEGE_COLORS.redAccent }} />
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
              placeholder="Search announcements..." 
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

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-48 border-2 border-gray-200">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="important">Important</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Megaphone className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {announcements.length === 0 ? 'No announcements yet' : 'No announcements match your filters'}
              </h3>
              <p className="text-gray-600 mb-4">
                {announcements.length === 0 
                  ? 'Create your first announcement to get started.' 
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {announcements.length === 0 && (
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
                  className="text-amber-50"
                >
                  Create First Announcement
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredAnnouncements.map((announcement) => {
            const priorityInfo = getPriorityInfo(announcement.priority);
            const IconComponent = priorityInfo.icon;
            
            return (
              <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${COLLEGE_COLORS.lightGreen}20` }}
                        >
                          <Megaphone className="w-5 h-5" style={{ color: COLLEGE_COLORS.lightGreen }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                            <Badge className={priorityInfo.color}>
                              <IconComponent className="w-3 h-3 mr-1" />
                              {priorityInfo.label}
                            </Badge>
                            <Badge variant="outline">{announcement.type}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{announcement.message}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{announcement.className}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Created: {formatDate(announcement.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{announcement.totalStudents} students</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{announcement.views} views</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewAnnouncement(announcement)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditAnnouncement(announcement)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
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