import { Card, CardHeader, CardTitle, CardContent } from '../../../ui/card.jsx';
import { Calendar } from 'lucide-react';
import { COLLEGE_COLORS } from '../../../constants/colors.js';

export default function UpcomingEvents({ events }) {
  return (
    <Card>
      <CardHeader><CardTitle>Upcoming Events</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="flex items-start space-x-3 pb-4 border-b last:border-b-0 last:pb-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: event.status === 'important' ? COLLEGE_COLORS.redAccent + '20' : COLLEGE_COLORS.lightGreen + '20' }}>
                <Calendar className="w-4 h-4" style={{ color: event.status === 'important' ? COLLEGE_COLORS.redAccent : COLLEGE_COLORS.lightGreen }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{event.title}</p>
                <p className="text-sm text-gray-500">{event.date}</p>
              </div>
              {event.status === 'important' && (
                <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: COLLEGE_COLORS.redAccent + '20', color: COLLEGE_COLORS.redAccent }}>
                  Important
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}