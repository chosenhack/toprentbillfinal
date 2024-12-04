import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Users, 
  Search, 
  Plus, 
  Crown,
  ExternalLink,
  MoreVertical,
  Check,
  X
} from 'lucide-react';
import type { RootState, AppDispatch } from '../store';
import { addCustomer, updateCustomer, deactivateCustomer, reactivateCustomer } from '../store/slices/customersSlice';
import { addActivity } from '../store/slices/activitySlice';
import CustomerForm from '../components/CustomerForm';
import CustomerDetailsPopup from '../components/CustomerDetailsPopup';
import CsvImportExport from '../components/CsvImportExport';
import type { Customer } from '../types';

const CustomersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const customers = useSelector((state: RootState) => state.customers.items);
  const user = useSelector((state: RootState) => state.auth.user);

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
                          (statusFilter === 'active' && customer.active) ||
                          (statusFilter === 'inactive' && !customer.active);
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const handleAddCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const resultAction = await dispatch(addCustomer(customerData)).unwrap();
      
      dispatch(addActivity({
        type: 'customer_created',
        userId: user?.id || '',
        userName: user?.name || '',
        timestamp: new Date().toISOString(),
        details: {
          customerName: customerData.name,
          description: 'Nuovo cliente aggiunto'
        }
      }));

      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add customer:', error);
    }
  };

  const handleStatusChange = async (customer: Customer, newStatus: boolean) => {
    try {
      if (newStatus) {
        await dispatch(reactivateCustomer({
          id: customer.id,
          activationDate: new Date().toISOString()
        })).unwrap();

        dispatch(addActivity({
          type: 'customer_reactivated',
          userId: user?.id || '',
          userName: user?.name || '',
          timestamp: new Date().toISOString(),
          details: {
            customerName: customer.name,
            description: 'Cliente riattivato'
          }
        }));
      } else {
        await dispatch(deactivateCustomer({
          id: customer.id,
          deactivationDate: new Date().toISOString()
        })).unwrap();

        dispatch(addActivity({
          type: 'customer_deactivated',
          userId: user?.id || '',
          userName: user?.name || '',
          timestamp: new Date().toISOString(),
          details: {
            customerName: customer.name,
            description: 'Cliente disattivato'
          }
        }));
      }
    } catch (error) {
      console.error('Failed to update customer status:', error);
    }
  };

  const handleCustomerClick = (customer: Customer) => {
    setShowDetails(customer.id);
  };

  const getTeamFlag = (team: Customer['salesTeam']) => {
    switch (team) {
      case 'IT':
        return 'https://flagcdn.com/w40/it.png';
      case 'ES':
        return 'https://flagcdn.com/w40/es.png';
      case 'FR':
        return 'https://flagcdn.com/w40/fr.png';
      case 'WORLD':
        return '🌍';
      default:
        return '';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Clienti</h1>
        </div>
        <div className="flex items-center space-x-4">
          <CsvImportExport />
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Nuovo Cliente</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cerca clienti..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg ${
                  statusFilter === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Tutti
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-4 py-2 rounded-lg ${
                  statusFilter === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Attivi
              </button>
              <button
                onClick={() => setStatusFilter('inactive')}
                className={`px-4 py-2 rounded-lg ${
                  statusFilter === 'inactive'
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Inattivi
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Abbonamento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequenza
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stato
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Links
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Azioni</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer, index) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div 
                      className="flex items-center space-x-3 cursor-pointer hover:text-blue-600"
                      onClick={() => handleCustomerClick(customer)}
                    >
                      {customer.salesTeam !== 'WORLD' ? (
                        <img 
                          src={getTeamFlag(customer.salesTeam)} 
                          alt={`${customer.salesTeam} flag`}
                          className="w-6 h-4 object-cover rounded"
                        />
                      ) : (
                        <span className="text-lg">{getTeamFlag(customer.salesTeam)}</span>
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{customer.name}</span>
                          {customer.isLuxury && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        {customer.billingInfo && (
                          <div className="text-xs text-gray-500">
                            {customer.billingInfo.companyName}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {customer.subscriptionType.replace(/_/g, ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {customer.paymentFrequency === 'monthly' && 'Mensile'}
                      {customer.paymentFrequency === 'quarterly' && 'Trimestrale'}
                      {customer.paymentFrequency === 'biannual' && 'Semestrale'}
                      {customer.paymentFrequency === 'annual' && 'Annuale'}
                      {customer.paymentFrequency === 'oneTime' && 'Una Tantum'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">€{customer.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleStatusChange(customer, !customer.active)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        customer.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {customer.active ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Attivo
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-1" />
                          Inattivo
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {customer.stripeLink && (
                        <a
                          href={customer.stripeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {customer.crmLink && (
                        <a
                          href={customer.crmLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-500">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Nuovo Cliente</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <CustomerForm onSubmit={handleAddCustomer} />
          </div>
        </div>
      )}

      {showDetails && (
        <CustomerDetailsPopup
          customer={customers.find(c => c.id === showDetails)!}
          onClose={() => setShowDetails(null)}
        />
      )}
    </div>
  );
};

export default CustomersPage;