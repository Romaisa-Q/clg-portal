// frontend/components/Announcements/AnnouncementFilters.js

import { Search } from 'lucide-react';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Megaphone } from 'lucide-react';

export default function AnnouncementFilters({ 
  searchTerm, setSearchTerm, 
  priorityFilter, setPriorityFilter, 
  typeFilter, setTypeFilter,
  announcements // for clear filter logic
}) {
    
  const isFiltered = searchTerm || priorityFilter !== 'all' || typeFilter !== 'all';
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setPriorityFilter('all');
    setTypeFilter('all');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search Input */}
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
      
      {/* Priority Filter (Disabled/Simplified) */}
      <Select value={priorityFilter} onValueChange={setPriorityFilter} disabled>
        <SelectTrigger className="w-full sm:w-48 bg-gray-100 opacity-70">
          <SelectValue placeholder="Priority (Backend Update Pending)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
        </SelectContent>
      </Select>

      {/* Type Filter (Disabled/Simplified) */}
      <Select value={typeFilter} onValueChange={setTypeFilter} disabled>
        <SelectTrigger className="w-full sm:w-48 bg-gray-100 opacity-70">
          <SelectValue placeholder="Type (Backend Update Pending)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}