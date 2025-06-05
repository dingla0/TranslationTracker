# Translation Management System - Next.js Migration Guide

## Overview
This guide will help you refactor your current Express + React + Vite setup into a modern Next.js 14+ application with App Router for local development.

## Migration Steps

### 1. Initialize New Next.js Project

```bash
# Create new Next.js project
npx create-next-app@latest translation-management-system --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navigate to the project
cd translation-management-system
```

### 2. Install Required Dependencies

```bash
# Database and ORM
npm install drizzle-orm drizzle-kit @neondatabase/serverless

# UI Components (Radix UI + shadcn/ui)
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip

# Form handling and validation
npm install react-hook-form @hookform/resolvers zod zod-validation-error

# State management and data fetching
npm install @tanstack/react-query

# Utility libraries
npm install class-variance-authority clsx tailwind-merge date-fns uuid lucide-react react-icons framer-motion

# Authentication
npm install next-auth

# File uploads
npm install multer @types/multer

# Other utilities
npm install cmdk input-otp embla-carousel-react react-day-picker recharts vaul next-themes

# Development dependencies
npm install --save-dev @types/uuid @types/node
```

### 3. Project Structure

```
translation-management-system/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Dashboard page
│   │   ├── api/                     # API routes
│   │   │   ├── auth/                # Authentication routes
│   │   │   ├── translation-projects/
│   │   │   ├── contents/
│   │   │   ├── glossary/
│   │   │   ├── translation-memory/
│   │   │   └── azure-translator/
│   │   ├── content/                 # Content management page
│   │   ├── editor/                  # Translation editor
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── glossary/
│   │   ├── export/
│   │   ├── progress/
│   │   ├── users/
│   │   ├── search/
│   │   ├── quality/
│   │   ├── collaboration/
│   │   └── settings/
│   ├── components/                   # React components
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── layout/                  # Layout components
│   │   ├── editor/                  # Editor components
│   │   ├── translation-memory/      # TM components
│   │   └── azure-translator/        # Azure translator components
│   ├── lib/                         # Utility libraries
│   │   ├── db.ts                    # Database connection
│   │   ├── auth.ts                  # Authentication config
│   │   ├── utils.ts                 # General utilities
│   │   └── azure-translator.ts      # Azure translator service
│   └── types/                       # TypeScript type definitions
├── drizzle/                         # Database migrations
├── shared/                          # Shared schemas and types
│   └── schema.ts
├── public/                          # Static assets
├── drizzle.config.ts                # Drizzle configuration
├── next.config.js                   # Next.js configuration
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json
```

### 4. Configuration Files

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless']
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    AZURE_TRANSLATOR_ENDPOINT: process.env.AZURE_TRANSLATOR_ENDPOINT,
    AZURE_TRANSLATOR_KEY: process.env.AZURE_TRANSLATOR_KEY,
    AZURE_TRANSLATOR_REGION: process.env.AZURE_TRANSLATOR_REGION,
  }
}

module.exports = nextConfig
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/shared/*": ["./shared/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "shared/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 5. Key Migration Points

#### Database Connection (src/lib/db.ts)
```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '@/shared/schema';

neonConfig.webSocketConstructor = require('ws');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set');
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
```

#### API Routes Structure
Convert Express routes to Next.js API routes:

- `server/routes.ts` → Multiple files in `src/app/api/`
- Each endpoint becomes a separate route.ts file
- Use Next.js route handlers (GET, POST, PATCH, DELETE)

#### Authentication Migration
Replace Passport.js with NextAuth.js:

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)
```

#### Page Components
Convert React Router pages to Next.js pages:

- `client/src/pages/` → `src/app/[page-name]/page.tsx`
- Replace `wouter` routing with Next.js App Router
- Convert client-side routing to server-side routing

#### State Management
Update React Query for Next.js:

```typescript
// src/app/layout.tsx
import { QueryProvider } from '@/components/query-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
```

### 6. Environment Variables

Create `.env.local`:
```
DATABASE_URL=your_database_url
AZURE_TRANSLATOR_ENDPOINT=your_azure_endpoint
AZURE_TRANSLATOR_KEY=your_azure_key
AZURE_TRANSLATOR_REGION=your_azure_region
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 7. Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

### 8. Migration Checklist

- [ ] Set up new Next.js project
- [ ] Install all dependencies
- [ ] Copy and adapt database schema
- [ ] Migrate API routes from Express to Next.js
- [ ] Convert React Router pages to Next.js pages
- [ ] Update authentication system
- [ ] Migrate UI components
- [ ] Update state management and data fetching
- [ ] Configure environment variables
- [ ] Test all functionality
- [ ] Deploy to Vercel or preferred platform

### 9. Benefits of Migration

- **Better Performance**: Server-side rendering and static generation
- **Improved SEO**: Built-in SEO optimization
- **Simplified Deployment**: Deploy easily to Vercel, Netlify, or other platforms
- **Better Developer Experience**: Hot reloading, TypeScript support, and modern tooling
- **API Routes**: Built-in API handling without separate Express server
- **File-based Routing**: Automatic routing based on file structure
- **Built-in Optimization**: Image optimization, font optimization, and more

### 10. Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Push database schema
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

This migration will modernize your Translation Management System while preserving all existing functionality including the Translation Memory system and Azure Custom Translator integration.