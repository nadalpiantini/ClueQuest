/**
 * Script to insert The Midnight Express Mystery into the existing adventures table
 * Adapted for the current database schema
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

// The Midnight Express Mystery data adapted for existing schema
const midnightExpressMystery = {
  title: 'The Midnight Express Mystery',
  description: 'A luxury train journey turns deadly when a passenger vanishes between stations. Uncover the truth before the next stop.',
  category: 'mystery',
  difficulty: 'intermediate',
  estimated_duration: 65, // Updated duration with enhancements
  theme_name: 'The Midnight Express Mystery',
  theme_config: {
    primary_color: '#2c3e50',
    secondary_color: '#e74c3c',
    accent_color: '#f39c12',
    font_family: 'serif',
    atmosphere: 'noir'
  },
  settings: {
    story_id: 'midnight_express_mystery',
    full_description: 'Players travel on a luxury train when a passenger mysteriously disappears. They must investigate compartments, interview fellow passengers, and piece together clues to solve the mystery before the train reaches its destination.',
    scene_count: 11, // Updated with new ending scene
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
        personality_traits: ['Determined', 'Ethical', 'Stubborn', 'Secretive']
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
        personality_traits: ['Bitter', 'Obsessive', 'Intelligent', 'Dangerous']
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
        personality_traits: ['Loyal', 'Fearful', 'Manipulative', 'Vulnerable']
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
        personality_traits: ['Ruthless', 'Wealthy', 'Powerful', 'Corrupt']
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
        personality_traits: ['Corrupt', 'Knowledgeable', 'Desperate', 'Loyal to money']
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
        points_reward: 90,
        unlock_achievements: ['Truth Revealer', 'Conspiracy Uncoverer', 'Tragic Hero']
      }
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
    language_support: ['en', 'es', 'fr'],
    cultural_adaptations: {
      legal_systems: ['common_law', 'civil_law'],
      cultural_contexts: ['western', 'eastern']
    },
    cover_image_url: '/images/sub-adventures/Mystery/The_Midnight_Express_Mystery.png',
    background_music_url: '/audio/mystery-theme.mp3',
    sound_effects: ['footsteps', 'door_creak', 'typewriter', 'train_sounds', 'medical_equipment', 'struggle_sounds', 'phone_rings', 'conversations'],
    visual_effects: ['film_noir', 'sepia_tone', 'shadow_play', 'medical_lighting', 'evidence_highlighting', 'timeline_visualization'],
    tags: ['mystery', 'detective', 'train', 'disappearance', 'interrogation', 'medical', 'conspiracy', 'redemption', 'sensory', 'accessibility']
  },
  status: 'published',
  max_participants: 8,
  allows_teams: true,
  max_team_size: 8,
  leaderboard_enabled: true,
  live_tracking: true,
  chat_enabled: true,
  hints_enabled: true,
  ai_personalization: true,
  ai_avatars_enabled: true,
  ai_narrative_enabled: true,
  offline_mode: false,
  language_support: ['en', 'es', 'fr'],
  tags: ['mystery', 'detective', 'train', 'disappearance', 'interrogation', 'medical', 'conspiracy', 'redemption', 'sensory', 'accessibility'],
  is_template: false,
  is_public: true
}

async function insertMidnightExpress() {
  try {
    console.log('Starting to insert The Midnight Express Mystery...')
    
    // Get the first organization ID
    const { data: orgs, error: orgError } = await supabase
      .from('cluequest_organizations')
      .select('id')
      .limit(1)
    
    if (orgError || !orgs || orgs.length === 0) {
      console.error('Error getting organization:', orgError)
      return
    }
    
    const organizationId = orgs[0].id
    console.log('Using organization:', organizationId)
    
    // Check if the story already exists
    const { data: existing, error: checkError } = await supabase
      .from('cluequest_adventures')
      .select('id, title')
      .eq('title', midnightExpressMystery.title)
    
    if (checkError) {
      console.error('Error checking existing story:', checkError)
      return
    }
    
    if (existing && existing.length > 0) {
      console.log('The Midnight Express Mystery already exists. Updating...')
      
      const { data, error } = await supabase
        .from('cluequest_adventures')
        .update({
          ...midnightExpressMystery,
          organization_id: organizationId,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing[0].id)
        .select()
      
      if (error) {
        console.error('Error updating story:', error)
      } else {
        console.log('✅ The Midnight Express Mystery updated successfully!')
        console.log('Updated story ID:', data[0].id)
      }
    } else {
      console.log('Inserting new story...')
      
      const { data, error } = await supabase
        .from('cluequest_adventures')
        .insert({
          ...midnightExpressMystery,
          organization_id: organizationId,
          creator_id: 'fdf1e41a-969d-4ba1-8b61-1b43e0fe9f29', // Valid user ID
          created_at: new Date().toISOString(),
          created_by: 'fdf1e41a-969d-4ba1-8b61-1b43e0fe9f29'
        })
        .select()
      
      if (error) {
        console.error('Error inserting story:', error)
      } else {
        console.log('✅ The Midnight Express Mystery inserted successfully!')
        console.log('New story ID:', data[0].id)
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

insertMidnightExpress()
