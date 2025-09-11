-- Scene 2: Manuscript Cipher Puzzle
-- Caesar/Vigenère cipher with manuscript chest

DO $$
DECLARE
    adventure_uuid UUID;
    scene_uuid UUID;
BEGIN
    -- Get the adventure ID
    SELECT id INTO adventure_uuid 
    FROM public.cluequest_enhanced_adventures 
    WHERE story_id = 'whispers_in_the_library';
    
    -- Create Scene 2: Manuscript Cipher
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
        2,
        'manuscript_cipher',
        'The Ciphered Manuscript',
        'A rare manuscripts room with a locked chest containing a ciphered message. Players must use a Caesar/Vigenère cipher wheel to decode the message.',
        1,
        'You arrive at a table in the rare manuscripts room where an ancient manuscript is kept in a combination chest. A note from Dr. Black says: "The voices of the past are heard when we order them. Use the wheel with caution." The chest is locked with a three-letter alphabetical combination.',
        '[
            "Find the cipher key hidden in the previous scene",
            "Set up the Caesar cipher wheel with the correct key",
            "Decode the ciphered message letter by letter",
            "Use the first three letters of the decoded message to open the chest"
        ]',
        '{
            "required_actions": [
                "locate_cipher_key",
                "setup_cipher_wheel",
                "decode_message",
                "extract_combination",
                "open_chest"
            ],
            "success_condition": "chest_opened",
            "validation_method": "physical_chest_opening"
        }',
        '[
            {
                "puzzle_id": "key_discovery",
                "type": "logical",
                "description": "Find the cipher key from previous scene",
                "difficulty": "beginner"
            },
            {
                "puzzle_id": "cipher_setup",
                "type": "cryptographic",
                "description": "Configure Caesar cipher wheel with correct key",
                "difficulty": "beginner"
            },
            {
                "puzzle_id": "message_decoding",
                "type": "cryptographic",
                "description": "Decode Vigenère cipher using key ROSAS",
                "difficulty": "intermediate"
            }
        ]',
        '[
            {
                "challenge_id": "precision_required",
                "description": "Each letter must be decoded accurately",
                "optional": false
            }
        ]',
        '[
            {
                "interaction_id": "cipher_wheel",
                "type": "physical",
                "description": "Manipulate physical cipher wheel"
            },
            {
                "interaction_id": "chest_opening",
                "type": "physical",
                "description": "Enter combination to open chest"
            }
        ]',
        '[
            {
                "qr_id": "cipher_guide",
                "location": "manuscript_table",
                "content": "Caesar cipher explanation and examples"
            }
        ]',
        '[
            {
                "asset_id": "cipher_wheel_ar",
                "type": "3d_model",
                "description": "Interactive 3D cipher wheel overlay"
            },
            {
                "asset_id": "manuscript_glow",
                "type": "overlay",
                "description": "Glowing manuscript with hidden text"
            }
        ]',
        '[
            {
                "tech_id": "cipher_simulator",
                "type": "ar_overlay",
                "description": "Digital cipher wheel for practice"
            }
        ]',
        20,
        '[
            {
                "level": 1,
                "hint": "The key was mentioned in the previous scene - look for a flower name",
                "cost": 0
            },
            {
                "level": 2,
                "hint": "ROSA is a type of flower. Add an S to make it plural",
                "cost": 0
            },
            {
                "level": 3,
                "hint": "Set the inner wheel so R aligns with A, then decode each letter",
                "cost": 0
            }
        ]',
        '{
            "help_available": true,
            "cipher_tutorial": true,
            "step_by_step_guide": true
        }',
        75,
        '["poem_clock"]',
        '[
            "Introduction to Dr. Black character",
            "Revelation about 5:00 meeting at reliquary",
            "Discovery of pocket watch and notebook"
        ]',
        2
    ) RETURNING id INTO scene_uuid;
    
    -- Create detailed puzzles for Scene 2
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
        'vigenere_cipher_decode',
        'Vigenère Cipher Decoding',
        'Decode the ciphered message using the Vigenère cipher with the key ROSAS.',
        'cryptographic',
        'intermediate',
        'cryptography',
        '{
            "cipher_type": "vigenere",
            "key": "ROSAS",
            "ciphertext": "R ACZ CKG EEHC LX STZK LMXRCK OCLK LXU IXKVC",
            "instructions": "Use the Caesar cipher wheel with key ROSAS. Align R with A, then decode each letter by shifting according to the key position.",
            "wheel_setup": "Inner wheel R aligned with outer wheel A"
        }',
        '{
            "plaintext": "A LAS CINCO EN PUNTO NOS VEMOS JUNTO AL RELICARIO",
            "translation": "At five o''clock we meet by the reliquary",
            "combination": "ALA",
            "chest_contents": "Pocket watch stopped at 5:00 with inscription ''Echo of whispers'', notebook with encrypted poem using key ALA"
        }',
        '[
            {
                "alternative": "Manual letter-by-letter decoding",
                "solution": "Same result but more time-consuming"
            }
        ]',
        ARRAY['manual_input', 'cipher_wheel', 'digital_input'],
        '{
            "validation_type": "exact_match",
            "required_fields": ["plaintext", "combination"],
            "tolerance": 0,
            "case_sensitive": false
        }',
        '{
            "immediate_feedback": true,
            "progressive_hints": true,
            "success_message": "Perfect! The message reads: ''At five o''clock we meet by the reliquary''. Use ALA to open the chest.",
            "failure_message": "Check your cipher wheel alignment and key usage. Remember: ROSAS is the key."
        }',
        ARRAY['ar_overlay'],
        '[
            {
                "component": "cipher_wheel_3d",
                "interaction": "rotate_and_align"
            },
            {
                "component": "manuscript_glow",
                "interaction": "reveal_text"
            }
        ]',
        '{
            "qr_scan_validation": true,
            "qr_content_reveal": "cipher_instructions"
        }',
        '[
            {
                "level": 1,
                "hint": "The key ROSAS comes from the previous scene - it''s a flower name",
                "unlock_time": 300
            },
            {
                "level": 2,
                "hint": "Align the inner wheel so R matches A on the outer wheel",
                "unlock_time": 600
            },
            {
                "level": 3,
                "hint": "Decode letter by letter: R→A, A→L, C→A, Z→S, etc.",
                "unlock_time": 900
            }
        ]',
        '[
            {
                "resource": "vigenere_tutorial",
                "type": "tutorial",
                "content": "Step-by-step Vigenère cipher tutorial"
            },
            {
                "resource": "cipher_wheel_guide",
                "type": "reference",
                "content": "How to use a Caesar cipher wheel"
            }
        ]',
        true,
        1200,
        3,
        false,
        75,
        '["poem_clock_unlock"]',
        '{
            "consequence": "time_penalty",
            "penalty_points": 15,
            "retry_allowed": true
        }',
        1
    );
    
    -- Create QR codes for Scene 2
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
        'cipher_guide_qr',
        'WHISPERS_CIPHER_GUIDE_002',
        'Cipher Instructions',
        'On the manuscript table',
        'reference',
        '{
            "cipher_type": "vigenere",
            "instructions": "1. Find the key from the previous scene (hint: it''s a flower name). 2. Align the cipher wheel with the key. 3. Decode each letter of the message. 4. Use the first three letters of the decoded message to open the chest.",
            "examples": "Key ROSAS: R→A, O→L, S→A, A→S, S→(repeat)"
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
        'chest_success_qr',
        'WHISPERS_CHEST_SUCCESS_002',
        'Chest Opened Successfully',
        'Inside the opened chest',
        'reward',
        '{
            "chest_opened": true,
            "contents": [
                "Pocket watch stopped at 5:00 with inscription ''Echo of whispers''",
                "Notebook with encrypted poem using key ALA",
                "Note from Dr. Black about the meeting"
            ],
            "message": "Excellent! You found the meeting location and time. The pocket watch and notebook will be crucial for the next puzzle.",
            "unlocks": ["poem_clock_scene"],
            "letter_collected": "A"
        }',
        'scan',
        '{
            "overlay_type": "success_animation",
            "animation": "chest_glow"
        }',
        false,
        false,
        1000,
        '{}',
        '{}',
        true
    );
    
END $$;
