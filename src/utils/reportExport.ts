import { utils, write } from 'xlsx';
import type { SalesManager } from '../types';

interface ReportData {
  activeSubscriptions: number;
  newCustomersCount: number;
  churnRate: number;
  totalRevenue: number;
  expectedMonthlyRevenue: number;
  luxuryCustomersCount: number;
  luxuryRevenue: number;
  salesTeamRevenue: Record<string, number>;
  salesManagerStats: Record<SalesManager, { subscriptions: number; revenue: number }>;
  deactivatedCount: number;
  totalVehicles: number;
  paymentMethods: Record<string, number>;
}

export const generateExcelReport = (data: ReportData, period: string) => {
  const workbook = utils.book_new();

  // Overview sheet
  const overviewData = [
    ['Report Subscription Manager', ''],
    ['Periodo:', period],
    [],
    ['Metriche Principali', ''],
    ['Abbonamenti Attivi', data.activeSubscriptions],
    ['Nuovi Clienti', data.newCustomersCount],
    ['Veicoli Totali', data.totalVehicles],
    ['Tasso di Abbandono', `${data.churnRate.toFixed(1)}%`],
    ['Clienti Disattivati', data.deactivatedCount],
    [],
    ['Metriche Finanziarie', ''],
    ['Fatturato nel Periodo', `€${data.totalRevenue.toFixed(2)}`],
    ['Da Incassare', `€${data.expectedMonthlyRevenue.toFixed(2)}`],
    [],
    ['Clienti Luxury', ''],
    ['Numero Clienti Luxury', data.luxuryCustomersCount],
    ['Fatturato Luxury', `€${data.luxuryRevenue.toFixed(2)}`],
  ];

  // Sales Team Revenue sheet
  const salesTeamData = [
    ['Performance Team di Vendita', ''],
    ['Team', 'Fatturato'],
    ...Object.entries(data.salesTeamRevenue).map(([team, revenue]) => [
      team === 'IT' ? 'Italia' :
      team === 'ES' ? 'Spagna' :
      team === 'FR' ? 'Francia' :
      team === 'WORLD' ? 'Mondo' : team,
      `€${revenue.toFixed(2)}`
    ])
  ];

  // Sales Manager Performance sheet
  const salesManagerData = [
    ['Performance Sales Manager', ''],
    ['Manager', 'Abbonamenti', 'Fatturato'],
    ...Object.entries(data.salesManagerStats).map(([manager, stats]) => [
      manager,
      stats.subscriptions,
      `€${stats.revenue.toFixed(2)}`
    ])
  ];

  // Payment Methods sheet
  const paymentMethodsData = [
    ['Metodi di Pagamento', ''],
    ['Metodo', 'Numero Clienti', 'Percentuale'],
    ...Object.entries(data.paymentMethods).map(([method, count]) => [
      method === 'stripe' ? 'Stripe' :
      method === 'bank_transfer' ? 'Bonifico' :
      method === 'cash' ? 'Contanti' :
      method === 'crypto' ? 'Crypto' : method,
      count,
      `${((count / data.activeSubscriptions) * 100).toFixed(1)}%`
    ])
  ];

  // Style the sheets
  const headerStyle = {
    font: { bold: true },
    fill: { fgColor: { rgb: "EDF2F7" } }
  };

  // Add sheets to workbook
  const sheets = [
    { name: 'Overview', data: overviewData },
    { name: 'Team di Vendita', data: salesTeamData },
    { name: 'Sales Manager', data: salesManagerData },
    { name: 'Metodi di Pagamento', data: paymentMethodsData }
  ];

  sheets.forEach(({ name, data }) => {
    const worksheet = utils.aoa_to_sheet(data);
    
    // Apply styles to headers
    const range = utils.decode_range(worksheet['!ref'] || 'A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = utils.encode_cell({ r: 0, c: C });
      if (!worksheet[address]) continue;
      worksheet[address].s = headerStyle;
    }

    utils.book_append_sheet(workbook, worksheet, name);
  });

  // Generate Excel file
  const excelBuffer = write(workbook, { 
    bookType: 'xlsx', 
    type: 'array',
    bookSST: false,
    compression: true
  });
  
  return new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
};