import { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  BookOpen, 
  Users, 
  Edit, 
  Trash2,
  Eye,
  FileText,
  Download,
  Search,
  Video,
  File,
  Upload,
  Link as LinkIcon,
  PlayCircle,
  ExternalLink
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

// Helper functions for localStorage
const getLectures = () => {
  const stored = localStorage.getItem('teacher_lectures');
  return stored ? JSON.parse(stored) : [];
};

const saveLectures = (lectures) => {
  localStorage.setItem('teacher_lectures', JSON.stringify(lectures));
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

export default function Lectures() {
  const [lectures, setLectures] = useState([]);
  const [filteredLectures, setFilteredLectures] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
    uploadDate: '',
    lectureType: 'file', // 'file' or 'video'
    videoUrl: '',
    fileName: ''
  });

  useEffect(() => {
    // Load lectures from localStorage
    const loadedLectures = getLectures();
    setLectures(loadedLectures);
    setFilteredLectures(loadedLectures);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Filter lectures based on class and search term
    let filtered = lectures;

    if (selectedClass !== 'all') {
      filtered = filtered.filter(lecture => lecture.classId === selectedClass);
    }

    if (searchTerm) {
      filtered = filtered.filter(lecture => 
        lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecture.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLectures(filtered);
  }, [lectures, selectedClass, searchTerm]);

  const handleCreateLecture = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.classId) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.lectureType === 'video' && !formData.videoUrl) {
      toast.error('Please provide a video URL');
      return;
    }

    if (formData.lectureType === 'file' && !formData.fileName) {
      toast.error('Please provide a file name');
      return;
    }

    const selectedClassData = formData.classId === 'all' 
      ? { name: 'All Classes', subject: 'Multiple Subjects' }
      : teacherClasses.find(cls => cls.id === formData.classId);

    const newLecture = {
      id: generateId(),
      title: formData.title,
      description: formData.description,
      classId: formData.classId,
      className: selectedClassData.name,
      subject: selectedClassData.subject,
      uploadDate: formData.uploadDate || new Date().toISOString().split('T')[0],
      lectureType: formData.lectureType,
      videoUrl: formData.videoUrl,
      fileName: formData.fileName,
      uploadedBy: 'Prof. Sarah Ahmed'
    };

    const updatedLectures = [...lectures, newLecture];
    setLectures(updatedLectures);
    saveLectures(updatedLectures);

    // Reset form
    setFormData({
      title: '',
      description: '',
      classId: '',
      uploadDate: '',
      lectureType: 'file',
      videoUrl: '',
      fileName: ''
    });

    setShowCreateDialog(false);
    toast.success('Lecture uploaded successfully!');
  };

  const handleDeleteLecture = (lectureId) => {
    const updatedLectures = lectures.filter(lecture => lecture.id !== lectureId);
    setLectures(updatedLectures);
    saveLectures(updatedLectures);
    toast.success('Lecture deleted successfully!');
  };

  const handleViewLecture = (lecture) => {
    setSelectedLecture(lecture);
    setShowViewDialog(true);
  };

  const getClassOptions = () => {
    return [
      { id: 'all', name: 'All Classes', subject: 'All Subjects' },
      ...teacherClasses
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BookOpen className="w-8 h-8 mx-auto mb-4 animate-pulse" style={{ color: COLLEGE_COLORS.lightGreen }} />
          <p>Loading lectures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
            Lecture Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Upload lecture files and share video links with students
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button 
              className="flex items-center gap-2"
              style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
            >
              <Plus className="w-4 h-4" />
              Upload Lecture
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Lecture</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateLecture} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Lecture Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter lecture title"
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

              <div className="space-y-2">
                <Label htmlFor="lectureType">Lecture Type *</Label>
                <Select 
                  value={formData.lectureType} 
                  onValueChange={(value) => setFormData({...formData, lectureType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="file">
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4" />
                        File Upload
                      </div>
                    </SelectItem>
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Video URL
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.lectureType === 'file' ? (
                <div className="space-y-2">
                  <Label htmlFor="fileName">File Name *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="fileName"
                      value={formData.fileName}
                      onChange={(e) => setFormData({...formData, fileName: e.target.value})}
                      placeholder="e.g., lecture_01.pdf"
                      required
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      className="whitespace-nowrap"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Browse
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Supported formats: PDF, PPT, PPTX, DOC, DOCX (Max: 50MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Video URL *</Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                    required={formData.lectureType === 'video'}
                  />
                  <p className="text-xs text-gray-500">
                    YouTube, Vimeo, or any video link
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="uploadDate">Upload Date</Label>
                <Input
                  id="uploadDate"
                  type="date"
                  value={formData.uploadDate}
                  onChange={(e) => setFormData({...formData, uploadDate: e.target.value})}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of the lecture content"
                  rows={3}
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
                  Upload Lecture
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Lectures</p>
                <p className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
                  {lectures.length}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">File Uploads</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {lectures.filter(l => l.lectureType === 'file').length}
                </p>
              </div>
              <File className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Video Links</p>
                <p className="text-2xl font-semibold text-purple-600">
                  {lectures.filter(l => l.lectureType === 'video').length}
                </p>
              </div>
              <Video className="w-8 h-8 text-purple-400" />
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
              placeholder="Search lectures..." 
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
      </div>

      {/* Lectures List */}
      <div className="space-y-4">
        {filteredLectures.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {lectures.length === 0 ? 'No lectures yet' : 'No lectures match your filters'}
              </h3>
              <p className="text-gray-600 mb-4">
                {lectures.length === 0 
                  ? 'Upload your first lecture to get started.' 
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {lectures.length === 0 && (
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
                >
                  Upload First Lecture
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredLectures.map((lecture) => {
            return (
              <Card key={lecture.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-3">
                        <div 
                          className="p-3 rounded-lg"
                          style={{ 
                            backgroundColor: lecture.lectureType === 'video' ? '#EDE7F6' : '#E3F2FD' 
                          }}
                        >
                          {lecture.lectureType === 'video' ? (
                            <Video className="w-6 h-6 text-purple-600" />
                          ) : (
                            <File className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {lecture.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {lecture.className} • {lecture.subject}
                          </p>
                          {lecture.description && (
                            <p className="text-sm text-gray-700 mb-2">
                              {lecture.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Uploaded: {formatDate(lecture.uploadDate)}</span>
                            </div>
                            {lecture.lectureType === 'file' && lecture.fileName && (
                              <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                <span>{lecture.fileName}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {lecture.lectureType === 'video' && lecture.videoUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(lecture.videoUrl, '_blank')}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Watch
                        </Button>
                      )}
                      {lecture.lectureType === 'file' && (
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewLecture(lecture)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteLecture(lecture.id)}
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

      {/* View Lecture Dialog */}
      {selectedLecture && (
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Lecture Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div 
                  className="p-4 rounded-lg"
                  style={{ 
                    backgroundColor: selectedLecture.lectureType === 'video' ? '#EDE7F6' : '#E3F2FD' 
                  }}
                >
                  {selectedLecture.lectureType === 'video' ? (
                    <Video className="w-8 h-8 text-purple-600" />
                  ) : (
                    <File className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedLecture.title}
                  </h2>
                  <Badge className="bg-green-100 text-green-800">
                    {selectedLecture.lectureType === 'video' ? 'Video Link' : 'File Upload'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Class</p>
                  <p className="font-medium">{selectedLecture.className}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Subject</p>
                  <p className="font-medium">{selectedLecture.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Upload Date</p>
                  <p className="font-medium">{formatDate(selectedLecture.uploadDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Uploaded By</p>
                  <p className="font-medium">{selectedLecture.uploadedBy}</p>
                </div>
              </div>

              {selectedLecture.description && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                    {selectedLecture.description}
                  </p>
                </div>
              )}

              {selectedLecture.lectureType === 'file' && selectedLecture.fileName && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">File</p>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{selectedLecture.fileName}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              )}

              {selectedLecture.lectureType === 'video' && selectedLecture.videoUrl && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Video URL</p>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <LinkIcon className="w-4 h-4 text-purple-600" />
                    <a 
                      href={selectedLecture.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline flex-1 truncate"
                    >
                      {selectedLecture.videoUrl}
                    </a>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(selectedLecture.videoUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowViewDialog(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}