-- ClueQuest: El Bosque Encantado Adventure
-- Creates the complete "El Bosque Encantado" adventure with all scenes, QR codes, and challenges

-- =============================================================================
-- ADVENTURE CREATION
-- =============================================================================

-- Insert the main adventure
INSERT INTO cluequest_adventures (
    id,
    organization_id,
    creator_id,
    title,
    description,
    category,
    difficulty,
    estimated_duration,
    theme_name,
    theme_config,
    cover_image_url,
    background_music_url,
    settings,
    security_config,
    allows_teams,
    max_team_size,
    max_participants,
    min_participants,
    leaderboard_enabled,
    live_tracking,
    chat_enabled,
    hints_enabled,
    ai_personalization,
    adaptive_difficulty,
    ai_avatars_enabled,
    ai_narrative_enabled,
    offline_mode,
    accessibility_features,
    language_support,
    status,
    tags,
    is_template,
    is_public
) VALUES (
    '550e8400-e29b-41d4-a716-446655440001', -- Fixed UUID for consistency
    (SELECT id FROM cluequest_organizations LIMIT 1), -- Use first organization
    (SELECT id FROM auth.users LIMIT 1), -- Use first user as creator
    'El Bosque Encantado',
    'Una aventura mágica donde debes recuperar las notas musicales perdidas que mantienen el equilibrio del bosque. Cada QR te llevará a un personaje fantástico que custodia una nota a cambio de superar una prueba única.',
    'entertainment',
    'intermediate',
    45, -- 45 minutes estimated duration
    'enchanted_forest',
    '{
        "colors": {
            "primary": "#2D5016",
            "secondary": "#8FBC8F",
            "accent": "#FFD700",
            "background": "#F0F8E8",
            "text": "#1A1A1A"
        },
        "fonts": {
            "primary": "Cinzel",
            "secondary": "Merriweather"
        },
        "atmosphere": "mystical_forest",
        "music_theme": "celtic_fantasy"
    }',
    '/images/adventures/enchanted-forest-cover.jpg',
    '/audio/background/enchanted-forest-theme.mp3',
    '{
        "collectible_items": ["M", "U", "S", "I", "C", "A"],
        "final_word": "MUSICA",
        "scoring_system": {
            "base_points_per_scene": 100,
            "bonus_points": {
                "speed_bonus": 50,
                "perfect_completion": 25,
                "teamwork": 30
            },
            "penalties": {
                "hint_used": -10,
                "wrong_answer": -5
            }
        },
        "interactive_features": {
            "voice_recognition": true,
            "ar_characters": true,
            "mini_games": true,
            "camera_integration": true
        }
    }',
    '{
        "qr_security": "high",
        "location_validation": true,
        "anti_cheat": true,
        "session_timeout": 3600
    }',
    true, -- allows_teams
    4, -- max_team_size
    20, -- max_participants
    1, -- min_participants
    true, -- leaderboard_enabled
    true, -- live_tracking
    false, -- chat_enabled
    true, -- hints_enabled
    true, -- ai_personalization
    true, -- adaptive_difficulty
    true, -- ai_avatars_enabled
    true, -- ai_narrative_enabled
    true, -- offline_mode
    '["audio_descriptions", "high_contrast", "large_text"]', -- accessibility_features
    ARRAY['es', 'en'], -- language_support
    'published', -- status
    ARRAY['fantasy', 'music', 'ar', 'interactive', 'family'], -- tags
    false, -- is_template
    true -- is_public
);

-- =============================================================================
-- ADVENTURE ROLES
-- =============================================================================

-- Insert adventure roles
INSERT INTO cluequest_adventure_roles (
    id,
    adventure_id,
    name,
    description,
    perks,
    point_multiplier,
    max_players,
    is_available
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440001',
    'Mago Musical',
    'Un hechicero especializado en melodías mágicas. Tiene ventaja en desafíos musicales y puede obtener pistas adicionales sobre las notas perdidas.',
    '["musical_hints", "extra_time_music_challenges", "ar_character_friendship"]',
    1.2,
    5,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440001',
    'Guardian del Bosque',
    'Un protector de la naturaleza con conocimiento profundo de las criaturas del bosque. Obtiene bonificaciones en acertijos sobre la naturaleza.',
    '["nature_hints", "animal_whisperer", "environmental_bonus"]',
    1.1,
    5,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440001',
    'Aventurero Valiente',
    'Un explorador intrépido que no teme a los desafíos. Tiene resistencia extra y puede intentar desafíos múltiples veces sin penalización.',
    '["extra_attempts", "fearless_bonus", "exploration_hints"]',
    1.0,
    8,
    true
);

-- =============================================================================
-- ADVENTURE SCENES
-- =============================================================================

-- Scene 1: Árbol de Entrada (Hada)
INSERT INTO cluequest_scenes (
    id,
    adventure_id,
    title,
    description,
    order_index,
    interaction_type,
    completion_criteria,
    points_reward,
    narrative_data,
    scene_config,
    is_active
) VALUES (
    '550e8400-e29b-41d4-a716-446655440020',
    '550e8400-e29b-41d4-a716-446655440001',
    'El Árbol de Entrada',
    'Una hada aparece desde las ramas del árbol centenario y te cuenta la historia del bosque encantado. Te da la primera pista y un acertijo para encontrar el piano mágico.',
    1,
    'qr_scan_ar_character',
    'Escuchar la historia completa y resolver el acertijo de la hada',
    100,
    '{
        "character": {
            "name": "Luna, la Hada de la Luz",
            "description": "Una hada brillante con alas de cristal que custodia la entrada del bosque",
            "personality": "amable, sabia, protectora",
            "voice": "suave y melodiosa"
        },
        "story": "Bienvenido, valiente aventurero. El Bosque Encantado ha perdido su melodía sagrada. Un hechizo oscuro ha dispersado las siete notas musicales que mantienen el equilibrio. Cada nota está custodiada por un guardián mágico. Tu misión es recuperarlas todas para restaurar la armonía del bosque.",
        "riddle": "Soy un instrumento que no se toca, pero sin mí no hay música. ¿Qué soy?",
        "riddle_answer": "piano",
        "reward_item": "M",
        "hints": [
            "Tiene teclas pero no suena solo",
            "Se encuentra en el corazón del bosque",
            "Es el instrumento más grande de la orquesta"
        ]
    }',
    '{
        "ar_character": {
            "model_url": "/ar/models/fairy-luna.glb",
            "animation": "welcome_gesture",
            "scale": 0.8,
            "position": {"x": 0, "y": 0, "z": 0}
        },
        "audio": {
            "background_music": "/audio/scenes/entrance-tree.mp3",
            "character_voice": "/audio/characters/luna-fairy.mp3"
        },
        "interaction": {
            "type": "riddle_solving",
            "time_limit": 300,
            "max_attempts": 3,
            "voice_recognition": false
        }
    }',
    true
);

-- Scene 2: Piano Encantado (Duende Pianista)
INSERT INTO cluequest_scenes (
    id,
    adventure_id,
    title,
    description,
    order_index,
    interaction_type,
    completion_criteria,
    points_reward,
    narrative_data,
    scene_config,
    is_active
) VALUES (
    '550e8400-e29b-41d4-a716-446655440021',
    '550e8400-e29b-41d4-a716-446655440001',
    'El Piano Encantado',
    'Un duende pianista aparece en AR tocando melodías mágicas. Te presenta tres desafíos: trabalenguas, adivinanza musical y observación de su sombrero.',
    2,
    'qr_scan_ar_interactive',
    'Completar al menos 2 de los 3 desafíos del duende',
    150,
    '{
        "character": {
            "name": "Melodio, el Duende Pianista",
            "description": "Un duende travieso con un sombrero rojo brillante que toca el piano mágico",
            "personality": "juguetón, musical, desafiante",
            "voice": "aguda y rítmica"
        },
        "story": "¡Ah! Un nuevo aventurero ha llegado a mi piano. Soy Melodio, el guardián de la segunda nota. Para obtenerla, debes demostrar tu valía en mis tres pruebas musicales.",
        "challenges": [
            {
                "type": "tongue_twister",
                "title": "El Trabalenguas del Duende",
                "text": "Tres tristes duendes dan trompicones con trompetas y tambores",
                "instruction": "Repite este trabalenguas sin equivocarte",
                "points": 50
            },
            {
                "type": "musical_riddle",
                "title": "La Adivinanza Musical",
                "question": "¿Qué instrumento tiene teclas pero no suena si no lo tocas?",
                "answer": "piano",
                "points": 50
            },
            {
                "type": "observation",
                "title": "El Sombrero Mágico",
                "question": "¿De qué color es mi sombrero?",
                "answer": "rojo",
                "instruction": "Observa cuidadosamente mi sombrero en AR",
                "points": 50
            }
        ],
        "reward_item": "U",
        "success_message": "¡Excelente! Has demostrado tu valía musical. Aquí tienes la nota U."
    }',
    '{
        "ar_character": {
            "model_url": "/ar/models/duende-pianista.glb",
            "animation": "playing_piano",
            "scale": 0.9,
            "position": {"x": 0, "y": 0, "z": 0}
        },
        "audio": {
            "background_music": "/audio/scenes/piano-encantado.mp3",
            "character_voice": "/audio/characters/melodio-duende.mp3",
            "piano_melody": "/audio/music/piano-melody.mp3"
        },
        "interaction": {
            "type": "multiple_challenges",
            "time_limit": 600,
            "max_attempts": 2,
            "voice_recognition": true,
            "required_challenges": 2
        }
    }',
    true
);

-- Scene 3: Árbol de Sabiduría (Espíritu del Árbol)
INSERT INTO cluequest_scenes (
    id,
    adventure_id,
    title,
    description,
    order_index,
    interaction_type,
    completion_criteria,
    points_reward,
    narrative_data,
    scene_config,
    is_active
) VALUES (
    '550e8400-e29b-41d4-a716-446655440022',
    '550e8400-e29b-41d4-a716-446655440001',
    'El Árbol de Sabiduría',
    'El espíritu ancestral del árbol más antiguo del bosque te propone una serie de adivinanzas sobre la naturaleza. Su sabiduría milenaria te guiará hacia la siguiente nota.',
    3,
    'qr_scan_riddle_sequence',
    'Resolver correctamente 3 de 5 adivinanzas del espíritu',
    120,
    '{
        "character": {
            "name": "Sagewood, el Espíritu Ancestral",
            "description": "El espíritu milenario del árbol más antiguo del bosque, con ojos que brillan como estrellas",
            "personality": "sabio, paciente, misterioso",
            "voice": "profunda y resonante"
        },
        "story": "Saludo, buscador de melodías. Soy Sagewood, guardián de la sabiduría del bosque. Mi conocimiento se extiende por milenios. Para obtener la tercera nota, debes demostrar tu comprensión de los misterios de la naturaleza.",
        "riddles": [
            {
                "question": "Cuanto más quitas, más grande es. ¿Qué es?",
                "answer": "agujero",
                "points": 40
            },
            {
                "question": "Tengo hojas pero no soy árbol, tengo espinas pero no soy rosa. ¿Qué soy?",
                "answer": "libro",
                "points": 40
            },
            {
                "question": "Soy transparente como el cristal, pero puedo sostener montañas. ¿Qué soy?",
                "answer": "agua",
                "points": 40
            },
            {
                "question": "Vuelo sin alas, lloro sin ojos. ¿Qué soy?",
                "answer": "nube",
                "points": 40
            },
            {
                "question": "Soy redondo como la luna, pero no soy la luna. ¿Qué soy?",
                "answer": "sol",
                "points": 40
            }
        ],
        "reward_item": "S",
        "success_message": "Tu sabiduría honra al bosque. La nota S es tuya."
    }',
    '{
        "ar_character": {
            "model_url": "/ar/models/tree-spirit.glb",
            "animation": "wisdom_gesture",
            "scale": 1.2,
            "position": {"x": 0, "y": 0, "z": 0}
        },
        "audio": {
            "background_music": "/audio/scenes/tree-wisdom.mp3",
            "character_voice": "/audio/characters/sagewood-spirit.mp3",
            "nature_sounds": "/audio/ambient/forest-wisdom.mp3"
        },
        "interaction": {
            "type": "riddle_sequence",
            "time_limit": 480,
            "max_attempts": 2,
            "required_correct": 3,
            "total_riddles": 5
        }
    }',
    true
);

-- Scene 4: Estanque Luminoso (Ninfa del Lago)
INSERT INTO cluequest_scenes (
    id,
    adventure_id,
    title,
    description,
    order_index,
    interaction_type,
    completion_criteria,
    points_reward,
    narrative_data,
    scene_config,
    is_active
) VALUES (
    '550e8400-e29b-41d4-a716-446655440023',
    '550e8400-e29b-41d4-a716-446655440001',
    'El Estanque Luminoso',
    'Una ninfa del agua emerge del estanque y te muestra un patrón de luces y sonidos que debes replicar. También incluye un mini-puzzle de ordenar letras para formar una palabra mágica.',
    4,
    'qr_scan_mini_game',
    'Replicar el patrón de luces/sonidos y resolver el puzzle de letras',
    180,
    '{
        "character": {
            "name": "Aquaria, la Ninfa del Lago",
            "description": "Una ninfa acuática con cabello que brilla como el agua y una voz que suena como cascadas",
            "personality": "juguetona, acuática, rítmica",
            "voice": "líquida y melodiosa"
        },
        "story": "Las aguas del estanque te saludan, aventurero. Soy Aquaria, guardián de las profundidades. Mi danza de luces y sonidos te llevará a la cuarta nota, pero solo si puedes seguir mi ritmo.",
        "mini_games": [
            {
                "type": "pattern_replication",
                "title": "La Danza de las Luces",
                "description": "Replica el patrón de luces y sonidos que te muestro",
                "pattern": ["azul", "verde", "azul", "rojo", "verde", "rojo"],
                "points": 90
            },
            {
                "type": "word_puzzle",
                "title": "El Puzzle de las Letras Mágicas",
                "description": "Ordena estas letras para formar una palabra mágica: A-G-U-A",
                "answer": "AGUA",
                "points": 90
            }
        ],
        "reward_item": "I",
        "success_message": "¡Perfecto! Tu ritmo y tu mente están en armonía. La nota I es tuya."
    }',
    '{
        "ar_character": {
            "model_url": "/ar/models/water-nymph.glb",
            "animation": "water_dance",
            "scale": 0.9,
            "position": {"x": 0, "y": 0, "z": 0}
        },
        "audio": {
            "background_music": "/audio/scenes/luminous-pond.mp3",
            "character_voice": "/audio/characters/aquaria-nymph.mp3",
            "water_sounds": "/audio/ambient/pond-water.mp3"
        },
        "interaction": {
            "type": "mini_games",
            "time_limit": 420,
            "max_attempts": 2,
            "required_games": 2,
            "touch_interaction": true
        }
    }',
    true
);

-- Scene 5: Casa de las Hadas (Hada Artesana)
INSERT INTO cluequest_scenes (
    id,
    adventure_id,
    title,
    description,
    order_index,
    interaction_type,
    completion_criteria,
    points_reward,
    narrative_data,
    scene_config,
    is_active
) VALUES (
    '550e8400-e29b-41d4-a716-446655440024',
    '550e8400-e29b-41d4-a716-446655440001',
    'La Casa de las Hadas',
    'Una hada artesana te pide tomar una selfie con ella en AR y encontrar un objeto real del color que ella indica. También puede dar un trabalenguas extra para puntos bonus.',
    5,
    'qr_scan_camera_ar',
    'Tomar selfie con la hada y encontrar objeto del color indicado',
    140,
    '{
        "character": {
            "name": "Craftia, la Hada Artesana",
            "description": "Una hada creativa con herramientas mágicas y un delantal lleno de polvo de hadas",
            "personality": "creativa, artística, amigable",
            "voice": "alegre y entusiasta"
        },
        "story": "¡Bienvenido a mi taller mágico! Soy Craftia, la artesana del bosque. Me encanta crear y capturar momentos especiales. Para obtener la quinta nota, necesito que me ayudes con dos tareas artísticas.",
        "challenges": [
            {
                "type": "ar_selfie",
                "title": "Selfie Mágica",
                "description": "Toma una selfie conmigo usando la cámara AR",
                "instruction": "Posiciona tu cámara para que ambos aparezcamos en la foto",
                "points": 70
            },
            {
                "type": "color_hunt",
                "title": "La Búsqueda del Color",
                "description": "Encuentra un objeto real del color que te indique",
                "color": "verde",
                "instruction": "Busca algo verde en tu entorno y tómalo una foto",
                "points": 70
            },
            {
                "type": "bonus_tongue_twister",
                "title": "Trabalenguas Bonus",
                "text": "Hadas hábiles hacen hadas hermosas con hilos de hadas",
                "instruction": "Repite este trabalenguas para puntos extra",
                "points": 30,
                "bonus": true
            }
        ],
        "reward_item": "C",
        "success_message": "¡Qué creatividad! Has capturado la esencia del arte. La nota C es tuya."
    }',
    '{
        "ar_character": {
            "model_url": "/ar/models/craft-fairy.glb",
            "animation": "crafting_gesture",
            "scale": 0.8,
            "position": {"x": 0, "y": 0, "z": 0}
        },
        "audio": {
            "background_music": "/audio/scenes/fairy-house.mp3",
            "character_voice": "/audio/characters/craftia-fairy.mp3",
            "crafting_sounds": "/audio/ambient/fairy-workshop.mp3"
        },
        "interaction": {
            "type": "camera_ar",
            "time_limit": 360,
            "max_attempts": 2,
            "camera_required": true,
            "ar_selfie": true,
            "color_detection": true
        }
    }',
    true
);

-- Scene 6: Prueba de la Poción (Alquimista Goblin)
INSERT INTO cluequest_scenes (
    id,
    adventure_id,
    title,
    description,
    order_index,
    interaction_type,
    completion_criteria,
    points_reward,
    narrative_data,
    scene_config,
    is_active
) VALUES (
    '550e8400-e29b-41d4-a716-446655440025',
    '550e8400-e29b-41d4-a716-446655440001',
    'La Prueba de la Poción',
    'Un alquimista goblin muestra frascos en AR y pide combinarlos en un orden específico. Si logras la mezcla correcta, obtienes la penúltima nota.',
    6,
    'qr_scan_drag_drop',
    'Combinar los frascos en el orden correcto para crear la poción mágica',
    160,
    '{
        "character": {
            "name": "Potionix, el Alquimista Goblin",
            "description": "Un goblin sabio con gafas de aumento y un laboratorio lleno de frascos brillantes",
            "personality": "científico, meticuloso, excéntrico",
            "voice": "nasal y rápida"
        },
        "story": "¡Ah! Un nuevo aprendiz ha llegado a mi laboratorio. Soy Potionix, el maestro de las pociones. Mi experimento más importante requiere la sexta nota, pero solo la obtendrás si demuestras ser un verdadero alquimista.",
        "potion_challenge": {
            "title": "La Poción de la Armonía",
            "description": "Combina los frascos en el orden correcto para crear la poción que restaurará la melodía del bosque",
            "ingredients": [
                {"color": "azul", "name": "Lágrimas de Luna", "order": 1},
                {"color": "verde", "name": "Savía del Árbol", "order": 2},
                {"color": "dorado", "name": "Polvo de Hada", "order": 3},
                {"color": "rojo", "name": "Esencia de Fuego", "order": 4}
            ],
            "correct_sequence": ["azul", "verde", "dorado", "rojo"],
            "points": 160
        },
        "reward_item": "A",
        "success_message": "¡Excelente alquimia! Tu poción es perfecta. La nota A es tuya."
    }',
    '{
        "ar_character": {
            "model_url": "/ar/models/goblin-alchemist.glb",
            "animation": "mixing_potion",
            "scale": 0.9,
            "position": {"x": 0, "y": 0, "z": 0}
        },
        "audio": {
            "background_music": "/audio/scenes/potion-lab.mp3",
            "character_voice": "/audio/characters/potionix-goblin.mp3",
            "lab_sounds": "/audio/ambient/alchemy-lab.mp3"
        },
        "interaction": {
            "type": "drag_drop",
            "time_limit": 300,
            "max_attempts": 3,
            "touch_interaction": true,
            "sequence_required": true
        }
    }',
    true
);

-- Scene 7: Guardián Final (Mago/Dragón)
INSERT INTO cluequest_scenes (
    id,
    adventure_id,
    title,
    description,
    order_index,
    interaction_type,
    completion_criteria,
    points_reward,
    narrative_data,
    scene_config,
    is_active
) VALUES (
    '550e8400-e29b-41d4-a716-446655440026',
    '550e8400-e29b-41d4-a716-446655440001',
    'El Guardián Final',
    'El mago supremo del bosque te presenta el puzzle final. Debes formar la palabra MUSICA con todas las letras recolectadas y resolver un rompecabezas que combina rimas, adivinanzas y observación.',
    7,
    'qr_scan_final_puzzle',
    'Formar la palabra MUSICA y resolver el puzzle final del mago',
    200,
    '{
        "character": {
            "name": "Maestro Melodius, el Mago Supremo",
            "description": "Un mago anciano con una barba que brilla como estrellas y un bastón que pulsa con música",
            "personality": "sabio, poderoso, justo",
            "voice": "profunda y resonante"
        },
        "story": "Has llegado al final de tu búsqueda, valiente aventurero. Soy Maestro Melodius, guardián de la melodía sagrada. Has recolectado las seis notas, pero para restaurar la armonía del bosque, debes demostrar que comprendes el poder de la música.",
        "final_puzzle": {
            "title": "El Puzzle de la Melodía Sagrada",
            "description": "Combina todas las notas recolectadas y resuelve el enigma final",
            "steps": [
                {
                    "type": "word_formation",
                    "title": "Formar la Palabra Mágica",
                    "description": "Usa las letras recolectadas para formar la palabra que restaura la melodía",
                    "letters": ["M", "U", "S", "I", "C", "A"],
                    "answer": "MUSICA",
                    "points": 100
                },
                {
                    "type": "final_riddle",
                    "title": "El Enigma del Mago",
                    "question": "Soy el sonido que une a todos los seres del bosque. Sin mí, no hay armonía. ¿Qué soy?",
                    "answer": "música",
                    "points": 100
                }
            ]
        },
        "reward_item": "COMPLETION",
        "success_message": "¡Felicidades! Has restaurado la melodía del Bosque Encantado. La armonía ha regresado y todos los seres mágicos te agradecen.",
        "completion_rewards": {
            "badge": "Guardian de la Melodía",
            "title": "Maestro del Bosque Encantado",
            "special_unlock": "Acceso a aventuras musicales exclusivas"
        }
    }',
    '{
        "ar_character": {
            "model_url": "/ar/models/master-wizard.glb",
            "animation": "magic_ceremony",
            "scale": 1.1,
            "position": {"x": 0, "y": 0, "z": 0}
        },
        "audio": {
            "background_music": "/audio/scenes/final-guardian.mp3",
            "character_voice": "/audio/characters/maestro-melodius.mp3",
            "magic_sounds": "/audio/ambient/magic-ceremony.mp3"
        },
        "interaction": {
            "type": "final_puzzle",
            "time_limit": 600,
            "max_attempts": 1,
            "requires_all_letters": true,
            "celebration_animation": true
        }
    }',
    true
);

-- =============================================================================
-- QR CODES FOR EACH SCENE
-- =============================================================================

-- QR Code for Scene 1: Árbol de Entrada
INSERT INTO cluequest_qr_codes (
    id,
    scene_id,
    qr_data,
    location,
    is_active,
    scan_count,
    token,
    display_text,
    status,
    expires_at,
    max_scans,
    unique_scan_count,
    required_location,
    proximity_tolerance,
    rate_limit_per_user,
    cooldown_seconds,
    active_from,
    active_until
) VALUES (
    '550e8400-e29b-41d4-a716-446655440030',
    '550e8400-e29b-41d4-a716-446655440020',
    'ENCHANTED_FOREST_ENTRANCE_TREE_001',
    '{"type": "Point", "coordinates": [0, 0]}',
    true,
    0,
    'entrance_tree_001',
    'Árbol de Entrada - El Bosque Encantado',
    'active',
    NOW() + INTERVAL '30 days',
    1000,
    0,
    '{"type": "Point", "coordinates": [0, 0]}',
    50,
    1,
    5,
    NOW(),
    NOW() + INTERVAL '30 days'
);

-- QR Code for Scene 2: Piano Encantado
INSERT INTO cluequest_qr_codes (
    id,
    scene_id,
    qr_data,
    location,
    is_active,
    scan_count,
    token,
    display_text,
    status,
    expires_at,
    max_scans,
    unique_scan_count,
    required_location,
    proximity_tolerance,
    rate_limit_per_user,
    cooldown_seconds,
    active_from,
    active_until
) VALUES (
    '550e8400-e29b-41d4-a716-446655440031',
    '550e8400-e29b-41d4-a716-446655440021',
    'ENCHANTED_FOREST_MAGIC_PIANO_002',
    '{"type": "Point", "coordinates": [0, 0]}',
    true,
    0,
    'magic_piano_002',
    'Piano Encantado - El Bosque Encantado',
    'active',
    NOW() + INTERVAL '30 days',
    1000,
    0,
    '{"type": "Point", "coordinates": [0, 0]}',
    50,
    1,
    5,
    NOW(),
    NOW() + INTERVAL '30 days'
);

-- QR Code for Scene 3: Árbol de Sabiduría
INSERT INTO cluequest_qr_codes (
    id,
    scene_id,
    qr_data,
    location,
    is_active,
    scan_count,
    token,
    display_text,
    status,
    expires_at,
    max_scans,
    unique_scan_count,
    required_location,
    proximity_tolerance,
    rate_limit_per_user,
    cooldown_seconds,
    active_from,
    active_until
) VALUES (
    '550e8400-e29b-41d4-a716-446655440032',
    '550e8400-e29b-41d4-a716-446655440022',
    'ENCHANTED_FOREST_WISDOM_TREE_003',
    '{"type": "Point", "coordinates": [0, 0]}',
    true,
    0,
    'wisdom_tree_003',
    'Árbol de Sabiduría - El Bosque Encantado',
    'active',
    NOW() + INTERVAL '30 days',
    1000,
    0,
    '{"type": "Point", "coordinates": [0, 0]}',
    50,
    1,
    5,
    NOW(),
    NOW() + INTERVAL '30 days'
);

-- QR Code for Scene 4: Estanque Luminoso
INSERT INTO cluequest_qr_codes (
    id,
    scene_id,
    qr_data,
    location,
    is_active,
    scan_count,
    token,
    display_text,
    status,
    expires_at,
    max_scans,
    unique_scan_count,
    required_location,
    proximity_tolerance,
    rate_limit_per_user,
    cooldown_seconds,
    active_from,
    active_until
) VALUES (
    '550e8400-e29b-41d4-a716-446655440033',
    '550e8400-e29b-41d4-a716-446655440023',
    'ENCHANTED_FOREST_LUMINOUS_POND_004',
    '{"type": "Point", "coordinates": [0, 0]}',
    true,
    0,
    'luminous_pond_004',
    'Estanque Luminoso - El Bosque Encantado',
    'active',
    NOW() + INTERVAL '30 days',
    1000,
    0,
    '{"type": "Point", "coordinates": [0, 0]}',
    50,
    1,
    5,
    NOW(),
    NOW() + INTERVAL '30 days'
);

-- QR Code for Scene 5: Casa de las Hadas
INSERT INTO cluequest_qr_codes (
    id,
    scene_id,
    qr_data,
    location,
    is_active,
    scan_count,
    token,
    display_text,
    status,
    expires_at,
    max_scans,
    unique_scan_count,
    required_location,
    proximity_tolerance,
    rate_limit_per_user,
    cooldown_seconds,
    active_from,
    active_until
) VALUES (
    '550e8400-e29b-41d4-a716-446655440034',
    '550e8400-e29b-41d4-a716-446655440024',
    'ENCHANTED_FOREST_FAIRY_HOUSE_005',
    '{"type": "Point", "coordinates": [0, 0]}',
    true,
    0,
    'fairy_house_005',
    'Casa de las Hadas - El Bosque Encantado',
    'active',
    NOW() + INTERVAL '30 days',
    1000,
    0,
    '{"type": "Point", "coordinates": [0, 0]}',
    50,
    1,
    5,
    NOW(),
    NOW() + INTERVAL '30 days'
);

-- QR Code for Scene 6: Prueba de la Poción
INSERT INTO cluequest_qr_codes (
    id,
    scene_id,
    qr_data,
    location,
    is_active,
    scan_count,
    token,
    display_text,
    status,
    expires_at,
    max_scans,
    unique_scan_count,
    required_location,
    proximity_tolerance,
    rate_limit_per_user,
    cooldown_seconds,
    active_from,
    active_until
) VALUES (
    '550e8400-e29b-41d4-a716-446655440035',
    '550e8400-e29b-41d4-a716-446655440025',
    'ENCHANTED_FOREST_POTION_TEST_006',
    '{"type": "Point", "coordinates": [0, 0]}',
    true,
    0,
    'potion_test_006',
    'Prueba de la Poción - El Bosque Encantado',
    'active',
    NOW() + INTERVAL '30 days',
    1000,
    0,
    '{"type": "Point", "coordinates": [0, 0]}',
    50,
    1,
    5,
    NOW(),
    NOW() + INTERVAL '30 days'
);

-- QR Code for Scene 7: Guardián Final
INSERT INTO cluequest_qr_codes (
    id,
    scene_id,
    qr_data,
    location,
    is_active,
    scan_count,
    token,
    display_text,
    status,
    expires_at,
    max_scans,
    unique_scan_count,
    required_location,
    proximity_tolerance,
    rate_limit_per_user,
    cooldown_seconds,
    active_from,
    active_until
) VALUES (
    '550e8400-e29b-41d4-a716-446655440036',
    '550e8400-e29b-41d4-a716-446655440026',
    'ENCHANTED_FOREST_FINAL_GUARDIAN_007',
    '{"type": "Point", "coordinates": [0, 0]}',
    true,
    0,
    'final_guardian_007',
    'Guardián Final - El Bosque Encantado',
    'active',
    NOW() + INTERVAL '30 days',
    1000,
    0,
    '{"type": "Point", "coordinates": [0, 0]}',
    50,
    1,
    5,
    NOW(),
    NOW() + INTERVAL '30 days'
);

-- =============================================================================
-- COMMENTS AND DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE cluequest_adventures IS 'El Bosque Encantado - Aventura mágica con 7 escenas interactivas que combina QR, AR, reconocimiento de voz y mini-juegos para crear una experiencia inmersiva de recolección de notas musicales.';

COMMENT ON TABLE cluequest_scenes IS 'Escenas de El Bosque Encantado: Cada escena presenta un personaje único con desafíos específicos que van desde acertijos hasta mini-juegos interactivos, culminando en la formación de la palabra MUSICA.';

COMMENT ON TABLE cluequest_qr_codes IS 'QR Codes de El Bosque Encantado: Códigos seguros con validación de ubicación y límites de escaneo para cada escena de la aventura.';

-- =============================================================================
-- SUCCESS MESSAGE
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE '🎭 El Bosque Encantado Adventure Created Successfully!';
    RAISE NOTICE '📊 Adventure ID: 550e8400-e29b-41d4-a716-446655440001';
    RAISE NOTICE '🎪 7 Interactive Scenes with AR Characters';
    RAISE NOTICE '🎵 Musical Theme: Celtic Fantasy';
    RAISE NOTICE '🎮 Features: QR, AR, Voice Recognition, Mini-games, Camera';
    RAISE NOTICE '🏆 Collectible Items: M-U-S-I-C-A to form MUSICA';
    RAISE NOTICE '⏱️ Estimated Duration: 45 minutes';
    RAISE NOTICE '👥 Max Participants: 20 (Teams of 4)';
    RAISE NOTICE '🌟 Status: Published and Ready to Play!';
END $$;
