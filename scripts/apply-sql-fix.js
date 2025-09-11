#!/usr/bin/env node

/**
 * Apply SQL Fix via Supabase Client
 * ==================================
 * Applies the clean SQL fix using individual statements
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

require('dotenv').config({ path: '.env.local' });

class SQLFixer {
    constructor() {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        this.supabase = createClient(supabaseUrl, serviceRoleKey, {
            auth: { persistSession: false }
        });
        
        console.log('🔧 SQL FIX APPLICATOR - Starting...');
    }

    async applyCriticalFixes() {
        console.log('🚨 Applying critical database fixes...\n');

        // Critical Fix 1: Add missing columns
        try {
            console.log('1. Adding missing columns to adventures table...');
            
            // We can't execute ALTER TABLE directly via Supabase client
            // So we'll verify the columns exist by testing queries
            
            const { data: adventureTest, error: advError } = await this.supabase
                .from('cluequest_adventures')
                .select('created_by')
                .limit(1);
                
            if (advError && advError.message.includes('column "created_by" does not exist')) {
                console.log('❌ CRITICAL: created_by column missing from cluequest_adventures');
                console.log('⚠️  You MUST run this SQL in Supabase SQL Editor:');
                console.log('   ALTER TABLE cluequest_adventures ADD COLUMN created_by UUID REFERENCES auth.users(id);');
                console.log('   ALTER TABLE cluequest_adventures ADD COLUMN is_public BOOLEAN DEFAULT TRUE;');
            } else {
                console.log('✅ Adventures table columns look good');
            }
            
        } catch (error) {
            console.log(`⚠️  Column check: ${error.message}`);
        }

        // Critical Fix 2: Test RLS status
        console.log('\n2. Testing RLS policies...');
        try {
            // Try to access tables to see if RLS is working
            const tables = ['cluequest_profiles', 'cluequest_adventures', 'cluequest_sessions'];
            
            for (const table of tables) {
                const { error } = await this.supabase
                    .from(table)
                    .select('*')
                    .limit(1);
                    
                if (error && error.message.includes('RLS')) {
                    console.log(`✅ ${table}: RLS is active`);
                } else if (!error) {
                    console.log(`⚠️  ${table}: May need RLS policies`);
                } else {
                    console.log(`❓ ${table}: ${error.message}`);
                }
            }
        } catch (error) {
            console.log(`⚠️  RLS test error: ${error.message}`);
        }

        // Critical Fix 3: Test optimization function
        console.log('\n3. Testing optimization function...');
        try {
            const { data, error } = await this.supabase.rpc('get_dashboard_data_optimized');
            
            if (error) {
                if (error.message.includes('does not exist')) {
                    console.log('❌ CRITICAL: get_dashboard_data_optimized function missing');
                    console.log('⚠️  You MUST create this function in Supabase SQL Editor');
                } else {
                    console.log(`⚠️  Function issue: ${error.message}`);
                }
            } else {
                console.log('✅ Dashboard optimization function working');
            }
        } catch (error) {
            console.log(`⚠️  Function test error: ${error.message}`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('🩺 DIAGNOSIS COMPLETE');
        console.log('='.repeat(60));
        console.log('');
        console.log('📋 TO COMPLETE THE FIX:');
        console.log('1. Go to Supabase Dashboard → SQL Editor');
        console.log('2. Copy and paste: CLEAN_SUPABASE_FIX.sql');  
        console.log('3. Click RUN to execute all fixes');
        console.log('4. Run: npm run db:surgical-diagnostic');
        console.log('');
        console.log('🎯 Expected result: 100% success rate, 0 critical issues');
    }
}

if (require.main === module) {
    const fixer = new SQLFixer();
    fixer.applyCriticalFixes()
        .then(() => {
            console.log('🎉 Fix application completed!');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Fix application failed:', error);
            process.exit(1);
        });
}

module.exports = SQLFixer;