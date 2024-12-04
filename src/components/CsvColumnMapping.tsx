import React from 'react';
import { Check } from 'lucide-react';

interface CsvColumnMappingProps {
  headers: string[];
  mapping: Record<string, string>;
  onMappingChange: (field: string, header: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const REQUIRED_FIELDS = [
  { key: 'name', label: 'Nome' },
  { key: 'email', label: 'Email' },
  { key: 'subscriptionType', label: 'Tipo Abbonamento' },
  { key: 'paymentFrequency', label: 'Frequenza Pagamento' },
  { key: 'amount', label: 'Importo' },
  { key: 'salesTeam', label: 'Sales Team' }
];

const OPTIONAL_FIELDS = [
  { key: 'salesManager', label: 'Sales Manager' },
  { key: 'isLuxury', label: 'Luxury' },
  { key: 'vehicleCount', label: 'Veicoli' },
  { key: 'paymentMethod', label: 'Metodo Pagamento' },
  { key: 'companyName', label: 'Nome Azienda' },
  { key: 'vatNumber', label: 'P.IVA' },
  { key: 'country', label: 'Nazione' },
  { key: 'address', label: 'Indirizzo' },
  { key: 'sdi', label: 'SDI' },
  { key: 'pec', label: 'PEC' },
  { key: 'stripeLink', label: 'Link Stripe' },
  { key: 'crmLink', label: 'Link CRM' }
];

const CsvColumnMapping: React.FC<CsvColumnMappingProps> = ({
  headers,
  mapping,
  onMappingChange,
  onConfirm,
  onCancel
}) => {
  const isValidMapping = REQUIRED_FIELDS.every(field => mapping[field.key]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Mappatura Colonne CSV</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Campi Obbligatori</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {REQUIRED_FIELDS.map(field => (
                <div key={field.key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={mapping[field.key] || ''}
                    onChange={(e) => onMappingChange(field.key, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Seleziona colonna</option>
                    {headers.map(header => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Campi Opzionali</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {OPTIONAL_FIELDS.map(field => (
                <div key={field.key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <select
                    value={mapping[field.key] || ''}
                    onChange={(e) => onMappingChange(field.key, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Seleziona colonna</option>
                    {headers.map(header => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Annulla
          </button>
          <button
            onClick={onConfirm}
            disabled={!isValidMapping}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isValidMapping
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Conferma Mappatura</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CsvColumnMapping;