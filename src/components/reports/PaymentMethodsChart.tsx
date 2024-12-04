import React from 'react';
import { CreditCard, Building, Bitcoin, Banknote } from 'lucide-react';

interface PaymentMethodsChartProps {
  paymentMethods: Record<string, number>;
  totalCustomers: number;
}

const PaymentMethodsChart: React.FC<PaymentMethodsChartProps> = ({ paymentMethods, totalCustomers }) => {
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'stripe':
        return <CreditCard className="w-5 h-5" />;
      case 'bank_transfer':
        return <Building className="w-5 h-5" />;
      case 'crypto':
        return <Bitcoin className="w-5 h-5" />;
      case 'cash':
        return <Banknote className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'stripe':
        return 'Stripe';
      case 'bank_transfer':
        return 'Bonifico';
      case 'crypto':
        return 'Crypto';
      case 'cash':
        return 'Contanti';
      default:
        return method;
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(paymentMethods).map(([method, count]) => {
        const percentage = (count / totalCustomers) * 100;
        
        return (
          <div key={method} className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                {getMethodIcon(method)}
                <span className="font-medium">{getMethodLabel(method)}</span>
              </div>
              <div className="text-sm text-gray-600">
                {count} clienti ({percentage.toFixed(1)}%)
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

export default PaymentMethodsChart;