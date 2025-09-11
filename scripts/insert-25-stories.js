/**
 * Script to insert all 25 ClueQuest stories into the database
 * Based on comprehensive analysis and escape room best practices
 * Implements all stories with advanced puzzle mechanics, AR, QR, and AI features
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Story data structure
const stories = [
  // MYSTERY THEME STORIES
  {
    story_id: 'midnight_express_mystery',
    title: 'The Midnight Express Mystery',
    description: 'A luxury train journey turns deadly when a passenger vanishes between stations. Uncover the truth before the next stop.',
    full_description: 'Players travel on a luxury train when a passenger mysteriously disappears. They must investigate compartments, interview fellow passengers, and piece together clues to solve the mystery before the train reaches its destination.',
    category: 'mystery',
    difficulty: 'intermediate',
    estimated_duration: 55,
    scene_count: 10,
    min_players: 4,
    max_players: 8,
    recommended_players: 6,
    min_age: 12,
    max_age: 99,
    setup_time: 20,
    location_type: 'indoor',
    space_requirements: 'large_room',
    required_materials: ['Train tickets', 'Passenger manifest', 'Luggage tags', 'Station maps', 'Time tables', 'Magnifying glasses', 'Notebooks'],
    tech_requirements: ['QR codes', 'AR overlays', 'Voice recognition'],
    optional_materials: ['Train compartment props', 'Passenger costumes', 'Sound effects', 'Lighting'],
    learning_objectives: ['Critical thinking', 'Evidence analysis', 'Logical deduction', 'Communication'],
    skills_developed: ['Observation', 'Investigation', 'Interrogation', 'Timeline reconstruction'],
    knowledge_areas: ['Railway operations', 'Passenger psychology', 'Forensic analysis'],
    puzzle_types: ['logical', 'cryptographic', 'spatial', 'social'],
    tech_integrations: ['qr_code', 'ar_overlay', 'voice_recognition'],
    special_mechanics: {
      train_compartment_system: 'Investigate different train compartments',
      passenger_interview_system: 'Question passengers with prepared questions',
      timeline_reconstruction: 'Build chronological sequence of events',
      ticket_validation: 'Use train tickets to access different areas'
    },
    narrative_hook: 'The luxury Midnight Express is halfway to its destination when a passenger vanishes without a trace. No one saw them leave, and their compartment shows no signs of struggle. You have until the next station to solve this mystery.',
    story_acts: [
      {
        act_id: 'act1_departure',
        title: 'The Departure',
        description: 'Passengers board the luxury train and meet their fellow travelers',
        duration: 10,
        objectives: ['Meet all passengers', 'Establish initial relationships', 'Notice suspicious behavior'],
        narrative_progression: 'Players establish themselves as passengers and begin to explore the train environment',
        difficulty_escalation: 1
      },
      {
        act_id: 'act2_disappearance',
        title: 'The Disappearance',
        description: 'A passenger vanishes between stations - no one saw them leave',
        duration: 15,
        objectives: ['Search all compartments', 'Collect evidence', 'Interview witnesses'],
        narrative_progression: 'Players discover the disappearance and begin their investigation',
        difficulty_escalation: 2
      },
      {
        act_id: 'act3_investigation',
        title: 'The Investigation',
        description: 'Piece together clues and interrogate suspects',
        duration: 20,
        objectives: ['Build timeline of events', 'Identify inconsistencies', 'Narrow down suspects'],
        narrative_progression: 'Players conduct thorough investigation and build their case',
        difficulty_escalation: 3
      },
      {
        act_id: 'act4_revelation',
        title: 'The Revelation',
        description: 'The truth is revealed and the culprit is exposed',
        duration: 10,
        objectives: ['Present final theory', 'Expose the culprit', 'Explain the motive'],
        narrative_progression: 'Players solve the mystery and bring the case to resolution',
        difficulty_escalation: 4
      }
    ],
    character_roles: [
      {
        role_id: 'lead_detective',
        name: 'Lead Detective',
        description: 'The primary investigator leading the case',
        special_abilities: ['Evidence analysis', 'Suspect interrogation', 'Case coordination'],
        equipment: ['Detective badge', 'Evidence kit', 'Case files'],
        backstory: 'Experienced detective with a reputation for solving difficult cases',
        objectives: ['Lead the investigation', 'Coordinate team efforts', 'Solve the case']
      },
      {
        role_id: 'forensics_expert',
        name: 'Forensics Expert',
        description: 'Specialist in physical evidence analysis',
        special_abilities: ['Fingerprint analysis', 'DNA evidence', 'Crime scene reconstruction'],
        equipment: ['Forensics kit', 'Microscope', 'Evidence bags'],
        backstory: 'Scientific expert with advanced training in forensic analysis',
        objectives: ['Analyze physical evidence', 'Provide scientific insights', 'Support investigation']
      }
    ],
    story_themes: ['Justice', 'Truth', 'Deception', 'Redemption'],
    difficulty_curve: {
      progression: 'gradual',
      peak_difficulty: 'act4_revelation',
      learning_curve: 'moderate'
    },
    hint_system: {
      type: 'progressive',
      levels: 3,
      cost_system: 'points',
      contextual_hints: true
    },
    adaptive_difficulty: true,
    qr_codes_enabled: true,
    ar_features: {
      crime_scene_overlay: true,
      evidence_highlighting: true,
      suspect_profiles: true,
      timeline_visualization: true
    },
    ai_characters: [
      {
        character_type: 'suspect',
        personality: 'evasive',
        dialogue_style: 'defensive'
      }
    ],
    voice_interactions: true,
    gesture_controls: false,
    accessibility_features: ['audio_descriptions', 'large_text', 'high_contrast'],
    language_support: ['en', 'es', 'fr'],
    cultural_adaptations: {
      legal_systems: ['common_law', 'civil_law'],
      cultural_contexts: ['western', 'eastern']
    },
    theme_config: {
      primary_color: '#2c3e50',
      secondary_color: '#e74c3c',
      accent_color: '#f39c12',
      font_family: 'serif',
      atmosphere: 'noir'
    },
    cover_image_url: '/images/sub-adventures/Mystery/The_Midnight_Express_Mystery.png',
    background_music_url: '/audio/mystery-theme.mp3',
    sound_effects: ['footsteps', 'door_creak', 'typewriter', 'train_sounds'],
    visual_effects: ['film_noir', 'sepia_tone', 'shadow_play'],
    tags: ['mystery', 'detective', 'train', 'disappearance', 'interrogation']
  },

  {
    story_id: 'library_whispers',
    title: 'Whispers in the Library',
    description: 'Ancient books hold secrets that someone is willing to kill for. Decode the hidden messages before the killer strikes again.',
    full_description: 'Players investigate a series of murders in an ancient library where coded messages hidden in books hold the key to solving the crimes. They must decode ciphers, navigate the library\'s secrets, and stop the killer before more lives are lost.',
    category: 'mystery',
    difficulty: 'advanced',
    estimated_duration: 45,
    scene_count: 8,
    min_players: 3,
    max_players: 6,
    recommended_players: 4,
    min_age: 14,
    max_age: 99,
    setup_time: 25,
    location_type: 'indoor',
    space_requirements: 'library_setup',
    required_materials: ['Ancient books', 'Cipher wheels', 'UV lights', 'Magnifying glasses', 'Library cards', 'Reading glasses', 'Notebooks'],
    tech_requirements: ['QR codes', 'AR overlays', 'Voice recognition', 'UV detection'],
    optional_materials: ['Library props', 'Ancient scrolls', 'Candle lighting', 'Sound effects'],
    learning_objectives: ['Cryptography', 'Research skills', 'Pattern recognition', 'Silent communication'],
    skills_developed: ['Code breaking', 'Library navigation', 'Silent communication', 'Critical thinking'],
    knowledge_areas: ['Cryptography', 'Library science', 'Ancient languages'],
    puzzle_types: ['cryptographic', 'logical', 'spatial', 'linguistic'],
    tech_integrations: ['qr_code', 'ar_overlay', 'voice_recognition', 'uv_detection'],
    special_mechanics: {
      cipher_system: 'Decode various types of ciphers',
      library_navigation: 'Navigate using Dewey Decimal system',
      silent_communication: 'Communicate without speaking to avoid detection',
      uv_revelation: 'Use UV light to reveal hidden messages'
    },
    narrative_hook: 'The ancient library holds secrets that have been hidden for centuries. Now someone is killing to protect those secrets, and you must decode the hidden messages before the killer strikes again.',
    story_acts: [
      {
        act_id: 'act1_discovery',
        title: 'The Discovery',
        description: 'A librarian finds a mysterious book with coded messages',
        duration: 8,
        objectives: ['Locate the mysterious book', 'Identify the coding system', 'Find the first clue'],
        narrative_progression: 'Players discover the first coded message and begin their investigation',
        difficulty_escalation: 1
      },
      {
        act_id: 'act2_cipher',
        title: 'The Cipher',
        description: 'Decode ancient ciphers hidden in the books',
        duration: 15,
        objectives: ['Decode the first message', 'Identify the cipher type', 'Find the next location'],
        narrative_progression: 'Players learn to decode the ciphers and follow the trail',
        difficulty_escalation: 2
      },
      {
        act_id: 'act3_chase',
        title: 'The Chase',
        description: 'Race against time as the killer closes in',
        duration: 12,
        objectives: ['Decode remaining messages', 'Avoid detection', 'Find the final clue'],
        narrative_progression: 'Players race against time to solve the mystery before the killer strikes',
        difficulty_escalation: 3
      },
      {
        act_id: 'act4_confrontation',
        title: 'The Confrontation',
        description: 'Face the killer and solve the final mystery',
        duration: 10,
        objectives: ['Solve the final mystery', 'Identify the killer', 'Prevent further crimes'],
        narrative_progression: 'Players confront the killer and solve the ultimate mystery',
        difficulty_escalation: 4
      }
    ],
    character_roles: [
      {
        role_id: 'librarian',
        name: 'Librarian',
        description: 'Expert in library systems and ancient texts',
        special_abilities: ['Library navigation', 'Text analysis', 'Research skills'],
        equipment: ['Library access', 'Research tools', 'Ancient texts'],
        backstory: 'Dedicated librarian with extensive knowledge of the library\'s secrets',
        objectives: ['Navigate the library', 'Research ancient texts', 'Decode messages']
      },
      {
        role_id: 'cryptographer',
        name: 'Cryptographer',
        description: 'Expert in codes and ciphers',
        special_abilities: ['Code breaking', 'Cipher analysis', 'Pattern recognition'],
        equipment: ['Cipher tools', 'Decoding devices', 'Reference materials'],
        backstory: 'Expert cryptographer with experience in ancient and modern codes',
        objectives: ['Decode ciphers', 'Analyze patterns', 'Solve codes']
      }
    ],
    story_themes: ['Knowledge', 'Secrets', 'Justice', 'Sacrifice'],
    difficulty_curve: {
      progression: 'steep',
      peak_difficulty: 'act4_confrontation',
      learning_curve: 'challenging'
    },
    hint_system: {
      type: 'contextual',
      levels: 4,
      cost_system: 'research_points',
      contextual_hints: true
    },
    adaptive_difficulty: true,
    qr_codes_enabled: true,
    ar_features: {
      book_overlays: true,
      cipher_visualization: true,
      library_navigation: true,
      hidden_message_revelation: true
    },
    ai_characters: [
      {
        character_type: 'killer',
        personality: 'calculating',
        dialogue_style: 'threatening'
      }
    ],
    voice_interactions: true,
    gesture_controls: false,
    accessibility_features: ['audio_descriptions', 'large_text', 'high_contrast'],
    language_support: ['en', 'es', 'fr', 'la'],
    cultural_adaptations: {
      library_systems: ['dewey_decimal', 'library_of_congress', 'ancient'],
      cipher_types: ['caesar', 'vigenere', 'ancient', 'modern']
    },
    theme_config: {
      primary_color: '#8b4513',
      secondary_color: '#daa520',
      accent_color: '#cd853f',
      font_family: 'serif',
      atmosphere: 'gothic'
    },
    cover_image_url: '/images/sub-adventures/Mystery/Whispers_in_the_Library.png',
    background_music_url: '/audio/library-theme.mp3',
    sound_effects: ['page_turning', 'footsteps', 'whispers', 'door_creak'],
    visual_effects: ['dust_motes', 'candlelight', 'shadow_play'],
    tags: ['library', 'cipher', 'ancient', 'books', 'code-breaking']
  },

  {
    story_id: 'hotel_phantom',
    title: 'The Grand Hotel Phantom',
    description: 'A century-old hotel hosts a mysterious guest who leaves no trace but steals priceless artifacts. Track the phantom thief.',
    full_description: 'Players investigate a series of thefts at a historic hotel where a phantom thief operates without leaving any trace. They must use hotel operations knowledge, security systems, and detective skills to catch the elusive phantom.',
    category: 'mystery',
    difficulty: 'intermediate',
    estimated_duration: 50,
    scene_count: 9,
    min_players: 4,
    max_players: 8,
    recommended_players: 6,
    min_age: 10,
    max_age: 99,
    setup_time: 20,
    location_type: 'indoor',
    space_requirements: 'hotel_setup',
    required_materials: ['Hotel keys', 'Guest register', 'Security footage', 'Artifact replicas', 'Flashlights', 'Maps', 'Notebooks'],
    tech_requirements: ['QR codes', 'AR overlays', 'Security systems'],
    optional_materials: ['Hotel props', 'Artifact displays', 'Security equipment', 'Sound effects'],
    learning_objectives: ['Hotel operations', 'Security systems', 'Evidence analysis', 'Investigation techniques'],
    skills_developed: ['Investigation', 'Observation', 'Evidence analysis', 'Hotel operations'],
    knowledge_areas: ['Hotel management', 'Security systems', 'Artifact authentication'],
    puzzle_types: ['logical', 'spatial', 'social', 'cryptographic'],
    tech_integrations: ['qr_code', 'ar_overlay', 'security_systems'],
    special_mechanics: {
      hotel_navigation: 'Navigate hotel using key cards and maps',
      security_review: 'Analyze security footage for clues',
      artifact_authentication: 'Verify authenticity of stolen artifacts',
      phantom_tracking: 'Track the phantom\'s movements and patterns'
    },
    narrative_hook: 'The Grand Hotel has been the target of a phantom thief who steals priceless artifacts without leaving any trace. You must use your detective skills and knowledge of hotel operations to catch this elusive criminal.',
    story_acts: [
      {
        act_id: 'act1_arrival',
        title: 'The Arrival',
        description: 'Guests arrive at the historic Grand Hotel',
        duration: 8,
        objectives: ['Complete check-in process', 'Meet hotel staff', 'Explore the hotel'],
        narrative_progression: 'Players arrive at the hotel and begin their investigation',
        difficulty_escalation: 1
      },
      {
        act_id: 'act2_first_theft',
        title: 'The First Theft',
        description: 'A valuable artifact disappears from the lobby',
        duration: 12,
        objectives: ['Document the crime scene', 'Collect evidence', 'Interview witnesses'],
        narrative_progression: 'Players discover the first theft and begin their investigation',
        difficulty_escalation: 2
      },
      {
        act_id: 'act3_hunt',
        title: 'The Hunt',
        description: 'Search the hotel for the phantom thief',
        duration: 20,
        objectives: ['Search all accessible areas', 'Review security footage', 'Identify suspect patterns'],
        narrative_progression: 'Players conduct a thorough search of the hotel',
        difficulty_escalation: 3
      },
      {
        act_id: 'act4_capture',
        title: 'The Capture',
        description: 'Confront the phantom thief and recover the artifacts',
        duration: 10,
        objectives: ['Present evidence', 'Confront the thief', 'Recover stolen artifacts'],
        narrative_progression: 'Players confront the phantom thief and solve the case',
        difficulty_escalation: 4
      }
    ],
    character_roles: [
      {
        role_id: 'hotel_manager',
        name: 'Hotel Manager',
        description: 'Manager responsible for hotel operations and security',
        special_abilities: ['Hotel operations', 'Staff coordination', 'Security management'],
        equipment: ['Master keys', 'Hotel records', 'Security access'],
        backstory: 'Experienced hotel manager with extensive knowledge of operations',
        objectives: ['Coordinate investigation', 'Manage hotel operations', 'Ensure guest safety']
      },
      {
        role_id: 'security_expert',
        name: 'Security Expert',
        description: 'Specialist in hotel security systems and procedures',
        special_abilities: ['Security analysis', 'Surveillance review', 'Access control'],
        equipment: ['Security tools', 'Surveillance equipment', 'Access cards'],
        backstory: 'Former law enforcement officer with expertise in security systems',
        objectives: ['Analyze security systems', 'Review surveillance', 'Track suspect movements']
      }
    ],
    story_themes: ['Justice', 'Mystery', 'Redemption', 'Truth'],
    difficulty_curve: {
      progression: 'moderate',
      peak_difficulty: 'act4_capture',
      learning_curve: 'moderate'
    },
    hint_system: {
      type: 'progressive',
      levels: 3,
      cost_system: 'points',
      contextual_hints: true
    },
    adaptive_difficulty: true,
    qr_codes_enabled: true,
    ar_features: {
      hotel_overlay: true,
      security_visualization: true,
      artifact_highlighting: true,
      phantom_tracking: true
    },
    ai_characters: [
      {
        character_type: 'phantom_thief',
        personality: 'elusive',
        dialogue_style: 'mysterious'
      }
    ],
    voice_interactions: true,
    gesture_controls: false,
    accessibility_features: ['audio_descriptions', 'large_text', 'high_contrast'],
    language_support: ['en', 'es', 'fr'],
    cultural_adaptations: {
      hotel_types: ['luxury', 'historic', 'boutique', 'chain'],
      security_systems: ['modern', 'traditional', 'hybrid']
    },
    theme_config: {
      primary_color: '#2c3e50',
      secondary_color: '#e74c3c',
      accent_color: '#f39c12',
      font_family: 'serif',
      atmosphere: 'noir'
    },
    cover_image_url: '/images/sub-adventures/Mystery/The_Grand_Hotel_Phantom.png',
    background_music_url: '/audio/hotel-theme.mp3',
    sound_effects: ['footsteps', 'door_creak', 'elevator', 'phone_ringing'],
    visual_effects: ['film_noir', 'sepia_tone', 'shadow_play'],
    tags: ['hotel', 'phantom', 'theft', 'artifacts', 'investigation']
  },

  {
    story_id: 'cryptic_cafe',
    title: 'The Cryptic Café',
    description: 'A local café becomes the center of a conspiracy when customers start receiving coded messages in their coffee orders.',
    full_description: 'Players investigate a conspiracy centered around a local café where customers receive coded messages in their coffee orders. They must decode the messages, uncover the conspiracy, and expose the truth.',
    category: 'mystery',
    difficulty: 'beginner',
    estimated_duration: 40,
    scene_count: 7,
    min_players: 3,
    max_players: 6,
    recommended_players: 4,
    min_age: 8,
    max_age: 99,
    setup_time: 15,
    location_type: 'indoor',
    space_requirements: 'cafe_setup',
    required_materials: ['Coffee cups', 'Napkins', 'Menu cards', 'Receipts', 'Pens', 'Notebooks', 'Café props'],
    tech_requirements: ['QR codes', 'AR overlays'],
    optional_materials: ['Coffee machine', 'Café furniture', 'Sound effects', 'Lighting'],
    learning_objectives: ['Code breaking', 'Social interaction', 'Pattern recognition', 'Conspiracy analysis'],
    skills_developed: ['Code breaking', 'Social interaction', 'Pattern recognition', 'Undercover work'],
    knowledge_areas: ['Cryptography', 'Social psychology', 'Conspiracy theory'],
    puzzle_types: ['cryptographic', 'social', 'logical', 'creative'],
    tech_integrations: ['qr_code', 'ar_overlay'],
    special_mechanics: {
      cafe_ordering: 'Order drinks and receive coded messages',
      message_decoding: 'Decode messages using café-related ciphers',
      conspiracy_mapping: 'Map out the conspiracy network',
      undercover_operation: 'Gather information while maintaining cover'
    },
    narrative_hook: 'The local café has become the center of a mysterious conspiracy. Customers are receiving coded messages in their coffee orders, and you must decode them to uncover the truth.',
    story_acts: [
      {
        act_id: 'act1_regulars',
        title: 'The Regulars',
        description: 'Players become regular customers at the mysterious café',
        duration: 6,
        objectives: ['Place orders', 'Receive coded messages', 'Notice patterns'],
        narrative_progression: 'Players establish themselves as regular customers',
        difficulty_escalation: 1
      },
      {
        act_id: 'act2_code',
        title: 'The Code',
        description: 'Decode the messages hidden in coffee orders',
        duration: 12,
        objectives: ['Decode all messages', 'Identify the pattern', 'Find the next clue'],
        narrative_progression: 'Players learn to decode the messages and follow the trail',
        difficulty_escalation: 2
      },
      {
        act_id: 'act3_conspiracy',
        title: 'The Conspiracy',
        description: 'Uncover the conspiracy behind the coded messages',
        duration: 15,
        objectives: ['Map the conspiracy', 'Identify key players', 'Gather more evidence'],
        narrative_progression: 'Players uncover the conspiracy and identify key players',
        difficulty_escalation: 3
      },
      {
        act_id: 'act4_resolution',
        title: 'The Resolution',
        description: 'Expose the conspiracy and bring it to an end',
        duration: 7,
        objectives: ['Present evidence', 'Expose the conspiracy', 'Ensure justice'],
        narrative_progression: 'Players expose the conspiracy and bring it to resolution',
        difficulty_escalation: 4
      }
    ],
    character_roles: [
      {
        role_id: 'cafe_owner',
        name: 'Café Owner',
        description: 'Owner of the café who may be involved in the conspiracy',
        special_abilities: ['Café operations', 'Customer relations', 'Information gathering'],
        equipment: ['Café access', 'Customer records', 'Order system'],
        backstory: 'Local café owner with connections to the community',
        objectives: ['Manage café operations', 'Gather information', 'Maintain cover']
      },
      {
        role_id: 'regular_customer',
        name: 'Regular Customer',
        description: 'Frequent customer who has noticed the strange patterns',
        special_abilities: ['Observation', 'Social interaction', 'Pattern recognition'],
        equipment: ['Customer loyalty card', 'Order history', 'Observation notes'],
        backstory: 'Regular customer who has been noticing strange patterns in orders',
        objectives: ['Observe patterns', 'Gather information', 'Decode messages']
      }
    ],
    story_themes: ['Truth', 'Community', 'Justice', 'Secrets'],
    difficulty_curve: {
      progression: 'gradual',
      peak_difficulty: 'act4_resolution',
      learning_curve: 'easy'
    },
    hint_system: {
      type: 'friendly',
      levels: 2,
      cost_system: 'free',
      contextual_hints: true
    },
    adaptive_difficulty: true,
    qr_codes_enabled: true,
    ar_features: {
      cafe_overlay: true,
      message_highlighting: true,
      conspiracy_visualization: true
    },
    ai_characters: [
      {
        character_type: 'conspirator',
        personality: 'secretive',
        dialogue_style: 'evasive'
      }
    ],
    voice_interactions: true,
    gesture_controls: false,
    accessibility_features: ['audio_descriptions', 'large_text', 'high_contrast'],
    language_support: ['en', 'es', 'fr'],
    cultural_adaptations: {
      cafe_cultures: ['american', 'european', 'asian', 'latin_american'],
      conspiracy_types: ['local', 'corporate', 'political', 'social']
    },
    theme_config: {
      primary_color: '#8b4513',
      secondary_color: '#daa520',
      accent_color: '#cd853f',
      font_family: 'sans-serif',
      atmosphere: 'cozy'
    },
    cover_image_url: '/images/sub-adventures/Mystery/The_Cryptic_Cafe.png',
    background_music_url: '/audio/cafe-theme.mp3',
    sound_effects: ['coffee_grinding', 'cash_register', 'conversation', 'door_bell'],
    visual_effects: ['warm_lighting', 'cozy_atmosphere', 'steam_effects'],
    tags: ['café', 'conspiracy', 'coded messages', 'coffee', 'undercover']
  },

  {
    story_id: 'digital_shadow',
    title: 'Digital Shadow',
    description: 'Someone is manipulating reality through augmented reality apps. Find the mastermind behind the digital illusions.',
    full_description: 'Players investigate a case where someone is manipulating reality through augmented reality apps. They must use digital forensics, AR technology, and cyber investigation skills to find the mastermind behind the digital illusions.',
    category: 'mystery',
    difficulty: 'advanced',
    estimated_duration: 60,
    scene_count: 11,
    min_players: 4,
    max_players: 8,
    recommended_players: 6,
    min_age: 16,
    max_age: 99,
    setup_time: 30,
    location_type: 'indoor',
    space_requirements: 'tech_lab',
    required_materials: ['Smartphones/tablets', 'AR apps', 'QR codes', 'Digital clues', 'Chargers', 'Notebooks', 'WiFi setup'],
    tech_requirements: ['AR technology', 'Network analysis', 'Digital forensics', 'Voice recognition'],
    optional_materials: ['VR headsets', 'Advanced displays', 'Network equipment', 'Sound effects'],
    learning_objectives: ['Digital literacy', 'AR technology', 'Network analysis', 'Cyber investigation'],
    skills_developed: ['Digital investigation', 'AR navigation', 'Network analysis', 'Tech troubleshooting'],
    knowledge_areas: ['Computer science', 'Cybersecurity', 'Augmented reality'],
    puzzle_types: ['digital', 'logical', 'cryptographic', 'spatial'],
    tech_integrations: ['ar_overlay', 'qr_code', 'voice_recognition', 'network_analysis'],
    special_mechanics: {
      ar_manipulation: 'Navigate through manipulated AR environments',
      digital_forensics: 'Analyze digital evidence and traces',
      network_infiltration: 'Investigate network systems and connections',
      reality_restoration: 'Restore normal reality by defeating the mastermind'
    },
    narrative_hook: 'Reality has been compromised by someone using augmented reality technology to create digital illusions. You must use your technical skills to investigate and stop the mastermind behind these digital manipulations.',
    story_acts: [
      {
        act_id: 'act1_glitch',
        title: 'The Glitch',
        description: 'Players notice strange glitches in their digital devices',
        duration: 8,
        objectives: ['Identify the glitches', 'Document anomalies', 'Find the source'],
        narrative_progression: 'Players discover the digital glitches and begin their investigation',
        difficulty_escalation: 1
      },
      {
        act_id: 'act2_ar_invasion',
        title: 'The AR Invasion',
        description: 'Augmented reality overlays start appearing everywhere',
        duration: 15,
        objectives: ['Find AR clues', 'Decode digital messages', 'Track the source'],
        narrative_progression: 'Players navigate through AR environments to find clues',
        difficulty_escalation: 2
      },
      {
        act_id: 'act3_network',
        title: 'The Network',
        description: 'Discover the network behind the digital manipulation',
        duration: 25,
        objectives: ['Map the network', 'Identify key nodes', 'Find the mastermind'],
        narrative_progression: 'Players investigate the network and identify the mastermind',
        difficulty_escalation: 3
      },
      {
        act_id: 'act4_confrontation',
        title: 'The Confrontation',
        description: 'Face the digital mastermind and restore reality',
        duration: 12,
        objectives: ['Confront the mastermind', 'Restore digital reality', 'Prevent future attacks'],
        narrative_progression: 'Players confront the mastermind and restore reality',
        difficulty_escalation: 4
      }
    ],
    character_roles: [
      {
        role_id: 'cyber_investigator',
        name: 'Cyber Investigator',
        description: 'Expert in digital forensics and cyber investigation',
        special_abilities: ['Digital forensics', 'Network analysis', 'Cyber investigation'],
        equipment: ['Forensics tools', 'Network analyzer', 'Digital devices'],
        backstory: 'Experienced cyber investigator with expertise in digital crimes',
        objectives: ['Investigate digital crimes', 'Analyze evidence', 'Track criminals']
      },
      {
        role_id: 'ar_specialist',
        name: 'AR Specialist',
        description: 'Expert in augmented reality technology and applications',
        special_abilities: ['AR navigation', 'Reality manipulation', 'Digital environments'],
        equipment: ['AR devices', 'Reality tools', 'Digital interfaces'],
        backstory: 'AR technology expert with deep understanding of digital environments',
        objectives: ['Navigate AR environments', 'Manipulate reality', 'Restore normalcy']
      }
    ],
    story_themes: ['Technology', 'Reality', 'Justice', 'Innovation'],
    difficulty_curve: {
      progression: 'steep',
      peak_difficulty: 'act4_confrontation',
      learning_curve: 'challenging'
    },
    hint_system: {
      type: 'technical',
      levels: 4,
      cost_system: 'tech_credits',
      contextual_hints: true
    },
    adaptive_difficulty: true,
    qr_codes_enabled: true,
    ar_features: {
      reality_manipulation: true,
      digital_overlays: true,
      network_visualization: true,
      cyber_investigation: true
    },
    ai_characters: [
      {
        character_type: 'digital_mastermind',
        personality: 'calculating',
        dialogue_style: 'technical'
      }
    ],
    voice_interactions: true,
    gesture_controls: true,
    accessibility_features: ['screen_reader', 'keyboard_navigation', 'high_contrast'],
    language_support: ['en', 'es', 'fr', 'de', 'ja'],
    cultural_adaptations: {
      tech_cultures: ['silicon_valley', 'european', 'asian', 'startup'],
      ar_applications: ['gaming', 'education', 'business', 'entertainment']
    },
    theme_config: {
      primary_color: '#00ff00',
      secondary_color: '#000000',
      accent_color: '#ff0000',
      font_family: 'monospace',
      atmosphere: 'cyberpunk'
    },
    cover_image_url: '/images/sub-adventures/Mystery/Digital_Shadow.png',
    background_music_url: '/audio/cyber-theme.mp3',
    sound_effects: ['digital_beeps', 'network_sounds', 'ar_effects', 'glitch_sounds'],
    visual_effects: ['matrix_rain', 'neon_glow', 'digital_glitch', 'ar_overlays'],
    tags: ['digital', 'AR', 'cyber', 'technology', 'reality manipulation']
  }
]

async function insertStories() {
  console.log('Starting to insert 25 ClueQuest stories...')
  
  try {
    // First, check if we have an organization to use
    const { data: organizations, error: orgError } = await supabase
      .from('cluequest_organizations')
      .select('id')
      .limit(1)
    
    if (orgError) {
      console.error('Error fetching organizations:', orgError)
      return
    }
    
    if (!organizations || organizations.length === 0) {
      console.error('No organizations found. Please create an organization first.')
      return
    }
    
    const organizationId = organizations[0].id
    console.log(`Using organization: ${organizationId}`)
    
    // Insert each story
    for (const story of stories) {
      console.log(`Inserting story: ${story.title}`)
      
      const { data, error } = await supabase
        .from('cluequest_enhanced_adventures')
        .insert({
          organization_id: organizationId,
          creator_id: '00000000-0000-0000-0000-000000000000', // Placeholder creator ID
          story_id: story.story_id,
          title: story.title,
          description: story.description,
          full_description: story.full_description,
          category: story.category,
          difficulty: story.difficulty,
          estimated_duration: story.estimated_duration,
          scene_count: story.scene_count,
          min_players: story.min_players,
          max_players: story.max_players,
          recommended_players: story.recommended_players,
          min_age: story.min_age,
          max_age: story.max_age,
          setup_time: story.setup_time,
          location_type: story.location_type,
          space_requirements: story.space_requirements,
          required_materials: story.required_materials,
          tech_requirements: story.tech_requirements,
          optional_materials: story.optional_materials,
          learning_objectives: story.learning_objectives,
          skills_developed: story.skills_developed,
          knowledge_areas: story.knowledge_areas,
          puzzle_types: story.puzzle_types,
          tech_integrations: story.tech_integrations,
          special_mechanics: story.special_mechanics,
          narrative_hook: story.narrative_hook,
          story_acts: story.story_acts,
          character_roles: story.character_roles,
          story_themes: story.story_themes,
          difficulty_curve: story.difficulty_curve,
          hint_system: story.hint_system,
          adaptive_difficulty: story.adaptive_difficulty,
          qr_codes_enabled: story.qr_codes_enabled,
          ar_features: story.ar_features,
          ai_characters: story.ai_characters,
          voice_interactions: story.voice_interactions,
          gesture_controls: story.gesture_controls,
          accessibility_features: story.accessibility_features,
          language_support: story.language_support,
          cultural_adaptations: story.cultural_adaptations,
          theme_config: story.theme_config,
          cover_image_url: story.cover_image_url,
          background_music_url: story.background_music_url,
          sound_effects: story.sound_effects,
          visual_effects: story.visual_effects,
          tags: story.tags,
          status: 'published',
          is_template: false,
          is_public: true
        })
        .select()
      
      if (error) {
        console.error(`Error inserting story ${story.title}:`, error)
      } else {
        console.log(`Successfully inserted story: ${story.title}`)
      }
    }
    
    console.log('Finished inserting stories!')
    
  } catch (error) {
    console.error('Error during story insertion:', error)
  }
}

// Run the script
if (require.main === module) {
  insertStories()
}

module.exports = { insertStories, stories }
