# PolyMetrics Frontend

A premium, production-grade analytics dashboard for Polymarket built with React, TypeScript, and TailwindCSS.

## Features

- 🌓 **Premium Dark Theme** - Fintech meets space aesthetic with glass morphism effects
- 📊 **Real-time Data** - Live markets, trades, and whale tracking  
- ⚡ **Fast & Responsive** - Built with Vite, optimized for performance
- 🎨 **Smooth Animations** - Framer Motion powered micro-interactions
- 🔄 **Smart Caching** - TanStack Query for efficient data fetching
- 📱 **Fully Responsive** - Works on mobile, tablet, and desktop

## Tech Stack

- **React 18** with TypeScript
- **Vite** for blazing fast development
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **TanStack Query** for data fetching/caching
- **React Router** for navigation
- **Radix UI** primitives for accessible components
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Backend API running on `http://localhost:8000`

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components (Button, Card, Dialog, etc.)
│   ├── Navbar.tsx    # Navigation bar
│   ├── Hero.tsx      # Landing page hero section
│   ├── StatPills.tsx # Stats display component
│   └── ...
├── pages/
│   ├── LandingPage.tsx  # Home page with hero
│   ├── MarketsPage.tsx  # Top markets display
│   ├── WhalesPage.tsx   # Whale tracker
│   ├── TradesPage.tsx   # Live trades feed
│   └── ApiPage.tsx      # API documentation
├── lib/
│   ├── api.ts           # API client
│   ├── hooks.ts         # React Query hooks
│   ├── queryClient.ts   # Query configuration
│   └── utils.ts         # Utility functions
└── App.tsx              # Main app with routing
```

## API Endpoints

The frontend connects to these backend routes:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| GET | `/home` | Top markets by volume |
| GET | `/whales` | Whale traders list |
| GET | `/trades?skip=0&limit=50` | Recent trades |

## Building for Production

```bash
npm run build
```

## License

MIT
