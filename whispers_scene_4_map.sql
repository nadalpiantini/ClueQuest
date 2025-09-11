-- Scene 4: Map Fragment and Forbidden Section Puzzle
-- Riddle solving and pattern recognition

DO $$
DECLARE
    adventure_uuid UUID;
    scene_uuid UUID;
BEGIN
    -- Get the adventure ID
    SELECT id INTO adventure_uuid 
    FROM public.cluequest_enhanced_adventures 
    WHERE story_id = 'whispers_in_the_library';
    
    -- Create Scene 4: Map Fragment
    INSERT INTO public.cluequest_enhanced_scenes (
        adventure_id,
        scene_number,
        scene_id,
        title,
        description,
        act_number,
        narrative_content,
        objectives,
        completion_criteria,
        puzzles,
        challenges,
        interactions,
        qr_codes,
        ar_elements,
        tech_interactions,
        estimated_duration,
        hints,
        help_system,
        points_reward,
        unlocks_next,
        story_revelations,
        order_index
    ) VALUES (
        adventure_uuid,
        4,
        'map_fragment',
        'The Map and the Forbidden Section',
        'A corridor leading to the forbidden section with a locked display case containing a missing map fragment. Players must solve a riddle about library books to open the case.',
        2,
        'The map found in the previous scene shows a route through the corridors. However, it is missing a piece in the corner. You also find a locked display case that contains the missing fragment. The case is protected by a four-letter lock and a riddle about the library''s silent guardians.',
        '[
            "Read and understand the riddle about the eight silent sentinels",
            "Identify the eight books and their initials",
            "Solve the pattern to determine the four-letter code",
            "Open the display case to retrieve the map fragment"
        ]',
        '{
            "required_actions": [
                "read_riddle",
                "identify_books",
                "solve_pattern",
                "enter_code",
                "retrieve_fragment"
            ],
            "success_condition": "display_case_opened",
            "validation_method": "physical_case_opening"
        }',
        '[
            {
                "puzzle_id": "riddle_interpretation",
                "type": "linguistic",
                "description": "Understand the riddle about eight silent sentinels",
                "difficulty": "intermediate"
            },
            {
                "puzzle_id": "book_identification",
                "type": "logical",
                "description": "Identify the eight books and extract their initials",
                "difficulty": "intermediate"
            },
            {
                "puzzle_id": "pattern_solving",
                "type": "mathematical",
                "description": "Solve the mathematical pattern to find the code",
                "difficulty": "intermediate"
            }
        ]',
        '[
            {
                "challenge_id": "pattern_recognition",
                "description": "Must recognize the hidden pattern in book arrangement",
                "optional": false
            }
        ]',
        '[
            {
                "interaction_id": "riddle_reading",
                "type": "visual",
                "description": "Read and analyze the riddle text"
            },
            {
                "interaction_id": "book_examination",
                "type": "physical",
                "description": "Examine the eight books on the shelf"
            },
            {
                "interaction_id": "code_entry",
                "type": "physical",
                "description": "Enter the four-letter code on the display case"
            }
        ]',
        '[
            {
                "qr_id": "riddle_hint",
                "location": "display_case",
                "content": "Hint about the riddle interpretation"
            }
        ]',
        '[
            {
                "asset_id": "map_ar",
                "type": "3d_model",
                "description": "3D map with missing fragment highlighted"
            },
            {
                "asset_id": "bookshelf_glow",
                "type": "overlay",
                "description": "Glowing bookshelf with highlighted books"
            }
        ]',
        '[
            {
                "tech_id": "pattern_analyzer",
                "type": "ar_overlay",
                "description": "AR tool to analyze book patterns"
            }
        ]',
        20,
        '[
            {
                "level": 1,
                "hint": "The eight sentinels are the books on the shelf - look at their titles",
                "cost": 0
            },
            {
                "level": 2,
                "hint": "Four face east, four face west - this refers to their position on the shelf",
                "cost": 0
            },
            {
                "level": 3,
                "hint": "Sum their initials - A=1, B=2, C=3, etc. Then find the pattern",
                "cost": 0
            }
        ]',
        '{
            "help_available": true,
            "riddle_guide": true,
            "pattern_analysis_tool": true
        }',
        75,
        '["uv_anagram"]',
        '[
            "Introduction to the forbidden section",
            "Discovery of secret passage",
            "Collection of wooden symbol piece"
        ]',
        4
    ) RETURNING id INTO scene_uuid;
    
    -- Create detailed puzzles for Scene 4
    INSERT INTO public.cluequest_enhanced_puzzles (
        scene_id,
        puzzle_id,
        title,
        description,
        puzzle_type,
        difficulty,
        category,
        puzzle_data,
        solution_data,
        alternative_solutions,
        input_methods,
        validation_rules,
        feedback_system,
        tech_requirements,
        ar_components,
        qr_integration,
        hint_levels,
        help_resources,
        tutorial_mode,
        time_limit,
        attempt_limit,
        can_skip,
        points_reward,
        unlocks_content,
        failure_consequences,
        order_index
    ) VALUES (
        scene_uuid,
        'library_riddle_solving',
        'Library Riddle and Pattern Recognition',
        'Solve the riddle about eight silent sentinels to find the four-letter code that opens the display case.',
        'logical',
        'intermediate',
        'pattern_recognition',
        '{
            "riddle": "In our temple of knowledge reside eight silent sentinels, Four face east and four face west. We are brothers of paper and guard countless truths. If you sum our initials, you will get the code that opens the door.",
            "books": [
                {"title": "Ars Magna", "initial": "A", "position": "east"},
                {"title": "Bibliotheca", "initial": "B", "position": "west"},
                {"title": "Crónicas", "initial": "C", "position": "east"},
                {"title": "Diccionario", "initial": "D", "position": "west"},
                {"title": "Enciclopedia", "initial": "E", "position": "east"},
                {"title": "Filosofía", "initial": "F", "position": "west"},
                {"title": "Gramática", "initial": "G", "position": "east"},
                {"title": "Historia", "initial": "H", "position": "west"}
            ],
            "instructions": "Identify the eight books, determine which face east/west, sum their initials, and find the pattern to get the four-letter code."
        }',
        '{
            "east_books": ["A", "C", "E", "G"],
            "west_books": ["B", "D", "F", "H"],
            "east_sum": 16,
            "west_sum": 20,
            "total_sum": 36,
            "pattern_analysis": "The code is the concatenation of all initials in order: ABCDEFGH",
            "final_code": "ABCD",
            "display_case_contents": "Map fragment and wooden symbol with letter L"
        }',
        '[
            {
                "alternative": "Direct concatenation approach",
                "solution": "Simply concatenate all initials: ABCDEFGH, then take first 4: ABCD"
            }
        ]',
        ARRAY['manual_input', 'pattern_analysis', 'code_entry'],
        '{
            "validation_type": "exact_match",
            "required_fields": ["code_entered"],
            "tolerance": 0,
            "case_sensitive": false
        }',
        '{
            "immediate_feedback": true,
            "progressive_hints": true,
            "success_message": "Perfect! The display case opens, revealing the missing map fragment and a wooden symbol.",
            "failure_message": "Think about the riddle more carefully. What are the eight sentinels, and how do their initials relate to the code?"
        }',
        ARRAY['ar_overlay'],
        '[
            {
                "component": "bookshelf_3d",
                "interaction": "book_highlighting"
            },
            {
                "component": "pattern_visualizer",
                "interaction": "sum_calculation"
            }
        ]',
        '{
            "qr_scan_validation": true,
            "qr_content_reveal": "riddle_analysis"
        }',
        '[
            {
                "level": 1,
                "hint": "The eight sentinels are the books on the shelf - look at their titles and initials",
                "unlock_time": 300
            },
            {
                "level": 2,
                "hint": "Four face east (left side), four face west (right side) - this is about shelf position",
                "unlock_time": 600
            },
            {
                "level": 3,
                "hint": "Sometimes the simplest solution is correct - try concatenating all initials in order",
                "unlock_time": 900
            }
        ]',
        '[
            {
                "resource": "riddle_analysis_guide",
                "type": "tutorial",
                "content": "How to approach and solve riddles systematically"
            },
            {
                "resource": "pattern_recognition_tool",
                "type": "tool",
                "content": "Interactive tool to analyze number patterns"
            }
        ]',
        true,
        1200,
        3,
        false,
        75,
        '["uv_anagram_unlock"]',
        '{
            "consequence": "time_penalty",
            "penalty_points": 15,
            "retry_allowed": true
        }',
        1
    );
    
    -- Create QR codes for Scene 4
    INSERT INTO public.cluequest_enhanced_qr_codes (
        scene_id,
        qr_id,
        qr_data,
        display_name,
        location_description,
        content_type,
        content_data,
        interaction_type,
        ar_overlay,
        voice_activation,
        gesture_control,
        scan_limit,
        time_restrictions,
        player_restrictions,
        is_active
    ) VALUES (
        scene_uuid,
        'riddle_hint_qr',
        'WHISPERS_RIDDLE_HINT_004',
        'Riddle Analysis Hint',
        'On the display case',
        'clue',
        '{
            "hint_type": "riddle_interpretation",
            "content": "The eight sentinels are the books on the shelf. Look at their titles and initials. The east/west reference is about their position on the shelf.",
            "reveals": "book_identification"
        }',
        'scan',
        '{
            "overlay_type": "hint_text",
            "animation": "fade_in"
        }',
        false,
        false,
        1000,
        '{}',
        '{}',
        true
    ),
    (
        scene_uuid,
        'display_case_success_qr',
        'WHISPERS_DISPLAY_SUCCESS_004',
        'Display Case Opened',
        'Inside the opened display case',
        'reward',
        '{
            "case_opened": true,
            "contents": [
                "Missing map fragment showing secret passage",
                "Wooden symbol carved with letter L",
                "Note: ''The forbidden section awaits those who dare to enter''"
            ],
            "message": "Excellent! You solved the riddle and found the missing map fragment. The secret passage to the forbidden section is now revealed.",
            "unlocks": ["uv_anagram_scene"],
            "letter_collected": "L"
        }',
        'scan',
        '{
            "overlay_type": "success_animation",
            "animation": "case_glow"
        }',
        false,
        false,
        1000,
        '{}',
        '{}',
        true
    );
    
END $$;
