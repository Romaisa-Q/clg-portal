import { COLLEGE_COLORS } from '../../constants/colors.js';
import { scheduleData, days } from '../../constants/scheduleData.js';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

const timeSlots = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM'
];

export default function Schedule() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold" style={{ color: COLLEGE_COLORS.darkGreen }}>
          Weekly Schedule
        </h2>
        <p className="text-gray-600">Your teaching timetable for the semester</p>
      </div>

      {/* Timetable Grid */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="grid grid-cols-6 bg-gray-50 border-b">
                <div className="p-4 font-medium text-gray-600">Time</div>
                {days.map((day) => (
                  <div
                    key={day}
                    className="p-4 font-medium text-center"
                    style={{ color: COLLEGE_COLORS.darkGreen }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {timeSlots.map((timeSlot) => (
                <div
                  key={timeSlot}
                  className="grid grid-cols-6 border-b border-gray-100 min-h-[80px]"
                >
                  {/* Time Column */}
                  <div className="p-4 font-medium text-gray-600 bg-gray-50 flex items-center">
                    {timeSlot}
                  </div>

                  {/* Day Columns */}
                  {days.map((day) => {
                    const classItem = scheduleData[day]?.[timeSlot];

                    return (
                      <div
                        key={day}
                        className="p-3 border-r border-gray-100 last:border-r-0"
                      >
                        {classItem ? (
                          <div
                            className="h-full p-3 rounded-lg cursor-pointer transition-all hover:shadow-md"
                            style={{
                              backgroundColor:
                                classItem.type === 'Lab'
                                  ? '#E3F2FD'
                                  : '#E8F5E8',
                              borderLeft: `4px solid ${
                                classItem.type === 'Lab'
                                  ? '#2196F3'
                                  : COLLEGE_COLORS.lightGreen
                              }`
                            }}
                          >
                            <div className="space-y-1">
                              <h4 className="font-medium text-gray-900 text-sm leading-tight">
                                {classItem.subject}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {classItem.class}
                              </p>
                              <span
                                className="inline-block text-xs px-2 py-1 rounded-full text-white"
                                style={{
                                  backgroundColor:
                                    classItem.type === 'Lab'
                                      ? '#2196F3'
                                      : COLLEGE_COLORS.lightGreen
                                }}
                              >
                                {classItem.type}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-300">
                            <span className="text-xs">Free</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLLEGE_COLORS.lightGreen }}
              >
                <span className="text-white font-medium">📚</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Classes</p>
                <p
                  className="text-xl font-semibold"
                  style={{ color: COLLEGE_COLORS.darkGreen }}
                >
                  15
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100">
                <span className="text-blue-600 font-medium">🔬</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Lab Sessions</p>
                <p className="text-xl font-semibold text-blue-600">4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-100">
                <span className="text-purple-600 font-medium">⏰</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Weekly Hours</p>
                <p className="text-xl font-semibold text-purple-600">18</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
