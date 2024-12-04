import React from 'react';
import { format, subMonths } from 'date-fns';
import { it } from 'date-fns/locale';

interface RevenueChartProps {
  currentMonthRevenue: number;
  lastMonthRevenue: number;
  revenueGrowth: number;
}

const RevenueChart: React.FC<RevenueChartProps> = ({
  currentMonthRevenue,
  lastMonthRevenue,
  revenueGrowth
}) => {
  const currentMonth = new Date();
  const lastMonth = subMonths(currentMonth, 1);
  const maxRevenue = Math.max(currentMonthRevenue, lastMonthRevenue);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Andamento Fatturato</h3>
        <span className={`text-sm font-medium ${
          revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{format(currentMonth, 'MMMM', { locale: it })}</span>
            <span>€{currentMonthRevenue.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(currentMonthRevenue / maxRevenue) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{format(lastMonth, 'MMMM', { locale: it })}</span>
            <span>€{lastMonthRevenue.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gray-600 h-2.5 rounded-full"
              style={{ width: `${(lastMonthRevenue / maxRevenue) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;