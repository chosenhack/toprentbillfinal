import React from 'react';
import { X, Calendar, RefreshCw, DollarSign, Trophy } from 'lucide-react';
import { differenceInDays, differenceInMonths, differenceInYears, parseISO } from 'date-fns';
import type { Customer, Payment } from '../types';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface CustomerDetailsPopupProps {
  customer: Customer;
  onClose: () => void;
}

const CustomerDetailsPopup: React.FC<CustomerDetailsPopupProps> = ({ customer, onClose }) => {
  const payments = useSelector((state: RootState) => state.payments.items);
  const customers = useSelector((state: RootState) => state.customers.items);

  // Calculate duration components
  const activationDate = parseISO(customer.activationDate);
  const now = new Date();
  const years = differenceInYears(now, activationDate);
  const months = differenceInMonths(now, activationDate) % 12;
  const remainingDays = differenceInDays(now, activationDate) % 30;

  // Format duration string
  const getDurationString = () => {
    const parts = [];
    if (years > 0) {
      parts.push(`${years} ${years === 1 ? 'anno' : 'anni'}`);
    }
    if (months > 0) {
      parts.push(`${months} ${months === 1 ? 'mese' : 'mesi'}`);
    }
    if (remainingDays > 0 && years === 0) { // Show days only if less than a year
      parts.push(`${remainingDays} ${remainingDays === 1 ? 'giorno' : 'giorni'}`);
    }
    return parts.join(', ');
  };

  // Calculate confirmed payments
  const confirmedPayments = payments.filter(
    p => p.customerId === customer.id && p.status === 'confirmed'
  );
  const renewalsCount = confirmedPayments.length;

  // Calculate total revenue
  const totalRevenue = confirmedPayments.reduce((sum, payment) => sum + payment.amount, 0);

  // Calculate ranking
  const customerRanking = () => {
    const customerTotals = customers.map(c => {
      const customerPayments = payments.filter(
        p => p.customerId === c.id && p.status === 'confirmed'
      );
      return {
        id: c.id,
        total: customerPayments.reduce((sum, payment) => sum + payment.amount, 0)
      };
    });

    customerTotals.sort((a, b) => b.total - a.total);
    const position = customerTotals.findIndex(c => c.id === customer.id) + 1;
    return position;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{customer.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Cliente da</p>
              <p className="font-semibold">
                {getDurationString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <RefreshCw className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rinnovi completati</p>
              <p className="font-semibold">{renewalsCount}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Totale incassato</p>
              <p className="font-semibold">€{totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-full">
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Posizione Top Spender</p>
              <p className="font-semibold">#{customerRanking()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsPopup;