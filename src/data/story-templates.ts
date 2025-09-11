/**
 * Story Templates for ClueQuest 25 Stories
 * Based on comprehensive analysis and escape room best practices
 * Implements all 5 themes with detailed mechanics and progression
 */

export interface StoryTemplate {
  template_id: string
  template_name: string
  category: 'mystery' | 'fantasy' | 'hacker' | 'corporate' | 'educational'
  description: string
  template_data: {
    story_id: string
    title: string
    description: string
    full_description: string
    category: string
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master'
    estimated_duration: number
    scene_count: number
    progression_type: 'linear' | 'branching' | 'hub_based' | 'parallel' | 'open_world'
    min_players: number
    max_players: number
    recommended_players: number
    min_age: number
    max_age?: number
    setup_time: number
    location_type: 'indoor' | 'outdoor' | 'mixed'
    space_requirements: string
    required_materials: string[]
    tech_requirements: string[]
    optional_materials: string[]
    learning_objectives: string[]
    skills_developed: string[]
    knowledge_areas: string[]
    puzzle_types: string[]
    tech_integrations: string[]
    special_mechanics: Record<string, any>
    narrative_hook: string
    story_acts: StoryAct[]
    character_roles: CharacterRole[]
    story_themes: string[]
    difficulty_curve: Record<string, any>
    hint_system: Record<string, any>
    adaptive_difficulty: boolean
    qr_codes_enabled: boolean
    ar_features: Record<string, any>
    ai_characters: any[]
    voice_interactions: boolean
    gesture_controls: boolean
    accessibility_features: string[]
    language_support: string[]
    cultural_adaptations: Record<string, any>
    theme_config: Record<string, any>
    cover_image_url: string
    background_music_url?: string
    sound_effects: string[]
    visual_effects: string[]
    tags: string[]
  }
  default_settings: Record<string, any>
  customization_options: Record<string, any>
  difficulty_range: string[]
  player_range: { min: number; max: number }
  age_range: { min: number; max: number }
  duration_range: { min: number; max: number }
}

export interface StoryAct {
  act_id: string
  title: string
  description: string
  duration: number
  objectives: string[]
  scenes: StoryScene[]
  narrative_progression: string
  difficulty_escalation: number
}

export interface StoryScene {
  scene_id: string
  title: string
  description: string
  duration: number
  objectives: string[]
  puzzles: Puzzle[]
  interactions: Interaction[]
  qr_codes: QRCode[]
  ar_elements: ARElement[]
  hints: Hint[]
  rewards: Reward[]
}

export interface Puzzle {
  puzzle_id: string
  title: string
  type: string
  difficulty: string
  description: string
  mechanics: string[]
  tech_requirements?: string[]
  solution_method?: string
  hints?: string[]
  time_limit?: number
  points_reward?: number
}

export interface Interaction {
  interaction_id?: string
  type: string
  description?: string
  triggers?: string[]
  responses?: string[]
  tech_requirements?: string[]
  object?: string
  result?: string
  character?: string
  phrase?: string
  gesture?: string
  clues?: string[]
}

export interface QRCode {
  qr_id?: string
  content_type?: string
  content_data?: any
  location_description?: string
  ar_overlay?: any
  voice_activation?: boolean
  gesture_control?: boolean
  location?: string
  reveals?: string
  description?: string
}

export interface ARElement {
  element_id?: string
  type: string
  content?: any
  position?: { x: number; y: number; z: number }
  interaction_methods?: string[]
  trigger_conditions?: any
  trigger?: string
  effect?: string
}

export interface Hint {
  hint_level?: number
  hint_type?: string
  hint_text?: string
  delivery_method?: string
  cost?: number
  timing_rules?: any
  level?: number
  text?: string
}

export interface Reward {
  reward_type?: string
  content?: any
  points?: number
  unlocks?: string[]
  type?: string
  item?: string
}

export interface CharacterRole {
  role_id?: string
  name: string
  description: string
  special_abilities?: string[]
  equipment?: string[]
  backstory?: string
  objectives?: string[]
  id?: string
  abilities?: string[]
  color?: string
}

// MYSTERY THEME TEMPLATES
export const mysteryTemplates: StoryTemplate[] = [
  {
    template_id: 'mystery_detective_template',
    template_name: 'Detective Mystery Template',
    category: 'mystery',
    description: 'Classic detective story with evidence collection, interrogation, and deduction',
    template_data: {
      story_id: 'mystery_detective',
      title: 'Detective Mystery',
      description: 'A classic detective story requiring observation, deduction, and evidence analysis',
      full_description: 'Players take on the role of detectives investigating a crime. They must collect evidence, interview suspects, and piece together the truth through logical deduction.',
      category: 'mystery',
      difficulty: 'intermediate',
      estimated_duration: 50,
      scene_count: 8,
      progression_type: 'linear',
      min_players: 3,
      max_players: 8,
      recommended_players: 5,
      min_age: 12,
      max_age: 99,
      setup_time: 20,
      location_type: 'indoor',
      space_requirements: 'multiple_rooms',
      required_materials: ['Evidence bags', 'Magnifying glasses', 'Notebooks', 'Cameras', 'Suspect profiles'],
      tech_requirements: ['QR codes', 'AR overlays', 'Voice recognition'],
      optional_materials: ['Fingerprint powder', 'UV lights', 'Crime scene tape'],
      learning_objectives: ['Critical thinking', 'Evidence analysis', 'Logical deduction', 'Communication'],
      skills_developed: ['Observation', 'Analysis', 'Interrogation', 'Report writing'],
      knowledge_areas: ['Forensics', 'Criminal psychology', 'Legal procedures'],
      puzzle_types: ['logical', 'cryptographic', 'spatial', 'social'],
      tech_integrations: ['qr_code', 'ar_overlay', 'voice_recognition'],
      special_mechanics: {
        evidence_system: 'Collect and analyze physical evidence',
        interrogation_system: 'Question suspects with prepared questions',
        timeline_reconstruction: 'Build chronological sequence of events'
      },
      narrative_hook: 'A crime has been committed and you are the detectives assigned to solve it. The clock is ticking and the evidence is disappearing.',
      story_acts: [
        {
          act_id: 'act1_discovery',
          title: 'The Crime Scene',
          description: 'Discover and investigate the initial crime scene',
          duration: 15,
          objectives: ['Secure the crime scene', 'Collect initial evidence', 'Document findings'],
          scenes: [],
          narrative_progression: 'Players arrive at the crime scene and begin their investigation',
          difficulty_escalation: 1
        },
        {
          act_id: 'act2_investigation',
          title: 'The Investigation',
          description: 'Deep dive into evidence and suspect interviews',
          duration: 20,
          objectives: ['Interview suspects', 'Analyze evidence', 'Build case theory'],
          scenes: [],
          narrative_progression: 'Players conduct thorough investigation and build their case',
          difficulty_escalation: 2
        },
        {
          act_id: 'act3_revelation',
          title: 'The Revelation',
          description: 'Piece together the final solution and confront the culprit',
          duration: 15,
          objectives: ['Solve the case', 'Confront the culprit', 'Present evidence'],
          scenes: [],
          narrative_progression: 'Players solve the mystery and bring the case to resolution',
          difficulty_escalation: 3
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
        peak_difficulty: 'act3_revelation',
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
        suspect_profiles: true
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
      cover_image_url: '/images/templates/mystery-detective.jpg',
      background_music_url: '/audio/mystery-theme.mp3',
      sound_effects: ['footsteps', 'door_creak', 'typewriter'],
      visual_effects: ['film_noir', 'sepia_tone', 'shadow_play'],
      tags: ['detective', 'crime', 'investigation', 'mystery', 'forensics']
    },
    default_settings: {
      time_limit: 50,
      hint_cost: 10,
      evidence_required: 5,
      suspects_count: 3
    },
    customization_options: {
      crime_type: ['theft', 'murder', 'fraud', 'kidnapping'],
      setting: ['urban', 'rural', 'historical', 'futuristic'],
      difficulty_modifiers: ['easy', 'normal', 'hard', 'expert']
    },
    difficulty_range: ['beginner', 'intermediate', 'advanced'],
    player_range: { min: 3, max: 8 },
    age_range: { min: 12, max: 99 },
    duration_range: { min: 40, max: 70 }
  }
]

// FANTASY THEME TEMPLATES
export const fantasyTemplates: StoryTemplate[] = [
  {
    template_id: 'fantasy_magic_template',
    template_name: 'Fantasy Magic Template',
    category: 'fantasy',
    description: 'Magical adventure with elemental powers, mystical creatures, and enchanted quests',
    template_data: {
      story_id: 'fantasy_magic',
      title: 'Fantasy Magic Adventure',
      description: 'A magical quest involving elemental powers, mystical creatures, and enchanted artifacts',
      full_description: 'Players embark on a magical journey through enchanted realms, mastering elemental powers and interacting with mystical creatures to complete their quest.',
      category: 'fantasy',
      difficulty: 'intermediate',
      estimated_duration: 55,
      scene_count: 7,
      progression_type: 'hub_based',
      min_players: 3,
      max_players: 8,
      recommended_players: 5,
      min_age: 10,
      max_age: 99,
      setup_time: 25,
      location_type: 'mixed',
      space_requirements: 'large_room',
      required_materials: ['Magic wands', 'Elemental crystals', 'Ancient scrolls', 'Mystical artifacts'],
      tech_requirements: ['AR overlays', 'Gesture recognition', 'Voice commands'],
      optional_materials: ['Costumes', 'Props', 'Sound effects', 'Lighting'],
      learning_objectives: ['Creative thinking', 'Problem solving', 'Teamwork', 'Imagination'],
      skills_developed: ['Magic casting', 'Elemental mastery', 'Creature communication', 'Quest navigation'],
      knowledge_areas: ['Mythology', 'Elemental theory', 'Fantasy lore'],
      puzzle_types: ['logical', 'spatial', 'creative', 'linguistic'],
      tech_integrations: ['ar_overlay', 'gesture_control', 'voice_recognition'],
      special_mechanics: {
        elemental_system: 'Master fire, water, earth, and air elements',
        creature_interaction: 'Communicate with mystical creatures',
        magic_casting: 'Perform spells through gestures and voice'
      },
      narrative_hook: 'The realm is in danger and only those who master the ancient arts of magic can save it. Your journey begins now.',
      story_acts: [
        {
          act_id: 'act1_awakening',
          title: 'The Awakening',
          description: 'Discover magical abilities and begin training',
          duration: 15,
          objectives: ['Discover magic', 'Choose element', 'Begin training'],
          scenes: [],
          narrative_progression: 'Players discover their magical potential and begin their training',
          difficulty_escalation: 1
        },
        {
          act_id: 'act2_mastery',
          title: 'The Mastery',
          description: 'Master elemental powers and face challenges',
          duration: 25,
          objectives: ['Master elements', 'Face challenges', 'Gain allies'],
          scenes: [],
          narrative_progression: 'Players develop their magical abilities and face increasing challenges',
          difficulty_escalation: 2
        },
        {
          act_id: 'act3_quest',
          title: 'The Final Quest',
          description: 'Complete the ultimate magical quest',
          duration: 15,
          objectives: ['Complete quest', 'Save realm', 'Achieve mastery'],
          scenes: [],
          narrative_progression: 'Players face the ultimate challenge and save the realm',
          difficulty_escalation: 3
        }
      ],
      character_roles: [
        {
          role_id: 'elemental_mage',
          name: 'Elemental Mage',
          description: 'Master of elemental magic',
          special_abilities: ['Elemental casting', 'Weather control', 'Elemental communication'],
          equipment: ['Magic wand', 'Elemental crystals', 'Spell book'],
          backstory: 'Born with a natural connection to the elements',
          objectives: ['Master all elements', 'Protect the realm', 'Guide the party']
        },
        {
          role_id: 'creature_whisperer',
          name: 'Creature Whisperer',
          description: 'Communicator with mystical creatures',
          special_abilities: ['Creature communication', 'Animal empathy', 'Nature magic'],
          equipment: ['Communication crystal', 'Creature guide', 'Nature staff'],
          backstory: 'Gifted with the ability to understand all creatures',
          objectives: ['Befriend creatures', 'Gather information', 'Provide support']
        }
      ],
      story_themes: ['Courage', 'Friendship', 'Sacrifice', 'Power'],
      difficulty_curve: {
        progression: 'gradual',
        peak_difficulty: 'act3_quest',
        learning_curve: 'moderate'
      },
      hint_system: {
        type: 'magical',
        levels: 3,
        cost_system: 'mana',
        contextual_hints: true
      },
      adaptive_difficulty: true,
      qr_codes_enabled: true,
      ar_features: {
        magical_overlays: true,
        creature_animations: true,
        spell_effects: true
      },
      ai_characters: [
        {
          character_type: 'wise_wizard',
          personality: 'mysterious',
          dialogue_style: 'enigmatic'
        }
      ],
      voice_interactions: true,
      gesture_controls: true,
      accessibility_features: ['audio_descriptions', 'haptic_feedback', 'voice_commands'],
      language_support: ['en', 'es', 'fr', 'de'],
      cultural_adaptations: {
        mythologies: ['celtic', 'norse', 'greek', 'eastern'],
        magic_systems: ['elemental', 'runic', 'divine', 'arcane']
      },
      theme_config: {
        primary_color: '#8e44ad',
        secondary_color: '#3498db',
        accent_color: '#f1c40f',
        font_family: 'fantasy',
        atmosphere: 'mystical'
      },
      cover_image_url: '/images/templates/fantasy-magic.jpg',
      background_music_url: '/audio/fantasy-theme.mp3',
      sound_effects: ['magic_cast', 'creature_sounds', 'elemental_effects'],
      visual_effects: ['magical_auras', 'particle_effects', 'elemental_visuals'],
      tags: ['fantasy', 'magic', 'elements', 'creatures', 'quest']
    },
    default_settings: {
      time_limit: 55,
      mana_system: true,
      elements_count: 4,
      creatures_count: 3
    },
    customization_options: {
      magic_system: ['elemental', 'runic', 'divine', 'arcane'],
      setting: ['medieval', 'modern', 'steampunk', 'cyberpunk'],
      difficulty_modifiers: ['easy', 'normal', 'hard', 'expert']
    },
    difficulty_range: ['beginner', 'intermediate', 'advanced'],
    player_range: { min: 3, max: 8 },
    age_range: { min: 10, max: 99 },
    duration_range: { min: 45, max: 75 }
  }
]

// HACKER THEME TEMPLATES
export const hackerTemplates: StoryTemplate[] = [
  {
    template_id: 'hacker_cyber_template',
    template_name: 'Cyber Hacker Template',
    category: 'hacker',
    description: 'High-tech cybersecurity adventure with digital puzzles and network infiltration',
    template_data: {
      story_id: 'hacker_cyber',
      title: 'Cyber Hacker Mission',
      description: 'A high-tech cybersecurity mission involving network infiltration and digital puzzles',
      full_description: 'Players become cybersecurity experts infiltrating digital systems, solving complex puzzles, and preventing cyber attacks through technical expertise and teamwork.',
      category: 'hacker',
      difficulty: 'advanced',
      estimated_duration: 60,
      scene_count: 10,
      progression_type: 'parallel',
      min_players: 4,
      max_players: 8,
      recommended_players: 6,
      min_age: 16,
      max_age: 99,
      setup_time: 30,
      location_type: 'indoor',
      space_requirements: 'tech_lab',
      required_materials: ['Computers', 'Network equipment', 'Security tools', 'Digital devices'],
      tech_requirements: ['Network simulation', 'AR interfaces', 'Voice recognition', 'Biometric sensors'],
      optional_materials: ['VR headsets', 'Haptic feedback', 'Advanced displays'],
      learning_objectives: ['Cybersecurity', 'Network analysis', 'Digital forensics', 'Team coordination'],
      skills_developed: ['Hacking', 'Network security', 'Digital investigation', 'System administration'],
      knowledge_areas: ['Computer science', 'Cybersecurity', 'Network protocols'],
      puzzle_types: ['logical', 'digital', 'cryptographic', 'mathematical'],
      tech_integrations: ['ar_overlay', 'voice_recognition', 'biometric', 'nfc'],
      special_mechanics: {
        network_infiltration: 'Navigate through digital networks',
        code_cracking: 'Decrypt and analyze digital codes',
        system_override: 'Take control of digital systems'
      },
      narrative_hook: 'A critical system has been compromised. Your team must infiltrate the network, identify the threat, and prevent a catastrophic cyber attack.',
      story_acts: [
        {
          act_id: 'act1_infiltration',
          title: 'Network Infiltration',
          description: 'Gain access to the compromised system',
          duration: 20,
          objectives: ['Breach security', 'Establish connection', 'Avoid detection'],
          scenes: [],
          narrative_progression: 'Players begin their infiltration of the compromised network',
          difficulty_escalation: 1
        },
        {
          act_id: 'act2_investigation',
          title: 'Digital Investigation',
          description: 'Investigate the breach and identify the threat',
          duration: 25,
          objectives: ['Analyze breach', 'Identify threat', 'Gather evidence'],
          scenes: [],
          narrative_progression: 'Players investigate the breach and work to identify the threat',
          difficulty_escalation: 2
        },
        {
          act_id: 'act3_prevention',
          title: 'Threat Prevention',
          description: 'Prevent the cyber attack and secure the system',
          duration: 15,
          objectives: ['Prevent attack', 'Secure system', 'Complete mission'],
          scenes: [],
          narrative_progression: 'Players work to prevent the attack and secure the system',
          difficulty_escalation: 3
        }
      ],
      character_roles: [
        {
          role_id: 'penetration_tester',
          name: 'Penetration Tester',
          description: 'Expert in system infiltration and vulnerability assessment',
          special_abilities: ['System hacking', 'Vulnerability analysis', 'Security bypass'],
          equipment: ['Hacking tools', 'Security software', 'Network analyzer'],
          backstory: 'Former black hat hacker turned security professional',
          objectives: ['Breach systems', 'Identify vulnerabilities', 'Test security']
        },
        {
          role_id: 'digital_forensics',
          name: 'Digital Forensics Expert',
          description: 'Specialist in digital evidence collection and analysis',
          special_abilities: ['Evidence recovery', 'Data analysis', 'Timeline reconstruction'],
          equipment: ['Forensics tools', 'Data recovery software', 'Analysis workstation'],
          backstory: 'Expert in digital forensics with law enforcement background',
          objectives: ['Collect evidence', 'Analyze data', 'Build case']
        }
      ],
      story_themes: ['Security', 'Technology', 'Justice', 'Innovation'],
      difficulty_curve: {
        progression: 'steep',
        peak_difficulty: 'act3_prevention',
        learning_curve: 'challenging'
      },
      hint_system: {
        type: 'technical',
        levels: 4,
        cost_system: 'credits',
        contextual_hints: true
      },
      adaptive_difficulty: true,
      qr_codes_enabled: true,
      ar_features: {
        network_visualization: true,
        code_overlays: true,
        system_interfaces: true
      },
      ai_characters: [
        {
          character_type: 'ai_assistant',
          personality: 'logical',
          dialogue_style: 'technical'
        }
      ],
      voice_interactions: true,
      gesture_controls: true,
      accessibility_features: ['screen_reader', 'keyboard_navigation', 'high_contrast'],
      language_support: ['en', 'es', 'fr', 'de', 'ja'],
      cultural_adaptations: {
        tech_cultures: ['silicon_valley', 'european', 'asian', 'startup'],
        security_standards: ['iso', 'nist', 'pci', 'sox']
      },
      theme_config: {
        primary_color: '#00ff00',
        secondary_color: '#000000',
        accent_color: '#ff0000',
        font_family: 'monospace',
        atmosphere: 'cyberpunk'
      },
      cover_image_url: '/images/templates/hacker-cyber.jpg',
      background_music_url: '/audio/cyber-theme.mp3',
      sound_effects: ['keyboard_typing', 'system_beeps', 'network_sounds'],
      visual_effects: ['matrix_rain', 'neon_glow', 'digital_glitch'],
      tags: ['hacker', 'cybersecurity', 'digital', 'network', 'technology']
    },
    default_settings: {
      time_limit: 60,
      security_level: 'high',
      network_complexity: 'advanced',
      threat_level: 'critical'
    },
    customization_options: {
      attack_type: ['ransomware', 'data_breach', 'system_infiltration', 'social_engineering'],
      setting: ['corporate', 'government', 'financial', 'healthcare'],
      difficulty_modifiers: ['easy', 'normal', 'hard', 'expert']
    },
    difficulty_range: ['intermediate', 'advanced', 'expert'],
    player_range: { min: 4, max: 8 },
    age_range: { min: 16, max: 99 },
    duration_range: { min: 50, max: 80 }
  }
]

// CORPORATE THEME TEMPLATES
export const corporateTemplates: StoryTemplate[] = [
  {
    template_id: 'corporate_business_template',
    template_name: 'Corporate Business Template',
    category: 'corporate',
    description: 'Business strategy adventure with corporate challenges and ethical dilemmas',
    template_data: {
      story_id: 'corporate_business',
      title: 'Corporate Business Challenge',
      description: 'A business strategy adventure involving corporate challenges and ethical decision-making',
      full_description: 'Players navigate complex business scenarios, make strategic decisions, and face ethical dilemmas while working to achieve corporate objectives and maintain integrity.',
      category: 'corporate',
      difficulty: 'intermediate',
      estimated_duration: 50,
      scene_count: 7,
      progression_type: 'branching',
      min_players: 4,
      max_players: 10,
      recommended_players: 6,
      min_age: 16,
      max_age: 99,
      setup_time: 20,
      location_type: 'indoor',
      space_requirements: 'conference_room',
      required_materials: ['Business documents', 'Financial reports', 'Presentation materials', 'Decision matrices'],
      tech_requirements: ['Presentation software', 'AR overlays', 'Voice recognition'],
      optional_materials: ['Whiteboards', 'Flip charts', 'Calculators', 'Timers'],
      learning_objectives: ['Business strategy', 'Ethical decision-making', 'Leadership', 'Financial analysis'],
      skills_developed: ['Strategic thinking', 'Negotiation', 'Presentation', 'Risk assessment'],
      knowledge_areas: ['Business administration', 'Finance', 'Ethics', 'Leadership'],
      puzzle_types: ['logical', 'social', 'mathematical', 'creative'],
      tech_integrations: ['ar_overlay', 'voice_recognition', 'qr_code'],
      special_mechanics: {
        decision_matrix: 'Evaluate options using structured decision-making',
        negotiation_system: 'Engage in business negotiations',
        risk_assessment: 'Analyze and mitigate business risks'
      },
      narrative_hook: 'Your company faces a critical decision that will determine its future. Success requires strategic thinking, ethical leadership, and effective teamwork.',
      story_acts: [
        {
          act_id: 'act1_analysis',
          title: 'Situation Analysis',
          description: 'Analyze the business situation and identify key issues',
          duration: 15,
          objectives: ['Analyze situation', 'Identify issues', 'Gather information'],
          scenes: [],
          narrative_progression: 'Players analyze the business situation and identify key challenges',
          difficulty_escalation: 1
        },
        {
          act_id: 'act2_strategy',
          title: 'Strategy Development',
          description: 'Develop strategic solutions and evaluate options',
          duration: 20,
          objectives: ['Develop strategies', 'Evaluate options', 'Make decisions'],
          scenes: [],
          narrative_progression: 'Players develop strategic solutions and evaluate their options',
          difficulty_escalation: 2
        },
        {
          act_id: 'act3_execution',
          title: 'Strategy Execution',
          description: 'Execute the chosen strategy and handle consequences',
          duration: 15,
          objectives: ['Execute strategy', 'Handle consequences', 'Achieve objectives'],
          scenes: [],
          narrative_progression: 'Players execute their strategy and deal with the consequences',
          difficulty_escalation: 3
        }
      ],
      character_roles: [
        {
          role_id: 'ceo',
          name: 'Chief Executive Officer',
          description: 'Leader responsible for overall company strategy and direction',
          special_abilities: ['Strategic vision', 'Leadership', 'Decision making'],
          equipment: ['Executive briefcase', 'Company reports', 'Strategic plans'],
          backstory: 'Experienced executive with a track record of successful leadership',
          objectives: ['Lead the company', 'Make strategic decisions', 'Ensure success']
        },
        {
          role_id: 'cfo',
          name: 'Chief Financial Officer',
          description: 'Financial expert responsible for company finances and risk management',
          special_abilities: ['Financial analysis', 'Risk assessment', 'Budget management'],
          equipment: ['Financial reports', 'Risk models', 'Budget spreadsheets'],
          backstory: 'Finance professional with expertise in corporate finance and risk management',
          objectives: ['Manage finances', 'Assess risks', 'Ensure profitability']
        }
      ],
      story_themes: ['Leadership', 'Ethics', 'Innovation', 'Success'],
      difficulty_curve: {
        progression: 'moderate',
        peak_difficulty: 'act3_execution',
        learning_curve: 'moderate'
      },
      hint_system: {
        type: 'consultant',
        levels: 3,
        cost_system: 'consultation_fee',
        contextual_hints: true
      },
      adaptive_difficulty: true,
      qr_codes_enabled: true,
      ar_features: {
        data_visualization: true,
        presentation_overlays: true,
        financial_charts: true
      },
      ai_characters: [
        {
          character_type: 'business_consultant',
          personality: 'analytical',
          dialogue_style: 'professional'
        }
      ],
      voice_interactions: true,
      gesture_controls: false,
      accessibility_features: ['screen_reader', 'large_text', 'high_contrast'],
      language_support: ['en', 'es', 'fr', 'de', 'ja'],
      cultural_adaptations: {
        business_cultures: ['american', 'european', 'asian', 'latin_american'],
        industry_types: ['technology', 'finance', 'healthcare', 'manufacturing']
      },
      theme_config: {
        primary_color: '#2c3e50',
        secondary_color: '#3498db',
        accent_color: '#e74c3c',
        font_family: 'sans-serif',
        atmosphere: 'professional'
      },
      cover_image_url: '/images/templates/corporate-business.jpg',
      background_music_url: '/audio/corporate-theme.mp3',
      sound_effects: ['phone_ringing', 'keyboard_typing', 'meeting_sounds'],
      visual_effects: ['professional_graphics', 'data_visualizations', 'corporate_animations'],
      tags: ['corporate', 'business', 'strategy', 'leadership', 'ethics']
    },
    default_settings: {
      time_limit: 50,
      decision_points: 5,
      risk_level: 'medium',
      ethical_dilemmas: 3
    },
    customization_options: {
      industry: ['technology', 'finance', 'healthcare', 'manufacturing'],
      company_size: ['startup', 'medium', 'large', 'enterprise'],
      difficulty_modifiers: ['easy', 'normal', 'hard', 'expert']
    },
    difficulty_range: ['beginner', 'intermediate', 'advanced'],
    player_range: { min: 4, max: 10 },
    age_range: { min: 16, max: 99 },
    duration_range: { min: 40, max: 70 }
  }
]

// EDUCATIONAL THEME TEMPLATES
export const educationalTemplates: StoryTemplate[] = [
  {
    template_id: 'educational_science_template',
    template_name: 'Educational Science Template',
    category: 'educational',
    description: 'Science learning adventure with experiments, discoveries, and scientific method',
    template_data: {
      story_id: 'educational_science',
      title: 'Science Discovery Adventure',
      description: 'An educational adventure combining science learning with interactive experiments and discoveries',
      full_description: 'Players become scientists conducting experiments, making discoveries, and learning scientific concepts through hands-on activities and problem-solving challenges.',
      category: 'educational',
      difficulty: 'intermediate',
      estimated_duration: 55,
      scene_count: 8,
      progression_type: 'linear',
      min_players: 4,
      max_players: 10,
      recommended_players: 6,
      min_age: 10,
      max_age: 99,
      setup_time: 25,
      location_type: 'indoor',
      space_requirements: 'science_lab',
      required_materials: ['Lab equipment', 'Scientific instruments', 'Experiment materials', 'Safety gear'],
      tech_requirements: ['AR overlays', 'Voice recognition', 'Data visualization'],
      optional_materials: ['Microscopes', 'Telescopes', 'Measurement tools', 'Safety equipment'],
      learning_objectives: ['Scientific method', 'Critical thinking', 'Problem solving', 'Teamwork'],
      skills_developed: ['Observation', 'Hypothesis formation', 'Data analysis', 'Scientific communication'],
      knowledge_areas: ['Physics', 'Chemistry', 'Biology', 'Earth science'],
      puzzle_types: ['logical', 'scientific', 'mathematical', 'creative'],
      tech_integrations: ['ar_overlay', 'voice_recognition', 'qr_code'],
      special_mechanics: {
        experiment_system: 'Conduct scientific experiments',
        hypothesis_testing: 'Form and test scientific hypotheses',
        data_analysis: 'Analyze experimental data'
      },
      narrative_hook: 'A mysterious scientific phenomenon has been discovered. Your team must investigate, conduct experiments, and uncover the scientific principles behind it.',
      story_acts: [
        {
          act_id: 'act1_observation',
          title: 'Initial Observation',
          description: 'Observe the phenomenon and form initial hypotheses',
          duration: 15,
          objectives: ['Observe phenomenon', 'Form hypotheses', 'Plan investigation'],
          scenes: [],
          narrative_progression: 'Players observe the mysterious phenomenon and begin their investigation',
          difficulty_escalation: 1
        },
        {
          act_id: 'act2_experimentation',
          title: 'Scientific Experimentation',
          description: 'Conduct experiments to test hypotheses',
          duration: 25,
          objectives: ['Design experiments', 'Collect data', 'Test hypotheses'],
          scenes: [],
          narrative_progression: 'Players conduct experiments and gather scientific data',
          difficulty_escalation: 2
        },
        {
          act_id: 'act3_discovery',
          title: 'Scientific Discovery',
          description: 'Analyze results and make scientific discoveries',
          duration: 15,
          objectives: ['Analyze data', 'Make discoveries', 'Communicate findings'],
          scenes: [],
          narrative_progression: 'Players analyze their data and make scientific discoveries',
          difficulty_escalation: 3
        }
      ],
      character_roles: [
        {
          role_id: 'lead_scientist',
          name: 'Lead Scientist',
          description: 'Principal investigator leading the scientific research',
          special_abilities: ['Research design', 'Data analysis', 'Scientific communication'],
          equipment: ['Research notebook', 'Scientific instruments', 'Analysis software'],
          backstory: 'Experienced scientist with expertise in multiple scientific disciplines',
          objectives: ['Lead research', 'Design experiments', 'Analyze results']
        },
        {
          role_id: 'lab_technician',
          name: 'Lab Technician',
          description: 'Technical expert responsible for equipment and procedures',
          special_abilities: ['Equipment operation', 'Safety protocols', 'Data collection'],
          equipment: ['Lab tools', 'Safety equipment', 'Measurement devices'],
          backstory: 'Skilled technician with extensive experience in laboratory procedures',
          objectives: ['Operate equipment', 'Ensure safety', 'Collect data']
        }
      ],
      story_themes: ['Discovery', 'Knowledge', 'Innovation', 'Understanding'],
      difficulty_curve: {
        progression: 'gradual',
        peak_difficulty: 'act3_discovery',
        learning_curve: 'moderate'
      },
      hint_system: {
        type: 'scientific',
        levels: 3,
        cost_system: 'research_points',
        contextual_hints: true
      },
      adaptive_difficulty: true,
      qr_codes_enabled: true,
      ar_features: {
        experiment_visualization: true,
        data_overlays: true,
        scientific_models: true
      },
      ai_characters: [
        {
          character_type: 'scientific_mentor',
          personality: 'curious',
          dialogue_style: 'inquisitive'
        }
      ],
      voice_interactions: true,
      gesture_controls: true,
      accessibility_features: ['audio_descriptions', 'large_text', 'high_contrast'],
      language_support: ['en', 'es', 'fr', 'de', 'ja'],
      cultural_adaptations: {
        scientific_traditions: ['western', 'eastern', 'indigenous', 'modern'],
        educational_levels: ['elementary', 'middle', 'high', 'university']
      },
      theme_config: {
        primary_color: '#27ae60',
        secondary_color: '#3498db',
        accent_color: '#f39c12',
        font_family: 'sans-serif',
        atmosphere: 'scientific'
      },
      cover_image_url: '/images/templates/educational-science.jpg',
      background_music_url: '/audio/science-theme.mp3',
      sound_effects: ['lab_sounds', 'equipment_beeps', 'experiment_sounds'],
      visual_effects: ['scientific_animations', 'data_visualizations', 'experiment_effects'],
      tags: ['educational', 'science', 'experiment', 'discovery', 'learning']
    },
    default_settings: {
      time_limit: 55,
      experiments_count: 4,
      difficulty_level: 'intermediate',
      safety_emphasis: true
    },
    customization_options: {
      science_discipline: ['physics', 'chemistry', 'biology', 'earth_science'],
      age_level: ['elementary', 'middle', 'high', 'university'],
      difficulty_modifiers: ['easy', 'normal', 'hard', 'expert']
    },
    difficulty_range: ['beginner', 'intermediate', 'advanced'],
    player_range: { min: 4, max: 10 },
    age_range: { min: 10, max: 99 },
    duration_range: { min: 45, max: 75 }
  }
]

// Export all templates
export const allStoryTemplates: StoryTemplate[] = [
  ...mysteryTemplates,
  ...fantasyTemplates,
  ...hackerTemplates,
  ...corporateTemplates,
  ...educationalTemplates
]

// Template utility functions
export function getTemplatesByCategory(category: string): StoryTemplate[] {
  return allStoryTemplates.filter(template => template.category === category)
}

export function getTemplateById(templateId: string): StoryTemplate | undefined {
  return allStoryTemplates.find(template => template.template_id === templateId)
}

export function getTemplatesByDifficulty(difficulty: string): StoryTemplate[] {
  return allStoryTemplates.filter(template => 
    template.difficulty_range.includes(difficulty)
  )
}

export function getTemplatesByPlayerCount(playerCount: number): StoryTemplate[] {
  return allStoryTemplates.filter(template => 
    playerCount >= template.player_range.min && 
    playerCount <= template.player_range.max
  )
}
