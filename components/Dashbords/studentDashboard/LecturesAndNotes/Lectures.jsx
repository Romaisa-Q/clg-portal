import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  User, 
  Search,
  PlayCircle,
  File,
  Eye,
  X,
  ExternalLink,
  Folder,
  Grid,
  List
} from 'lucide-react';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { COLLEGE_COLORS } from '../../../constants/colors.js';

// API Base
const API_BASE = 'http://localhost:5000/api/lectures';

// Static Student Data
const studentData = {
  name: 'Ahmed Ali',
  rollNo: 'CS2021001',
  semester: 8,
  department: 'Computer Science',
  section: 'A',
  classId: 'bscs-8a'
};

// Format helpers
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

// View Mode Toggle Component
function ViewModeToggle({ viewMode, setViewMode }) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('grid')}
        style={viewMode === 'grid' ? { backgroundColor: COLLEGE_COLORS.darkGreen } : {}}
      >
        <Grid className="w-4 h-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('list')}
        style={viewMode === 'list' ? { backgroundColor: COLLEGE_COLORS.darkGreen } : {}}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
}

// Lecture Card Component (Grid/List View)
function LectureCard({ lecture, onClick, onAction }) {
  const isVideo = lecture.lectureType === 'video';
  
  return (
    <Card 
      className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ 
              backgroundColor: isVideo ? '#DBEAFE' : '#D1FAE5',
              color: isVideo ? '#2563EB' : COLLEGE_COLORS.lightGreen
            }}
          >
            {isVideo ? <Video className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
              {lecture.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Badge variant="secondary" style={{ backgroundColor: '#F0FDF4', color: COLLEGE_COLORS.darkGreen }}>
                {lecture.subject}
              </Badge>
              <span className="capitalize">
                {isVideo ? lecture.duration : lecture.fileSize}
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {lecture.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{lecture.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatTimeAgo(lecture.uploadDate)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1">
            {isVideo ? (
              <>
                <Eye className="w-3 h-3" />
                {lecture.views} views
              </>
            ) : (
              <>
                <Download className="w-3 h-3" />
                {lecture.downloads} downloads
              </>
            )}
          </span>

          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAction(lecture);
            }}
            style={{ backgroundColor: isVideo ? COLLEGE_COLORS.darkGreen : COLLEGE_COLORS.lightGreen }}
          >
            {isVideo ? (
              <>
                <PlayCircle className="w-3 h-3 mr-1" />
                Play
              </>
            ) : (
              <>
                <Download className="w-3 h-3 mr-1" />
                Download
              </>
            )}
          </Button>
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
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {hasFilters ? 'No resources match your filters' : 'No resources available yet'}
        </h3>
        <p className="text-gray-600 mb-4">
          {hasFilters ? 'Try adjusting your filters' : 'Check back later for lectures and notes'}
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

// Lecture Detail Dialog Component
function LectureDetailDialog({ lecture, open, onClose, onAction }) {
  if (!lecture) return null;

  const isVideo = lecture.lectureType === 'video';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Resource Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ 
                backgroundColor: isVideo ? '#DBEAFE' : '#D1FAE5',
                color: isVideo ? '#2563EB' : COLLEGE_COLORS.lightGreen
              }}
            >
              {isVideo ? <Video className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {lecture.title}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" style={{ backgroundColor: '#F0FDF4', color: COLLEGE_COLORS.darkGreen }}>
                  {lecture.subject}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {isVideo ? 'Video Lecture' : 'PDF Notes'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200" />

          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {lecture.description}
            </p>
          </div>

          <div className="border-t border-gray-200" />

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Uploaded By</h4>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                  style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
                >
                  {lecture.author.split(' ').map(n => n[0]).join('')}
                </div>
                <p className="text-sm text-gray-600">{lecture.author}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Uploaded On</h4>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">{formatDate(lecture.uploadDate)}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                {isVideo ? 'Duration' : 'File Size'}
              </h4>
              <div className="flex items-center gap-2">
                {isVideo ? <Clock className="w-4 h-4 text-gray-400" /> : <File className="w-4 h-4 text-gray-400" />}
                <p className="text-sm text-gray-600">
                  {isVideo ? lecture.duration : lecture.fileName}  {/* Adjust if needed */}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                {isVideo ? 'Total Views' : 'Total Downloads'}
              </h4>
              <div className="flex items-center gap-2">
                {isVideo ? <Eye className="w-4 h-4 text-gray-400" /> : <Download className="w-4 h-4 text-gray-400" />}
                <p className="text-sm text-gray-600">
                  {isVideo ? `${lecture.views} views` : `${lecture.downloads} downloads`}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200" />

          {/* Action Button */}
          <Button
            className="w-full"
            onClick={() => onAction(lecture)}
            style={{ backgroundColor: isVideo ? COLLEGE_COLORS.darkGreen : COLLEGE_COLORS.lightGreen }}
          >
            {isVideo ? (
              <>
                <PlayCircle className="w-5 h-5 mr-2" />
                Play Video
                <ExternalLink className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============ MAIN COMPONENT ============

export default function StudentLecturesNotes() {
  const [lectures, setLectures] = useState([]);
  const [filteredLectures, setFilteredLectures] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Load from backend
  const loadLectures = async () => {
    try {
      const response = await axios.get(API_BASE);
      const studentLectures = response.data.filter(l => l.classId === studentData.classId || l.classId === 'all');
      setLectures(studentLectures);
    } catch (error) {
      console.error('Failed to load lectures:', error);
    }
  };

  useEffect(() => {
    loadLectures();
  }, []);

  // Filter lectures
  useEffect(() => {
    let filtered = lectures;

    if (searchTerm) {
      filtered = filtered.filter(l =>
        l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(l => l.lectureType === typeFilter);
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(l => l.subject === subjectFilter);
    }

    filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    setFilteredLectures(filtered);
  }, [lectures, searchTerm, typeFilter, subjectFilter]);

  // Get unique subjects
  const subjects = [...new Set(lectures.map(l => l.subject))];

  // Handle view lecture
  const handleViewLecture = (lecture) => {
    setSelectedLecture(lecture);
    setShowViewDialog(true);
  };

  // Handle download or play
 const handleAction = async (lecture) => {
  if (lecture.lectureType === 'video') {
    window.open(lecture.videoUrl, '_blank');
  } else {
    // Real download
    window.location.href = `http://localhost:5000/api/lectures/download/${lecture._id}`;
  }
};

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setSubjectFilter('all');
  };

  // Stats
  const stats = {
    total: lectures.length,
    videos: lectures.filter(l => l.lectureType === 'video').length,
    notes: lectures.filter(l => l.lectureType === 'file').length,
    subjects: subjects.length
  };

  const hasFilters = searchTerm || typeFilter !== 'all' || subjectFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
            Lectures & Notes
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Access course materials for {studentData.department} - Semester {studentData.semester}
          </p>
        </div>

        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Resources" 
          value={stats.total} 
          icon={BookOpen} 
          color={COLLEGE_COLORS.darkGreen} 
        />
        <StatsCard 
          title="Video Lectures" 
          value={stats.videos} 
          icon={Video} 
          color="#2563EB" 
        />
        <StatsCard 
          title="Notes/PDFs" 
          value={stats.notes} 
          icon={FileText} 
          color={COLLEGE_COLORS.lightGreen} 
        />
        <StatsCard 
          title="Subjects" 
          value={stats.subjects} 
          icon={Folder} 
          color="#9333EA" 
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search lectures, notes, or subjects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="video">Video Lectures</SelectItem>
            <SelectItem value="file">Notes/PDFs</SelectItem>
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

      {/* Lectures List/Grid */}
      {filteredLectures.length === 0 ? (
        <EmptyState hasFilters={hasFilters} onClearFilters={clearFilters} />
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {filteredLectures.map((lecture) => (
            <LectureCard
              key={lecture._id}  // Use _id from Mongo
              lecture={lecture}
              onClick={() => handleViewLecture(lecture)}
              onAction={handleAction}
            />
          ))}
        </div>
      )}

      {/* View Dialog */}
      <LectureDetailDialog
        lecture={selectedLecture}
        open={showViewDialog}
        onClose={() => setShowViewDialog(false)}
        onAction={handleAction}
      />
    </div>
  );
}