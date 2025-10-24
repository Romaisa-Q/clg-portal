// frontend/components/Announcements/AnnouncementStats.js

import { Megaphone, AlertTriangle, Bell } from 'lucide-react';
import { Card, CardContent } from '../../../ui/card';
import { COLLEGE_COLORS } from '../../../constants/colors';

// Ab sirf total, urgent, important, aur unread count ko props se lenge
export default function AnnouncementStats({ announcements, unreadCount }) {
const stats = {
total: announcements.length,
 // Priority/Type fields abhi backend mein nahi hain, isliye 0 hardcode kiya hai
 urgent: 0, 
 important: 0,
  unread: unreadCount,
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Announcements */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
<div>
 <p className="text-sm text-gray-600">Total Announcements</p>
 <p className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
 {stats.total}
            </p>
          </div>
          <Megaphone className="w-8 h-8 text-gray-400" />
        </CardContent>
      </Card>

      {/* Unread (Hardcoded 0 for now) */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Unread</p>
            <p className="text-2xl font-semibold text-blue-600">
              {stats.unread}
            </p>
          </div>
          <Bell className="w-8 h-8 text-blue-400" />
        </CardContent>
      </Card>

      {/* Important (Hardcoded 0 for now) */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Important</p>
            <p className="text-2xl font-semibold text-yellow-600">
              {stats.important}
            </p>
          </div>
          <AlertTriangle className="w-8 h-8 text-yellow-400" />
        </CardContent>
      </Card>

      {/* Urgent (Hardcoded 0 for now) */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Urgent</p>
            <p className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.redAccent }}>
              {stats.urgent}
            </p>
          </div>
          <AlertTriangle className="w-8 h-8" style={{ color: COLLEGE_COLORS.redAccent }} />
        </CardContent>
      </Card>
    </div>
  );
}