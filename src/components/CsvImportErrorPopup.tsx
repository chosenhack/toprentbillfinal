import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface CsvImportErrorPopupProps {
  errors: Array<{
    row: number;
    errors: string[];
  }>;
  onClose: () => void;
}

const CsvImportErrorPopup: React.FC<CsvImportErrorPopupProps> = ({ errors, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold">Errori Importazione CSV</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {errors.map((error, index) => (
            <div key={index} className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-medium text-red-800">
                Riga {error.row}:
              </h3>
              <ul className="mt-2 list-disc list-inside text-red-700">
                {error.errors.map((err, errIndex) => (
                  <li key={errIndex}>{err}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};

export default CsvImportErrorPopup;