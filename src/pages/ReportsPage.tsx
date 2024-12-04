import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  BarChart3, 
  DollarSign,
  Users,
  UserMinus,
  Crown,
  Car,
  Download
} from 'lucide-react';
import type { RootState } from '../store';
import { parseISO } from 'date-fns';
import { saveAs } from 'file-saver';
import PaymentMethodsChart from '../components/reports/PaymentMethodsChart';
import RevenueChart from '../components/reports/RevenueChart';
import SalesTeamChart from '../components/reports/SalesTeamChart';
import SalesManagerChart from '../components/reports/SalesManagerChart';
import TopSpendersChart from '../components/reports/TopSpendersChart';
import PeriodSelector, { PeriodType } from '../components/reports/PeriodSelector';
import { generateExcelReport } from '../utils/reportExport';
import { getPeriodDates, isDateInPeriod } from '../utils/date';
import type { SalesManager } from '../types';

const ReportsPage = () => {
  const customers = useSelector((state: RootState) => state.customers.items);
  const payments = useSelector((state: RootState) => state.payments.items);
  const [period, setPeriod] = useState<PeriodType>('current');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [downloading, setDownloading] = useState(false);

  const stats = useMemo(() => {
    const { start, end } = getPeriodDates(period, startDate, endDate);

    // Active Subscriptions (only count those active during the period)
    const activeCustomers = customers.filter(c => {
      const activationDate = parseISO(c.activationDate);
      const deactivationDate = c.deactivationDate ? parseISO(c.deactivationDate) : null;
      
      return activationDate <= end && (!deactivationDate || deactivationDate >= start);
    });

    const activeSubscriptions = activeCustomers.length;

    // Total Vehicles Count
    const totalVehicles = activeCustomers.reduce((sum, customer) => sum + (customer.vehicleCount || 0), 0);

    // Payment Methods Distribution
    const paymentMethods = activeCustomers.reduce((acc, customer) => {
      const method = customer.paymentMethod || 'bank_transfer';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // New Customers in Period
    const newCustomers = customers.filter(customer => 
      isDateInPeriod(customer.activationDate, start, end)
    );

    // Deactivated in Period
    const deactivatedInPeriod = customers.filter(customer => 
      customer.deactivationDate && isDateInPeriod(customer.deactivationDate, start, end)
    );

    // Churn Rate
    const churnRate = activeSubscriptions > 0 
      ? (deactivatedInPeriod.length / activeSubscriptions) * 100 
      : 0;

    // Revenue Calculations
    const periodPayments = payments.filter(payment => 
      isDateInPeriod(payment.date, start, end) && payment.status === 'confirmed'
    );

    const totalRevenue = periodPayments.reduce((sum, payment) => sum + payment.amount, 0);

    // Expected Revenue (total of all active subscriptions)
    const expectedMonthlyRevenue = activeCustomers.reduce((sum, customer) => {
      return sum + customer.amount;
    }, 0);

    // Luxury Customers Stats
    const luxuryCustomers = activeCustomers.filter(c => c.isLuxury);
    const luxuryRevenue = periodPayments
      .filter(payment => {
        const customer = customers.find(c => c.id === payment.customerId);
        return customer?.isLuxury;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    // Sales Team Performance
    const salesTeamRevenue = activeCustomers.reduce((acc, customer) => {
      const team = customer.salesTeam;
      const customerPayments = periodPayments.filter(p => p.customerId === customer.id);
      const revenue = customerPayments.reduce((sum, p) => sum + p.amount, 0);
      acc[team] = (acc[team] || 0) + revenue;
      return acc;
    }, {} as Record<string, number>);

    // Sales Manager Performance
    const salesManagerStats = activeCustomers.reduce((acc, customer) => {
      const manager = customer.salesManager;
      if (!acc[manager]) {
        acc[manager] = { subscriptions: 0, revenue: 0 };
      }
      acc[manager].subscriptions += 1;
      
      const customerPayments = periodPayments.filter(p => p.customerId === customer.id);
      const revenue = customerPayments.reduce((sum, p) => sum + p.amount, 0);
      acc[manager].revenue += revenue;
      
      return acc;
    }, {} as Record<SalesManager, { subscriptions: number; revenue: number }>);

    return {
      activeSubscriptions,
      newCustomersCount: newCustomers.length,
      churnRate,
      totalRevenue,
      expectedMonthlyRevenue,
      luxuryCustomersCount: luxuryCustomers.length,
      luxuryRevenue,
      salesTeamRevenue,
      salesManagerStats,
      deactivatedCount: deactivatedInPeriod.length,
      totalVehicles,
      paymentMethods
    };
  }, [customers, payments, period, startDate, endDate]);

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);

      // Generate period string for filename
      const periodString = period === 'custom' 
        ? `${startDate}_${endDate}`
        : period;

      // Generate Excel report
      const excelBlob = generateExcelReport(stats, periodString);
      
      // Download the file
      saveAs(excelBlob, `report_${periodString}.xlsx`);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Report</h1>
        </div>
        <button
          onClick={handleDownloadReport}
          disabled={downloading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            downloading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Scaricamento...' : 'Scarica Report'}</span>
        </button>
      </div>

      <PeriodSelector
        period={period}
        setPeriod={setPeriod}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Abbonamenti Attivi</p>
              <p className="text-2xl font-semibold mt-1">{stats.activeSubscriptions}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Veicoli Totali</p>
              <p className="text-2xl font-semibold mt-1">{stats.totalVehicles}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Car className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasso di Abbandono</p>
              <p className="text-2xl font-semibold mt-1">{stats.churnRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-500 mt-1">
                {stats.deactivatedCount} clienti nel periodo
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <UserMinus className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Da Incassare</p>
              <p className="text-2xl font-semibold mt-1">€{stats.expectedMonthlyRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Performance Team di Vendita</h2>
          <SalesTeamChart salesTeamRevenue={stats.salesTeamRevenue} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Performance Sales Manager</h2>
          <SalesManagerChart salesManagerStats={stats.salesManagerStats} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-2 mb-4">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h2 className="text-lg font-semibold">Clienti Luxury</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Numero Clienti</p>
              <p className="text-2xl font-semibold">{stats.luxuryCustomersCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fatturato nel Periodo</p>
              <p className="text-2xl font-semibold">€{stats.luxuryRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Metodi di Pagamento</h2>
          <PaymentMethodsChart 
            paymentMethods={stats.paymentMethods} 
            totalCustomers={stats.activeSubscriptions}
          />
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <TopSpendersChart 
            customers={customers}
            payments={payments}
            limit={5}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;