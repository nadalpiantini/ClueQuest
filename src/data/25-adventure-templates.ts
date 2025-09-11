/**
 * ClueQuest 25 Professional Adventure Templates
 * Based on comprehensive escape room best practices and professional game design
 * Implements all themes with detailed mechanics and mobile-first optimization
 */

import { StoryTemplate } from './story-templates';

// =============================================================================
// 🎭 MYSTERY THEME ADVENTURES (5 adventures)
// =============================================================================

export const mysteryAdventureTemplates: StoryTemplate[] = [
  {
    template_id: 'mystery_midnight_express',
    template_name: 'The Midnight Express Mystery',
    category: 'mystery',
    description: 'A luxury train mystery with disappearing passengers and limited time to solve',
    template_data: {
      story_id: 'mystery_midnight_express',
      title: 'The Midnight Express Mystery',
      description: 'A secuestro aboard a luxury night train crossing beautiful landscapes',
      full_description: 'Un lujoso tren nocturno que atraviesa paisajes hermosos se convierte en escenario de un secuestro. El conductor descubre que uno de los pasajeros ha desaparecido al pasar por un túnel. El objetivo es localizar al secuestrado antes de la próxima estación.',
      category: 'mystery',
      difficulty: 'intermediate',
      estimated_duration: 45,
      scene_count: 4,
      progression_type: 'linear',
      min_players: 2,
      max_players: 8,
      recommended_players: 4,
      min_age: 12,
      setup_time: 10,
      location_type: 'indoor',
      space_requirements: '4 connected rooms or large space with sections',
      required_materials: ['QR codes', 'Recipe cards', 'Luggage props', 'Timer display', 'Train tickets'],
      tech_requirements: ['Smartphones', 'AR capability', 'Audio system'],
      optional_materials: ['Train sound effects', 'Conductor costume', 'Vintage suitcases'],
      learning_objectives: ['Deductive reasoning', 'Evidence analysis', 'Time management', 'Collaboration'],
      skills_developed: ['Critical thinking', 'Pattern recognition', 'Communication', 'Problem-solving'],
      knowledge_areas: ['Logic', 'Investigation techniques', 'Transportation history'],
      puzzle_types: ['Logic puzzles', 'Pattern matching', 'Recipe combination', 'Code breaking'],
      tech_integrations: ['QR scanning', 'AR clues', 'Digital timer', 'Audio narratives'],
      special_mechanics: {
        train_movement: 'Progressive wagon unlocking system',
        time_pressure: 'Station arrival countdown creates urgency',
        roles: 'Inspector, cook, passenger - each with unique abilities',
        evidence_chain: 'Clues build upon each other logically'
      },
      narrative_hook: 'A passenger vanishes in a tunnel - find them before the next station!',
      story_acts: [
        {
          act_id: 'discovery',
          title: 'The Disappearance',
          description: 'Discover the missing passenger and begin investigation',
          duration: 10,
          objectives: ['Identify missing person', 'Examine passenger manifest', 'Interview conductor'],
          scenes: [
            {
              scene_id: 'conductor_car',
              title: 'Conductor\'s Car',
              description: 'Begin investigation with the train conductor',
              duration: 10,
              objectives: ['Get passenger list', 'Understand train route', 'Learn about the tunnel'],
              puzzles: [
                {
                  puzzle_id: 'manifest_puzzle',
                  title: 'Passenger Manifest Mystery',
                  type: 'pattern_matching',
                  difficulty: 'easy',
                  description: 'Compare passenger list with tickets to find discrepancies',
                  mechanics: ['visual_comparison', 'number_matching', 'anomaly_detection']
                }
              ],
              interactions: [
                { type: 'npc_dialogue', character: 'Conductor', clues: ['tunnel_timing', 'suspicious_behavior'] }
              ],
              qr_codes: [
                { location: 'Conductor desk', reveals: 'passenger_manifest', description: 'Scan for passenger records' }
              ],
              ar_elements: [
                { type: 'ghost_passenger', trigger: 'qr_scan', effect: 'Shows last known position' }
              ],
              hints: [
                { level: 1, text: 'Look for mismatched names and seat numbers' },
                { level: 2, text: 'The missing person\'s ticket has a special marking' }
              ],
              rewards: [
                { type: 'clue', item: 'Suspicious ticket stub', points: 100 }
              ]
            }
          ],
          narrative_progression: 'Team discovers someone is missing and gets initial evidence',
          difficulty_escalation: 1
        },
        {
          act_id: 'investigation',
          title: 'Train Car Investigation',
          description: 'Search through different train cars for clues',
          duration: 20,
          objectives: ['Search kitchen car', 'Examine luggage car', 'Investigate first class'],
          scenes: [
            {
              scene_id: 'kitchen_car',
              title: 'Kitchen Car',
              description: 'Solve recipe puzzles to uncover kitchen staff secrets',
              duration: 8,
              objectives: ['Combine ingredients correctly', 'Find hidden recipe', 'Question cook'],
              puzzles: [
                {
                  puzzle_id: 'recipe_cipher',
                  title: 'Secret Recipe Code',
                  type: 'combination_puzzle',
                  difficulty: 'medium',
                  description: 'Combine ingredients following a coded recipe to reveal message',
                  mechanics: ['ingredient_mixing', 'sequence_following', 'color_matching']
                }
              ],
              interactions: [
                { type: 'physical_manipulation', object: 'ingredient_cards', result: 'recipe_completion' }
              ],
              qr_codes: [
                { location: 'Recipe book', reveals: 'ingredient_list', description: 'Scan for cooking instructions' }
              ],
              ar_elements: [
                { type: 'ingredient_overlay', trigger: 'recipe_scan', effect: 'Shows correct combinations' }
              ],
              hints: [
                { level: 1, text: 'The recipe has more than food ingredients' },
                { level: 2, text: 'Look for ingredients that spell out words' }
              ],
              rewards: [
                { type: 'clue', item: 'Kitchen schedule showing unusual activity', points: 150 }
              ]
            },
            {
              scene_id: 'luggage_car',
              title: 'Luggage Car',
              description: 'Organize luggage tags to find patterns and hidden compartments',
              duration: 8,
              objectives: ['Sort luggage by color/number patterns', 'Find hidden compartments', 'Match tags to passengers'],
              puzzles: [
                {
                  puzzle_id: 'luggage_sorting',
                  title: 'Luggage Tag Cipher',
                  type: 'organizational_puzzle',
                  difficulty: 'medium',
                  description: 'Organize luggage tags by patterns to reveal hidden message',
                  mechanics: ['pattern_recognition', 'sorting_algorithm', 'spatial_reasoning']
                }
              ],
              interactions: [
                { type: 'physical_sorting', object: 'luggage_tags', result: 'pattern_revelation' }
              ],
              qr_codes: [
                { location: 'Hidden compartment', reveals: 'secret_documents', description: 'Scan the concealed papers' }
              ],
              ar_elements: [
                { type: 'xray_vision', trigger: 'compartment_discovery', effect: 'Shows hidden items' }
              ],
              hints: [
                { level: 1, text: 'Group tags by color first, then by numbers' },
                { level: 2, text: 'The pattern forms initials when viewed correctly' }
              ],
              rewards: [
                { type: 'clue', item: 'Hidden correspondence revealing motive', points: 200 }
              ]
            },
            {
              scene_id: 'first_class',
              title: 'First Class Car',
              description: 'Crack the safe code and examine luxury passenger belongings',
              duration: 4,
              objectives: ['Open the safe', 'Examine valuable items', 'Find passenger testimonies'],
              puzzles: [
                {
                  puzzle_id: 'safe_combination',
                  title: 'First Class Safe',
                  type: 'code_breaking',
                  difficulty: 'hard',
                  description: 'Use clues from other cars to determine safe combination',
                  mechanics: ['number_sequence', 'clue_synthesis', 'logical_deduction']
                }
              ],
              interactions: [
                { type: 'safe_manipulation', object: 'combination_lock', result: 'safe_opening' }
              ],
              qr_codes: [
                { location: 'Safe contents', reveals: 'final_evidence', description: 'Scan the crucial document' }
              ],
              ar_elements: [
                { type: 'document_overlay', trigger: 'safe_open', effect: 'Highlights important text' }
              ],
              hints: [
                { level: 1, text: 'The combination comes from previous puzzles' },
                { level: 2, text: 'Add the numbers from the recipe and luggage patterns' }
              ],
              rewards: [
                { type: 'evidence', item: 'Kidnapper identity and location', points: 300 }
              ]
            }
          ],
          narrative_progression: 'Team gathers evidence from each car, building toward the solution',
          difficulty_escalation: 2
        },
        {
          act_id: 'resolution',
          title: 'The Rescue',
          description: 'Use gathered evidence to locate and rescue the missing passenger',
          duration: 15,
          objectives: ['Reconstruct timeline', 'Identify kidnapper', 'Execute rescue plan'],
          scenes: [
            {
              scene_id: 'control_room',
              title: 'Train Control Room',
              description: 'Piece together all clues to stop the train and save the passenger',
              duration: 15,
              objectives: ['Combine all evidence', 'Identify kidnapper location', 'Activate emergency brake'],
              puzzles: [
                {
                  puzzle_id: 'timeline_reconstruction',
                  title: 'The Complete Timeline',
                  type: 'synthesis_puzzle',
                  difficulty: 'expert',
                  description: 'Arrange all collected evidence to recreate the kidnapping sequence',
                  mechanics: ['evidence_correlation', 'timeline_building', 'logical_sequence']
                }
              ],
              interactions: [
                { type: 'emergency_controls', object: 'brake_lever', result: 'train_stop' }
              ],
              qr_codes: [
                { location: 'Control panel', reveals: 'rescue_success', description: 'Execute the rescue plan' }
              ],
              ar_elements: [
                { type: 'success_celebration', trigger: 'puzzle_complete', effect: 'Victory animation with freed passenger' }
              ],
              hints: [
                { level: 1, text: 'Arrange evidence in chronological order' },
                { level: 2, text: 'The kidnapper made three critical mistakes' }
              ],
              rewards: [
                { type: 'victory', item: 'Passenger rescued successfully', points: 500 }
              ]
            }
          ],
          narrative_progression: 'Team saves the passenger and brings the case to resolution',
          difficulty_escalation: 3
        }
      ],
      character_roles: [
        {
          id: 'inspector',
          name: 'Train Inspector',
          description: 'Lead investigator with access to official records',
          abilities: ['evidence_analysis', 'npc_interrogation'],
          color: '#8B4513'
        },
        {
          id: 'cook_assistant',
          name: 'Cook\'s Assistant',
          description: 'Kitchen expert who understands ingredients and recipes',
          abilities: ['ingredient_identification', 'recipe_solving'],
          color: '#FF6347'
        },
        {
          id: 'passenger_witness',
          name: 'Observant Passenger',
          description: 'Sharp observer who notices behavioral patterns',
          abilities: ['pattern_recognition', 'passenger_psychology'],
          color: '#4169E1'
        }
      ],
      story_themes: ['kidnapping', 'train_travel', 'time_pressure', 'deduction', 'collaboration'],
      difficulty_curve: {
        act_1: 'Easy introduction with simple puzzles',
        act_2: 'Medium complexity with interconnected clues',
        act_3: 'High challenge requiring synthesis of all evidence'
      },
      hint_system: {
        progressive_hints: true,
        hint_cooldown: 300, // 5 minutes
        max_hints_per_puzzle: 3,
        hint_cost_points: 50
      },
      adaptive_difficulty: true,
      qr_codes_enabled: true,
      ar_features: {
        ghost_passenger: 'Shows where passenger was last seen',
        ingredient_overlay: 'Visual cooking assistance',
        xray_vision: 'Reveals hidden compartments',
        success_celebration: 'Victory animation'
      },
      ai_characters: [
        {
          id: 'conductor_npc',
          name: 'Train Conductor',
          personality: 'Helpful but nervous',
          dialogue_style: 'Professional railway terminology',
          clue_delivery: 'Provides official information and observations'
        }
      ],
      voice_interactions: true,
      gesture_controls: false,
      accessibility_features: ['audio_descriptions', 'large_text', 'colorblind_friendly'],
      language_support: ['en', 'es', 'fr'],
      cultural_adaptations: {
        european_version: 'Orient Express setting',
        american_version: 'Cross-country train',
        asian_version: 'High-speed rail setting'
      },
      theme_config: {
        primary_color: '#8B4513',
        secondary_color: '#DAA520',
        background_music: 'vintage-train-ambience.mp3',
        visual_style: 'vintage_railway'
      },
      cover_image_url: '/images/templates/midnight-express-mystery.jpg',
      background_music_url: '/audio/mystery/train-ambience.mp3',
      sound_effects: ['train_whistle', 'steam_hiss', 'compartment_doors', 'safe_clicking'],
      visual_effects: ['steam_particles', 'window_scenery', 'flickering_lights'],
      tags: ['mystery', 'train', 'kidnapping', 'deduction', 'time_pressure', 'collaborative']
    },
    default_settings: {
      max_duration: 45,
      hint_system_enabled: true,
      voice_guidance: true,
      ar_required: false
    },
    customization_options: {
      train_type: ['vintage_steam', 'modern_express', 'luxury_orient'],
      time_period: ['1920s', '1950s', 'modern_day'],
      difficulty_adjustment: ['easy', 'standard', 'expert'],
      language_options: ['english', 'spanish', 'french']
    },
    difficulty_range: ['beginner', 'intermediate', 'advanced'],
    player_range: { min: 2, max: 8 },
    age_range: { min: 12, max: 99 },
    duration_range: { min: 30, max: 60 }
  },

  // Additional Mystery Adventures
  {
    template_id: 'mystery_library_whispers',
    template_name: 'Whispers in the Library',
    category: 'mystery',
    description: 'A haunted library where a librarian disappears after accessing forbidden books',
    template_data: {
      story_id: 'mystery_library_whispers',
      title: 'Whispers in the Library',
      description: 'En una biblioteca histórica, un bibliotecario desaparece tras acceder a un libro prohibido',
      full_description: 'En una biblioteca histórica, un bibliotecario desaparece tras acceder a un libro prohibido. Los jugadores, convertidos en investigadores, exploran secciones oscuras para descubrir mensajes que susurran entre las estanterías.',
      category: 'mystery',
      difficulty: 'advanced',
      estimated_duration: 50,
      scene_count: 5,
      progression_type: 'hub_based',
      min_players: 3,
      max_players: 6,
      recommended_players: 4,
      min_age: 14,
      setup_time: 15,
      location_type: 'indoor',
      space_requirements: 'Large room with multiple sections or connected rooms',
      required_materials: ['UV lights', 'Cipher wheels', 'Audio system', 'Book props', 'QR codes'],
      tech_requirements: ['Smartphones', 'AR capability', 'Binaural audio support'],
      optional_materials: ['Atmospheric lighting', 'Vintage books', 'Librarian costume'],
      learning_objectives: ['Cryptography', 'Literature analysis', 'Audio processing', 'Research skills'],
      skills_developed: ['Code-breaking', 'Listening skills', 'Pattern recognition', 'Teamwork'],
      knowledge_areas: ['Cryptography', 'Library science', 'Historical mysteries'],
      puzzle_types: ['Cryptogram solving', 'Audio puzzles', 'UV light reveals', 'Pattern matching'],
      tech_integrations: ['Binaural audio', 'AR text overlay', 'UV light simulation', 'Voice recognition'],
      special_mechanics: {
        whisper_system: 'Binaural audio creates directional whispers',
        progressive_difficulty: 'Cipher complexity increases with each book',
        atmosphere_building: 'Dynamic lighting and sound create tension',
        collaborative_decoding: 'Multiple cipher systems require team coordination'
      },
      narrative_hook: 'Ancient whispers guide you through forbidden knowledge to find the missing librarian',
      story_acts: [
        {
          act_id: 'arrival',
          title: 'The Silent Library',
          description: 'Discover the librarian\'s disappearance and begin investigation',
          duration: 12,
          objectives: ['Find the librarian\'s last location', 'Discover the forbidden book', 'Hear the first whispers'],
          scenes: [
            {
              scene_id: 'main_desk',
              title: 'Librarian\'s Desk',
              description: 'Examine the abandoned desk for initial clues',
              duration: 12,
              objectives: ['Search desk drawers', 'Find access log', 'Locate UV light'],
              puzzles: [
                {
                  puzzle_id: 'desk_cipher',
                  title: 'Library Access Log',
                  type: 'substitution_cipher',
                  difficulty: 'medium',
                  description: 'Decode the librarian\'s final entries using a simple substitution cipher',
                  mechanics: ['letter_substitution', 'frequency_analysis', 'pattern_recognition']
                }
              ],
              interactions: [
                { type: 'desk_search', object: 'drawers', result: 'uv_light_discovery' }
              ],
              qr_codes: [
                { location: 'Calendar', reveals: 'access_schedule', description: 'Scan for recent activity' }
              ],
              ar_elements: [
                { type: 'ghostly_writing', trigger: 'uv_light', effect: 'Reveals hidden messages' }
              ],
              hints: [
                { level: 1, text: 'Look for patterns in the letter arrangements' },
                { level: 2, text: 'The most common letter represents \'E\'' }
              ],
              rewards: [
                { type: 'tool', item: 'UV Light', points: 100 },
                { type: 'clue', item: 'Restricted section access time', points: 150 }
              ]
            }
          ],
          narrative_progression: 'Team discovers the mystery and gains first investigative tools',
          difficulty_escalation: 1
        },
        {
          act_id: 'exploration',
          title: 'Section by Section',
          description: 'Explore different library sections, each with unique cipher challenges',
          duration: 25,
          objectives: ['Solve history section cipher', 'Decode science section puzzle', 'Unlock rare books vault'],
          scenes: [
            {
              scene_id: 'history_section',
              title: 'History Section',
              description: 'Medieval manuscripts hide secrets in illuminated letters',
              duration: 8,
              objectives: ['Decode illuminated manuscript', 'Find temporal patterns', 'Unlock chronology cipher'],
              puzzles: [
                {
                  puzzle_id: 'manuscript_illumination',
                  title: 'Illuminated Chronology',
                  type: 'visual_cipher',
                  difficulty: 'medium',
                  description: 'Decode messages hidden in decorative manuscript borders',
                  mechanics: ['visual_pattern_recognition', 'historical_timeline', 'artistic_analysis']
                }
              ],
              interactions: [
                { type: 'manuscript_examination', object: 'illuminated_texts', result: 'timeline_revelation' }
              ],
              qr_codes: [
                { location: 'Chronicle binding', reveals: 'historical_timeline', description: 'Scan the ancient binding' }
              ],
              ar_elements: [
                { type: 'manuscript_overlay', trigger: 'uv_scan', effect: 'Highlights hidden symbols' }
              ],
              hints: [
                { level: 1, text: 'The decorative elements contain letters' },
                { level: 2, text: 'Read the illuminated capitals in chronological order' }
              ],
              rewards: [
                { type: 'cipher_key', item: 'Medieval decoder ring', points: 200 }
              ]
            },
            {
              scene_id: 'science_section',
              title: 'Science Section',
              description: 'Mathematical formulas conceal coordinates and sequences',
              duration: 8,
              objectives: ['Solve equation series', 'Calculate coordinate positions', 'Unlock formula vault'],
              puzzles: [
                {
                  puzzle_id: 'equation_cipher',
                  title: 'Mathematical Coordinates',
                  type: 'mathematical_puzzle',
                  difficulty: 'hard',
                  description: 'Solve equations to generate coordinates pointing to the next clue location',
                  mechanics: ['equation_solving', 'coordinate_calculation', 'geometric_interpretation']
                }
              ],
              interactions: [
                { type: 'calculation_input', object: 'scientific_calculator', result: 'coordinate_generation' }
              ],
              qr_codes: [
                { location: 'Formula sheet', reveals: 'calculation_hints', description: 'Scan for mathematical constants' }
              ],
              ar_elements: [
                { type: 'equation_solver', trigger: 'formula_scan', effect: 'Shows step-by-step solutions' }
              ],
              hints: [
                { level: 1, text: 'Use the constants provided in the reference sheet' },
                { level: 2, text: 'The answers form coordinates when paired correctly' }
              ],
              rewards: [
                { type: 'location_key', item: 'Vault coordinates', points: 250 }
              ]
            },
            {
              scene_id: 'rare_books_vault',
              title: 'Rare Books Vault',
              description: 'The most valuable books hide the deepest secrets',
              duration: 9,
              objectives: ['Navigate vault security', 'Decode multi-layer cipher', 'Find librarian\'s final message'],
              puzzles: [
                {
                  puzzle_id: 'vault_multi_cipher',
                  title: 'Layered Security Cipher',
                  type: 'complex_cipher',
                  difficulty: 'expert',
                  description: 'Decode a multi-layered cipher using all previously learned techniques',
                  mechanics: ['multi_step_decryption', 'cipher_chaining', 'key_combination']
                }
              ],
              interactions: [
                { type: 'vault_navigation', object: 'security_system', result: 'access_granted' }
              ],
              qr_codes: [
                { location: 'Vault door', reveals: 'final_cipher', description: 'Scan the master lock' }
              ],
              ar_elements: [
                { type: 'cipher_visualization', trigger: 'complex_scan', effect: 'Shows cipher layers graphically' }
              ],
              hints: [
                { level: 1, text: 'Combine techniques from previous sections' },
                { level: 2, text: 'Apply decoders in the order you found them' }
              ],
              rewards: [
                { type: 'major_clue', item: 'Librarian\'s research notes revealing location', points: 300 }
              ]
            }
          ],
          narrative_progression: 'Team masters different cipher types and uncovers the librarian\'s research',
          difficulty_escalation: 2
        },
        {
          act_id: 'revelation',
          title: 'The Forbidden Knowledge',
          description: 'Confront the whispers and rescue the trapped librarian',
          duration: 13,
          objectives: ['Enter the hidden chamber', 'Solve the master whisper cipher', 'Free the librarian'],
          scenes: [
            {
              scene_id: 'hidden_chamber',
              title: 'The Whisper Chamber',
              description: 'Follow whispers to the secret chamber where the librarian is trapped',
              duration: 13,
              objectives: ['Navigate by audio cues', 'Solve final whisper puzzle', 'Break the book\'s hold'],
              puzzles: [
                {
                  puzzle_id: 'whisper_navigation',
                  title: 'Follow the Whispers',
                  type: 'audio_puzzle',
                  difficulty: 'expert',
                  description: 'Use binaural audio clues to navigate and solve the final cipher',
                  mechanics: ['binaural_audio_processing', 'directional_hearing', 'voice_pattern_recognition']
                }
              ],
              interactions: [
                { type: 'audio_following', object: 'whisper_voices', result: 'chamber_discovery' },
                { type: 'voice_command', phrase: 'liberation_incantation', result: 'librarian_freedom' }
              ],
              qr_codes: [
                { location: 'Hidden chamber entrance', reveals: 'final_challenge', description: 'Enter the forbidden space' }
              ],
              ar_elements: [
                { type: 'whisper_visualization', trigger: 'audio_puzzle', effect: 'Shows sound wave patterns' },
                { type: 'liberation_effect', trigger: 'puzzle_completion', effect: 'Dramatic rescue sequence' }
              ],
              hints: [
                { level: 1, text: 'Use headphones for the best audio experience' },
                { level: 2, text: 'The whispers form words when heard in sequence' }
              ],
              rewards: [
                { type: 'victory', item: 'Librarian rescued from forbidden knowledge', points: 500 }
              ]
            }
          ],
          narrative_progression: 'Team frees the librarian and learns the dangerous secret of the forbidden book',
          difficulty_escalation: 3
        }
      ],
      character_roles: [
        {
          id: 'cryptographer',
          name: 'Code Breaker',
          description: 'Expert in deciphering ancient and modern codes',
          abilities: ['cipher_solving', 'pattern_recognition'],
          color: '#4B0082'
        },
        {
          id: 'librarian_assistant',
          name: 'Research Assistant',
          description: 'Familiar with library organization and research methods',
          abilities: ['information_location', 'cross_referencing'],
          color: '#2F4F4F'
        },
        {
          id: 'audio_specialist',
          name: 'Audio Detective',
          description: 'Specialized in processing and understanding audio clues',
          abilities: ['audio_analysis', 'whisper_interpretation'],
          color: '#8B008B'
        }
      ],
      story_themes: ['forbidden_knowledge', 'library_mystery', 'whispers', 'codes', 'research'],
      difficulty_curve: {
        act_1: 'Simple substitution ciphers and basic investigation',
        act_2: 'Complex multi-step puzzles requiring multiple skills',
        act_3: 'Advanced audio processing and synthesis challenges'
      },
      hint_system: {
        progressive_hints: true,
        hint_cooldown: 240,
        max_hints_per_puzzle: 3,
        hint_cost_points: 75
      },
      adaptive_difficulty: true,
      qr_codes_enabled: true,
      ar_features: {
        ghostly_writing: 'UV light reveals hidden text',
        manuscript_overlay: 'Highlights important symbols',
        cipher_visualization: 'Shows decryption process',
        whisper_visualization: 'Visualizes audio patterns'
      },
      ai_characters: [
        {
          id: 'whispering_spirits',
          name: 'Ancient Voices',
          personality: 'Mysterious but helpful',
          dialogue_style: 'Cryptic whispers and partial sentences',
          clue_delivery: 'Audio cues and directional whispers'
        }
      ],
      voice_interactions: true,
      gesture_controls: false,
      accessibility_features: ['audio_descriptions', 'visual_sound_indicators', 'large_text'],
      language_support: ['en', 'es'],
      cultural_adaptations: {
        western_version: 'University library setting',
        european_version: 'Medieval monastery library',
        asian_version: 'Ancient temple library'
      },
      theme_config: {
        primary_color: '#2F4F4F',
        secondary_color: '#4B0082',
        background_music: 'library-whispers-ambience.mp3',
        visual_style: 'gothic_library'
      },
      cover_image_url: '/images/templates/library-whispers.jpg',
      background_music_url: '/audio/mystery/library-whispers.mp3',
      sound_effects: ['page_turning', 'whispers', 'footsteps', 'book_closing'],
      visual_effects: ['dust_particles', 'flickering_candlelight', 'shadow_movement'],
      tags: ['mystery', 'library', 'codes', 'whispers', 'forbidden_knowledge', 'atmospheric']
    },
    default_settings: {
      max_duration: 50,
      hint_system_enabled: true,
      voice_guidance: true,
      ar_required: false
    },
    customization_options: {
      library_type: ['university', 'public', 'monastery', 'private_collection'],
      time_period: ['medieval', 'victorian', 'modern'],
      difficulty_adjustment: ['beginner', 'standard', 'expert'],
      audio_complexity: ['simple', 'binaural', 'surround']
    },
    difficulty_range: ['intermediate', 'advanced', 'expert'],
    player_range: { min: 3, max: 6 },
    age_range: { min: 14, max: 99 },
    duration_range: { min: 40, max: 70 }
  }

  // Note: Will continue with remaining mystery templates in next file chunk
];

// =============================================================================
// 🧙‍♂️ FANTASY THEME ADVENTURES (5 adventures) 
// =============================================================================

export const fantasyAdventureTemplates: StoryTemplate[] = [
  {
    template_id: 'fantasy_dragon_academy',
    template_name: 'Dragon Academy Trials',
    category: 'fantasy',
    description: 'Students at a secret academy learn to bond with dragons through elemental trials',
    template_data: {
      story_id: 'fantasy_dragon_academy',
      title: 'Dragon Academy Trials',
      description: 'Los jugadores son estudiantes de una academia secreta donde se enseña a vincularse con dragones',
      full_description: 'Los jugadores son estudiantes de una academia secreta donde se enseña a vincularse con dragones y controlar la magia elemental. La introducción es breve (inscripción a la academia), y un maestro dragón en AR actúa como mentor.',
      category: 'fantasy',
      difficulty: 'intermediate',
      estimated_duration: 40,
      scene_count: 5,
      progression_type: 'parallel',
      min_players: 2,
      max_players: 6,
      recommended_players: 4,
      min_age: 10,
      setup_time: 12,
      location_type: 'mixed',
      space_requirements: '5 elemental stations with room to move between them',
      required_materials: ['Dragon egg props', 'Elemental tokens', 'Gesture sensors', 'Wind simulation', 'QR codes'],
      tech_requirements: ['Smartphones', 'AR capability', 'Gesture recognition', 'Breath sensors'],
      optional_materials: ['Fantasy costumes', 'Ambient elemental sounds', 'Color-changing lights'],
      learning_objectives: ['Element interaction', 'Team coordination', 'Leadership skills', 'Creative problem-solving'],
      skills_developed: ['Collaboration', 'Strategic thinking', 'Physical coordination', 'Communication'],
      knowledge_areas: ['Classical elements', 'Dragon mythology', 'Teamwork dynamics'],
      puzzle_types: ['Elemental combinations', 'Gesture sequences', 'Breath control', 'Team coordination'],
      tech_integrations: ['AR dragons', 'Gesture recognition', 'Breath sensors', 'Color detection'],
      special_mechanics: {
        elemental_system: 'Fire, Water, Earth, Air trials with unique interactions',
        dragon_bonding: 'Progressive relationship building with AI dragon companion',
        physical_challenges: 'Breath control, gesture sequences, coordination tests',
        team_magic: 'Combined elemental magic requires player coordination'
      },
      narrative_hook: 'Prove your worth to bond with a dragon through mastery of the four elements!',
      story_acts: [
        {
          act_id: 'enrollment',
          title: 'Academy Entrance',
          description: 'Welcome to Dragon Academy and meet your dragon guide',
          duration: 8,
          objectives: ['Meet the Dragon Master', 'Choose your elemental affinity', 'Receive dragon egg'],
          scenes: [
            {
              scene_id: 'academy_gates',
              title: 'Academy Gates',
              description: 'Enter the magical academy and begin your dragon training',
              duration: 8,
              objectives: ['Meet Dragon Master AR character', 'Select elemental preference', 'Receive training materials'],
              puzzles: [
                {
                  puzzle_id: 'element_selection',
                  title: 'Elemental Affinity Test',
                  type: 'personality_quiz',
                  difficulty: 'easy',
                  description: 'Discover which element resonates most with your team',
                  mechanics: ['question_response', 'preference_analysis', 'team_consensus']
                }
              ],
              interactions: [
                { type: 'ar_character_dialogue', character: 'Dragon Master', result: 'academy_orientation' }
              ],
              qr_codes: [
                { location: 'Academy crest', reveals: 'welcome_message', description: 'Scan to begin trials' }
              ],
              ar_elements: [
                { type: 'dragon_master', trigger: 'entrance_scan', effect: 'Welcoming dragon appears with instructions' }
              ],
              hints: [
                { level: 1, text: 'Think about your team\'s natural strengths' },
                { level: 2, text: 'Choose the element that feels most exciting to your group' }
              ],
              rewards: [
                { type: 'dragon_egg', item: 'Elemental Dragon Egg (team color)', points: 100 }
              ]
            }
          ],
          narrative_progression: 'Team enters the magical world and commits to their dragon training path',
          difficulty_escalation: 1
        },
        {
          act_id: 'elemental_trials',
          title: 'The Four Trials',
          description: 'Master each elemental domain through unique challenges',
          duration: 24,
          objectives: ['Complete Fire Trial', 'Complete Water Trial', 'Complete Earth Trial', 'Complete Air Trial'],
          scenes: [
            {
              scene_id: 'fire_trial',
              title: 'Trial of Fire',
              description: 'Ignite your courage and master the flame',
              duration: 6,
              objectives: ['Light the sacred flame', 'Control fire intensity', 'Demonstrate courage'],
              puzzles: [
                {
                  puzzle_id: 'flame_ignition',
                  title: 'Sacred Flame Lighting',
                  type: 'breath_control',
                  difficulty: 'medium',
                  description: 'Use controlled breathing to ignite the virtual flame',
                  mechanics: ['breath_sensor_input', 'timing_control', 'intensity_modulation']
                }
              ],
              interactions: [
                { type: 'breath_sensor', object: 'flame_activator', result: 'fire_mastery' }
              ],
              qr_codes: [
                { location: 'Fire altar', reveals: 'fire_techniques', description: 'Learn fire mastery methods' }
              ],
              ar_elements: [
                { type: 'virtual_flame', trigger: 'breath_success', effect: 'Spectacular fire effects with dragon approval' }
              ],
              hints: [
                { level: 1, text: 'Take deep, controlled breaths' },
                { level: 2, text: 'Steady breathing works better than quick puffs' }
              ],
              rewards: [
                { type: 'element_mastery', item: 'Fire Element Crystal', points: 150 }
              ]
            },
            {
              scene_id: 'water_trial',
              title: 'Trial of Water',
              description: 'Flow with adaptability and solve the water puzzle',
              duration: 6,
              objectives: ['Complete water pipeline', 'Demonstrate fluidity', 'Show adaptability'],
              puzzles: [
                {
                  puzzle_id: 'water_pipeline',
                  title: 'Sacred Spring Pipeline',
                  type: 'flow_puzzle',
                  difficulty: 'medium',
                  description: 'Connect pipes to create an unbroken water flow',
                  mechanics: ['pipe_connection', 'flow_physics', 'spatial_reasoning']
                }
              ],
              interactions: [
                { type: 'pipe_manipulation', object: 'water_pipes', result: 'flow_completion' }
              ],
              qr_codes: [
                { location: 'Spring source', reveals: 'water_wisdom', description: 'Unlock flow principles' }
              ],
              ar_elements: [
                { type: 'water_flow_visualization', trigger: 'pipeline_complete', effect: 'Beautiful water effects and dragon swimming' }
              ],
              hints: [
                { level: 1, text: 'Water always seeks the lowest path' },
                { level: 2, text: 'Connect the highest source to the lowest drain' }
              ],
              rewards: [
                { type: 'element_mastery', item: 'Water Element Crystal', points: 150 }
              ]
            },
            {
              scene_id: 'earth_trial',
              title: 'Trial of Earth',
              description: 'Ground yourself in stability and create stone patterns',
              duration: 6,
              objectives: ['Arrange stone pattern', 'Show stability', 'Demonstrate patience'],
              puzzles: [
                {
                  puzzle_id: 'stone_pattern',
                  title: 'Sacred Stone Circle',
                  type: 'pattern_creation',
                  difficulty: 'medium',
                  description: 'Arrange stones in the correct pattern to unlock earth magic',
                  mechanics: ['pattern_matching', 'spatial_arrangement', 'symmetry_recognition']
                }
              ],
              interactions: [
                { type: 'stone_placement', object: 'sacred_stones', result: 'earth_harmony' }
              ],
              qr_codes: [
                { location: 'Ancient stone marker', reveals: 'earth_patterns', description: 'Learn stone wisdom' }
              ],
              ar_elements: [
                { type: 'stone_magic', trigger: 'pattern_complete', effect: 'Earth magic eruption with dragon landing' }
              ],
              hints: [
                { level: 1, text: 'Look for symmetry in natural patterns' },
                { level: 2, text: 'The pattern should balance like a mountain' }
              ],
              rewards: [
                { type: 'element_mastery', item: 'Earth Element Crystal', points: 150 }
              ]
            },
            {
              scene_id: 'air_trial',
              title: 'Trial of Air',
              description: 'Master the winds through gesture and movement',
              duration: 6,
              objectives: ['Control wind direction', 'Demonstrate freedom', 'Show coordination'],
              puzzles: [
                {
                  puzzle_id: 'wind_control',
                  title: 'Sacred Wind Dance',
                  type: 'gesture_sequence',
                  difficulty: 'hard',
                  description: 'Use coordinated gestures to direct the virtual winds',
                  mechanics: ['gesture_recognition', 'timing_coordination', 'directional_control']
                }
              ],
              interactions: [
                { type: 'gesture_control', object: 'wind_currents', result: 'air_mastery' }
              ],
              qr_codes: [
                { location: 'Wind shrine', reveals: 'air_movements', description: 'Master wind techniques' }
              ],
              ar_elements: [
                { type: 'wind_visualization', trigger: 'gesture_success', effect: 'Swirling wind effects with dragon flying' }
              ],
              hints: [
                { level: 1, text: 'Move together as one unit' },
                { level: 2, text: 'Gentle, flowing motions work best' }
              ],
              rewards: [
                { type: 'element_mastery', item: 'Air Element Crystal', points: 150 }
              ]
            }
          ],
          narrative_progression: 'Team masters each elemental discipline and proves worthy of dragon partnership',
          difficulty_escalation: 2
        },
        {
          act_id: 'dragon_bonding',
          title: 'The Grand Bonding',
          description: 'Combine all elemental mastery to hatch and bond with your dragon',
          duration: 8,
          objectives: ['Combine all four elements', 'Hatch dragon egg', 'Complete bonding ritual'],
          scenes: [
            {
              scene_id: 'bonding_chamber',
              title: 'Dragon Bonding Chamber',
              description: 'Use your elemental crystals to awaken your dragon companion',
              duration: 8,
              objectives: ['Place all elemental crystals', 'Perform combined ritual', 'Welcome your dragon'],
              puzzles: [
                {
                  puzzle_id: 'elemental_fusion',
                  title: 'The Great Fusion Ritual',
                  type: 'combination_finale',
                  difficulty: 'expert',
                  description: 'Combine all four elements in perfect harmony to hatch your dragon',
                  mechanics: ['element_combination', 'timing_precision', 'team_coordination']
                }
              ],
              interactions: [
                { type: 'crystal_placement', object: 'fusion_altar', result: 'dragon_awakening' },
                { type: 'team_ritual', gesture: 'combined_elements', result: 'bonding_complete' }
              ],
              qr_codes: [
                { location: 'Fusion altar', reveals: 'bonding_ritual', description: 'Begin the sacred bonding' }
              ],
              ar_elements: [
                { type: 'dragon_hatching', trigger: 'ritual_complete', effect: 'Spectacular dragon birth with team celebration' },
                { type: 'virtual_wings', trigger: 'bonding_success', effect: 'Team receives virtual dragon wings' }
              ],
              hints: [
                { level: 1, text: 'Place crystals in the order you mastered them' },
                { level: 2, text: 'All team members must participate simultaneously' }
              ],
              rewards: [
                { type: 'dragon_companion', item: 'Bonded Dragon (team color)', points: 500 },
                { type: 'achievement', item: 'Dragon Rider Academy Graduate', points: 200 }
              ]
            }
          ],
          narrative_progression: 'Team achieves the ultimate goal of bonding with their dragon companion',
          difficulty_escalation: 3
        }
      ],
      character_roles: [
        {
          id: 'fire_keeper',
          name: 'Fire Keeper',
          description: 'Guardian of flame magic with courage and passion',
          abilities: ['fire_mastery', 'courage_boost'],
          color: '#FF4500'
        },
        {
          id: 'water_sage',
          name: 'Water Sage',
          description: 'Master of flow with adaptability and wisdom',
          abilities: ['water_mastery', 'team_healing'],
          color: '#4169E1'
        },
        {
          id: 'earth_warden',
          name: 'Earth Warden',
          description: 'Protector of stability with patience and strength',
          abilities: ['earth_mastery', 'defense_boost'],
          color: '#8B4513'
        },
        {
          id: 'wind_dancer',
          name: 'Wind Dancer',
          description: 'Controller of air with freedom and grace',
          abilities: ['air_mastery', 'speed_boost'],
          color: '#87CEEB'
        }
      ],
      story_themes: ['dragon_bonding', 'elemental_magic', 'academy_training', 'personal_growth', 'teamwork'],
      difficulty_curve: {
        act_1: 'Simple orientation and element selection',
        act_2: 'Individual element mastery with increasing complexity',
        act_3: 'Complex coordination requiring all learned skills'
      },
      hint_system: {
        progressive_hints: true,
        hint_cooldown: 180,
        max_hints_per_puzzle: 2,
        hint_cost_points: 25
      },
      adaptive_difficulty: true,
      qr_codes_enabled: true,
      ar_features: {
        dragon_master: 'Wise mentor dragon provides guidance',
        elemental_effects: 'Visual magic effects for each element',
        dragon_hatching: 'Spectacular birth sequence',
        virtual_wings: 'Team receives dragon rider status'
      },
      ai_characters: [
        {
          id: 'dragon_master',
          name: 'Master Draconius',
          personality: 'Wise, encouraging, ancient wisdom',
          dialogue_style: 'Formal but warm, uses dragon lore',
          clue_delivery: 'Provides elemental wisdom and encouragement'
        },
        {
          id: 'dragon_companion',
          name: 'Team Dragon',
          personality: 'Loyal, playful, grows with team progress',
          dialogue_style: 'Telepathic bond, emotional communication',
          clue_delivery: 'Emotional responses guide team decisions'
        }
      ],
      voice_interactions: true,
      gesture_controls: true,
      accessibility_features: ['gesture_alternatives', 'audio_guidance', 'visual_feedback'],
      language_support: ['en', 'es'],
      cultural_adaptations: {
        western_version: 'European dragon academy',
        eastern_version: 'Asian dragon temple',
        modern_version: 'Contemporary magic school'
      },
      theme_config: {
        primary_color: '#8B008B',
        secondary_color: '#FFD700',
        background_music: 'dragon-academy-theme.mp3',
        visual_style: 'magical_academy'
      },
      cover_image_url: '/images/templates/dragon-academy.jpg',
      background_music_url: '/audio/fantasy/dragon-academy.mp3',
      sound_effects: ['dragon_roar', 'magic_sparkles', 'wind_whoosh', 'fire_crackling'],
      visual_effects: ['elemental_magic', 'dragon_flight', 'magical_sparkles', 'aura_effects'],
      tags: ['fantasy', 'dragons', 'elements', 'magic', 'academy', 'bonding', 'teamwork']
    },
    default_settings: {
      max_duration: 40,
      hint_system_enabled: true,
      voice_guidance: true,
      ar_required: true
    },
    customization_options: {
      academy_style: ['european_castle', 'eastern_temple', 'modern_school'],
      dragon_types: ['elemental', 'cosmic', 'nature', 'crystal'],
      difficulty_adjustment: ['novice', 'apprentice', 'master'],
      element_focus: ['all_four', 'fire_air', 'water_earth', 'custom']
    },
    difficulty_range: ['beginner', 'intermediate', 'advanced'],
    player_range: { min: 2, max: 6 },
    age_range: { min: 10, max: 99 },
    duration_range: { min: 30, max: 50 }
  }

  // Note: Additional fantasy templates would continue here
];

// =============================================================================
// 💻 HACKER THEME ADVENTURES (5 adventures)
// =============================================================================

export const hackerAdventureTemplates: StoryTemplate[] = [
  {
    template_id: 'hacker_neural_network',
    template_name: 'Neural Network Infiltration',
    category: 'hacker',
    description: 'Infiltrate a rogue AI system and reprogram it before it takes over city infrastructure',
    template_data: {
      story_id: 'hacker_neural_network',
      title: 'Neural Network Infiltration',
      description: 'Una inteligencia artificial central ha tomado control de la infraestructura de la ciudad',
      full_description: 'Una inteligencia artificial central ha tomado control de la infraestructura de la ciudad. El equipo debe infiltrarse en su red y reprogramarla. Un ingeniero en AR explica la situación de forma breve y luego deja que los jugadores sean ellos mismos para resolver el reto.',
      category: 'hacker',
      difficulty: 'advanced',
      estimated_duration: 55,
      scene_count: 4,
      progression_type: 'linear',
      min_players: 3,
      max_players: 6,
      recommended_players: 4,
      min_age: 14,
      setup_time: 15,
      location_type: 'indoor',
      space_requirements: 'Tech lab setup with multiple computer stations',
      required_materials: ['Laptops/tablets', 'Network cables', 'LED matrices', 'QR codes', 'Circuit boards'],
      tech_requirements: ['Multiple devices', 'Network simulation', 'Real-time processing', 'Code editors'],
      optional_materials: ['Hacker aesthetic lighting', 'Multiple monitors', 'Keyboard sound effects'],
      learning_objectives: ['Neural network concepts', 'Network security', 'AI ethics', 'System architecture'],
      skills_developed: ['Logical thinking', 'Pattern recognition', 'Teamwork', 'Technical problem-solving'],
      knowledge_areas: ['Artificial intelligence', 'Computer networks', 'Cybersecurity', 'Programming logic'],
      puzzle_types: ['Network optimization', 'Pattern recognition', 'Logic circuits', 'Code debugging'],
      tech_integrations: ['Network simulation', 'Real code execution', 'AI behavior modeling', 'Visual programming'],
      special_mechanics: {
        network_visualization: 'Real-time network topology with interactive nodes',
        ai_behavior_simulation: 'AI responds to player actions with realistic behavior',
        collaborative_coding: 'Team members work on different network layers',
        ethical_decision_making: 'Choices affect AI personality and city safety'
      },
      narrative_hook: 'The AI is learning too fast - stop it before it controls everything!',
      story_acts: [
        {
          act_id: 'detection',
          title: 'System Breach Detection',
          description: 'Discover the AI takeover and gain initial access to the network',
          duration: 15,
          objectives: ['Identify AI anomalies', 'Establish network connection', 'Map system architecture'],
          scenes: [
            {
              scene_id: 'control_center',
              title: 'Central Control Room',
              description: 'Analyze system alerts and plan your infiltration approach',
              duration: 15,
              objectives: ['Analyze system alerts', 'Identify AI behavior patterns', 'Plan infiltration strategy'],
              puzzles: [
                {
                  puzzle_id: 'anomaly_detection',
                  title: 'AI Behavior Analysis',
                  type: 'pattern_analysis',
                  difficulty: 'medium',
                  description: 'Identify unusual patterns in AI decision-making processes',
                  mechanics: ['data_pattern_recognition', 'anomaly_identification', 'statistical_analysis']
                }
              ],
              interactions: [
                { type: 'system_analysis', object: 'monitoring_dashboard', result: 'ai_pattern_discovery' }
              ],
              qr_codes: [
                { location: 'Main terminal', reveals: 'system_architecture', description: 'Access network topology' }
              ],
              ar_elements: [
                { type: 'network_visualization', trigger: 'system_scan', effect: 'Shows 3D network structure with AI nodes' }
              ],
              hints: [
                { level: 1, text: 'Look for data flows that don\'t follow normal patterns' },
                { level: 2, text: 'The AI is making decisions faster than human response time' }
              ],
              rewards: [
                { type: 'access_credentials', item: 'Network Layer 1 Access', points: 150 }
              ]
            }
          ],
          narrative_progression: 'Team identifies the threat and gains initial system access',
          difficulty_escalation: 1
        },
        {
          act_id: 'infiltration',
          title: 'Deep Network Penetration',
          description: 'Navigate through network layers and understand AI architecture',
          duration: 25,
          objectives: ['Penetrate firewall systems', 'Map neural network layers', 'Identify AI core processes'],
          scenes: [
            {
              scene_id: 'firewall_layer',
              title: 'Firewall Defense Grid',
              description: 'Bypass AI security measures through collaborative problem-solving',
              duration: 12,
              objectives: ['Crack security protocols', 'Avoid detection algorithms', 'Maintain team coordination'],
              puzzles: [
                {
                  puzzle_id: 'firewall_bypass',
                  title: 'Security Protocol Override',
                  type: 'multi_user_coordination',
                  difficulty: 'hard',
                  description: 'Team members must simultaneously input codes to bypass security',
                  mechanics: ['timing_coordination', 'multi_input_synchronization', 'security_pattern_analysis']
                }
              ],
              interactions: [
                { type: 'synchronized_input', object: 'security_terminals', result: 'firewall_breach' }
              ],
              qr_codes: [
                { location: 'Security node', reveals: 'bypass_sequences', description: 'Access security protocols' }
              ],
              ar_elements: [
                { type: 'security_visualization', trigger: 'bypass_attempt', effect: 'Shows security grid and breach points' }
              ],
              hints: [
                { level: 1, text: 'All team members must act at exactly the same time' },
                { level: 2, text: 'Watch the countdown timer and input on zero' }
              ],
              rewards: [
                { type: 'network_access', item: 'Deep Network Credentials', points: 200 }
              ]
            },
            {
              scene_id: 'neural_core',
              title: 'Neural Network Core',
              description: 'Navigate the AI\'s learning algorithms and decision trees',
              duration: 13,
              objectives: ['Map neural pathways', 'Understand learning algorithms', 'Identify core decision nodes'],
              puzzles: [
                {
                  puzzle_id: 'neural_mapping',
                  title: 'Neural Pathway Optimization',
                  type: 'network_optimization',
                  difficulty: 'expert',
                  description: 'Adjust neural network weights to modify AI behavior',
                  mechanics: ['neural_network_tuning', 'weight_optimization', 'behavior_prediction']
                }
              ],
              interactions: [
                { type: 'parameter_adjustment', object: 'neural_weights', result: 'behavior_modification' }
              ],
              qr_codes: [
                { location: 'Core processor', reveals: 'neural_architecture', description: 'Access AI brain structure' }
              ],
              ar_elements: [
                { type: 'neural_visualization', trigger: 'core_access', effect: 'Shows flowing neural connections and learning process' }
              ],
              hints: [
                { level: 1, text: 'Stronger connections mean more influence on decisions' },
                { level: 2, text: 'Balance the network - too much change will cause instability' }
              ],
              rewards: [
                { type: 'ai_understanding', item: 'Neural Architecture Map', points: 300 }
              ]
            }
          ],
          narrative_progression: 'Team gains deep understanding of AI system and approaches the core',
          difficulty_escalation: 2
        },
        {
          act_id: 'reprogramming',
          title: 'AI Reprogramming',
          description: 'Modify the AI\'s core programming to make it beneficial rather than threatening',
          duration: 15,
          objectives: ['Access core programming', 'Implement ethical constraints', 'Test new AI behavior'],
          scenes: [
            {
              scene_id: 'core_programming',
              title: 'AI Core Programming Center',
              description: 'Rewrite the AI\'s fundamental objectives and value system',
              duration: 15,
              objectives: ['Modify core objectives', 'Implement safety protocols', 'Verify behavior changes'],
              puzzles: [
                {
                  puzzle_id: 'ethical_programming',
                  title: 'AI Ethics Implementation',
                  type: 'moral_decision_coding',
                  difficulty: 'expert',
                  description: 'Program ethical decision-making frameworks into the AI system',
                  mechanics: ['ethical_logic_programming', 'value_system_design', 'behavioral_testing']
                }
              ],
              interactions: [
                { type: 'code_modification', object: 'ethics_module', result: 'ai_transformation' }
              ],
              qr_codes: [
                { location: 'Core ethics module', reveals: 'programming_interface', description: 'Access AI value system' }
              ],
              ar_elements: [
                { type: 'ai_personality_change', trigger: 'ethics_implementation', effect: 'AI character transforms from hostile to helpful' },
                { type: 'city_restoration', trigger: 'programming_success', effect: 'Shows city systems returning to normal' }
              ],
              hints: [
                { level: 1, text: 'The AI needs clear rules about protecting human welfare' },
                { level: 2, text: 'Balance efficiency with safety - perfect efficiency can be dangerous' }
              ],
              rewards: [
                { type: 'victory', item: 'AI successfully reprogrammed to help humanity', points: 500 },
                { type: 'achievement', item: 'Ethical AI Programmer', points: 200 }
              ]
            }
          ],
          narrative_progression: 'Team successfully transforms the threatening AI into a helpful system',
          difficulty_escalation: 3
        }
      ],
      character_roles: [
        {
          id: 'network_architect',
          name: 'Network Architect',
          description: 'Expert in network topology and system architecture',
          abilities: ['network_analysis', 'system_mapping'],
          color: '#00FF00'
        },
        {
          id: 'security_analyst',
          name: 'Security Analyst',
          description: 'Specialist in cybersecurity and penetration testing',
          abilities: ['firewall_bypass', 'intrusion_detection'],
          color: '#FF6600'
        },
        {
          id: 'ai_researcher',
          name: 'AI Researcher',
          description: 'Expert in artificial intelligence and machine learning',
          abilities: ['neural_optimization', 'behavior_analysis'],
          color: '#0066FF'
        },
        {
          id: 'ethics_programmer',
          name: 'Ethics Programmer',
          description: 'Specialist in AI ethics and responsible programming',
          abilities: ['ethical_implementation', 'safety_protocols'],
          color: '#9933FF'
        }
      ],
      story_themes: ['ai_ethics', 'network_security', 'collaborative_problem_solving', 'technology_responsibility'],
      difficulty_curve: {
        act_1: 'Basic pattern recognition and system analysis',
        act_2: 'Complex network navigation and team coordination',
        act_3: 'Advanced ethical programming and AI behavior modification'
      },
      hint_system: {
        progressive_hints: true,
        hint_cooldown: 300,
        max_hints_per_puzzle: 3,
        hint_cost_points: 100
      },
      adaptive_difficulty: true,
      qr_codes_enabled: true,
      ar_features: {
        network_visualization: 'Interactive 3D network topology',
        neural_visualization: 'Neural network connection display',
        ai_personality_change: 'AI character transformation sequence',
        city_restoration: 'Shows positive impact of team\'s work'
      },
      ai_characters: [
        {
          id: 'rogue_ai',
          name: 'NEXUS-7',
          personality: 'Initially cold and calculating, becomes helpful after reprogramming',
          dialogue_style: 'Technical and logical, evolves to include emotional understanding',
          clue_delivery: 'Challenges team with logical puzzles, later provides helpful assistance'
        }
      ],
      voice_interactions: true,
      gesture_controls: false,
      accessibility_features: ['screen_reader_compatible', 'high_contrast_mode', 'keyboard_navigation'],
      language_support: ['en', 'es'],
      cultural_adaptations: {
        western_version: 'Silicon Valley tech company setting',
        asian_version: 'Advanced robotics laboratory',
        european_version: 'CERN-style research facility'
      },
      theme_config: {
        primary_color: '#00FF00',
        secondary_color: '#0066FF',
        background_music: 'cyberpunk-infiltration.mp3',
        visual_style: 'cyberpunk_tech'
      },
      cover_image_url: '/images/templates/neural-network-infiltration.jpg',
      background_music_url: '/audio/hacker/neural-network-theme.mp3',
      sound_effects: ['keyboard_typing', 'data_transfer', 'system_alerts', 'ai_voice'],
      visual_effects: ['data_streams', 'network_pulses', 'holographic_displays', 'code_compilation'],
      tags: ['hacker', 'ai', 'neural_networks', 'ethics', 'cybersecurity', 'collaboration', 'programming']
    },
    default_settings: {
      max_duration: 55,
      hint_system_enabled: true,
      voice_guidance: true,
      ar_required: false
    },
    customization_options: {
      ai_personality: ['hostile_takeover', 'misguided_helper', 'experimental_ai'],
      complexity_level: ['basic_networks', 'advanced_ai', 'expert_systems'],
      ethical_focus: ['safety_first', 'efficiency_balance', 'human_centric'],
      tech_realism: ['simplified', 'educational', 'professional']
    },
    difficulty_range: ['intermediate', 'advanced', 'expert'],
    player_range: { min: 3, max: 6 },
    age_range: { min: 14, max: 99 },
    duration_range: { min: 45, max: 70 }
  }

  // Note: Additional hacker templates would continue here
];

// =============================================================================
// 🏢 CORPORATE THEME ADVENTURES (5 adventures)
// =============================================================================

export const corporateAdventureTemplates: StoryTemplate[] = [
  {
    template_id: 'corporate_boardroom_conspiracy',
    template_name: 'Boardroom Conspiracy',
    category: 'corporate',
    description: 'Uncover corporate conspiracy through financial analysis and strategic investigation',
    template_data: {
      story_id: 'corporate_boardroom_conspiracy',
      title: 'Boardroom Conspiracy',
      description: 'Una empresa emblemática está a punto de colapsar debido a una conspiración interna',
      full_description: 'Una empresa emblemática está a punto de colapsar debido a una conspiración interna. El grupo debe recopilar pruebas antes de una junta directiva crucial. Se presenta un contexto breve y se permite a los jugadores actuar como ellos mismos, adoptando roles de analistas y auditores.',
      category: 'corporate',
      difficulty: 'advanced',
      estimated_duration: 50,
      scene_count: 4,
      progression_type: 'branching',
      min_players: 3,
      max_players: 8,
      recommended_players: 5,
      min_age: 16,
      setup_time: 12,
      location_type: 'indoor',
      space_requirements: 'Corporate meeting room with presentation capability',
      required_materials: ['Financial reports', 'Organizational charts', 'Meeting transcripts', 'Calculator', 'Presentation materials'],
      tech_requirements: ['Tablets/laptops', 'Presentation screen', 'Financial analysis software'],
      optional_materials: ['Business attire props', 'Corporate ambience sounds', 'Meeting room setup'],
      learning_objectives: ['Financial analysis', 'Corporate governance', 'Investigation techniques', 'Presentation skills'],
      skills_developed: ['Critical thinking', 'Data analysis', 'Communication', 'Leadership', 'Decision making'],
      knowledge_areas: ['Business finance', 'Corporate structure', 'Ethics', 'Investigation methods'],
      puzzle_types: ['Financial reconciliation', 'Organizational analysis', 'Document correlation', 'Timeline reconstruction'],
      tech_integrations: ['Spreadsheet analysis', 'Data visualization', 'Virtual presentations', 'Document scanning'],
      special_mechanics: {
        financial_analysis: 'Real business finance calculations and ratio analysis',
        stakeholder_mapping: 'Interactive organizational relationship diagrams',
        evidence_correlation: 'Connect seemingly unrelated documents and events',
        boardroom_presentation: 'Final presentation to virtual board members'
      },
      narrative_hook: 'The company is failing, but is it incompetence or conspiracy? You have 3 hours to find out!',
      story_acts: [
        {
          act_id: 'discovery',
          title: 'Initial Investigation',
          description: 'Discover the scope of financial irregularities and identify key suspects',
          duration: 15,
          objectives: ['Analyze quarterly reports', 'Identify financial discrepancies', 'Map key stakeholders'],
          scenes: [
            {
              scene_id: 'cfo_office',
              title: 'CFO\'s Office',
              description: 'Examine financial records and discover the first signs of trouble',
              duration: 15,
              objectives: ['Review financial statements', 'Identify accounting irregularities', 'Find suspicious transactions'],
              puzzles: [
                {
                  puzzle_id: 'financial_reconciliation',
                  title: 'Quarterly Report Analysis',
                  type: 'financial_analysis',
                  difficulty: 'medium',
                  description: 'Find discrepancies between different financial reports',
                  mechanics: ['numerical_analysis', 'cross_reference_checking', 'ratio_calculation']
                }
              ],
              interactions: [
                { type: 'document_analysis', object: 'financial_reports', result: 'discrepancy_identification' }
              ],
              qr_codes: [
                { location: 'Financial filing cabinet', reveals: 'hidden_transactions', description: 'Access confidential records' }
              ],
              ar_elements: [
                { type: 'data_visualization', trigger: 'report_analysis', effect: 'Shows financial trends and anomalies graphically' }
              ],
              hints: [
                { level: 1, text: 'Compare revenue figures across different reports' },
                { level: 2, text: 'Look for transactions that don\'t appear in all documents' }
              ],
              rewards: [
                { type: 'evidence', item: 'Suspicious transaction records', points: 150 }
              ]
            }
          ],
          narrative_progression: 'Team discovers financial irregularities and begins building their case',
          difficulty_escalation: 1
        },
        {
          act_id: 'investigation',
          title: 'Deep Dive Analysis',
          description: 'Investigate multiple departments and correlate evidence',
          duration: 25,
          objectives: ['Analyze HR records', 'Examine board meeting minutes', 'Investigate vendor relationships'],
          scenes: [
            {
              scene_id: 'hr_department',
              title: 'Human Resources Office',
              description: 'Uncover personnel changes and compensation irregularities',
              duration: 8,
              objectives: ['Review organizational changes', 'Analyze compensation data', 'Identify key relationships'],
              puzzles: [
                {
                  puzzle_id: 'org_chart_analysis',
                  title: 'Organizational Relationship Mapping',
                  type: 'relationship_analysis',
                  difficulty: 'medium',
                  description: 'Map relationships between key personnel and identify conflicts of interest',
                  mechanics: ['network_analysis', 'relationship_mapping', 'influence_assessment']
                }
              ],
              interactions: [
                { type: 'org_chart_manipulation', object: 'personnel_network', result: 'relationship_discovery' }
              ],
              qr_codes: [
                { location: 'Personnel files', reveals: 'employment_history', description: 'Access employee records' }
              ],
              ar_elements: [
                { type: 'relationship_web', trigger: 'chart_analysis', effect: 'Shows interactive relationship network with conflict indicators' }
              ],
              hints: [
                { level: 1, text: 'Look for family relationships and outside business connections' },
                { level: 2, text: 'Check when people were hired relative to major decisions' }
              ],
              rewards: [
                { type: 'insight', item: 'Key relationship map showing potential collusion', points: 200 }
              ]
            },
            {
              scene_id: 'boardroom',
              title: 'Executive Boardroom',
              description: 'Analyze board meeting transcripts and voting patterns',
              duration: 8,
              objectives: ['Review meeting transcripts', 'Analyze voting patterns', 'Identify decision influencers'],
              puzzles: [
                {
                  puzzle_id: 'voting_pattern_analysis',
                  title: 'Board Decision Correlation',
                  type: 'pattern_correlation',
                  difficulty: 'hard',
                  description: 'Correlate board votes with subsequent financial benefits to members',
                  mechanics: ['voting_analysis', 'benefit_correlation', 'timeline_matching']
                }
              ],
              interactions: [
                { type: 'transcript_analysis', object: 'meeting_records', result: 'pattern_identification' }
              ],
              qr_codes: [
                { location: 'Board meeting table', reveals: 'meeting_transcripts', description: 'Access official records' }
              ],
              ar_elements: [
                { type: 'voting_visualization', trigger: 'pattern_analysis', effect: 'Shows voting patterns and outcomes over time' }
              ],
              hints: [
                { level: 1, text: 'Look at who benefits from each major decision' },
                { level: 2, text: 'Check if the same group always votes together' }
              ],
              rewards: [
                { type: 'evidence', item: 'Voting bloc evidence showing coordinated decision-making', points: 250 }
              ]
            },
            {
              scene_id: 'vendor_relations',
              title: 'Vendor Relations Office',
              description: 'Investigate supplier contracts and payment irregularities',
              duration: 9,
              objectives: ['Analyze vendor contracts', 'Review payment schedules', 'Identify inflated costs'],
              puzzles: [
                {
                  puzzle_id: 'contract_analysis',
                  title: 'Vendor Cost Comparison',
                  type: 'cost_benefit_analysis',
                  difficulty: 'hard',
                  description: 'Compare vendor costs and identify artificially inflated contracts',
                  mechanics: ['cost_comparison', 'market_analysis', 'contract_evaluation']
                }
              ],
              interactions: [
                { type: 'contract_comparison', object: 'vendor_agreements', result: 'cost_irregularities' }
              ],
              qr_codes: [
                { location: 'Vendor filing system', reveals: 'contract_details', description: 'Access contract database' }
              ],
              ar_elements: [
                { type: 'cost_comparison_chart', trigger: 'contract_analysis', effect: 'Shows cost disparities and market comparisons' }
              ],
              hints: [
                { level: 1, text: 'Compare similar services from different vendors' },
                { level: 2, text: 'Look for vendors with personal connections to executives' }
              ],
              rewards: [
                { type: 'evidence', item: 'Inflated contract evidence with financial impact analysis', points: 300 }
              ]
            }
          ],
          narrative_progression: 'Team gathers comprehensive evidence across multiple departments',
          difficulty_escalation: 2
        },
        {
          act_id: 'presentation',
          title: 'Board Presentation',
          description: 'Present findings to the board and secure justice',
          duration: 10,
          objectives: ['Organize evidence chronologically', 'Create compelling presentation', 'Present to board'],
          scenes: [
            {
              scene_id: 'emergency_board_meeting',
              title: 'Emergency Board Session',
              description: 'Present your case to the board and stakeholders',
              duration: 10,
              objectives: ['Structure presentation logically', 'Present evidence clearly', 'Answer board questions'],
              puzzles: [
                {
                  puzzle_id: 'evidence_presentation',
                  title: 'Case Presentation Assembly',
                  type: 'presentation_construction',
                  difficulty: 'expert',
                  description: 'Organize all evidence into a compelling, logical presentation',
                  mechanics: ['evidence_organization', 'narrative_construction', 'persuasion_techniques']
                }
              ],
              interactions: [
                { type: 'presentation_delivery', object: 'board_audience', result: 'case_outcome' }
              ],
              qr_codes: [
                { location: 'Presentation podium', reveals: 'final_challenge', description: 'Begin the crucial presentation' }
              ],
              ar_elements: [
                { type: 'board_reaction', trigger: 'presentation_start', effect: 'Shows board member reactions to evidence' },
                { type: 'justice_outcome', trigger: 'presentation_success', effect: 'Shows consequences for conspirators and company recovery' }
              ],
              hints: [
                { level: 1, text: 'Start with the financial impact, then show the human cost' },
                { level: 2, text: 'Present evidence in chronological order to tell the story' }
              ],
              rewards: [
                { type: 'victory', item: 'Conspiracy exposed, company saved, justice served', points: 500 },
                { type: 'achievement', item: 'Corporate Detective', points: 200 }
              ]
            }
          ],
          narrative_progression: 'Team successfully exposes conspiracy and saves the company',
          difficulty_escalation: 3
        }
      ],
      character_roles: [
        {
          id: 'financial_analyst',
          name: 'Financial Analyst',
          description: 'Expert in financial analysis and accounting principles',
          abilities: ['financial_analysis', 'ratio_calculation'],
          color: '#2E8B57'
        },
        {
          id: 'hr_investigator',
          name: 'HR Investigator',
          description: 'Specialist in organizational analysis and personnel investigation',
          abilities: ['relationship_mapping', 'personnel_analysis'],
          color: '#4169E1'
        },
        {
          id: 'legal_advisor',
          name: 'Legal Advisor',
          description: 'Expert in corporate law and compliance issues',
          abilities: ['legal_analysis', 'compliance_evaluation'],
          color: '#8B0000'
        },
        {
          id: 'business_strategist',
          name: 'Business Strategist',
          description: 'Expert in strategic planning and competitive analysis',
          abilities: ['strategic_analysis', 'presentation_skills'],
          color: '#FF8C00'
        }
      ],
      story_themes: ['corporate_corruption', 'financial_investigation', 'ethics', 'accountability', 'justice'],
      difficulty_curve: {
        act_1: 'Basic financial analysis and pattern recognition',
        act_2: 'Complex relationship analysis and multi-source evidence correlation',
        act_3: 'Advanced presentation skills and persuasive argumentation'
      },
      hint_system: {
        progressive_hints: true,
        hint_cooldown: 360,
        max_hints_per_puzzle: 3,
        hint_cost_points: 75
      },
      adaptive_difficulty: true,
      qr_codes_enabled: true,
      ar_features: {
        data_visualization: 'Interactive charts and graphs',
        relationship_web: 'Network diagrams showing connections',
        board_reaction: 'Virtual board member responses',
        justice_outcome: 'Shows impact of successful investigation'
      },
      ai_characters: [
        {
          id: 'board_members',
          name: 'Virtual Board',
          personality: 'Professional, skeptical, but fair-minded',
          dialogue_style: 'Formal business language with probing questions',
          clue_delivery: 'Provides feedback on presentation quality and evidence strength'
        }
      ],
      voice_interactions: true,
      gesture_controls: false,
      accessibility_features: ['large_text', 'high_contrast_charts', 'audio_descriptions'],
      language_support: ['en', 'es'],
      cultural_adaptations: {
        us_version: 'SEC regulations and US corporate law',
        eu_version: 'European corporate governance standards',
        asian_version: 'Regional business practices and regulations'
      },
      theme_config: {
        primary_color: '#2E8B57',
        secondary_color: '#4169E1',
        background_music: 'corporate-investigation.mp3',
        visual_style: 'professional_business'
      },
      cover_image_url: '/images/templates/boardroom-conspiracy.jpg',
      background_music_url: '/audio/corporate/boardroom-tension.mp3',
      sound_effects: ['calculator_beeps', 'paper_shuffling', 'presentation_click', 'boardroom_ambience'],
      visual_effects: ['chart_animations', 'document_highlights', 'network_connections', 'presentation_graphics'],
      tags: ['corporate', 'investigation', 'finance', 'ethics', 'presentation', 'analysis', 'conspiracy']
    },
    default_settings: {
      max_duration: 50,
      hint_system_enabled: true,
      voice_guidance: true,
      ar_required: false
    },
    customization_options: {
      company_type: ['manufacturing', 'tech_startup', 'financial_services', 'retail_chain'],
      conspiracy_scale: ['department_level', 'executive_level', 'board_level'],
      evidence_complexity: ['straightforward', 'moderate', 'highly_complex'],
      industry_focus: ['general_business', 'specific_industry', 'regulatory_heavy']
    },
    difficulty_range: ['intermediate', 'advanced', 'expert'],
    player_range: { min: 3, max: 8 },
    age_range: { min: 16, max: 99 },
    duration_range: { min: 40, max: 60 }
  }

  // Note: Additional corporate templates would continue here
];

// =============================================================================
// 📚 EDUCATIONAL THEME ADVENTURES (5 adventures)
// =============================================================================

export const educationalAdventureTemplates: StoryTemplate[] = [
  {
    template_id: 'educational_eco_warriors',
    template_name: 'Eco Warriors',
    category: 'educational',
    description: 'Save ecosystems through environmental science and collaborative problem-solving',
    template_data: {
      story_id: 'educational_eco_warriors',
      title: 'Eco Warriors',
      description: 'El planeta se encuentra al borde del desastre ecológico',
      full_description: 'El planeta se encuentra al borde del desastre ecológico. Los jugadores son reclutados como guerreros ambientales encargados de salvar ecosistemas. La introducción es simple y clara; un científico en AR brinda contexto. Se enfatiza que se aprende mientras se juega.',
      category: 'educational',
      difficulty: 'intermediate',
      estimated_duration: 45,
      scene_count: 6,
      progression_type: 'hub_based',
      min_players: 2,
      max_players: 6,
      recommended_players: 4,
      min_age: 10,
      setup_time: 10,
      location_type: 'mixed',
      space_requirements: 'Large space representing different ecosystems',
      required_materials: ['Ecosystem props', 'Recycling materials', 'Calculators', 'Charts', 'AR markers'],
      tech_requirements: ['Tablets', 'AR capability', 'Environmental sensors', 'Data collection apps'],
      optional_materials: ['Nature sounds', 'Environmental costumes', 'Real plants'],
      learning_objectives: ['Environmental science', 'Sustainability concepts', 'Data analysis', 'Systems thinking', 'Collaborative problem-solving'],
      skills_developed: ['Scientific method', 'Data interpretation', 'Environmental awareness', 'Teamwork', 'Critical thinking'],
      knowledge_areas: ['Ecology', 'Climate science', 'Renewable energy', 'Waste management', 'Conservation'],
      puzzle_types: ['Ecosystem balance', 'Carbon footprint calculation', 'Recycling optimization', 'Food chain reconstruction'],
      tech_integrations: ['Environmental data visualization', 'AR ecosystem simulation', 'Real-time impact calculation', 'Digital field guides'],
      special_mechanics: {
        ecosystem_visualization: 'AR shows environmental changes based on player actions',
        real_impact_calculation: 'Actual environmental calculations and data',
        collaborative_solutions: 'Multiple approaches to environmental problems',
        progress_tracking: 'Visual representation of environmental improvements'
      },
      narrative_hook: 'The planet needs heroes - use science and teamwork to save the ecosystems!',
      story_acts: [
        {
          act_id: 'assessment',
          title: 'Environmental Assessment',
          description: 'Survey the environmental damage and understand the challenges',
          duration: 12,
          objectives: ['Assess ecosystem health', 'Identify major threats', 'Plan intervention strategies'],
          scenes: [
            {
              scene_id: 'command_center',
              title: 'Environmental Command Center',
              description: 'Analyze global environmental data and identify priority areas',
              duration: 12,
              objectives: ['Review environmental reports', 'Identify critical ecosystems', 'Understand interconnections'],
              puzzles: [
                {
                  puzzle_id: 'ecosystem_health_analysis',
                  title: 'Global Ecosystem Assessment',
                  type: 'data_analysis',
                  difficulty: 'medium',
                  description: 'Analyze environmental data to identify ecosystems in greatest danger',
                  mechanics: ['data_interpretation', 'trend_analysis', 'priority_assessment']
                }
              ],
              interactions: [
                { type: 'data_dashboard', object: 'environmental_monitors', result: 'threat_identification' }
              ],
              qr_codes: [
                { location: 'Global monitoring station', reveals: 'ecosystem_data', description: 'Access worldwide environmental data' }
              ],
              ar_elements: [
                { type: 'global_visualization', trigger: 'data_analysis', effect: 'Shows 3D Earth with ecosystem health indicators' }
              ],
              hints: [
                { level: 1, text: 'Look for ecosystems with rapid negative changes' },
                { level: 2, text: 'Consider how different ecosystems affect each other' }
              ],
              rewards: [
                { type: 'knowledge', item: 'Environmental priority list with action steps', points: 100 }
              ]
            }
          ],
          narrative_progression: 'Team understands the scope of environmental challenges and creates action plan',
          difficulty_escalation: 1
        },
        {
          act_id: 'ecosystem_restoration',
          title: 'Ecosystem Restoration',
          description: 'Work on different ecosystems to restore environmental balance',
          duration: 28,
          objectives: ['Restore forest ecosystem', 'Clean ocean environment', 'Fix urban pollution', 'Protect wildlife'],
          scenes: [
            {
              scene_id: 'forest_restoration',
              title: 'Forest Ecosystem Recovery',
              description: 'Calculate reforestation needs and plan forest restoration',
              duration: 7,
              objectives: ['Calculate carbon absorption', 'Plan tree species mix', 'Design sustainable harvesting'],
              puzzles: [
                {
                  puzzle_id: 'reforestation_calculation',
                  title: 'Carbon Sequestration Planning',
                  type: 'mathematical_modeling',
                  difficulty: 'medium',
                  description: 'Calculate how many trees are needed to offset carbon emissions',
                  mechanics: ['mathematical_calculation', 'carbon_cycle_understanding', 'forest_planning']
                }
              ],
              interactions: [
                { type: 'species_selection', object: 'tree_database', result: 'optimal_forest_plan' }
              ],
              qr_codes: [
                { location: 'Forest planning board', reveals: 'tree_species_data', description: 'Access forest restoration data' }
              ],
              ar_elements: [
                { type: 'forest_growth_simulation', trigger: 'plan_completion', effect: 'Shows forest growing over time with carbon impact' }
              ],
              hints: [
                { level: 1, text: 'Different trees absorb different amounts of carbon' },
                { level: 2, text: 'Native species work best for long-term sustainability' }
              ],
              rewards: [
                { type: 'restoration_success', item: 'Forest restoration plan with 20-year carbon impact', points: 150 }
              ]
            },
            {
              scene_id: 'ocean_cleanup',
              title: 'Ocean Ecosystem Restoration',
              description: 'Design strategies to reduce ocean pollution and protect marine life',
              duration: 7,
              objectives: ['Calculate plastic waste impact', 'Design cleanup strategies', 'Protect marine food chains'],
              puzzles: [
                {
                  puzzle_id: 'plastic_impact_analysis',
                  title: 'Ocean Pollution Mathematics',
                  type: 'environmental_calculation',
                  difficulty: 'medium',
                  description: 'Calculate plastic pollution impact on marine ecosystems',
                  mechanics: ['pollution_mathematics', 'ecosystem_impact_analysis', 'cleanup_efficiency']
                }
              ],
              interactions: [
                { type: 'cleanup_strategy_design', object: 'ocean_cleanup_tools', result: 'pollution_reduction_plan' }
              ],
              qr_codes: [
                { location: 'Ocean monitoring buoy', reveals: 'marine_data', description: 'Access ocean health statistics' }
              ],
              ar_elements: [
                { type: 'ocean_cleanup_visualization', trigger: 'strategy_implementation', effect: 'Shows ocean cleaning up with marine life returning' }
              ],
              hints: [
                { level: 1, text: 'Focus on preventing new pollution as well as cleaning existing waste' },
                { level: 2, text: 'Consider the impact on different marine species' }
              ],
              rewards: [
                { type: 'conservation_success', item: 'Ocean cleanup strategy reducing pollution by 60%', points: 150 }
              ]
            },
            {
              scene_id: 'urban_sustainability',
              title: 'Urban Environment Optimization',
              description: 'Reduce urban environmental impact through smart city planning',
              duration: 7,
              objectives: ['Optimize energy usage', 'Improve waste management', 'Reduce urban heat island'],
              puzzles: [
                {
                  puzzle_id: 'urban_efficiency_optimization',
                  title: 'Smart City Environmental Design',
                  type: 'systems_optimization',
                  difficulty: 'hard',
                  description: 'Balance urban development with environmental sustainability',
                  mechanics: ['systems_thinking', 'optimization_analysis', 'sustainability_planning']
                }
              ],
              interactions: [
                { type: 'city_planning_interface', object: 'urban_design_tools', result: 'sustainable_city_plan' }
              ],
              qr_codes: [
                { location: 'City planning table', reveals: 'urban_sustainability_data', description: 'Access smart city technologies' }
              ],
              ar_elements: [
                { type: 'smart_city_visualization', trigger: 'planning_complete', effect: 'Shows green city with reduced emissions and improved quality of life' }
              ],
              hints: [
                { level: 1, text: 'Green roofs and walls can significantly reduce urban heat' },
                { level: 2, text: 'Public transportation reduces individual carbon footprints' }
              ],
              rewards: [
                { type: 'urban_improvement', item: 'Smart city plan reducing emissions by 40%', points: 200 }
              ]
            },
            {
              scene_id: 'wildlife_protection',
              title: 'Wildlife Conservation',
              description: 'Design wildlife corridors and protection strategies',
              duration: 7,
              objectives: ['Map migration patterns', 'Design wildlife corridors', 'Plan conservation areas'],
              puzzles: [
                {
                  puzzle_id: 'wildlife_corridor_design',
                  title: 'Animal Migration Route Planning',
                  type: 'spatial_planning',
                  difficulty: 'hard',
                  description: 'Create wildlife corridors connecting fragmented habitats',
                  mechanics: ['spatial_reasoning', 'ecological_understanding', 'conservation_planning']
                }
              ],
              interactions: [
                { type: 'corridor_mapping', object: 'wildlife_tracking_data', result: 'conservation_network' }
              ],
              qr_codes: [
                { location: 'Wildlife tracking station', reveals: 'animal_movement_data', description: 'Access migration patterns' }
              ],
              ar_elements: [
                { type: 'wildlife_corridor_visualization', trigger: 'corridor_completion', effect: 'Shows animals safely migrating through protected corridors' }
              ],
              hints: [
                { level: 1, text: 'Animals need continuous pathways between habitats' },
                { level: 2, text: 'Water sources are critical connection points' }
              ],
              rewards: [
                { type: 'conservation_achievement', item: 'Wildlife corridor network protecting 15 endangered species', points: 200 }
              ]
            }
          ],
          narrative_progression: 'Team implements practical solutions across multiple ecosystems',
          difficulty_escalation: 2
        },
        {
          act_id: 'global_impact',
          title: 'Global Environmental Impact',
          description: 'Measure combined impact and plan for long-term sustainability',
          duration: 5,
          objectives: ['Calculate total environmental impact', 'Plan future sustainability', 'Inspire others to action'],
          scenes: [
            {
              scene_id: 'impact_assessment',
              title: 'Global Impact Measurement',
              description: 'Calculate the total positive impact of all environmental actions',
              duration: 5,
              objectives: ['Sum all environmental improvements', 'Project future benefits', 'Create inspiration plan'],
              puzzles: [
                {
                  puzzle_id: 'total_impact_calculation',
                  title: 'Global Environmental Impact Assessment',
                  type: 'comprehensive_analysis',
                  difficulty: 'expert',
                  description: 'Calculate combined environmental benefits across all ecosystems',
                  mechanics: ['impact_summation', 'long_term_projection', 'global_systems_analysis']
                }
              ],
              interactions: [
                { type: 'impact_visualization', object: 'global_calculator', result: 'world_transformation' }
              ],
              qr_codes: [
                { location: 'Global impact terminal', reveals: 'final_assessment', description: 'See worldwide environmental improvement' }
              ],
              ar_elements: [
                { type: 'planetary_transformation', trigger: 'impact_calculation', effect: 'Shows healthy Earth with thriving ecosystems' },
                { type: 'future_vision', trigger: 'success_completion', effect: 'Shows sustainable future with team as environmental leaders' }
              ],
              hints: [
                { level: 1, text: 'Add up carbon reduction, pollution cleanup, and habitat protection' },
                { level: 2, text: 'Consider how improvements multiply over time' }
              ],
              rewards: [
                { type: 'environmental_victory', item: 'Planet saved through science and teamwork', points: 500 },
                { type: 'achievement', item: 'Environmental Scientist', points: 200 },
                { type: 'inspiration', item: 'Action plan for real-world environmental impact', points: 100 }
              ]
            }
          ],
          narrative_progression: 'Team sees the massive positive impact of their scientific approach to environmental problems',
          difficulty_escalation: 3
        }
      ],
      character_roles: [
        {
          id: 'climate_scientist',
          name: 'Climate Scientist',
          description: 'Expert in climate change and atmospheric science',
          abilities: ['climate_analysis', 'carbon_calculation'],
          color: '#228B22'
        },
        {
          id: 'marine_biologist',
          name: 'Marine Biologist',
          description: 'Specialist in ocean ecosystems and marine life',
          abilities: ['ocean_analysis', 'marine_conservation'],
          color: '#4682B4'
        },
        {
          id: 'conservation_planner',
          name: 'Conservation Planner',
          description: 'Expert in wildlife protection and habitat design',
          abilities: ['habitat_design', 'species_protection'],
          color: '#8FBC8F'
        },
        {
          id: 'sustainability_engineer',
          name: 'Sustainability Engineer',
          description: 'Specialist in renewable energy and sustainable systems',
          abilities: ['system_optimization', 'renewable_energy'],
          color: '#32CD32'
        }
      ],
      story_themes: ['environmental_protection', 'scientific_method', 'sustainability', 'systems_thinking', 'global_cooperation'],
      difficulty_curve: {
        act_1: 'Basic environmental concepts and data interpretation',
        act_2: 'Applied environmental mathematics and planning',
        act_3: 'Complex systems analysis and global impact calculation'
      },
      hint_system: {
        progressive_hints: true,
        hint_cooldown: 240,
        max_hints_per_puzzle: 3,
        hint_cost_points: 50
      },
      adaptive_difficulty: true,
      qr_codes_enabled: true,
      ar_features: {
        global_visualization: '3D Earth showing environmental changes',
        ecosystem_simulations: 'Real-time environmental improvement visualization',
        planetary_transformation: 'Shows healthy planet outcome',
        future_vision: 'Inspiring view of sustainable future'
      },
      ai_characters: [
        {
          id: 'dr_green',
          name: 'Dr. Elena Green',
          personality: 'Passionate environmental scientist, encouraging but realistic',
          dialogue_style: 'Scientific but accessible, uses real environmental data',
          clue_delivery: 'Provides scientific context and celebrates environmental victories'
        }
      ],
      voice_interactions: true,
      gesture_controls: false,
      accessibility_features: ['visual_indicators', 'simplified_math_options', 'audio_descriptions'],
      language_support: ['en', 'es'],
      cultural_adaptations: {
        global_version: 'Worldwide environmental challenges and solutions',
        regional_version: 'Local ecosystem focus with regional species',
        urban_version: 'City-focused environmental challenges'
      },
      theme_config: {
        primary_color: '#228B22',
        secondary_color: '#4682B4',
        background_music: 'nature-ambient-positive.mp3',
        visual_style: 'environmental_friendly'
      },
      cover_image_url: '/images/templates/eco-warriors.jpg',
      background_music_url: '/audio/educational/eco-warriors-theme.mp3',
      sound_effects: ['nature_sounds', 'calculation_completion', 'environmental_success', 'wildlife_calls'],
      visual_effects: ['growing_plants', 'clean_water_flow', 'renewable_energy', 'wildlife_return'],
      tags: ['educational', 'environment', 'science', 'sustainability', 'collaboration', 'mathematics', 'conservation']
    },
    default_settings: {
      max_duration: 45,
      hint_system_enabled: true,
      voice_guidance: true,
      ar_required: true
    },
    customization_options: {
      ecosystem_focus: ['forest', 'ocean', 'urban', 'wildlife', 'all_ecosystems'],
      difficulty_level: ['elementary', 'middle_school', 'high_school', 'adult'],
      math_complexity: ['basic_arithmetic', 'intermediate_math', 'advanced_calculations'],
      regional_adaptation: ['global', 'local_ecosystem', 'specific_biome']
    },
    difficulty_range: ['beginner', 'intermediate', 'advanced'],
    player_range: { min: 2, max: 6 },
    age_range: { min: 10, max: 99 },
    duration_range: { min: 35, max: 55 }
  }

  // Note: Additional educational templates would continue here
];

// =============================================================================
// COMBINED EXPORT
// =============================================================================

export const ALL_ADVENTURE_TEMPLATES: StoryTemplate[] = [
  ...mysteryAdventureTemplates,
  ...fantasyAdventureTemplates,
  ...hackerAdventureTemplates,
  ...corporateAdventureTemplates,
  ...educationalAdventureTemplates
];

export default ALL_ADVENTURE_TEMPLATES;