import React from 'react';
import { Calendar } from 'lucide-react';

export type PeriodType = 'all' | 'current' | 'last' | 'custom';

interface PeriodSelectorProps {
  period: PeriodType;
  setPeriod: (period: PeriodType) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  period,
  setPeriod,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}) => {
  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex items-center space-x-2">
        <Calendar className="w-5 h-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Periodo:</span>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => setPeriod('all')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            period === 'all'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Da sempre
        </button>
        <button
          onClick={() => setPeriod('current')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            period === 'current'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Mese corrente
        </button>
        <button
          onClick={() => setPeriod('last')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            period === 'last'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Mese scorso
        </button>
        <button
          onClick={() => setPeriod('custom')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            period === 'custom'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Personalizzato
        </button>
      </div>

      {period === 'custom' && (
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
          <span className="text-gray-500">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>
      )}
    </div>
  );
};

export default PeriodSelector;