# StudentConnect

A modern, AI-powered student platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Dynamic Theming**: Each tab has its own beautiful light color theme
- **8 Main Screens**: Dashboard, AI Study Assistant, Resume & Placement Prep, Study Materials, Networking, Study Groups, Daily Learning Tracker, and Profile
- **Responsive Design**: Executive-style dashboard with smooth animations
- **AI Integration**: Placeholders for AI features powered by RunPod
- **Modern Stack**: Next.js 14 with App Router, TypeScript, Tailwind V4

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (tabs)/            # Tab pages (dashboard, ai-assistant, etc.)
│   ├── auth/              # Authentication pages
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout with navigation
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── shared/           # Shared UI components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities and helpers
└── styles/               # Global styles and themes
```

## Theming

The application uses a dynamic theming system where each tab has its own color palette:

- **Dashboard**: Light Blue
- **AI Assistant**: Light Purple  
- **Placement Prep**: Light Green
- **Study Materials**: Light Orange
- **Networking**: Light Pink
- **Study Groups**: Light Teal
- **Learning Tracker**: Light Indigo
- **Profile**: Light Amber

## Development

The project follows Next.js 14 best practices with:

- App Router for file-based routing
- Server Components by default
- TypeScript for type safety
- ESLint + Prettier for code quality
- Tailwind V4 for styling
- Motion for animations