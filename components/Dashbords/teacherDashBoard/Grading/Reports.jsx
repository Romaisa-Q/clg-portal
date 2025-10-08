import { Award, FileText, Calendar } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-6">
      <h2
        className="text-2xl font-semibold text-gray-900"
        style={{ fontFamily: 'Montserrat' }}
      >
        Grading Reports
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Grade Distribution</h3>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">A (90-100)</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div className="w-3/4 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">15</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">B (80-89)</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div className="w-1/2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">12</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">C (70-79)</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div className="w-1/3 h-2 bg-yellow-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Class Average */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Class Average</h3>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Computer Networks</span>
              <span className="text-sm font-medium">85.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Database Systems</span>
              <span className="text-sm font-medium">78.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Software Engineering</span>
              <span className="text-sm font-medium">82.5%</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Recent Activity</h3>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div className="space-y-3">
            <div className="text-sm">
              <p className="text-gray-900">Graded 15 assignments</p>
              <p className="text-gray-500">Computer Networks - Today</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-900">Updated marks for Quiz 3</p>
              <p className="text-gray-500">Database Systems - Yesterday</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-900">Generated progress report</p>
              <p className="text-gray-500">CS-3A - 2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
