-- Whispers in the Library - Complete Test Script
-- Tests the entire adventure flow and puzzle connections

-- Test 1: Verify Adventure Creation
DO $$
DECLARE
    adventure_count INTEGER;
    adventure_uuid UUID;
BEGIN
    -- Check if adventure was created
    SELECT COUNT(*) INTO adventure_count
    FROM public.cluequest_enhanced_adventures 
    WHERE story_id = 'whispers_in_the_library';
    
    IF adventure_count = 1 THEN
        RAISE NOTICE '✓ Adventure created successfully';
        
        -- Get adventure ID
        SELECT id INTO adventure_uuid 
        FROM public.cluequest_enhanced_adventures 
        WHERE story_id = 'whispers_in_the_library';
        
        RAISE NOTICE 'Adventure ID: %', adventure_uuid;
    ELSE
        RAISE EXCEPTION '✗ Adventure creation failed - count: %', adventure_count;
    END IF;
END $$;

-- Test 2: Verify All Scenes Created
DO $$
DECLARE
    scene_count INTEGER;
    expected_scenes TEXT[] := ARRAY[
        'card_catalog',
        'manuscript_cipher', 
        'poem_clock',
        'map_fragment',
        'uv_anagram',
        'logic_puzzle',
        'microfilm_acrostic',
        'final_confrontation'
    ];
    scene_id TEXT;
    adventure_uuid UUID;
BEGIN
    -- Get adventure ID
    SELECT id INTO adventure_uuid 
    FROM public.cluequest_enhanced_adventures 
    WHERE story_id = 'whispers_in_the_library';
    
    -- Check scene count
    SELECT COUNT(*) INTO scene_count
    FROM public.cluequest_enhanced_scenes 
    WHERE adventure_id = adventure_uuid;
    
    IF scene_count = 8 THEN
        RAISE NOTICE '✓ All 8 scenes created successfully';
    ELSE
        RAISE EXCEPTION '✗ Scene creation failed - expected 8, got %', scene_count;
    END IF;
    
    -- Check each scene exists
    FOREACH scene_id IN ARRAY expected_scenes
    LOOP
        IF EXISTS (
            SELECT 1 FROM public.cluequest_enhanced_scenes 
            WHERE adventure_id = adventure_uuid AND scene_id = scene_id
        ) THEN
            RAISE NOTICE '✓ Scene % exists', scene_id;
        ELSE
            RAISE EXCEPTION '✗ Scene % missing', scene_id;
        END IF;
    END LOOP;
END $$;

-- Test 3: Verify Puzzle Progression
DO $$
DECLARE
    adventure_uuid UUID;
    scene_uuid UUID;
    puzzle_count INTEGER;
    total_puzzles INTEGER := 0;
    scene_record RECORD;
BEGIN
    -- Get adventure ID
    SELECT id INTO adventure_uuid 
    FROM public.cluequest_enhanced_adventures 
    WHERE story_id = 'whispers_in_the_library';
    
    -- Check puzzles in each scene
    FOR scene_record IN 
        SELECT id, scene_id, title 
        FROM public.cluequest_enhanced_scenes 
        WHERE adventure_id = adventure_uuid 
        ORDER BY order_index
    LOOP
        SELECT COUNT(*) INTO puzzle_count
        FROM public.cluequest_enhanced_puzzles 
        WHERE scene_id = scene_record.id;
        
        total_puzzles := total_puzzles + puzzle_count;
        
        IF puzzle_count > 0 THEN
            RAISE NOTICE '✓ Scene % has % puzzles', scene_record.scene_id, puzzle_count;
        ELSE
            RAISE EXCEPTION '✗ Scene % has no puzzles', scene_record.scene_id;
        END IF;
    END LOOP;
    
    RAISE NOTICE '✓ Total puzzles created: %', total_puzzles;
END $$;

-- Test 4: Verify QR Code Integration
DO $$
DECLARE
    adventure_uuid UUID;
    scene_uuid UUID;
    qr_count INTEGER;
    total_qr_codes INTEGER := 0;
    scene_record RECORD;
BEGIN
    -- Get adventure ID
    SELECT id INTO adventure_uuid 
    FROM public.cluequest_enhanced_adventures 
    WHERE story_id = 'whispers_in_the_library';
    
    -- Check QR codes in each scene
    FOR scene_record IN 
        SELECT id, scene_id, title 
        FROM public.cluequest_enhanced_scenes 
        WHERE adventure_id = adventure_uuid 
        ORDER BY order_index
    LOOP
        SELECT COUNT(*) INTO qr_count
        FROM public.cluequest_enhanced_qr_codes 
        WHERE scene_id = scene_record.id;
        
        total_qr_codes := total_qr_codes + qr_count;
        
        IF qr_count >= 2 THEN
            RAISE NOTICE '✓ Scene % has % QR codes', scene_record.scene_id, qr_count;
        ELSE
            RAISE EXCEPTION '✗ Scene % has insufficient QR codes: %', scene_record.scene_id, qr_count;
        END IF;
    END LOOP;
    
    RAISE NOTICE '✓ Total QR codes created: %', total_qr_codes;
END $$;

-- Test 5: Verify Letter Collection Progression
DO $$
DECLARE
    adventure_uuid UUID;
    scene_uuid UUID;
    expected_letters TEXT[] := ARRAY['M', 'A', 'P', 'L', 'I', 'B', 'R', 'O'];
    scene_letters TEXT[] := ARRAY[
        'M',  -- Scene 1: Card Catalog
        'A',  -- Scene 2: Manuscript Cipher
        'P',  -- Scene 3: Poem and Clock
        'L',  -- Scene 4: Map Fragment
        'I',  -- Scene 5: UV Anagram
        'B',  -- Scene 6: Logic Puzzle
        'R',  -- Scene 7: Microfilm (first letter)
        'O'   -- Scene 7: Microfilm (second letter)
    ];
    scene_record RECORD;
    letter_found BOOLEAN;
    i INTEGER;
BEGIN
    -- Get adventure ID
    SELECT id INTO adventure_uuid 
    FROM public.cluequest_enhanced_adventures 
    WHERE story_id = 'whispers_in_the_library';
    
    -- Check each scene for letter collection
    i := 1;
    FOR scene_record IN 
        SELECT id, scene_id, title 
        FROM public.cluequest_enhanced_scenes 
        WHERE adventure_id = adventure_uuid 
        ORDER BY order_index
    LOOP
        -- Check if QR codes contain the expected letter
        SELECT EXISTS (
            SELECT 1 FROM public.cluequest_enhanced_qr_codes 
            WHERE scene_id = scene_record.id 
            AND content_data::text LIKE '%"letter_collected": "' || scene_letters[i] || '"%'
        ) INTO letter_found;
        
        IF letter_found THEN
            RAISE NOTICE '✓ Scene % collects letter %', scene_record.scene_id, scene_letters[i];
        ELSE
            RAISE EXCEPTION '✗ Scene % missing letter %', scene_record.scene_id, scene_letters[i];
        END IF;
        
        i := i + 1;
    END LOOP;
    
    RAISE NOTICE '✓ All letter collection points verified';
END $$;

-- Test 6: Verify Scene Unlock Progression
DO $$
DECLARE
    adventure_uuid UUID;
    scene_record RECORD;
    unlock_chain TEXT[] := ARRAY[
        'manuscript_cipher',
        'poem_clock',
        'map_fragment',
        'uv_anagram',
        'logic_puzzle',
        'microfilm_acrostic',
        'final_confrontation'
    ];
    i INTEGER;
    unlock_found BOOLEAN;
BEGIN
    -- Get adventure ID
    SELECT id INTO adventure_uuid 
    FROM public.cluequest_enhanced_adventures 
    WHERE story_id = 'whispers_in_the_library';
    
    -- Check unlock progression (skip first scene as it has no prerequisites)
    i := 1;
    FOR scene_record IN 
        SELECT id, scene_id, title, unlocks_next
        FROM public.cluequest_enhanced_scenes 
        WHERE adventure_id = adventure_uuid 
        AND order_index > 1
        ORDER BY order_index
    LOOP
        -- Check if scene unlocks the next one
        SELECT unlock_chain[i] = ANY(unlocks_next) INTO unlock_found;
        
        IF unlock_found THEN
            RAISE NOTICE '✓ Scene % unlocks %', scene_record.scene_id, unlock_chain[i];
        ELSE
            RAISE EXCEPTION '✗ Scene % does not unlock %', scene_record.scene_id, unlock_chain[i];
        END IF;
        
        i := i + 1;
    END LOOP;
    
    RAISE NOTICE '✓ Scene unlock progression verified';
END $$;

-- Test 7: Verify Puzzle Difficulty Progression
DO $$
DECLARE
    adventure_uuid UUID;
    scene_record RECORD;
    expected_difficulties TEXT[] := ARRAY[
        'beginner',    -- Scene 1: Card Catalog
        'beginner',    -- Scene 2: Manuscript Cipher
        'intermediate', -- Scene 3: Poem and Clock
        'intermediate', -- Scene 4: Map Fragment
        'intermediate', -- Scene 5: UV Anagram
        'advanced',    -- Scene 6: Logic Puzzle
        'expert',      -- Scene 7: Microfilm Acrostic
        'expert'       -- Scene 8: Final Confrontation
    ];
    i INTEGER;
    difficulty_match BOOLEAN;
BEGIN
    -- Get adventure ID
    SELECT id INTO adventure_uuid 
    FROM public.cluequest_enhanced_adventures 
    WHERE story_id = 'whispers_in_the_library';
    
    -- Check difficulty progression
    i := 1;
    FOR scene_record IN 
        SELECT id, scene_id, title, puzzles
        FROM public.cluequest_enhanced_scenes 
        WHERE adventure_id = adventure_uuid 
        ORDER BY order_index
    LOOP
        -- Check if scene has puzzles with expected difficulty
        SELECT EXISTS (
            SELECT 1 FROM public.cluequest_enhanced_puzzles 
            WHERE scene_id = scene_record.id 
            AND difficulty::text = expected_difficulties[i]
        ) INTO difficulty_match;
        
        IF difficulty_match THEN
            RAISE NOTICE '✓ Scene % has % difficulty puzzles', scene_record.scene_id, expected_difficulties[i];
        ELSE
            RAISE EXCEPTION '✗ Scene % missing % difficulty puzzles', scene_record.scene_id, expected_difficulties[i];
        END IF;
        
        i := i + 1;
    END LOOP;
    
    RAISE NOTICE '✓ Difficulty progression verified';
END $$;

-- Test 8: Verify Final Word Formation
DO $$
DECLARE
    adventure_uuid UUID;
    final_scene_uuid UUID;
    puzzle_data JSONB;
    final_word TEXT;
    expected_word TEXT := 'BIBLIOMA';
BEGIN
    -- Get adventure ID
    SELECT id INTO adventure_uuid 
    FROM public.cluequest_enhanced_adventures 
    WHERE story_id = 'whispers_in_the_library';
    
    -- Get final scene
    SELECT id INTO final_scene_uuid
    FROM public.cluequest_enhanced_scenes 
    WHERE adventure_id = adventure_uuid 
    AND scene_id = 'final_confrontation';
    
    -- Get puzzle data
    SELECT puzzle_data INTO puzzle_data
    FROM public.cluequest_enhanced_puzzles 
    WHERE scene_id = final_scene_uuid 
    AND puzzle_id = 'final_letter_combination';
    
    -- Extract final word
    final_word := puzzle_data->'solution_data'->>'correct_word';
    
    IF final_word = expected_word THEN
        RAISE NOTICE '✓ Final word correctly set to %', final_word;
    ELSE
        RAISE EXCEPTION '✗ Final word incorrect - expected %, got %', expected_word, final_word;
    END IF;
END $$;

-- Test 9: Verify Adventure Metadata
DO $$
DECLARE
    adventure_record RECORD;
BEGIN
    -- Get adventure record
    SELECT * INTO adventure_record
    FROM public.cluequest_enhanced_adventures 
    WHERE story_id = 'whispers_in_the_library';
    
    -- Verify key metadata
    IF adventure_record.estimated_duration = 90 THEN
        RAISE NOTICE '✓ Duration set correctly: % minutes', adventure_record.estimated_duration;
    ELSE
        RAISE EXCEPTION '✗ Duration incorrect: %', adventure_record.estimated_duration;
    END IF;
    
    IF adventure_record.scene_count = 8 THEN
        RAISE NOTICE '✓ Scene count correct: %', adventure_record.scene_count;
    ELSE
        RAISE EXCEPTION '✗ Scene count incorrect: %', adventure_record.scene_count;
    END IF;
    
    IF adventure_record.min_players = 2 AND adventure_record.max_players = 6 THEN
        RAISE NOTICE '✓ Player range correct: %-%', adventure_record.min_players, adventure_record.max_players;
    ELSE
        RAISE EXCEPTION '✗ Player range incorrect: %-%', adventure_record.min_players, adventure_record.max_players;
    END IF;
    
    IF adventure_record.difficulty = 'intermediate' THEN
        RAISE NOTICE '✓ Difficulty level correct: %', adventure_record.difficulty;
    ELSE
        RAISE EXCEPTION '✗ Difficulty level incorrect: %', adventure_record.difficulty;
    END IF;
    
    IF adventure_record.status = 'published' THEN
        RAISE NOTICE '✓ Status correct: %', adventure_record.status;
    ELSE
        RAISE EXCEPTION '✗ Status incorrect: %', adventure_record.status;
    END IF;
END $$;

-- Test 10: Generate Adventure Summary
DO $$
DECLARE
    adventure_uuid UUID;
    scene_count INTEGER;
    puzzle_count INTEGER;
    qr_count INTEGER;
    total_points INTEGER;
    scene_record RECORD;
BEGIN
    -- Get adventure ID
    SELECT id INTO adventure_uuid 
    FROM public.cluequest_enhanced_adventures 
    WHERE story_id = 'whispers_in_the_library';
    
    -- Count elements
    SELECT COUNT(*) INTO scene_count
    FROM public.cluequest_enhanced_scenes 
    WHERE adventure_id = adventure_uuid;
    
    SELECT COUNT(*) INTO puzzle_count
    FROM public.cluequest_enhanced_puzzles p
    JOIN public.cluequest_enhanced_scenes s ON p.scene_id = s.id
    WHERE s.adventure_id = adventure_uuid;
    
    SELECT COUNT(*) INTO qr_count
    FROM public.cluequest_enhanced_qr_codes q
    JOIN public.cluequest_enhanced_scenes s ON q.scene_id = s.id
    WHERE s.adventure_id = adventure_uuid;
    
    SELECT SUM(points_reward) INTO total_points
    FROM public.cluequest_enhanced_scenes 
    WHERE adventure_id = adventure_uuid;
    
    -- Display summary
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'WHISPERS IN THE LIBRARY - TEST SUMMARY';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Adventure ID: %', adventure_uuid;
    RAISE NOTICE 'Scenes: %', scene_count;
    RAISE NOTICE 'Puzzles: %', puzzle_count;
    RAISE NOTICE 'QR Codes: %', qr_count;
    RAISE NOTICE 'Total Points: %', total_points;
    RAISE NOTICE '';
    RAISE NOTICE 'Scene Breakdown:';
    
    FOR scene_record IN 
        SELECT scene_id, title, points_reward, estimated_duration
        FROM public.cluequest_enhanced_scenes 
        WHERE adventure_id = adventure_uuid 
        ORDER BY order_index
    LOOP
        RAISE NOTICE '  %: % (% points, % min)', 
            scene_record.scene_id, 
            scene_record.title, 
            scene_record.points_reward,
            scene_record.estimated_duration;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE '✓ ALL TESTS PASSED - Adventure ready for deployment!';
    RAISE NOTICE '========================================';
END $$;
