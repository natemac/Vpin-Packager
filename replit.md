# File Organizer Pro - Virtual Pinball Edition

## Overview

This is a client-side file organization and packaging tool specifically designed for Virtual Pinball enthusiasts. The application allows users to upload table files, organize related assets (ROMs, media, backglasses, etc.) using custom folder structures, and generate ZIP packages for easy distribution. The system features preset templates for popular Virtual Pinball platforms like Pinball Emporium and Pinup Popper.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks with custom organization hook (`use-organization`)
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **File Processing**: Client-side file handling with JSZip for package generation

### Backend Architecture
- **Server**: Express.js with TypeScript (minimal - serves static files only)
- **Development**: Hot module replacement via Vite middleware
- **Storage**: No backend storage - application runs entirely client-side
- **Database**: Removed - no database dependencies
- **Authentication**: Removed - no user management needed

### Key Components

#### File Processing System
- **Client-side Processing**: All file operations happen in the browser
- **Template System**: Embedded organization templates with preset configurations (no server dependencies)
- **ZIP Generation**: Dynamic package creation with progress tracking
- **Image Conversion**: PNG conversion with compression options for media files

#### Organization System
- **Dynamic Item Management**: Add/remove organization items with different types (single, multiple, folder)
- **Preset Integration**: Built-in presets for popular Virtual Pinball platforms
- **File Tree Preview**: Real-time preview of the final package structure
- **Template Import/Export**: Save and load custom organization templates

#### User Interface
- **Responsive Design**: Mobile-first approach with desktop optimizations
- **Drag & Drop**: File upload zones with drag and drop support
- **Progress Tracking**: Real-time feedback during package generation
- **Toast Notifications**: User feedback for actions and errors

## Data Flow

1. **File Upload**: User selects a table file which initializes the organization
2. **Preset Selection**: Optional dialog to add preset items based on platform
3. **Item Configuration**: Users can add, modify, and organize file items
4. **Preview Generation**: Real-time file tree preview shows final structure
5. **Package Creation**: ZIP generation with progress tracking and download

## External Dependencies

### Core Libraries
- **React Ecosystem**: React 18, React DOM, React Router (Wouter)
- **UI Components**: Radix UI primitives, Lucide React icons
- **File Processing**: JSZip for archive creation
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS, class-variance-authority

### Development Tools
- **Build**: Vite with React plugin and runtime error overlay
- **Database**: Drizzle ORM with PostgreSQL adapter
- **TypeScript**: Full TypeScript support with path mapping
- **Development**: Hot reload, error boundaries, and debugging tools

## Deployment Strategy

### Development Environment
- **Replit Integration**: Configured for Replit development environment
- **Hot Reload**: Vite development server with HMR
- **Port Configuration**: Runs on port 5000 with external port mapping

### Production Build
- **Client Build**: Vite builds React application to `dist/public`
- **Server Build**: esbuild bundles server code to `dist/index.js`
- **Static Assets**: Served from build output directory
- **Database**: PostgreSQL with connection pooling via Neon

### Platform Configuration
- **Replit Modules**: Node.js 20 and web server (PostgreSQL removed)
- **Environment Variables**: None required for core functionality
- **Build Commands**: Static build for client-side deployment
- **GitHub Pages Ready**: Can be deployed as static site with minimal changes

## Changelog
- June 23, 2025: Initial setup
- June 23, 2025: Removed authentication system and database dependencies
- June 23, 2025: Converted to embedded templates for static deployment compatibility
- June 23, 2025: Removed unused JSON template files and simplified template loading
- June 23, 2025: Successfully deployed to GitHub Pages with production Vite config and correct base path

## User Preferences

Preferred communication style: Simple, everyday language.