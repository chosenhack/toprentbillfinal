import React from 'react';
import { Crown, DollarSign } from 'lucide-react';
import type { Customer, Payment } from '../../types';

interface TopSpendersChartProps {
  customers: Customer[];
  payments: Payment[];
  limit?: number;
}

const TopSpendersChart: React.FC<TopSpendersChartProps> = ({ 
  customers, 
  payments,
  limit = 5
}) => {
  // Calculate total revenue per customer
  const customerRevenues = customers
    .map(customer => {
      const customerPayments = payments.filter(
        p => p.customerId === customer.id && p.status === 'confirmed'
      );
      const total = customerPayments.reduce((sum, payment) => sum + payment.amount, 0);
      return {
        customer,
        total
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);

  const maxRevenue = customerRevenues[0]?.total || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <Crown className="w-6 h-6 text-yellow-500" />
        <h2 className="text-lg font-semibold">Top {limit} Clienti</h2>
      </div>

      {customerRevenues.map(({ customer, total }, index) => (
        <div key={customer.id} className="relative">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-lg text-gray-500">#{index + 1}</span>
              <div>
                <div className="font-medium">{customer.name}</div>
                <div className="text-sm text-gray-500">
                  {customer.subscriptionType.replace(/_/g, ' ')}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-semibold">€{total.toFixed(2)}</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(total / maxRevenue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopSpendersChart;