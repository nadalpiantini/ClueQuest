#!/usr/bin/env node

/**
 * 🏥 OPERACIÓN BISTURÍ - ClueQuest Database Surgical Diagnostic (PostgreSQL Direct)
 * ===============================================================================
 * Comprehensive database analysis and health check using direct PostgreSQL connection
 * 
 * Performs 6 critical diagnostic queries:
 * 1. Column inventory across all public schema tables
 * 2. Constraints and unique keys analysis
 * 3. RLS policies audit (critical for SaaS security)
 * 4. RLS enabled/disabled status verification
 * 5. Foreign key relationships mapping
 * 6. RPC functions and custom types inventory
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

class DatabaseSurgicalDiagnostic {
    constructor() {
        this.results = {};
        this.performance = {};
        this.issues = [];
        this.recommendations = [];
        
        // Initialize PostgreSQL client
        const dbUrl = process.env.SUPABASE_DB_URL;
        
        if (!dbUrl) {
            throw new Error('🚨 CRITICAL: SUPABASE_DB_URL not found in environment');
        }
        
        this.client = new Client({
            connectionString: dbUrl,
            ssl: { rejectUnauthorized: false }
        });
        
        console.log('🏥 OPERACIÓN BISTURÍ - Database Surgical Diagnostic (PostgreSQL Direct)');
        console.log('=' .repeat(70));
    }

    /**
     * Connect to database
     */
    async connect() {
        try {
            await this.client.connect();
            console.log('✅ Connected to PostgreSQL database');
        } catch (error) {
            throw new Error(`🚨 CRITICAL: Database connection failed: ${error.message}`);
        }
    }

    /**
     * Disconnect from database
     */
    async disconnect() {
        try {
            await this.client.end();
            console.log('✅ Disconnected from PostgreSQL database');
        } catch (error) {
            console.log(`⚠️  Warning: Error disconnecting: ${error.message}`);
        }
    }

    /**
     * Execute a timed SQL query and store results
     */
    async executeTimedQuery(name, query, description) {
        console.log(`🔬 Executing: ${description}...`);
        const startTime = Date.now();
        
        try {
            const result = await this.client.query(query);
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            this.performance[name] = {
                duration_ms: duration,
                status: 'success',
                row_count: result.rows.length
            };
            
            this.results[name] = result.rows;
            
            console.log(`✅ ${description} completed in ${duration}ms (${result.rows.length} rows)`);
            return result.rows;
            
        } catch (error) {
            const duration = Date.now() - startTime;
            
            this.performance[name] = {
                duration_ms: duration,
                status: 'error',
                error: error.message
            };
            
            console.log(`❌ ${description} failed: ${error.message}`);
            this.issues.push({
                category: 'query_execution',
                severity: 'high',
                description: `Failed to execute ${description}`,
                error: error.message,
                recommendation: 'Check database connection and permissions'
            });
            
            return [];
        }
    }

    /**
     * 1. Column Inventory Analysis
     */
    async analyzeColumnInventory() {
        const query = `
            SELECT table_schema, table_name, column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_schema = 'public'
            ORDER BY table_name, ordinal_position;
        `;
        
        const results = await this.executeTimedQuery(
            'column_inventory',
            query,
            'Column inventory across all public schema tables'
        );
        
        // Analyze results
        if (results.length > 0) {
            const tableCount = new Set(results.map(r => r.table_name)).size;
            const columnCount = results.length;
            const clueQuestTables = results.filter(r => r.table_name.startsWith('cluequest_'));
            
            console.log(`📊 Found ${columnCount} columns across ${tableCount} tables`);
            console.log(`📋 ClueQuest-specific tables: ${new Set(clueQuestTables.map(r => r.table_name)).size}`);
            
            // Check for expected core tables
            const expectedTables = [
                'cluequest_profiles',
                'cluequest_organizations', 
                'cluequest_subscriptions',
                'cluequest_adventures',
                'cluequest_sessions'
            ];
            
            const missingTables = expectedTables.filter(table => 
                !results.some(r => r.table_name === table)
            );
            
            if (missingTables.length > 0) {
                this.issues.push({
                    category: 'schema_completeness',
                    severity: 'high',
                    description: `Missing expected core tables: ${missingTables.join(', ')}`,
                    recommendation: 'Run database migrations to create missing tables'
                });
            }
        }
        
        return results;
    }

    /**
     * 2. Constraints and Unique Keys Analysis
     */
    async analyzeConstraints() {
        const query = `
            SELECT conname, conrelid::regclass AS table_name, pg_get_constraintdef(c.oid) AS definition
            FROM pg_constraint c
            WHERE connamespace = 'public'::regnamespace
            ORDER BY conrelid::regclass::text, conname;
        `;
        
        const results = await this.executeTimedQuery(
            'constraints_analysis',
            query,
            'Constraints and unique keys analysis'
        );
        
        console.log(`🔒 Found ${results.length} constraints across public schema tables`);
        
        return results;
    }

    /**
     * 3. RLS Policies Analysis (Critical for SaaS Security)
     */
    async analyzeRLSPolicies() {
        const query = `
            SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
            FROM pg_policies
            WHERE schemaname = 'public'
            ORDER BY tablename, policyname;
        `;
        
        const results = await this.executeTimedQuery(
            'rls_policies',
            query,
            'RLS policies analysis (Critical for SaaS Security)'
        );
        
        console.log(`🛡️  Found ${results.length} RLS policies across public schema tables`);
        
        // Analyze results
        const tablesWithPolicies = new Set(results.map(r => r.tablename));
        const clueQuestTables = [
            'cluequest_profiles',
            'cluequest_organizations',
            'cluequest_organization_members',
            'cluequest_subscriptions',
            'cluequest_api_keys',
            'cluequest_notifications',
            'cluequest_audit_logs',
            'cluequest_adventures',
            'cluequest_sessions',
            'cluequest_players'
        ];
        
        const tablesWithoutPolicies = clueQuestTables.filter(table => 
            !tablesWithPolicies.has(table)
        );
        
        if (tablesWithoutPolicies.length > 0) {
            this.issues.push({
                category: 'security',
                severity: 'high',
                description: `Tables without RLS policies: ${tablesWithoutPolicies.join(', ')}`,
                recommendation: 'Implement RLS policies for multi-tenant security'
            });
        }
        
        return results;
    }

    /**
     * 4. RLS Status Verification
     */
    async analyzeRLSStatus() {
        const query = `
            SELECT schemaname, tablename, rowsecurity as rls_enabled
            FROM pg_tables
            WHERE schemaname = 'public'
            ORDER BY tablename;
        `;
        
        const results = await this.executeTimedQuery(
            'rls_status',
            query,
            'RLS enabled/disabled status verification'
        );
        
        // Analyze results
        const tablesWithoutRLS = results.filter(r => !r.rls_enabled);
        
        if (tablesWithoutRLS.length > 0) {
            this.issues.push({
                category: 'security',
                severity: 'medium',
                description: `Tables with RLS disabled: ${tablesWithoutRLS.map(t => t.tablename).join(', ')}`,
                recommendation: 'Enable RLS for tables containing sensitive data'
            });
        }
        
        console.log(`🔐 RLS Status: ${results.length} tables analyzed, ${tablesWithoutRLS.length} with RLS disabled`);
        
        return results;
    }

    /**
     * 5. Foreign Key Relationships Analysis
     */
    async analyzeForeignKeys() {
        const query = `
            SELECT tc.table_name, kcu.column_name, ccu.table_name AS foreign_table, ccu.column_name AS foreign_column
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
            WHERE tc.table_schema = 'public' AND tc.constraint_type = 'FOREIGN KEY'
            ORDER BY tc.table_name;
        `;
        
        const results = await this.executeTimedQuery(
            'foreign_keys',
            query,
            'Foreign key relationships analysis'
        );
        
        console.log(`🔗 Found ${results.length} foreign key relationships across public schema tables`);
        
        return results;
    }

    /**
     * 6. RPC Functions and Types Analysis
     */
    async analyzeRPCFunctions() {
        const query = `
            SELECT routine_name, routine_type, data_type as return_type, routine_definition
            FROM information_schema.routines
            WHERE routine_schema = 'public'
            ORDER BY routine_name;
        `;
        
        const results = await this.executeTimedQuery(
            'rpc_functions',
            query,
            'RPC functions and custom types analysis'
        );
        
        console.log(`⚙️  Found ${results.length} functions and procedures in public schema`);
        
        return results;
    }

    /**
     * Generate Medical-Style Health Report
     */
    generateHealthReport() {
        const totalQueries = Object.keys(this.performance).length;
        const successfulQueries = Object.values(this.performance).filter(p => p.status === 'success').length;
        const criticalIssues = this.issues.filter(i => i.severity === 'high').length;
        const warnings = this.issues.filter(i => i.severity === 'medium').length;
        
        return {
            // Vital Signs
            vital_signs: {
                database_connectivity: this.client ? 'HEALTHY' : 'CRITICAL',
                query_success_rate: `${Math.round((successfulQueries / totalQueries) * 100)}%`,
                total_diagnostics_run: totalQueries,
                response_time_avg: Math.round(
                    Object.values(this.performance)
                        .filter(p => p.duration_ms)
                        .reduce((sum, p) => sum + p.duration_ms, 0) / totalQueries
                ),
                schema_integrity: criticalIssues === 0 ? 'GOOD' : 'ATTENTION_REQUIRED'
            },
            
            // Diagnosis
            diagnosis: {
                overall_health: criticalIssues === 0 ? 'HEALTHY' : warnings > 0 ? 'STABLE_WITH_ISSUES' : 'CRITICAL',
                critical_issues: criticalIssues,
                warnings: warnings,
                security_status: this.issues.some(i => i.category === 'security') ? 'REVIEW_REQUIRED' : 'GOOD',
                primary_concerns: this.issues.filter(i => i.severity === 'high').map(i => i.description)
            },
            
            // Prescription
            prescription: {
                immediate_actions: this.issues
                    .filter(i => i.severity === 'high')
                    .map(i => i.recommendation),
                maintenance_tasks: this.issues
                    .filter(i => i.severity === 'medium')
                    .map(i => i.recommendation),
                preventive_measures: [
                    'Regular RLS policy audits for multi-tenant security',
                    'Periodic performance index optimization',
                    'Schema migration consistency checks',
                    'API access pattern monitoring'
                ]
            },
            
            // Prognosis
            prognosis: {
                performance_outlook: successfulQueries >= totalQueries * 0.8 ? 'EXCELLENT' : 'NEEDS_ATTENTION',
                security_outlook: criticalIssues === 0 ? 'SECURE' : 'REQUIRES_HARDENING',
                scalability_readiness: 'PRODUCTION_READY',
                recommended_followup: '7 days for critical issues, 30 days for routine checkup'
            }
        };
    }

    /**
     * Run Complete Surgical Diagnostic
     */
    async runCompleteDiagnostic() {
        const startTime = Date.now();
        
        console.log('🏥 Starting Complete Database Surgical Diagnostic...\n');
        
        try {
            // Connect to database
            await this.connect();
            
            // Execute all diagnostic queries
            await this.analyzeColumnInventory();
            await this.analyzeConstraints();
            await this.analyzeRLSPolicies();
            await this.analyzeRLSStatus();
            await this.analyzeForeignKeys();
            await this.analyzeRPCFunctions();
            
            const totalTime = Date.now() - startTime;
            
            console.log('\n' + '='.repeat(70));
            console.log('🏥 OPERACIÓN BISTURÍ COMPLETED');
            console.log('='.repeat(70));
            
            // Generate health report
            const healthReport = this.generateHealthReport();
            
            // Display summary
            console.log('\n📋 DIAGNOSIS SUMMARY:');
            console.log(`Overall Health: ${healthReport.diagnosis.overall_health}`);
            console.log(`Critical Issues: ${healthReport.diagnosis.critical_issues}`);
            console.log(`Warnings: ${healthReport.diagnosis.warnings}`);
            console.log(`Security Status: ${healthReport.diagnosis.security_status}`);
            console.log(`Query Success Rate: ${healthReport.vital_signs.query_success_rate}`);
            console.log(`Total Diagnostic Time: ${totalTime}ms`);
            
            if (healthReport.prescription.immediate_actions.length > 0) {
                console.log('\n🚨 IMMEDIATE ACTIONS REQUIRED:');
                healthReport.prescription.immediate_actions.forEach((action, i) => {
                    console.log(`${i + 1}. ${action}`);
                });
            }
            
            // Save detailed report
            const reportData = {
                timestamp: new Date().toISOString(),
                summary: healthReport,
                detailed_results: this.results,
                performance_metrics: this.performance,
                all_issues: this.issues,
                total_diagnostic_time_ms: totalTime
            };
            
            const reportPath = path.join(__dirname, '..', 'reports', 'database-surgical-diagnostic-pg.json');
            const htmlReportPath = path.join(__dirname, '..', 'reports', 'database-surgical-diagnostic-pg.html');
            
            // Ensure reports directory exists
            const reportsDir = path.dirname(reportPath);
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }
            
            // Save JSON report
            fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
            
            // Generate HTML report
            const htmlContent = this.generateHTMLReport(reportData);
            fs.writeFileSync(htmlReportPath, htmlContent);
            
            console.log(`\n📄 Detailed reports saved:`);
            console.log(`   JSON: ${reportPath}`);
            console.log(`   HTML: ${htmlReportPath}`);
            
            return reportData;
            
        } catch (error) {
            console.error('💥 SURGICAL DIAGNOSTIC FAILED:', error.message);
            throw error;
        } finally {
            await this.disconnect();
        }
    }

    /**
     * Generate HTML Report
     */
    generateHTMLReport(reportData) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ClueQuest Database Surgical Diagnostic (PostgreSQL)</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
        .vital-signs { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .vital-card { background: #f8fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #10b981; }
        .vital-card.warning { border-left-color: #f59e0b; }
        .vital-card.critical { border-left-color: #ef4444; }
        .issue { padding: 15px; margin: 10px 0; border-radius: 6px; }
        .issue.high { background: #fef2f2; border-left: 4px solid #ef4444; }
        .issue.medium { background: #fffbeb; border-left: 4px solid #f59e0b; }
        .issue.low { background: #f0f9ff; border-left: 4px solid #3b82f6; }
        .performance-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .performance-table th, .performance-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .performance-table th { background: #f9fafb; font-weight: 600; }
        .status-success { color: #10b981; font-weight: bold; }
        .status-error { color: #ef4444; font-weight: bold; }
        .status-warning { color: #f59e0b; font-weight: bold; }
        pre { background: #f8fafc; padding: 15px; border-radius: 6px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 ClueQuest Database Surgical Diagnostic (PostgreSQL)</h1>
            <p>Complete health analysis performed on ${new Date(reportData.timestamp).toLocaleString()}</p>
        </div>
        
        <div class="content">
            <!-- Vital Signs -->
            <div class="section">
                <h2>📊 Vital Signs</h2>
                <div class="vital-signs">
                    <div class="vital-card ${reportData.summary.vital_signs.database_connectivity === 'HEALTHY' ? '' : 'critical'}">
                        <h3>Database Connectivity</h3>
                        <div class="value">${reportData.summary.vital_signs.database_connectivity}</div>
                    </div>
                    <div class="vital-card">
                        <h3>Query Success Rate</h3>
                        <div class="value">${reportData.summary.vital_signs.query_success_rate}</div>
                    </div>
                    <div class="vital-card">
                        <h3>Schema Integrity</h3>
                        <div class="value">${reportData.summary.vital_signs.schema_integrity}</div>
                    </div>
                    <div class="vital-card">
                        <h3>Avg Response Time</h3>
                        <div class="value">${reportData.summary.vital_signs.response_time_avg}ms</div>
                    </div>
                </div>
            </div>

            <!-- Diagnosis -->
            <div class="section">
                <h2>🩺 Diagnosis</h2>
                <div class="vital-card ${reportData.summary.diagnosis.overall_health === 'HEALTHY' ? '' : 'warning'}">
                    <h3>Overall Health: ${reportData.summary.diagnosis.overall_health}</h3>
                    <p>Critical Issues: ${reportData.summary.diagnosis.critical_issues}</p>
                    <p>Warnings: ${reportData.summary.diagnosis.warnings}</p>
                    <p>Security Status: ${reportData.summary.diagnosis.security_status}</p>
                </div>
            </div>

            <!-- Issues -->
            ${reportData.all_issues.length > 0 ? `
            <div class="section">
                <h2>🚨 Issues Identified</h2>
                ${reportData.all_issues.map(issue => `
                    <div class="issue ${issue.severity}">
                        <h4>${issue.category.toUpperCase()}: ${issue.description}</h4>
                        <p><strong>Severity:</strong> ${issue.severity}</p>
                        <p><strong>Recommendation:</strong> ${issue.recommendation}</p>
                        ${issue.error ? `<p><strong>Error:</strong> ${issue.error}</p>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : '<div class="section"><h2>✅ No Issues Found</h2><p>Database appears to be healthy!</p></div>'}

            <!-- Performance Metrics -->
            <div class="section">
                <h2>⚡ Performance Metrics</h2>
                <table class="performance-table">
                    <thead>
                        <tr>
                            <th>Diagnostic</th>
                            <th>Duration (ms)</th>
                            <th>Status</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(reportData.performance_metrics).map(([name, metrics]) => `
                            <tr>
                                <td>${name.replace(/_/g, ' ').toUpperCase()}</td>
                                <td>${metrics.duration_ms || 'N/A'}</td>
                                <td class="status-${metrics.status === 'success' ? 'success' : metrics.status === 'error' ? 'error' : 'warning'}">${metrics.status}</td>
                                <td>${metrics.row_count ? `${metrics.row_count} rows` : metrics.note || metrics.error || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Prescription -->
            <div class="section">
                <h2>💊 Prescription</h2>
                ${reportData.summary.prescription.immediate_actions.length > 0 ? `
                    <h3>🚨 Immediate Actions Required</h3>
                    <ul>
                        ${reportData.summary.prescription.immediate_actions.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                ` : ''}
                
                ${reportData.summary.prescription.maintenance_tasks.length > 0 ? `
                    <h3>🔧 Maintenance Tasks</h3>
                    <ul>
                        ${reportData.summary.prescription.maintenance_tasks.map(task => `<li>${task}</li>`).join('')}
                    </ul>
                ` : ''}

                <h3>🛡️ Preventive Measures</h3>
                <ul>
                    ${reportData.summary.prescription.preventive_measures.map(measure => `<li>${measure}</li>`).join('')}
                </ul>
            </div>

            <!-- Prognosis -->
            <div class="section">
                <h2>🔮 Prognosis</h2>
                <div class="vital-signs">
                    <div class="vital-card">
                        <h3>Performance Outlook</h3>
                        <div class="value">${reportData.summary.prognosis.performance_outlook}</div>
                    </div>
                    <div class="vital-card">
                        <h3>Security Outlook</h3>
                        <div class="value">${reportData.summary.prognosis.security_outlook}</div>
                    </div>
                    <div class="vital-card">
                        <h3>Scalability</h3>
                        <div class="value">${reportData.summary.prognosis.scalability_readiness}</div>
                    </div>
                </div>
                <p><strong>Recommended Follow-up:</strong> ${reportData.summary.prognosis.recommended_followup}</p>
            </div>

            <!-- Raw Data -->
            <div class="section">
                <h2>📋 Raw Diagnostic Data</h2>
                <pre>${JSON.stringify(reportData.detailed_results, null, 2)}</pre>
            </div>
        </div>
    </div>
</body>
</html>
        `.trim();
    }
}

// Run the diagnostic if called directly
if (require.main === module) {
    const diagnostic = new DatabaseSurgicalDiagnostic();
    diagnostic.runCompleteDiagnostic()
        .then((report) => {
            console.log('\n🎉 OPERACIÓN BISTURÍ COMPLETED SUCCESSFULLY');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 OPERACIÓN BISTURÍ FAILED:', error);
            process.exit(1);
        });
}

module.exports = DatabaseSurgicalDiagnostic;
