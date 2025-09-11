-- Whispers in the Library - Main Adventure Record
-- Escape room narrative adventure with 8 interconnected scenes

INSERT INTO public.cluequest_enhanced_adventures (
    story_id,
    title,
    description,
    full_description,
    category,
    difficulty,
    estimated_duration,
    scene_count,
    progression_type,
    min_players,
    max_players,
    recommended_players,
    min_age,
    max_age,
    setup_time,
    location_type,
    space_requirements,
    required_materials,
    tech_requirements,
    optional_materials,
    learning_objectives,
    skills_developed,
    knowledge_areas,
    puzzle_types,
    tech_integrations,
    special_mechanics,
    narrative_hook,
    story_acts,
    character_roles,
    story_themes,
    difficulty_curve,
    hint_system,
    adaptive_difficulty,
    qr_codes_enabled,
    ar_features,
    ai_characters,
    voice_interactions,
    gesture_controls,
    accessibility_features,
    language_support,
    cultural_adaptations,
    theme_config,
    cover_image_url,
    background_music_url,
    sound_effects,
    visual_effects,
    status,
    is_template,
    is_public,
    version,
    tags
) VALUES (
    'whispers_in_the_library',
    'Whispers in the Library',
    'A murder mystery escape room adventure set in the Monteverde Library. Investigate the death of a researcher and uncover the truth through cryptanalysis, logic puzzles, and hidden clues.',
    'In the shadows of the Monteverde Library —a century-old institution with a collection of grimoires, incunabula, and forbidden texts— a crime has occurred. A researcher has been found dead among the shelves and a single witness has disappeared. The old books whisper secrets that only curious minds can decipher. The clock is ticking; the murderer could strike again if you don''t discover their identity.

This adventure is designed as a narrative escape room: each scene unfolds in a different area of the library and contains a puzzle integrated with the story. Following escape room design best practices, various types of challenges are used —numerical puzzles, pictographic codes, hidden pieces, anagrams, and ciphers— to ensure every player finds at least one challenge they can solve.',
    'mystery',
    'intermediate',
    90,
    8,
    'linear',
    2,
    6,
    4,
    14,
    99,
    20,
    'indoor',
    'large_room',
    '[
        "8 catalog cards (A-H)",
        "Caesar cipher wheel",
        "UV flashlight",
        "Pocket watch with Morse code",
        "Logic puzzle board",
        "Microfilm projector",
        "Wooden puzzle pieces",
        "Combination lock chest",
        "Pigpen cipher template",
        "Magnifying glass",
        "Notebook and pen",
        "Ancient manuscript replica"
    ]',
    '[
        "QR code scanner",
        "AR overlay capability",
        "Audio playback system",
        "UV light detection"
    ]',
    '[
        "Atmospheric lighting",
        "Background music system",
        "Sound effects",
        "Projection mapping"
    ]',
    '[
        "Cryptanalysis and code-breaking",
        "Logical deduction and reasoning",
        "Pattern recognition",
        "Collaborative problem-solving",
        "Historical research methods",
        "Library science basics"
    ]',
    '[
        "Critical thinking",
        "Team communication",
        "Attention to detail",
        "Pattern recognition",
        "Cryptographic analysis",
        "Logical reasoning",
        "Time management",
        "Collaborative leadership"
    ]',
    '[
        "Cryptography",
        "Library Science",
        "Logic and Reasoning",
        "History",
        "Literature",
        "Mathematics"
    ]',
    '[
        "cryptographic",
        "logical",
        "linguistic",
        "spatial",
        "temporal",
        "mathematical"
    ]',
    '[
        "qr_code",
        "ar_overlay",
        "voice_recognition",
        "ai_interaction"
    ]',
    '{
        "progressive_difficulty": true,
        "letter_collection": true,
        "narrative_integration": true,
        "multi_sensory": true,
        "time_pressure": false
    }',
    'In the shadows of the Monteverde Library, a researcher lies dead among ancient tomes. A single witness has vanished, and the old books whisper secrets that only the most curious minds can decipher. The clock is ticking—the murderer could strike again if you don''t discover their identity.',
    '[
        {
            "act": 1,
            "title": "Discovery and Initial Investigation",
            "scenes": ["card_catalog", "manuscript_cipher"],
            "objective": "Uncover the first clues and establish the investigation"
        },
        {
            "act": 2,
            "title": "Deepening Mystery",
            "scenes": ["poem_clock", "map_fragment", "uv_anagram"],
            "objective": "Gather evidence and narrow down suspects"
        },
        {
            "act": 3,
            "title": "Revelation and Confrontation",
            "scenes": ["logic_puzzle", "microfilm_acrostic", "final_confrontation"],
            "objective": "Solve the mystery and confront the killer"
        }
    ]',
    '[
        {
            "name": "Detective-Investigator",
            "description": "Students or colleagues of the murdered researcher. Must cooperate, record clues, and solve puzzles to discover the truth.",
            "perks": ["Enhanced observation", "Cryptanalysis bonus", "Team coordination"]
        },
        {
            "name": "Librarian Assistant",
            "description": "Familiar with library systems and cataloging. Gets hints about organization and classification.",
            "perks": ["Catalog knowledge", "Research speed", "Organization bonus"]
        },
        {
            "name": "Cryptography Expert",
            "description": "Specializes in codes and ciphers. Can decode messages faster and identify cipher types.",
            "perks": ["Cipher mastery", "Code recognition", "Decryption speed"]
        }
    ]',
    '[
        "Mystery and Investigation",
        "Knowledge and Wisdom",
        "Truth and Justice",
        "Collaboration and Teamwork",
        "History and Tradition",
        "Secrets and Revelation"
    ]',
    '{
        "scene_1": "beginner",
        "scene_2": "beginner",
        "scene_3": "intermediate",
        "scene_4": "intermediate",
        "scene_5": "intermediate",
        "scene_6": "advanced",
        "scene_7": "advanced",
        "scene_8": "expert"
    }',
    '{
        "progressive_hints": true,
        "contextual_help": true,
        "team_hints": true,
        "time_based_hints": false,
        "hint_cost": 0
    }',
    false,
    '{
        "manuscript_overlay": true,
        "uv_light_simulation": true,
        "3d_library_environment": true,
        "ghostly_whispers": true
    }',
    '[
        {
            "name": "Mr. Sloane",
            "role": "Chief Librarian",
            "personality": "Wise, mysterious, helpful but cryptic",
            "appears_in": ["card_catalog", "final_confrontation"]
        },
        {
            "name": "Dr. Reyes",
            "role": "Manuscript Curator",
            "personality": "Suspicious, knowledgeable, defensive",
            "appears_in": ["manuscript_cipher", "microfilm_acrostic"]
        },
        {
            "name": "Dr. Black",
            "role": "History Professor",
            "personality": "Argumentative, scholarly, secretive",
            "appears_in": ["manuscript_cipher", "logic_puzzle"]
        }
    ]',
    true,
    false,
    '[
        "Visual accessibility",
        "Audio descriptions",
        "Large text options",
        "Color contrast adjustments"
    ]',
    ARRAY['en', 'es'],
    '{
        "cultural_references": "Universal library themes",
        "language_adaptations": "Cryptographic terms in multiple languages"
    }',
    '{
        "primary_color": "#8B4513",
        "secondary_color": "#DAA520",
        "accent_color": "#2F4F4F",
        "font_family": "serif",
        "atmosphere": "mysterious_library",
        "lighting": "dim_amber"
    }',
    '/images/whispers-library-cover.jpg',
    '/audio/whispers-library-ambient.mp3',
    '[
        "book_pages_turning",
        "footsteps_on_wood",
        "clock_ticking",
        "whispered_voices",
        "chest_opening",
        "key_turning"
    ]',
    '[
        "dust_particles",
        "candle_flicker",
        "shadow_movement",
        "text_glow",
        "uv_reveal"
    ]',
    'published',
    true,
    true,
    '1.0.0',
    ARRAY['mystery', 'escape_room', 'cryptography', 'library', 'detective', 'puzzle']
);
