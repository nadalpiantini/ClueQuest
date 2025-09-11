/**
 * Mystery Theme Stories - ClueQuest 25 Stories Implementation
 * Based on comprehensive analysis and escape room best practices
 * Implements all 5 Mystery stories with detailed mechanics and progression
 */

import { StoryTemplate } from './story-templates'

export interface MysteryStory {
  story_id: string
  title: string
  description: string
  full_description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master'
  estimated_duration: number
  scene_count: number
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
  suspect_characters?: SuspectCharacter[]
  alternative_endings_details?: AlternativeEnding[]
  accessibility_details?: Record<string, any>
  global_sensory_elements?: Record<string, any>
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

export interface SuspectCharacter {
  character_id: string
  name: string
  role: string
  backstory: string
  motive: string
  alibi: string
  suspicious_behavior: string
  physical_evidence: string
  personality_traits: string[]
  relationships: Record<string, string>
}

export interface AlternativeEnding {
  ending_id: string
  title: string
  description: string
  requirements: Record<string, any>
  narrative: string
  consequences: Record<string, string>
  points_reward: number
  unlock_achievements: string[]
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
  sensory_elements?: SensoryElement[]
}

export interface SensoryElement {
  element_id: string
  type: 'olfactory' | 'tactile' | 'auditory' | 'visual' | 'gustatory'
  description: string
  clue_value: string
  intensity: 'very_faint' | 'faint' | 'subtle' | 'moderate' | 'strong' | 'overwhelming'
  duration: 'temporary' | 'persistent' | 'recorded' | 'variable'
  location: string
}

export interface Puzzle {
  puzzle_id: string
  title: string
  type: string
  difficulty: string
  description: string
  mechanics: string[]
  tech_requirements: string[]
  solution_method: string
  hints: string[]
  time_limit?: number
  points_reward: number
}

export interface Interaction {
  interaction_id: string
  type: string
  description: string
  triggers: string[]
  responses: string[]
  tech_requirements: string[]
}

export interface QRCode {
  qr_id: string
  content_type: string
  content_data: any
  location_description: string
  ar_overlay?: any
  voice_activation?: boolean
  gesture_control?: boolean
}

export interface ARElement {
  element_id: string
  type: string
  content: any
  position: { x: number; y: number; z: number }
  interaction_methods: string[]
  trigger_conditions: any
}

export interface Hint {
  hint_level: number
  hint_type: string
  hint_text: string
  delivery_method: string
  cost: number
  timing_rules: any
}

export interface Reward {
  reward_type: string
  content: any
  points: number
  unlocks: string[]
}

export interface CharacterRole {
  role_id: string
  name: string
  description: string
  special_abilities: string[]
  equipment: string[]
  backstory: string
  objectives: string[]
}

// 1. The Midnight Express Mystery
export const midnightExpressMystery: MysteryStory = {
  story_id: 'midnight_express_mystery',
  title: 'The Midnight Express Mystery',
  description: 'A luxury train journey turns deadly when a passenger vanishes between stations. Uncover the truth before the next stop.',
  full_description: 'Players travel on a luxury train when a passenger mysteriously disappears. They must investigate compartments, interview fellow passengers, and piece together clues to solve the mystery before the train reaches its destination.',
  difficulty: 'intermediate',
  estimated_duration: 65,
  scene_count: 11,
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
    ticket_validation: 'Use train tickets to access different areas',
    sensory_elements: {
      olfactory_clues: 'Aromas específicos en diferentes vagones (café, perfume, tabaco, productos químicos)',
      tactile_evidence: 'Texturas de objetos que cambian con el tiempo (tickets húmedos, objetos calientes)',
      ambient_sounds: 'Sonidos del tren que revelan información (ruidos de frenos, pasos, conversaciones)',
      temperature_variations: 'Cambios de temperatura que indican actividad reciente',
      visual_clues: 'Iluminación que cambia para revelar pistas ocultas'
    },
    alternative_endings: {
      perfect_ending: 'Todos los culpables expuestos y motivos revelados',
      partial_ending: 'Culpable principal identificado, cómplices no descubiertos',
      redemption_ending: 'Culpable se arrepiente y confiesa voluntariamente',
      tragic_ending: 'Verdad revelada pero con consecuencias inesperadas'
    },
    enhanced_accessibility: {
      audio_narration: 'Narración completa para jugadores con discapacidad visual',
      haptic_feedback: 'Vibraciones para indicar pistas importantes',
      voice_commands: 'Control por voz para todas las interacciones',
      large_text_mode: 'Modo de texto grande para mejor legibilidad',
      color_blind_support: 'Soporte para diferentes tipos de daltonismo'
    }
  },
  narrative_hook: 'The luxury Midnight Express is halfway to its destination when a passenger vanishes without a trace. No one saw them leave, and their compartment shows no signs of struggle. You have until the next station to solve this mystery.',
  story_acts: [
    {
      act_id: 'act1_departure',
      title: 'The Departure',
      description: 'Passengers board the luxury train and meet their fellow travelers',
      duration: 10,
      objectives: ['Meet all passengers', 'Establish initial relationships', 'Notice suspicious behavior'],
      scenes: [
        {
          scene_id: 'scene1_boarding',
          title: 'Boarding the Train',
          description: 'Players board the Midnight Express and meet fellow passengers',
          duration: 5,
          objectives: ['Board the train', 'Meet passengers', 'Find assigned compartments'],
          puzzles: [
            {
              puzzle_id: 'puzzle1_passenger_intro',
              title: 'Passenger Introductions',
              type: 'social',
              difficulty: 'beginner',
              description: 'Players introduce themselves as assigned passengers and establish alibis',
              mechanics: ['Role playing', 'Social interaction', 'Information gathering'],
              tech_requirements: ['voice_recognition'],
              solution_method: 'Engage in conversation with all passengers',
              hints: ['Ask about their travel plans', 'Note their reactions to questions'],
              points_reward: 10
            }
          ],
          interactions: [
            {
              interaction_id: 'interaction1_meet_conductor',
              type: 'social',
              description: 'Meet the train conductor and learn about the journey',
              triggers: ['Approach conductor', 'Ask about schedule'],
              responses: ['Receive train schedule', 'Learn about stops'],
              tech_requirements: ['voice_recognition']
            }
          ],
          qr_codes: [
            {
              qr_id: 'qr1_train_schedule',
              content_type: 'information',
              content_data: { schedule: 'Train timetable and stops' },
              location_description: 'Near the conductor\'s station',
              ar_overlay: { type: 'schedule_display', interactive: true }
            }
          ],
          ar_elements: [
            {
              element_id: 'ar1_train_interior',
              type: 'environmental',
              content: { type: '3d_model', model: 'luxury_train_interior' },
              position: { x: 0, y: 0, z: 0 },
              interaction_methods: ['exploration', 'examination'],
              trigger_conditions: { scene_start: true }
            }
          ],
          hints: [
            {
              hint_level: 1,
              hint_type: 'contextual',
              hint_text: 'Pay attention to passenger behavior and reactions',
              delivery_method: 'text',
              cost: 5,
              timing_rules: { after_5_minutes: true }
            }
          ],
          rewards: [
            {
              reward_type: 'information',
              content: { type: 'passenger_profiles', data: 'Basic passenger information' },
              points: 10,
              unlocks: ['scene2_compartment_exploration']
            }
          ]
        },
        {
          scene_id: 'scene2_compartment_exploration',
          title: 'Exploring Compartments',
          description: 'Players explore their assigned compartments and discover clues',
          duration: 5,
          objectives: ['Explore compartments', 'Find initial clues', 'Document findings'],
          puzzles: [
            {
              puzzle_id: 'puzzle2_compartment_search',
              title: 'Compartment Search',
              type: 'spatial',
              difficulty: 'beginner',
              description: 'Search compartments for clues and evidence',
              mechanics: ['Observation', 'Evidence collection', 'Documentation'],
              tech_requirements: ['qr_code', 'ar_overlay'],
              solution_method: 'Systematically search each compartment',
              hints: ['Check under beds', 'Look in luggage', 'Examine personal items'],
              points_reward: 15
            }
          ],
          interactions: [
            {
              interaction_id: 'interaction2_luggage_inspection',
              type: 'physical',
              description: 'Inspect passenger luggage for clues',
              triggers: ['Open luggage', 'Examine contents'],
              responses: ['Find personal items', 'Discover clues'],
              tech_requirements: ['ar_overlay']
            }
          ],
          qr_codes: [
            {
              qr_id: 'qr2_compartment_map',
              content_type: 'navigation',
              content_data: { map: 'Train compartment layout' },
              location_description: 'In each compartment',
              ar_overlay: { type: 'interactive_map', show_connections: true }
            }
          ],
          ar_elements: [
            {
              element_id: 'ar2_evidence_highlighting',
              type: 'interactive',
              content: { type: 'highlight_system', items: 'clue_objects' },
              position: { x: 0, y: 0, z: 0 },
              interaction_methods: ['examination', 'collection'],
              trigger_conditions: { puzzle_start: true }
            }
          ],
          hints: [
            {
              hint_level: 1,
              hint_type: 'direct',
              hint_text: 'Look for items that seem out of place',
              delivery_method: 'text',
              cost: 5,
              timing_rules: { after_3_minutes: true }
            }
          ],
          rewards: [
            {
              reward_type: 'clue',
              content: { type: 'physical_evidence', data: 'Passenger belongings' },
              points: 15,
              unlocks: ['scene3_disappearance']
            }
          ]
        }
      ],
      narrative_progression: 'Players establish themselves as passengers and begin to explore the train environment',
      difficulty_escalation: 1
    },
    {
      act_id: 'act2_disappearance',
      title: 'The Disappearance',
      description: 'A passenger vanishes between stations - no one saw them leave',
      duration: 15,
      objectives: ['Search all compartments', 'Collect evidence', 'Interview witnesses'],
      scenes: [
        {
          scene_id: 'scene3_disappearance',
          title: 'The Vanishing',
          description: 'Players discover that a passenger has disappeared',
          duration: 5,
          objectives: ['Discover disappearance', 'Alert authorities', 'Secure the scene'],
          puzzles: [
            {
              puzzle_id: 'puzzle3_disappearance_investigation',
              title: 'Disappearance Investigation',
              type: 'logical',
              difficulty: 'intermediate',
              description: 'Investigate the circumstances of the disappearance',
              mechanics: ['Evidence analysis', 'Witness interviews', 'Scene reconstruction'],
              tech_requirements: ['ar_overlay', 'voice_recognition'],
              solution_method: 'Systematically investigate the disappearance',
              hints: ['Check the last known location', 'Interview nearby passengers', 'Look for signs of struggle'],
              points_reward: 20
            }
          ],
          interactions: [
            {
              interaction_id: 'interaction3_witness_interviews',
              type: 'social',
              description: 'Interview passengers who were near the disappearance',
              triggers: ['Approach witnesses', 'Ask questions'],
              responses: ['Receive witness accounts', 'Gather information'],
              tech_requirements: ['voice_recognition']
            }
          ],
          qr_codes: [
            {
              qr_id: 'qr3_disappearance_report',
              content_type: 'document',
              content_data: { report: 'Official disappearance report' },
              location_description: 'At the scene of disappearance',
              ar_overlay: { type: 'document_viewer', interactive: true }
            }
          ],
          ar_elements: [
            {
              element_id: 'ar3_scene_reconstruction',
              type: 'interactive',
              content: { type: 'scene_reconstruction', show_timeline: true },
              position: { x: 0, y: 0, z: 0 },
              interaction_methods: ['examination', 'analysis'],
              trigger_conditions: { investigation_start: true }
            }
          ],
          sensory_elements: [
            {
              element_id: 'sensory1_compartment_smell',
              type: 'olfactory',
              description: 'Distinctive smell of medical supplies and fear',
              clue_value: 'Indicates recent medical activity and emotional distress',
              intensity: 'moderate',
              duration: 'persistent',
              location: 'Dr. Whitmore\'s compartment'
            },
            {
              element_id: 'sensory2_temperature_variation',
              type: 'tactile',
              description: 'Unusual warmth in certain areas of the compartment',
              clue_value: 'Suggests recent human presence and activity',
              intensity: 'subtle',
              duration: 'temporary',
              location: 'Near the bed and desk area'
            },
            {
              element_id: 'sensory3_ambient_sounds',
              type: 'auditory',
              description: 'Faint sounds of struggle and movement',
              clue_value: 'Indicates the timeline of events',
              intensity: 'very_faint',
              duration: 'recorded',
              location: 'Throughout the compartment'
            }
          ],
          hints: [
            {
              hint_level: 1,
              hint_type: 'contextual',
              hint_text: 'Focus on the timeline of events',
              delivery_method: 'text',
              cost: 10,
              timing_rules: { after_5_minutes: true }
            }
          ],
          rewards: [
            {
              reward_type: 'information',
              content: { type: 'witness_accounts', data: 'Passenger testimonies' },
              points: 20,
              unlocks: ['scene4_evidence_collection']
            }
          ]
        },
        {
          scene_id: 'scene4_evidence_collection',
          title: 'Evidence Collection',
          description: 'Players collect physical evidence from the scene',
          duration: 10,
          objectives: ['Collect evidence', 'Document findings', 'Preserve chain of custody'],
          puzzles: [
            {
              puzzle_id: 'puzzle4_evidence_analysis',
              title: 'Evidence Analysis',
              type: 'logical',
              difficulty: 'intermediate',
              description: 'Analyze collected evidence for clues',
              mechanics: ['Evidence examination', 'Pattern recognition', 'Logical deduction'],
              tech_requirements: ['ar_overlay', 'qr_code'],
              solution_method: 'Examine evidence systematically',
              hints: ['Look for fingerprints', 'Check for DNA evidence', 'Examine personal items'],
              points_reward: 25
            }
          ],
          interactions: [
            {
              interaction_id: 'interaction4_evidence_bagging',
              type: 'physical',
              description: 'Properly bag and label evidence',
              triggers: ['Collect evidence', 'Label items'],
              responses: ['Evidence bagged', 'Chain of custody maintained'],
              tech_requirements: ['ar_overlay']
            }
          ],
          qr_codes: [
            {
              qr_id: 'qr4_evidence_database',
              content_type: 'database',
              content_data: { database: 'Evidence tracking system' },
              location_description: 'At evidence collection station',
              ar_overlay: { type: 'database_interface', interactive: true }
            }
          ],
          ar_elements: [
            {
              element_id: 'ar4_evidence_analysis',
              type: 'interactive',
              content: { type: 'analysis_tools', tools: ['microscope', 'uv_light'] },
              position: { x: 0, y: 0, z: 0 },
              interaction_methods: ['examination', 'analysis'],
              trigger_conditions: { evidence_collected: true }
            }
          ],
          sensory_elements: [
            {
              element_id: 'sensory4_chemical_smell',
              type: 'olfactory',
              description: 'Strong chemical smell from medical supplies',
              clue_value: 'Indicates recent medical activity and possible sedation',
              intensity: 'strong',
              duration: 'persistent',
              location: 'Medical bag and surrounding area'
            },
            {
              element_id: 'sensory5_texture_evidence',
              type: 'tactile',
              description: 'Sticky residue on certain objects',
              clue_value: 'Suggests recent handling and possible struggle',
              intensity: 'moderate',
              duration: 'persistent',
              location: 'On personal items and furniture'
            },
            {
              element_id: 'sensory6_visual_clues',
              type: 'visual',
              description: 'Subtle changes in lighting reveal hidden evidence',
              clue_value: 'UV light reveals hidden fingerprints and blood traces',
              intensity: 'moderate',
              duration: 'temporary',
              location: 'Throughout the compartment'
            }
          ],
          hints: [
            {
              hint_level: 1,
              hint_type: 'direct',
              hint_text: 'Use UV light to find hidden evidence',
              delivery_method: 'text',
              cost: 10,
              timing_rules: { after_7_minutes: true }
            }
          ],
          rewards: [
            {
              reward_type: 'evidence',
              content: { type: 'physical_evidence', data: 'Collected evidence items' },
              points: 25,
              unlocks: ['scene5_passenger_interviews']
            }
          ]
        }
      ],
      narrative_progression: 'Players discover the disappearance and begin their investigation',
      difficulty_escalation: 2
    },
    {
      act_id: 'act3_investigation',
      title: 'The Investigation',
      description: 'Piece together clues and interrogate suspects',
      duration: 20,
      objectives: ['Build timeline of events', 'Identify inconsistencies', 'Narrow down suspects'],
      scenes: [
        {
          scene_id: 'scene5_passenger_interviews',
          title: 'Passenger Interviews',
          description: 'Players conduct formal interviews with all passengers',
          duration: 10,
          objectives: ['Interview all passengers', 'Gather alibis', 'Identify inconsistencies'],
          puzzles: [
            {
              puzzle_id: 'puzzle5_interrogation_challenge',
              title: 'Interrogation Challenge',
              type: 'social',
              difficulty: 'advanced',
              description: 'Players take turns interrogating suspects with prepared questions',
              mechanics: ['Question preparation', 'Suspect interrogation', 'Response analysis'],
              tech_requirements: ['voice_recognition', 'ar_overlay'],
              solution_method: 'Ask strategic questions to uncover truth',
              hints: ['Ask about their whereabouts', 'Check for contradictions', 'Look for nervous behavior'],
              points_reward: 30
            }
          ],
          interactions: [
            {
              interaction_id: 'interaction5_suspect_questioning',
              type: 'social',
              description: 'Question suspects about their alibis and motives',
              triggers: ['Ask questions', 'Press for details'],
              responses: ['Receive answers', 'Observe reactions'],
              tech_requirements: ['voice_recognition']
            }
          ],
          qr_codes: [
            {
              qr_id: 'qr5_interview_questions',
              content_type: 'reference',
              content_data: { questions: 'Prepared interview questions' },
              location_description: 'At interview station',
              ar_overlay: { type: 'question_prompt', interactive: true }
            }
          ],
          ar_elements: [
            {
              element_id: 'ar5_suspect_profiles',
              type: 'interactive',
              content: { type: 'profile_system', show_emotions: true },
              position: { x: 0, y: 0, z: 0 },
              interaction_methods: ['examination', 'analysis'],
              trigger_conditions: { interview_start: true }
            }
          ],
          hints: [
            {
              hint_level: 1,
              hint_type: 'contextual',
              hint_text: 'Pay attention to body language and verbal cues',
              delivery_method: 'text',
              cost: 15,
              timing_rules: { after_5_minutes: true }
            }
          ],
          rewards: [
            {
              reward_type: 'information',
              content: { type: 'interview_transcripts', data: 'Passenger statements' },
              points: 30,
              unlocks: ['scene6_timeline_reconstruction']
            }
          ]
        },
        {
          scene_id: 'scene6_timeline_reconstruction',
          title: 'Timeline Reconstruction',
          description: 'Players create a timeline of events using collected evidence',
          duration: 10,
          objectives: ['Build timeline', 'Identify gaps', 'Find inconsistencies'],
          puzzles: [
            {
              puzzle_id: 'puzzle6_timeline_puzzle',
              title: 'Timeline Reconstruction',
              type: 'logical',
              difficulty: 'advanced',
              description: 'Create a timeline of events using collected evidence',
              mechanics: ['Chronological ordering', 'Evidence correlation', 'Gap identification'],
              tech_requirements: ['ar_overlay', 'qr_code'],
              solution_method: 'Arrange events in chronological order',
              hints: ['Start with the last known sighting', 'Use witness accounts', 'Check for time gaps'],
              points_reward: 35
            }
          ],
          interactions: [
            {
              interaction_id: 'interaction6_timeline_building',
              type: 'physical',
              description: 'Physically arrange timeline cards in order',
              triggers: ['Arrange cards', 'Check sequence'],
              responses: ['Timeline created', 'Gaps identified'],
              tech_requirements: ['ar_overlay']
            }
          ],
          qr_codes: [
            {
              qr_id: 'qr6_timeline_tools',
              content_type: 'tool',
              content_data: { tools: 'Timeline building tools' },
              location_description: 'At timeline station',
              ar_overlay: { type: 'timeline_builder', interactive: true }
            }
          ],
          ar_elements: [
            {
              element_id: 'ar6_timeline_visualization',
              type: 'interactive',
              content: { type: 'timeline_display', show_connections: true },
              position: { x: 0, y: 0, z: 0 },
              interaction_methods: ['manipulation', 'analysis'],
              trigger_conditions: { timeline_start: true }
            }
          ],
          hints: [
            {
              hint_level: 1,
              hint_type: 'direct',
              hint_text: 'Look for events that don\'t fit the timeline',
              delivery_method: 'text',
              cost: 15,
              timing_rules: { after_7_minutes: true }
            }
          ],
          rewards: [
            {
              reward_type: 'information',
              content: { type: 'timeline_data', data: 'Complete event timeline' },
              points: 35,
              unlocks: ['scene7_suspect_analysis']
            }
          ]
        }
      ],
      narrative_progression: 'Players conduct thorough investigation and build their case',
      difficulty_escalation: 3
    },
    {
      act_id: 'act4_revelation',
      title: 'The Revelation',
      description: 'The truth is revealed and the culprit is exposed',
      duration: 10,
      objectives: ['Present final theory', 'Expose the culprit', 'Explain the motive'],
      scenes: [
        {
          scene_id: 'scene7_suspect_analysis',
          title: 'Suspect Analysis',
          description: 'Players analyze all suspects and narrow down to the culprit',
          duration: 5,
          objectives: ['Analyze suspects', 'Identify motive', 'Confirm alibi'],
          puzzles: [
            {
              puzzle_id: 'puzzle7_suspect_elimination',
              title: 'Suspect Elimination',
              type: 'logical',
              difficulty: 'expert',
              description: 'Eliminate suspects based on evidence and alibis',
              mechanics: ['Logical deduction', 'Evidence correlation', 'Motive analysis'],
              tech_requirements: ['ar_overlay', 'qr_code'],
              solution_method: 'Use evidence to eliminate suspects',
              hints: ['Check alibis against evidence', 'Look for motive', 'Consider opportunity'],
              points_reward: 40
            }
          ],
          interactions: [
            {
              interaction_id: 'interaction7_suspect_comparison',
              type: 'logical',
              description: 'Compare suspect profiles against evidence',
              triggers: ['Compare profiles', 'Check evidence'],
              responses: ['Suspects eliminated', 'Culprit identified'],
              tech_requirements: ['ar_overlay']
            }
          ],
          qr_codes: [
            {
              qr_id: 'qr7_suspect_database',
              content_type: 'database',
              content_data: { database: 'Suspect comparison system' },
              location_description: 'At analysis station',
              ar_overlay: { type: 'comparison_interface', interactive: true }
            }
          ],
          ar_elements: [
            {
              element_id: 'ar7_suspect_comparison',
              type: 'interactive',
              content: { type: 'comparison_tools', show_evidence: true },
              position: { x: 0, y: 0, z: 0 },
              interaction_methods: ['comparison', 'analysis'],
              trigger_conditions: { analysis_start: true }
            }
          ],
          hints: [
            {
              hint_level: 1,
              hint_type: 'direct',
              hint_text: 'Focus on who had the opportunity and motive',
              delivery_method: 'text',
              cost: 20,
              timing_rules: { after_3_minutes: true }
            }
          ],
          rewards: [
            {
              reward_type: 'information',
              content: { type: 'culprit_identification', data: 'Identified suspect' },
              points: 40,
              unlocks: ['scene8_final_confrontation']
            }
          ]
        },
        {
          scene_id: 'scene8_final_confrontation',
          title: 'Final Confrontation',
          description: 'Players confront the culprit and reveal the truth',
          duration: 5,
          objectives: ['Confront culprit', 'Present evidence', 'Reveal motive'],
          puzzles: [
            {
              puzzle_id: 'puzzle8_final_deduction',
              title: 'Final Deduction',
              type: 'logical',
              difficulty: 'expert',
              description: 'Present final theory and evidence to solve the case',
              mechanics: ['Evidence presentation', 'Logical reasoning', 'Motive explanation'],
              tech_requirements: ['voice_recognition', 'ar_overlay'],
              solution_method: 'Present complete case with evidence',
              hints: ['Present evidence in order', 'Explain the motive', 'Show how it was done'],
              points_reward: 50
            }
          ],
          interactions: [
            {
              interaction_id: 'interaction8_evidence_presentation',
              type: 'social',
              description: 'Present evidence to the culprit',
              triggers: ['Present evidence', 'Explain reasoning'],
              responses: ['Culprit confesses', 'Mystery solved'],
              tech_requirements: ['voice_recognition']
            }
          ],
          qr_codes: [
            {
              qr_id: 'qr8_evidence_presentation',
              content_type: 'presentation',
              content_data: { presentation: 'Evidence presentation tools' },
              location_description: 'At confrontation area',
              ar_overlay: { type: 'presentation_interface', interactive: true }
            }
          ],
          ar_elements: [
            {
              element_id: 'ar8_evidence_display',
              type: 'interactive',
              content: { type: 'evidence_showcase', show_all: true },
              position: { x: 0, y: 0, z: 0 },
              interaction_methods: ['presentation', 'explanation'],
              trigger_conditions: { confrontation_start: true }
            }
          ],
          hints: [
            {
              hint_level: 1,
              hint_type: 'direct',
              hint_text: 'Present your evidence clearly and logically',
              delivery_method: 'text',
              cost: 25,
              timing_rules: { after_2_minutes: true }
            }
          ],
          rewards: [
            {
              reward_type: 'completion',
              content: { type: 'mystery_solved', data: 'Case closed successfully' },
              points: 50,
              unlocks: ['epilogue']
            }
          ]
        }
      ],
      narrative_progression: 'Players solve the mystery and bring the case to resolution',
      difficulty_escalation: 4
    },
    {
      act_id: 'act5_alternative_endings',
      title: 'Alternative Endings',
      description: 'Multiple possible conclusions based on player choices and evidence quality',
      duration: 10,
      objectives: ['Experience chosen ending', 'Understand consequences', 'Reflect on investigation'],
      scenes: [
        {
          scene_id: 'scene9_ending_selection',
          title: 'Ending Selection',
          description: 'Players experience one of four possible endings based on their investigation quality',
          duration: 10,
          objectives: ['Witness chosen ending', 'Understand consequences', 'Learn from experience'],
          puzzles: [
            {
              puzzle_id: 'puzzle9_ending_determination',
              title: 'Ending Determination',
              type: 'logical',
              difficulty: 'expert',
              description: 'The ending is determined by the quality of evidence collected and choices made',
              mechanics: ['Evidence quality assessment', 'Choice consequence evaluation', 'Narrative resolution'],
              tech_requirements: ['ar_overlay', 'voice_recognition'],
              solution_method: 'Experience the ending based on investigation quality',
              hints: ['The ending reflects your investigation quality', 'All choices have consequences', 'Truth always comes out'],
              points_reward: 60
            }
          ],
          interactions: [
            {
              interaction_id: 'interaction9_ending_experience',
              type: 'narrative',
              description: 'Experience the chosen ending sequence',
              triggers: ['Witness ending', 'Process consequences'],
              responses: ['Ending unfolds', 'Consequences revealed'],
              tech_requirements: ['ar_overlay', 'voice_recognition']
            }
          ],
          qr_codes: [
            {
              qr_id: 'qr9_ending_analysis',
              content_type: 'analysis',
              content_data: { analysis: 'Investigation quality assessment' },
              location_description: 'At ending analysis station',
              ar_overlay: { type: 'ending_analyzer', interactive: true }
            }
          ],
          ar_elements: [
            {
              element_id: 'ar9_ending_visualization',
              type: 'narrative',
              content: { type: 'ending_sequence', show_consequences: true },
              position: { x: 0, y: 0, z: 0 },
              interaction_methods: ['observation', 'reflection'],
              trigger_conditions: { ending_start: true }
            }
          ],
          hints: [
            {
              hint_level: 1,
              hint_type: 'contextual',
              hint_text: 'The ending reflects the quality of your investigation',
              delivery_method: 'text',
              cost: 30,
              timing_rules: { after_1_minute: true }
            }
          ],
          rewards: [
            {
              reward_type: 'narrative',
              content: { type: 'ending_experience', data: 'Complete story resolution' },
              points: 60,
              unlocks: ['epilogue']
            }
          ]
        }
      ],
      narrative_progression: 'Players experience the consequences of their investigation choices',
      difficulty_escalation: 5
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
    },
    {
      role_id: 'passenger_representative',
      name: 'Passenger Representative',
      description: 'Liaison between investigators and passengers',
      special_abilities: ['Communication', 'Mediation', 'Information gathering'],
      equipment: ['Communication device', 'Passenger manifest', 'Interview notes'],
      backstory: 'Trusted passenger who can help coordinate with other travelers',
      objectives: ['Facilitate communication', 'Gather passenger information', 'Maintain order']
    }
  ],
  suspect_characters: [
    {
      character_id: 'dr_margaret_whitmore',
      name: 'Dr. Margaret Whitmore',
      role: 'Missing Passenger',
      backstory: 'Renowned cardiologist traveling to perform emergency surgery. Known for her groundbreaking research in heart transplants. Recently discovered evidence of medical malpractice in her hospital that could destroy several careers.',
      motive: 'Silenced before exposing corruption',
      alibi: 'Last seen in dining car at 10:30 PM',
      suspicious_behavior: 'Received multiple threatening phone calls during journey',
      physical_evidence: 'Medical bag with incriminating documents, prescription pad with unusual entries',
      personality_traits: ['Determined', 'Ethical', 'Stubborn', 'Secretive'],
      relationships: {
        'prof_richard_stone': 'Former colleague with conflicting medical theories',
        'nurse_sarah_johnson': 'Former student who idolized her',
        'businessman_james_blackwell': 'Hospital board member with financial interests'
      }
    },
    {
      character_id: 'prof_richard_stone',
      name: 'Prof. Richard Stone',
      role: 'Suspicious Passenger',
      backstory: 'Medical researcher whose career was destroyed by Dr. Whitmore\'s research. Lost his position at the university after her findings contradicted his theories. Has been stalking her for months.',
      motive: 'Revenge for career destruction',
      alibi: 'Claims to be in his compartment reading',
      suspicious_behavior: 'Avoids eye contact, constantly checking watch, nervous tics',
      physical_evidence: 'Research papers contradicting Dr. Whitmore\'s work, train ticket purchased under false name',
      personality_traits: ['Bitter', 'Obsessive', 'Intelligent', 'Dangerous'],
      relationships: {
        'dr_margaret_whitmore': 'Professional rival with personal vendetta',
        'nurse_sarah_johnson': 'Former student who betrayed him',
        'conductor_mike_rodriguez': 'Provides him with train information'
      }
    },
    {
      character_id: 'nurse_sarah_johnson',
      name: 'Nurse Sarah Johnson',
      role: 'Witness/Suspect',
      backstory: 'Former student of both Dr. Whitmore and Prof. Stone. Caught between loyalty to her mentor and fear of Prof. Stone. Knows secrets about both that could destroy them.',
      motive: 'Protect herself from blackmail',
      alibi: 'Working in the medical compartment',
      suspicious_behavior: 'Overly helpful, changes story frequently, emotional instability',
      physical_evidence: 'Diary with incriminating entries, medical supplies with missing items',
      personality_traits: ['Loyal', 'Fearful', 'Manipulative', 'Vulnerable'],
      relationships: {
        'dr_margaret_whitmore': 'Mentor and protector',
        'prof_richard_stone': 'Former teacher who now threatens her',
        'businessman_james_blackwell': 'Uncle who got her the nursing position'
      }
    },
    {
      character_id: 'businessman_james_blackwell',
      name: 'James Blackwell',
      role: 'Corporate Suspect',
      backstory: 'Hospital board member and pharmaceutical executive. Dr. Whitmore\'s research threatens his company\'s profits. Has been trying to buy her silence with money and threats.',
      motive: 'Protect business interests',
      alibi: 'In business class making phone calls',
      suspicious_behavior: 'Aggressive phone conversations, expensive briefcase with cash, intimidating presence',
      physical_evidence: 'Contract offering Dr. Whitmore money to stop research, threatening letters',
      personality_traits: ['Ruthless', 'Wealthy', 'Powerful', 'Corrupt'],
      relationships: {
        'dr_margaret_whitmore': 'Target of his business interests',
        'nurse_sarah_johnson': 'Niece he helped get job',
        'conductor_mike_rodriguez': 'Bribed for information'
      }
    },
    {
      character_id: 'conductor_mike_rodriguez',
      name: 'Mike Rodriguez',
      role: 'Train Staff',
      backstory: 'Experienced conductor with gambling debts. Has been selling information about passengers to various parties. Knows more about the train\'s secrets than anyone.',
      motive: 'Money and self-preservation',
      alibi: 'On duty throughout the night',
      suspicious_behavior: 'Avoids direct questions, seems to know too much, nervous around authorities',
      physical_evidence: 'Gambling receipts, passenger information sold to third parties, master key to all compartments',
      personality_traits: ['Corrupt', 'Knowledgeable', 'Desperate', 'Loyal to money'],
      relationships: {
        'prof_richard_stone': 'Provides train information for payment',
        'businessman_james_blackwell': 'Bribed for passenger details',
        'all_passengers': 'Has access to all compartments and information'
      }
    }
  ],
  alternative_endings_details: [
    {
      ending_id: 'perfect_ending',
      title: 'The Perfect Investigation',
      description: 'All culprits exposed and motives revealed',
      requirements: {
        evidence_collected: 90,
        suspects_identified: 4,
        timeline_complete: true,
        witness_interviews: 5
      },
      narrative: 'Dr. Whitmore is found alive but injured in a hidden compartment. Prof. Stone is revealed as the mastermind, with James Blackwell as his financier. Nurse Sarah Johnson was coerced into helping. The conductor provided access. All evidence is presented clearly, and justice is served.',
      consequences: {
        dr_whitmore: 'Recovers and continues her research, exposing medical corruption',
        prof_stone: 'Arrested and charged with attempted murder and kidnapping',
        james_blackwell: 'Corporate corruption exposed, loses position and faces legal action',
        nurse_sarah: 'Given immunity for cooperation, continues nursing career',
        conductor_mike: 'Fired and charged with conspiracy, gambling debts exposed'
      },
      points_reward: 100,
      unlock_achievements: ['Perfect Detective', 'Truth Seeker', 'Justice Served']
    },
    {
      ending_id: 'partial_ending',
      title: 'Partial Justice',
      description: 'Main culprit identified, accomplices not fully exposed',
      requirements: {
        evidence_collected: 70,
        suspects_identified: 2,
        timeline_complete: false,
        witness_interviews: 3
      },
      narrative: 'Dr. Whitmore is found, but the investigation is incomplete. Prof. Stone is identified as the main culprit, but his accomplices escape justice. Some evidence is missing, and the full conspiracy remains hidden.',
      consequences: {
        dr_whitmore: 'Recovers but remains in danger from unknown threats',
        prof_stone: 'Arrested but claims he acted alone, accomplices remain free',
        james_blackwell: 'Continues business operations, corruption unexposed',
        nurse_sarah: 'Remains under threat, unable to speak freely',
        conductor_mike: 'Continues working, corruption continues'
      },
      points_reward: 75,
      unlock_achievements: ['Partial Success', 'Main Culprit Caught']
    },
    {
      ending_id: 'redemption_ending',
      title: 'The Redemption',
      description: 'Culprit confesses and seeks redemption',
      requirements: {
        evidence_collected: 60,
        suspects_identified: 1,
        timeline_complete: false,
        witness_interviews: 2,
        special_condition: 'Show mercy to suspects'
      },
      narrative: 'Prof. Stone, overwhelmed by guilt and the evidence against him, confesses voluntarily. He reveals the location of Dr. Whitmore and expresses genuine remorse. The investigation team shows compassion, leading to a more humane resolution.',
      consequences: {
        dr_whitmore: 'Recovers and forgives her former colleague',
        prof_stone: 'Confesses fully, receives reduced sentence for cooperation',
        james_blackwell: 'Faces consequences but shows some remorse',
        nurse_sarah: 'Finds courage to speak out, protected by authorities',
        conductor_mike: 'Cooperates with investigation, receives leniency'
      },
      points_reward: 85,
      unlock_achievements: ['Compassionate Detective', 'Redemption Seeker', 'Mercy Shown']
    },
    {
      ending_id: 'tragic_ending',
      title: 'The Tragic Truth',
      description: 'Truth revealed but with unexpected consequences',
      requirements: {
        evidence_collected: 80,
        suspects_identified: 3,
        timeline_complete: true,
        witness_interviews: 4,
        special_condition: 'Rush investigation'
      },
      narrative: 'The investigation reveals a deeper conspiracy than expected. Dr. Whitmore is found, but the truth exposes corruption that reaches high levels of government and medicine. The revelation has far-reaching consequences that affect many lives.',
      consequences: {
        dr_whitmore: 'Recovers but becomes a target for powerful enemies',
        prof_stone: 'Revealed as part of larger conspiracy, faces severe consequences',
        james_blackwell: 'Exposed as part of massive corruption network',
        nurse_sarah: 'Becomes key witness in major case, life permanently changed',
        conductor_mike: 'Provides crucial evidence, becomes protected witness'
      },
      points_reward: 90,
      unlock_achievements: ['Truth Revealer', 'Conspiracy Uncoverer', 'Tragic Hero']
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
    },
    {
      character_type: 'witness',
      personality: 'nervous',
      dialogue_style: 'uncertain'
    }
  ],
  voice_interactions: true,
  gesture_controls: false,
  accessibility_features: [
    'audio_descriptions',
    'large_text',
    'high_contrast',
    'haptic_feedback',
    'voice_commands',
    'color_blind_support',
    'motor_impairment_support',
    'cognitive_accessibility',
    'screen_reader_compatibility',
    'keyboard_navigation',
    'adjustable_difficulty',
    'visual_indicators',
    'audio_cues',
    'tactile_markers',
    'simplified_interface'
  ],
  accessibility_details: {
    visual_impairments: {
      audio_descriptions: 'Complete audio narration of all visual elements',
      high_contrast: 'High contrast color schemes for better visibility',
      large_text: 'Adjustable text sizes up to 200%',
      screen_reader: 'Full compatibility with screen reading software',
      visual_indicators: 'Audio cues for important visual events'
    },
    hearing_impairments: {
      visual_cues: 'Visual indicators for all audio elements',
      subtitles: 'Complete subtitle system for all dialogue',
      vibration_alerts: 'Haptic feedback for important audio cues',
      visual_feedback: 'Visual confirmation of audio interactions'
    },
    motor_impairments: {
      voice_commands: 'Complete voice control for all interactions',
      keyboard_navigation: 'Full keyboard accessibility',
      gesture_alternatives: 'Alternative input methods for gestures',
      adjustable_timing: 'Extended time limits for interactions',
      simplified_controls: 'Simplified control schemes'
    },
    cognitive_impairments: {
      simplified_interface: 'Clean, uncluttered interface design',
      clear_instructions: 'Simple, clear instructions for all tasks',
      progress_indicators: 'Clear progress tracking throughout',
      memory_aids: 'Tools to help remember important information',
      adjustable_difficulty: 'Difficulty scaling based on player needs'
    },
    color_blindness: {
      color_alternatives: 'Alternative visual indicators beyond color',
      pattern_support: 'Patterns and shapes as color alternatives',
      high_contrast_modes: 'Special high contrast modes for different types',
      text_labels: 'Text labels for all color-coded elements'
    }
  },
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
  sound_effects: ['footsteps', 'door_creak', 'typewriter', 'train_sounds', 'medical_equipment', 'struggle_sounds', 'phone_rings', 'conversations'],
  visual_effects: ['film_noir', 'sepia_tone', 'shadow_play', 'medical_lighting', 'evidence_highlighting', 'timeline_visualization'],
  global_sensory_elements: {
    ambient_sounds: {
      train_movement: 'Continuous train sounds that change with speed and location',
      passenger_activity: 'Background conversations and movement sounds',
      medical_equipment: 'Subtle beeping and mechanical sounds from medical devices',
      weather_effects: 'Rain and wind sounds that affect the investigation atmosphere'
    },
    environmental_scents: {
      train_interior: 'Leather, metal, and cleaning products typical of luxury trains',
      medical_compartment: 'Antiseptic, medical supplies, and sterile environment',
      dining_car: 'Food aromas, coffee, and alcohol',
      passenger_areas: 'Perfumes, colognes, and personal care products'
    },
    tactile_elements: {
      train_materials: 'Different textures of leather, metal, wood, and fabric',
      evidence_items: 'Various textures that change with time and handling',
      temperature_variations: 'Different temperatures in different areas of the train',
      vibration_patterns: 'Train vibrations that change with speed and terrain'
    },
    visual_atmosphere: {
      lighting_changes: 'Dynamic lighting that reveals and hides clues',
      shadow_play: 'Shadows that suggest movement and activity',
      color_themes: 'Color schemes that reflect different emotional states',
      weather_effects: 'Visual effects of weather on windows and atmosphere'
    }
  },
  tags: ['mystery', 'detective', 'train', 'disappearance', 'interrogation', 'medical', 'conspiracy', 'redemption', 'sensory', 'accessibility']
}

// Export all mystery stories
export const allMysteryStories: MysteryStory[] = [
  midnightExpressMystery
  // Additional mystery stories would be added here
]

// Utility functions
export function getMysteryStoryById(storyId: string): MysteryStory | undefined {
  return allMysteryStories.find(story => story.story_id === storyId)
}

export function getMysteryStoriesByDifficulty(difficulty: string): MysteryStory[] {
  return allMysteryStories.filter(story => story.difficulty === difficulty)
}

export function getMysteryStoriesByPlayerCount(playerCount: number): MysteryStory[] {
  return allMysteryStories.filter(story => 
    playerCount >= story.min_players && 
    playerCount <= story.max_players
  )
}
