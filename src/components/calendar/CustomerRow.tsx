import React, { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { format, parseISO, isSameMonth, startOfMonth, addMonths } from 'date-fns';
import { useSelector } from 'react-redux';
import type { Customer, Payment } from '../../types';
import type { RootState } from '../../store';

interface CustomerRowProps {
  customer: Customer;
  months: Date[];
}

const CustomerRow = memo(({ customer, months }: CustomerRowProps) => {
  const navigate = useNavigate();
  const payments = useSelector((state: RootState) => 
    state.payments.items.filter(p => p.customerId === customer.id)
  );

  const paymentsByMonth = useMemo(() => {
    const map = new Map<string, Payment['status']>();
    const activationDate = parseISO(customer.activationDate);
    let nextPaymentDate = startOfMonth(activationDate);

    // For one-time payments, only show the activation month
    if (customer.paymentFrequency === 'oneTime') {
      const monthKey = format(nextPaymentDate, 'yyyy-MM');
      const payment = payments.find(p => isSameMonth(parseISO(p.date), nextPaymentDate));
      map.set(monthKey, payment?.status || 'pending');
      return map;
    }

    // For recurring payments
    months.forEach(month => {
      if (isSameMonth(month, nextPaymentDate) || month >= nextPaymentDate) {
        const monthKey = format(month, 'yyyy-MM');
        const payment = payments.find(p => isSameMonth(parseISO(p.date), month));
        
        // If there's a payment record, use its status, otherwise mark as pending
        if (payment) {
          map.set(monthKey, payment.status);
        } else if (month >= nextPaymentDate) {
          map.set(monthKey, 'pending');
        }

        // Update next payment date if this is a payment month
        if (isSameMonth(month, nextPaymentDate)) {
          switch (customer.paymentFrequency) {
            case 'monthly':
              nextPaymentDate = addMonths(nextPaymentDate, 1);
              break;
            case 'quarterly':
              nextPaymentDate = addMonths(nextPaymentDate, 3);
              break;
            case 'biannual':
              nextPaymentDate = addMonths(nextPaymentDate, 6);
              break;
            case 'annual':
              nextPaymentDate = addMonths(nextPaymentDate, 12);
              break;
          }
        }
      }
    });

    return map;
  }, [customer, months, payments]);

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'confirmed':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'problem':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'processing':
        return <RefreshCw className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 hover:bg-green-100';
      case 'pending':
        return 'bg-yellow-50 hover:bg-yellow-100';
      case 'problem':
        return 'bg-red-50 hover:bg-red-100';
      case 'processing':
        return 'bg-blue-50 hover:bg-blue-100';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: Payment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confermato';
      case 'pending':
        return 'In Attesa';
      case 'problem':
        return 'Problema';
      case 'processing':
        return 'In Elaborazione';
      default:
        return '';
    }
  };

  const handleCustomerClick = () => {
    navigate('/customers');
  };

  const handlePaymentClick = (month: Date) => {
    navigate('/payments');
  };

  return (
    <>
      <td className="px-6 py-4 whitespace-nowrap sticky left-12 bg-white z-10 border-r">
        <div 
          className="flex items-center space-x-3 cursor-pointer hover:text-blue-600"
          onClick={handleCustomerClick}
        >
          <div>
            <div className="text-sm font-medium text-gray-900">
              {customer.name}
            </div>
            <div className="text-sm text-gray-500">
              €{customer.amount.toFixed(2)} / {
                customer.paymentFrequency === 'monthly' ? 'Mensile' :
                customer.paymentFrequency === 'quarterly' ? 'Trimestrale' :
                customer.paymentFrequency === 'biannual' ? 'Semestrale' :
                customer.paymentFrequency === 'annual' ? 'Annuale' : 'Una Tantum'
              }
            </div>
          </div>
        </div>
      </td>
      {months.map(month => {
        const monthKey = format(month, 'yyyy-MM');
        const status = paymentsByMonth.get(monthKey);
        
        return (
          <td
            key={monthKey}
            className={`px-6 py-4 whitespace-nowrap text-center transition-colors duration-150 ${
              status ? getStatusColor(status) : ''
            } ${status ? 'cursor-pointer' : ''}`}
            onClick={() => status && handlePaymentClick(month)}
            title={status ? getStatusLabel(status) : ''}
          >
            {status && (
              <div className="flex flex-col items-center space-y-1">
                {getStatusIcon(status)}
                <span className="text-xs text-gray-600">
                  {getStatusLabel(status)}
                </span>
              </div>
            )}
          </td>
        );
      })}
    </>
  );
});

CustomerRow.displayName = 'CustomerRow';

export default CustomerRow;