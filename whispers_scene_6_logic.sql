-- Scene 6: Logic Puzzle with Suspects Timeline
-- Complex logical deduction puzzle

DO $$
DECLARE
    adventure_uuid UUID;
    scene_uuid UUID;
BEGIN
    -- Get the adventure ID
    SELECT id INTO adventure_uuid 
    FROM public.cluequest_enhanced_adventures 
    WHERE story_id = 'whispers_in_the_library';
    
    -- Create Scene 6: Logic Puzzle
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
        6,
        'logic_puzzle',
        'The Tree of Knowledge',
        'The central library hall with a tree sculpture representing knowledge. Players must solve a complex logic puzzle about suspect locations and activities to reveal the next clue.',
        3,
        'In the central hall of the library, you find a magnificent tree sculpture with roots and branches representing knowledge. On the trunk are five wooden tablets, each with statements about where the suspects (Sloane, Reyes, Black, Clara, and Henry) were at the time of the crime. There is also a logic board with columns for Person, Time, Library Section, and Activity.',
        '[
            "Read and analyze all five wooden tablets with suspect statements",
            "Use logical deduction to determine each person''s location, time, and activity",
            "Fill in the logic board with the correct information",
            "Use the section initials to form a code for the tree panel"
        ]',
        '{
            "required_actions": [
                "read_tablets",
                "analyze_statements",
                "deduce_timeline",
                "fill_logic_board",
                "extract_code",
                "activate_panel"
            ],
            "success_condition": "tree_panel_activated",
            "validation_method": "physical_panel_activation"
        }',
        '[
            {
                "puzzle_id": "statement_analysis",
                "type": "logical",
                "description": "Analyze the five wooden tablets with suspect statements",
                "difficulty": "advanced"
            },
            {
                "puzzle_id": "logical_deduction",
                "type": "logical",
                "description": "Use logical reasoning to determine the complete timeline",
                "difficulty": "advanced"
            },
            {
                "puzzle_id": "code_extraction",
                "type": "mathematical",
                "description": "Extract code from section initials using Pigpen cipher",
                "difficulty": "intermediate"
            }
        ]',
        '[
            {
                "challenge_id": "complex_reasoning",
                "description": "Requires systematic logical deduction",
                "optional": false
            }
        ]',
        '[
            {
                "interaction_id": "tablet_reading",
                "type": "visual",
                "description": "Read and analyze the wooden tablets"
            },
            {
                "interaction_id": "logic_board",
                "type": "physical",
                "description": "Fill in the logic board with deduced information"
            },
            {
                "interaction_id": "panel_activation",
                "type": "physical",
                "description": "Enter the code to activate the tree panel"
            }
        ]',
        '[
            {
                "qr_id": "logic_guide",
                "location": "tree_sculpture",
                "content": "Logic puzzle solving guide"
            }
        ]',
        '[
            {
                "asset_id": "tree_3d",
                "type": "3d_model",
                "description": "3D tree sculpture with interactive tablets"
            },
            {
                "asset_id": "logic_board_ar",
                "type": "overlay",
                "description": "AR logic board for solving the puzzle"
            }
        ]',
        '[
            {
                "tech_id": "logic_solver",
                "type": "ar_overlay",
                "description": "AR tool to help with logical deduction"
            }
        ]',
        30,
        '[
            {
                "level": 1,
                "hint": "Start by identifying what you know for certain from each statement",
                "cost": 0
            },
            {
                "level": 2,
                "hint": "Use process of elimination - if someone was in one place, they couldn''t be in another",
                "cost": 0
            },
            {
                "level": 3,
                "hint": "The final timeline: Reyes 4pm Microfilms, Sloane 5pm General, Black 6pm Maps, Clara 5pm Manuscripts, Henry 4pm Periodicals",
                "cost": 0
            }
        ]',
        '{
            "help_available": true,
            "logic_tutorial": true,
            "step_by_step_solver": true
        }',
        125,
        '["microfilm_acrostic"]',
        '[
            "Complete suspect timeline established",
            "Introduction to Pigpen cipher",
            "Discovery of metal pen and letter B"
        ]',
        6
    ) RETURNING id INTO scene_uuid;
    
    -- Create detailed puzzles for Scene 6
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
        'suspect_timeline_logic',
        'Suspect Timeline Logic Puzzle',
        'Solve a complex logic puzzle to determine where each suspect was at the time of the crime, then use the information to extract a code.',
        'logical',
        'advanced',
        'deduction',
        '{
            "statements": [
                "Sloane was in the general collection at 5 p.m. or in the newspaper depository.",
                "Whoever was in the maps section studied a parchment and was seen one hour before whoever read the secret diary.",
                "Reyes consulted microfilms at 4 p.m. or at 5 p.m.",
                "The parchment was studied by Black or by the person who was at 4 p.m.",
                "The person in the manuscripts section was at the same time as whoever was in the general collection.",
                "Clara was at 4 p.m. or at 6 p.m.",
                "Henry was not in the general collection nor in the maps section.",
                "Sloane was one hour after Reyes.",
                "The parchment was not read at 6 p.m."
            ],
            "suspects": ["Sloane", "Reyes", "Black", "Clara", "Henry"],
            "times": ["4 p.m.", "5 p.m.", "6 p.m."],
            "sections": ["General Collection", "Microfilms", "Maps Section", "Manuscripts Section", "Newspaper Depository"],
            "activities": ["Studied Parchment", "Read Secret Diary", "Consulted Microfilms", "Read Hidden Manuscript", "Found Rare Book"],
            "instructions": "Use logical deduction to determine each person''s location, time, and activity. Then use the section initials to form a code."
        }',
        '{
            "solution_timeline": [
                {
                    "person": "Reyes",
                    "time": "4 p.m.",
                    "section": "Microfilms",
                    "activity": "Studied Parchment"
                },
                {
                    "person": "Sloane",
                    "time": "5 p.m.",
                    "section": "General Collection",
                    "activity": "Read Secret Diary"
                },
                {
                    "person": "Black",
                    "time": "6 p.m.",
                    "section": "Maps Section",
                    "activity": "Studied Parchment"
                },
                {
                    "person": "Clara",
                    "time": "5 p.m.",
                    "section": "Manuscripts Section",
                    "activity": "Read Hidden Manuscript"
                },
                {
                    "person": "Henry",
                    "time": "4 p.m.",
                    "section": "Newspaper Depository",
                    "activity": "Found Rare Book"
                }
            ],
            "section_initials": ["M", "C", "S", "S", "D"],
            "pigpen_code": "MCSSD",
            "tree_panel_code": "MCSSD",
            "panel_contents": "Metal pen and wooden letter B"
        }',
        '[
            {
                "alternative": "Direct code entry without full timeline",
                "solution": "Still requires understanding the logic to get correct initials"
            }
        ]',
        ARRAY['manual_input', 'logic_board', 'code_entry'],
        '{
            "validation_type": "exact_match",
            "required_fields": ["timeline_complete", "code_entered"],
            "tolerance": 0,
            "case_sensitive": false
        }',
        '{
            "immediate_feedback": true,
            "progressive_hints": true,
            "success_message": "Excellent logical reasoning! The tree panel opens, revealing a metal pen and the letter B.",
            "failure_message": "Check your logical deductions. Make sure each person can only be in one place at one time."
        }',
        ARRAY['ar_overlay'],
        '[
            {
                "component": "logic_board_3d",
                "interaction": "fill_timeline"
            },
            {
                "component": "statement_highlighter",
                "interaction": "clue_analysis"
            }
        ]',
        '{
            "qr_scan_validation": true,
            "qr_content_reveal": "logic_guide"
        }',
        '[
            {
                "level": 1,
                "hint": "Start with the statements that give you definite information, like ''Sloane was one hour after Reyes''",
                "unlock_time": 300
            },
            {
                "level": 2,
                "hint": "If Reyes was at 4pm or 5pm, and Sloane was one hour after, then Reyes must be at 4pm and Sloane at 5pm",
                "unlock_time": 600
            },
            {
                "level": 3,
                "hint": "Final answer: Reyes 4pm Microfilms, Sloane 5pm General, Black 6pm Maps, Clara 5pm Manuscripts, Henry 4pm Periodicals",
                "unlock_time": 900
            }
        ]',
        '[
            {
                "resource": "logic_puzzle_guide",
                "type": "tutorial",
                "content": "How to solve complex logic puzzles systematically"
            },
            {
                "resource": "pigpen_cipher_guide",
                "type": "reference",
                "content": "Pigpen cipher reference chart"
            }
        ]',
        true,
        1800,
        2,
        false,
        125,
        '["microfilm_acrostic_unlock"]',
        '{
            "consequence": "time_penalty",
            "penalty_points": 25,
            "retry_allowed": true
        }',
        1
    );
    
    -- Create QR codes for Scene 6
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
        'logic_guide_qr',
        'WHISPERS_LOGIC_GUIDE_006',
        'Logic Puzzle Guide',
        'On the tree sculpture base',
        'reference',
        '{
            "logic_guide": "1. Read all statements carefully. 2. Identify definite facts first. 3. Use process of elimination. 4. Create a grid to track possibilities. 5. Look for contradictions to eliminate options.",
            "pigpen_note": "Once you have the section initials, use the Pigpen cipher to convert them to symbols for the tree panel."
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
        'tree_panel_success_qr',
        'WHISPERS_TREE_SUCCESS_006',
        'Tree Panel Activated',
        'Inside the opened tree panel',
        'reward',
        '{
            "panel_opened": true,
            "contents": [
                "Metal pen with ornate design",
                "Wooden letter B",
                "Note: ''The past and present intertwine in the shelves. Words deceive, but columns reveal.''"
            ],
            "message": "Brilliant deduction! You solved the complex logic puzzle and found the metal pen. This will be crucial for the next challenge.",
            "unlocks": ["microfilm_acrostic_scene"],
            "letter_collected": "B"
        }',
        'scan',
        '{
            "overlay_type": "success_animation",
            "animation": "tree_glow"
        }',
        false,
        false,
        1000,
        '{}',
        '{}',
        true
    );
    
END $$;
