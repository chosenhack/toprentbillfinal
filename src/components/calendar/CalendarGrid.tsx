import React, { memo } from 'react';
import MonthHeader from './MonthHeader';
import CustomerRow from './CustomerRow';
import type { Customer } from '../../types';

interface CalendarGridProps {
  months: Date[];
  customers: Customer[];
}

const CalendarGrid = memo(({ months, customers }: CalendarGridProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="w-12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
              #
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-12 bg-gray-50 z-10 min-w-[200px]">
              Cliente
            </th>
            {months.map(month => (
              <MonthHeader key={month.toISOString()} month={month} />
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {customers.map((customer, index) => (
            <tr key={customer.id} className="hover:bg-gray-50">
              <td className="w-12 px-3 py-4 whitespace-nowrap text-sm text-gray-500 sticky left-0 bg-white z-10 border-r">
                {index + 1}
              </td>
              <CustomerRow
                customer={customer}
                months={months}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

CalendarGrid.displayName = 'CalendarGrid';

export default CalendarGrid;