import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { addCustomer } from '../store/slices/customersSlice';
import { addActivity } from '../store/slices/activitySlice';
import type { Customer, SubscriptionType, PaymentFrequency, SalesTeam } from '../types';
import type { RootState } from '../store';
import Papa from 'papaparse';
import CsvImportErrorPopup from './CsvImportErrorPopup';
import CsvColumnMapping from './CsvColumnMapping';

const CsvImportExport = () => {
  const dispatch = useDispatch();
  const existingCustomers = useSelector((state: RootState) => state.customers.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{
    show: boolean;
    success: boolean;
    message: string;
  }>({ show: false, success: false, message: '' });
  const [importErrors, setImportErrors] = useState<Array<{
    row: number;
    errors: string[];
  }> | null>(null);
  const [showMapping, setShowMapping] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [parsedData, setParsedData] = useState<any[]>([]);

  const csvTemplate = `Nome,Email,Tipo Abbonamento,Frequenza Pagamento,Importo,Sales Team,Sales Manager,Luxury,Veicoli,Metodo Pagamento,Nome Azienda,P.IVA,Nazione,Indirizzo,SDI,PEC,Link Stripe,Link CRM
Top Service,info@topservice.it,FLEET_PRO,monthly,299.99,IT,Andrea,true,15,stripe,Top Service SRL,IT12345678901,Italia,"Via Roma 1, Milano",ABC123,pec@topservice.it,https://dashboard.stripe.com/customers/cus_xxx,https://crm.example.com/customer/123
Test Rent,admin@testrent.es,FLEET_BASIC,quarterly,199.99,ES,Hanna,false,8,bank_transfer,Test Rent SL,ES98765432109,Spagna,"Calle Mayor 23, Madrid",XYZ789,pec@testrent.es,https://dashboard.stripe.com/customers/cus_yyy,https://crm.example.com/customer/456
Luxury Cars,contact@luxurycars.fr,FLEET_PRO_BOOKING_ENGINE,annual,999.99,FR,Davide,true,25,crypto,Luxury Cars SARL,FR45678912345,Francia,"123 Avenue des Champs-Élysées, Paris",,info@luxurycars.fr,https://dashboard.stripe.com/customers/cus_zzz,https://crm.example.com/customer/789`;

  const validateSubscriptionType = (value: string): SubscriptionType | null => {
    const validTypes: SubscriptionType[] = [
      'SITO_1.0', 'FLEET_PRO_SITO_2.0', 'SITO_2.0', 'FLEET_SITO_2.0',
      'PERSONALIZZAZIONI', 'BOOKING_ENGINE', 'CUSTOM', 'FLEET_PRO_BOOKING_ENGINE',
      'FLEET_BASIC_BOOKING_ENGINE', 'PAY_AS_YOU_GO', 'FLEET_PRO', 'FLEET_BASIC'
    ];
    return validTypes.includes(value as SubscriptionType) ? value as SubscriptionType : null;
  };

  const validatePaymentFrequency = (value: string): PaymentFrequency | null => {
    const validFrequencies: PaymentFrequency[] = ['monthly', 'quarterly', 'biannual', 'annual', 'oneTime'];
    return validFrequencies.includes(value as PaymentFrequency) ? value as PaymentFrequency : null;
  };

  const validateSalesTeam = (value: string): SalesTeam | null => {
    const validTeams: SalesTeam[] = ['IT', 'ES', 'FR', 'WORLD'];
    return validTeams.includes(value as SalesTeam) ? value as SalesTeam : null;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        if (results.data.length > 0) {
          setCsvHeaders(Object.keys(results.data[0]));
          setParsedData(results.data);
          setShowMapping(true);
        }
      }
    });
  };

  const handleMappingChange = (field: string, header: string) => {
    setColumnMapping(prev => ({
      ...prev,
      [field]: header
    }));
  };

  const processImport = async () => {
    let successCount = 0;
    const errors: Array<{ row: number; errors: string[] }> = [];

    for (const [index, row] of parsedData.entries()) {
      const rowErrors: string[] = [];
      const mappedRow: Record<string, any> = {};

      // Map values using the column mapping
      Object.entries(columnMapping).forEach(([field, header]) => {
        if (header) {
          mappedRow[field] = row[header];
        }
      });

      // Validate required fields
      if (!mappedRow.name) rowErrors.push('Nome mancante');
      if (!mappedRow.email) rowErrors.push('Email mancante');
      if (!mappedRow.subscriptionType) rowErrors.push('Tipo abbonamento mancante');
      if (!mappedRow.paymentFrequency) rowErrors.push('Frequenza pagamento mancante');
      if (!mappedRow.amount) rowErrors.push('Importo mancante');
      if (!mappedRow.salesTeam) rowErrors.push('Team di vendita mancante');

      // Validate field formats
      const subscriptionType = validateSubscriptionType(mappedRow.subscriptionType);
      if (mappedRow.subscriptionType && !subscriptionType) {
        rowErrors.push('Tipo abbonamento non valido');
      }

      const paymentFrequency = validatePaymentFrequency(mappedRow.paymentFrequency);
      if (mappedRow.paymentFrequency && !paymentFrequency) {
        rowErrors.push('Frequenza pagamento non valida');
      }

      const salesTeam = validateSalesTeam(mappedRow.salesTeam);
      if (mappedRow.salesTeam && !salesTeam) {
        rowErrors.push('Team di vendita non valido');
      }

      const amount = parseFloat(mappedRow.amount);
      if (isNaN(amount) || amount <= 0) {
        rowErrors.push('Importo non valido');
      }

      const vehicleCount = parseInt(mappedRow.vehicleCount);
      if (mappedRow.vehicleCount && (isNaN(vehicleCount) || vehicleCount < 0)) {
        rowErrors.push('Numero veicoli non valido');
      }

      if (rowErrors.length > 0) {
        errors.push({ row: index + 2, errors: rowErrors });
        continue;
      }

      try {
        const customerData = {
          name: mappedRow.name.trim(),
          email: mappedRow.email.trim().toLowerCase(),
          subscriptionType,
          paymentFrequency,
          amount,
          salesTeam,
          salesManager: mappedRow.salesManager || 'Andrea',
          isLuxury: mappedRow.isLuxury?.toLowerCase() === 'true',
          vehicleCount: vehicleCount || 0,
          paymentMethod: mappedRow.paymentMethod || 'bank_transfer',
          active: true,
          activationDate: new Date().toISOString(),
          stripeLink: mappedRow.stripeLink?.trim() || '',
          crmLink: mappedRow.crmLink?.trim() || '',
          billingInfo: mappedRow.companyName ? {
            companyName: mappedRow.companyName.trim(),
            vatNumber: mappedRow.vatNumber?.trim(),
            country: mappedRow.country?.trim(),
            address: mappedRow.address?.trim(),
            sdi: mappedRow.sdi?.trim(),
            pec: mappedRow.pec?.trim()
          } : undefined
        };

        dispatch(addCustomer(customerData));
        
        dispatch(addActivity({
          type: 'customer_created',
          userId: user?.id || '',
          userName: user?.name || '',
          timestamp: new Date().toISOString(),
          details: {
            customerName: customerData.name,
            description: 'Cliente importato da CSV'
          }
        }));

        successCount++;
      } catch (error) {
        errors.push({
          row: index + 2,
          errors: ['Errore durante l\'importazione del cliente']
        });
      }
    }

    if (errors.length > 0) {
      setImportErrors(errors);
    }

    setImportStatus({
      show: true,
      success: errors.length === 0,
      message: `Importati ${successCount} nuovi clienti${errors.length > 0 ? `, ${errors.length} errori` : ''}`
    });

    setTimeout(() => {
      setImportStatus(prev => ({ ...prev, show: false }));
    }, 5000);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setShowMapping(false);
    setCsvHeaders([]);
    setColumnMapping({});
    setParsedData([]);
  };

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_clienti.csv';
    link.click();
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        <button
          onClick={downloadTemplate}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Download className="w-4 h-4" />
          <span>Scarica Template</span>
        </button>

        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csvInput"
          />
          <label
            htmlFor="csvInput"
            className="flex items-center space-x-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Importa CSV</span>
          </label>
        </div>

        {importStatus.show && (
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            importStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {importStatus.success ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{importStatus.message}</span>
          </div>
        )}
      </div>

      {showMapping && (
        <CsvColumnMapping
          headers={csvHeaders}
          mapping={columnMapping}
          onMappingChange={handleMappingChange}
          onConfirm={processImport}
          onCancel={() => {
            setShowMapping(false);
            setCsvHeaders([]);
            setColumnMapping({});
            setParsedData([]);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
        />
      )}

      {importErrors && (
        <CsvImportErrorPopup
          errors={importErrors}
          onClose={() => setImportErrors(null)}
        />
      )}
    </>
  );
};

export default CsvImportExport;