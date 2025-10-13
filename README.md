# StudyBuddy - Virtual Pet Study Companion

A gamified focus timer that lets you level up your virtual pet while studying. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎯 **Focus Timer**: Pomodoro and custom session lengths
- 🐱 **Virtual Pet**: Level up your pet with XP earned from study sessions
- 🛡️ **Anti-cheat**: Page focus tracking and interaction validation
- 📊 **Progress Tracking**: Daily/weekly stats and streak tracking
- 🎮 **Pet Care**: Feed your pet with coins earned from studying
- 🎨 **Cosmetics**: Unlock hats, collars, and toys for your pet

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: TanStack Query
- **UI Components**: Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account

### Setup

1. **Clone and install dependencies**:
   ```bash
   git clone <your-repo-url>
   cd studybuddy
   npm install
   ```

2. **Set up Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor

3. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The app uses the following main tables:

- **users**: User accounts and authentication
- **pets**: Virtual pets with level, XP, and coins
- **sessions**: Focus session tracking with anti-cheat data
- **xp_events**: XP transaction history
- **items**: Shop items (food and cosmetics)
- **inventories**: User item ownership
- **user_streaks**: Daily streak tracking

## Core Mechanics

### XP System
- **Base XP**: 5 XP per effective minute of focus
- **Streak Bonus**: +10% per consecutive day (capped at +50%)
- **Level Formula**: `req(level) = round(50 * level^1.6)`
- **Coins**: 10 coins per level gained

### Anti-cheat Measures
- **Page Focus**: No XP when tab is unfocused
- **Interaction Checks**: Light validation every 5-10 minutes
- **Session Validation**: XP caps and reasonable session lengths
- **Grace Period**: 5-second buffer for natural interruptions

### Pet System
- **Species**: Cat, Dog, Rabbit, Bird, Fish
- **Moods**: Happy (recent activity), Neutral, Sleepy (inactive)
- **Animations**: Idle, Eat, Sleep, Level Up
- **Cosmetics**: Hats, collars, toys (cosmetic only)

## Development

### Project Structure
```
src/
├── app/                 # Next.js app directory
├── components/         # React components
├── lib/               # Utilities and configurations
│   ├── supabase.ts    # Supabase client
│   ├── utils.ts       # Helper functions
│   └── query-client.ts # React Query setup
```

### Key Components
- **FocusTimer**: Main timer with Pomodoro/custom modes
- **PetDisplay**: Virtual pet with leveling and feeding
- **SessionStats**: Progress tracking and weekly charts

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
```
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Roadmap

- [ ] Authentication system
- [ ] Real-time pet animations
- [ ] Social features (friend leaderboards)
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Custom pet species
- [ ] Achievement system
- [ ] Study group features

## Support

If you encounter any issues or have questions, please open an issue on GitHub.