import React, { useState } from 'react';
import { useMoodDataContext } from '../../context/MoodDataContext';
import { MoodType } from '../../types/mood.types';
import { formatDate } from '../../utils/dateUtils';
import { Smile, Frown, Meh, Heart, Zap, Coffee, Angry } from 'lucide-react';

const moodOptions: { value: MoodType; label: string; icon: any; color: string }[] = [
  { value: 'happy', label: 'Happy', icon: Smile, color: 'bg-green-500 hover:bg-green-600' },
  { value: 'sad', label: 'Sad', icon: Frown, color: 'bg-blue-500 hover:bg-blue-600' },
  { value: 'anxious', label: 'Anxious', icon: Coffee, color: 'bg-yellow-500 hover:bg-yellow-600' },
  { value: 'excited', label: 'Excited', icon: Zap, color: 'bg-red-500 hover:bg-red-600' },
  { value: 'calm', label: 'Calm', icon: Heart, color: 'bg-purple-500 hover:bg-purple-600' },
  { value: 'angry', label: 'Angry', icon: Angry, color: 'bg-red-600 hover:bg-red-700' },
  { value: 'neutral', label: 'Neutral', icon: Meh, color: 'bg-gray-500 hover:bg-gray-600' },
];

export const MoodEntry: React.FC = () => {
  const { addEntry } = useMoodDataContext();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(formatDate(new Date()));
  const [intensity, setIntensity] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMood || !note.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addEntry(selectedMood, note.trim(), date, intensity);
      setSelectedMood(null);
      setNote('');
      setDate(formatDate(new Date()));
      setIntensity(5);
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          How are you feeling?
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Take a moment to reflect on your current mood
        </p>
      </div>

      {showSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Smile className="text-green-500" size={20} />
            <p className="text-green-800 dark:text-green-400 font-medium">
              Mood entry added successfully!
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Select your mood
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {moodOptions.map((mood) => {
              const Icon = mood.icon;
              const isSelected = selectedMood === mood.value;
              
              return (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? `${mood.color} border-transparent text-white shadow-lg transform scale-105`
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Icon size={24} />
                    <span className="text-sm font-medium">{mood.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Intensity Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Intensity: {intensity}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Note Input */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What's on your mind?
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe what's affecting your mood today..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedMood || !note.trim() || isSubmitting}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
        >
          {isSubmitting ? 'Adding Entry...' : 'Save Entry'}
        </button>
      </form>
    </div>
  );
}; 