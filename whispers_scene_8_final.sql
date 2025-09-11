-- Scene 8: Final Confrontation and Letter Combination
-- Final puzzle combining all collected letters

DO $$
DECLARE
    adventure_uuid UUID;
    scene_uuid UUID;
BEGIN
    -- Get the adventure ID
    SELECT id INTO adventure_uuid 
    FROM public.cluequest_enhanced_adventures 
    WHERE story_id = 'whispers_in_the_library';
    
    -- Create Scene 8: Final Confrontation
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
        8,
        'final_confrontation',
        'The Final Revelation',
        'A secret archive beneath the library with a trapdoor requiring an eight-letter code. Players must combine all collected letters to form the correct word and confront the killer.',
        3,
        'With all the letters collected (M, A, P, L, I, B, R, O), you arrive at a trapdoor with eight slots. You must insert the letters in the correct order to form the word that opens the door. Remember Mr. Sloane''s words: ''Every book has its place and every place holds a secret.'' The final confrontation with Henry, the custodian and true killer, awaits below.',
        '[
            "Review all collected letters from previous scenes",
            "Determine the correct order to form a meaningful word",
            "Insert the letters into the trapdoor slots",
            "Confront Henry and complete the investigation"
        ]',
        '{
            "required_actions": [
                "review_letters",
                "determine_word",
                "insert_letters",
                "open_trapdoor",
                "confront_killer"
            ],
            "success_condition": "trapdoor_opened",
            "validation_method": "physical_trapdoor_opening"
        }',
        '[
            {
                "puzzle_id": "letter_review",
                "type": "logical",
                "description": "Review and organize all collected letters",
                "difficulty": "intermediate"
            },
            {
                "puzzle_id": "word_formation",
                "type": "linguistic",
                "description": "Form the correct word from collected letters",
                "difficulty": "advanced"
            },
            {
                "puzzle_id": "final_confrontation",
                "type": "narrative",
                "description": "Confront the killer and complete the story",
                "difficulty": "expert"
            }
        ]',
        '[
            {
                "challenge_id": "final_synthesis",
                "description": "Must combine knowledge from all previous scenes",
                "optional": false
            }
        ]',
        '[
            {
                "interaction_id": "letter_organization",
                "type": "cognitive",
                "description": "Organize and review all collected letters"
            },
            {
                "interaction_id": "trapdoor_manipulation",
                "type": "physical",
                "description": "Insert letters into trapdoor slots"
            },
            {
                "interaction_id": "final_dialogue",
                "type": "narrative",
                "description": "Engage in final confrontation dialogue"
            }
        ]',
        '[
            {
                "qr_id": "letter_review",
                "location": "trapdoor_area",
                "content": "Review of all collected letters"
            }
        ]',
        '[
            {
                "asset_id": "trapdoor_3d",
                "type": "3d_model",
                "description": "3D trapdoor with letter slots"
            },
            {
                "asset_id": "letter_collection",
                "type": "overlay",
                "description": "Visual display of all collected letters"
            }
        ]',
        '[
            {
                "tech_id": "word_solver",
                "type": "ar_overlay",
                "description": "AR tool to help form words from letters"
            }
        ]',
        15,
        '[
            {
                "level": 1,
                "hint": "You have collected 8 letters: M, A, P, L, I, B, R, O",
                "cost": 0
            },
            {
                "level": 2,
                "hint": "Think of library-related words. What word relates to books and knowledge?",
                "cost": 0
            },
            {
                "level": 3,
                "hint": "The word is BIBLIOMA - rearrange the letters to form this word",
                "cost": 0
            }
        ]',
        '{
            "help_available": true,
            "letter_review": true,
            "word_formation_guide": true
        }',
        150,
        '[]',
        '[
            "Complete mystery solved",
            "Henry revealed as the killer",
            "Justice served and library saved"
        ]',
        8
    ) RETURNING id INTO scene_uuid;
    
    -- Create detailed puzzles for Scene 8
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
        'final_letter_combination',
        'Final Letter Combination and Confrontation',
        'Combine all collected letters to form the correct word that opens the trapdoor and leads to the final confrontation with the killer.',
        'linguistic',
        'expert',
        'synthesis',
        '{
            "collected_letters": [
                {"letter": "M", "source": "Scene 1 - Manuscript clue"},
                {"letter": "A", "source": "Scene 2 - ALA combination"},
                {"letter": "P", "source": "Scene 3 - Pocket watch compartment"},
                {"letter": "L", "source": "Scene 4 - Map fragment"},
                {"letter": "I", "source": "Scene 5 - UV anagram"},
                {"letter": "B", "source": "Scene 6 - Logic puzzle"},
                {"letter": "R", "source": "Scene 7 - Alias decoding"},
                {"letter": "O", "source": "Scene 7 - Final revelation"}
            ],
            "trapdoor_slots": 8,
            "clue": "Every book has its place and every place holds a secret",
            "instructions": "Arrange the 8 letters to form a meaningful word related to libraries and books. Insert them in the correct order to open the trapdoor."
        }',
        '{
            "correct_word": "BIBLIOMA",
            "letter_order": ["B", "I", "B", "L", "I", "O", "M", "A"],
            "word_meaning": "A collection of books, a library",
            "trapdoor_opened": true,
            "final_revelation": "Henry, the custodian, confesses to the murder because the researcher discovered his illegal book smuggling operation",
            "ending": "Henry is arrested, the library is saved, and the players are commended for solving the mystery"
        }',
        '[
            {
                "alternative": "Alternative word formations",
                "solution": "Other possible arrangements, but BIBLIOMA is the correct library-related word"
            }
        ]',
        ARRAY['manual_input', 'letter_arrangement', 'trapdoor_manipulation'],
        '{
            "validation_type": "exact_match",
            "required_fields": ["word_formed", "letters_inserted"],
            "tolerance": 0,
            "case_sensitive": false
        }',
        '{
            "immediate_feedback": true,
            "progressive_hints": true,
            "success_message": "Perfect! The trapdoor opens, revealing Henry, the custodian, who confesses to the murder. The mystery is solved!",
            "failure_message": "Think about library-related words. What word means a collection of books?"
        }',
        ARRAY['ar_overlay'],
        '[
            {
                "component": "letter_arranger",
                "interaction": "drag_and_drop"
            },
            {
                "component": "trapdoor_3d",
                "interaction": "letter_insertion"
            }
        ]',
        '{
            "qr_scan_validation": true,
            "qr_content_reveal": "letter_review"
        }',
        '[
            {
                "level": 1,
                "hint": "You have 8 letters: M, A, P, L, I, B, R, O. Think of library-related words.",
                "unlock_time": 300
            },
            {
                "level": 2,
                "hint": "What word means a collection of books? It starts with B and has 8 letters.",
                "unlock_time": 600
            },
            {
                "level": 3,
                "hint": "The word is BIBLIOMA - arrange the letters: B, I, B, L, I, O, M, A",
                "unlock_time": 900
            }
        ]',
        '[
            {
                "resource": "letter_review_tool",
                "type": "tool",
                "content": "Review all collected letters and their sources"
            },
            {
                "resource": "word_formation_guide",
                "type": "tutorial",
                "content": "How to form words from given letters"
            }
        ]',
        true,
        900,
        3,
        false,
        150,
        '["adventure_complete"]',
        '{
            "consequence": "alternative_ending",
            "penalty_points": 0,
            "retry_allowed": true,
            "alternative_ending": "If time runs out, Henry escapes and burns rare books, creating a tragic ending"
        }',
        1
    );
    
    -- Create QR codes for Scene 8
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
        'letter_review_qr',
        'WHISPERS_LETTER_REVIEW_008',
        'Letter Collection Review',
        'Near the trapdoor',
        'reference',
        '{
            "letter_collection": [
                {"letter": "M", "scene": "Card Catalog", "source": "Manuscript clue"},
                {"letter": "A", "scene": "Manuscript Cipher", "source": "ALA combination"},
                {"letter": "P", "scene": "Poem and Clock", "source": "Pocket watch compartment"},
                {"letter": "L", "scene": "Map Fragment", "source": "Map fragment"},
                {"letter": "I", "scene": "UV Anagram", "source": "UV anagram"},
                {"letter": "B", "scene": "Logic Puzzle", "source": "Logic puzzle"},
                {"letter": "R", "scene": "Microfilm", "source": "Alias decoding"},
                {"letter": "O", "scene": "Microfilm", "source": "Final revelation"}
            ],
            "hint": "Think of a word that means a collection of books, related to libraries"
        }',
        'scan',
        '{
            "overlay_type": "letter_display",
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
        'adventure_complete_qr',
        'WHISPERS_ADVENTURE_COMPLETE_008',
        'Adventure Completed Successfully',
        'After opening the trapdoor and confronting Henry',
        'reward',
        '{
            "adventure_completed": true,
            "mystery_solved": true,
            "killer_revealed": "Henry, the custodian",
            "motive": "Illegal book smuggling operation discovered by the researcher",
            "resolution": "Henry is arrested, the library is saved, and the players are commended",
            "message": "Congratulations! You have successfully solved the mystery of Whispers in the Library. Your detective skills and teamwork have brought justice to the Monteverde Library.",
            "achievements": [
                "Master Detective",
                "Cryptography Expert",
                "Logic Puzzle Solver",
                "Team Player",
                "Library Guardian"
            ],
            "final_score": "Based on completion time and puzzle accuracy"
        }',
        'scan',
        '{
            "overlay_type": "completion_celebration",
            "animation": "confetti"
        }',
        false,
        false,
        1000,
        '{}',
        '{}',
        true
    );
    
END $$;
