import { Card, CardHeader, CardTitle, CardContent } from '../../../ui/card.jsx';
import { COLLEGE_COLORS } from '../../../constants/colors.js';

export default function DepartmentOverview({ departments }) {
  return (
    <Card>
      <CardHeader><CardTitle>Department Overview</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-600">Department</th>
                <th className="text-right py-3 px-4 text-gray-600">Students</th>
                <th className="text-right py-3 px-4 text-gray-600">Teachers</th>
                <th className="text-right py-3 px-4 text-gray-600">Ratio</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, index) => {
                const ratio = (dept.students / dept.teachers).toFixed(1);
                return (
                  <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{dept.name}</td>
                    <td className="text-right py-3 px-4 text-gray-700">{dept.students}</td>
                    <td className="text-right py-3 px-4 text-gray-700">{dept.teachers}</td>
                    <td className="text-right py-3 px-4">
                      <span className="px-2 py-1 rounded text-sm"
                        style={{ backgroundColor: ratio > 20 ? COLLEGE_COLORS.redAccent + '20' : COLLEGE_COLORS.lightGreen + '20', color: ratio > 20 ? COLLEGE_COLORS.redAccent : COLLEGE_COLORS.lightGreen }}>
                        {ratio}:1
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}