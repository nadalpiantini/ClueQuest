-- Scene 3: Morse Code Clock and Poem Puzzle
-- Combined audio, visual, and logical puzzle

DO $$
DECLARE
    adventure_uuid UUID;
    scene_uuid UUID;
BEGIN
    -- Get the adventure ID
    SELECT id INTO adventure_uuid 
    FROM public.cluequest_enhanced_adventures 
    WHERE story_id = 'whispers_in_the_library';
    
    -- Create Scene 3: Poem and Clock
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
        3,
        'poem_clock',
        'The Poem and the Clock',
        'A private reading room with a pocket watch emitting Morse code and a poem with hidden clues. Players must decode Morse code, analyze the poem, and solve a letter grid puzzle.',
        2,
        'The room is dimly lit. On the table is a pocket watch (from the previous chest) and a notebook with an untitled poem. The watch emits a soft ticking that, if listened to carefully, marks a Morse code pattern. The poem contains hidden clues that must be combined with the Morse code to reveal the next step.',
        '[
            "Listen to the pocket watch and decode the Morse code pattern",
            "Analyze the poem to find hidden clues and verse references",
            "Use the letter grid to extract the correct word combination",
            "Combine all clues to find the secret compartment in the watch"
        ]',
        '{
            "required_actions": [
                "decode_morse_code",
                "analyze_poem_verses",
                "solve_letter_grid",
                "find_watch_compartment"
            ],
            "success_condition": "watch_compartment_opened",
            "validation_method": "physical_compartment_opening"
        }',
        '[
            {
                "puzzle_id": "morse_code_decode",
                "type": "temporal",
                "description": "Decode Morse code from pocket watch ticking",
                "difficulty": "intermediate"
            },
            {
                "puzzle_id": "poem_analysis",
                "type": "linguistic",
                "description": "Analyze poem verses for hidden clues",
                "difficulty": "intermediate"
            },
            {
                "puzzle_id": "letter_grid_puzzle",
                "type": "spatial",
                "description": "Extract words from 4x4 letter grid",
                "difficulty": "intermediate"
            }
        ]',
        '[
            {
                "challenge_id": "multi_sensory",
                "description": "Must use both audio and visual clues",
                "optional": false
            }
        ]',
        '[
            {
                "interaction_id": "watch_listening",
                "type": "audio",
                "description": "Listen carefully to watch ticking pattern"
            },
            {
                "interaction_id": "poem_reading",
                "type": "visual",
                "description": "Read and analyze the poem text"
            },
            {
                "interaction_id": "grid_manipulation",
                "type": "spatial",
                "description": "Manipulate letter grid to find words"
            }
        ]',
        '[
            {
                "qr_id": "morse_guide",
                "location": "reading_table",
                "content": "Morse code reference chart"
            }
        ]',
        '[
            {
                "asset_id": "watch_ar",
                "type": "3d_model",
                "description": "3D pocket watch with visible ticking pattern"
            },
            {
                "asset_id": "poem_glow",
                "type": "overlay",
                "description": "Glowing poem text with highlighted verses"
            }
        ]',
        '[
            {
                "tech_id": "morse_decoder",
                "type": "voice_recognition",
                "description": "Audio analysis of watch ticking"
            }
        ]',
        25,
        '[
            {
                "level": 1,
                "hint": "Listen carefully to the watch - the ticking pattern forms Morse code",
                "cost": 0
            },
            {
                "level": 2,
                "hint": "The Morse code translates to numbers: 5 8 3 4",
                "cost": 0
            },
            {
                "level": 3,
                "hint": "Use those numbers to find specific verses in the poem",
                "cost": 0
            }
        ]',
        '{
            "help_available": true,
            "morse_tutorial": true,
            "poem_analysis_guide": true
        }',
        100,
        '["map_fragment"]',
        '[
            "Introduction to time-based clues",
            "Revelation about the secret compartment",
            "Discovery of map fragment and key"
        ]',
        3
    ) RETURNING id INTO scene_uuid;
    
    -- Create detailed puzzles for Scene 3
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
        'morse_poem_combination',
        'Morse Code and Poem Analysis',
        'Decode Morse code from the pocket watch, analyze the poem verses, and solve the letter grid to find the secret word.',
        'temporal',
        'intermediate',
        'cryptography',
        '{
            "morse_code": "· – · · ·   – – – –   · – – ·   · · · –",
            "morse_translation": "5 8 3 4",
            "poem": [
                "Siete versos son mis pistas, cada línea un guardián",
                "Presta atención a mis rimas y el tiempo te guiará",
                "A las tres se abren portales, a las ocho miran atrás",
                "Las campanas de las doce resuenan y vuelven al compás",
                "Cinco dedos señalan letras, diez números callarán",
                "Oye el tictac en tu pecho, pues el ritmo te dirá",
                "Suma números y letras, y la clave hallarás"
            ],
            "letter_grid": [
                ["L", "I", "B", "R"],
                ["A", "N", "O", "C"],
                ["T", "E", "S", "A"],
                ["C", "O", "D", "I"]
            ],
            "instructions": "Use the Morse code numbers (5,8,3,4) to find specific verses, then use those clues to extract letters from the grid."
        }',
        '{
            "morse_numbers": [5, 8, 3, 4],
            "verse_clues": {
                "verse_5": "Cinco dedos señalan letras - take five letters",
                "verse_3": "A las tres se abren portales - column 3",
                "verse_4": "Las campanas de las doce - row 12 (1+2=3)"
            },
            "grid_extraction": {
                "column_3": ["B", "O", "S", "D"],
                "row_3": ["T", "E", "S", "A"],
                "hidden_words": ["LIBRO", "SETA"],
                "final_word": "CÓDICE"
            },
            "watch_compartment": "Opens when word CÓDICE is spoken aloud",
            "compartment_contents": "Key and ancient map fragment"
        }',
        '[
            {
                "alternative": "Direct grid analysis without Morse code",
                "solution": "Still requires verse analysis for correct extraction"
            }
        ]',
        ARRAY['voice_input', 'manual_input', 'grid_interaction'],
        '{
            "validation_type": "exact_match",
            "required_fields": ["morse_decoded", "poem_analyzed", "grid_solved", "word_found"],
            "tolerance": 0,
            "case_sensitive": false
        }',
        '{
            "immediate_feedback": true,
            "progressive_hints": true,
            "success_message": "Brilliant! You found the word CÓDICE. The watch compartment opens, revealing a key and map fragment.",
            "failure_message": "Try combining the Morse code with the poem verses to find the right letters from the grid."
        }',
        ARRAY['voice_recognition', 'ar_overlay'],
        '[
            {
                "component": "morse_visualizer",
                "interaction": "audio_visualization"
            },
            {
                "component": "poem_highlighter",
                "interaction": "verse_selection"
            },
            {
                "component": "grid_3d",
                "interaction": "letter_extraction"
            }
        ]',
        '{
            "qr_scan_validation": true,
            "qr_content_reveal": "morse_reference"
        }',
        '[
            {
                "level": 1,
                "hint": "The watch ticking is Morse code: · – · · ·   – – – –   · – – ·   · · · –",
                "unlock_time": 300
            },
            {
                "level": 2,
                "hint": "Morse code translates to: 5 8 3 4 (these are verse numbers)",
                "unlock_time": 600
            },
            {
                "level": 3,
                "hint": "Verse 5: ''Cinco dedos señalan letras'' - take 5 letters. Verse 3: ''A las tres se abren portales'' - column 3",
                "unlock_time": 900
            }
        ]',
        '[
            {
                "resource": "morse_code_chart",
                "type": "reference",
                "content": "Complete Morse code alphabet and numbers"
            },
            {
                "resource": "poem_analysis_guide",
                "type": "tutorial",
                "content": "How to analyze poetry for hidden clues"
            }
        ]',
        true,
        1500,
        3,
        false,
        100,
        '["map_fragment_unlock"]',
        '{
            "consequence": "time_penalty",
            "penalty_points": 20,
            "retry_allowed": true
        }',
        1
    );
    
    -- Create QR codes for Scene 3
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
        'morse_guide_qr',
        'WHISPERS_MORSE_GUIDE_003',
        'Morse Code Reference',
        'On the reading table',
        'reference',
        '{
            "morse_chart": {
                "numbers": {
                    "1": "· – – – –",
                    "2": "· · – – –",
                    "3": "· · · – –",
                    "4": "· · · · –",
                    "5": "· · · · ·",
                    "8": "– – – · ·"
                },
                "letters": {
                    "A": "· –",
                    "B": "– · · ·",
                    "C": "– · – ·",
                    "D": "– · ·",
                    "E": "·",
                    "I": "· ·",
                    "O": "– – –",
                    "R": "· – ·",
                    "S": "· · ·",
                    "T": "–"
                }
            },
            "instructions": "Listen to the watch ticking and match the pattern to Morse code symbols"
        }',
        'scan',
        '{
            "overlay_type": "morse_chart",
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
        'watch_success_qr',
        'WHISPERS_WATCH_SUCCESS_003',
        'Watch Compartment Opened',
        'Inside the opened watch compartment',
        'reward',
        '{
            "compartment_opened": true,
            "contents": [
                "Ancient key with ornate design",
                "Map fragment showing library layout",
                "Note: ''The past and present intertwine in the shelves. Words deceive, but columns reveal.''"
            ],
            "message": "Excellent! You found the secret word CÓDICE. The watch compartment reveals a key and map fragment for the next puzzle.",
            "unlocks": ["map_fragment_scene"],
            "letter_collected": "P"
        }',
        'scan',
        '{
            "overlay_type": "success_animation",
            "animation": "watch_glow"
        }',
        false,
        false,
        1000,
        '{}',
        '{}',
        true
    );
    
END $$;
