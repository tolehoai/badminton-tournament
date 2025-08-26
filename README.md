# 🏸 Badminton Tournament Manager

A comprehensive React-based tournament management application for badminton competitions with group stages and knockout rounds.

## ✨ Features

### 🏆 Tournament Management
- **4 Groups (A, B, C, D)** with 4 players each
- **Group Stage**: Round-robin matches within each group
- **Knockout Stage**: Top player from each group advances to semifinals
- **Final & Third Place**: Complete tournament bracket

### 👥 Player Management
- Add/Remove players from groups
- Move players between groups
- Player profile with detailed statistics
- Avatar support with fallback images

### 📊 Statistics & Rankings
- Real-time group standings
- Player statistics (wins, losses, win rate)
- Tournament progression tracking
- Podium display for final results

### 🎮 User Experience
- **Random Score Generation**: Auto-fill scores for testing
- **Keyboard Shortcuts**: ESC to close modals
- **Responsive Design**: Works on all devices
- **Bilingual Support**: Vietnamese and English

### 🎨 Modern UI
- Clean, modern interface
- Hover effects and animations
- Color-coded groups and rankings
- Professional tournament styling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/badminton-tournament.git

# Navigate to project directory
cd badminton-tournament

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Group.jsx       # Group management component
│   ├── KnockoutStage.jsx # Tournament bracket
│   ├── PlayerModals.jsx # Add/Move player modals
│   ├── PlayerProfile.jsx # Player details modal
│   ├── Podium.jsx      # Final results display
│   ├── Settings.jsx    # Settings menu
│   └── Stats.jsx       # Tournament statistics
├── constants/          # Application constants
│   └── data.js        # Initial data and text
├── hooks/             # Custom React hooks
│   └── useLocalStorage.js # Local storage hook
├── utils/             # Utility functions
│   └── helpers.js     # Helper functions
├── App.jsx            # Main application component
├── App.css            # Main stylesheet
└── main.jsx           # Application entry point
```

## 🎯 Tournament Rules

### Group Stage
- **Format**: Round-robin within each group
- **Scoring**: First to 15 points wins
- **Advancement**: Top player from each group

### Knockout Stage
- **Semifinals**: A1 vs B1, C1 vs D1
- **Scoring**: First to 21 points wins
- **Final**: Winner of semifinal 1 vs Winner of semifinal 2
- **Third Place**: Loser of semifinal 1 vs Loser of semifinal 2

## 🛠️ Development

### Code Style
- ESLint configuration included
- Consistent code formatting
- Component-based architecture
- Proper error handling

### State Management
- React hooks for local state
- LocalStorage for data persistence
- Custom hooks for reusable logic

### Styling
- CSS Grid for responsive layouts
- CSS Custom Properties for theming
- Mobile-first responsive design

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for fast development experience
- Badminton community for inspiration

---

**Made with ❤️ for badminton enthusiasts**
