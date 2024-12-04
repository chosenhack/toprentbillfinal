import React from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface MonthHeaderProps {
  month: Date;
}

const MonthHeader: React.FC<MonthHeaderProps> = ({ month }) => (
  <th
    scope="col"
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]"
  >
    {format(month, 'MMMM yyyy', { locale: it })}
  </th>
);

export default MonthHeader;