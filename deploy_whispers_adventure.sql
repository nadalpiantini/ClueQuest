-- Whispers in the Library - Complete Deployment Script
-- Deploys the entire adventure with all scenes, puzzles, and interactions

-- ========================================
-- DEPLOYMENT SCRIPT FOR WHISPERS ADVENTURE
-- ========================================
-- This script deploys the complete "Whispers in the Library" adventure
-- Run this script to create the entire adventure in your ClueQuest database

\echo 'Starting Whispers in the Library deployment...'

-- Step 1: Create main adventure record
\echo 'Step 1: Creating main adventure record...'
\i whispers_adventure_main.sql

-- Step 2: Create Scene 1 - Card Catalog
\echo 'Step 2: Creating Scene 1 - Card Catalog...'
\i whispers_scene_1_catalog.sql

-- Step 3: Create Scene 2 - Manuscript Cipher
\echo 'Step 3: Creating Scene 2 - Manuscript Cipher...'
\i whispers_scene_2_cipher.sql

-- Step 4: Create Scene 3 - Poem and Clock
\echo 'Step 4: Creating Scene 3 - Poem and Clock...'
\i whispers_scene_3_poem.sql

-- Step 5: Create Scene 4 - Map Fragment
\echo 'Step 5: Creating Scene 4 - Map Fragment...'
\i whispers_scene_4_map.sql

-- Step 6: Create Scene 5 - UV Light and Anagram
\echo 'Step 6: Creating Scene 5 - UV Light and Anagram...'
\i whispers_scene_5_uv.sql

-- Step 7: Create Scene 6 - Logic Puzzle
\echo 'Step 7: Creating Scene 6 - Logic Puzzle...'
\i whispers_scene_6_logic.sql

-- Step 8: Create Scene 7 - Microfilm Acrostic
\echo 'Step 8: Creating Scene 7 - Microfilm Acrostic...'
\i whispers_scene_7_microfilm.sql

-- Step 9: Create Scene 8 - Final Confrontation
\echo 'Step 9: Creating Scene 8 - Final Confrontation...'
\i whispers_scene_8_final.sql

-- Step 10: Run comprehensive tests
\echo 'Step 10: Running comprehensive tests...'
\i whispers_test_script.sql

\echo '========================================'
\echo 'WHISPERS IN THE LIBRARY DEPLOYMENT COMPLETE!'
\echo '========================================'
\echo 'The adventure has been successfully deployed with:'
\echo '- 1 main adventure record'
\echo '- 8 interconnected scenes'
\echo '- Multiple puzzles per scene'
\echo '- QR code interactions'
\echo '- AR elements and technology integration'
\echo '- Complete letter collection progression'
\echo '- Final word formation (BIBLIOMA)'
\echo ''
\echo 'The adventure is now ready for players!'
\echo '========================================'
