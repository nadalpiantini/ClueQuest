-- The Cryptic Café Mystery Adventure - SQL Insert Script
-- Based on comprehensive escape room design and best practices

-- Insert the main adventure
INSERT INTO public.cluequest_enhanced_adventures (
    story_id,
    title,
    description,
    full_description,
    category,
    difficulty,
    estimated_duration,
    scene_count,
    progression_type,
    min_players,
    max_players,
    recommended_players,
    min_age,
    max_age,
    setup_time,
    location_type,
    space_requirements,
    required_materials,
    tech_requirements,
    optional_materials,
    learning_objectives,
    skills_developed,
    knowledge_areas,
    puzzle_types,
    tech_integrations,
    special_mechanics,
    narrative_hook,
    story_acts,
    character_roles,
    story_themes,
    difficulty_curve,
    hint_system,
    adaptive_difficulty,
    qr_codes_enabled,
    ar_features,
    ai_characters,
    voice_interactions,
    gesture_controls,
    accessibility_features,
    organization_id,
    creator_id,
    status
) VALUES (
    'cryptic_cafe_mystery',
    'The Cryptic Café',
    'A local coffee shop has become the center of a conspiracy. Decode the secret messages and uncover the truth before the café''s reputation is ruined.',
    'La cafetería "Bean & Code" ha ganado fama por sus deliciosas bebidas artesanales… y por los mensajes misteriosos que algunos clientes encuentran en sus pedidos. Los rumores apuntan a que un grupo de baristas activistas está aprovechando los pedidos para intercambiar información secreta y planear un boicot contra una corporación cafetera. Los jugadores tienen 40 minutos para seguir la pista de estos mensajes y desvelar quién está detrás de la conspiración.',
    'mystery',
    'beginner',
    40,
    7,
    'linear',
    2,
    6,
    4,
    8,
    99,
    15,
    'indoor',
    'small_room',
    '["Pizarrón de madera con nombres de bebidas", "Seis sacos de mini grano", "Tarjeta con el alfabeto A1Z26", "Tarro con sobres de azúcar", "Pergamino con poema", "Seis fotos de arte latte", "Tarjeta de correspondencia patrón-letra", "Sobres de azúcar de distintos colores y pesos", "Báscula", "Candado numérico", "Panel de colores", "Cinco frascos con aromas", "Fichas numeradas", "Caja fuerte con cerradura de 5 dígitos", "Tres tarjetas de fidelidad perforadas", "Linterna", "Mesa de luz"]',
    '["Smartphones", "QR codes", "Audio system"]',
    '["Café real para ambientación", "Sonidos de cafetería", "Iluminación cálida", "Decoración de café"]',
    '["Deductive reasoning", "Pattern recognition", "Code breaking", "Sensory awareness", "Team collaboration"]',
    '["Critical thinking", "Observation", "Logical reasoning", "Sensory perception", "Communication"]',
    '["Cryptography basics", "Coffee culture", "Pattern recognition", "Sensory analysis"]',
    '["logical", "cryptographic", "linguistic", "spatial", "sensory", "mathematical"]',
    '["qr_code", "ar_overlay"]',
    '{"coffee_theme_integration": "All puzzles are themed around coffee and café culture", "sensory_elements": "Includes smell-based puzzles with real coffee aromas", "progressive_difficulty": "Puzzles increase in complexity while maintaining accessibility", "moral_choice_ending": "Players choose between cooperation and justice at the end"}',
    'Un pequeño café local se convierte en el epicentro de una conspiración cuando los clientes comienzan a recibir mensajes codificados en sus bebidas.',
    '[{"act": 1, "scenes": ["Tabla de Especiales", "Sacos de granos", "Tarro de azúcar"], "description": "Descubrimiento inicial de mensajes codificados y primeras pistas", "difficulty_escalation": 1}, {"act": 2, "scenes": ["Arte latte", "Cuarto de almacenamiento", "Sala de tostado"], "description": "Profundización en la conspiración y descubrimiento de patrones", "difficulty_escalation": 2}, {"act": 3, "scenes": ["Tarjetas perforadas"], "description": "Revelación final y decisión moral sobre el destino del café", "difficulty_escalation": 3}]',
    '[{"role_id": "barista_jefe", "name": "Ana (Barista Jefe)", "description": "Responsable de las bebidas y cómplice de la conspiración. Mantiene la compostura pero deja pistas sutiles.", "backstory": "Ana ha trabajado en el café durante años y se ha vuelto desilusionada con las prácticas corporativas de las grandes cadenas de café.", "objectives": ["Mantener la conspiración en secreto", "Ayudar a los activistas", "Proteger la reputación del café"]}, {"role_id": "ayudante_barista", "name": "Luis (Ayudante de Barista)", "description": "Habla mucho y se distrae fácilmente. Sin saberlo, revela datos sobre la conspiración.", "backstory": "Luis es nuevo en el trabajo y no está al tanto de las actividades secretas de Ana.", "objectives": ["Ayudar a los clientes", "Aprender sobre el café", "Mantener el trabajo"]}, {"role_id": "cliente_misterioso", "name": "Señor X (Cliente Misterioso)", "description": "Llega con un pedido habitual pero recibe un mensaje que lo alerta. Ayuda a los jugadores al inicio.", "backstory": "Un cliente regular que ha notado patrones extraños en sus pedidos.", "objectives": ["Descubrir la verdad", "Ayudar a los investigadores", "Proteger la comunidad"]}, {"role_id": "proveedor_granos", "name": "Marcos (Proveedor de Granos)", "description": "Trae sacos de café y conoce los tipos de granos y sus aromas. Aparece en una escena para guiar a los jugadores.", "backstory": "Marcos ha estado suministrando granos al café durante años y conoce todos los secretos del negocio.", "objectives": ["Mantener la calidad del café", "Ayudar a los investigadores", "Proteger sus contactos"]}]',
    '["Conspiracy", "Coffee culture", "Social justice", "Community values", "Moral choices"]',
    '{"scene_1": 1, "scene_2": 1.2, "scene_3": 1.4, "scene_4": 1.6, "scene_5": 1.8, "scene_6": 2.0, "scene_7": 2.2}',
    '{"progressive_hints": true, "hint_costs": [10, 20, 30], "max_hints_per_scene": 3, "team_hint_sharing": true}',
    false,
    true,
    '{"latte_art_overlay": "AR overlay for latte art pattern recognition", "coffee_bean_visualization": "3D visualization of coffee bean counting"}',
    '[{"character_id": "ana_ai", "name": "Ana (AI Assistant)", "personality": "Professional but mysterious", "role": "Provides subtle hints about the conspiracy"}]',
    false,
    false,
    '["screen_reader_support", "high_contrast_mode", "text_to_speech", "keyboard_navigation", "colorblind_friendly"]',
    (SELECT id FROM public.cluequest_organizations WHERE name = 'ClueQuest' LIMIT 1),
    (SELECT id FROM public.cluequest_organizations WHERE name = 'ClueQuest' LIMIT 1),
    'published'
);

-- Get the adventure ID for scene insertions
DO $$
DECLARE
    adventure_uuid UUID;
BEGIN
    -- Get the adventure ID
    SELECT id INTO adventure_uuid 
    FROM public.cluequest_enhanced_adventures 
    WHERE story_id = 'cryptic_cafe_mystery';
    
    -- Insert Scene 1: Tabla de Especiales
    INSERT INTO public.cluequest_enhanced_scenes (
        adventure_id, scene_number, scene_id, title, description, act_number, is_optional,
        unlock_conditions, narrative_content, objectives, completion_criteria, puzzles,
        interactions, qr_codes, ar_elements, tech_interactions, estimated_duration,
        time_limit, can_skip, hints, help_system, points_reward, unlocks_next,
        story_revelations, is_active, order_index
    ) VALUES (
        adventure_uuid, 1, 'scene-1-specials-board', 'Tabla de Especiales - El mensaje oculto',
        'Los jugadores entran en el café y ven un pizarrón que anuncia las "Especialidades del Día". Un cliente comenta que recibió un mensaje secreto en su pedido.',
        1, false, '{}',
        'Bienvenidos a "Bean & Code", el café local que se ha vuelto famoso por sus deliciosas bebidas artesanales... y por los mensajes misteriosos que algunos clientes encuentran en sus pedidos. Los rumores apuntan a que un grupo de baristas activistas está aprovechando los pedidos para intercambiar información secreta. Tienen 40 minutos para seguir la pista de estos mensajes y desvelar quién está detrás de la conspiración.',
        '["Descubrir el mensaje oculto en la tabla de especialidades", "Identificar el acróstico SECRET"]',
        '{"type": "puzzle_solve", "puzzle_id": "acrostic-specials", "required_solution": "SECRET"}',
        '[{"puzzle_id": "acrostic-specials", "title": "Acróstico de Especialidades", "description": "Observa la primera letra de cada bebida en la tabla de especialidades. ¿Forman alguna palabra?", "type": "linguistic", "difficulty": "beginner", "puzzle_data": {"beverages": ["Strawberry Smoothie", "Espresso", "Cappuccino", "Red Eye", "Earl Grey Tea", "Turkish Coffee"], "instruction": "Observa la primera letra de cada bebida. ¿Forman alguna palabra? Usa esa palabra para descubrir una compartimento secreto."}, "solution_data": {"answer": "SECRET", "explanation": "Las iniciales de Strawberry Smoothie, Espresso, Cappuccino, Red Eye, Earl Grey Tea, Turkish Coffee forman la palabra SECRET"}, "input_methods": ["text_input"], "validation_rules": {"case_sensitive": false, "exact_match": true}, "hint_levels": [{"level": 1, "hint": "Mira la primera letra de cada bebida en orden", "cost": 10}, {"level": 2, "hint": "S-Strawberry, E-Espresso, C-Cappuccino...", "cost": 20}, {"level": 3, "hint": "Las iniciales forman la palabra SECRET", "cost": 30}], "points_reward": 100, "time_limit": 300, "attempt_limit": 3}]',
        '[{"interaction_id": "examine_specials_board", "type": "examine", "description": "Examinar la tabla de especialidades del día", "required": true}]',
        '[]', '[]', '[]', 5, 300, false,
        '[{"hint_id": "hint-1-1", "level": 1, "text": "Mira la primera letra de cada bebida en orden", "cost": 10}]',
        '{"tutorial_mode": true, "progressive_hints": true}', 100,
        '["scene-2-coffee-sacks"]', '["El café tiene mensajes ocultos en sus especialidades"]', true, 1
    );
    
    -- Insert Scene 2: Sacos de granos
    INSERT INTO public.cluequest_enhanced_scenes (
        adventure_id, scene_number, scene_id, title, description, act_number, is_optional,
        unlock_conditions, narrative_content, objectives, completion_criteria, puzzles,
        interactions, qr_codes, ar_elements, tech_interactions, estimated_duration,
        time_limit, can_skip, hints, help_system, points_reward, unlocks_next,
        story_revelations, is_active, order_index
    ) VALUES (
        adventure_uuid, 2, 'scene-2-coffee-sacks', 'Sacos de granos - Código numérico',
        'Los jugadores descubren seis pequeños sacos etiquetados con orígenes de café. Dentro de cada saco hay un número diferente de granos.',
        1, false, '{"required_scenes": ["scene-1-specials-board"]}',
        'Detrás del pizarrón hay un pequeño compartimento. Al abrirlo, los jugadores encuentran una nota que dice: "Cuenta los granos y hallarás la clave". Ahora deben examinar los sacos de café para continuar.',
        '["Contar los granos en cada saco", "Convertir números a letras usando A=1, B=2", "Formar la palabra COFFEE"]',
        '{"type": "puzzle_solve", "puzzle_id": "grain-count-cipher", "required_solution": "COFFEE"}',
        '[{"puzzle_id": "grain-count-cipher", "title": "Conteo de granos y conversión a letras", "description": "Cuenta los granos de cada saco y usa el código A=1, B=2, etc., para convertirlos en letras.", "type": "mathematical", "difficulty": "beginner", "puzzle_data": {"sacks": [{"origin": "Brasil", "grain_count": 3}, {"origin": "Etiopía", "grain_count": 15}, {"origin": "Colombia", "grain_count": 6}, {"origin": "Kenia", "grain_count": 6}, {"origin": "Sumatra", "grain_count": 5}, {"origin": "Guatemala", "grain_count": 5}], "instruction": "Cuenta los granos de cada saco y usa el código A=1 para convertirlos en letras. Lee la palabra resultante."}, "solution_data": {"answer": "COFFEE", "explanation": "Los números 3-15-6-6-5-5 se convierten en las letras C-O-F-F-E-E, formando la palabra COFFEE"}, "input_methods": ["text_input"], "validation_rules": {"case_sensitive": false, "exact_match": true}, "hint_levels": [{"level": 1, "hint": "Cuenta cuidadosamente los granos en cada saco", "cost": 15}, {"level": 2, "hint": "Brasil=3, Etiopía=15, Colombia=6, Kenia=6, Sumatra=5, Guatemala=5", "cost": 25}, {"level": 3, "hint": "Convierte a letras: 3=C, 15=O, 6=F, 6=F, 5=E, 5=E = COFFEE", "cost": 35}], "points_reward": 120, "time_limit": 400, "attempt_limit": 3}]',
        '[{"interaction_id": "examine_coffee_sacks", "type": "examine", "description": "Examinar los sacos de granos de café", "required": true}, {"interaction_id": "count_grains", "type": "count", "description": "Contar los granos en cada saco", "required": true}]',
        '[]', '[]', '[]', 6, 400, false,
        '[{"hint_id": "hint-2-1", "level": 1, "text": "Cuenta cuidadosamente los granos en cada saco", "cost": 15}]',
        '{"tutorial_mode": true, "progressive_hints": true}', 120,
        '["scene-3-sugar-jar"]', '["Los granos contienen un código numérico"]', true, 2
    );
    
    -- Continue with remaining scenes...
    -- (Additional scenes would be inserted here following the same pattern)
    
END $$;

-- Insert puzzles for each scene
DO $$
DECLARE
    scene_1_uuid UUID;
    scene_2_uuid UUID;
BEGIN
    -- Get scene IDs
    SELECT id INTO scene_1_uuid FROM public.cluequest_enhanced_scenes WHERE scene_id = 'scene-1-specials-board';
    SELECT id INTO scene_2_uuid FROM public.cluequest_enhanced_scenes WHERE scene_id = 'scene-2-coffee-sacks';
    
    -- Insert puzzle for Scene 1
    INSERT INTO public.cluequest_enhanced_puzzles (
        scene_id, puzzle_id, title, description, puzzle_type, difficulty, category,
        puzzle_data, solution_data, alternative_solutions, input_methods, validation_rules,
        feedback_system, tech_requirements, ar_components, qr_integration, hint_levels,
        help_resources, tutorial_mode, time_limit, attempt_limit, can_skip, points_reward,
        unlocks_content, failure_consequences, success_rate, average_solve_time, hint_usage_rate,
        is_active, order_index
    ) VALUES (
        scene_1_uuid, 'acrostic-specials', 'Acróstico de Especialidades',
        'Observa la primera letra de cada bebida en la tabla de especialidades. ¿Forman alguna palabra?',
        'linguistic', 'beginner', 'linguistic',
        '{"beverages": ["Strawberry Smoothie", "Espresso", "Cappuccino", "Red Eye", "Earl Grey Tea", "Turkish Coffee"], "instruction": "Observa la primera letra de cada bebida. ¿Forman alguna palabra? Usa esa palabra para descubrir una compartimento secreto."}',
        '{"answer": "SECRET", "explanation": "Las iniciales de Strawberry Smoothie, Espresso, Cappuccino, Red Eye, Earl Grey Tea, Turkish Coffee forman la palabra SECRET"}',
        '[]', '["text_input"]', '{"case_sensitive": false, "exact_match": true}',
        '{}', '[]', '[]', '{}',
        '[{"level": 1, "hint": "Mira la primera letra de cada bebida en orden", "cost": 10}, {"level": 2, "hint": "S-Strawberry, E-Espresso, C-Cappuccino...", "cost": 20}, {"level": 3, "hint": "Las iniciales forman la palabra SECRET", "cost": 30}]',
        '[]', false, 300, 3, false, 100, '[]', '{}', 0, null, 0, true, 1
    );
    
    -- Insert puzzle for Scene 2
    INSERT INTO public.cluequest_enhanced_puzzles (
        scene_id, puzzle_id, title, description, puzzle_type, difficulty, category,
        puzzle_data, solution_data, alternative_solutions, input_methods, validation_rules,
        feedback_system, tech_requirements, ar_components, qr_integration, hint_levels,
        help_resources, tutorial_mode, time_limit, attempt_limit, can_skip, points_reward,
        unlocks_content, failure_consequences, success_rate, average_solve_time, hint_usage_rate,
        is_active, order_index
    ) VALUES (
        scene_2_uuid, 'grain-count-cipher', 'Conteo de granos y conversión a letras',
        'Cuenta los granos de cada saco y usa el código A=1, B=2, etc., para convertirlos en letras.',
        'mathematical', 'beginner', 'mathematical',
        '{"sacks": [{"origin": "Brasil", "grain_count": 3}, {"origin": "Etiopía", "grain_count": 15}, {"origin": "Colombia", "grain_count": 6}, {"origin": "Kenia", "grain_count": 6}, {"origin": "Sumatra", "grain_count": 5}, {"origin": "Guatemala", "grain_count": 5}], "instruction": "Cuenta los granos de cada saco y usa el código A=1 para convertirlos en letras. Lee la palabra resultante."}',
        '{"answer": "COFFEE", "explanation": "Los números 3-15-6-6-5-5 se convierten en las letras C-O-F-F-E-E, formando la palabra COFFEE"}',
        '[]', '["text_input"]', '{"case_sensitive": false, "exact_match": true}',
        '{}', '[]', '[]', '{}',
        '[{"level": 1, "hint": "Cuenta cuidadosamente los granos en cada saco", "cost": 15}, {"level": 2, "hint": "Brasil=3, Etiopía=15, Colombia=6, Kenia=6, Sumatra=5, Guatemala=5", "cost": 25}, {"level": 3, "hint": "Convierte a letras: 3=C, 15=O, 6=F, 6=F, 5=E, 5=E = COFFEE", "cost": 35}]',
        '[]', false, 400, 3, false, 120, '[]', '{}', 0, null, 0, true, 1
    );
    
END $$;

-- Success message
SELECT 'The Cryptic Café Mystery Adventure successfully inserted!' as message;
