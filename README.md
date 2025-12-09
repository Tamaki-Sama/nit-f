# Workout Tracker

A comprehensive, feature-rich web application for tracking your workouts, monitoring progress, and managing fitness routines. Built with React and modern web technologies, this application provides an intuitive interface for logging exercises, analyzing performance, and maintaining detailed workout history.

## 🚀 Features

### Core Functionality
- **Daily Workout Logging**: Record exercises with sets, reps, and weights for any date
- **Exercise Management**: Create and organize custom exercises with categories
- **Progress Tracking**: View detailed performance metrics and progress over time
- **Calendar Integration**: Navigate between dates using a Persian (Jalaali) calendar
- **Workout History**: Access and review past workout sessions

### Advanced Features
- **Rest Timer**: Built-in countdown timer with auto-start functionality and audio alerts
- **Workout Copying**: Duplicate workouts between dates for easy planning
- **Routine Management**: Create and manage weekly workout routines
- **Performance Analytics**: 
  - Visual graphs and charts for progress tracking
  - Body measurements logging
  - Workout performance calculations (1RM, volume, etc.)
- **Daily Comments**: Add notes and comments to specific workout days
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Calculator Tools**:
  - 1RM (One Rep Max) calculator
  - Volume calculator
  - TDEE (Total Daily Energy Expenditure) calculator
  - Macro calculator
  - Pace and distance calculators

### User Experience
- **Persian Calendar Support**: Full support for Jalaali calendar system
- **Responsive Design**: Modern UI built with Ant Design components
- **Local Storage**: All data is stored locally in your browser
- **Real-time Updates**: Instant updates when logging workouts
- **Exercise Categories**: Organize exercises by custom categories

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 16.x or higher recommended)
- **npm** (comes with Node.js) or **yarn** package manager

You can verify your installation by running:
```bash
node --version
npm --version
```

## 🛠️ Installation

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   git clone <repository-url>
   cd nit.f
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

   This will install all required packages including:
   - React and React DOM
   - Vite (build tool)
   - Ant Design (UI components)
   - Recharts (for graphs and charts)
   - Date handling libraries (jalaali-js, react-modern-calendar-datepicker)

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## 📖 Usage Examples

### Basic Workout Logging

1. **Select an Exercise**:
   - Click the "انتخاب تمرین..." (Select Exercise) button
   - Choose from your exercise list or create a new one
   - Exercises can be filtered by category

2. **Set the Date**:
   - Use the calendar picker to select the workout date
   - Use "دیروز" (Yesterday) and "فردا" (Tomorrow) buttons for quick navigation

3. **Add Sets**:
   - Configure reps and weight for each set
   - Mark sets as completed during your workout
   - Add or remove sets as needed

4. **Save the Workout**:
   - Click "افزودن تمرین" (Add Exercise) to log the workout

### Using the Rest Timer

1. Click the timer icon in the top toolbar
2. Set your desired rest time (in seconds)
3. Start the timer - it will countdown and play an alarm when finished
4. Enable "شروع خودکار بعد از تیک خوردن" (Auto-start after checking) to automatically start the timer when you complete a set

### Copying Workouts Between Dates

1. Click the copy icon (📄) in the toolbar
2. Choose copy direction:
   - "کپی از امروز به تاریخ جدید" (Copy from today to new date)
   - "کپی از تاریخ جدید به امروز" (Copy from new date to today)
3. Select the target date
4. Preview and modify the workout list if needed
5. Confirm to copy all workouts

### Creating Workout Routines

1. Open the Tools menu (click the tools icon)
2. Navigate to "Routines" section
3. Create a new routine with multiple days
4. Assign exercises to each day
5. Import the routine to any selected date

### Viewing Progress

1. Open the Tools menu
2. Navigate to "Performance" or "Graphs" section
3. Select date range filters (all time, year, 6 months, 3 months, month)
4. View visual charts showing:
   - Exercise performance over time
   - Volume trends
   - 1RM progress
   - Body measurements

### Using Calculator Tools

1. Open the Tools menu
2. Click on "Calculator"
3. Select calculator type:
   - **1RM Calculator**: Calculate your one-rep max from weight and reps
   - **Volume Calculator**: Calculate total workout volume
   - **TDEE Calculator**: Calculate daily caloric needs
   - **Macro Calculator**: Calculate macronutrient breakdown
   - **Pace Calculator**: Calculate running pace
   - **Distance/Time Calculators**: Calculate distance or time for running

## 🏗️ Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be generated in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
nit.f/
├── src/
│   ├── components/          # React components
│   │   ├── Calculator.jsx   # Calculator tools
│   │   ├── Calendar.jsx     # Date picker component
│   │   ├── Graph.jsx        # Progress charts
│   │   ├── Tools.jsx        # Main tools panel
│   │   ├── WorkoutPicker.jsx # Exercise selection
│   │   └── routineComps/    # Routine management components
│   ├── App.jsx              # Main application component
│   ├── App.css              # Application styles
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── dist/                    # Production build output
├── package.json             # Dependencies and scripts
└── vite.config.js          # Vite configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint to check code quality
- `npm run surge` - Build and deploy to Surge.sh (if configured)

## 🗄️ Data Storage

All workout data, exercises, routines, and settings are stored locally in your browser's LocalStorage. This means:
- ✅ No account required
- ✅ Data stays on your device
- ✅ Works offline
- ⚠️ Data is browser-specific (clearing browser data will delete workouts)
- ⚠️ Data doesn't sync across devices

## 🎨 Customization

### Adding Custom Exercises

1. Open the Tools menu
2. Navigate to exercise management
3. Click "Add New Exercise"
4. Fill in:
   - Exercise name
   - Category
   - Whether it uses weight tracking
   - Special rep flags (if applicable)

### Creating Exercise Categories

1. Open the Tools menu
2. Navigate to category management
3. Create new categories with custom colors
4. Assign exercises to categories for better organization

## 🌐 Browser Support

This application works best in modern browsers that support:
- ES6+ JavaScript features
- LocalStorage API
- CSS Grid and Flexbox

Recommended browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 📝 Version History

The application includes an update log system. View recent updates and new features by checking the update modal that appears when new versions are released.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

[Specify your license here]

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- UI components from [Ant Design](https://ant.design/)
- Charts powered by [Recharts](https://recharts.org/)
- Date handling with [jalaali-js](https://github.com/jalaali/jalaali-js)
- Bundled with [Vite](https://vitejs.dev/)

## 📧 Support

For issues, questions, or suggestions, please open an issue in the repository or contact the maintainers.

---

**Note**: This is a web-based application that runs in your browser. All data is stored locally and does not require an internet connection after the initial load (except for loading the application itself).
