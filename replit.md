# Vidify (TubeFetcher)

## Overview
A video download web application built with Next.js that allows users to download videos from YouTube and other platforms. Features a modern, glassmorphism UI design.

## Project Architecture
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Port**: 5000 (development and production)

## Project Structure
```
app/                    # Next.js App Router pages
  api/                  # API routes
    download/           # Video download endpoint
    info/               # Video info endpoint
  contact/              # Contact page
  privacy-policy/       # Privacy policy page
  terms/                # Terms of service page
components/             # React components
  ui/                   # Reusable UI components
lib/                    # Utility functions and types
```

## Running the Project
- Development: `npm run dev -- -H 0.0.0.0 -p 5000`
- Build: `npm run build`
- Production: Uses standalone output with `node .next/standalone/server.js`

## Configuration
- `next.config.js`: Configured with `allowedDevOrigins: ['*']` for Replit proxy compatibility
- `output: "standalone"` for optimized production builds

## Recent Changes
- 2025-12-31: Initial Replit setup - configured Next.js for Replit environment
