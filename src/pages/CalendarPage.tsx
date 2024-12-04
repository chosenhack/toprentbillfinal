import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import type { RootState } from '../store';
import CalendarGrid from '../components/calendar/CalendarGrid';
import CalendarLegend from '../components/calendar/CalendarLegend';
import { getMonthsForYear } from '../utils/calendar';

const CalendarPage = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  const customers = useSelector((state: RootState) => state.customers.items);
  const activeCustomers = useMemo(() => 
    customers.filter(c => c.active), 
    [customers]
  );
  
  const months = useMemo(() => 
    getMonthsForYear(selectedYear), 
    [selectedYear]
  );

  const handlePreviousYear = () => {
    setSelectedYear(prev => prev - 1);
  };

  const handleNextYear = () => {
    setSelectedYear(prev => prev + 1);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Calendario Rinnovi</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePreviousYear}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-medium">
            {selectedYear}
          </span>
          <button
            onClick={handleNextYear}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <CalendarGrid 
          months={months} 
          customers={activeCustomers} 
        />
        <CalendarLegend />
      </div>
    </div>
  );
};

export default CalendarPage;