# Overview

This is an IT Equipment Management System (P&R) designed for comprehensive tracking and management of computer and UPS (nobreak) equipment. The system is a full-stack web application built with React frontend and Express.js backend, featuring role-based access control, equipment CRUD operations, and client management. The application serves both administrators and regular users, with distinct permission levels for equipment management across multiple organizational clients.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design system following P&R brand guidelines (green primary color #6CB649, dark mode focus)
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Session Management**: PostgreSQL-based session store with connect-pg-simple
- **Development**: Hot module replacement with Vite integration

## Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon serverless configuration
- **Session Storage**: Database-backed sessions using pg-simple store
- **Schema Management**: Drizzle ORM with migrations support
- **File Storage**: Equipment photos handled via API upload system

## Authentication and Authorization
- **Role-Based Access**: Two-tier system (admin/user) with different permissions
- **Session-Based Auth**: Server-side session management with database persistence
- **User Profiles**: Support for profile images and user metadata
- **Permission Control**: Admins can manage clients/users/delete operations, users can only manage equipment

## Key Data Models
- **Users**: Authentication, roles, and profile information
- **Clients**: Organizational entities that own equipment
- **Equipment**: Unified table for computers and UPS devices with type differentiation
- **Sessions**: Mandatory table for authentication state management

## Component Architecture
- **Modular Design**: Reusable UI components with consistent design patterns
- **Form Components**: Specialized equipment forms with photo upload capabilities
- **Search & Filter**: Advanced filtering system for equipment management
- **Dashboard**: Statistics and quick action interface
- **Responsive Design**: Mobile-first approach with sidebar navigation

# External Dependencies

## UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives (dialogs, dropdowns, forms, etc.)
- **tailwindcss**: Utility-first CSS framework with custom design tokens
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library for consistent iconography

## Database and ORM
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **drizzle-orm**: Type-safe ORM with schema validation
- **drizzle-zod**: Zod integration for runtime validation

## Development and Build Tools
- **vite**: Fast build tool with HMR support
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development debugging tools
- **esbuild**: Fast JavaScript bundler for production builds

## Form and Validation
- **react-hook-form**: Performant form management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: TypeScript-first schema validation

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional className utilities
- **wouter**: Lightweight client-side routing
- **cmdk**: Command palette component