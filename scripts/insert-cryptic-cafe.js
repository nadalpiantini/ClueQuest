/**
 * Insert The Cryptic Café Mystery Adventure into ClueQuest Database
 * Based on the comprehensive adventure design and escape room best practices
 */

const { createClient } = require('@supabase/supabase-js')

// For development purposes, we'll use placeholder values
// In production, these should be set via environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'

console.log('⚠️  Using placeholder Supabase credentials for development')
console.log('   In production, set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables')

const supabase = createClient(supabaseUrl, supabaseKey)

async function insertCrypticCafeAdventure() {
  console.log('🚀 Inserting The Cryptic Café Mystery Adventure...\n')

  try {
    // First, get the organization ID
    const { data: org, error: orgError } = await supabase
      .from('cluequest_organizations')
      .select('id')
      .eq('name', 'ClueQuest')
      .single()

    if (orgError || !org) {
      console.error('❌ Organization not found:', orgError)
      return
    }

    console.log('✅ Found organization:', org.id)

    // Insert the main adventure
    const adventureData = {
      story_id: 'cryptic_cafe_mystery',
      title: 'The Cryptic Café',
      description: 'A local coffee shop has become the center of a conspiracy. Decode the secret messages and uncover the truth before the café\'s reputation is ruined.',
      full_description: 'La cafetería "Bean & Code" ha ganado fama por sus deliciosas bebidas artesanales… y por los mensajes misteriosos que algunos clientes encuentran en sus pedidos. Los rumores apuntan a que un grupo de baristas activistas está aprovechando los pedidos para intercambiar información secreta y planear un boicot contra una corporación cafetera. Los jugadores tienen 40 minutos para seguir la pista de estos mensajes y desvelar quién está detrás de la conspiración.',
      category: 'mystery',
      difficulty: 'beginner',
      estimated_duration: 40,
      scene_count: 7,
      progression_type: 'linear',
      min_players: 2,
      max_players: 6,
      recommended_players: 4,
      min_age: 8,
      max_age: 99,
      setup_time: 15,
      location_type: 'indoor',
      space_requirements: 'small_room',
      required_materials: [
        'Pizarrón de madera con nombres de bebidas',
        'Seis sacos de mini grano',
        'Tarjeta con el alfabeto A1Z26',
        'Tarro con sobres de azúcar',
        'Pergamino con poema',
        'Seis fotos de arte latte',
        'Tarjeta de correspondencia patrón-letra',
        'Sobres de azúcar de distintos colores y pesos',
        'Báscula',
        'Candado numérico',
        'Panel de colores',
        'Cinco frascos con aromas',
        'Fichas numeradas',
        'Caja fuerte con cerradura de 5 dígitos',
        'Tres tarjetas de fidelidad perforadas',
        'Linterna',
        'Mesa de luz'
      ],
      tech_requirements: [
        'Smartphones',
        'QR codes',
        'Audio system'
      ],
      optional_materials: [
        'Café real para ambientación',
        'Sonidos de cafetería',
        'Iluminación cálida',
        'Decoración de café'
      ],
      learning_objectives: [
        'Deductive reasoning',
        'Pattern recognition',
        'Code breaking',
        'Sensory awareness',
        'Team collaboration'
      ],
      skills_developed: [
        'Critical thinking',
        'Observation',
        'Logical reasoning',
        'Sensory perception',
        'Communication'
      ],
      knowledge_areas: [
        'Cryptography basics',
        'Coffee culture',
        'Pattern recognition',
        'Sensory analysis'
      ],
      puzzle_types: [
        'logical',
        'cryptographic',
        'linguistic',
        'spatial',
        'sensory',
        'mathematical'
      ],
      tech_integrations: [
        'qr_code',
        'ar_overlay'
      ],
      special_mechanics: {
        coffee_theme_integration: 'All puzzles are themed around coffee and café culture',
        sensory_elements: 'Includes smell-based puzzles with real coffee aromas',
        progressive_difficulty: 'Puzzles increase in complexity while maintaining accessibility',
        moral_choice_ending: 'Players choose between cooperation and justice at the end'
      },
      narrative_hook: 'Un pequeño café local se convierte en el epicentro de una conspiración cuando los clientes comienzan a recibir mensajes codificados en sus bebidas.',
      story_acts: [
        {
          act: 1,
          scenes: ['Tabla de Especiales', 'Sacos de granos', 'Tarro de azúcar'],
          description: 'Descubrimiento inicial de mensajes codificados y primeras pistas',
          difficulty_escalation: 1
        },
        {
          act: 2,
          scenes: ['Arte latte', 'Cuarto de almacenamiento', 'Sala de tostado'],
          description: 'Profundización en la conspiración y descubrimiento de patrones',
          difficulty_escalation: 2
        },
        {
          act: 3,
          scenes: ['Tarjetas perforadas'],
          description: 'Revelación final y decisión moral sobre el destino del café',
          difficulty_escalation: 3
        }
      ],
      character_roles: [
        {
          role_id: 'barista_jefe',
          name: 'Ana (Barista Jefe)',
          description: 'Responsable de las bebidas y cómplice de la conspiración. Mantiene la compostura pero deja pistas sutiles.',
          backstory: 'Ana ha trabajado en el café durante años y se ha vuelto desilusionada con las prácticas corporativas de las grandes cadenas de café.',
          objectives: ['Mantener la conspiración en secreto', 'Ayudar a los activistas', 'Proteger la reputación del café']
        },
        {
          role_id: 'ayudante_barista',
          name: 'Luis (Ayudante de Barista)',
          description: 'Habla mucho y se distrae fácilmente. Sin saberlo, revela datos sobre la conspiración.',
          backstory: 'Luis es nuevo en el trabajo y no está al tanto de las actividades secretas de Ana.',
          objectives: ['Ayudar a los clientes', 'Aprender sobre el café', 'Mantener el trabajo']
        },
        {
          role_id: 'cliente_misterioso',
          name: 'Señor X (Cliente Misterioso)',
          description: 'Llega con un pedido habitual pero recibe un mensaje que lo alerta. Ayuda a los jugadores al inicio.',
          backstory: 'Un cliente regular que ha notado patrones extraños en sus pedidos.',
          objectives: ['Descubrir la verdad', 'Ayudar a los investigadores', 'Proteger la comunidad']
        },
        {
          role_id: 'proveedor_granos',
          name: 'Marcos (Proveedor de Granos)',
          description: 'Trae sacos de café y conoce los tipos de granos y sus aromas. Aparece en una escena para guiar a los jugadores.',
          backstory: 'Marcos ha estado suministrando granos al café durante años y conoce todos los secretos del negocio.',
          objectives: ['Mantener la calidad del café', 'Ayudar a los investigadores', 'Proteger sus contactos']
        }
      ],
      story_themes: [
        'Conspiracy',
        'Coffee culture',
        'Social justice',
        'Community values',
        'Moral choices'
      ],
      difficulty_curve: {
        scene_1: 1,
        scene_2: 1.2,
        scene_3: 1.4,
        scene_4: 1.6,
        scene_5: 1.8,
        scene_6: 2.0,
        scene_7: 2.2
      },
      hint_system: {
        progressive_hints: true,
        hint_costs: [10, 20, 30],
        max_hints_per_scene: 3,
        team_hint_sharing: true
      },
      adaptive_difficulty: false,
      qr_codes_enabled: true,
      ar_features: {
        latte_art_overlay: 'AR overlay for latte art pattern recognition',
        coffee_bean_visualization: '3D visualization of coffee bean counting'
      },
      ai_characters: [
        {
          character_id: 'ana_ai',
          name: 'Ana (AI Assistant)',
          personality: 'Professional but mysterious',
          role: 'Provides subtle hints about the conspiracy'
        }
      ],
      voice_interactions: false,
      gesture_controls: false,
      accessibility_features: [
        'screen_reader_support',
        'high_contrast_mode',
        'text_to_speech',
        'keyboard_navigation',
        'colorblind_friendly'
      ],
      organization_id: org.id,
      creator_id: org.id, // Using org ID as creator for system adventures
      status: 'published'
    }

    const { data: adventure, error: adventureError } = await supabase
      .from('cluequest_enhanced_adventures')
      .insert(adventureData)
      .select()
      .single()

    if (adventureError) {
      console.error('❌ Error inserting adventure:', adventureError)
      return
    }

    console.log('✅ Adventure inserted:', adventure.id)

    // Insert scenes
    const scenes = [
      {
        adventure_id: adventure.id,
        scene_number: 1,
        scene_id: 'scene-1-specials-board',
        title: 'Tabla de Especiales - El mensaje oculto',
        description: 'Los jugadores entran en el café y ven un pizarrón que anuncia las "Especialidades del Día". Un cliente comenta que recibió un mensaje secreto en su pedido.',
        act_number: 1,
        is_optional: false,
        unlock_conditions: {},
        narrative_content: 'Bienvenidos a "Bean & Code", el café local que se ha vuelto famoso por sus deliciosas bebidas artesanales... y por los mensajes misteriosos que algunos clientes encuentran en sus pedidos. Los rumores apuntan a que un grupo de baristas activistas está aprovechando los pedidos para intercambiar información secreta. Tienen 40 minutos para seguir la pista de estos mensajes y desvelar quién está detrás de la conspiración.',
        objectives: ['Descubrir el mensaje oculto en la tabla de especialidades', 'Identificar el acróstico SECRET'],
        completion_criteria: {
          type: 'puzzle_solve',
          puzzle_id: 'acrostic-specials',
          required_solution: 'SECRET'
        },
        puzzles: [
          {
            puzzle_id: 'acrostic-specials',
            title: 'Acróstico de Especialidades',
            description: 'Observa la primera letra de cada bebida en la tabla de especialidades. ¿Forman alguna palabra?',
            type: 'linguistic',
            difficulty: 'beginner',
            puzzle_data: {
              beverages: [
                'Strawberry Smoothie',
                'Espresso',
                'Cappuccino',
                'Red Eye',
                'Earl Grey Tea',
                'Turkish Coffee'
              ],
              instruction: 'Observa la primera letra de cada bebida. ¿Forman alguna palabra? Usa esa palabra para descubrir una compartimento secreto.'
            },
            solution_data: {
              answer: 'SECRET',
              explanation: 'Las iniciales de Strawberry Smoothie, Espresso, Cappuccino, Red Eye, Earl Grey Tea, Turkish Coffee forman la palabra SECRET'
            },
            input_methods: ['text_input'],
            validation_rules: {
              case_sensitive: false,
              exact_match: true
            },
            hint_levels: [
              {
                level: 1,
                hint: 'Mira la primera letra de cada bebida en orden',
                cost: 10
              },
              {
                level: 2,
                hint: 'S-Strawberry, E-Espresso, C-Cappuccino...',
                cost: 20
              },
              {
                level: 3,
                hint: 'Las iniciales forman la palabra SECRET',
                cost: 30
              }
            ],
            points_reward: 100,
            time_limit: 300,
            attempt_limit: 3
          }
        ],
        interactions: [
          {
            interaction_id: 'examine_specials_board',
            type: 'examine',
            description: 'Examinar la tabla de especialidades del día',
            required: true
          }
        ],
        qr_codes: [],
        ar_elements: [],
        tech_interactions: [],
        estimated_duration: 5,
        time_limit: 300,
        can_skip: false,
        hints: [
          {
            hint_id: 'hint-1-1',
            level: 1,
            text: 'Mira la primera letra de cada bebida en orden',
            cost: 10
          }
        ],
        help_system: {
          tutorial_mode: true,
          progressive_hints: true
        },
        points_reward: 100,
        unlocks_next: ['scene-2-coffee-sacks'],
        story_revelations: ['El café tiene mensajes ocultos en sus especialidades'],
        is_active: true,
        order_index: 1
      },
      {
        adventure_id: adventure.id,
        scene_number: 2,
        scene_id: 'scene-2-coffee-sacks',
        title: 'Sacos de granos - Código numérico',
        description: 'Los jugadores descubren seis pequeños sacos etiquetados con orígenes de café. Dentro de cada saco hay un número diferente de granos.',
        act_number: 1,
        is_optional: false,
        unlock_conditions: {
          required_scenes: ['scene-1-specials-board']
        },
        narrative_content: 'Detrás del pizarrón hay un pequeño compartimento. Al abrirlo, los jugadores encuentran una nota que dice: "Cuenta los granos y hallarás la clave". Ahora deben examinar los sacos de café para continuar.',
        objectives: ['Contar los granos en cada saco', 'Convertir números a letras usando A=1, B=2', 'Formar la palabra COFFEE'],
        completion_criteria: {
          type: 'puzzle_solve',
          puzzle_id: 'grain-count-cipher',
          required_solution: 'COFFEE'
        },
        puzzles: [
          {
            puzzle_id: 'grain-count-cipher',
            title: 'Conteo de granos y conversión a letras',
            description: 'Cuenta los granos de cada saco y usa el código A=1, B=2, etc., para convertirlos en letras.',
            type: 'mathematical',
            difficulty: 'beginner',
            puzzle_data: {
              sacks: [
                { origin: 'Brasil', grain_count: 3 },
                { origin: 'Etiopía', grain_count: 15 },
                { origin: 'Colombia', grain_count: 6 },
                { origin: 'Kenia', grain_count: 6 },
                { origin: 'Sumatra', grain_count: 5 },
                { origin: 'Guatemala', grain_count: 5 }
              ],
              instruction: 'Cuenta los granos de cada saco y usa el código A=1 para convertirlos en letras. Lee la palabra resultante.'
            },
            solution_data: {
              answer: 'COFFEE',
              explanation: 'Los números 3-15-6-6-5-5 se convierten en las letras C-O-F-F-E-E, formando la palabra COFFEE'
            },
            input_methods: ['text_input'],
            validation_rules: {
              case_sensitive: false,
              exact_match: true
            },
            hint_levels: [
              {
                level: 1,
                hint: 'Cuenta cuidadosamente los granos en cada saco',
                cost: 15
              },
              {
                level: 2,
                hint: 'Brasil=3, Etiopía=15, Colombia=6, Kenia=6, Sumatra=5, Guatemala=5',
                cost: 25
              },
              {
                level: 3,
                hint: 'Convierte a letras: 3=C, 15=O, 6=F, 6=F, 5=E, 5=E = COFFEE',
                cost: 35
              }
            ],
            points_reward: 120,
            time_limit: 400,
            attempt_limit: 3
          }
        ],
        interactions: [
          {
            interaction_id: 'examine_coffee_sacks',
            type: 'examine',
            description: 'Examinar los sacos de granos de café',
            required: true
          },
          {
            interaction_id: 'count_grains',
            type: 'count',
            description: 'Contar los granos en cada saco',
            required: true
          }
        ],
        qr_codes: [],
        ar_elements: [],
        tech_interactions: [],
        estimated_duration: 6,
        time_limit: 400,
        can_skip: false,
        hints: [
          {
            hint_id: 'hint-2-1',
            level: 1,
            text: 'Cuenta cuidadosamente los granos en cada saco',
            cost: 15
          }
        ],
        help_system: {
          tutorial_mode: true,
          progressive_hints: true
        },
        points_reward: 120,
        unlocks_next: ['scene-3-sugar-jar'],
        story_revelations: ['Los granos contienen un código numérico'],
        is_active: true,
        order_index: 2
      },
      {
        adventure_id: adventure.id,
        scene_number: 3,
        scene_id: 'scene-3-sugar-jar',
        title: 'Tarro de azúcar - Poema en acróstico',
        description: 'Detrás del mostrador hay un tarro con sobres de azúcar. Al abrirlo, los jugadores encuentran un pergamino con un poema de cuatro líneas.',
        act_number: 1,
        is_optional: false,
        unlock_conditions: {
          required_scenes: ['scene-2-coffee-sacks']
        },
        narrative_content: 'Una nota dentro del saco de Guatemala confirma: "Muy bien, amantes del café. Ahora busquen donde el dulce se esconde". Los jugadores deben examinar el tarro de azúcar.',
        objectives: ['Leer el poema en el pergamino', 'Identificar el acróstico FOAM', 'Entender la pista sobre el arte del café'],
        completion_criteria: {
          type: 'puzzle_solve',
          puzzle_id: 'poem-acrostic',
          required_solution: 'FOAM'
        },
        puzzles: [
          {
            puzzle_id: 'poem-acrostic',
            title: 'Poema en acróstico',
            description: 'Observa la primera letra de cada línea del poema. ¿Qué palabra forman?',
            type: 'linguistic',
            difficulty: 'beginner',
            puzzle_data: {
              poem: [
                'From dawn until dusk, we brew with glee,',
                'Our foamy art hides secrets for thee,',
                'Amongst the cups a pattern you\'ll see,',
                'Milk, coffee, and love – the code is free'
              ],
              instruction: 'Observa la primera letra de cada línea. ¿Qué palabra forman? Dirígete a la zona descrita.'
            },
            solution_data: {
              answer: 'FOAM',
              explanation: 'Las primeras letras de cada línea forman FOAM: From dawn, Our foamy, Amongst the, Milk coffee'
            },
            input_methods: ['text_input'],
            validation_rules: {
              case_sensitive: false,
              exact_match: true
            },
            hint_levels: [
              {
                level: 1,
                hint: 'Lee cada línea del poema cuidadosamente',
                cost: 12
              },
              {
                level: 2,
                hint: 'F-rom dawn, O-ur foamy, A-mongst the, M-ilk coffee',
                cost: 22
              },
              {
                level: 3,
                hint: 'Las primeras letras forman FOAM',
                cost: 32
              }
            ],
            points_reward: 110,
            time_limit: 350,
            attempt_limit: 3
          }
        ],
        interactions: [
          {
            interaction_id: 'examine_sugar_jar',
            type: 'examine',
            description: 'Examinar el tarro de azúcar',
            required: true
          },
          {
            interaction_id: 'read_poem',
            type: 'read',
            description: 'Leer el poema en el pergamino',
            required: true
          }
        ],
        qr_codes: [],
        ar_elements: [],
        tech_interactions: [],
        estimated_duration: 6,
        time_limit: 350,
        can_skip: false,
        hints: [
          {
            hint_id: 'hint-3-1',
            level: 1,
            text: 'Lee cada línea del poema cuidadosamente',
            cost: 12
          }
        ],
        help_system: {
          tutorial_mode: true,
          progressive_hints: true
        },
        points_reward: 110,
        unlocks_next: ['scene-4-latte-art'],
        story_revelations: ['La respuesta está en el arte del café (espuma)'],
        is_active: true,
        order_index: 3
      },
      {
        adventure_id: adventure.id,
        scene_number: 4,
        scene_id: 'scene-4-latte-art',
        title: 'Arte latte - Reconocimiento de patrones',
        description: 'En la barra hay fotos de seis tazas con diferentes diseños de arte latte. Junto a las fotos, hay una tarjeta con un código que asigna una letra a cada patrón.',
        act_number: 2,
        is_optional: false,
        unlock_conditions: {
          required_scenes: ['scene-3-sugar-jar']
        },
        narrative_content: 'La pista indica que la respuesta está en el arte del café (espuma). Los jugadores deben examinar las tazas de café en la barra para continuar.',
        objectives: ['Identificar los patrones de arte latte', 'Usar la correspondencia patrón-letra', 'Formar la palabra INMA'],
        completion_criteria: {
          type: 'puzzle_solve',
          puzzle_id: 'latte-pattern-sequence',
          required_solution: 'INMA'
        },
        puzzles: [
          {
            puzzle_id: 'latte-pattern-sequence',
            title: 'Secuencia de patrones de arte latte',
            description: 'Usando la correspondencia, convierte la secuencia de patrones en letras y forma una palabra.',
            type: 'spatial',
            difficulty: 'beginner',
            puzzle_data: {
              pattern_mapping: {
                'Corazón': 'M',
                'Tulipán': 'A',
                'Rosetta': 'I',
                'Ola': 'N',
                'Hoja': 'L',
                'Espiral': 'K'
              },
              sequence: ['Rosetta', 'Ola', 'Corazón', 'Tulipán'],
              instruction: 'Usando la correspondencia, convierte la secuencia de patrones en letras y forma una palabra.'
            },
            solution_data: {
              answer: 'INMA',
              explanation: 'Rosetta (I), Ola (N), Corazón (M), Tulipán (A) forman la palabra INMA, abreviación de "INventario de MAteriales"'
            },
            input_methods: ['text_input'],
            validation_rules: {
              case_sensitive: false,
              exact_match: true
            },
            hint_levels: [
              {
                level: 1,
                hint: 'Observa la correspondencia patrón-letra en la tarjeta',
                cost: 18
              },
              {
                level: 2,
                hint: 'Rosetta=I, Ola=N, Corazón=M, Tulipán=A',
                cost: 28
              },
              {
                level: 3,
                hint: 'La secuencia forma la palabra INMA',
                cost: 38
              }
            ],
            points_reward: 130,
            time_limit: 380,
            attempt_limit: 3
          }
        ],
        interactions: [
          {
            interaction_id: 'examine_latte_photos',
            type: 'examine',
            description: 'Examinar las fotos de arte latte',
            required: true
          },
          {
            interaction_id: 'read_pattern_mapping',
            type: 'read',
            description: 'Leer la tarjeta de correspondencia patrón-letra',
            required: true
          }
        ],
        qr_codes: [],
        ar_elements: [
          {
            element_id: 'latte_art_overlay',
            type: 'pattern_recognition',
            description: 'AR overlay para reconocimiento de patrones de arte latte'
          }
        ],
        tech_interactions: [],
        estimated_duration: 6,
        time_limit: 380,
        can_skip: false,
        hints: [
          {
            hint_id: 'hint-4-1',
            level: 1,
            text: 'Observa la correspondencia patrón-letra en la tarjeta',
            cost: 18
          }
        ],
        help_system: {
          tutorial_mode: true,
          progressive_hints: true
        },
        points_reward: 130,
        unlocks_next: ['scene-5-storage-room'],
        story_revelations: ['INMA es abreviación de "INventario de MAteriales"'],
        is_active: true,
        order_index: 4
      },
      {
        adventure_id: adventure.id,
        scene_number: 5,
        scene_id: 'scene-5-storage-room',
        title: 'Cuarto de almacenamiento - Colores y pesos',
        description: 'En el cuarto de almacenamiento hay estantes con sobres de azúcar de diferentes colores y una báscula. Una nota indica el orden correcto.',
        act_number: 2,
        is_optional: false,
        unlock_conditions: {
          required_scenes: ['scene-4-latte-art']
        },
        narrative_content: 'El personal del café explica que "INMA" es el nombre abreviado de "INventario de MAteriales". Esto sugiere revisar el cuarto de almacenamiento.',
        objectives: ['Pesar los sobres de azúcar', 'Ordenar por peso ascendente', 'Usar el panel de colores para obtener el código 2431'],
        completion_criteria: {
          type: 'puzzle_solve',
          puzzle_id: 'color-weight-combination',
          required_solution: '2431'
        },
        puzzles: [
          {
            puzzle_id: 'color-weight-combination',
            title: 'Combinación de colores y pesos',
            description: 'Ordena los sobres por peso ascendente y usa la primera letra de cada color como código.',
            type: 'physical',
            difficulty: 'beginner',
            puzzle_data: {
              sugar_packets: [
                { color: 'Azul', weight: 10 },
                { color: 'Verde', weight: 12 },
                { color: 'Amarillo', weight: 20 },
                { color: 'Rojo', weight: 25 }
              ],
              color_panel: {
                'Azul': 2,
                'Verde': 4,
                'Amarillo': 3,
                'Rojo': 1
              },
              instruction: 'Ordena los sobres por peso ascendente. Usa la primera letra de cada color en ese orden para obtener un código. Luego, convierte ese código en un número usando un panel de colores: Azul=2, Verde=4, Amarillo=3, Rojo=1. Introduce la combinación de 4 dígitos resultante en el candado.'
            },
            solution_data: {
              answer: '2431',
              explanation: 'El orden ascendente es Azul (A), Verde (V), Amarillo (A), Rojo (R). Usando el panel de colores, la combinación corresponde a 2-4-3-1'
            },
            input_methods: ['numeric_input'],
            validation_rules: {
              exact_match: true,
              numeric_only: true
            },
            hint_levels: [
              {
                level: 1,
                hint: 'Usa la báscula para pesar cada sobre',
                cost: 20
              },
              {
                level: 2,
                hint: 'Orden ascendente: Azul(10g), Verde(12g), Amarillo(20g), Rojo(25g)',
                cost: 30
              },
              {
                level: 3,
                hint: 'AVAR = 2-4-3-1 según el panel de colores',
                cost: 40
              }
            ],
            points_reward: 140,
            time_limit: 420,
            attempt_limit: 3
          }
        ],
        interactions: [
          {
            interaction_id: 'examine_storage_room',
            type: 'examine',
            description: 'Examinar el cuarto de almacenamiento',
            required: true
          },
          {
            interaction_id: 'weigh_sugar_packets',
            type: 'weigh',
            description: 'Pesar los sobres de azúcar',
            required: true
          },
          {
            interaction_id: 'use_combination_lock',
            type: 'unlock',
            description: 'Usar el candado numérico',
            required: true
          }
        ],
        qr_codes: [],
        ar_elements: [],
        tech_interactions: [],
        estimated_duration: 7,
        time_limit: 420,
        can_skip: false,
        hints: [
          {
            hint_id: 'hint-5-1',
            level: 1,
            text: 'Usa la báscula para pesar cada sobre',
            cost: 20
          }
        ],
        help_system: {
          tutorial_mode: true,
          progressive_hints: true
        },
        points_reward: 140,
        unlocks_next: ['scene-6-roasting-room'],
        story_revelations: ['El candado se abre y revela una nota sobre el tostador'],
        is_active: true,
        order_index: 5
      },
      {
        adventure_id: adventure.id,
        scene_number: 6,
        scene_id: 'scene-6-roasting-room',
        title: 'Sala de tostado - Aromas y números',
        description: 'Los jugadores entran en la sala donde se tuestan los granos. Hay cinco frascos etiquetados con especias y un cartel con instrucciones.',
        act_number: 2,
        is_optional: false,
        unlock_conditions: {
          required_scenes: ['scene-5-storage-room']
        },
        narrative_content: 'Al introducir 2431, el candado se abre y revela una nota que dice: "Buen trabajo. Ahora sigue tu nariz al tostador".',
        objectives: ['Oler cada frasco de especias', 'Ordenar de más fuerte a más suave', 'Usar la secuencia 24513 para abrir la caja fuerte'],
        completion_criteria: {
          type: 'puzzle_solve',
          puzzle_id: 'aroma-ranking',
          required_solution: '24513'
        },
        puzzles: [
          {
            puzzle_id: 'aroma-ranking',
            title: 'Ranking de aromas por intensidad',
            description: 'Huele cada frasco y ordénalos de más fuerte a más suave según su intensidad aromática.',
            type: 'sensory',
            difficulty: 'beginner',
            puzzle_data: {
              aromas: [
                { name: 'Canela', intensity: 2 },
                { name: 'Cardamomo', intensity: 4 },
                { name: 'Vainilla', intensity: 5 },
                { name: 'Cacao', intensity: 1 },
                { name: 'Nuez moscada', intensity: 3 }
              ],
              instruction: 'Huele cada frasco y ordénalos de más fuerte a más suave según su intensidad aromática. Coloca fichas numeradas del 1 al 5 frente a cada frasco (1= más fuerte). Luego introduce la secuencia de números (de A a E) en la caja fuerte.'
            },
            solution_data: {
              answer: '24513',
              explanation: 'Orden de más fuerte a más suave: Canela(2), Cardamomo(4), Vainilla(5), Cacao(1), Nuez moscada(3)'
            },
            input_methods: ['numeric_input'],
            validation_rules: {
              exact_match: true,
              numeric_only: true
            },
            hint_levels: [
              {
                level: 1,
                hint: 'Huele cada frasco cuidadosamente y compara intensidades',
                cost: 25
              },
              {
                level: 2,
                hint: 'Orden sugerido: Cacao(1), Canela(2), Nuez moscada(3), Cardamomo(4), Vainilla(5)',
                cost: 35
              },
              {
                level: 3,
                hint: 'La secuencia es 2-4-5-1-3',
                cost: 45
              }
            ],
            points_reward: 150,
            time_limit: 450,
            attempt_limit: 3
          }
        ],
        interactions: [
          {
            interaction_id: 'examine_roasting_room',
            type: 'examine',
            description: 'Examinar la sala de tostado',
            required: true
          },
          {
            interaction_id: 'smell_aromas',
            type: 'sensory',
            description: 'Oler cada frasco de especias',
            required: true
          },
          {
            interaction_id: 'use_safe',
            type: 'unlock',
            description: 'Usar la caja fuerte de 5 dígitos',
            required: true
          }
        ],
        qr_codes: [],
        ar_elements: [],
        tech_interactions: [],
        estimated_duration: 7,
        time_limit: 450,
        can_skip: false,
        hints: [
          {
            hint_id: 'hint-6-1',
            level: 1,
            text: 'Huele cada frasco cuidadosamente y compara intensidades',
            cost: 25
          }
        ],
        help_system: {
          tutorial_mode: true,
          progressive_hints: true
        },
        points_reward: 150,
        unlocks_next: ['scene-7-loyalty-cards'],
        story_revelations: ['La caja fuerte contiene tarjetas perforadas'],
        is_active: true,
        order_index: 6
      },
      {
        adventure_id: adventure.id,
        scene_number: 7,
        scene_id: 'scene-7-loyalty-cards',
        title: 'Tarjetas perforadas - Mensaje final',
        description: 'Las tarjetas de fidelidad tienen agujeros en distintas posiciones. Individualmente, parecen aleatorias, pero al superponerlas se forman letras.',
        act_number: 3,
        is_optional: false,
        unlock_conditions: {
          required_scenes: ['scene-6-roasting-room']
        },
        narrative_content: 'La caja fuerte se abre y contiene un conjunto de tres cartas perforadas (tarjetas de fidelidad) y una nota que dice: "Superpuesto, el mensaje se ve".',
        objectives: ['Superponer las tres tarjetas', 'Alinear los agujeros', 'Leer el mensaje BARISTA', 'Tomar la decisión final'],
        completion_criteria: {
          type: 'puzzle_solve',
          puzzle_id: 'overlay-message',
          required_solution: 'BARISTA'
        },
        puzzles: [
          {
            puzzle_id: 'overlay-message',
            title: 'Mensaje superpuesto en tarjetas',
            description: 'Coloca las tres tarjetas una encima de otra y alinéalas siguiendo las líneas impresas.',
            type: 'spatial',
            difficulty: 'beginner',
            puzzle_data: {
              cards: [
                { card_id: 'card_1', holes: [1, 3, 5, 7] },
                { card_id: 'card_2', holes: [2, 4, 6, 8] },
                { card_id: 'card_3', holes: [1, 2, 3, 4, 5, 6, 7, 8] }
              ],
              instruction: 'Coloca las tres tarjetas una encima de otra y alinéalas siguiendo las líneas impresas. Utiliza una linterna por debajo para ver el patrón de los agujeros superpuestos. Lee las letras que se forman.'
            },
            solution_data: {
              answer: 'BARISTA',
              explanation: 'Al superponer las tarjetas, los agujeros alineados forman las letras B-A-R-I-S-T-A'
            },
            input_methods: ['text_input'],
            validation_rules: {
              case_sensitive: false,
              exact_match: true
            },
            hint_levels: [
              {
                level: 1,
                hint: 'Superpón las tarjetas y alinéalas cuidadosamente',
                cost: 30
              },
              {
                level: 2,
                hint: 'Usa una linterna por debajo para ver mejor el patrón',
                cost: 40
              },
              {
                level: 3,
                hint: 'Los agujeros alineados forman la palabra BARISTA',
                cost: 50
              }
            ],
            points_reward: 200,
            time_limit: 500,
            attempt_limit: 3
          }
        ],
        interactions: [
          {
            interaction_id: 'examine_loyalty_cards',
            type: 'examine',
            description: 'Examinar las tarjetas de fidelidad perforadas',
            required: true
          },
          {
            interaction_id: 'overlay_cards',
            type: 'manipulate',
            description: 'Superponer las tarjetas',
            required: true
          },
          {
            interaction_id: 'use_flashlight',
            type: 'illuminate',
            description: 'Usar la linterna para ver el patrón',
            required: true
          }
        ],
        qr_codes: [],
        ar_elements: [],
        tech_interactions: [],
        estimated_duration: 8,
        time_limit: 500,
        can_skip: false,
        hints: [
          {
            hint_id: 'hint-7-1',
            level: 1,
            text: 'Superpón las tarjetas y alinéalas cuidadosamente',
            cost: 30
          }
        ],
        help_system: {
          tutorial_mode: true,
          progressive_hints: true
        },
        points_reward: 200,
        unlocks_next: [],
        story_revelations: ['El barista jefe es quien organiza la rebelión'],
        is_active: true,
        order_index: 7
      }
    ]

    const { data: insertedScenes, error: scenesError } = await supabase
      .from('cluequest_enhanced_scenes')
      .insert(scenes)
      .select()

    if (scenesError) {
      console.error('❌ Error inserting scenes:', scenesError)
      return
    }

    console.log('✅ Scenes inserted:', insertedScenes.length)

    // Insert puzzles for each scene
    const puzzles = []
    
    scenes.forEach((scene, index) => {
      if (scene.puzzles && scene.puzzles.length > 0) {
        scene.puzzles.forEach((puzzle, puzzleIndex) => {
          puzzles.push({
            scene_id: insertedScenes[index].id,
            puzzle_id: puzzle.puzzle_id,
            title: puzzle.title,
            description: puzzle.description,
            puzzle_type: puzzle.type,
            difficulty: puzzle.difficulty,
            category: puzzle.type,
            puzzle_data: puzzle.puzzle_data,
            solution_data: puzzle.solution_data,
            alternative_solutions: [],
            input_methods: puzzle.input_methods,
            validation_rules: puzzle.validation_rules,
            feedback_system: {},
            tech_requirements: [],
            ar_components: [],
            qr_integration: {},
            hint_levels: puzzle.hint_levels,
            help_resources: [],
            tutorial_mode: false,
            time_limit: puzzle.time_limit,
            attempt_limit: puzzle.attempt_limit,
            can_skip: false,
            points_reward: puzzle.points_reward,
            unlocks_content: [],
            failure_consequences: {},
            success_rate: 0,
            average_solve_time: null,
            hint_usage_rate: 0,
            is_active: true,
            order_index: puzzleIndex + 1
          })
        })
      }
    })

    if (puzzles.length > 0) {
      const { data: insertedPuzzles, error: puzzlesError } = await supabase
        .from('cluequest_enhanced_puzzles')
        .insert(puzzles)
        .select()

      if (puzzlesError) {
        console.error('❌ Error inserting puzzles:', puzzlesError)
        return
      }

      console.log('✅ Puzzles inserted:', insertedPuzzles.length)
    }

    console.log('\n🎉 The Cryptic Café Mystery Adventure successfully inserted!')
    console.log(`📊 Summary:`)
    console.log(`   - Adventure ID: ${adventure.id}`)
    console.log(`   - Scenes: ${insertedScenes.length}`)
    console.log(`   - Puzzles: ${puzzles.length}`)
    console.log(`   - Duration: 40 minutes`)
    console.log(`   - Difficulty: Beginner`)
    console.log(`   - Players: 2-6`)
    console.log(`   - Age: 8+`)

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the insertion
insertCrypticCafeAdventure()
