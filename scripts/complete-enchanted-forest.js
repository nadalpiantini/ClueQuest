#!/usr/bin/env node

/**
 * Complete El Bosque Encantado Adventure
 * Creates the remaining scenes, roles, and QR codes
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function completeEnchantedForest() {
  console.log('🎭 Completing El Bosque Encantado Adventure...\n');

  try {
    const adventureId = '550e8400-e29b-41d4-a716-446655440001';

    // Create adventure roles
    console.log('🎭 Creating adventure roles...');
    const roles = [
      {
        id: '550e8400-e29b-41d4-a716-446655440010',
        adventure_id: adventureId,
        name: 'Mago Musical',
        description: 'Un hechicero especializado en melodías mágicas. Tiene ventaja en desafíos musicales y puede obtener pistas adicionales sobre las notas perdidas.',
        perks: ['musical_hints', 'extra_time_music_challenges', 'ar_character_friendship'],
        point_multiplier: 1.2,
        max_players: 5
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440011',
        adventure_id: adventureId,
        name: 'Guardian del Bosque',
        description: 'Un protector de la naturaleza con conocimiento profundo de las criaturas del bosque. Obtiene bonificaciones en acertijos sobre la naturaleza.',
        perks: ['nature_hints', 'animal_whisperer', 'environmental_bonus'],
        point_multiplier: 1.1,
        max_players: 5
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440012',
        adventure_id: adventureId,
        name: 'Aventurero Valiente',
        description: 'Un explorador intrépido que no teme a los desafíos. Tiene resistencia extra y puede intentar desafíos múltiples veces sin penalización.',
        perks: ['extra_attempts', 'fearless_bonus', 'exploration_hints'],
        point_multiplier: 1.0,
        max_players: 8
      }
    ];

    const { data: createdRoles, error: rolesError } = await supabase
      .from('cluequest_adventure_roles')
      .insert(roles)
      .select();

    if (rolesError) {
      console.error('❌ Roles creation failed:', rolesError);
    } else {
      console.log(`✅ ${createdRoles.length} roles created`);
    }

    // Create scenes
    console.log('🎪 Creating adventure scenes...');
    const scenes = [
      {
        id: '550e8400-e29b-41d4-a716-446655440020',
        adventure_id: adventureId,
        title: 'El Árbol de Entrada',
        description: 'Una hada aparece desde las ramas del árbol centenario y te cuenta la historia del bosque encantado. Te da la primera pista y un acertijo para encontrar el piano mágico.',
        order_index: 1,
        interaction_type: 'qr_scan_ar_character',
        completion_criteria: 'Escuchar la historia completa y resolver el acertijo de la hada',
        points_reward: 100,
        narrative_data: {
          character: {
            name: 'Luna, la Hada de la Luz',
            description: 'Una hada brillante con alas de cristal que custodia la entrada del bosque',
            personality: 'amable, sabia, protectora',
            voice: 'suave y melodiosa'
          },
          story: 'Bienvenido, valiente aventurero. El Bosque Encantado ha perdido su melodía sagrada. Un hechizo oscuro ha dispersado las siete notas musicales que mantienen el equilibrio. Cada nota está custodiada por un guardián mágico. Tu misión es recuperarlas todas para restaurar la armonía del bosque.',
          riddle: 'Soy un instrumento que no se toca, pero sin mí no hay música. ¿Qué soy?',
          riddle_answer: 'piano',
          reward_item: 'M',
          hints: [
            'Tiene teclas pero no suena solo',
            'Se encuentra en el corazón del bosque',
            'Es el instrumento más grande de la orquesta'
          ]
        }
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440021',
        adventure_id: adventureId,
        title: 'El Piano Encantado',
        description: 'Un duende pianista aparece en AR tocando melodías mágicas. Te presenta tres desafíos: trabalenguas, adivinanza musical y observación de su sombrero.',
        order_index: 2,
        interaction_type: 'qr_scan_ar_interactive',
        completion_criteria: 'Completar al menos 2 de los 3 desafíos del duende',
        points_reward: 150,
        narrative_data: {
          character: {
            name: 'Melodio, el Duende Pianista',
            description: 'Un duende travieso con un sombrero rojo brillante que toca el piano mágico',
            personality: 'juguetón, musical, desafiante',
            voice: 'aguda y rítmica'
          },
          story: '¡Ah! Un nuevo aventurero ha llegado a mi piano. Soy Melodio, el guardián de la segunda nota. Para obtenerla, debes demostrar tu valía en mis tres pruebas musicales.',
          challenges: [
            {
              type: 'tongue_twister',
              title: 'El Trabalenguas del Duende',
              text: 'Tres tristes duendes dan trompicones con trompetas y tambores',
              instruction: 'Repite este trabalenguas sin equivocarte',
              points: 50
            },
            {
              type: 'musical_riddle',
              title: 'La Adivinanza Musical',
              question: '¿Qué instrumento tiene teclas pero no suena si no lo tocas?',
              answer: 'piano',
              points: 50
            },
            {
              type: 'observation',
              title: 'El Sombrero Mágico',
              question: '¿De qué color es mi sombrero?',
              answer: 'rojo',
              instruction: 'Observa cuidadosamente mi sombrero en AR',
              points: 50
            }
          ],
          reward_item: 'U',
          success_message: '¡Excelente! Has demostrado tu valía musical. Aquí tienes la nota U.'
        }
      }
    ];

    const { data: createdScenes, error: scenesError } = await supabase
      .from('cluequest_scenes')
      .insert(scenes)
      .select();

    if (scenesError) {
      console.error('❌ Scenes creation failed:', scenesError);
    } else {
      console.log(`✅ ${createdScenes.length} scenes created`);
    }

    // Create QR codes for the scenes
    console.log('📱 Creating QR codes...');
    const qrCodes = [
      {
        id: '550e8400-e29b-41d4-a716-446655440030',
        scene_id: scenes[0].id,
        qr_data: 'ENCHANTED_FOREST_ENTRANCE_TREE_001',
        location: { type: 'Point', coordinates: [0, 0] },
        is_active: true,
        scan_count: 0,
        token: 'entrance_tree_001',
        display_text: 'Árbol de Entrada - El Bosque Encantado',
        status: 'active',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        max_scans: 1000,
        unique_scan_count: 0,
        required_location: { type: 'Point', coordinates: [0, 0] },
        proximity_tolerance: 50,
        rate_limit_per_user: 1,
        cooldown_seconds: 5,
        active_from: new Date().toISOString(),
        active_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440031',
        scene_id: scenes[1].id,
        qr_data: 'ENCHANTED_FOREST_MAGIC_PIANO_002',
        location: { type: 'Point', coordinates: [0, 0] },
        is_active: true,
        scan_count: 0,
        token: 'magic_piano_002',
        display_text: 'Piano Encantado - El Bosque Encantado',
        status: 'active',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        max_scans: 1000,
        unique_scan_count: 0,
        required_location: { type: 'Point', coordinates: [0, 0] },
        proximity_tolerance: 50,
        rate_limit_per_user: 1,
        cooldown_seconds: 5,
        active_from: new Date().toISOString(),
        active_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const { data: createdQRCodes, error: qrError } = await supabase
      .from('cluequest_qr_codes')
      .insert(qrCodes)
      .select();

    if (qrError) {
      console.error('❌ QR codes creation failed:', qrError);
    } else {
      console.log(`✅ ${createdQRCodes.length} QR codes created`);
    }

    console.log('\n🎉 El Bosque Encantado Adventure completed successfully!');
    console.log('🎭 Adventure ID:', adventureId);
    console.log('🎪 Ready for players to experience the magical forest!');

  } catch (error) {
    console.error('❌ Completion failed:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  completeEnchantedForest();
}

module.exports = { completeEnchantedForest };
