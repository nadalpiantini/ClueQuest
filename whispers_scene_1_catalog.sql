-- Scene 1: Card Catalog Puzzle
-- Players must organize catalog cards and decipher hidden message using Dewey decimal codes

DO $$
DECLARE
    adventure_uuid UUID;
    scene_uuid UUID;
BEGIN
    -- Get the adventure ID
    SELECT id INTO adventure_uuid 
    FROM public.cluequest_enhanced_adventures 
    WHERE story_id = 'whispers_in_the_library';
    
    -- Create Scene 1: Card Catalog Puzzle
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
        1,
        'card_catalog',
        'The Card Catalog Mystery',
        'The library entrance and card catalog system. Players must organize catalog cards and decipher a hidden message using Dewey decimal codes.',
        1,
        'As you enter the Monteverde Library, you find the card catalog in disarray. A note from librarian Sloane reads: "Every book has its place and every place holds a secret. Start by ordering minds and you will find the truth." The catalog cards are scattered, but each one contains a piece of the puzzle.',
        '[
            "Organize the 8 catalog cards alphabetically by author surname",
            "Extract the second digit from each Dewey decimal code",
            "Convert the number sequence to letters using telephone keypad mapping",
            "Find the book containing the hidden message"
        ]',
        '{
            "required_actions": [
                "sort_cards_alphabetically",
                "extract_dewey_digits",
                "convert_to_letters",
                "locate_target_book"
            ],
            "success_condition": "correct_book_found",
            "validation_method": "qr_scan_or_keyword"
        }',
        '[
            {
                "puzzle_id": "catalog_organization",
                "type": "logical",
                "description": "Sort 8 catalog cards by author surname to reveal hidden pattern",
                "difficulty": "beginner"
            },
            {
                "puzzle_id": "dewey_extraction",
                "type": "mathematical",
                "description": "Extract second digits from Dewey decimal codes",
                "difficulty": "beginner"
            },
            {
                "puzzle_id": "telephone_cipher",
                "type": "cryptographic",
                "description": "Convert number sequence to letters using phone keypad",
                "difficulty": "beginner"
            }
        ]',
        '[
            {
                "challenge_id": "time_pressure",
                "description": "Complete within 15 minutes",
                "optional": true
            }
        ]',
        '[
            {
                "interaction_id": "card_manipulation",
                "type": "physical",
                "description": "Physically sort and arrange catalog cards"
            },
            {
                "interaction_id": "book_search",
                "type": "exploration",
                "description": "Search library shelves for target book"
            }
        ]',
        '[
            {
                "qr_id": "catalog_hint",
                "location": "card_catalog_drawer",
                "content": "Hint about alphabetical ordering"
            },
            {
                "qr_id": "dewey_guide",
                "location": "reference_section",
                "content": "Dewey decimal system explanation"
            }
        ]',
        '[
            {
                "asset_id": "catalog_overlay",
                "type": "3d_model",
                "description": "3D card catalog with interactive cards"
            }
        ]',
        '[
            {
                "tech_id": "card_scanner",
                "type": "qr_code",
                "description": "Scan cards to reveal hidden information"
            }
        ]',
        15,
        '[
            {
                "level": 1,
                "hint": "Remember: authors are listed by surname, not first name",
                "cost": 0
            },
            {
                "level": 2,
                "hint": "Look at the second digit of each Dewey decimal number",
                "cost": 0
            },
            {
                "level": 3,
                "hint": "Use a telephone keypad: 2=ABC, 3=DEF, 4=GHI, 5=JKL, 6=MNO, 7=PQRS, 8=TUV, 9=WXYZ",
                "cost": 0
            }
        ]',
        '{
            "help_available": true,
            "tutorial_mode": false,
            "progressive_help": true
        }',
        50,
        '["manuscript_cipher"]',
        '[
            "Introduction to library organization",
            "First clue about the investigation",
            "Introduction to Mr. Sloane character"
        ]',
        1
    ) RETURNING id INTO scene_uuid;
    
    -- Create detailed puzzles for Scene 1
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
        'catalog_cards_sorting',
        'Catalog Card Organization',
        'Sort the 8 catalog cards alphabetically by author surname to reveal the hidden pattern in Dewey decimal codes.',
        'logical',
        'beginner',
        'organization',
        '{
            "cards": [
                {
                    "letter": "A",
                    "author": "Borges, J. L.",
                    "title": "El Aleph",
                    "call_number": "863 B714e",
                    "note": "Los segundos dígitos de cada número forman una palabra."
                },
                {
                    "letter": "B",
                    "author": "Christie, Agatha",
                    "title": "Diez Negritos",
                    "call_number": "823 C558d"
                },
                {
                    "letter": "C",
                    "author": "Conan Doyle, A.",
                    "title": "El sabueso",
                    "call_number": "823 D754s"
                },
                {
                    "letter": "D",
                    "author": "Eco, Umberto",
                    "title": "El nombre de la rosa",
                    "call_number": "853 E19n"
                },
                {
                    "letter": "E",
                    "author": "Grimaldi, F.",
                    "title": "Códigos y enigmas",
                    "call_number": "003 G867c"
                },
                {
                    "letter": "F",
                    "author": "Poe, Edgar Allan",
                    "title": "Cuentos",
                    "call_number": "813 P744c"
                },
                {
                    "letter": "G",
                    "author": "Rowling, J. K.",
                    "title": "La cámara secreta",
                    "call_number": "823 R795c"
                },
                {
                    "letter": "H",
                    "author": "Zafón, Carlos Ruiz",
                    "title": "La sombra del viento",
                    "call_number": "863 Z193s"
                }
            ],
            "instructions": "Organize the cards alphabetically by author surname (A→H), then extract the second digit from each call number."
        }',
        '{
            "correct_order": ["A", "B", "C", "D", "E", "F", "G", "H"],
            "second_digits": [6, 2, 2, 5, 0, 1, 2, 6],
            "phone_number": "62250126",
            "decoded_word": "MANUSCR",
            "target_book": "Grimaldi - Códigos y enigmas"
        }',
        '[
            {
                "alternative": "Direct digit extraction without sorting",
                "solution": "Still requires correct digit sequence"
            }
        ]',
        ARRAY['drag_drop', 'manual_input', 'qr_scan'],
        '{
            "validation_type": "exact_match",
            "required_fields": ["correct_order", "second_digits", "decoded_word"],
            "tolerance": 0
        }',
        '{
            "immediate_feedback": true,
            "progressive_hints": true,
            "success_message": "Excellent! You found the hidden message: MANUSCR. Now search for the book by Grimaldi.",
            "failure_message": "Not quite right. Remember to sort by surname and extract the second digit from each call number."
        }',
        ARRAY['qr_code'],
        '[
            {
                "component": "card_3d_models",
                "interaction": "drag_and_drop"
            }
        ]',
        '{
            "qr_scan_validation": true,
            "qr_content_reveal": "hidden_message"
        }',
        '[
            {
                "level": 1,
                "hint": "Authors are listed by their last name (surname), not first name",
                "unlock_time": 300
            },
            {
                "level": 2,
                "hint": "Look at the second digit of each Dewey decimal number (the number after the first digit)",
                "unlock_time": 600
            },
            {
                "level": 3,
                "hint": "The sequence 62250126 translates to MANUSCR using a telephone keypad",
                "unlock_time": 900
            }
        ]',
        '[
            {
                "resource": "dewey_decimal_guide",
                "type": "reference",
                "content": "Explanation of Dewey decimal classification system"
            },
            {
                "resource": "telephone_keypad",
                "type": "tool",
                "content": "Visual telephone keypad for number-to-letter conversion"
            }
        ]',
        false,
        900,
        5,
        false,
        50,
        '["manuscript_cipher_unlock"]',
        '{
            "consequence": "time_penalty",
            "penalty_points": 10,
            "retry_allowed": true
        }',
        1
    );
    
    -- Create QR codes for Scene 1
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
        'catalog_hint_qr',
        'WHISPERS_CATALOG_HINT_001',
        'Catalog Organization Hint',
        'Inside the card catalog drawer',
        'clue',
        '{
            "hint_type": "organization",
            "content": "Remember: Library catalogs are organized by author surname (last name), not first name. Look for the pattern in the numbers once you have them in order.",
            "reveals": "sorting_principle"
        }',
        'scan',
        '{
            "overlay_type": "text_hint",
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
        'dewey_guide_qr',
        'WHISPERS_DEWEY_GUIDE_001',
        'Dewey Decimal Guide',
        'Reference section of the library',
        'reference',
        '{
            "guide_type": "dewey_decimal",
            "content": "Dewey Decimal Classification: 000-099 General works, 100-199 Philosophy, 200-299 Religion, 300-399 Social sciences, 400-499 Language, 500-599 Natural sciences, 600-699 Technology, 700-799 Arts, 800-899 Literature, 900-999 History and geography.",
            "examples": "863 = Spanish literature, 823 = English literature, 003 = General works on systems"
        }',
        'scan',
        '{
            "overlay_type": "reference_guide",
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
        'target_book_qr',
        'WHISPERS_TARGET_BOOK_001',
        'Target Book Location',
        'On the spine of Grimaldi''s "Códigos y enigmas" book',
        'reward',
        '{
            "book_found": true,
            "message": "Excellent work! You found the hidden message. Inside this book, you will find a folder with a note: ''Good start. The manuscripts hide more answers.'' Also inside: a cipher key and a Caesar wheel tape.",
            "unlocks": ["manuscript_cipher_scene"],
            "letter_collected": "M"
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
