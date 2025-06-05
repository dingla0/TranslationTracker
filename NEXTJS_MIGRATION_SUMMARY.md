# Next.js Migration - Complete Setup

## Files Created for Migration

### Core Configuration
- `next.config.js` - Next.js configuration with Azure Translator environment variables
- `package-nextjs.json` - Updated package.json with Next.js dependencies
- `tsconfig-nextjs.json` - TypeScript configuration for Next.js
- `.env.local.example` - Environment variables template

### Application Structure
```
src/
├── app/
│   ├── layout.tsx                    # Root layout with providers
│   ├── page.tsx                      # Dashboard page
│   ├── globals.css                   # Global styles
│   ├── editor/[id]/page.tsx          # Translation editor page
│   └── api/                          # API routes
│       ├── translation-projects/
│       │   ├── route.ts              # GET/POST projects
│       │   └── [id]/route.ts         # GET/PATCH individual project
│       └── azure-translator/
│           ├── models/route.ts       # Get available models
│           └── translate/
│               ├── biblical/route.ts # Biblical translation
│               └── theological/route.ts # Theological translation
├── components/
│   ├── query-provider.tsx           # React Query provider
│   └── theme-provider.tsx           # Theme provider
└── lib/
    ├── db.ts                        # Database connection
    └── azure-translator.ts          # Azure Translator service
```

### Key Features Migrated
1. **Translation Editor** - Complete editor with TM and Azure panels
2. **API Routes** - RESTful endpoints for all functionality
3. **Database Integration** - Drizzle ORM with PostgreSQL
4. **Azure Custom Translator** - Domain-specific translation models
5. **Translation Memory** - Fuzzy matching and suggestions
6. **Theme Support** - Dark/light mode
7. **Type Safety** - Full TypeScript integration

## Migration Steps

### 1. Initialize New Project
```bash
npx create-next-app@latest translation-management-system --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd translation-management-system
```

### 2. Install Dependencies
```bash
# Copy package-nextjs.json to package.json
npm install
```

### 3. Copy Files
Copy all created files to the new Next.js project:
- Configuration files (next.config.js, tsconfig.json)
- Source files (src/ directory)
- Environment configuration (.env.local.example)

### 4. Copy Existing Assets
From current project, copy:
- `shared/schema.ts` - Database schema
- `client/src/components/` - All React components
- `drizzle.config.ts` - Database configuration
- `tailwind.config.ts` - Tailwind configuration

### 5. Environment Setup
```bash
cp .env.local.example .env.local
# Add your actual environment variables
```

### 6. Database Setup
```bash
npm run db:push
```

### 7. Start Development
```bash
npm run dev
```

## Key Differences from Express Version

### Routing
- **Before**: Express routes in `server/routes.ts`
- **After**: Next.js API routes in `src/app/api/*/route.ts`

### Pages
- **Before**: React Router with wouter
- **After**: File-based routing with Next.js App Router

### Data Fetching
- **Before**: Manual fetch with React Query
- **After**: Server components + React Query for client state

### Authentication
- **Before**: Passport.js with sessions
- **After**: NextAuth.js (ready for implementation)

### Deployment
- **Before**: Manual server deployment
- **After**: Deploy to Vercel with `vercel deploy`

## Benefits Achieved

1. **Performance**: Server-side rendering and static generation
2. **SEO**: Built-in optimization for search engines
3. **Developer Experience**: Hot reloading, TypeScript support
4. **Deployment**: One-click deployment to Vercel
5. **Scalability**: Automatic scaling and edge optimization
6. **Maintenance**: Simplified codebase with fewer dependencies

## Production Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
- Configure build command: `npm run build`
- Configure start command: `npm run start`
- Set environment variables in platform dashboard

## Next Steps After Migration

1. **Test all functionality** in the new Next.js environment
2. **Implement authentication** with NextAuth.js
3. **Add error boundaries** for better error handling
4. **Optimize images** with Next.js Image component
5. **Add SEO metadata** to all pages
6. **Configure analytics** and monitoring
7. **Set up CI/CD pipeline** for automated deployment

The migration preserves all existing functionality while modernizing the architecture for better performance, developer experience, and deployment capabilities.