// frontend/components/Announcements/AnnouncementViewDialog.js

import { Calendar, User, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Badge } from '../../../ui/badge';
import { COLLEGE_COLORS } from '../../../constants/colors';

// Helper function for full date (moved here for simplicity)
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

export default function AnnouncementViewDialog({ 
  selectedAnnouncement, 
  showViewDialog, 
  setShowViewDialog 
}) {
  
  return (
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
                <Badge variant="default" className="bg-indigo-500 hover:bg-indigo-600">
                  General Notice
                </Badge>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Message (Content) */}
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

              </div>
              
              {/* Footer */}
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
  );
}