# Arnav Dashaputra Portfolio

## Overview
Personal portfolio website for Arnav Dashaputra, a Full-Stack Software Engineer and Rutgers University CS/Data Science graduate.

## Tech Stack
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Framer Motion for animations

## Project Structure
```
src/
  components/          # Reusable UI components
    layout/            # Header, Footer, Layout wrapper
    ui/                # Buttons, Cards, common UI elements
    sections/          # Page sections (Hero, About, Projects, etc.)
    visualization/     # Interactive canvas components (ParticleNetwork)
  pages/               # Route pages
  hooks/               # Custom React hooks
  types/               # TypeScript type definitions
  data/                # Static content data (projects, experience)
  styles/              # Global styles
public/                # Static assets served at root
  images/              # All images (grid.jpg, pfp2.png)
    portfolio/         # Project/work tile images
  ArnavDashaputra_Resume2025.pdf
  favicon.svg
content/               # Reference text files (LinkedIn, Resume, etc.)
```

## Key Features
- Interactive particle network visualization (hero section)
- Responsive design with mobile-first approach
- Project portfolio with filtering
- Experience timeline
- Contact information section
- Individual project detail pages

## Commands
```bash
npm install       # Install dependencies
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

## Content
- **Owner**: Arnav Dashaputra
- **Email**: arnav.dashaputra@gmail.com
- **GitHub**: github.com/ArnavD74
- **LinkedIn**: linkedin.com/in/dashaputra
- **Domain**: dashaputra.net

## Design Notes
- Dark theme with high contrast
- Primary accent color for highlights
- Clean, minimal aesthetic
- Particle network animation responds to mouse interaction (repel on hover, attract on click)
