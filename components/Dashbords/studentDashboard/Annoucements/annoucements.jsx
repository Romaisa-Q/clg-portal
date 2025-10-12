import { useState, useEffect } from 'react';
import { 
  Bell, 
  Calendar, 
  Clock, 
  User, 
  AlertCircle,
  Info,
  AlertTriangle,
  Search,
  Filter,
  BookOpen,
  FileText,
  Megaphone,
  ChevronDown,
  Eye,
  X
} from 'lucide-react';
import { COLLEGE_COLORS } from '../../../constants/colors.js';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';

// Student data (should match StudentDashboard)
const studentData = {
  name: 'Ahmed Ali',
  rollNo: 'CS2021001',
  semester: 6,
  department: 'Computer Science',
  section: 'A',
  classId: 'cs_6a' // CS 6th semester section A
};

const getAnnouncements = () => {
  return [
    {
      id: "1",
      title: "Mid-term Exam Schedule Released",
      message:
        "The mid-term examination schedule for all courses has been released. Please check your respective subject pages for detailed timing.",
      type: "schedule",
      priority: "urgent",
      createdBy: "Academic Office",
      createdAt: "2025-10-10T08:00:00Z",
      classId: "all",
      className: "All Departments",
      totalStudents: 200,
    },
    {
      id: "2",
      title: "Library Closure Notice",
      message:
        "The central library will remain closed on December 15th for maintenance work. Online resources will remain available.",
      type: "general",
      priority: "normal",
      createdBy: "Library Staff",
      createdAt: "2025-10-09T09:00:00Z",
      classId: "all",
      className: "All Students",
      totalStudents: 150,
    },
    {
      id: "3",
      title: "New Assignment: Data Structures",
      message:
        "A new assignment on Binary Trees has been posted in the Computer Science portal. Submission deadline: December 20th.",
      type: "assignment",
      priority: "important",
      createdBy: "Prof. Ahmed Khan",
      createdAt: "2025-10-08T10:00:00Z",
      classId: "cs_6a",
      className: "CS 6A",
      totalStudents: 45,
    },
  ];
};


// Format time ago
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
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Format full date
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get priority info
const getPriorityInfo = (priority) => {
  const priorities = {
    urgent: { 
      label: 'Urgent', 
      color: 'bg-red-100 text-red-800', 
      icon: AlertTriangle,
      borderColor: COLLEGE_COLORS.redAccent 
    },
    important: { 
      label: 'Important', 
      color: 'bg-yellow-100 text-yellow-800', 
      icon: AlertTriangle,
      borderColor: '#F59E0B' 
    },
    normal: { 
      label: 'Normal', 
      color: 'bg-blue-100 text-blue-800', 
      icon: Info,
      borderColor: '#3B82F6' 
    }
  };
  return priorities[priority] || priorities.normal;
};

// Get type icon
const getTypeIcon = (type) => {
  const icons = {
    quiz: FileText,
    assignment: FileText,
    schedule: Calendar,
    event: Bell,
    holiday: Calendar,
    general: Megaphone
  };
  return icons[type] || Megaphone;
};

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load announcements from localStorage
    const loadAnnouncements = () => {
      const allAnnouncements = getAnnouncements();
      
      // Filter announcements relevant to the student
      // Show announcements that are either:
      // 1. For "all" classes
      // 2. For the student's specific class (cs_6a)
      const studentAnnouncements = allAnnouncements.filter(announcement => {
        return announcement.classId === 'all' || announcement.classId === studentData.classId;
      });

      setAnnouncements(studentAnnouncements);
      
      // Get read announcements from localStorage
      const readAnnouncements = JSON.parse(localStorage.getItem('student_read_announcements') || '[]');
      const unread = studentAnnouncements.filter(a => !readAnnouncements.includes(a.id)).length;
      setUnreadCount(unread);
    };

    loadAnnouncements();

    // Listen for storage events to sync with teacher dashboard
    const handleStorageChange = () => {
      loadAnnouncements();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also poll for updates every 5 seconds (for same-window updates)
    const interval = setInterval(loadAnnouncements, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Filter announcements based on search and filters
    let filtered = announcements;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(announcement => 
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(announcement => announcement.priority === priorityFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(announcement => announcement.type === typeFilter);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredAnnouncements(filtered);
  }, [announcements, searchTerm, priorityFilter, typeFilter]);

  const handleViewAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowViewDialog(true);

    // Mark as read
    const readAnnouncements = JSON.parse(localStorage.getItem('student_read_announcements') || '[]');
    if (!readAnnouncements.includes(announcement.id)) {
      readAnnouncements.push(announcement.id);
      localStorage.setItem('student_read_announcements', JSON.stringify(readAnnouncements));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllRead = () => {
    const allIds = announcements.map(a => a.id);
    localStorage.setItem('student_read_announcements', JSON.stringify(allIds));
    setUnreadCount(0);
  };

  const isRead = (announcementId) => {
    const readAnnouncements = JSON.parse(localStorage.getItem('student_read_announcements') || '[]');
    return readAnnouncements.includes(announcementId);
  };

  // Get stats
  const stats = {
    total: announcements.length,
    urgent: announcements.filter(a => a.priority === 'urgent').length,
    important: announcements.filter(a => a.priority === 'important').length,
    unread: unreadCount
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
            Announcements
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Stay updated with important notices for {studentData.department} - Semester {studentData.semester}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={handleMarkAllRead}
            className="flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            Mark All Read
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Announcements</p>
                <p className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
                  {stats.total}
                </p>
              </div>
              <Megaphone className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {stats.unread}
                </p>
              </div>
              <Bell className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
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

        <Card className="border-0 shadow-sm">
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
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="important">Important</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="quiz">Quiz/Test</SelectItem>
            <SelectItem value="assignment">Assignment</SelectItem>
            <SelectItem value="schedule">Schedule Change</SelectItem>
            <SelectItem value="event">Event</SelectItem>
            <SelectItem value="holiday">Holiday/Break</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <Megaphone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {announcements.length === 0 ? 'No announcements yet' : 'No announcements match your filters'}
              </h3>
              <p className="text-gray-600 mb-4">
                {announcements.length === 0 
                  ? 'Check back later for important updates and notices'
                  : 'Try adjusting your filters to see more announcements'
                }
              </p>
              {searchTerm || priorityFilter !== 'all' || typeFilter !== 'all' ? (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setPriorityFilter('all');
                    setTypeFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ) : (
          filteredAnnouncements.map((announcement) => {
            const priorityInfo = getPriorityInfo(announcement.priority);
            const TypeIcon = getTypeIcon(announcement.type);
            const PriorityIcon = priorityInfo.icon;
            const read = isRead(announcement.id);

            return (
              <Card 
                key={announcement.id} 
                className={`border-0 shadow-sm transition-all hover:shadow-md cursor-pointer ${
                  !read ? 'bg-blue-50/50' : ''
                }`}
                onClick={() => handleViewAnnouncement(announcement)}
              >
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    {/* Left border indicator */}
                    <div 
                      className="w-1 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: priorityInfo.borderColor }}
                    />

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900">
                              {announcement.title}
                            </h3>
                            {!read && (
                              <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <Badge className={priorityInfo.color}>
                              <PriorityIcon className="w-3 h-3 mr-1" />
                              {priorityInfo.label}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              <TypeIcon className="w-3 h-3 mr-1" />
                              {announcement.type}
                            </Badge>
                            {announcement.classId === 'all' ? (
                              <Badge variant="secondary">
                                All Classes
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                {announcement.className}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Button variant="ghost" size="sm" className="flex-shrink-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {announcement.message}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{announcement.createdBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(announcement.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* View Announcement Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Announcement Details</DialogTitle>
          </DialogHeader>
          {selectedAnnouncement && (
            <div className="space-y-4">
              {/* Title and badges */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {selectedAnnouncement.title}
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getPriorityInfo(selectedAnnouncement.priority).color}>
                    {(() => {
                      const PriorityIcon = getPriorityInfo(selectedAnnouncement.priority).icon;
                      return <PriorityIcon className="w-3 h-3 mr-1" />;
                    })()}
                    {getPriorityInfo(selectedAnnouncement.priority).label}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {(() => {
                      const TypeIcon = getTypeIcon(selectedAnnouncement.type);
                      return <TypeIcon className="w-3 h-3 mr-1" />;
                    })()}
                    {selectedAnnouncement.type}
                  </Badge>
                  {selectedAnnouncement.classId === 'all' ? (
                    <Badge variant="secondary">All Classes</Badge>
                  ) : (
                    <Badge variant="secondary">{selectedAnnouncement.className}</Badge>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200" />

              {/* Message */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Message</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {selectedAnnouncement.message}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200" />

              {/* Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Posted By</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                         style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}>
                      {selectedAnnouncement.createdBy.split(' ').map(n => n[0]).join('')}
                    </div>
                    <p className="text-sm text-gray-600">{selectedAnnouncement.createdBy}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Posted On</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{formatDate(selectedAnnouncement.createdAt)}</p>
                  </div>
                </div>

                {selectedAnnouncement.classId !== 'all' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Class</h3>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-600">{selectedAnnouncement.className}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Students Notified</h3>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{selectedAnnouncement.totalStudents} students</p>
                  </div>
                </div>
              </div>

              {selectedAnnouncement.updatedAt && (
                <>
                  <div className="border-t border-gray-200" />
                  <div className="text-xs text-gray-500">
                    Last updated: {formatDate(selectedAnnouncement.updatedAt)}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
