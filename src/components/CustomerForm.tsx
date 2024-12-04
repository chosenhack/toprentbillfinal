import React, { useState, useEffect } from 'react';
import type { Customer, SubscriptionType, PaymentFrequency, BillingInfo, SalesTeam, PaymentMethod, SalesManager } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CustomerFormProps {
  onSubmit: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Customer | null;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, initialData }) => {
  const [showBilling, setShowBilling] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subscriptionType: '' as SubscriptionType,
    paymentFrequency: '' as PaymentFrequency,
    amount: '',
    stripeLink: '',
    crmLink: '',
    salesTeam: 'IT' as SalesTeam,
    salesManager: '' as SalesManager,
    isLuxury: false,
    active: true,
    activationDate: new Date().toISOString().split('T')[0],
    vehicleCount: 0,
    paymentMethod: '' as PaymentMethod,
    billingInfo: {
      companyName: '',
      vatNumber: '',
      country: '',
      address: '',
      sdi: '',
      pec: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        amount: initialData.amount.toString(),
        activationDate: initialData.activationDate.split('T')[0],
        billingInfo: initialData.billingInfo || {
          companyName: '',
          vatNumber: '',
          country: '',
          address: '',
          sdi: '',
          pec: '',
        }
      });
      setShowBilling(!!initialData.billingInfo);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customerData = {
      ...formData,
      amount: parseFloat(formData.amount),
      billingInfo: showBilling ? formData.billingInfo : undefined,
      activationDate: new Date(formData.activationDate).toISOString()
    };
    onSubmit(customerData);
  };

  const updateBillingInfo = (field: keyof BillingInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      billingInfo: {
        ...prev.billingInfo,
        [field]: value,
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Team di Vendita
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.salesTeam}
            onChange={(e) => setFormData(prev => ({ ...prev, salesTeam: e.target.value as SalesTeam }))}
          >
            <option value="IT">Italia</option>
            <option value="ES">Spagna</option>
            <option value="FR">Francia</option>
            <option value="WORLD">Mondo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sales Manager
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.salesManager}
            onChange={(e) => setFormData(prev => ({ ...prev, salesManager: e.target.value as SalesManager }))}
          >
            <option value="">Seleziona manager</option>
            <option value="Andrea">Andrea</option>
            <option value="Davide">Davide</option>
            <option value="Hanna">Hanna</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cliente Luxury
          </label>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                checked={formData.isLuxury}
                onChange={(e) => setFormData(prev => ({ ...prev, isLuxury: e.target.checked }))}
              />
              <span className="ml-2 text-sm text-gray-600">Cliente Luxury</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Numero Veicoli
          </label>
          <input
            type="number"
            required
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.vehicleCount}
            onChange={(e) => setFormData(prev => ({ ...prev, vehicleCount: parseInt(e.target.value) || 0 }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Metodo di Pagamento
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.paymentMethod}
            onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as PaymentMethod }))}
          >
            <option value="">Seleziona metodo</option>
            <option value="stripe">Stripe</option>
            <option value="bank_transfer">Bonifico</option>
            <option value="cash">Contanti</option>
            <option value="crypto">Crypto</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo Abbonamento
        </label>
        <select
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.subscriptionType}
          onChange={(e) => setFormData(prev => ({ ...prev, subscriptionType: e.target.value as SubscriptionType }))}
        >
          <option value="">Seleziona tipo</option>
          <option value="SITO_1.0">SITO 1.0</option>
          <option value="FLEET_PRO_SITO_2.0">FLEET PRO SITO 2.0</option>
          <option value="SITO_2.0">SITO 2.0</option>
          <option value="FLEET_SITO_2.0">FLEET SITO 2.0</option>
          <option value="PERSONALIZZAZIONI">PERSONALIZZAZIONI</option>
          <option value="BOOKING_ENGINE">BOOKING ENGINE</option>
          <option value="CUSTOM">CUSTOM</option>
          <option value="FLEET_PRO_BOOKING_ENGINE">FLEET PRO BOOKING ENGINE</option>
          <option value="FLEET_BASIC_BOOKING_ENGINE">FLEET BASIC BOOKING ENGINE</option>
          <option value="PAY_AS_YOU_GO">PAY AS YOU GO</option>
          <option value="FLEET_PRO">FLEET PRO</option>
          <option value="FLEET_BASIC">FLEET BASIC</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Frequenza Pagamento
        </label>
        <select
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.paymentFrequency}
          onChange={(e) => setFormData(prev => ({ ...prev, paymentFrequency: e.target.value as PaymentFrequency }))}
        >
          <option value="">Seleziona frequenza</option>
          <option value="monthly">Mensile</option>
          <option value="quarterly">Trimestrale</option>
          <option value="biannual">Semestrale</option>
          <option value="annual">Annuale</option>
          <option value="oneTime">Una Tantum</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Importo
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">€</span>
          </div>
          <input
            type="number"
            required
            step="0.01"
            className="pl-7 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data Attivazione
        </label>
        <input
          type="date"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.activationDate}
          onChange={(e) => setFormData(prev => ({ ...prev, activationDate: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Link Stripe
        </label>
        <input
          type="url"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.stripeLink}
          onChange={(e) => setFormData(prev => ({ ...prev, stripeLink: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Link CRM
        </label>
        <input
          type="url"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.crmLink}
          onChange={(e) => setFormData(prev => ({ ...prev, crmLink: e.target.value }))}
        />
      </div>

      <div className="border-t pt-6">
        <button
          type="button"
          onClick={() => setShowBilling(!showBilling)}
          className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
        >
          {showBilling ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>Informazioni di Fatturazione</span>
        </button>

        {showBilling && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome Azienda
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.billingInfo.companyName}
                onChange={(e) => updateBillingInfo('companyName', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                P.IVA
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.billingInfo.vatNumber}
                onChange={(e) => updateBillingInfo('vatNumber', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nazione
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.billingInfo.country}
                onChange={(e) => updateBillingInfo('country', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Indirizzo
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.billingInfo.address}
                onChange={(e) => updateBillingInfo('address', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                SDI
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.billingInfo.sdi}
                onChange={(e) => updateBillingInfo('sdi', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                PEC
              </label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.billingInfo.pec}
                onChange={(e) => updateBillingInfo('pec', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {initialData ? 'Aggiorna Cliente' : 'Aggiungi Cliente'}
      </button>
    </form>
  );
};

export default CustomerForm;