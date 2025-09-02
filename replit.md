# Overview
Hi :)
Insightoard is a full-stack feedback management system that allows users to submit, track, and analyze feedback. The application features a dashboard for viewing analytics, a submission form for new feedback, and comprehensive management tools for organizing and responding to user feedback. It includes sentiment analysis, categorization, and real-time analytics with interactive charts.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with CSS variables for theming support
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Charts**: Chart.js with react-chartjs-2 for data visualization

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas shared between client and server
- **Storage**: In-memory storage implementation with interface for easy database integration
- **API Design**: RESTful endpoints with proper error handling and logging

## Data Layer
- **Database**: PostgreSQL configured via Drizzle (though currently using in-memory storage)
- **Schema**: Centralized schema definitions in `/shared/schema.ts` using Drizzle ORM
- **Migrations**: Drizzle Kit for database migrations and schema management
- **Connection**: Neon Database serverless driver for PostgreSQL connectivity

## Key Features
- **Feedback Management**: CRUD operations for feedback with status tracking
- **Sentiment Analysis**: Automatic sentiment detection using keyword-based analysis
- **Analytics Dashboard**: Real-time metrics with interactive charts and data visualization
- **Filtering & Search**: Advanced filtering by status, category, date range, and text search
- **Form Validation**: Comprehensive client and server-side validation
- **Responsive Design**: Mobile-first design with adaptive layouts

## Development Setup
- **Hot Reload**: Vite HMR for fast development cycles
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared code
- **Path Aliases**: Configured import aliases for clean code organization
- **Build Process**: Separate build processes for client (Vite) and server (esbuild)

# External Dependencies

## Core Dependencies
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe SQL query builder and ORM
- **@neondatabase/serverless**: PostgreSQL database driver
- **wouter**: Lightweight React router
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation integration
- **zod**: Runtime type validation and schema definition

## UI Dependencies
- **@radix-ui/***: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Variant-based component styling
- **clsx**: Conditional className utilities
- **lucide-react**: Icon library

## Chart Dependencies
- **chart.js**: Data visualization library
- **react-chartjs-2**: React wrapper for Chart.js
- **embla-carousel-react**: Carousel/slider components

## Development Dependencies
- **vite**: Frontend build tool and dev server
- **typescript**: Static type checking
- **drizzle-kit**: Database migration and introspection tools
- **esbuild**: Fast JavaScript bundler for server builds
- **tsx**: TypeScript execution for development

## Database Setup
- Environment variable `DATABASE_URL` required for PostgreSQL connection
- Drizzle configuration points to `/shared/schema.ts` for schema definitions
- Migration files stored in `/migrations` directory