import { Card, CardHeader, CardTitle, CardContent } from '../../../ui/card.jsx';
import { Button } from '../../../ui/button.jsx';
import { GraduationCap, UserCog, BookOpen, FileText } from 'lucide-react';
import { COLLEGE_COLORS } from '../../../constants/colors.js';

export default function QuickActions() {
  return (
    <Card>
      <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button className="h-auto py-4 flex flex-col items-center space-y-2" style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}>
            <GraduationCap className="w-6 h-6" />
            <span>Add Student</span>
          </Button>
          <Button className="h-auto py-4 flex flex-col items-center space-y-2" style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}>
            <UserCog className="w-6 h-6" />
            <span>Add Teacher</span>
          </Button>
          <Button className="h-auto py-4 flex flex-col items-center space-y-2 bg-blue-600 hover:bg-blue-700">
            <BookOpen className="w-6 h-6" />
            <span>Create Class</span>
          </Button>
          <Button className="h-auto py-4 flex flex-col items-center space-y-2 bg-orange-600 hover:bg-orange-700">
            <FileText className="w-6 h-6" />
            <span>Generate Report</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}