import { useState } from 'react';
import {
  Plus, Search, Filter, Users, MapPin, Clock, Eye, Edit, Trash2
} from 'lucide-react';
import { COLLEGE_COLORS } from '../../constants/colors';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';

const initialClasses = [
  {
    id: 1,
    name: 'Computer Networks',
    code: 'CS-301 • CS-3A',
    students: 35,
    room: 'Room 101',
    schedule: 'Mon, Wed, Fri - 9:00 AM',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Database Systems',
    semester: '3rd',
    schedule: 'Tue, Thu - 11:00 AM',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Software Engineering',
    code: 'CS-401 • CS-4A',
    students: 28,
    room: 'Room 301',
    schedule: 'Mon, Wed - 2:00 PM',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Web Development',
    code: 'CS-303 • CS-3C',
    students: 30,
    room: 'Lab 102',
    schedule: 'Tue, Thu, Fri - 3:00 PM',
    status: 'Inactive'
  }
];

export default function ClassList() {
  const [classes, setClasses] = useState(initialClasses);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cls.code && cls.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleView = (classId) => {
    alert(`View class ID: ${classId}`);
  };

  const handleEdit = (classId) => {
    const newName = prompt('Enter new class name:');
    if (newName && newName.trim() !== '') {
      setClasses(prev =>
        prev.map(cls =>
          cls.id === classId ? { ...cls, name: newName } : cls
        )
      );
    }
  };

  const handleDelete = (classId) => {
    if (confirm('Are you sure you want to delete this class?')) {
      setClasses(prev => prev.filter(cls => cls.id !== classId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
            My Classes
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and organize your classes
          </p>
        </div>
        <Button
          className="text-white hover:opacity-90 transition-opacity flex items-center gap-2"
          style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}
        >
          <Plus className="w-4 h-4" />
          Add New Class
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 border-gray-300 focus:border-[#66bb6a] focus:ring-[#66bb6a]"
          />
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
        >
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClasses.map((classItem) => (
          <Card key={classItem.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1" style={{ color: COLLEGE_COLORS.darkGreen }}>
                    {classItem.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{classItem.code}</p>
                </div>
                <Badge
                  variant={classItem.status === 'Active' ? 'default' : 'secondary'}
                  className={classItem.status === 'Active'
                    ? 'bg-green-100 text-green-800 hover:bg-green-100'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-100'
                  }
                >
                  {classItem.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Class Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{classItem.students || 0} Students</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{classItem.room || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{classItem.schedule}</span>
                </div>
              </div>

              {/* Action Buttons - Updated Design */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(classItem.id)}
                  className="flex-1 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center text-sm"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                <button
                  onClick={() => handleEdit(classItem.id)}
                  className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(classItem.id)}
                  className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'You haven\'t created any classes yet'}
          </p>
          {!searchTerm && (
            <Button
              className="text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Class
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

