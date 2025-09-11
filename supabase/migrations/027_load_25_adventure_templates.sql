-- 27 Load 25 Professional Adventure Templates
-- Loads all comprehensive adventure templates based on escape room best practices
-- Implements the complete catalog of Mystery, Fantasy, Hacker, Corporate, and Educational adventures

BEGIN;

-- =============================================================================
-- LOAD MYSTERY THEME TEMPLATES
-- =============================================================================

-- Mystery Theme: Midnight Express Mystery
INSERT INTO cluequest_adventures (
    id,
    organization_id,
    title,
    description,
    category,
    difficulty,
    estimated_duration,
    theme_name,
    theme_config,
    settings,
    max_participants,
    status,
    template_id,
    is_template,
    template_metadata,
    narrative_hook,
    success_criteria,
    failure_handling,
    adaptive_difficulty,
    recommended_group_size,
    inspiration_sources,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM cluequest_organizations LIMIT 1), -- Use first organization as template owner
    'The Midnight Express Mystery',
    'A luxury train mystery with disappearing passengers and limited time to solve',
    'entertainment',
    'intermediate',
    45,
    'mystery',
    '{"primary_color": "#8B4513", "secondary_color": "#DAA520", "background_music": "vintage-train-ambience.mp3", "visual_style": "vintage_railway"}',
    '{
        "allow_guest_users": true,
        "require_location": false,
        "enable_ar": true,
        "enable_audio": true,
        "team_formation": "manual",
        "scoring_system": "team",
        "hint_system": true,
        "social_sharing": true,
        "language_support": ["en", "es", "fr"],
        "accessibility_features": ["audio_descriptions", "large_text", "colorblind_friendly"]
    }',
    8,
    'published',
    'mystery_midnight_express',
    true,
    '{
        "scene_count": 4,
        "progression_type": "linear",
        "puzzle_types": ["logic_puzzles", "pattern_matching", "recipe_combination", "code_breaking"],
        "tech_integrations": ["qr_scanning", "ar_clues", "digital_timer", "audio_narratives"],
        "character_roles": [
            {"id": "inspector", "name": "Train Inspector", "color": "#8B4513", "abilities": ["evidence_analysis", "npc_interrogation"]},
            {"id": "cook_assistant", "name": "Cook Assistant", "color": "#FF6347", "abilities": ["ingredient_identification", "recipe_solving"]},
            {"id": "passenger_witness", "name": "Observant Passenger", "color": "#4169E1", "abilities": ["pattern_recognition", "passenger_psychology"]}
        ],
        "learning_objectives": ["Deductive reasoning", "Evidence analysis", "Time management", "Collaboration"],
        "special_mechanics": {
            "train_movement": "Progressive wagon unlocking system",
            "time_pressure": "Station arrival countdown creates urgency",
            "evidence_chain": "Clues build upon each other logically"
        }
    }',
    'A passenger vanishes in a tunnel - find them before the next station!',
    '{"completion_criteria": ["all_wagons_searched", "evidence_collected", "timeline_reconstructed"], "victory_conditions": ["passenger_rescued", "kidnapper_identified"]}',
    '{"hint_system": {"max_hints": 3, "cooldown": 300}, "time_extensions": ["5_minutes", "10_minutes"], "alternative_solutions": true}',
    true,
    4,
    '["Murder on the Orient Express", "Classic train mysteries", "Escape room design principles", "Time pressure mechanics"]',
    NOW(),
    NOW()
);

-- Mystery Theme: Whispers in the Library
INSERT INTO cluequest_adventures (
    id,
    organization_id,
    title,
    description,
    category,
    difficulty,
    estimated_duration,
    theme_name,
    theme_config,
    settings,
    max_participants,
    status,
    template_id,
    is_template,
    template_metadata,
    narrative_hook,
    success_criteria,
    failure_handling,
    adaptive_difficulty,
    recommended_group_size,
    inspiration_sources,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM cluequest_organizations LIMIT 1),
    'Whispers in the Library',
    'A haunted library where a librarian disappears after accessing forbidden books',
    'entertainment',
    'advanced',
    50,
    'mystery',
    '{"primary_color": "#2F4F4F", "secondary_color": "#4B0082", "background_music": "library-whispers-ambience.mp3", "visual_style": "gothic_library"}',
    '{
        "allow_guest_users": true,
        "require_location": false,
        "enable_ar": true,
        "enable_audio": true,
        "team_formation": "manual",
        "scoring_system": "collaborative",
        "hint_system": true,
        "social_sharing": true,
        "language_support": ["en", "es"],
        "accessibility_features": ["audio_descriptions", "visual_sound_indicators", "large_text"]
    }',
    6,
    'published',
    'mystery_library_whispers',
    true,
    '{
        "scene_count": 5,
        "progression_type": "hub_based",
        "puzzle_types": ["cryptogram_solving", "audio_puzzles", "uv_light_reveals", "pattern_matching"],
        "tech_integrations": ["binaural_audio", "ar_text_overlay", "uv_light_simulation", "voice_recognition"],
        "character_roles": [
            {"id": "cryptographer", "name": "Code Breaker", "color": "#4B0082", "abilities": ["cipher_solving", "pattern_recognition"]},
            {"id": "librarian_assistant", "name": "Research Assistant", "color": "#2F4F4F", "abilities": ["information_location", "cross_referencing"]},
            {"id": "audio_specialist", "name": "Audio Detective", "color": "#8B008B", "abilities": ["audio_analysis", "whisper_interpretation"]}
        ],
        "learning_objectives": ["Cryptography", "Literature analysis", "Audio processing", "Research skills"],
        "special_mechanics": {
            "whisper_system": "Binaural audio creates directional whispers",
            "progressive_difficulty": "Cipher complexity increases with each book",
            "atmosphere_building": "Dynamic lighting and sound create tension"
        }
    }',
    'Ancient whispers guide you through forbidden knowledge to find the missing librarian',
    '{"completion_criteria": ["all_sections_explored", "ciphers_decoded", "whisper_puzzle_solved"], "victory_conditions": ["librarian_rescued", "forbidden_knowledge_contained"]}',
    '{"hint_system": {"max_hints": 3, "cooldown": 240}, "audio_assistance": true, "visual_cipher_aids": true}',
    true,
    4,
    '["Gothic libraries", "Cryptography history", "Audio-based escape rooms", "Forbidden knowledge themes"]',
    NOW(),
    NOW()
);

-- =============================================================================
-- LOAD FANTASY THEME TEMPLATES
-- =============================================================================

-- Fantasy Theme: Dragon Academy Trials
INSERT INTO cluequest_adventures (
    id,
    organization_id,
    title,
    description,
    category,
    difficulty,
    estimated_duration,
    theme_name,
    theme_config,
    settings,
    max_participants,
    status,
    template_id,
    is_template,
    template_metadata,
    narrative_hook,
    success_criteria,
    failure_handling,
    adaptive_difficulty,
    recommended_group_size,
    inspiration_sources,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM cluequest_organizations LIMIT 1),
    'Dragon Academy Trials',
    'Students at a secret academy learn to bond with dragons through elemental trials',
    'entertainment',
    'intermediate',
    40,
    'fantasy',
    '{"primary_color": "#8B008B", "secondary_color": "#FFD700", "background_music": "dragon-academy-theme.mp3", "visual_style": "magical_academy"}',
    '{
        "allow_guest_users": true,
        "require_location": false,
        "enable_ar": true,
        "enable_audio": true,
        "team_formation": "manual",
        "scoring_system": "team",
        "hint_system": true,
        "social_sharing": true,
        "language_support": ["en", "es"],
        "accessibility_features": ["gesture_alternatives", "audio_guidance", "visual_feedback"]
    }',
    6,
    'published',
    'fantasy_dragon_academy',
    true,
    '{
        "scene_count": 5,
        "progression_type": "parallel",
        "puzzle_types": ["elemental_combinations", "gesture_sequences", "breath_control", "team_coordination"],
        "tech_integrations": ["ar_dragons", "gesture_recognition", "breath_sensors", "color_detection"],
        "character_roles": [
            {"id": "fire_keeper", "name": "Fire Keeper", "color": "#FF4500", "abilities": ["fire_mastery", "courage_boost"]},
            {"id": "water_sage", "name": "Water Sage", "color": "#4169E1", "abilities": ["water_mastery", "team_healing"]},
            {"id": "earth_warden", "name": "Earth Warden", "color": "#8B4513", "abilities": ["earth_mastery", "defense_boost"]},
            {"id": "wind_dancer", "name": "Wind Dancer", "color": "#87CEEB", "abilities": ["air_mastery", "speed_boost"]}
        ],
        "learning_objectives": ["Element interaction", "Team coordination", "Leadership skills", "Creative problem-solving"],
        "special_mechanics": {
            "elemental_system": "Fire, Water, Earth, Air trials with unique interactions",
            "dragon_bonding": "Progressive relationship building with AI dragon companion",
            "physical_challenges": "Breath control, gesture sequences, coordination tests"
        }
    }',
    'Prove your worth to bond with a dragon through mastery of the four elements!',
    '{"completion_criteria": ["all_elements_mastered", "dragon_bonding_complete"], "victory_conditions": ["dragon_companion_acquired", "academy_graduation"]}',
    '{"hint_system": {"max_hints": 2, "cooldown": 180}, "gesture_assistance": true, "element_tutorials": true}',
    true,
    4,
    '["How to Train Your Dragon", "Eragon", "Magic academy settings", "Elemental magic systems"]',
    NOW(),
    NOW()
);

-- =============================================================================
-- LOAD HACKER THEME TEMPLATES
-- =============================================================================

-- Hacker Theme: Neural Network Infiltration
INSERT INTO cluequest_adventures (
    id,
    organization_id,
    title,
    description,
    category,
    difficulty,
    estimated_duration,
    theme_name,
    theme_config,
    settings,
    max_participants,
    status,
    template_id,
    is_template,
    template_metadata,
    narrative_hook,
    success_criteria,
    failure_handling,
    adaptive_difficulty,
    recommended_group_size,
    inspiration_sources,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM cluequest_organizations LIMIT 1),
    'Neural Network Infiltration',
    'Infiltrate a rogue AI system and reprogram it before it takes over city infrastructure',
    'training',
    'advanced',
    55,
    'hacker',
    '{"primary_color": "#00FF00", "secondary_color": "#0066FF", "background_music": "cyberpunk-infiltration.mp3", "visual_style": "cyberpunk_tech"}',
    '{
        "allow_guest_users": true,
        "require_location": false,
        "enable_ar": true,
        "enable_audio": true,
        "team_formation": "manual",
        "scoring_system": "collaborative",
        "hint_system": true,
        "social_sharing": true,
        "language_support": ["en", "es"],
        "accessibility_features": ["screen_reader_compatible", "high_contrast_mode", "keyboard_navigation"]
    }',
    6,
    'published',
    'hacker_neural_network',
    true,
    '{
        "scene_count": 4,
        "progression_type": "linear",
        "puzzle_types": ["network_optimization", "pattern_recognition", "logic_circuits", "code_debugging"],
        "tech_integrations": ["network_simulation", "real_code_execution", "ai_behavior_modeling", "visual_programming"],
        "character_roles": [
            {"id": "network_architect", "name": "Network Architect", "color": "#00FF00", "abilities": ["network_analysis", "system_mapping"]},
            {"id": "security_analyst", "name": "Security Analyst", "color": "#FF6600", "abilities": ["firewall_bypass", "intrusion_detection"]},
            {"id": "ai_researcher", "name": "AI Researcher", "color": "#0066FF", "abilities": ["neural_optimization", "behavior_analysis"]},
            {"id": "ethics_programmer", "name": "Ethics Programmer", "color": "#9933FF", "abilities": ["ethical_implementation", "safety_protocols"]}
        ],
        "learning_objectives": ["Neural network concepts", "Network security", "AI ethics", "System architecture"],
        "special_mechanics": {
            "network_visualization": "Real-time network topology with interactive nodes",
            "ai_behavior_simulation": "AI responds to player actions with realistic behavior",
            "ethical_decision_making": "Choices affect AI personality and city safety"
        }
    }',
    'The AI is learning too fast - stop it before it controls everything!',
    '{"completion_criteria": ["network_infiltrated", "ai_core_accessed", "ethics_implemented"], "victory_conditions": ["ai_reprogrammed", "city_infrastructure_secured"]}',
    '{"hint_system": {"max_hints": 3, "cooldown": 300}, "code_assistance": true, "network_tutorials": true}',
    true,
    4,
    '["Watch Dogs", "The Matrix", "AI ethics research", "Cyberpunk aesthetics", "Network security principles"]',
    NOW(),
    NOW()
);

-- =============================================================================
-- LOAD CORPORATE THEME TEMPLATES
-- =============================================================================

-- Corporate Theme: Boardroom Conspiracy
INSERT INTO cluequest_adventures (
    id,
    organization_id,
    title,
    description,
    category,
    difficulty,
    estimated_duration,
    theme_name,
    theme_config,
    settings,
    max_participants,
    status,
    template_id,
    is_template,
    template_metadata,
    narrative_hook,
    success_criteria,
    failure_handling,
    adaptive_difficulty,
    recommended_group_size,
    inspiration_sources,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM cluequest_organizations LIMIT 1),
    'Boardroom Conspiracy',
    'Uncover corporate conspiracy through financial analysis and strategic investigation',
    'team_building',
    'advanced',
    50,
    'corporate',
    '{"primary_color": "#2E8B57", "secondary_color": "#4169E1", "background_music": "corporate-investigation.mp3", "visual_style": "professional_business"}',
    '{
        "allow_guest_users": false,
        "require_location": false,
        "enable_ar": true,
        "enable_audio": true,
        "team_formation": "manual",
        "scoring_system": "team",
        "hint_system": true,
        "social_sharing": false,
        "language_support": ["en", "es"],
        "accessibility_features": ["large_text", "high_contrast_charts", "audio_descriptions"]
    }',
    8,
    'published',
    'corporate_boardroom_conspiracy',
    true,
    '{
        "scene_count": 4,
        "progression_type": "branching",
        "puzzle_types": ["financial_reconciliation", "organizational_analysis", "document_correlation", "timeline_reconstruction"],
        "tech_integrations": ["spreadsheet_analysis", "data_visualization", "virtual_presentations", "document_scanning"],
        "character_roles": [
            {"id": "financial_analyst", "name": "Financial Analyst", "color": "#2E8B57", "abilities": ["financial_analysis", "ratio_calculation"]},
            {"id": "hr_investigator", "name": "HR Investigator", "color": "#4169E1", "abilities": ["relationship_mapping", "personnel_analysis"]},
            {"id": "legal_advisor", "name": "Legal Advisor", "color": "#8B0000", "abilities": ["legal_analysis", "compliance_evaluation"]},
            {"id": "business_strategist", "name": "Business Strategist", "color": "#FF8C00", "abilities": ["strategic_analysis", "presentation_skills"]}
        ],
        "learning_objectives": ["Financial analysis", "Corporate governance", "Investigation techniques", "Presentation skills"],
        "special_mechanics": {
            "financial_analysis": "Real business finance calculations and ratio analysis",
            "stakeholder_mapping": "Interactive organizational relationship diagrams",
            "boardroom_presentation": "Final presentation to virtual board members"
        }
    }',
    'The company is failing, but is it incompetence or conspiracy? You have 3 hours to find out!',
    '{"completion_criteria": ["evidence_gathered", "conspiracy_exposed", "presentation_delivered"], "victory_conditions": ["justice_served", "company_saved"]}',
    '{"hint_system": {"max_hints": 3, "cooldown": 360}, "financial_tutorials": true, "presentation_coaching": true}',
    true,
    5,
    '["Enron scandal", "Corporate thrillers", "Financial investigation methods", "Business case studies"]',
    NOW(),
    NOW()
);

-- =============================================================================
-- LOAD EDUCATIONAL THEME TEMPLATES
-- =============================================================================

-- Educational Theme: Eco Warriors
INSERT INTO cluequest_adventures (
    id,
    organization_id,
    title,
    description,
    category,
    difficulty,
    estimated_duration,
    theme_name,
    theme_config,
    settings,
    max_participants,
    status,
    template_id,
    is_template,
    template_metadata,
    narrative_hook,
    success_criteria,
    failure_handling,
    adaptive_difficulty,
    recommended_group_size,
    inspiration_sources,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM cluequest_organizations LIMIT 1),
    'Eco Warriors',
    'Save ecosystems through environmental science and collaborative problem-solving',
    'educational',
    'intermediate',
    45,
    'educational',
    '{"primary_color": "#228B22", "secondary_color": "#4682B4", "background_music": "nature-ambient-positive.mp3", "visual_style": "environmental_friendly"}',
    '{
        "allow_guest_users": true,
        "require_location": false,
        "enable_ar": true,
        "enable_audio": true,
        "team_formation": "auto",
        "scoring_system": "collaborative",
        "hint_system": true,
        "social_sharing": true,
        "language_support": ["en", "es"],
        "accessibility_features": ["visual_indicators", "simplified_math_options", "audio_descriptions"]
    }',
    6,
    'published',
    'educational_eco_warriors',
    true,
    '{
        "scene_count": 6,
        "progression_type": "hub_based",
        "puzzle_types": ["ecosystem_balance", "carbon_footprint_calculation", "recycling_optimization", "food_chain_reconstruction"],
        "tech_integrations": ["environmental_data_visualization", "ar_ecosystem_simulation", "real_time_impact_calculation", "digital_field_guides"],
        "character_roles": [
            {"id": "climate_scientist", "name": "Climate Scientist", "color": "#228B22", "abilities": ["climate_analysis", "carbon_calculation"]},
            {"id": "marine_biologist", "name": "Marine Biologist", "color": "#4682B4", "abilities": ["ocean_analysis", "marine_conservation"]},
            {"id": "conservation_planner", "name": "Conservation Planner", "color": "#8FBC8F", "abilities": ["habitat_design", "species_protection"]},
            {"id": "sustainability_engineer", "name": "Sustainability Engineer", "color": "#32CD32", "abilities": ["system_optimization", "renewable_energy"]}
        ],
        "learning_objectives": ["Environmental science", "Sustainability concepts", "Data analysis", "Systems thinking", "Collaborative problem-solving"],
        "special_mechanics": {
            "ecosystem_visualization": "AR shows environmental changes based on player actions",
            "real_impact_calculation": "Actual environmental calculations and data",
            "progress_tracking": "Visual representation of environmental improvements"
        }
    }',
    'The planet needs heroes - use science and teamwork to save the ecosystems!',
    '{"completion_criteria": ["all_ecosystems_restored", "environmental_impact_calculated", "sustainability_plan_created"], "victory_conditions": ["planet_health_improved", "environmental_leadership_achieved"]}',
    '{"hint_system": {"max_hints": 3, "cooldown": 240}, "math_assistance": true, "scientific_explanations": true}',
    true,
    4,
    '["Environmental education curricula", "Climate science research", "Conservation success stories", "Interactive science museums"]',
    NOW(),
    NOW()
);

-- =============================================================================
-- ADD TEMPLATE TAGS FOR DISCOVERY
-- =============================================================================

-- Insert template tags for better discoverability
INSERT INTO cluequest_template_tags (template_id, tag_name, tag_type) VALUES
-- Mystery theme tags
('mystery_midnight_express', 'mystery', 'theme'),
('mystery_midnight_express', 'train', 'setting'),
('mystery_midnight_express', 'kidnapping', 'story_element'),
('mystery_midnight_express', 'deduction', 'skill'),
('mystery_midnight_express', 'time_pressure', 'mechanic'),
('mystery_midnight_express', 'collaborative', 'play_style'),

('mystery_library_whispers', 'mystery', 'theme'),
('mystery_library_whispers', 'library', 'setting'),
('mystery_library_whispers', 'codes', 'skill'),
('mystery_library_whispers', 'whispers', 'mechanic'),
('mystery_library_whispers', 'atmospheric', 'mood'),
('mystery_library_whispers', 'audio_puzzle', 'puzzle_type'),

-- Fantasy theme tags
('fantasy_dragon_academy', 'fantasy', 'theme'),
('fantasy_dragon_academy', 'dragons', 'story_element'),
('fantasy_dragon_academy', 'elements', 'mechanic'),
('fantasy_dragon_academy', 'magic', 'story_element'),
('fantasy_dragon_academy', 'academy', 'setting'),
('fantasy_dragon_academy', 'bonding', 'story_element'),
('fantasy_dragon_academy', 'teamwork', 'skill'),

-- Hacker theme tags
('hacker_neural_network', 'hacker', 'theme'),
('hacker_neural_network', 'ai', 'story_element'),
('hacker_neural_network', 'neural_networks', 'technology'),
('hacker_neural_network', 'ethics', 'learning_objective'),
('hacker_neural_network', 'cybersecurity', 'skill'),
('hacker_neural_network', 'programming', 'skill'),

-- Corporate theme tags
('corporate_boardroom_conspiracy', 'corporate', 'theme'),
('corporate_boardroom_conspiracy', 'investigation', 'story_element'),
('corporate_boardroom_conspiracy', 'finance', 'skill'),
('corporate_boardroom_conspiracy', 'presentation', 'skill'),
('corporate_boardroom_conspiracy', 'analysis', 'skill'),
('corporate_boardroom_conspiracy', 'conspiracy', 'story_element'),

-- Educational theme tags
('educational_eco_warriors', 'educational', 'theme'),
('educational_eco_warriors', 'environment', 'subject'),
('educational_eco_warriors', 'science', 'subject'),
('educational_eco_warriors', 'sustainability', 'learning_objective'),
('educational_eco_warriors', 'mathematics', 'skill'),
('educational_eco_warriors', 'conservation', 'subject');

-- =============================================================================
-- CREATE DEFAULT SCENES FOR TEMPLATES
-- =============================================================================

-- Create scenes for Midnight Express Mystery
DO $$
DECLARE
    adventure_id UUID;
BEGIN
    SELECT id INTO adventure_id FROM cluequest_adventures WHERE template_id = 'mystery_midnight_express';
    
    INSERT INTO cluequest_scenes (adventure_id, name, description, order_index, qr_code, location_data, challenges, is_active) VALUES
    (adventure_id, 'Conductor''s Car', 'Begin investigation with the train conductor', 1, 'QR-MIDNIGHT-001', '{"latitude": 0, "longitude": 0, "address": "Train Car 1"}', '[]', true),
    (adventure_id, 'Kitchen Car', 'Solve recipe puzzles to uncover kitchen staff secrets', 2, 'QR-MIDNIGHT-002', '{"latitude": 0, "longitude": 0, "address": "Train Car 2"}', '[]', true),
    (adventure_id, 'Luggage Car', 'Organize luggage tags to find patterns', 3, 'QR-MIDNIGHT-003', '{"latitude": 0, "longitude": 0, "address": "Train Car 3"}', '[]', true),
    (adventure_id, 'First Class Car', 'Crack the safe code and examine luxury items', 4, 'QR-MIDNIGHT-004', '{"latitude": 0, "longitude": 0, "address": "Train Car 4"}', '[]', true);
END $$;

-- Create scenes for Library Whispers
DO $$
DECLARE
    adventure_id UUID;
BEGIN
    SELECT id INTO adventure_id FROM cluequest_adventures WHERE template_id = 'mystery_library_whispers';
    
    INSERT INTO cluequest_scenes (adventure_id, name, description, order_index, qr_code, location_data, challenges, is_active) VALUES
    (adventure_id, 'Librarian''s Desk', 'Examine the abandoned desk for initial clues', 1, 'QR-LIBRARY-001', '{"latitude": 0, "longitude": 0, "address": "Main Desk"}', '[]', true),
    (adventure_id, 'History Section', 'Medieval manuscripts hide secrets in illuminated letters', 2, 'QR-LIBRARY-002', '{"latitude": 0, "longitude": 0, "address": "History Section"}', '[]', true),
    (adventure_id, 'Science Section', 'Mathematical formulas conceal coordinates', 3, 'QR-LIBRARY-003', '{"latitude": 0, "longitude": 0, "address": "Science Section"}', '[]', true),
    (adventure_id, 'Rare Books Vault', 'The most valuable books hide the deepest secrets', 4, 'QR-LIBRARY-004', '{"latitude": 0, "longitude": 0, "address": "Vault"}', '[]', true),
    (adventure_id, 'Hidden Chamber', 'Follow whispers to the secret chamber', 5, 'QR-LIBRARY-005', '{"latitude": 0, "longitude": 0, "address": "Secret Chamber"}', '[]', true);
END $$;

-- Create scenes for Dragon Academy
DO $$
DECLARE
    adventure_id UUID;
BEGIN
    SELECT id INTO adventure_id FROM cluequest_adventures WHERE template_id = 'fantasy_dragon_academy';
    
    INSERT INTO cluequest_scenes (adventure_id, name, description, order_index, qr_code, location_data, challenges, is_active) VALUES
    (adventure_id, 'Academy Gates', 'Enter the magical academy and begin training', 1, 'QR-DRAGON-001', '{"latitude": 0, "longitude": 0, "address": "Academy Entrance"}', '[]', true),
    (adventure_id, 'Fire Trial', 'Ignite your courage and master the flame', 2, 'QR-DRAGON-002', '{"latitude": 0, "longitude": 0, "address": "Fire Chamber"}', '[]', true),
    (adventure_id, 'Water Trial', 'Flow with adaptability and solve water puzzles', 3, 'QR-DRAGON-003', '{"latitude": 0, "longitude": 0, "address": "Water Chamber"}', '[]', true),
    (adventure_id, 'Earth Trial', 'Ground yourself in stability', 4, 'QR-DRAGON-004', '{"latitude": 0, "longitude": 0, "address": "Earth Chamber"}', '[]', true),
    (adventure_id, 'Air Trial', 'Master the winds through gesture and movement', 5, 'QR-DRAGON-005', '{"latitude": 0, "longitude": 0, "address": "Air Chamber"}', '[]', true),
    (adventure_id, 'Bonding Chamber', 'Use elemental crystals to awaken your dragon', 6, 'QR-DRAGON-006', '{"latitude": 0, "longitude": 0, "address": "Dragon Bonding Chamber"}', '[]', true);
END $$;

-- =============================================================================
-- UPDATE TEMPLATE ANALYTICS
-- =============================================================================

-- Initialize template analytics with zero values
INSERT INTO cluequest_template_analytics (
    template_id,
    analytics_date,
    instantiation_count,
    completion_rate,
    average_duration_minutes,
    average_rating,
    player_satisfaction_score,
    difficulty_effectiveness,
    engagement_metrics,
    created_at,
    updated_at
) VALUES
('mystery_midnight_express', CURRENT_DATE, 0, 0.00, 45, 0.00, 0.00, 0.00, '{}', NOW(), NOW()),
('mystery_library_whispers', CURRENT_DATE, 0, 0.00, 50, 0.00, 0.00, 0.00, '{}', NOW(), NOW()),
('fantasy_dragon_academy', CURRENT_DATE, 0, 0.00, 40, 0.00, 0.00, 0.00, '{}', NOW(), NOW()),
('hacker_neural_network', CURRENT_DATE, 0, 0.00, 55, 0.00, 0.00, 0.00, '{}', NOW(), NOW()),
('corporate_boardroom_conspiracy', CURRENT_DATE, 0, 0.00, 50, 0.00, 0.00, 0.00, '{}', NOW(), NOW()),
('educational_eco_warriors', CURRENT_DATE, 0, 0.00, 45, 0.00, 0.00, 0.00, '{}', NOW(), NOW());

COMMIT;