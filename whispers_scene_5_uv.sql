-- Scene 5: UV Light and Anagram Puzzle
-- Multi-sensory puzzle with UV light detection and anagram solving

DO $$
DECLARE
    adventure_uuid UUID;
    scene_uuid UUID;
BEGIN
    -- Get the adventure ID
    SELECT id INTO adventure_uuid 
    FROM public.cluequest_enhanced_adventures 
    WHERE story_id = 'whispers_in_the_library';
    
    -- Create Scene 5: UV Light and Anagram
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
        5,
        'uv_anagram',
        'Light and Shadows',
        'The forbidden section of the library with books numbered 1-12. Players must use UV light to reveal hidden letters and solve an anagram puzzle.',
        2,
        'You enter a dark corridor in the forbidden section. On the shelves are dusty books numbered 1 through 12. You hear recorded whispers repeating a poem in an archaic language. You find a UV flashlight and reading glasses on a table. The books contain hidden secrets that only UV light can reveal.',
        '[
            "Use UV flashlight to reveal hidden letters on book spines",
            "Collect all 12 letters in order",
            "Solve the anagram to form meaningful words",
            "Find the book with the cypress symbol and retrieve its contents"
        ]',
        '{
            "required_actions": [
                "use_uv_light",
                "collect_letters",
                "solve_anagram",
                "find_cypress_book",
                "retrieve_contents"
            ],
            "success_condition": "cypress_book_found",
            "validation_method": "qr_scan_or_physical_retrieval"
        }',
        '[
            {
                "puzzle_id": "uv_letter_collection",
                "type": "spatial",
                "description": "Use UV light to reveal fluorescent letters on book spines",
                "difficulty": "intermediate"
            },
            {
                "puzzle_id": "anagram_solving",
                "type": "linguistic",
                "description": "Rearrange letters to form meaningful words",
                "difficulty": "intermediate"
            },
            {
                "puzzle_id": "book_identification",
                "type": "logical",
                "description": "Find the book with cypress symbol based on anagram solution",
                "difficulty": "intermediate"
            }
        ]',
        '[
            {
                "challenge_id": "uv_light_required",
                "description": "Must use UV light to see hidden letters",
                "optional": false
            }
        ]',
        '[
            {
                "interaction_id": "uv_light_usage",
                "type": "physical",
                "description": "Use UV flashlight to illuminate book spines"
            },
            {
                "interaction_id": "letter_collection",
                "type": "visual",
                "description": "Collect and record the revealed letters"
            },
            {
                "interaction_id": "anagram_manipulation",
                "type": "cognitive",
                "description": "Rearrange letters to form words"
            }
        ]',
        '[
            {
                "qr_id": "uv_guide",
                "location": "forbidden_section_table",
                "content": "UV light usage instructions"
            }
        ]',
        '[
            {
                "asset_id": "uv_simulation",
                "type": "overlay",
                "description": "UV light effect simulation"
            },
            {
                "asset_id": "book_glow",
                "type": "overlay",
                "description": "Fluorescent letters glowing on book spines"
            }
        ]',
        '[
            {
                "tech_id": "uv_detector",
                "type": "ar_overlay",
                "description": "AR UV light detection and letter revelation"
            }
        ]',
        20,
        '[
            {
                "level": 1,
                "hint": "Use the UV flashlight to illuminate the book spines - hidden letters will glow",
                "cost": 0
            },
            {
                "level": 2,
                "hint": "The letters in order are: E, L, S, A, E, N, D, O, C, I, R, P",
                "cost": 0
            },
            {
                "level": 3,
                "hint": "Rearrange the letters to form ''EL SEÑOR CIPRÉS'' - look for a book with a cypress symbol",
                "cost": 0
            }
        ]',
        '{
            "help_available": true,
            "uv_tutorial": true,
            "anagram_solver": true
        }',
        75,
        '["logic_puzzle"]',
        '[
            "Introduction to UV light mechanics",
            "Discovery of Dr. Reyes connection",
            "Collection of mirror and sealed envelope"
        ]',
        5
    ) RETURNING id INTO scene_uuid;
    
    -- Create detailed puzzles for Scene 5
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
        'uv_anagram_combination',
        'UV Light Letter Collection and Anagram',
        'Use UV light to reveal hidden letters on book spines, then solve the anagram to find the correct book.',
        'spatial',
        'intermediate',
        'observation',
        '{
            "books": [
                {"number": 1, "uv_letter": "E"},
                {"number": 2, "uv_letter": "L"},
                {"number": 3, "uv_letter": "S"},
                {"number": 4, "uv_letter": "A"},
                {"number": 5, "uv_letter": "E"},
                {"number": 6, "uv_letter": "N"},
                {"number": 7, "uv_letter": "D"},
                {"number": 8, "uv_letter": "O"},
                {"number": 9, "uv_letter": "C"},
                {"number": 10, "uv_letter": "I"},
                {"number": 11, "uv_letter": "R"},
                {"number": 12, "uv_letter": "P"}
            ],
            "whispered_poem": "Un espejo refleja la verdad, un espejo revela el mal",
            "instructions": "Use UV light on each book spine to reveal the hidden letter, collect all letters, then rearrange them to form meaningful words.",
            "uv_equipment": "UV flashlight and reading glasses provided"
        }',
        '{
            "collected_letters": ["E", "L", "S", "A", "E", "N", "D", "O", "C", "I", "R", "P"],
            "anagram_solution": "EL SEÑOR CIPRÉS",
            "translation": "The Lord Cypress",
            "target_book": "Book with cypress symbol on cover",
            "book_contents": [
                "Circular mirror with engraved symbols",
                "Sealed envelope with letter from Dr. Reyes",
                "UV ink letter I"
            ],
            "envelope_contents": "If you have reached here, you know the murderer is not who you think. Look for the tree in the heart of the library."
        }',
        '[
            {
                "alternative": "Direct book search without anagram",
                "solution": "Still requires UV light to identify the correct book"
            }
        ]',
        ARRAY['uv_light', 'manual_input', 'anagram_solver'],
        '{
            "validation_type": "exact_match",
            "required_fields": ["letters_collected", "anagram_solved", "book_found"],
            "tolerance": 0,
            "case_sensitive": false
        }',
        '{
            "immediate_feedback": true,
            "progressive_hints": true,
            "success_message": "Brilliant! You found ''EL SEÑOR CIPRÉS''. The book with the cypress symbol contains important clues.",
            "failure_message": "Make sure you''ve collected all 12 letters with the UV light, then try rearranging them to form Spanish words."
        }',
        ARRAY['ar_overlay', 'uv_detection'],
        '[
            {
                "component": "uv_light_simulator",
                "interaction": "light_beam_control"
            },
            {
                "component": "letter_revealer",
                "interaction": "fluorescence_effect"
            },
            {
                "component": "anagram_solver",
                "interaction": "letter_rearrangement"
            }
        ]',
        '{
            "qr_scan_validation": true,
            "qr_content_reveal": "uv_instructions"
        }',
        '[
            {
                "level": 1,
                "hint": "Point the UV flashlight at each book spine - hidden letters will glow fluorescent",
                "unlock_time": 300
            },
            {
                "level": 2,
                "hint": "The letters in order are: E, L, S, A, E, N, D, O, C, I, R, P",
                "unlock_time": 600
            },
            {
                "level": 3,
                "hint": "Try forming Spanish words: ''EL SEÑOR CIPRÉS'' - look for a book with a cypress tree symbol",
                "unlock_time": 900
            }
        ]',
        '[
            {
                "resource": "uv_light_guide",
                "type": "tutorial",
                "content": "How to use UV light to reveal hidden messages"
            },
            {
                "resource": "anagram_solver_tool",
                "type": "tool",
                "content": "Interactive anagram solving tool"
            }
        ]',
        true,
        1200,
        3,
        false,
        75,
        '["logic_puzzle_unlock"]',
        '{
            "consequence": "time_penalty",
            "penalty_points": 15,
            "retry_allowed": true
        }',
        1
    );
    
    -- Create QR codes for Scene 5
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
        'uv_guide_qr',
        'WHISPERS_UV_GUIDE_005',
        'UV Light Instructions',
        'On the table in forbidden section',
        'reference',
        '{
            "uv_instructions": "1. Turn on the UV flashlight. 2. Point it at each book spine numbered 1-12. 3. Hidden letters will glow fluorescent. 4. Record each letter in order. 5. Rearrange the letters to form meaningful words.",
            "safety_note": "UV light is safe for short-term use. Do not look directly at the light source."
        }',
        'scan',
        '{
            "overlay_type": "instruction_panel",
            "animation": "slide_in"
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
        'cypress_book_success_qr',
        'WHISPERS_CYPRESS_SUCCESS_005',
        'Cypress Book Found',
        'Inside the cypress book',
        'reward',
        '{
            "book_found": true,
            "contents": [
                "Circular mirror with engraved symbols",
                "Sealed envelope from Dr. Reyes",
                "UV ink letter I"
            ],
            "envelope_message": "If you have reached here, you know the murderer is not who you think. Look for the tree in the heart of the library.",
            "message": "Excellent! You solved the anagram and found the cypress book. Dr. Reyes'' message suggests the murderer is not who you initially suspected.",
            "unlocks": ["logic_puzzle_scene"],
            "letter_collected": "I"
        }',
        'scan',
        '{
            "overlay_type": "success_animation",
            "animation": "book_glow"
        }',
        false,
        false,
        1000,
        '{}',
        '{}',
        true
    );
    
END $$;
