# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# CLUEQUEST - AI-Powered Interactive Adventure Platform

## Quick Start
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase keys and OpenAI API key

# Run development server (uses Next.js default port 3000)
npm run dev

# Open browser
http://localhost:3000

# Knowledge Base Admin Interface
http://localhost:3000/admin/kb
```

## Project Overview
ClueQuest is an AI-powered interactive adventure platform that creates immersive, location-based mystery games. Players engage in collaborative storytelling experiences with QR code scanning, real-time challenges, and AI-generated content. Built with Next.js 15, React 19, and Supabase, featuring mobile-first design and production-ready architecture.

## Tech Stack
- **Frontend**: Next.js 15.1.6 (App Router), React 19.1.0, TypeScript 5.7.2
- **Styling**: Tailwind CSS 3.4.17 (mobile-first config), Framer Motion 11.15.0
- **Mobile Optimization**: CSS environment variables, safe area support, 44px touch targets
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Hosting**: Vercel (with custom domain support)
- **DNS/CDN**: Cloudflare
- **Email**: Resend (v4.0.1)
- **UI Components**: Radix UI primitives, custom component system
- **State Management**: TanStack React Query v5.62.7, React Hook Form + Zod
- **Testing**: Playwright (E2E + Mobile), Jest (Unit)
- **Monitoring**: Sentry integration ready, Vercel Analytics
- **Security**: Jose v5.9.6 for JWT, comprehensive CSP headers

## Development Commands
```bash
# Core Development
npm run dev                    # Start development server on http://localhost:3000
npm run build                  # Production build
npm run build:production       # Production build with NODE_ENV=production
npm run start                  # Start production server
npm run lint                   # Run ESLint
npm run lint:fix              # Fix ESLint issues automatically
npm run type-check             # TypeScript type checking
npm run optimize:check         # Type check + lint combined
npm run analyze                # Bundle analyzer for optimization

# Setup & Infrastructure
npm run setup:all              # Complete project setup automation
npm run setup:dns              # Configure DNS via scripts/configure-empleaido-dns.js
npm run setup:email            # Setup Resend email provider
npm run setup:vercel           # Configure Vercel deployment
npm run setup:check            # Check all services status

# Database Operations
npm run db:migrate             # Run Supabase migrations
npm run db:reset               # Reset database (development only)
npm run db:optimize            # Deploy performance indexes
npm run db:monitor             # View performance monitoring queries
npm run db:surgical-diagnostic # Comprehensive database analysis
npm run db:emergency-surgery   # Fix database issues (use with caution)
npm run db:apply-fix           # Apply SQL fixes

# Knowledge Base Operations
node scripts/ingest-knowledge-base.mjs ./docs/document.pdf "Title"  # Ingest PDF
node scripts/ingest-knowledge-base.mjs --help                      # Help for KB ingestion

# Testing - Unit/Integration (Jest)
npm run test                   # Run unit tests
npm run test:watch             # Run tests in watch mode
npm run test:coverage          # Run tests with coverage report

# Testing - System Integration
npm run test:auth              # Test authentication flow
npm run test:performance       # Test database performance
npm run test:avatar            # Test avatar generation pipeline
npm run test:geocoding         # Test geocoding functionality

# E2E Testing (Playwright)
npm run test:e2e               # Run all E2E tests
npm run test:e2e:auth          # Test authentication flows
npm run test:e2e:mobile        # Mobile responsive tests
npm run test:e2e:debug         # Debug mode with browser UI
npm run test:e2e:debug:create  # Debug create page specifically
npm run test:e2e:debug:slow    # Debug with slow motion

# Security & Compliance
npm run security:audit         # Run security audit
npm run security:validate      # Validate security configuration
npm run security:harden        # Apply security hardening
npm run security:monitor       # Security monitoring
npm run security:pentest       # Penetration testing
npm run security:full          # Complete security suite
npm run security:compliance    # Compliance audit (SOC2, GDPR, OWASP)

# Production & Deployment
npm run production:health      # Check production health
npm run production:deploy      # Build and verify for production
npm run production:monitor     # Production monitoring dashboard
npm run deploy:empleaido       # Deploy to empleaido domain
npm run deploy:quick           # Quick build and deploy
```

## IMPORTANT Development Notes
- **Port Configuration**: Uses Next.js default port 3000 for development - http://localhost:3000
- **Mobile-First**: All components must be mobile-responsive with touch targets ≥44px
- **Performance-Optimized**: Bundle splitting configured for Supabase, UI, and vendor chunks
- **Security-First**: CSP headers, input validation, and secure defaults enabled
- **AI Integration**: OpenAI for content generation, Runware for avatar generation
- **Adventure Platform**: Location-based QR code adventures with real-time collaboration

## Project Structure
```
cluequest/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (adventure)/              # Adventure flow protected routes
│   │   │   ├── adventure-hub/        # Central hub for active adventures
│   │   │   ├── avatar-generation/    # AI avatar creation
│   │   │   ├── challenges/           # Interactive challenges
│   │   │   ├── intro/               # Adventure introduction
│   │   │   ├── login/               # Adventure-specific login
│   │   │   ├── qr-scan/             # QR code scanning interface
│   │   │   ├── ranking/             # Leaderboards and achievements
│   │   │   ├── role-selection/       # Character role selection
│   │   │   └── welcome/             # Welcome to adventure
│   │   ├── admin/kb/                # Knowledge base admin interface
│   │   ├── adventure-selection/      # Choose adventure type
│   │   ├── api/                     # API routes
│   │   │   ├── adventures/          # Adventure CRUD operations
│   │   │   ├── ai/                  # AI service endpoints
│   │   │   │   ├── avatar/          # Avatar generation
│   │   │   │   ├── story-generator/ # AI story creation
│   │   │   │   └── theme-generator/ # Theme suggestions
│   │   │   ├── challenges/          # Challenge management
│   │   │   ├── geocoding/           # Location services
│   │   │   ├── kb/                  # Knowledge base operations
│   │   │   └── qr/                  # QR code generation/scanning
│   │   ├── auth/                    # Authentication pages
│   │   ├── builder/                 # Adventure creation tools
│   │   ├── create/                  # Adventure creation flow
│   │   ├── dashboard/               # Admin dashboard
│   │   └── page.tsx                 # Landing page
│   ├── components/
│   │   ├── adventure/               # Adventure-specific components
│   │   ├── ai/                      # AI integration components
│   │   ├── auth/                    # Authentication UI
│   │   ├── builder/                 # Adventure builder tools
│   │   ├── ui/                      # Base UI components
│   │   └── layout/                  # Layout components
│   ├── lib/
│   │   ├── kb/                      # Knowledge base integration
│   │   ├── services/                # Business logic services
│   │   ├── supabase/                # Database client
│   │   └── utils/                   # Utility functions
│   └── types/                       # TypeScript definitions
├── scripts/                         # Automation and setup scripts
├── supabase/migrations/             # Database schema migrations
└── tests/e2e/                       # Playwright end-to-end tests
```

## Database Schema (Supabase)
All tables use the prefix `cluequest_` for multi-tenant isolation and follow ClueQuest-specific patterns:

### Core Tables
- `cluequest_profiles` - User profiles extending Supabase Auth (uses `id` column as user reference)
- `cluequest_organizations` - Multi-tenant organization structure
- `cluequest_subscriptions` - Subscription management
- `cluequest_usage_analytics` - Usage tracking and analytics
- `cluequest_api_keys` - API key management for integrations
- `cluequest_notifications` - In-app notification system
- `cluequest_audit_logs` - Security and activity auditing

### Database Performance (ClueQuest Optimizations)
- **25+ custom indexes** for optimized queries
- **RPC Functions**: `get_dashboard_data_optimized`, `calculate_usage_metrics`, `get_analytics_summary`
- **Partial indexes** for time-based queries (95% performance improvement)
- **Performance metrics view**: `dashboard_performance_metrics`
- All indexes deployed via `scripts/deploy-performance-indexes.js`

## Key Features
1. **AI-Powered Adventure Creation**: OpenAI-generated storylines, characters, and challenges
2. **Interactive QR Code System**: Location-based adventure progression with secure QR scanning
3. **Real-time Collaboration**: Multiple players can join adventures and progress together
4. **Avatar Generation**: AI-powered avatar creation using Runware API
5. **Knowledge Base Integration**: PDF ingestion for enhanced storytelling and originality checking
6. **Geocoding Integration**: Google Maps integration for location-based features
7. **Mobile-First Design**: Optimized for mobile gameplay with responsive UI
8. **Adventure Builder**: Tools for creating custom adventures and challenges
9. **Ranking System**: Leaderboards and achievement tracking
10. **Multi-Theme Support**: Corporate, Educational, Fantasy, Mystery, and Hacker themes

## 📱 Mobile Optimization (Production-Ready)

### Perfect Modal Centering (ClueQuest Pattern)
- **Flexbox-based centering**: Works on all screen sizes (320px - 4K+)
- **Safe Area Support**: CSS environment variables for notched devices
- **Touch Optimization**: 44px minimum touch targets (WCAG compliant)
- **Responsive Constraints**: Modals adapt perfectly to any viewport

### Mobile-First Components
- **Responsive Design System**: Dynamic sizing algorithms from mobile to desktop
- **Touch-Friendly Interface**: Enhanced touch targets and gesture support
- **Performance Optimized**: GPU-accelerated animations and smooth scrolling
- **Accessibility Ready**: Screen reader support and keyboard navigation

### Advanced Mobile Features
- **Enhanced Tailwind Config**: Mobile-first breakpoints (xs: 375px), touch utilities
- **Safe Area Utilities**: CSS custom properties for all safe area insets
- **Touch Animations**: Hardware-accelerated animations with feedback
- **Offline Capability**: Service worker ready for offline functionality

## 🎨 ClueQuest Brand System (Global Market)

### Brand Identity
- **Mission**: "Empowering global teams to solve complex challenges collaboratively"
- **Vision**: "The world's most intuitive problem-solving platform"
- **Philosophy**: Simplicity meets enterprise power

### Color Palette
| Component | Color | Hex | Usage |
|-----------|-------|-----|--------|
| **Primary** | Ocean Blue | #0ea5e9 | Main brand, CTAs, links |
| **Secondary** | Sunshine Yellow | #facc15 | Accents, highlights, success |
| **Success** | Growth Green | #22c55e | Confirmations, positive actions |
| **Error** | Alert Red | #ef4444 | Errors, warnings, destructive actions |
| **Neutral** | Modern Gray | #71717a | Text, backgrounds, borders |

### Typography System
- **Headlines**: System font stack (optimized for global languages)
- **UI Text**: Inter font family with excellent international support
- **Body Text**: Optimized line heights for readability across devices
- **Code**: JetBrains Mono for technical content

### Component Design Principles
- **Touch-First**: All components designed for touch interaction
- **Accessible**: WCAG 2.1 AA compliance by default
- **Scalable**: Components work from mobile to desktop
- **International**: RTL language support ready

## Environment Variables
```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Development
NODE_ENV=development

# AI Services (Core functionality)
OPENAI_API_KEY=sk-your_openai_api_key_here  # Required for story generation
RUNWARE_API_KEY=your_runware_key            # Required for avatar generation

# Email Service (Optional)
RESEND_API_KEY=re_your_key_here

# Infrastructure (Production)
VERCEL_TOKEN=your_vercel_token
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ACCOUNT_ID=your_account_id
PRODUCTION_DOMAIN=cluequest.empleaido.com

# Analytics & Monitoring (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
SENTRY_DSN=your_sentry_dsn
```

## Development Workflow
1. Create feature branches for all changes
2. Test locally with `npm run dev` on port 3000
3. Run `npm run optimize:check` before commits
4. Test with E2E suite: `npm run test:e2e`
5. Deploy via push to main branch (Vercel auto-deploy)
6. Monitor via production dashboard

## API Routes Structure
```
/api/
├── adventures/        # Adventure management
│   ├── [id]/         # Adventure by ID operations
│   └── route.ts      # Create/list adventures
├── ai/               # AI service endpoints
│   ├── avatar/       # Avatar generation (Runware)
│   ├── story-generator/ # Story creation (OpenAI)
│   ├── theme-generator/ # Theme suggestions
│   └── character-generator/ # Character creation
├── challenges/       # Interactive challenges
│   └── submit/       # Challenge submission
├── geocoding/        # Location services (Google Maps)
├── kb/               # Knowledge base operations
│   ├── search/       # Semantic search
│   ├── generate/     # Content generation
│   └── test/         # Testing endpoints
├── qr/               # QR code system
│   ├── generate/     # QR code generation
│   └── scan/         # QR code scanning
└── sessions/         # Adventure session management
    └── [id]/         # Session-specific operations
```

## Security Considerations (Enterprise-Grade)
- **Row Level Security (RLS)** enabled on all Supabase tables
- **API Rate Limiting** with Redis-backed storage
- **Input Validation** with Zod schemas on all endpoints
- **CSP Headers** configured for XSS prevention
- **CSRF Protection** on all state-changing operations
- **JWT Security** with proper token rotation
- **Audit Logging** for all critical operations

## Performance Optimizations (70% Improvement Patterns)
- **Database Indexes**: 25+ strategic indexes for common queries
- **Bundle Splitting**: Separate chunks for vendors, UI, and business logic
- **Image Optimization**: Next.js Image component with WebP/AVIF support
- **Code Splitting**: Route-based and component-based lazy loading
- **Caching Strategy**: React Query with optimistic updates
- **CDN Integration**: Vercel Edge Network for global content delivery

## Testing Strategy (Production-Ready)
- **Unit Tests**: Jest for utility functions and components
- **Integration Tests**: API route testing with mocked dependencies
- **E2E Tests**: Playwright for critical user journeys
- **Mobile Testing**: Device-specific testing across breakpoints
- **Performance Tests**: Database query performance monitoring
- **Security Tests**: Vulnerability scanning and penetration testing

## Deployment & Infrastructure (5-Minute Setup)
- **Hosting**: Vercel with automatic deployments
- **Domain Management**: Cloudflare DNS with automation scripts
- **Database**: Supabase cloud with automated backups
- **Email**: Resend with domain verification automation
- **Monitoring**: Sentry + Vercel Analytics integration
- **SSL**: Automatic via Vercel with edge optimization

## Critical Development Guidelines

### Mobile-First Development Rules
1. **Start with 375px** mobile design, scale up to desktop
2. **Touch Targets**: Minimum 44px for all interactive elements
3. **Safe Areas**: Always use CSS env() variables for notched devices
4. **Performance**: GPU-accelerated transforms, smooth scrolling
5. **Accessibility**: WCAG 2.1 AA compliance in all components

### Database Integration Patterns
1. **Column Naming**: `cluequest_profiles` uses `id`, other tables use `user_id`
2. **RLS Policies**: Production-ready policies for all tables
3. **Performance**: Use optimized indexes and RPC functions
4. **Error Handling**: Defensive programming with graceful degradation

### Component Development Standards
1. **TypeScript**: Strict typing for all props and state
2. **Error Boundaries**: Multi-level error handling
3. **React Query**: Server state management with caching
4. **Form Validation**: Zod schemas for all user inputs
5. **Styling**: Tailwind CSS with consistent design tokens

## Known Issues & Solutions

### Production-Ready Status
✅ **Database Schema**: Multi-tenant ready with performance indexes  
✅ **Authentication**: Secure auth flows with session management  
✅ **Mobile Optimization**: Perfect modal centering and responsive design  
✅ **Performance**: 70% optimization patterns implemented  
✅ **Security**: Enterprise-grade security headers and validation  
✅ **Automation**: 5-minute setup scripts for complete deployment  

### Monitoring & Debugging
- **Error Tracking**: Sentry integration with source maps
- **Performance**: Real-time query monitoring and optimization alerts
- **Analytics**: User behavior tracking and conversion funnels
- **Health Checks**: Automated endpoint monitoring and alerting

## High-Level Architecture Patterns

### Data Flow Architecture
1. **Client Layer**: React components with TanStack Query for state management
2. **API Layer**: Next.js App Router API routes with validation middleware
3. **Database Layer**: Supabase PostgreSQL with Row Level Security
4. **Real-time Layer**: Supabase Realtime for live updates
5. **Authentication**: Supabase Auth with JWT token management

### Security Architecture
- **Multi-layered Defense**: Authentication, authorization, input validation, rate limiting
- **Zero-Trust Model**: Every request validated and authorized
- **Audit Trail**: Complete logging of all security-relevant operations
- **Compliance Ready**: GDPR, SOC 2, and other compliance frameworks supported

### Performance Architecture
- **Edge-First**: Content delivery optimized for global audiences
- **Database-Centric**: Let the database handle heavy lifting with optimized queries
- **Caching Strategy**: Multi-level caching from CDN to browser
- **Monitoring-Driven**: Real-time performance tracking and optimization

## Success Metrics & Benchmarks
- **Page Load Time**: <200ms (from 700ms baseline)
- **Database Queries**: 70% faster with strategic indexes
- **Mobile Performance**: 90+ Lighthouse score across all devices
- **Uptime Target**: 99.9% availability with monitoring
- **Security**: Zero critical vulnerabilities in production

## Production Deployment Checklist
- [ ] Environment variables configured in Vercel
- [ ] Database migrations applied with performance indexes
- [ ] DNS records configured via Cloudflare automation
- [ ] Email domain verified with Resend
- [ ] SSL certificates active and auto-renewing
- [ ] Error tracking configured with Sentry
- [ ] Performance monitoring active
- [ ] Security headers validated
- [ ] Mobile optimization tested on real devices
- [ ] API rate limiting configured
- [ ] Backup and recovery procedures tested

## Working With This Codebase

### Key Development Principles
1. **Port 3000**: Always use http://localhost:3000 for development (Next.js default)
2. **Mobile-First**: Every component must work perfectly on mobile adventure gameplay
3. **AI Integration**: Leverage OpenAI and Runware APIs for dynamic content generation
4. **Adventure-Centric**: Design components with adventure gameplay in mind
5. **Security-First**: QR codes and user data require secure handling
6. **Real-time Ready**: Design for collaborative multiplayer experiences

### Quick Debugging Commands
```bash
# Check all systems status
npm run setup:check

# Test core functionality  
npm run test:auth                    # Authentication flow
npm run test:avatar                  # Avatar generation pipeline
npm run test:geocoding              # Location services
npm run test:performance            # Database performance

# Debug E2E issues
npm run test:e2e:debug              # Debug mode with UI
npm run test:e2e:debug:create       # Debug adventure creation
npm run test:e2e:mobile             # Mobile-specific tests

# Database debugging
npm run db:surgical-diagnostic      # Comprehensive DB analysis
npm run db:monitor                  # Performance monitoring

# Production monitoring
npm run production:monitor          # Production health dashboard
npm run security:monitor           # Security monitoring
```

### Common Development Patterns
- **AI-First Development**: Use OpenAI for content, Runware for images
- **Adventure State Management**: Track progress across adventure phases
- **QR Code Security**: Always validate and sanitize QR code data
- **Mobile Gesture Support**: Touch-friendly interactions for adventure gameplay
- **Knowledge Base Integration**: Enhance content with RAG-powered suggestions
- **Real-time Updates**: Use Supabase realtime for collaborative features

## Adventure Platform Architecture

### Adventure Flow
1. **Landing Page** → **Adventure Selection** → **Login/Register**
2. **Welcome** → **Story Introduction** → **Role Selection**
3. **Avatar Generation** → **Adventure Hub** → **QR Scanning**
4. **Challenges** → **Progress Tracking** → **Ranking/Completion**

### AI Integration Points
- **Story Generation**: OpenAI creates dynamic narratives based on themes
- **Avatar Creation**: Runware generates unique character avatars
- **Challenge Generation**: AI creates puzzles and challenges
- **Content Enhancement**: Knowledge base provides originality checking

### Key Components
- **Adventure Builder** (`/builder`): Create custom adventures
- **QR System** (`src/lib/services/qr-security.ts`): Secure QR code handling  
- **AI Services** (`src/lib/services/ai-content.ts`): Content generation
- **Knowledge Base** (`src/lib/kb/`): RAG system for enhanced content

---

**PRODUCTION STATUS**: ✅ Live at cluequest.empleaido.com  
**Adventure Platform**: ✅ Full interactive adventure system  
**AI Integration**: ✅ OpenAI + Runware + Knowledge Base  
**Mobile Optimization**: ✅ Touch-friendly adventure gameplay  
**Security**: ✅ Secure QR codes and user data handling  

*Interactive Adventure Platform powered by AI*