-- Scene 7: Microfilm Acrostic Puzzle
-- Audio-visual puzzle with acrostic and numerical code

DO $$
DECLARE
    adventure_uuid UUID;
    scene_uuid UUID;
BEGIN
    -- Get the adventure ID
    SELECT id INTO adventure_uuid 
    FROM public.cluequest_enhanced_adventures 
    WHERE story_id = 'whispers_in_the_library';
    
    -- Create Scene 7: Microfilm Acrostic
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
        7,
        'microfilm_acrostic',
        'The Ghost''s Whisper',
        'A microfilm room with a projector showing a confession. Players must decode an acrostic from a distorted voice and solve a numerical pattern to reveal the killer''s alias.',
        3,
        'You find a microfilm labeled ''Confession''. When you play it, you hear a distorted voice reciting a verse while the image projects symbols and numbers that appear to be a code. The voice speaks of hidden letters and an alias that must be discovered using the metal pen from the previous scene.',
        '[
            "Listen to the distorted voice and identify the acrostic pattern",
            "Analyze the projected numerical grid for hidden patterns",
            "Use the metal pen to trace the correct pattern",
            "Decode the killer''s alias and reveal the final clue"
        ]',
        '{
            "required_actions": [
                "listen_to_audio",
                "analyze_acrostic",
                "examine_numerical_grid",
                "trace_pattern",
                "decode_alias",
                "reveal_final_clue"
            ],
            "success_condition": "alias_decoded",
            "validation_method": "voice_input_or_pen_tracing"
        }',
        '[
            {
                "puzzle_id": "acrostic_analysis",
                "type": "linguistic",
                "description": "Extract acrostic pattern from distorted voice",
                "difficulty": "advanced"
            },
            {
                "puzzle_id": "numerical_pattern",
                "type": "mathematical",
                "description": "Analyze 5x5 numerical grid for hidden patterns",
                "difficulty": "advanced"
            },
            {
                "puzzle_id": "alias_decoding",
                "type": "cryptographic",
                "description": "Decode the killer''s alias using pen tracing",
                "difficulty": "expert"
            }
        ]',
        '[
            {
                "challenge_id": "multi_modal",
                "description": "Must combine audio and visual information",
                "optional": false
            }
        ]',
        '[
            {
                "interaction_id": "audio_listening",
                "type": "audio",
                "description": "Listen carefully to the distorted voice"
            },
            {
                "interaction_id": "grid_analysis",
                "type": "visual",
                "description": "Examine the projected numerical grid"
            },
            {
                "interaction_id": "pen_tracing",
                "type": "physical",
                "description": "Use metal pen to trace patterns on paper"
            }
        ]',
        '[
            {
                "qr_id": "microfilm_guide",
                "location": "microfilm_projector",
                "content": "Acrostic and pattern analysis guide"
            }
        ]',
        '[
            {
                "asset_id": "microfilm_ar",
                "type": "3d_model",
                "description": "3D microfilm projector with audio visualization"
            },
            {
                "asset_id": "grid_overlay",
                "type": "overlay",
                "description": "Interactive numerical grid overlay"
            }
        ]',
        '[
            {
                "tech_id": "audio_analyzer",
                "type": "voice_recognition",
                "description": "Audio analysis and acrostic detection"
            }
        ]',
        25,
        '[
            {
                "level": 1,
                "hint": "Listen to the first letter of each line of the verse - they form an acrostic",
                "cost": 0
            },
            {
                "level": 2,
                "hint": "The acrostic is NSMU - find these numbers in the grid (14, 19, 13, 21)",
                "cost": 0
            },
            {
                "level": 3,
                "hint": "Connect the numbers in the grid to form the letter R, then write REYES with the pen",
                "cost": 0
            }
        ]',
        '{
            "help_available": true,
            "acrostic_tutorial": true,
            "pattern_analysis_tool": true
        }',
        100,
        '["final_confrontation"]',
        '[
            "Revelation of Dr. Reyes as suspect",
            "Discovery of Henry as the real killer",
            "Collection of final letter O"
        ]',
        7
    ) RETURNING id INTO scene_uuid;
    
    -- Create detailed puzzles for Scene 7
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
        'microfilm_acrostic_decoding',
        'Microfilm Acrostic and Pattern Decoding',
        'Decode the acrostic from the distorted voice, analyze the numerical grid, and use the metal pen to reveal the killer''s alias.',
        'cryptographic',
        'expert',
        'pattern_recognition',
        '{
            "audio_verse": "No soy quien piensas, busco el saber; Si descifras mi nombre, la verdad verás. Mis letras están ocultas en cada línea; Usa la pluma del árbol para escribir mi alias.",
            "acrostic_clue": "First letter of each line: N, S, M, U",
            "numerical_grid": [
                [11, 3, 18, 9, 22],
                [4, 25, 7, 13, 1],
                [20, 14, 6, 2, 17],
                [5, 21, 10, 24, 8],
                [19, 12, 23, 15, 16]
            ],
            "instructions": "1. Extract the acrostic from the verse (NSMU). 2. Find these numbers in the grid (14, 19, 13, 21). 3. Connect them to form a letter. 4. Use the metal pen to write the killer''s alias."
        }',
        '{
            "acrostic": "NSMU",
            "number_positions": {
                "N": 14,
                "S": 19,
                "M": 13,
                "U": 21
            },
            "grid_locations": [
                {"number": 14, "position": [2, 1]},
                {"number": 19, "position": [4, 0]},
                {"number": 13, "position": [1, 3]},
                {"number": 21, "position": [3, 1]}
            ],
            "connected_letter": "R",
            "alias": "REYES",
            "final_revelation": "Dr. Reyes is the suspect, but a note reveals Henry is the real killer",
            "letter_collected": "R"
        }',
        '[
            {
                "alternative": "Direct pattern recognition",
                "solution": "Still requires understanding the acrostic to find correct numbers"
            }
        ]',
        ARRAY['voice_input', 'pen_tracing', 'manual_input'],
        '{
            "validation_type": "exact_match",
            "required_fields": ["acrostic_found", "pattern_traced", "alias_written"],
            "tolerance": 0,
            "case_sensitive": false
        }',
        '{
            "immediate_feedback": true,
            "progressive_hints": true,
            "success_message": "Brilliant! You decoded the alias REYES, but wait - a note falls from the projector revealing the truth about Henry.",
            "failure_message": "Listen carefully to the first letter of each line of the verse, then find those numbers in the grid."
        }',
        ARRAY['voice_recognition', 'ar_overlay'],
        '[
            {
                "component": "audio_visualizer",
                "interaction": "acrostic_highlighting"
            },
            {
                "component": "grid_3d",
                "interaction": "number_connection"
            },
            {
                "component": "pen_tracer",
                "interaction": "alias_writing"
            }
        ]',
        '{
            "qr_scan_validation": true,
            "qr_content_reveal": "acrostic_guide"
        }',
        '[
            {
                "level": 1,
                "hint": "The verse has four lines - take the first letter of each: N, S, M, U",
                "unlock_time": 300
            },
            {
                "level": 2,
                "hint": "Convert letters to numbers: N=14, S=19, M=13, U=21. Find these in the grid.",
                "unlock_time": 600
            },
            {
                "level": 3,
                "hint": "Connect the numbers in order to form the letter R, then write REYES with the pen.",
                "unlock_time": 900
            }
        ]',
        '[
            {
                "resource": "acrostic_guide",
                "type": "tutorial",
                "content": "How to identify and decode acrostics"
            },
            {
                "resource": "pattern_connection_tool",
                "type": "tool",
                "content": "Interactive tool to connect numbers in grid"
            }
        ]',
        true,
        1500,
        2,
        false,
        100,
        '["final_confrontation_unlock"]',
        '{
            "consequence": "time_penalty",
            "penalty_points": 30,
            "retry_allowed": true
        }',
        1
    );
    
    -- Create QR codes for Scene 7
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
        'microfilm_guide_qr',
        'WHISPERS_MICROFILM_GUIDE_007',
        'Microfilm Analysis Guide',
        'On the microfilm projector',
        'reference',
        '{
            "acrostic_guide": "An acrostic is a poem where the first letters of each line spell out a word or message. Listen to the first letter of each line of the verse.",
            "pattern_guide": "Look for numbers in the grid that correspond to the acrostic letters (A=1, B=2, etc.). Connect them in order to form a shape or letter."
        }',
        'scan',
        '{
            "overlay_type": "guide_panel",
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
        'alias_revealed_qr',
        'WHISPERS_ALIAS_REVEALED_007',
        'Alias Decoded Successfully',
        'From the falling note after decoding',
        'reward',
        '{
            "alias_decoded": true,
            "suspect_revealed": "Dr. Reyes",
            "twist_revelation": "If you believe I am the guilty one, you are wrong. Look at the custodian.",
            "true_killer": "Henry (the custodian)",
            "message": "You decoded the alias REYES, but the note reveals a shocking twist - Henry, the custodian, is the real killer!",
            "unlocks": ["final_confrontation_scene"],
            "letter_collected": "O"
        }',
        'scan',
        '{
            "overlay_type": "revelation_animation",
            "animation": "note_fall"
        }',
        false,
        false,
        1000,
        '{}',
        '{}',
        true
    );
    
END $$;
