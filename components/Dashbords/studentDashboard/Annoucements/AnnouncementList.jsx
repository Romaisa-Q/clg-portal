// frontend/components/Announcements/AnnouncementList.js

import { Megaphone, User, Clock, Eye } from 'lucide-react';
import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';

// Helper function for time ago (moved here for simplicity)
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
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Simplified component structure
export default function AnnouncementList({ announcements, allAnnouncements, handleViewAnnouncement }) {
  
  if (announcements.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-12 text-center">
          <Megaphone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {allAnnouncements.length === 0 ? 'No announcements yet' : 'No announcements match your search'}
          </h3>
          <p className="text-gray-600 mb-4">
            {allAnnouncements.length === 0 
              ? 'Teacher Dashboard se announcements post karo!'
              : 'Try adjusting your search term.'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <Card 
          key={announcement.id} 
          className={`border-0 shadow-sm transition-all hover:shadow-md cursor-pointer`}
          onClick={() => handleViewAnnouncement(announcement)}
        >
          <CardContent className="p-5">
            <div className="flex gap-4">
              {/* Simplified left border */}
              <div className="w-1 rounded-full flex-shrink-0 bg-indigo-500" /> 

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {announcement.title}
                    </h3>
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
      ))}
    </div>
  );
}