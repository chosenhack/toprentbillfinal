import React, { useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Customer } from '../../types';
import CustomerRow from './CustomerRow';
import { getRenewalMonths } from '../../utils/calendar';

interface VirtualizedCalendarProps {
  customers: Customer[];
  months: Date[];
}

const VirtualizedCalendar: React.FC<VirtualizedCalendarProps> = ({ customers, months }) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: customers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });

  const customerRenewalMonths = useMemo(() => {
    return customers.map(customer => ({
      customer,
      renewalMonths: getRenewalMonths(customer, months)
    }));
  }, [customers, months]);

  return (
    <div
      ref={parentRef}
      className="max-h-[calc(100vh-200px)] overflow-auto"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const { customer, renewalMonths } = customerRenewalMonths[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <CustomerRow
                customer={customer}
                months={months}
                renewalMonths={renewalMonths}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(VirtualizedCalendar);