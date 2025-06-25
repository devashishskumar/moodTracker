# 🌟 Mood Tracker - Professional Daily Mood Tracking Application

A modern, feature-rich mood tracking application built with React, TypeScript, and MongoDB. Track your daily emotions, analyze patterns, and gain insights into your mental well-being.

## ✨ Features

### 🎯 Core Functionality
- **Daily Mood Logging**: Record your mood with 7 different emotion types (Happy, Sad, Anxious, Excited, Calm, Angry, Neutral)
- **Rich Notes**: Add detailed notes about what's affecting your mood with real-time validation
- **Intensity Tracking**: Rate your mood intensity on a 1-10 scale
- **Date Selection**: Log moods for any date, not just today
- **Calendar Modal**: View and edit all entries for a specific day

### 📊 Analytics & Insights
- **Interactive Dashboard**: Overview of your mood statistics and recent entries
- **Mood Trends**: Visual charts showing your mood patterns over time with zoom/scroll functionality
- **Mood Distribution**: Pie charts displaying your most common emotions
- **Streak Tracking**: See your current logging streak
- **Mood Analytics**: Advanced insights including mood swings and trends
- **Custom Date Ranges**: Analyze mood data for specific time periods

### 📅 Calendar View
- **Monthly Calendar**: Visual representation of your mood entries
- **Quick Overview**: See mood indicators for each day
- **Entry Management**: View, edit, and add entries directly from calendar
- **Navigation**: Easy month-to-month browsing

### ⚙️ Advanced Features
- **Dark/Light Mode**: Toggle between themes
- **Data Export/Import**: Backup and restore your mood data
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **MongoDB Backend**: Persistent data storage with REST API
- **Real-time Validation**: Character limits and content filtering for notes

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** with custom animations
- **Recharts** for data visualization
- **date-fns** for robust date operations
- **Lucide React** for beautiful icons
- **React Context** + Custom Hooks for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **REST API** for CRUD operations
- **CORS** enabled for cross-origin requests

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mood-tracker.git
   cd mood-tracker
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up MongoDB**
   
   **Option A: Local MongoDB**
   - Install MongoDB locally
   - Start MongoDB service
   - Create a database named `moodTracker`
   
   **Option B: MongoDB Atlas**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string
   - Update the connection string in `server/index.js`

5. **Start the backend server**
   ```bash
   cd server
   npm start
   ```
   The server will run on `http://localhost:5000`

6. **Start the frontend development server**
   ```bash
   npm start
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

### Environment Setup

Create a `.env` file in the `server` directory:
```env
MONGODB_URI=mongodb://localhost:27017/moodTracker
PORT=5000
```

For MongoDB Atlas, use your connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moodTracker
PORT=5000
```

### Sample Data
To see the app in action with sample data:
1. Download the `sample-mood-data.json` file from this repository
2. Go to Settings → Import Data
3. Select the sample data file
4. Explore all features with realistic mood entries

## �� Project Structure

```
moodTracker/
├── src/                     # Frontend React application
│   ├── components/          # React components
│   │   ├── Dashboard/       # Main dashboard view
│   │   ├── MoodEntry/       # Mood logging form
│   │   ├── MoodCalendar/    # Calendar view with modal
│   │   ├── MoodAnalytics/   # Analytics and charts
│   │   ├── Navigation/      # Side navigation
│   │   └── Settings/        # App settings
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── api/                 # API integration layer
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── server/                  # Backend Node.js application
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routes
│   └── index.js             # Server entry point
├── public/                  # Static assets
└── sample-mood-data.json    # Sample data for testing
```

## 🔧 API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/entries` - Get all mood entries
- `POST /api/entries` - Create a new mood entry
- `PUT /api/entries/:id` - Update an existing entry
- `DELETE /api/entries/:id` - Delete an entry
- `GET /api/entries/:id` - Get a specific entry

## 🎨 Key Features Explained

### Modular Architecture
- **Component-based**: Each feature is a separate, reusable component
- **Type Safety**: Full TypeScript implementation for better code quality
- **Custom Hooks**: Encapsulated logic for data management
- **Context API**: Global state management for mood data
- **REST API**: Clean separation between frontend and backend

### Scalable Design
- **Responsive**: Mobile-first design with Tailwind CSS
- **Accessible**: Semantic HTML and ARIA labels
- **Performance**: Optimized with React.memo and useCallback
- **Extensible**: Easy to add new features and mood types

### Data Management
- **MongoDB**: Persistent data storage with MongoDB
- **REST API**: Standard HTTP endpoints for data operations
- **Export/Import**: JSON-based data portability
- **Analytics**: Real-time mood analysis and insights
- **Validation**: Real-time form validation and content filtering

## 🧪 Testing

### Frontend Testing
```bash
npm test
```

### Backend Testing
```bash
cd server
npm test
```

## 📦 Building for Production

### Frontend Build
```bash
npm run build
```

### Backend Deployment
The backend can be deployed to platforms like:
- Heroku
- Railway
- Render
- DigitalOcean

Make sure to set the `MONGODB_URI` environment variable in your deployment platform.

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
- Backend powered by Node.js and MongoDB

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ for better mental health tracking** 
**Made with ❤️ for better mental health tracking** 