import { addMonths, startOfYear, endOfYear } from 'date-fns';

export const getMonthsForYear = (year: number) => {
  const result = [];
  const startDate = startOfYear(new Date(year, 0, 1));
  
  // Get all 12 months of the specified year
  for (let i = 0; i < 12; i++) {
    result.push(addMonths(startDate, i));
  }
  return result;
};

export const getRenewalMonths = (customer: Customer, months: Date[]) => {
  const renewals = new Set<string>();
  let currentDate = parseISO(customer.activationDate);

  // For one-time payments, only show the activation month
  if (customer.paymentFrequency === 'oneTime') {
    months.forEach(month => {
      if (isSameMonth(currentDate, month)) {
        renewals.add(format(month, 'yyyy-MM'));
      }
    });
    return renewals;
  }

  // For recurring payments
  while (renewals.size < months.length) {
    months.forEach(month => {
      if (isSameMonth(currentDate, month)) {
        renewals.add(format(month, 'yyyy-MM'));
      }
    });

    // Add months based on payment frequency
    switch (customer.paymentFrequency) {
      case 'monthly':
        currentDate = addMonths(currentDate, 1);
        break;
      case 'quarterly':
        currentDate = addMonths(currentDate, 3);
        break;
      case 'biannual':
        currentDate = addMonths(currentDate, 6);
        break;
      case 'annual':
        currentDate = addMonths(currentDate, 12);
        break;
    }

    // Break if we've gone past the last month in our range
    if (isAfter(currentDate, months[months.length - 1])) {
      break;
    }
  }

  return renewals;
};