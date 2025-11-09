import { Card, CardContent } from '../../../ui/card.jsx';
import { TrendingUp } from 'lucide-react';

export default function StatsCard({ stat }) {
  const Icon = stat.icon;
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-500">{stat.title}</p>
            <p className="mt-2 text-gray-900">{stat.value}</p>
            <div className="flex items-center mt-2 space-x-1">
              <TrendingUp className={`w-4 h-4 ${stat.trend === 'up' ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-gray-400'}`}>
                {stat.change}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '20' }}>
            <Icon className="w-6 h-6" style={{ color: stat.color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}