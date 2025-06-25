import React, { useState } from 'react';
import { useMoodDataContext } from '../context/MoodDataContext';
import { formatDateDisplay } from '../utils/dateUtils';
import { MoodType } from '../types/mood.types';

const moodColors: Record<string, string> = {
  happy: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  sad: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  anxious: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  excited: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  calm: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  angry: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
};

const moodOptions: { value: MoodType; label: string }[] = [
  { value: 'happy', label: 'Happy' },
  { value: 'sad', label: 'Sad' },
  { value: 'anxious', label: 'Anxious' },
  { value: 'excited', label: 'Excited' },
  { value: 'calm', label: 'Calm' },
  { value: 'angry', label: 'Angry' },
  { value: 'neutral', label: 'Neutral' },
];

const AllEntries: React.FC = () => {
  const { entries, updateEntry } = useMoodDataContext();
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const startEdit = (entry: any) => {
    setEditingId(entry.id);
    setEditData({ ...entry });
    setShowModal(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData((prev: any) => ({ ...prev, [name]: name === 'intensity' ? Number(value) : value }));
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId && editData) {
      updateEntry(editingId, {
        mood: editData.mood,
        note: editData.note,
        date: editData.date,
        intensity: editData.intensity,
      });
      setShowModal(false);
      setEditingId(null);
      setEditData(null);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingId(null);
    setEditData(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">All Mood Entries</h1>
      {sortedEntries.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No entries found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mood</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Intensity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Note</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedEntries.map(entry => (
                <tr key={entry.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatDateDisplay(entry.date)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${moodColors[entry.mood] || moodColors.neutral}`}>
                      {entry.mood}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{entry.intensity ?? '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">{entry.note}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <button
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium"
                      onClick={() => startEdit(entry)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Edit Entry</h2>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={editData.date}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mood</label>
                <select
                  name="mood"
                  value={editData.mood}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                >
                  {moodOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Intensity</label>
                <input
                  type="number"
                  name="intensity"
                  min={1}
                  max={10}
                  value={editData.intensity}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Note</label>
                <textarea
                  name="note"
                  value={editData.note}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEntries; 