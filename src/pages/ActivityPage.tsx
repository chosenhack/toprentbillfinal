import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  History, 
  User, 
  Calendar, 
  ArrowRight,
  FileText,
  Settings,
  Download,
  Mail,
  CreditCard
} from 'lucide-react';
import type { RootState } from '../store';
import { formatTimestamp, formatTime, formatDate } from '../utils/date';
import type { Activity, ActivityType } from '../types';

const ActivityPage = () => {
  const activities = useSelector((state: RootState) => 
    state.activity.items.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  );

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'customer_created':
      case 'customer_updated':
      case 'customer_deactivated':
      case 'customer_reactivated':
        return <User className="w-5 h-5 text-blue-600" />;
      case 'payment_created':
      case 'payment_confirmed':
      case 'payment_updated':
      case 'payment_status_updated':
        return <CreditCard className="w-5 h-5 text-green-600" />;
      case 'report_generated':
      case 'report_downloaded':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'report_emailed':
        return <Mail className="w-5 h-5 text-indigo-600" />;
      case 'settings_updated':
        return <Settings className="w-5 h-5 text-orange-600" />;
      case 'data_exported':
        return <Download className="w-5 h-5 text-yellow-600" />;
      case 'calendar_viewed':
        return <Calendar className="w-5 h-5 text-teal-600" />;
      case 'user_login':
      case 'user_logout':
        return <ArrowRight className="w-5 h-5 text-gray-600" />;
      default:
        return <History className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityDescription = (activity: Activity) => {
    if (!activity?.details) return 'Attività registrata';

    const { type, details } = activity;
    switch (type) {
      case 'customer_created':
        return `Nuovo cliente creato: ${details.customerName || 'Cliente'}`;
      case 'customer_updated':
        return `Cliente aggiornato: ${details.customerName || 'Cliente'}`;
      case 'customer_deactivated':
        return `Cliente disattivato: ${details.customerName || 'Cliente'}`;
      case 'customer_reactivated':
        return `Cliente riattivato: ${details.customerName || 'Cliente'}`;
      case 'payment_created':
        return `Nuovo pagamento registrato: €${details.amount?.toFixed(2) || '0.00'} per ${details.customerName || 'Cliente'}`;
      case 'payment_confirmed':
        return `Pagamento confermato: €${details.amount?.toFixed(2) || '0.00'} per ${details.customerName || 'Cliente'}`;
      case 'payment_updated':
        return `Pagamento aggiornato per ${details.customerName || 'Cliente'}`;
      case 'payment_status_updated':
        return `Stato pagamento aggiornato da ${details.oldStatus || 'precedente'} a ${details.newStatus || 'nuovo'} per ${details.customerName || 'Cliente'}`;
      case 'customers_imported':
        return `Importati ${details.importCount || 0} nuovi clienti`;
      case 'report_generated':
        return `Report generato per il periodo: ${details.reportPeriod || 'Non specificato'}`;
      case 'report_downloaded':
        return `Report scaricato per il periodo: ${details.reportPeriod || 'Non specificato'}`;
      case 'report_emailed':
        return `Report inviato via email a ${details.emailRecipient || 'destinatario'}`;
      case 'settings_updated':
        return `Impostazione "${details.settingName || 'Non specificata'}" aggiornata`;
      case 'data_exported':
        return `Dati esportati in formato ${details.exportType || 'Non specificato'}`;
      case 'calendar_viewed':
        return 'Calendario rinnovi visualizzato';
      case 'user_login':
        return 'Accesso effettuato';
      case 'user_logout':
        return 'Disconnessione effettuata';
      default:
        return details.description || 'Attività registrata';
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case 'customer_created':
        return 'bg-blue-100';
      case 'customer_updated':
        return 'bg-yellow-100';
      case 'customer_deactivated':
        return 'bg-red-100';
      case 'customer_reactivated':
        return 'bg-green-100';
      case 'payment_confirmed':
        return 'bg-green-100';
      case 'payment_updated':
        return 'bg-yellow-100';
      case 'report_generated':
      case 'report_downloaded':
        return 'bg-purple-100';
      case 'report_emailed':
        return 'bg-indigo-100';
      case 'settings_updated':
        return 'bg-orange-100';
      case 'data_exported':
        return 'bg-yellow-100';
      case 'calendar_viewed':
        return 'bg-teal-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <History className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Registro Attività</h1>
      </div>

      {activities.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Nessuna attività registrata</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.userName}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {getActivityDescription(activity)}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityPage;