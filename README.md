# 🌟 Mood Tracker - Professional Daily Mood Tracking Application

A modern, feature-rich mood tracking application built with React, TypeScript, and Tailwind CSS. Track your daily emotions, analyze patterns, and gain insights into your mental well-being.

## ✨ Features

### 🎯 Core Functionality
- **Daily Mood Logging**: Record your mood with 7 different emotion types (Happy, Sad, Anxious, Excited, Calm, Angry, Neutral)
- **Rich Notes**: Add detailed notes about what's affecting your mood
- **Intensity Tracking**: Rate your mood intensity on a 1-10 scale
- **Date Selection**: Log moods for any date, not just today

### 📊 Analytics & Insights
- **Interactive Dashboard**: Overview of your mood statistics and recent entries
- **Mood Trends**: Visual charts showing your mood patterns over time
- **Mood Distribution**: Pie charts displaying your most common emotions
- **Streak Tracking**: See your current logging streak
- **Mood Analytics**: Advanced insights including mood swings and trends

### 📅 Calendar View
- **Monthly Calendar**: Visual representation of your mood entries
- **Quick Overview**: See mood indicators for each day
- **Navigation**: Easy month-to-month browsing

### ⚙️ Advanced Features
- **Dark/Light Mode**: Toggle between themes
- **Data Export/Import**: Backup and restore your mood data
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Local Storage**: All data stored securely in your browser

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns for robust date operations
- **Icons**: Lucide React for beautiful icons
- **State Management**: React Context + Custom Hooks
- **Data Persistence**: Local Storage with JSON export/import

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mood-tracker.git
   cd mood-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Sample Data
To see the app in action with sample data:
1. Download the `sample-mood-data.json` file from this repository
2. Go to Settings → Import Data
3. Select the sample data file
4. Explore all features with realistic mood entries

## 📁 Project Structure

```
moodTracker/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard/       # Main dashboard view
│   │   ├── MoodEntry/       # Mood logging form
│   │   ├── MoodCalendar/    # Calendar view
│   │   ├── MoodAnalytics/   # Analytics and charts
│   │   ├── Navigation/      # Side navigation
│   │   └── Settings/        # App settings
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── styles/              # CSS and styling
├── public/                  # Static assets
└── sample-mood-data.json    # Sample data for testing
```

## 🎨 Key Features Explained

### Modular Architecture
- **Component-based**: Each feature is a separate, reusable component
- **Type Safety**: Full TypeScript implementation for better code quality
- **Custom Hooks**: Encapsulated logic for data management and local storage
- **Context API**: Global state management for mood data

### Scalable Design
- **Responsive**: Mobile-first design with Tailwind CSS
- **Accessible**: Semantic HTML and ARIA labels
- **Performance**: Optimized with React.memo and useCallback
- **Extensible**: Easy to add new features and mood types

### Data Management
- **Local Storage**: Persistent data storage in browser
- **Export/Import**: JSON-based data portability
- **Analytics**: Real-time mood analysis and insights
- **Backup**: Easy data backup and restoration

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 📦 Building for Production

Create an optimized production build:
```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React and TypeScript for type safety
- Styled with Tailwind CSS for modern design
- Charts powered by Recharts
- Icons from Lucide React

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ for better mental health tracking** 