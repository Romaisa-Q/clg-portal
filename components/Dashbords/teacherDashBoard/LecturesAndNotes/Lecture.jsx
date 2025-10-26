import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Plus, Calendar, BookOpen, Users, Edit, Trash2, Eye, FileText, Download, Search, Video, File, Upload, Link as LinkIcon, PlayCircle, ExternalLink
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
const API_BASE = 'http://localhost:5000/api/lectures';

// ==================== Helper Functions ====================

// Get teacher's classes
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

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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

// ==================== File Input Component ====================
const FileInput = ({ selectedFile, onFileSelect, fileInputRef }) => (
  <div className="space-y-2">
    <Label htmlFor="file">Upload File *</Label>
    <div className="flex items-center gap-2">
      <input
        id="file"
        type="file"
        ref={fileInputRef}
        onChange={onFileSelect}
        accept=".pdf,.ppt,.pptx,.doc,.docx"
        className="hidden"
      />
      <div className="flex-1 flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-gray-50">
        <File className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600 flex-1 truncate">
          {selectedFile ? selectedFile.name : 'No file selected'}
        </span>
      </div>
      <Button 
        type="button" 
        variant="outline"
        className="whitespace-nowrap"
        onClick={() => {
          console.log('Browse button clicked');
          fileInputRef.current?.click();
        }}
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
      Supported formats: PDF, PPT, PPTX, DOC, DOCX (Max: 50MB)
    </p>
  </div>
);

// ==================== Video URL Input Component ====================
const VideoURLInput = ({ value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor="videoUrl">Video URL *</Label>
    <Input
      id="videoUrl"
      type="url"
      value={value}
      onChange={onChange}
      placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
    />
    <p className="text-xs text-gray-500">
      YouTube, Vimeo, or any video link
    </p>
  </div>
);

// ==================== Create Lecture Form Component ====================
const CreateLectureForm = ({ 
  formData, 
  setFormData, 
  selectedFile, 
  setSelectedFile, 
  fileInputRef, 
  teacherClasses,
  onSubmit, 
  onCancel,
  handleFileSelect 
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
            onValueChange={(value) => {
              console.log('Selected class:', value);
              setFormData({...formData, classId: value});
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose class" />
            </SelectTrigger>
            <SelectContent>
              {/* ALL CLASSES OPTION */}
              <SelectItem value="all">
                <div className="flex flex-col">
                  <span className="font-semibold">All Classes</span>
                  <span className="text-xs text-gray-500">Broadcast to all classes</span>
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

      <div className="space-y-2">
        <Label htmlFor="lectureType">Lecture Type *</Label>
        <Select 
          value={formData.lectureType} 
          onValueChange={(value) => {
            setFormData({...formData, lectureType: value});
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
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
        <FileInput 
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          fileInputRef={fileInputRef}
        />
      ) : (
        <VideoURLInput 
          value={formData.videoUrl}
          onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
        />
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

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            onCancel();
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
          disabled={
            !formData.title || 
            !formData.classId || 
            (formData.lectureType === 'file' && !selectedFile) ||
            (formData.lectureType === 'video' && !formData.videoUrl)
          }
        >
          {formData.lectureType === 'file' ? 'Upload Lecture' : 'Add Video Link'}
        </Button>
      </div>
    </form>
  );
};

// ==================== Lecture Card Component ====================
const LectureCard = ({ lecture, onView, onDelete }) => (
  <Card className="hover:shadow-md transition-shadow">
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
          {lecture.lectureType === 'file' && lecture.filePath && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`http://localhost:5000${lecture.filePath}`, '_blank')}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(lecture)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(lecture._id || lecture.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

// ==================== View Lecture Dialog Component ====================
const ViewLectureDialog = ({ lecture, open, onOpenChange }) => {
  if (!lecture) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Lecture Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div 
              className="p-4 rounded-lg"
              style={{ 
                backgroundColor: lecture.lectureType === 'video' ? '#EDE7F6' : '#E3F2FD' 
              }}
            >
              {lecture.lectureType === 'video' ? (
                <Video className="w-8 h-8 text-purple-600" />
              ) : (
                <File className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {lecture.title}
              </h2>
              <Badge className="bg-green-100 text-green-800">
                {lecture.lectureType === 'video' ? 'Video Link' : 'File Upload'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 mb-1">Class</p>
              <p className="font-medium">{lecture.className}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Subject</p>
              <p className="font-medium">{lecture.subject}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Upload Date</p>
              <p className="font-medium">{formatDate(lecture.uploadDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Uploaded By</p>
              <p className="font-medium">{lecture.uploadedBy}</p>
            </div>
          </div>

          {lecture.description && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Description</p>
              <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                {lecture.description}
              </p>
            </div>
          )}

          {lecture.lectureType === 'file' && lecture.fileName && (
            <div>
              <p className="text-sm text-gray-600 mb-2">File</p>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{lecture.fileName}</span>
                </div>
                {lecture.fileUrl && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(`http://localhost:5000${lecture.filePath}`, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          )}

          {lecture.lectureType === 'video' && lecture.videoUrl && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Video URL</p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <LinkIcon className="w-4 h-4 text-purple-600" />
                <a 
                  href={lecture.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline flex-1 truncate"
                >
                  {lecture.videoUrl}
                </a>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open(lecture.videoUrl, '_blank')}
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
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ==================== Empty State Component ====================
const EmptyState = ({ hasLectures, onCreateClick }) => (
  <Card>
    <CardContent className="p-8 text-center">
      <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {!hasLectures ? 'No lectures yet' : 'No lectures match your filters'}
      </h3>
      <p className="text-gray-600 mb-4">
        {!hasLectures 
          ? 'Upload your first lecture to get started.' 
          : 'Try adjusting your search or filter criteria.'
        }
      </p>
      {!hasLectures && (
        <Button 
          onClick={onCreateClick}
          style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
        >
          Upload First Lecture
        </Button>
      )}
    </CardContent>
  </Card>
);

// ==================== MAIN COMPONENT ====================
export default function Lectures() {
  const [lectures, setLectures] = useState([]);
  const [filteredLectures, setFilteredLectures] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
    lectureType: 'file',
    videoUrl: '',
    uploadDate: new Date().toISOString().split('T')[0]
  });

  // Load lectures from backend
  const loadLectures = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching lectures from:', API_BASE);
      const response = await axios.get(API_BASE);
      console.log('✅ Lectures loaded:', response.data);
      setLectures(response.data || []);
      setFilteredLectures(response.data || []);
    } catch (error) {
      console.error('❌ Failed to load lectures:', error.response?.data || error.message);
      // Show empty state instead of error if backend not ready
      setLectures([]);
      setFilteredLectures([]);
      
      if (error.response?.status === 500) {
        toast.error('Server error. Please check backend logs.');
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Backend server is not running on port 5000');
      } else {
        toast.error('Failed to load lectures');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLectures();
  }, []);

  useEffect(() => {
    let filtered = lectures;
    if (selectedClass !== 'all') filtered = filtered.filter(l => l.classId === selectedClass);
    if (searchTerm) filtered = filtered.filter(l => 
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLectures(filtered);
  }, [lectures, selectedClass, searchTerm]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }
      
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PDF, PPT, PPTX, DOC, DOCX files are allowed');
        return;
      }
      
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleCreateLecture = async (e) => {
    e.preventDefault();

    console.log('📋 Form Data:', formData);
    console.log('📎 Selected File:', selectedFile);

    // Validation
    if (!formData.title || !formData.classId) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.lectureType === 'video' && !formData.videoUrl) {
      toast.error('Video URL is required');
      return;
    }

    if (formData.lectureType === 'file' && !selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    // Handle "all" class selection
    let selectedClassData;
    if (formData.classId === 'all') {
      selectedClassData = {
        id: 'all',
        name: 'All Classes',
        subject: 'General'
      };
    } else {
      selectedClassData = teacherClasses.find(c => c.id === formData.classId);
      if (!selectedClassData) {
        toast.error('Invalid class selected');
        return;
      }
    }

    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description || '');
    form.append('classId', formData.classId);
    form.append('className', selectedClassData.name);
    form.append('subject', selectedClassData.subject || 'N/A');
    form.append('lectureType', formData.lectureType);
    form.append('uploadDate', formData.uploadDate);
    form.append('uploadedBy', 'Prof. Sarah Ahmed');

    if (formData.lectureType === 'video') {
      form.append('videoUrl', formData.videoUrl);
    } else {
      form.append('file', selectedFile);
      form.append('fileName', selectedFile.name);
    }

    try {
      console.log('📤 Uploading lecture...');
      const response = await axios.post(API_BASE, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      });
      
      console.log('✅ Upload successful:', response.data);
      await loadLectures();
      setShowCreateDialog(false);
      toast.success('Lecture uploaded successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        classId: '',
        lectureType: 'file',
        videoUrl: '',
        uploadDate: new Date().toISOString().split('T')[0]
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('❌ Upload failed:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Upload failed. Check console for details.');
    }
  };

  const handleDeleteLecture = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      await loadLectures();
      toast.success('Lecture deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete lecture');
    }
  };

  const handleViewLecture = (lecture) => {
    setSelectedLecture(lecture);
    setShowViewDialog(true);
  };

  const getClassOptions = () => [
    { id: 'all', name: 'All Classes', subject: 'All Subjects' },
    ...teacherClasses
  ];

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
      {/* ==================== Header ==================== */}
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
            <CreateLectureForm
              formData={formData}
              setFormData={setFormData}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              fileInputRef={fileInputRef}
              teacherClasses={teacherClasses}
              onSubmit={handleCreateLecture}
              onCancel={() => setShowCreateDialog(false)}
              handleFileSelect={handleFileSelect}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* ==================== Stats Cards ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Lectures"
          value={lectures.length}
          icon={BookOpen}
          color={COLLEGE_COLORS.darkGreen}
          bgColor="#9ca3af"
        />
        <StatsCard
          title="File Uploads"
          value={lectures.filter(l => l.lectureType === 'file').length}
          icon={File}
          color="#2563eb"
          bgColor="#93c5fd"
        />
        <StatsCard
          title="Video Links"
          value={lectures.filter(l => l.lectureType === 'video').length}
          icon={Video}
          color="#9333ea"
          bgColor="#c084fc"
        />
      </div>

      {/* ==================== Filters ==================== */}
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

      {/* ==================== Lectures List ==================== */}
      <div className="space-y-4">
        {filteredLectures.length === 0 ? (
          <EmptyState 
            hasLectures={lectures.length > 0}
            onCreateClick={() => setShowCreateDialog(true)}
          />
        ) : (
          filteredLectures.map((lecture) => (
            <LectureCard
              key={lecture._id || lecture.id}
              lecture={lecture}
              onView={handleViewLecture}
              onDelete={handleDeleteLecture}
            />
          ))
        )}
      </div>

      {/* ==================== View Lecture Dialog ==================== */}
      {selectedLecture && (
        <ViewLectureDialog
          lecture={selectedLecture}
          open={showViewDialog}
          onOpenChange={setShowViewDialog}
        />
      )}
    </div>
  );
}