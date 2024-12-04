import React from 'react';

interface SalesTeamChartProps {
  salesTeamRevenue: Record<string, number>;
}

const SalesTeamChart: React.FC<SalesTeamChartProps> = ({ salesTeamRevenue }) => {
  const totalRevenue = Object.values(salesTeamRevenue).reduce((sum, value) => sum + value, 0);

  const getTeamLabel = (team: string): string => {
    switch (team) {
      case 'IT':
        return 'Italia';
      case 'ES':
        return 'Spagna';
      case 'FR':
        return 'Francia';
      case 'WORLD':
        return 'Mondo';
      default:
        return team;
    }
  };

  const getTeamFlag = (team: string): string => {
    switch (team) {
      case 'IT':
        return '🇮🇹';
      case 'ES':
        return '🇪🇸';
      case 'FR':
        return '🇫🇷';
      case 'WORLD':
        return '🌍';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(salesTeamRevenue).map(([team, revenue]) => {
        const percentage = (revenue / totalRevenue) * 100;
        
        return (
          <div key={team} className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{getTeamFlag(team)}</span>
                <span className="font-medium">{getTeamLabel(team)}</span>
              </div>
              <div className="text-sm text-gray-600">
                €{revenue.toFixed(2)} ({percentage.toFixed(1)}%)
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SalesTeamChart;