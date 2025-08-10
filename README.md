# Furbio V3 Frontend Prototype

A minimal React prototype for the Furbio V3 Learning Management System. This is a **dummy data only** prototype for UX testing and visualization.

## Features

- ✅ Authentication flow (dummy login)
- ✅ Dashboard with metrics and charts
- ✅ Content Library (subjects, chapters, SPoints)
- ✅ Session Management (create, view, track progress)
- ✅ Practice Mode with MCQ and Flashcards
- ✅ Analytics with performance tracking
- ✅ Responsive Material-UI design

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Material-UI** for components
- **Zustand** for state management
- **React Router** for navigation
- **Recharts** for data visualization

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the frontend directory:
```bash
cd C:\Users\perso\Desktop\FFURBIO\furbio-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### Login
Use any email/password combination to login (it's dummy auth).

Example:
- Email: test@example.com
- Password: password123

## Project Structure

```
src/
├── components/     # Reusable UI components
├── data/          # Dummy data
├── layouts/       # Page layouts
├── pages/         # Page components
├── stores/        # Zustand stores
├── App.tsx        # Main app component
├── main.tsx       # Entry point
└── theme.ts       # MUI theme config
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Key Features Demo

### 1. Dashboard
- View learning metrics
- Performance charts
- Recent sessions
- Weak/strong areas

### 2. Content Library
- Browse subjects and chapters
- Filter by personal/global
- View SPoint counts

### 3. Sessions
- Create study/practice/mix sessions
- Track progress
- Resume incomplete sessions

### 4. Practice Mode
- Configure practice scope
- Select quiz formats
- Adaptive algorithm simulation

### 5. Analytics
- Performance trends
- Subject distribution
- Format-wise accuracy
- Progress tracking

## Notes

- **This is a prototype with dummy data only**
- No backend connection required
- All data is hardcoded for demonstration
- Perfect for UX testing and stakeholder reviews

## Next Steps

To connect to the real backend:
1. Replace dummy stores with API calls
2. Implement proper authentication
3. Add error handling
4. Implement remaining quiz formats
5. Add real-time features