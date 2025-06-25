import React, { useState } from 'react';
import { useMoodDataContext } from '../../context/MoodDataContext';
import { formatDate, formatDateDisplay } from '../../utils/dateUtils';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { MoodType } from '../../types/mood.types';

export const MoodCalendar: React.FC = () => {
  const { entries, getEntriesByDate, updateEntry, addEntry } = useMoodDataContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [adding, setAdding] = useState(false);
  const [addData, setAddData] = useState<any>({ mood: 'happy', note: '', intensity: 5 });
  const [formError, setFormError] = useState('');

  const moodOptions: { value: MoodType; label: string }[] = [
    { value: 'happy', label: 'Happy' },
    { value: 'sad', label: 'Sad' },
    { value: 'anxious', label: 'Anxious' },
    { value: 'excited', label: 'Excited' },
    { value: 'calm', label: 'Calm' },
    { value: 'angry', label: 'Angry' },
    { value: 'neutral', label: 'Neutral' },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getMoodColor = (mood: string) => {
    const colors = {
      happy: 'bg-green-500',
      sad: 'bg-blue-500',
      anxious: 'bg-yellow-500',
      excited: 'bg-red-500',
      calm: 'bg-purple-500',
      angry: 'bg-red-600',
      neutral: 'bg-gray-500',
    };
    return colors[mood as keyof typeof colors] || colors.neutral;
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 dark:bg-gray-800"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = formatDate(date);
      const dayEntries = getEntriesByDate(dateStr);
      
      days.push(
        <div
          key={day}
          className="h-24 border border-gray-200 dark:border-gray-700 p-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
          onClick={() => dayEntries.length > 0 && (setModalDate(dateStr), setModalOpen(true))}
        >
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {day}
            </span>
            {dayEntries.length > 0 && (
              <div className="flex space-x-1">
                {dayEntries.slice(0, 3).map((entry, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${getMoodColor(entry.mood)}`}
                    title={`${entry.mood}: ${entry.note}`}
                  />
                ))}
                {dayEntries.length > 3 && (
                  <div className="w-2 h-2 rounded-full bg-gray-400 text-xs flex items-center justify-center">
                    +
                  </div>
                )}
              </div>
            )}
          </div>
          {dayEntries.length > 0 && (
            <div className="mt-1 space-y-1 max-h-16 overflow-hidden">
              {dayEntries.slice(0, 2).map((entry, idx) => (
                <span
                  key={entry._id || idx}
                  className={`block px-2 py-1 rounded-md text-xs font-medium text-white truncate w-full ${getMoodColor(entry.mood)}`}
                  title={entry.mood}
                >
                  {entry.note}
                </span>
              ))}
              {dayEntries.length > 2 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                  +{dayEntries.length - 2} more entries
                </span>
              )}
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Modal rendering
  const selectedEntries = modalDate ? getEntriesByDate(modalDate) : [];

  // Validation logic (reuse from MoodEntry)
  const MIN_NOTE_LENGTH = 10;
  const MAX_NOTE_LENGTH = 500;
  const INAPPROPRIATE_PATTERNS = [
    /\b(fuck|shit|bitch|asshole|damn|hell)\b/gi,
    /\b(kill|die|suicide|death)\b/gi,
    /[A-Z]{5,}/g,
    /[!]{3,}/g,
    /[?]{3,}/g,
  ];
  const validateNote = (text: string): string => {
    if (text.length < MIN_NOTE_LENGTH) return `Note must be at least ${MIN_NOTE_LENGTH} characters long`;
    if (text.length > MAX_NOTE_LENGTH) return `Note cannot exceed ${MAX_NOTE_LENGTH} characters`;
    for (const pattern of INAPPROPRIATE_PATTERNS) if (pattern.test(text)) return 'Please keep your note respectful and appropriate';
    if (/(.)\1{4,}/g.test(text)) return 'Please avoid excessive repetitive characters';
    if (text.trim().length === 0) return 'Note cannot be empty';
    return '';
  };

  // Edit logic
  const startEdit = (entry: any) => {
    setEditingId(entry._id);
    setEditData({ ...entry });
    setFormError('');
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData((prev: any) => ({ ...prev, [name]: name === 'intensity' ? Number(value) : value }));
  };
  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateNote(editData.note);
    if (error) { setFormError(error); return; }
    // Only send updatable and required fields
    const { _id, __v, ...rest } = editData;
    const updates = {
      mood: rest.mood,
      note: rest.note,
      date: rest.date,
      intensity: rest.intensity,
      tags: rest.tags
    };
    updateEntry(editingId!, updates);
    setEditingId(null);
    setEditData(null);
    setFormError('');
  };
  const handleEditCancel = () => {
    setEditingId(null);
    setEditData(null);
    setFormError('');
  };

  // Add logic
  const startAdd = () => {
    setAdding(true);
    setAddData({ mood: 'happy', note: '', intensity: 5 });
    setFormError('');
  };
  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddData((prev: any) => ({ ...prev, [name]: name === 'intensity' ? Number(value) : value }));
  };
  const handleAddSave = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateNote(addData.note);
    if (error) { setFormError(error); return; }
    addEntry(addData.mood, addData.note, modalDate!, addData.intensity);
    setAdding(false);
    setAddData({ mood: 'happy', note: '', intensity: 5 });
    setFormError('');
  };
  const handleAddCancel = () => {
    setAdding(false);
    setAddData({ mood: 'happy', note: '', intensity: 5 });
    setFormError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mood Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View your mood patterns over time
          </p>
        </div>
        <button
          onClick={goToToday}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Today
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>
        </div>
      </div>
      {/* Modal for day entries */}
      {modalOpen && modalDate && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={() => setModalOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-lg relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={() => setModalOpen(false)}>
              <X size={22} />
            </button>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Entries for {formatDateDisplay(modalDate)}</h2>
            {selectedEntries.length === 0 && !adding && (
              <p className="text-gray-600 dark:text-gray-400">No entries for this day.</p>
            )}
            <div className="space-y-4 max-h-96 overflow-y-auto mt-4">
              {selectedEntries.map((entry, idx) => (
                <div key={entry._id || idx} className={`p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col space-y-1 ${getMoodColor(entry.mood)}`}>
                  {editingId === entry._id ? (
                    <form onSubmit={handleEditSave} className="space-y-2">
                      <div className="flex space-x-2">
                        <select name="mood" value={editData.mood} onChange={handleEditChange} className="rounded px-2 py-1 text-xs">
                          {moodOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        <input type="number" name="intensity" min={1} max={10} value={editData.intensity} onChange={handleEditChange} className="rounded px-2 py-1 text-xs w-16" />
                      </div>
                      <textarea name="note" value={editData.note} onChange={handleEditChange} rows={2} className="w-full rounded px-2 py-1 text-xs mt-1" />
                      {formError && <div className="text-xs text-red-500">{formError}</div>}
                      <div className="flex space-x-2 mt-1">
                        <button type="button" onClick={handleEditCancel} className="px-2 py-1 bg-gray-300 rounded text-xs">Cancel</button>
                        <button type="submit" className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Save</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white capitalize">{entry.mood}</span>
                        <span className="text-xs text-white">Intensity: {entry.intensity}</span>
                      </div>
                      <div className="text-xs text-white break-words">{entry.note}</div>
                      <button onClick={() => startEdit(entry)} className="mt-1 px-2 py-1 bg-blue-600 text-white rounded text-xs self-end">Edit</button>
                    </>
                  )}
                </div>
              ))}
              {adding && (
                <form onSubmit={handleAddSave} className="p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col space-y-2 bg-gray-50 dark:bg-gray-700/30">
                  <div className="flex space-x-2">
                    <select name="mood" value={addData.mood} onChange={handleAddChange} className="rounded px-2 py-1 text-xs">
                      {moodOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <input type="number" name="intensity" min={1} max={10} value={addData.intensity} onChange={handleAddChange} className="rounded px-2 py-1 text-xs w-16" />
                  </div>
                  <textarea name="note" value={addData.note} onChange={handleAddChange} rows={2} className="w-full rounded px-2 py-1 text-xs mt-1" />
                  {formError && <div className="text-xs text-red-500">{formError}</div>}
                  <div className="flex space-x-2 mt-1">
                    <button type="button" onClick={handleAddCancel} className="px-2 py-1 bg-gray-300 rounded text-xs">Cancel</button>
                    <button type="submit" className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Add</button>
                  </div>
                </form>
              )}
            </div>
            {!adding && (
              <button onClick={startAdd} className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm w-full">Add New Entry</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 