-- Whispers in the Library - Complete Adventure Implementation
-- This SQL script creates the complete adventure data for the library mystery

-- Insert the main adventure
INSERT INTO public.cluequest_adventures (
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
    is_public,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM public.cluequest_organizations LIMIT 1), -- Use first organization
    (SELECT id FROM auth.users LIMIT 1), -- Use first user as creator
    'Whispers in the Library',
    'En las sombras de la Biblioteca Monteverde —una institución centenaria con una colección de grimorios, incunables y cartas prohibidas— ha ocurrido un crimen. Un investigador ha sido hallado sin vida entre las estanterías y un único testigo ha desaparecido. Los viejos libros susurran secretos que solo las mentes curiosas podrán descifrar.',
    'mystery',
    'intermediate',
    90, -- 90 minutes estimated duration
    'library_mystery',
    '{
        "primary_color": "#2C1810",
        "secondary_color": "#8B4513",
        "accent_color": "#DAA520",
        "background_color": "#F5F5DC",
        "text_color": "#2C1810",
        "font_family": "serif",
        "atmosphere": "mysterious",
        "ambient_sounds": ["library_ambience", "page_turning", "footsteps"],
        "lighting": "dim_warm"
    }',
    '/images/adventures/whispers-library-cover.jpg',
    '/audio/adventures/whispers-library-ambient.mp3',
    '{
        "puzzle_types": ["cryptography", "logic", "observation", "anagram", "morse_code", "pattern_recognition"],
        "special_mechanics": ["uv_light", "audio_clues", "physical_objects", "cooperative_solving"],
        "materials_required": ["uv_flashlight", "magnifying_glass", "cipher_wheel", "library_cards", "ancient_manuscripts"],
        "tech_integrations": ["qr_codes", "audio_playback", "light_simulation"],
        "difficulty_progression": "gradual",
        "hint_system": "progressive",
        "time_pressure": false,
        "cooperation_required": true
    }',
    '{
        "requires_geolocation": false,
        "qr_code_validation": true,
        "session_timeout": 7200,
        "max_attempts_per_puzzle": 5
    }',
    true,
    4,
    20,
    2,
    true,
    true,
    false,
    true,
    false,
    false,
    true,
    false,
    true,
    '["audio_descriptions", "high_contrast", "large_text"]',
    ARRAY['en', 'es'],
    'published',
    ARRAY['mystery', 'library', 'cryptography', 'detective', 'escape_room', 'cooperative'],
    false,
    true,
    now(),
    now()
);

-- Get the adventure ID for scene creation
-- We'll use a variable approach for the scenes

-- Scene 1: Registro y el archivo de tarjetas
INSERT INTO public.cluequest_scenes (
    adventure_id,
    title,
    description,
    order_index,
    interaction_type,
    completion_criteria,
    points_reward,
    narrative_data,
    scene_config,
    is_active,
    created_at
) VALUES (
    (SELECT id FROM public.cluequest_adventures WHERE title = 'Whispers in the Library'),
    'Registro y el archivo de tarjetas',
    'Al entrar, encuentras el fichero de tarjetas revuelto. Una nota del bibliotecario Sloane dice: "Cada libro tiene un lugar y cada lugar guarda un secreto. Empieza por ordenar las mentes y hallarás la verdad."',
    1,
    'puzzle_interaction',
    'Complete the library card sorting puzzle and decode the hidden message',
    150,
    '{
        "narrative": "El vestíbulo de la Biblioteca Monteverde está en silencio, solo roto por el crujir de las maderas centenarias. Las tarjetas de catálogo están esparcidas por el suelo, como si alguien hubiera buscado algo desesperadamente. Una nota manuscrita del Sr. Sloane, el bibliotecario jefe, yace sobre el mostrador de recepción.",
        "atmosphere": "mysterious_quiet",
        "ambient_sounds": ["library_ambience", "paper_rustling"],
        "visual_elements": ["scattered_cards", "dusty_light", "old_wooden_furniture"]
    }',
    '{
        "puzzle_type": "library_card_sorting",
        "materials": ["library_cards", "magnifying_glass", "notebook"],
        "hints_available": 3,
        "time_limit": null,
        "cooperation_required": true,
        "unlock_condition": "none"
    }',
    true,
    now()
);

-- Scene 2: El manuscrito cifrado
INSERT INTO public.cluequest_scenes (
    adventure_id,
    title,
    description,
    order_index,
    interaction_type,
    completion_criteria,
    points_reward,
    narrative_data,
    scene_config,
    is_active,
    created_at
) VALUES (
    (SELECT id FROM public.cluequest_adventures WHERE title = 'Whispers in the Library'),
    'El manuscrito cifrado',
    'Llegan a una mesa donde se encuentra un manuscrito antiguo guardado en un cofre con combinación. Una nota del Dr. Black dice: "Las voces del pasado se oyen cuando las ordenamos. Usa la rueda con prudencia".',
    2,
    'cipher_puzzle',
    'Decrypt the Vigenère cipher using the key from previous scene and open the chest',
    200,
    '{
        "narrative": "La Sala de Manuscritos Raros está iluminada por la tenue luz de las lámparas de aceite. En el centro de una mesa de roble se encuentra un cofre de metal con una cerradura de combinación alfabética. El manuscrito que contiene parece ser un tratado de criptografía medieval.",
        "atmosphere": "scholarly_mysterious",
        "ambient_sounds": ["candle_flickering", "parchment_rustling"],
        "visual_elements": ["ancient_chest", "cipher_wheel", "old_manuscripts", "candlelight"]
    }',
    '{
        "puzzle_type": "vigenere_cipher",
        "materials": ["cipher_wheel", "encrypted_message", "key_hint"],
        "hints_available": 2,
        "time_limit": null,
        "cooperation_required": true,
        "unlock_condition": "scene_1_completed"
    }',
    true,
    now()
);

-- Scene 3: El poema y el reloj
INSERT INTO public.cluequest_scenes (
    adventure_id,
    title,
    description,
    order_index,
    interaction_type,
    completion_criteria,
    points_reward,
    narrative_data,
    scene_config,
    is_active,
    created_at
) VALUES (
    (SELECT id FROM public.cluequest_adventures WHERE title = 'Whispers in the Library'),
    'El poema y el reloj',
    'La habitación está iluminada tenuemente. En la mesa hay un reloj de bolsillo (del cofre anterior) y un cuaderno con un poema sin título. El reloj emite un tictac suave que, si se escucha atentamente, marca un código Morse.',
    3,
    'morse_poem_puzzle',
    'Decode the Morse code from the pocket watch and solve the poem puzzle',
    175,
    '{
        "narrative": "La Sala de Lectura Privada está envuelta en una atmósfera de misterio. El reloj de bolsillo encontrado en el cofre anterior late con un ritmo hipnótico, mientras que el poema en el cuaderno parece contener pistas ocultas en sus versos.",
        "atmosphere": "contemplative_mysterious",
        "ambient_sounds": ["pocket_watch_ticking", "morse_code_audio", "page_turning"],
        "visual_elements": ["pocket_watch", "poem_notebook", "letter_grid", "dim_lighting"]
    }',
    '{
        "puzzle_type": "morse_poem_combination",
        "materials": ["pocket_watch", "poem_text", "letter_grid", "morse_code_chart"],
        "hints_available": 3,
        "time_limit": null,
        "cooperation_required": true,
        "unlock_condition": "scene_2_completed"
    }',
    true,
    now()
);

-- Scene 4: El mapa y la sección prohibida
INSERT INTO public.cluequest_scenes (
    adventure_id,
    title,
    description,
    order_index,
    interaction_type,
    completion_criteria,
    points_reward,
    narrative_data,
    scene_config,
    is_active,
    created_at
) VALUES (
    (SELECT id FROM public.cluequest_adventures WHERE title = 'Whispers in the Library'),
    'El mapa y la sección prohibida',
    'El mapa encontrado en la escena anterior muestra un recorrido entre los pasillos. Sin embargo, le falta una pieza en la esquina. También encuentran una vitrina cerrada que contiene el fragmento faltante.',
    4,
    'riddle_puzzle',
    'Solve the riddle about the eight silent sentinels and open the display case',
    200,
    '{
        "narrative": "El pasillo hacia la sección prohibida está flanqueado por estanterías que contienen los tomos más antiguos de la biblioteca. Una vitrina de cristal protege el fragmento faltante del mapa, pero está cerrada con un candado de cuatro letras.",
        "atmosphere": "forbidden_knowledge",
        "ambient_sounds": ["echoing_footsteps", "distant_whispers"],
        "visual_elements": ["ancient_tomes", "glass_display_case", "incomplete_map", "mysterious_lighting"]
    }',
    '{
        "puzzle_type": "riddle_solving",
        "materials": ["incomplete_map", "display_case", "eight_tomes", "riddle_text"],
        "hints_available": 2,
        "time_limit": null,
        "cooperation_required": true,
        "unlock_condition": "scene_3_completed"
    }',
    true,
    now()
);

-- Scene 5: Luz negra y susurros
INSERT INTO public.cluequest_scenes (
    adventure_id,
    title,
    description,
    order_index,
    interaction_type,
    completion_criteria,
    points_reward,
    narrative_data,
    scene_config,
    is_active,
    created_at
) VALUES (
    (SELECT id FROM public.cluequest_adventures WHERE title = 'Whispers in the Library'),
    'Luz negra y susurros',
    'Los jugadores entran en un pasillo oscuro. En los estantes hay libros polvorientos numerados del 1 al 12. Se oyen susurros grabados que repiten un poema en un idioma arcaico.',
    5,
    'uv_anagram_puzzle',
    'Use UV light to reveal hidden letters and solve the anagram puzzle',
    225,
    '{
        "narrative": "La Sección Prohibida de la biblioteca está sumida en la oscuridad. Solo la tenue luz de las linternas UV puede revelar los secretos ocultos en los lomos de los libros. Los susurros del pasado resuenan en las sombras.",
        "atmosphere": "dark_mysterious",
        "ambient_sounds": ["whispered_poetry", "uv_light_hum", "book_rustling"],
        "visual_elements": ["uv_flashlight", "fluorescent_letters", "numbered_books", "dark_corridor"]
    }',
    '{
        "puzzle_type": "uv_anagram",
        "materials": ["uv_flashlight", "numbered_books", "audio_poem", "anagram_solver"],
        "hints_available": 2,
        "time_limit": null,
        "cooperation_required": true,
        "unlock_condition": "scene_4_completed"
    }',
    true,
    now()
);

-- Scene 6: El árbol del conocimiento
INSERT INTO public.cluequest_scenes (
    adventure_id,
    title,
    description,
    order_index,
    interaction_type,
    completion_criteria,
    points_reward,
    narrative_data,
    scene_config,
    is_active,
    created_at
) VALUES (
    (SELECT id FROM public.cluequest_adventures WHERE title = 'Whispers in the Library'),
    'El árbol del conocimiento',
    'En el tronco del árbol hay cinco tablillas de madera, cada una con afirmaciones sobre dónde estaban los sospechosos en el momento del crimen. También hay un tablero de lógica con columnas para Persona, Hora, Sección y Actividad.',
    6,
    'logic_deduction_puzzle',
    'Solve the logic puzzle to determine where each suspect was during the crime',
    250,
    '{
        "narrative": "El Salón Central de la biblioteca está dominado por una escultura de árbol cuyas raíces y ramas representan el conocimiento humano. Las tablillas de madera contienen pistas cruciales sobre los movimientos de los sospechosos.",
        "atmosphere": "contemplative_deductive",
        "ambient_sounds": ["wooden_creaking", "logical_thinking_music"],
        "visual_elements": ["knowledge_tree", "wooden_tablets", "logic_board", "central_lighting"]
    }',
    '{
        "puzzle_type": "logic_deduction",
        "materials": ["logic_board", "wooden_tablets", "suspect_information", "deduction_grid"],
        "hints_available": 2,
        "time_limit": null,
        "cooperation_required": true,
        "unlock_condition": "scene_5_completed"
    }',
    true,
    now()
);

-- Scene 7: Microfilms y el susurro del fantasma
INSERT INTO public.cluequest_scenes (
    adventure_id,
    title,
    description,
    order_index,
    interaction_type,
    completion_criteria,
    points_reward,
    narrative_data,
    scene_config,
    is_active,
    created_at
) VALUES (
    (SELECT id FROM public.cluequest_adventures WHERE title = 'Whispers in the Library'),
    'Microfilms y el susurro del fantasma',
    'Los jugadores encuentran un microfilm etiquetado como "Confesión". Al reproducirlo, escuchan una voz distorsionada recitando un verso; la imagen proyecta símbolos y números que parecen un código.',
    7,
    'acrostic_numeric_puzzle',
    'Decode the acrostic from the poem and solve the numeric pattern puzzle',
    200,
    '{
        "narrative": "La Sala de Microfilm está iluminada por la luz azulada del proyector. La voz distorsionada que emerge del microfilm parece venir de más allá de la tumba, recitando versos que contienen pistas ocultas.",
        "atmosphere": "haunting_technological",
        "ambient_sounds": ["microfilm_projector", "distorted_voice", "film_whirring"],
        "visual_elements": ["microfilm_projector", "projected_numbers", "confession_label", "blue_lighting"]
    }',
    '{
        "puzzle_type": "acrostic_numeric",
        "materials": ["microfilm", "projector", "number_grid", "poem_text", "metal_pen"],
        "hints_available": 2,
        "time_limit": null,
        "cooperation_required": true,
        "unlock_condition": "scene_6_completed"
    }',
    true,
    now()
);

-- Scene 8: Confrontación final y desenlace
INSERT INTO public.cluequest_scenes (
    adventure_id,
    title,
    description,
    order_index,
    interaction_type,
    completion_criteria,
    points_reward,
    narrative_data,
    scene_config,
    is_active,
    created_at
) VALUES (
    (SELECT id FROM public.cluequest_adventures WHERE title = 'Whispers in the Library'),
    'Confrontación final y desenlace',
    'Con las letras obtenidas en cada escena, los jugadores llegan a una trampilla con ocho ranuras. Deben insertar las letras en el orden correcto para formar la palabra clave que abre la puerta.',
    8,
    'final_word_puzzle',
    'Arrange all collected letters to form the final keyword and confront the killer',
    300,
    '{
        "narrative": "El Archivo Secreto bajo la biblioteca está envuelto en sombras. La trampilla con ocho ranuras espera la palabra clave final. El destino de la biblioteca y la justicia dependen de esta última decisión.",
        "atmosphere": "climactic_tension",
        "ambient_sounds": ["dramatic_music", "mechanical_clicks", "distant_voices"],
        "visual_elements": ["secret_trapdoor", "letter_slots", "dramatic_lighting", "final_confrontation"]
    }',
    '{
        "puzzle_type": "final_word_assembly",
        "materials": ["collected_letters", "trapdoor", "final_revelation"],
        "hints_available": 1,
        "time_limit": null,
        "cooperation_required": true,
        "unlock_condition": "scene_7_completed"
    }',
    true,
    now()
);

-- Create adventure roles for the library mystery
INSERT INTO public.cluequest_adventure_roles (
    adventure_id,
    name,
    description,
    perks,
    point_multiplier,
    max_players,
    is_available,
    created_at
) VALUES 
(
    (SELECT id FROM public.cluequest_adventures WHERE title = 'Whispers in the Library'),
    'Detective Principal',
    'Líder del equipo de investigación con habilidades especiales en deducción lógica',
    '["extra_hint_per_scene", "logic_puzzle_bonus", "leadership_points"]',
    1.2,
    1,
    true,
    now()
),
(
    (SELECT id FROM public.cluequest_adventures WHERE title = 'Whispers in the Library'),
    'Criptógrafo',
    'Especialista en códigos y cifrados con acceso a herramientas de decodificación',
    '["cipher_tools", "decoding_bonus", "pattern_recognition"]',
    1.15,
    2,
    true,
    now()
),
(
    (SELECT id FROM public.cluequest_adventures WHERE title = 'Whispers in the Library'),
    'Investigador de Archivos',
    'Experto en organización y búsqueda de información con habilidades de observación',
    '["search_bonus", "observation_skills", "organization_tools"]',
    1.1,
    2,
    true,
    now()
),
(
    (SELECT id FROM public.cluequest_adventures WHERE title = 'Whispers in the Library'),
    'Analista de Evidencias',
    'Especialista en análisis de pistas físicas y conexiones entre elementos',
    '["evidence_analysis", "connection_bonus", "detail_observation"]',
    1.1,
    1,
    true,
    now()
);

-- Create QR codes for each scene (for location-based gameplay)
INSERT INTO public.cluequest_qr_codes (
    scene_id,
    qr_data,
    location,
    is_active,
    scan_count,
    created_at
) VALUES 
(
    (SELECT id FROM public.cluequest_scenes WHERE title = 'Registro y el archivo de tarjetas'),
    'WHISPERS_LIBRARY_SCENE_1_CARDS',
    '{"type": "Point", "coordinates": [0, 0]}',
    true,
    0,
    now()
),
(
    (SELECT id FROM public.cluequest_scenes WHERE title = 'El manuscrito cifrado'),
    'WHISPERS_LIBRARY_SCENE_2_MANUSCRIPT',
    '{"type": "Point", "coordinates": [0, 0]}',
    true,
    0,
    now()
),
(
    (SELECT id FROM public.cluequest_scenes WHERE title = 'El poema y el reloj'),
    'WHISPERS_LIBRARY_SCENE_3_POEM',
    '{"type": "Point", "coordinates": [0, 0]}',
    true,
    0,
    now()
),
(
    (SELECT id FROM public.cluequest_scenes WHERE title = 'El mapa y la sección prohibida'),
    'WHISPERS_LIBRARY_SCENE_4_MAP',
    '{"type": "Point", "coordinates": [0, 0]}',
    true,
    0,
    now()
),
(
    (SELECT id FROM public.cluequest_scenes WHERE title = 'Luz negra y susurros'),
    'WHISPERS_LIBRARY_SCENE_5_UV',
    '{"type": "Point", "coordinates": [0, 0]}',
    true,
    0,
    now()
),
(
    (SELECT id FROM public.cluequest_scenes WHERE title = 'El árbol del conocimiento'),
    'WHISPERS_LIBRARY_SCENE_6_TREE',
    '{"type": "Point", "coordinates": [0, 0]}',
    true,
    0,
    now()
),
(
    (SELECT id FROM public.cluequest_scenes WHERE title = 'Microfilms y el susurro del fantasma'),
    'WHISPERS_LIBRARY_SCENE_7_MICROFILM',
    '{"type": "Point", "coordinates": [0, 0]}',
    true,
    0,
    now()
),
(
    (SELECT id FROM public.cluequest_scenes WHERE title = 'Confrontación final y desenlace'),
    'WHISPERS_LIBRARY_SCENE_8_FINAL',
    '{"type": "Point", "coordinates": [0, 0]}',
    true,
    0,
    now()
);

-- Create AR assets for enhanced experience
INSERT INTO public.cluequest_ar_assets (
    scene_id,
    asset_type,
    asset_url,
    position,
    rotation,
    scale,
    is_active,
    created_at
) VALUES 
(
    (SELECT id FROM public.cluequest_scenes WHERE title = 'Registro y el archivo de tarjetas'),
    '3d_model',
    '/ar-assets/library-cards-3d.glb',
    '{"x": 0, "y": 0, "z": 0}',
    '{"x": 0, "y": 0, "z": 0}',
    '{"x": 1, "y": 1, "z": 1}',
    true,
    now()
),
(
    (SELECT id FROM public.cluequest_scenes WHERE title = 'El manuscrito cifrado'),
    '3d_model',
    '/ar-assets/ancient-chest-3d.glb',
    '{"x": 0, "y": 0, "z": 0}',
    '{"x": 0, "y": 0, "z": 0}',
    '{"x": 1, "y": 1, "z": 1}',
    true,
    now()
),
(
    (SELECT id FROM public.cluequest_scenes WHERE title = 'El árbol del conocimiento'),
    '3d_model',
    '/ar-assets/knowledge-tree-3d.glb',
    '{"x": 0, "y": 0, "z": 0}',
    '{"x": 0, "y": 0, "z": 0}',
    '{"x": 1.5, "y": 1.5, "z": 1.5}',
    true,
    now()
);

COMMIT;
