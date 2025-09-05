# 🏥 ClueQuest Database Surgical Diagnostic

## Overview
The **Operación Bisturí** (Surgical Operation) is a comprehensive database health analysis tool that performs 6 critical diagnostic queries on your ClueQuest database and generates medical-style reports.

## 🚀 Quick Start

```bash
# Run complete surgical diagnostic
npm run db:surgical-diagnostic

# Or run directly
node scripts/database-surgical-diagnostic.js
```

## 🔬 What It Does

### 6 Critical Diagnostic Queries

1. **📊 Column Inventory Analysis**
   - Maps all columns across public schema tables
   - Verifies ClueQuest core table existence
   - Identifies missing tables from expected schema

2. **🔒 Constraints & Unique Keys Analysis**
   - Analyzes database constraints and unique keys
   - Identifies potential data integrity issues
   - Notes: Requires elevated DB privileges for full analysis

3. **🛡️ RLS Policies Audit (Critical for SaaS)**
   - Tests Row Level Security configuration
   - Verifies multi-tenant data isolation
   - Identifies tables with open access (security risk)

4. **🔐 RLS Status Verification**
   - Confirms RLS is enabled on security-critical tables
   - Provides recommendations for RLS configuration

5. **🔗 Foreign Key Relationships**
   - Maps table relationships and dependencies
   - Verifies referential integrity
   - Documents the database schema relationships

6. **⚙️ RPC Functions & Types Analysis**
   - Inventories custom database functions
   - Verifies performance optimization functions exist
   - Tests function availability and access

## 📋 Medical-Style Health Report

The tool generates a comprehensive health report with:

### 🩺 Vital Signs
- Database connectivity status
- Query success rate
- Schema integrity assessment
- Average response time

### 🔍 Diagnosis
- Overall health classification
- Critical issues count
- Security status assessment
- Primary concerns identification

### 💊 Prescription
- **Immediate Actions**: Critical fixes needed now
- **Maintenance Tasks**: Non-critical improvements
- **Preventive Measures**: Ongoing maintenance recommendations

### 🔮 Prognosis
- Performance outlook
- Security outlook
- Scalability readiness
- Recommended follow-up timeline

## 📄 Report Formats

The diagnostic generates reports in two formats:

### JSON Report (`reports/database-surgical-diagnostic.json`)
```json
{
  "timestamp": "2025-01-20T...",
  "summary": { /* health report */ },
  "detailed_results": { /* raw query results */ },
  "performance_metrics": { /* timing data */ },
  "all_issues": [ /* identified issues */ ],
  "total_diagnostic_time_ms": 1250
}
```

### HTML Report (`reports/database-surgical-diagnostic.html`)
- Beautiful medical-style dashboard
- Color-coded health indicators
- Interactive sections for all diagnostic data
- Printable format for documentation

## 🚨 Common Issues & Solutions

### Missing Tables
```
ISSUE: Missing expected core tables: cluequest_profiles, cluequest_organizations
SOLUTION: Run database migrations
COMMAND: npm run db:migrate
```

### RLS Security Issues
```
ISSUE: Tables with open access (RLS may be disabled)
SOLUTION: Enable RLS and configure proper policies
COMMAND: Check supabase/migrations/ for RLS policies
```

### Permission Limitations
```
ISSUE: Constraint analysis requires elevated database privileges
SOLUTION: Run with database admin access for complete audit
NOTE: Limited access analysis is still valuable
```

## 🔧 Configuration

### Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### Custom Configuration
The script automatically adapts to:
- ClueQuest-specific table schema
- Multi-tenant architecture patterns
- Production SaaS security requirements

## 📊 Performance Benchmarks

Typical execution times:
- **Column Inventory**: 50-200ms
- **RLS Analysis**: 200-500ms  
- **Foreign Keys**: 100-300ms
- **RPC Functions**: 100-400ms
- **Total Runtime**: 500-1500ms

## 🛡️ Security Features

### Safe Operation
- **Read-only queries**: Never modifies database
- **Permission-aware**: Graceful degradation with limited access
- **Error handling**: Robust error recovery and reporting

### Multi-tenant Awareness
- Specifically designed for ClueQuest's multi-tenant architecture
- RLS policy verification critical for SaaS security
- Organization-based data isolation testing

## 🚀 Integration with ClueQuest

### Expected Database Schema
The diagnostic expects ClueQuest's production schema with:
- `cluequest_profiles` (user profiles)
- `cluequest_organizations` (multi-tenant orgs)
- `cluequest_subscriptions` (billing)
- `cluequest_api_keys` (API management)
- Plus 15+ additional ClueQuest tables

### Performance Optimization Functions
Tests for existence of:
- `get_dashboard_data_optimized()`
- `calculate_usage_metrics()`
- `update_updated_at_column()`

## 📈 Monitoring & Automation

### Recommended Schedule
- **Daily**: Automated health checks in CI/CD
- **Weekly**: Full diagnostic with team review
- **Monthly**: Comprehensive audit with stakeholder review

### CI/CD Integration
```yaml
# Add to your GitHub Actions
- name: Database Health Check
  run: npm run db:surgical-diagnostic
  
- name: Upload Health Report
  uses: actions/upload-artifact@v3
  with:
    name: db-health-report
    path: reports/database-surgical-diagnostic.html
```

### Alerting Integration
The JSON output can be integrated with monitoring systems:
```javascript
const report = require('./reports/database-surgical-diagnostic.json');
if (report.summary.diagnosis.critical_issues > 0) {
  // Send alert to Slack/Discord/Email
}
```

## 🎯 Success Metrics

### Healthy Database Indicators
- ✅ Query success rate: 100%
- ✅ Critical issues: 0
- ✅ RLS enabled on all user tables
- ✅ All core tables present
- ✅ Performance functions available

### Warning Indicators
- ⚠️ Query success rate: 80-99%
- ⚠️ Some missing non-critical tables
- ⚠️ Limited database access permissions

### Critical Indicators
- 🚨 Query success rate: <80%
- 🚨 Missing core tables
- 🚨 RLS disabled on user data tables
- 🚨 Database connection failures

## 🤝 Contributing

To extend the diagnostic:

1. Add new queries to the class methods
2. Update the health report generation
3. Add new issue categories and recommendations
4. Update the HTML template for new data

## 📞 Support

For issues with the surgical diagnostic:

1. Check environment variables are set correctly
2. Verify Supabase connection and permissions
3. Review the generated JSON report for detailed errors
4. Check the console output for specific failure points

---

**Remember**: This diagnostic is your database's health checkup. Run it regularly to maintain optimal performance and security! 🏥✨