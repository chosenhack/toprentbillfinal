import React from 'react';
import { Users, DollarSign } from 'lucide-react';
import type { SalesManager } from '../../types';

interface SalesManagerStats {
  subscriptions: number;
  revenue: number;
}

interface SalesManagerChartProps {
  salesManagerStats: Record<SalesManager, SalesManagerStats>;
}

const SalesManagerChart: React.FC<SalesManagerChartProps> = ({ salesManagerStats }) => {
  const totalRevenue = Object.values(salesManagerStats)
    .reduce((sum, stats) => sum + stats.revenue, 0);
  
  const totalSubscriptions = Object.values(salesManagerStats)
    .reduce((sum, stats) => sum + stats.subscriptions, 0);

  return (
    <div className="space-y-6">
      {Object.entries(salesManagerStats).map(([manager, stats]) => {
        const revenuePercentage = (stats.revenue / totalRevenue) * 100;
        const subscriptionPercentage = (stats.subscriptions / totalSubscriptions) * 100;
        
        return (
          <div key={manager} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{manager}</h3>
              <div className="text-sm text-gray-500">
                {stats.subscriptions} abbonamenti
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span>Fatturato</span>
                </div>
                <span>€{stats.revenue.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${revenuePercentage}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Abbonamenti</span>
                </div>
                <span>{subscriptionPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${subscriptionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SalesManagerChart;