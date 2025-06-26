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
  const { entries, updateEntry, deleteEntry } = useMoodDataContext();
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [noteError, setNoteError] = useState<string>('');

  const startEdit = (entry: any) => {
    setEditingId(entry._id);
    setEditData({ ...entry });
    setShowModal(true);
    setNoteError('');
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData((prev: any) => ({ ...prev, [name]: name === 'intensity' ? Number(value) : value }));
    
    // Validate note field
    if (name === 'note') {
      if (value.trim().length < 3) {
        setNoteError('Note must be at least 3 characters long');
      } else if (value.trim().length > 500) {
        setNoteError('Note cannot exceed 500 characters');
      } else {
        setNoteError('');
      }
    }
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate note before saving
    if (editData.note.trim().length < 3) {
      setNoteError('Note must be at least 3 characters long');
      return;
    }
    
    if (editData.note.trim().length > 500) {
      setNoteError('Note cannot exceed 500 characters');
      return;
    }
    
    if (editingId && editData) {
      updateEntry(editingId, {
        mood: editData.mood,
        note: editData.note.trim(),
        date: editData.date,
        intensity: editData.intensity,
      });
      setShowModal(false);
      setEditingId(null);
      setEditData(null);
      setNoteError('');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingId(null);
    setEditData(null);
    setNoteError('');
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
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
                <tr key={entry._id}>
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
                    <div className="flex space-x-2">
                      <button
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium"
                        onClick={() => startEdit(entry)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium"
                        onClick={() => entry._id && setDeleteConfirmId(entry._id)}
                      >
                        Delete
                      </button>
                    </div>
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
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                    noteError 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  {noteError && (
                    <span className="text-red-500 text-sm">{noteError}</span>
                  )}
                  <span className={`text-sm ${editData.note.length > 450 ? 'text-orange-500' : 'text-gray-500'}`}>
                    {editData.note.length}/500
                  </span>
                </div>
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Confirm Delete</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this mood entry? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEntries; 