import React, { useState } from 'react';
import { useMoodDataContext } from '../../context/MoodDataContext';
import { Download, Upload, Trash2, Sun, Moon } from 'lucide-react';

interface SettingsProps {
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}

export const Settings: React.FC<SettingsProps> = ({ onToggleDarkMode, isDarkMode }) => {
  const { exportData, importData, clearAllData, entries } = useMoodDataContext();
  const [importFile, setImportFile] = useState<File | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleImport = async () => {
    if (!importFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const importResult = importData(result);
      
      if (importResult.success) {
        alert(`Successfully imported ${importResult.count} entries!`);
        setImportFile(null);
      } else {
        alert(`Import failed: ${importResult.error}`);
      }
    };
    reader.readAsText(importFile);
  };

  const handleClearData = () => {
    clearAllData();
    setShowClearConfirm(false);
    alert('All data has been cleared.');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your app preferences and data
        </p>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Switch between light and dark themes
            </p>
          </div>
          <button
            onClick={onToggleDarkMode}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{isDarkMode ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Data Management
        </h2>
        
        <div className="space-y-4">
          {/* Export */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Export Data</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Download your mood entries as JSON
              </p>
            </div>
            <button
              onClick={exportData}
              disabled={entries.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>

          {/* Import */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Import Data</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Import mood entries from JSON file
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="hidden"
                id="import-file"
              />
              <label
                htmlFor="import-file"
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                <Upload size={16} />
                <span>Choose File</span>
              </label>
              {importFile && (
                <button
                  onClick={handleImport}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Import
                </button>
              )}
            </div>
          </div>

          {/* Clear Data */}
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div>
              <p className="font-medium text-red-900 dark:text-red-400">Clear All Data</p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Permanently delete all mood entries
              </p>
            </div>
            <button
              onClick={() => setShowClearConfirm(true)}
              disabled={entries.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Trash2 size={16} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          App Information
        </h2>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Total Entries:</strong> {entries.length}</p>
          <p><strong>Data Storage:</strong> MongoDB</p>
          <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Clear All Data?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This action cannot be undone. All your mood entries will be permanently deleted.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 