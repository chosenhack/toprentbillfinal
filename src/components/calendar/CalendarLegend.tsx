import React from 'react';
import { Check, AlertCircle, Clock, RefreshCw } from 'lucide-react';

const CalendarLegend = () => {
  return (
    <div className="flex items-center justify-center space-x-6 px-6 py-3 bg-gray-50 border-t">
      <div className="flex items-center space-x-2">
        <div className="bg-green-50 p-2 rounded">
          <Check className="w-4 h-4 text-green-600" />
        </div>
        <span className="text-sm text-gray-600">Confermato</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="bg-yellow-50 p-2 rounded">
          <Clock className="w-4 h-4 text-yellow-600" />
        </div>
        <span className="text-sm text-gray-600">In Attesa</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="bg-red-50 p-2 rounded">
          <AlertCircle className="w-4 h-4 text-red-600" />
        </div>
        <span className="text-sm text-gray-600">Problema</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="bg-blue-50 p-2 rounded">
          <RefreshCw className="w-4 h-4 text-blue-600" />
        </div>
        <span className="text-sm text-gray-600">In Elaborazione</span>
      </div>
    </div>
  );
};

export default CalendarLegend;