# Test Data Setup Guide

This guide helps you set up test data to verify all features of the Daily Mood Tracker Application.

## Quick Test Data Setup

### 1. Manual Entry (Recommended for first-time users)

1. **Register a new account**
   - Go to http://localhost:3000
   - Click "Create Account"
   - Fill in your details and register

2. **Create sample mood entries**
   - Click "Add Entry" or use the mood entry form
   - Create entries for the past 7 days with different moods:

   **Day 1 (Today)**
   - Mood: Happy
   - Notes: "Had a great day at work, completed all my tasks"
   - Intensity: 8/10

   **Day 2 (Yesterday)**
   - Mood: Calm
   - Notes: "Relaxing evening with family, feeling content"
   - Intensity: 7/10

   **Day 3**
   - Mood: Anxious
   - Notes: "Feeling stressed about upcoming presentation"
   - Intensity: 6/10

   **Day 4**
   - Mood: Excited
   - Notes: "Got good news about the project approval"
   - Intensity: 9/10

   **Day 5**
   - Mood: Sad
   - Notes: "Missing my friend who moved away"
   - Intensity: 5/10

   **Day 6**
   - Mood: Neutral
   - Notes: "Regular day, nothing special happened"
   - Intensity: 5/10

   **Day 7**
   - Mood: Angry
   - Notes: "Frustrated with traffic and delays"
   - Intensity: 7/10

### 2. Using Sample Data Files

#### Option A: Import via MongoDB Compass
1. Open MongoDB Compass
2. Connect to your database
3. Navigate to the `moodTracker` database
4. Import `sample-mood-data.json` into the `entries` collection

#### Option B: Using mongoimport
```bash
# Navigate to the project directory
cd /path/to/moodTracker

# Import sample data
mongoimport --db moodTracker --collection entries --file sample-mood-data.json --jsonArray
```

#### Option C: Using the API
```bash
# Create entries via API calls
curl -X POST http://localhost:5000/api/entries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "mood": "happy",
    "notes": "Sample entry for testing",
    "date": "2024-01-15",
    "intensity": 8
  }'
```

## Verification Checklist

### ✅ Basic Functionality
- [ ] User can register and log in
- [ ] User can create mood entries
- [ ] User can view their entries
- [ ] User can edit existing entries
- [ ] User can delete entries

### ✅ Mood Types
- [ ] Happy mood entry created
- [ ] Sad mood entry created
- [ ] Anxious mood entry created
- [ ] Excited mood entry created
- [ ] Calm mood entry created
- [ ] Angry mood entry created
- [ ] Neutral mood entry created

### ✅ Data Features
- [ ] Date selection works correctly
- [ ] Notes can be added and saved
- [ ] Intensity slider works (1-10 scale)
- [ ] Character limit validation works (500 chars max)
- [ ] Minimum note length validation works (10 chars min)

### ✅ Analytics and Insights
- [ ] Dashboard shows total entries count
- [ ] Average mood calculation is correct
- [ ] Current streak is displayed
- [ ] Mood trend is shown (improving/declining/stable)
- [ ] Recent entries are displayed

### ✅ Filtering and Search
- [ ] Filter by date range works
- [ ] Filter by mood type works
- [ ] Search by notes text works
- [ ] Combined filters work correctly

### ✅ UI/UX Features
- [ ] Responsive design works on mobile
- [ ] Dark/light mode toggle works
- [ ] Navigation between sections works
- [ ] Form validation messages are clear
- [ ] Loading states are shown during API calls

## Sample Test Scenarios

### Scenario 1: New User Journey
1. Register new account
2. Create first mood entry
3. View dashboard with single entry
4. Add more entries over several days
5. Check analytics and trends

### Scenario 2: Data Management
1. Create multiple entries
2. Edit an existing entry
3. Delete an entry
4. Verify dashboard updates correctly

### Scenario 3: Analytics Testing
1. Create entries with different moods
2. Create entries over different dates
3. Test various date range filters
4. Verify trend calculations

### Scenario 4: Error Handling
1. Try to submit empty form
2. Try to submit with short notes (< 10 chars)
3. Try to submit with very long notes (> 500 chars)
4. Test with invalid dates
5. Test with network disconnected

## Performance Testing

### Load Testing
```bash
# Test with multiple entries
for i in {1..50}; do
  curl -X POST http://localhost:5000/api/entries \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -d "{
      \"mood\": \"happy\",
      \"notes\": \"Test entry $i for performance testing\",
      \"date\": \"2024-01-$(printf '%02d' $i)\",
      \"intensity\": $((RANDOM % 10 + 1))
    }"
done
```

### Browser Testing
- Test in Chrome, Firefox, Safari, Edge
- Test on mobile devices
- Test with different screen sizes
- Test with slow network conditions

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Check network connectivity

2. **API Endpoints Not Working**
   - Verify backend server is running
   - Check CORS configuration
   - Verify API URL in frontend `.env`

3. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify JWT_SECRET in backend `.env`

4. **Test Failures**
   - Run `npm test -- --verbose` for detailed output
   - Check if all dependencies are installed
   - Verify test environment setup

### Debug Commands
```bash
# Check backend logs
cd server && npm start

# Check frontend logs
npm start

# Run tests with coverage
npm test -- --coverage

# Check MongoDB connection
mongo moodTracker --eval "db.entries.find().count()"
```

## Data Export/Import

### Export Your Data
```bash
# Export all entries
mongoexport --db moodTracker --collection entries --out my-entries.json
```

### Import Your Data
```bash
# Import entries
mongoimport --db moodTracker --collection entries --file my-entries.json --jsonArray
```

---

**Note**: This test data setup ensures you can verify all features of the application and provides a realistic dataset for testing analytics and insights. 