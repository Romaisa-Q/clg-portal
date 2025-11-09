import { Card, CardHeader, CardTitle, CardContent } from '../../../ui/card.jsx';
import { UserCog, GraduationCap, FileText, BookOpen, DollarSign } from 'lucide-react';
import { COLLEGE_COLORS } from '../../../constants/colors.js';

export default function RecentActivities({ activities }) {
  return (
    <Card>
      <CardHeader><CardTitle>Recent Activities</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 pb-4 border-b last:border-b-0 last:pb-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: activity.type === 'teacher' ? COLLEGE_COLORS.lightGreen + '30' : activity.type === 'student' ? COLLEGE_COLORS.darkGreen + '30' : '#2196F330' }}>
                {activity.type === 'teacher' && <UserCog className="w-4 h-4" style={{ color: COLLEGE_COLORS.lightGreen }} />}
                {activity.type === 'student' && <GraduationCap className="w-4 h-4" style={{ color: COLLEGE_COLORS.darkGreen }} />}
                {activity.type === 'result' && <FileText className="w-4 h-4 text-blue-600" />}
                {activity.type === 'class' && <BookOpen className="w-4 h-4 text-blue-600" />}
                {activity.type === 'fee' && <DollarSign className="w-4 h-4 text-blue-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.user}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}