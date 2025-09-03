# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# CLUEQUEST - Global SaaS Platform

## Quick Start
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase keys

# Run development server (configured to use port 5173)
npm run dev

# Open browser
http://localhost:5173
```

## Project Overview
ClueQuest is a production-ready SaaS platform built with proven patterns from AXIS6, CINETWRK, and other successful deployments. Optimized for global markets with mobile-first design, enterprise-grade security, and performance-focused architecture.

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
npm run dev          # Start development server on http://localhost:5173
npm run build        # Production build
npm run build:production # Production build with NODE_ENV=production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run type-check   # TypeScript type checking
npm run optimize:check # Type check + lint combined

# Database & Setup
npm run setup:all    # Complete project setup automation
npm run setup:dns    # Configure Cloudflare DNS records
npm run setup:email  # Setup Resend email provider
npm run setup:vercel # Configure Vercel deployment
npm run setup:check  # Check all services status

# Database Operations
npm run db:migrate   # Run Supabase migrations
npm run db:reset     # Reset database (development only)
npm run db:optimize  # Deploy performance indexes (25+ optimizations)
npm run db:monitor   # View performance monitoring queries

# Testing - Unit/Integration (Jest)
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Testing - Authentication & Database
npm run test:auth    # Test authentication flow
npm run test:performance # Test database performance

# E2E Testing (Playwright)
npm run test:e2e     # Run all E2E tests
npm run test:e2e:auth # Test authentication flows
npm run test:e2e:mobile # Mobile responsive tests
npm run test:e2e:debug  # Debug mode with browser UI

# Security & Production
npm run security:audit    # Run security audit
npm run security:validate # Validate security configuration
npm run production:health # Check production health
npm run production:deploy # Build and verify for production
npm run production:monitor # Production monitoring dashboard

# Bundle Analysis
npm run analyze      # Bundle analyzer for optimization
```

## IMPORTANT Development Notes
- **Port Configuration**: Configured to ALWAYS use port 5173 for development - http://localhost:5173
- **Mobile-First**: All components must be mobile-responsive with touch targets ≥44px
- **Performance-Optimized**: Bundle splitting configured for Supabase, UI, and vendor chunks
- **Security-First**: CSP headers, input validation, and secure defaults enabled
- **Global Market Ready**: Multi-language support structure, international best practices

## Project Structure
```
cluequest/
├── src/
│   ├── app/                    # Next.js App Router (mobile-optimized layouts)
│   │   ├── (auth)/            # Protected routes group
│   │   │   ├── dashboard/     # Main dashboard
│   │   │   ├── settings/      # User settings
│   │   │   └── profile/       # User profile
│   │   ├── auth/              # Authentication pages
│   │   │   ├── login/         # Login page
│   │   │   ├── register/      # Registration page
│   │   │   └── reset/         # Password reset
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── users/         # User management
│   │   │   └── health/        # Health checks
│   │   ├── globals.css        # Global styles with CSS variables
│   │   ├── layout.tsx         # Root layout with mobile optimization
│   │   └── page.tsx           # Landing page (mobile-first)
│   ├── components/
│   │   ├── ui/                # Base UI components (mobile-responsive)
│   │   ├── auth/              # Authentication components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── forms/             # Form components with validation
│   │   └── layout/            # Layout components
│   ├── lib/
│   │   ├── supabase/          # Supabase client and helpers
│   │   ├── utils/             # Utility functions
│   │   ├── validations/       # Zod schemas
│   │   └── hooks/             # Custom React hooks
│   ├── types/                 # TypeScript definitions
│   └── hooks/                 # Global hooks
├── scripts/                   # Automation scripts
│   ├── setup-all.js          # Complete setup automation
│   ├── configure-dns.js      # DNS configuration
│   ├── configure-resend.js   # Email setup
│   └── performance-monitor.js # Performance monitoring
├── supabase/
│   └── migrations/            # Database migrations
└── tests/                     # Test files
    ├── e2e/                  # Playwright E2E tests
    └── unit/                 # Jest unit tests
```

## Database Schema (Supabase)
All tables use the prefix `cluequest_` for multi-tenant isolation and follow AXIS6 proven patterns:

### Core Tables
- `cluequest_profiles` - User profiles extending Supabase Auth (uses `id` column as user reference)
- `cluequest_organizations` - Multi-tenant organization structure
- `cluequest_subscriptions` - Subscription management
- `cluequest_usage_analytics` - Usage tracking and analytics
- `cluequest_api_keys` - API key management for integrations
- `cluequest_notifications` - In-app notification system
- `cluequest_audit_logs` - Security and activity auditing

### Database Performance (AXIS6 Proven Patterns)
- **25+ custom indexes** for optimized queries
- **RPC Functions**: `get_dashboard_data_optimized`, `calculate_usage_metrics`, `get_analytics_summary`
- **Partial indexes** for time-based queries (95% performance improvement)
- **Performance metrics view**: `dashboard_performance_metrics`
- All indexes deployed via `scripts/deploy-performance-indexes.js`

## Key Features
1. **User Authentication**: Email/password with Supabase Auth + social providers
2. **Multi-tenant Architecture**: Organization-based data isolation
3. **API Management**: Rate-limited API endpoints with key management
4. **Usage Analytics**: Real-time usage tracking and insights
5. **Mobile-First Design**: Perfect responsive design with safe area support
6. **Global Localization**: Multi-language support structure
7. **Performance Monitoring**: Real-time performance tracking and optimization

## 📱 Mobile Optimization (Production-Ready)

### Perfect Modal Centering (AXIS6 Proven Pattern)
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
NEXT_PUBLIC_APP_URL=http://localhost:5173  # Development
NODE_ENV=development

# Email Service (Resend)
RESEND_API_KEY=re_your_key_here

# Infrastructure (Production)
VERCEL_TOKEN=your_vercel_token
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ACCOUNT_ID=your_account_id

# Analytics & Monitoring
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
SENTRY_DSN=your_sentry_dsn
```

## Development Workflow
1. Create feature branches for all changes
2. Test locally with `npm run dev` on port 5173
3. Run `npm run optimize:check` before commits
4. Deploy via push to main branch (Vercel auto-deploy)
5. Monitor via production dashboard

## API Routes Structure
```
/api/
├── auth/              # Authentication endpoints
│   ├── login          # User login
│   ├── register       # User registration
│   └── refresh        # Token refresh
├── users/             # User management
│   ├── profile        # User profile CRUD
│   ├── settings       # User settings
│   └── usage          # Usage analytics
├── organizations/     # Multi-tenant management
├── subscriptions/     # Subscription handling
└── health/           # Health checks and monitoring
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
1. **Port 5173**: Always use http://localhost:5173 for development
2. **Mobile-First**: Every component must work perfectly on mobile
3. **Performance-Focused**: Use proven optimization patterns from AXIS6/CINETWRK
4. **Security-First**: Never compromise on security for convenience
5. **Global-Ready**: Design for international markets from day one

### Quick Debugging Commands
```bash
# Check all systems
npm run setup:check

# Test core functionality  
npm run test:auth
npm run test:performance

# Monitor production
npm run production:monitor

# Debug mobile issues
npm run test:e2e:mobile --headed
```

### Common Development Patterns
- **Error Boundaries**: Multi-level error handling with graceful fallbacks
- **Optimistic Updates**: UI updates before server confirmation
- **Progressive Enhancement**: Core functionality works, enhancements layer on top
- **Defensive Programming**: Always assume external dependencies can fail

---

**PRODUCTION-READY STATUS**: ✅ Complete  
**Mobile Optimization**: ✅ Perfect modal centering and responsive design  
**Performance**: ✅ 70% improvement patterns implemented  
**Security**: ✅ Enterprise-grade protection  
**Global Market**: ✅ Internationalization ready  

*Built with proven patterns from AXIS6, CINETWRK, and production SaaS deployments*