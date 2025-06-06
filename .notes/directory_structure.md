# Directory Structure

## Current Project Structure (Express + React)

```
translation-management-system/
├── client/                                    # React frontend application
│   ├── src/
│   │   ├── components/                        # Reusable UI components
│   │   │   ├── ui/                           # shadcn/ui base components (Button, Card, Input, etc.)
│   │   │   ├── layout/                       # Layout components (Header, Sidebar, Navigation)
│   │   │   ├── editor/                       # Translation editor components
│   │   │   ├── translation-memory/           # TM panel and suggestion components
│   │   │   └── azure-translator/             # Azure Custom Translator integration components
│   │   ├── hooks/                            # Custom React hooks
│   │   │   ├── use-auth.ts                  # Authentication state management
│   │   │   ├── use-glossary.ts              # Glossary data management
│   │   │   ├── use-projects.ts              # Translation projects management
│   │   │   └── use-mobile.tsx               # Mobile responsiveness utilities
│   │   ├── lib/                             # Client-side utilities and configurations
│   │   │   ├── queryClient.ts               # React Query client setup
│   │   │   ├── constants.ts                 # Application constants
│   │   │   └── utils.ts                     # General utility functions
│   │   ├── pages/                           # Application pages and routes
│   │   │   ├── dashboard.tsx                # Main dashboard with statistics
│   │   │   ├── translation-editor.tsx       # Bilingual translation interface
│   │   │   ├── content-manager.tsx          # Korean content upload and management
│   │   │   ├── glossary.tsx                 # Biblical terminology management
│   │   │   ├── export-center.tsx            # Multi-format export functionality
│   │   │   ├── progress-tracking.tsx        # Project progress monitoring
│   │   │   ├── user-management.tsx          # User roles and permissions
│   │   │   ├── quality-assurance.tsx        # Translation review workflows
│   │   │   ├── collaboration.tsx            # Team collaboration features
│   │   │   ├── settings.tsx                 # System configuration
│   │   │   ├── advanced-search.tsx          # Enhanced search capabilities
│   │   │   └── not-found.tsx               # 404 error page
│   │   ├── App.tsx                          # Main application component with routing
│   │   ├── main.tsx                         # Application entry point
│   │   └── index.css                        # Global styles and CSS variables
│   └── index.html                           # HTML template
├── server/                                  # Express.js backend application
│   ├── index.ts                            # Server entry point and middleware setup
│   ├── routes.ts                           # API endpoints and route handlers
│   ├── storage.ts                          # Database operations and data access layer
│   ├── db.ts                               # Database connection configuration
│   ├── vite.ts                             # Vite development server integration
│   ├── azure-translator.ts                # Azure Custom Translator service
│   └── seed.ts                             # Database seeding scripts
├── shared/                                 # Shared code between client and server
│   └── schema.ts                           # Database schema definitions and types
├── uploads/                                # File upload storage directory
├── package.json                           # Dependencies and build scripts
├── tsconfig.json                          # TypeScript configuration
├── vite.config.ts                         # Vite build configuration
├── tailwind.config.ts                     # Tailwind CSS configuration
├── drizzle.config.ts                      # Database migration configuration
├── postcss.config.js                      # PostCSS configuration
├── components.json                        # shadcn/ui component configuration
├── project_overview.md                    # Project documentation
├── task_list.md                           # Development task tracking
├── NEXTJS_MIGRATION_GUIDE.md             # Migration documentation
├── NEXTJS_MIGRATION_SUMMARY.md           # Migration summary
└── .gitignore                             # Git ignore patterns
```

## Planned Next.js Structure (Post-Migration)

```
translation-management-system/
├── src/                                    # Source code directory
│   ├── app/                               # Next.js App Router
│   │   ├── layout.tsx                     # Root layout with providers
│   │   ├── page.tsx                       # Dashboard homepage
│   │   ├── globals.css                    # Global styles and CSS variables
│   │   ├── loading.tsx                    # Global loading component
│   │   ├── error.tsx                      # Global error boundary
│   │   ├── not-found.tsx                  # 404 page
│   │   ├── api/                           # API routes (replaces Express server)
│   │   │   ├── auth/                      # Authentication endpoints
│   │   │   ├── translation-projects/      # Project CRUD operations
│   │   │   │   ├── route.ts              # GET/POST projects
│   │   │   │   └── [id]/route.ts         # Individual project operations
│   │   │   ├── contents/                  # Content management endpoints
│   │   │   ├── glossary/                  # Terminology management endpoints
│   │   │   ├── translation-memory/        # TM system endpoints
│   │   │   ├── azure-translator/          # AI translation endpoints
│   │   │   │   ├── models/route.ts       # Available translation models
│   │   │   │   └── translate/
│   │   │   │       ├── biblical/route.ts # Biblical translation
│   │   │   │       └── theological/route.ts # Theological translation
│   │   │   ├── export/                    # Export functionality endpoints
│   │   │   ├── users/                     # User management endpoints
│   │   │   └── dashboard/                 # Dashboard statistics endpoints
│   │   ├── editor/                        # Translation editor pages
│   │   │   └── [id]/                     # Dynamic project editor
│   │   │       ├── page.tsx              # Editor interface
│   │   │       ├── loading.tsx           # Editor loading state
│   │   │       └── error.tsx             # Editor error handling
│   │   ├── content/                       # Content management pages
│   │   │   ├── page.tsx                  # Content list and upload
│   │   │   ├── upload/page.tsx           # File upload interface
│   │   │   └── [id]/page.tsx             # Individual content view
│   │   ├── glossary/                      # Terminology management
│   │   │   ├── page.tsx                  # Glossary interface
│   │   │   └── [term]/page.tsx           # Individual term details
│   │   ├── export/                        # Export center
│   │   │   ├── page.tsx                  # Export dashboard
│   │   │   └── [jobId]/page.tsx          # Export job status
│   │   ├── progress/                      # Progress tracking
│   │   │   └── page.tsx                  # Progress monitoring dashboard
│   │   ├── users/                         # User management
│   │   │   ├── page.tsx                  # User list and management
│   │   │   └── [id]/page.tsx             # Individual user profile
│   │   ├── search/                        # Advanced search
│   │   │   └── page.tsx                  # Search interface
│   │   ├── quality/                       # Quality assurance
│   │   │   └── page.tsx                  # QA dashboard and workflows
│   │   ├── collaboration/                 # Team collaboration
│   │   │   └── page.tsx                  # Collaboration tools
│   │   └── settings/                      # System settings
│   │       └── page.tsx                  # Configuration interface
│   ├── components/                        # Reusable React components
│   │   ├── ui/                           # shadcn/ui base components
│   │   │   ├── button.tsx                # Button component
│   │   │   ├── card.tsx                  # Card component
│   │   │   ├── input.tsx                 # Input component
│   │   │   ├── dialog.tsx                # Modal dialogs
│   │   │   ├── toast.tsx                 # Toast notifications
│   │   │   └── [other-ui-components]     # Additional UI primitives
│   │   ├── layout/                       # Layout components
│   │   │   ├── header.tsx                # Application header
│   │   │   ├── sidebar.tsx               # Navigation sidebar
│   │   │   ├── footer.tsx                # Application footer
│   │   │   └── breadcrumb.tsx            # Navigation breadcrumbs
│   │   ├── dashboard/                    # Dashboard-specific components
│   │   │   ├── stats-card.tsx            # Statistics display cards
│   │   │   ├── activity-feed.tsx         # Recent activity component
│   │   │   ├── project-overview.tsx      # Project summary component
│   │   │   └── quick-actions.tsx         # Dashboard action buttons
│   │   ├── editor/                       # Translation editor components
│   │   │   ├── bilingual-editor.tsx      # Side-by-side editor
│   │   │   ├── source-panel.tsx          # Korean text display
│   │   │   ├── target-panel.tsx          # English text editing
│   │   │   └── editor-toolbar.tsx        # Editor controls and tools
│   │   ├── translation-memory/           # TM system components
│   │   │   ├── tm-panel.tsx              # TM suggestion panel
│   │   │   ├── suggestion-card.tsx       # Individual TM suggestions
│   │   │   ├── feedback-form.tsx         # TM quality feedback
│   │   │   └── tm-search.tsx             # TM search functionality
│   │   ├── azure-translator/             # Azure AI components
│   │   │   ├── translation-panel.tsx     # AI translation interface
│   │   │   ├── model-selector.tsx        # Translation model selection
│   │   │   ├── quality-indicator.tsx     # Translation quality display
│   │   │   └── batch-translator.tsx      # Batch translation interface
│   │   ├── content/                      # Content management components
│   │   │   ├── upload-form.tsx           # File upload interface
│   │   │   ├── content-list.tsx          # Content listing
│   │   │   ├── content-card.tsx          # Individual content display
│   │   │   └── metadata-editor.tsx       # Content metadata editing
│   │   ├── glossary/                     # Glossary components
│   │   │   ├── term-list.tsx             # Terminology listing
│   │   │   ├── term-editor.tsx           # Term creation/editing
│   │   │   ├── term-search.tsx           # Terminology search
│   │   │   └── category-filter.tsx       # Term categorization
│   │   ├── export/                       # Export functionality components
│   │   │   ├── export-form.tsx           # Export configuration
│   │   │   ├── format-selector.tsx       # Output format selection
│   │   │   ├── job-status.tsx            # Export progress tracking
│   │   │   └── download-manager.tsx      # File download interface
│   │   ├── auth/                         # Authentication components
│   │   │   ├── login-form.tsx            # User login interface
│   │   │   ├── profile-menu.tsx          # User profile dropdown
│   │   │   └── auth-guard.tsx            # Route protection
│   │   ├── providers/                    # React context providers
│   │   │   ├── query-provider.tsx        # React Query provider
│   │   │   ├── theme-provider.tsx        # Theme management
│   │   │   └── auth-provider.tsx         # Authentication context
│   │   └── forms/                        # Form components
│   │       ├── project-form.tsx          # Project creation/editing
│   │       ├── user-form.tsx             # User management forms
│   │       └── settings-form.tsx         # System configuration forms
│   ├── hooks/                            # Custom React hooks
│   │   ├── use-auth.ts                   # Authentication state management
│   │   ├── use-projects.ts               # Project data management
│   │   ├── use-glossary.ts               # Glossary operations
│   │   ├── use-translation-memory.ts     # TM system hooks
│   │   ├── use-azure-translator.ts       # Azure AI integration
│   │   ├── use-export.ts                 # Export functionality
│   │   ├── use-toast.ts                  # Toast notification system
│   │   └── use-mobile.ts                 # Mobile responsiveness
│   ├── lib/                              # Utility libraries and configurations
│   │   ├── db.ts                         # Database connection (Drizzle + PostgreSQL)
│   │   ├── auth.ts                       # NextAuth.js configuration
│   │   ├── azure-translator.ts           # Azure Custom Translator service
│   │   ├── export-service.ts             # Multi-format export utilities
│   │   ├── translation-memory.ts         # TM fuzzy matching algorithms
│   │   ├── utils.ts                      # General utility functions
│   │   ├── constants.ts                  # Application constants
│   │   ├── validations.ts                # Form validation schemas
│   │   └── api-client.ts                 # API request utilities
│   └── types/                            # TypeScript type definitions
│       ├── auth.ts                       # Authentication types
│       ├── translation.ts                # Translation-related types
│       ├── export.ts                     # Export functionality types
│       └── api.ts                        # API response types
├── shared/                               # Shared code and schemas
│   └── schema.ts                         # Database schema (Drizzle ORM)
├── public/                               # Static assets
│   ├── icons/                            # Application icons
│   ├── images/                           # Static images
│   └── uploads/                          # User-uploaded files
├── drizzle/                              # Database migrations
│   └── migrations/                       # SQL migration files
├── next.config.js                       # Next.js configuration
├── package.json                         # Dependencies and scripts
├── tsconfig.json                        # TypeScript configuration
├── tailwind.config.ts                   # Tailwind CSS configuration
├── drizzle.config.ts                    # Database configuration
├── postcss.config.js                    # PostCSS configuration
├── components.json                      # shadcn/ui configuration
├── .env.local                           # Environment variables (not in repo)
├── .env.local.example                   # Environment variables template
├── project_overview.md                  # Project documentation
├── task_list.md                         # Development task tracking
├── directory_structure.md               # This file
└── .gitignore                           # Git ignore patterns
```

## Key Architectural Differences

### Current (Express + React)
- **Separation**: Frontend and backend are separate applications
- **Routing**: Client-side routing with wouter
- **API**: Express.js RESTful endpoints
- **Build**: Vite for frontend, separate server compilation
- **Deployment**: Requires separate frontend and backend hosting

### Planned (Next.js)
- **Integration**: Full-stack framework with unified structure
- **Routing**: File-based routing with App Router
- **API**: Next.js API routes (serverless functions)
- **Build**: Unified Next.js build system
- **Deployment**: Single deployment target (Vercel recommended)

## Component Organization Strategy

### UI Components (`src/components/ui/`)
- Atomic design principles
- shadcn/ui base components
- Reusable across all application areas
- Minimal business logic

### Feature Components (`src/components/[feature]/`)
- Business logic specific to feature domains
- Composed of multiple UI components
- Handle feature-specific state and interactions
- Organized by application domain

### Layout Components (`src/components/layout/`)
- Application structure and navigation
- Header, sidebar, footer components
- Responsive design implementation
- Global UI state management

### Page Components (`src/app/*/page.tsx`)
- Top-level route components
- Coordinate multiple feature components
- Handle page-level data fetching
- SEO and metadata configuration