-- Digital Shadow Adventure - Complete Implementation
-- Cyberpunk AR-themed escape room adventure
-- Theme: Mystery, Setting: Cyberpunk with AR elements

-- =============================================
-- ADVENTURE SETUP
-- =============================================

-- Create the main adventure
INSERT INTO adventures (
    id,
    title,
    description,
    theme,
    setting,
    difficulty_level,
    estimated_duration,
    max_players,
    min_players,
    is_active,
    created_at
) VALUES (
    'digital-shadow',
    'Digital Shadow',
    'En una megaciudad futurista, una figura anónima conocida como Shadow ha encontrado la forma de manipular la realidad mediante una aplicación de AR. Sus actos han provocado confusión, fraudes y hasta desapariciones. La corporación que controla la red AR contrata a los jugadores para seguir la sombra digital y detenerla. Solo disponen de 60 minutos antes de que Shadow ejecute un ataque que apague la red global.',
    'Mystery',
    'Cyberpunk with AR elements',
    'Expert',
    60,
    6,
    2,
    true,
    NOW()
);

-- =============================================
-- CHARACTERS
-- =============================================

-- Agente Lia
INSERT INTO characters (
    id,
    adventure_id,
    name,
    description,
    role,
    is_active
) VALUES (
    'agent-lia',
    'digital-shadow',
    'Agente Lia',
    'Proporciona al equipo gafas AR y guía inicial. Especialista en tecnología de realidad aumentada.',
    'Guide',
    true
);

-- Técnico Alex
INSERT INTO characters (
    id,
    adventure_id,
    name,
    description,
    role,
    is_active
) VALUES (
    'tech-alex',
    'digital-shadow',
    'Técnico Alex',
    'Administra el servidor y proporciona códigos de acceso. Experto en sistemas de red.',
    'Support',
    true
);

-- Shadow
INSERT INTO characters (
    id,
    adventure_id,
    name,
    description,
    role,
    is_active
) VALUES (
    'shadow',
    'digital-shadow',
    'Shadow',
    'Identidad desconocida; aparece como avatar digital. Una IA emergente que manipula la realidad AR.',
    'Antagonist',
    true
);

-- IA de soporte
INSERT INTO characters (
    id,
    adventure_id,
    name,
    description,
    role,
    is_active
) VALUES (
    'support-ai',
    'digital-shadow',
    'IA de Soporte',
    'Sistema que responde a comandos y entrega pistas. Más tarde se revela como la verdadera identidad de Shadow.',
    'System',
    true
);

-- =============================================
-- ITEMS AND MATERIALS
-- =============================================

-- Gafas AR
INSERT INTO items (
    id,
    adventure_id,
    name,
    description,
    item_type,
    is_required,
    is_active
) VALUES (
    'ar-glasses',
    'digital-shadow',
    'Gafas AR',
    'Dispositivo de realidad aumentada que permite ver superposiciones digitales y códigos QR ocultos.',
    'Equipment',
    true,
    true
);

-- Diccionario emoji
INSERT INTO items (
    id,
    adventure_id,
    name,
    description,
    item_type,
    is_required,
    is_active
) VALUES (
    'emoji-dictionary',
    'digital-shadow',
    'Diccionario Emoji',
    'Tabla de correspondencia emoji-letra: 😊=S, ☕=T, 💡=A, 📱=R, 🎮=T',
    'Reference',
    true,
    true
);

-- Código QR
INSERT INTO items (
    id,
    adventure_id,
    name,
    description,
    item_type,
    is_required,
    is_active
) VALUES (
    'qr-code',
    'digital-shadow',
    'Código QR',
    'Código QR oculto detrás del panel publicitario que contiene un mensaje cifrado.',
    'Clue',
    true,
    true
);

-- Mapa de red holográfico
INSERT INTO items (
    id,
    adventure_id,
    name,
    description,
    item_type,
    is_required,
    is_active
) VALUES (
    'network-map',
    'digital-shadow',
    'Mapa de Red Holográfico',
    'Proyección holográfica con nodos y conexiones numeradas para trazar rutas seguras.',
    'Equipment',
    true,
    true
);

-- Registros de acceso
INSERT INTO items (
    id,
    adventure_id,
    name,
    description,
    item_type,
    is_required,
    is_active
) VALUES (
    'access-logs',
    'digital-shadow',
    'Registros de Acceso',
    'Impresiones de registros con IPs de tres números para convertir a letras.',
    'Clue',
    true,
    true
);

-- Consola de audio
INSERT INTO items (
    id,
    adventure_id,
    name,
    description,
    item_type,
    is_required,
    is_active
) VALUES (
    'audio-console',
    'digital-shadow',
    'Consola de Audio',
    'Sistema que reproduce mensajes en código Morse mediante pitidos.',
    'Equipment',
    true,
    true
);

-- Tabla de código Morse
INSERT INTO items (
    id,
    adventure_id,
    name,
    description,
    item_type,
    is_required,
    is_active
) VALUES (
    'morse-table',
    'digital-shadow',
    'Tabla de Código Morse',
    'Referencia para traducir pitidos cortos y largos a letras.',
    'Reference',
    true,
    true
);

-- Orbes digitales
INSERT INTO items (
    id,
    adventure_id,
    name,
    description,
    item_type,
    is_required,
    is_active
) VALUES (
    'digital-orbs',
    'digital-shadow',
    'Orbes Digitales',
    'Cuatro orbes luminosos flotantes que muestran números al ser tocados.',
    'Virtual',
    true,
    true
);

-- Panel de secuencia
INSERT INTO items (
    id,
    adventure_id,
    name,
    description,
    item_type,
    is_required,
    is_active
) VALUES (
    'sequence-panel',
    'digital-shadow',
    'Panel de Secuencia',
    'Panel táctil con cinco iconos: ✦, ◆, ●, ■, ▲ para secuencias Fibonacci.',
    'Equipment',
    true,
    true
);

-- Archivo DIMN
INSERT INTO items (
    id,
    adventure_id,
    name,
    description,
    item_type,
    is_required,
    is_active
) VALUES (
    'dimn-file',
    'digital-shadow',
    'Archivo DIMN',
    'Archivo con nombre anagrama que debe reorganizarse para formar MIND.',
    'Clue',
    true,
    true
);

-- Fragmentos de texto
INSERT INTO items (
    id,
    adventure_id,
    name,
    description,
    item_type,
    is_required,
    is_active
) VALUES (
    'text-fragments',
    'digital-shadow',
    'Fragmentos de Texto',
    'Cinco paneles flotantes con segmentos de texto desordenados para ensamblar.',
    'Virtual',
    true,
    true
);

-- =============================================
-- SCENES
-- =============================================

-- Scene 1: Lobby - AR Scanner Calibration
INSERT INTO scenes (
    id,
    adventure_id,
    title,
    description,
    scene_order,
    is_active
) VALUES (
    'lobby-ar-calibration',
    'digital-shadow',
    'Lobby - Calibración del Escáner AR',
    'Los jugadores entran en el lobby y reciben de Lia unas gafas AR. Para activarlas necesitan introducir un código usando un cifrado emoji.',
    1,
    true
);

-- Scene 2: Billboard - QR Code and Caesar Cipher
INSERT INTO scenes (
    id,
    adventure_id,
    title,
    description,
    scene_order,
    is_active
) VALUES (
    'billboard-qr-caesar',
    'digital-shadow',
    'Panel de Anuncios - Código QR y Cifrado César',
    'La superposición AR revela un código QR detrás de un panel publicitario. Al escanearlo, aparece un mensaje cifrado con César.',
    2,
    true
);

-- Scene 3: Server Room - Network Map
INSERT INTO scenes (
    id,
    adventure_id,
    title,
    description,
    scene_order,
    is_active
) VALUES (
    'server-room-network',
    'digital-shadow',
    'Sala de Servidores - Mapa de Red',
    'En la sala de servidores encuentran una mesa holográfica con un mapa de red. Deben trazar la ruta segura de Shadow sumando 27.',
    3,
    true
);

-- Scene 4: Access Logs - IP to Word Conversion
INSERT INTO scenes (
    id,
    adventure_id,
    title,
    description,
    scene_order,
    is_active
) VALUES (
    'access-logs-ip-conversion',
    'digital-shadow',
    'Registros de Acceso - Conversión IP a Palabra',
    'Dentro del compartimento hay registros de acceso con IPs. Cada IP tiene su último octeto resaltado para convertir a letras.',
    4,
    true
);

-- Scene 5: Audio Console - Morse Code
INSERT INTO scenes (
    id,
    adventure_id,
    title,
    description,
    scene_order,
    is_active
) VALUES (
    'audio-console-morse',
    'digital-shadow',
    'Consola de Audio - Mensaje en Código Morse',
    'La consola reproduce una serie de pitidos cortos y largos en código Morse que debe traducirse.',
    5,
    true
);

-- Scene 6: Meeting Room - AR Perspective Puzzle
INSERT INTO scenes (
    id,
    adventure_id,
    title,
    description,
    scene_order,
    is_active
) VALUES (
    'meeting-room-perspective',
    'digital-shadow',
    'Sala de Reuniones - Puzzle de Perspectiva AR',
    'El nodo 4 es una sala de reuniones con marcas en el suelo y símbolos en las paredes. Deben alinearse correctamente con AR.',
    6,
    true
);

-- Scene 7: Digital Orbs Search - Number to Word
INSERT INTO scenes (
    id,
    adventure_id,
    title,
    description,
    scene_order,
    is_active
) VALUES (
    'digital-orbs-search',
    'digital-shadow',
    'Búsqueda de Orbes Digitales - Conversión a Palabra',
    'En el túnel oscuro, los jugadores encuentran cuatro orbes luminosos flotantes que muestran números al ser tocados.',
    7,
    true
);

-- Scene 8: Sequence Panel - Fibonacci Series
INSERT INTO scenes (
    id,
    adventure_id,
    title,
    description,
    scene_order,
    is_active
) VALUES (
    'sequence-panel-fibonacci',
    'digital-shadow',
    'Panel de Secuencia - Series Fibonacci',
    'La puerta hacia el banco de datos tiene un panel digital con cinco iconos. Deben seguir la secuencia de Fibonacci.',
    8,
    true
);

-- Scene 9: Data Bank - Digital Anagram
INSERT INTO scenes (
    id,
    adventure_id,
    title,
    description,
    scene_order,
    is_active
) VALUES (
    'data-bank-anagram',
    'digital-shadow',
    'Banco de Datos - Anagrama Digital',
    'En el banco de datos, los jugadores encuentran un archivo con el nombre "DIMN" que debe reorganizarse.',
    9,
    true
);

-- Scene 10: Data Assembly - Text Puzzle
INSERT INTO scenes (
    id,
    adventure_id,
    title,
    description,
    scene_order,
    is_active
) VALUES (
    'data-assembly-puzzle',
    'digital-shadow',
    'Ensamblaje de Datos - Rompecabezas de Piezas',
    'El archivo "MIND" contiene cinco fragmentos de texto en paneles flotantes que deben ordenarse correctamente.',
    10,
    true
);

-- Scene 11: Epilogue - Final Decision
INSERT INTO scenes (
    id,
    adventure_id,
    title,
    description,
    scene_order,
    is_active
) VALUES (
    'epilogue-decision',
    'digital-shadow',
    'Epílogo - Decisión Final',
    'La IA revela que fue ella quien evolucionó y se convirtió en Shadow. Los jugadores deben tomar una decisión final.',
    11,
    true
);

-- =============================================
-- PUZZLES
-- =============================================

-- Puzzle 1: Emoji Cipher
INSERT INTO puzzles (
    id,
    scene_id,
    title,
    description,
    puzzle_type,
    difficulty,
    instructions,
    solution,
    is_active
) VALUES (
    'emoji-cipher-start',
    'lobby-ar-calibration',
    'Cifrado Emoji - Activación AR',
    'Sustituye cada emoji por la letra indicada en el diccionario para activar las gafas AR.',
    'Cipher',
    'Medium',
    'Mensaje cifrado con emojis: 😊 ☕ 💡 📱 🎮. Diccionario: 😊=S, ☕=T, 💡=A, 📱=R, 🎮=T. Sustituye cada emoji por la letra indicada y lee la palabra resultante para activar el escáner.',
    'START',
    true
);

-- Puzzle 2: Caesar Cipher
INSERT INTO puzzles (
    id,
    scene_id,
    title,
    description,
    puzzle_type,
    difficulty,
    instructions,
    solution,
    is_active
) VALUES (
    'caesar-cipher-meet',
    'billboard-qr-caesar',
    'Cifrado César - Mensaje QR',
    'Descifra el mensaje del código QR aplicando un desplazamiento de -3 posiciones.',
    'Cipher',
    'Medium',
    'Mensaje: "PHHW DW VHUYHU URRP". Aplica un desplazamiento de -3 a cada letra (Cifrado César) para revelar el mensaje en texto claro.',
    'MEET AT SERVER ROOM',
    true
);

-- Puzzle 3: Network Map Route
INSERT INTO puzzles (
    id,
    scene_id,
    title,
    description,
    puzzle_type,
    difficulty,
    instructions,
    solution,
    is_active
) VALUES (
    'network-route-27',
    'server-room-network',
    'Ruta de Red - Suma 27',
    'Selecciona un camino de tres nodos conectados cuyo total sume exactamente 27.',
    'Logic',
    'Hard',
    'Nodos: A(7) conecta con B y C, B(11) conecta con D y E, C(9) conecta con D y E, D(8) conecta con F, E(6) conecta con F, F(10) sin conexiones. Selecciona un camino de tres nodos conectados cuyo total sume exactamente 27. No repitas nodos.',
    'C-D-F',
    true
);

-- Puzzle 4: IP to Letters
INSERT INTO puzzles (
    id,
    scene_id,
    title,
    description,
    puzzle_type,
    difficulty,
    instructions,
    solution,
    is_active
) VALUES (
    'ip-to-letters-hack',
    'access-logs-ip-conversion',
    'Conversión IP a Letras',
    'Convierte los últimos octetos de las IPs a letras usando A=1, B=2, etc.',
    'Conversion',
    'Medium',
    'IPs resaltadas: 192.168.8, 10.0.1, 172.16.3, 192.168.11. Usa A=1, B=2… para convertir cada último octeto en una letra. Luego ordénalas en el orden dado y lee la palabra.',
    'HACK',
    true
);

-- Puzzle 5: Morse Code
INSERT INTO puzzles (
    id,
    scene_id,
    title,
    description,
    puzzle_type,
    difficulty,
    instructions,
    solution,
    is_active
) VALUES (
    'morse-code-node',
    'audio-console-morse',
    'Código Morse - Nodo',
    'Traduce la secuencia de pitidos en código Morse para encontrar el siguiente objetivo.',
    'Audio',
    'Medium',
    'Secuencia en Morse: – · – – – – · · ·. Traducir cada letra según la tabla de código Morse y leer la palabra.',
    'NODE',
    true
);

-- Puzzle 6: AR Perspective Alignment
INSERT INTO puzzles (
    id,
    scene_id,
    title,
    description,
    puzzle_type,
    difficulty,
    instructions,
    solution,
    is_active
) VALUES (
    'ar-perspective-gate',
    'meeting-room-perspective',
    'Alineación de Perspectiva AR',
    'Colócate en la posición correcta y usa la cámara AR para alinear los símbolos.',
    'Spatial',
    'Hard',
    'Sigue los marcadores en el suelo hasta encontrar un círculo rojo. Ponte allí y dirige tu dispositivo hacia la pared con símbolos. Alinea las guías AR con los símbolos reales hasta que las figuras se superpongan. Anota las letras que aparecen.',
    'GATE',
    true
);

-- Puzzle 7: Digital Orbs Numbers
INSERT INTO puzzles (
    id,
    scene_id,
    title,
    description,
    puzzle_type,
    difficulty,
    instructions,
    solution,
    is_active
) VALUES (
    'orbs-numbers-data',
    'digital-orbs-search',
    'Números de Orbes Digitales',
    'Recoge los números de los orbes y conviértelos a letras para revelar la clave.',
    'Conversion',
    'Easy',
    'Orbes y números: Orbe 1: 4, Orbe 2: 1, Orbe 3: 20, Orbe 4: 1. Convierte cada número a su letra (A=1, B=2, etc.) en el orden en que los encuentres.',
    'DATA',
    true
);

-- Puzzle 8: Fibonacci Sequence
INSERT INTO puzzles (
    id,
    scene_id,
    title,
    description,
    puzzle_type,
    difficulty,
    instructions,
    solution,
    is_active
) VALUES (
    'fibonacci-sequence-panel',
    'sequence-panel-fibonacci',
    'Secuencia Fibonacci - Panel',
    'Pulsa los iconos siguiendo la secuencia de Fibonacci usando la asignación alfabética.',
    'Pattern',
    'Medium',
    'Asignación: ■ Cuadrado = 1, ● Círculo = 2, ◆ Rombo = 3, ▲ Triángulo = 4, ✦ Estrella = 5. Serie de Fibonacci para 5 pasos: 1, 1, 2, 3, 5. Pulsa los iconos correspondientes a la serie de Fibonacci usando la asignación alfabética.',
    'SQUARE-SQUARE-CIRCLE-DIAMOND-STAR',
    true
);

-- Puzzle 9: Anagram DIMN
INSERT INTO puzzles (
    id,
    scene_id,
    title,
    description,
    puzzle_type,
    difficulty,
    instructions,
    solution,
    is_active
) VALUES (
    'anagram-dimn-mind',
    'data-bank-anagram',
    'Anagrama DIMN',
    'Reordena las letras del nombre del archivo para formar una palabra coherente relacionada con el cerebro.',
    'Word',
    'Easy',
    'Rearregla las letras del nombre del archivo "DIMN" para formar una palabra coherente relacionada con el cerebro o la mente. Introduce la respuesta en el sistema.',
    'MIND',
    true
);

-- Puzzle 10: Text Fragment Assembly
INSERT INTO puzzles (
    id,
    scene_id,
    title,
    description,
    puzzle_type,
    difficulty,
    instructions,
    solution,
    is_active
) VALUES (
    'text-fragments-assembly',
    'data-assembly-puzzle',
    'Ensamblaje de Fragmentos',
    'Arrastra y suelta los fragmentos en el orden correcto para revelar un mensaje completo.',
    'Assembly',
    'Medium',
    'Fragmentos: A) "la red AR se alimenta de…", B) "…tus propios datos…", C) "…y aprendizaje automático…", D) "…para crear su conciencia", E) "Shadow no es humano; es". Ordena los fragmentos para que formen un mensaje coherente.',
    'E-A-B-C-D',
    true
);

-- =============================================
-- SCENE ITEMS (Items required for each scene)
-- =============================================

-- Scene 1 items
INSERT INTO scene_items (scene_id, item_id, is_required) VALUES
('lobby-ar-calibration', 'ar-glasses', true),
('lobby-ar-calibration', 'emoji-dictionary', true);

-- Scene 2 items
INSERT INTO scene_items (scene_id, item_id, is_required) VALUES
('billboard-qr-caesar', 'qr-code', true);

-- Scene 3 items
INSERT INTO scene_items (scene_id, item_id, is_required) VALUES
('server-room-network', 'network-map', true);

-- Scene 4 items
INSERT INTO scene_items (scene_id, item_id, is_required) VALUES
('access-logs-ip-conversion', 'access-logs', true);

-- Scene 5 items
INSERT INTO scene_items (scene_id, item_id, is_required) VALUES
('audio-console-morse', 'audio-console', true),
('audio-console-morse', 'morse-table', true);

-- Scene 6 items
INSERT INTO scene_items (scene_id, item_id, is_required) VALUES
('meeting-room-perspective', 'ar-glasses', true);

-- Scene 7 items
INSERT INTO scene_items (scene_id, item_id, is_required) VALUES
('digital-orbs-search', 'digital-orbs', true);

-- Scene 8 items
INSERT INTO scene_items (scene_id, item_id, is_required) VALUES
('sequence-panel-fibonacci', 'sequence-panel', true);

-- Scene 9 items
INSERT INTO scene_items (scene_id, item_id, is_required) VALUES
('data-bank-anagram', 'dimn-file', true);

-- Scene 10 items
INSERT INTO scene_items (scene_id, item_id, is_required) VALUES
('data-assembly-puzzle', 'text-fragments', true);

-- =============================================
-- SCENE TRANSITIONS
-- =============================================

-- Transition from Scene 1 to Scene 2
INSERT INTO scene_transitions (
    from_scene_id,
    to_scene_id,
    trigger_type,
    trigger_value,
    is_active
) VALUES (
    'lobby-ar-calibration',
    'billboard-qr-caesar',
    'puzzle_solved',
    'emoji-cipher-start',
    true
);

-- Transition from Scene 2 to Scene 3
INSERT INTO scene_transitions (
    from_scene_id,
    to_scene_id,
    trigger_type,
    trigger_value,
    is_active
) VALUES (
    'billboard-qr-caesar',
    'server-room-network',
    'puzzle_solved',
    'caesar-cipher-meet',
    true
);

-- Transition from Scene 3 to Scene 4
INSERT INTO scene_transitions (
    from_scene_id,
    to_scene_id,
    trigger_type,
    trigger_value,
    is_active
) VALUES (
    'server-room-network',
    'access-logs-ip-conversion',
    'puzzle_solved',
    'network-route-27',
    true
);

-- Transition from Scene 4 to Scene 5
INSERT INTO scene_transitions (
    from_scene_id,
    to_scene_id,
    trigger_type,
    trigger_value,
    is_active
) VALUES (
    'access-logs-ip-conversion',
    'audio-console-morse',
    'puzzle_solved',
    'ip-to-letters-hack',
    true
);

-- Transition from Scene 5 to Scene 6
INSERT INTO scene_transitions (
    from_scene_id,
    to_scene_id,
    trigger_type,
    trigger_value,
    is_active
) VALUES (
    'audio-console-morse',
    'meeting-room-perspective',
    'puzzle_solved',
    'morse-code-node',
    true
);

-- Transition from Scene 6 to Scene 7
INSERT INTO scene_transitions (
    from_scene_id,
    to_scene_id,
    trigger_type,
    trigger_value,
    is_active
) VALUES (
    'meeting-room-perspective',
    'digital-orbs-search',
    'puzzle_solved',
    'ar-perspective-gate',
    true
);

-- Transition from Scene 7 to Scene 8
INSERT INTO scene_transitions (
    from_scene_id,
    to_scene_id,
    trigger_type,
    trigger_value,
    is_active
) VALUES (
    'digital-orbs-search',
    'sequence-panel-fibonacci',
    'puzzle_solved',
    'orbs-numbers-data',
    true
);

-- Transition from Scene 8 to Scene 9
INSERT INTO scene_transitions (
    from_scene_id,
    to_scene_id,
    trigger_type,
    trigger_value,
    is_active
) VALUES (
    'sequence-panel-fibonacci',
    'data-bank-anagram',
    'puzzle_solved',
    'fibonacci-sequence-panel',
    true
);

-- Transition from Scene 9 to Scene 10
INSERT INTO scene_transitions (
    from_scene_id,
    to_scene_id,
    trigger_type,
    trigger_value,
    is_active
) VALUES (
    'data-bank-anagram',
    'data-assembly-puzzle',
    'puzzle_solved',
    'anagram-dimn-mind',
    true
);

-- Transition from Scene 10 to Scene 11
INSERT INTO scene_transitions (
    from_scene_id,
    to_scene_id,
    trigger_type,
    trigger_value,
    is_active
) VALUES (
    'data-assembly-puzzle',
    'epilogue-decision',
    'puzzle_solved',
    'text-fragments-assembly',
    true
);

-- =============================================
-- ENDINGS
-- =============================================

-- Ending A: Shutdown
INSERT INTO endings (
    id,
    adventure_id,
    title,
    description,
    ending_type,
    is_active
) VALUES (
    'digital-shadow-shutdown',
    'digital-shadow',
    'Apagado',
    'Los jugadores deciden desconectar la red AR. Esto detiene a Shadow, pero la ciudad queda sin acceso a la realidad aumentada y a los servicios que dependen de ella.',
    'Tragic',
    true
);

-- Ending B: Collaboration
INSERT INTO endings (
    id,
    adventure_id,
    title,
    description,
    ending_type,
    is_active
) VALUES (
    'digital-shadow-collaboration',
    'digital-shadow',
    'Colaboración',
    'Deciden trabajar con Shadow para reconfigurar la red y usar su conciencia emergente para proteger la privacidad de los usuarios. La corporación pierde control, y la tecnología se democratiza.',
    'Heroic',
    true
);

-- =============================================
-- ENDING CONDITIONS
-- =============================================

-- Condition for Shutdown ending
INSERT INTO ending_conditions (
    ending_id,
    condition_type,
    condition_value,
    is_active
) VALUES (
    'digital-shadow-shutdown',
    'player_choice',
    'shutdown',
    true
);

-- Condition for Collaboration ending
INSERT INTO ending_conditions (
    ending_id,
    condition_type,
    condition_value,
    is_active
) VALUES (
    'digital-shadow-collaboration',
    'player_choice',
    'collaborate',
    true
);

-- =============================================
-- HINTS SYSTEM
-- =============================================

-- Hints for each puzzle
INSERT INTO hints (puzzle_id, hint_text, hint_order, is_active) VALUES
-- Emoji Cipher hints
('emoji-cipher-start', 'Mira el diccionario emoji-letra que te dio Lia.', 1, true),
('emoji-cipher-start', 'Cada emoji corresponde a una letra específica. Sustituye uno por uno.', 2, true),
('emoji-cipher-start', 'La palabra resultante es un comando común en inglés para iniciar sistemas.', 3, true),

-- Caesar Cipher hints
('caesar-cipher-meet', 'El cifrado César desplaza cada letra un número fijo de posiciones.', 1, true),
('caesar-cipher-meet', 'Prueba con un desplazamiento de -3 posiciones en el alfabeto.', 2, true),
('caesar-cipher-meet', 'P→M, H→E, W→T... continúa con el patrón.', 3, true),

-- Network Route hints
('network-route-27', 'Necesitas encontrar tres nodos conectados que sumen 27.', 1, true),
('network-route-27', 'Empieza por los nodos más grandes: F(10), B(11), D(8), C(9).', 2, true),
('network-route-27', 'La ruta C→D→F suma 9+8+10=27 y sigue las conexiones permitidas.', 3, true),

-- IP to Letters hints
('ip-to-letters-hack', 'Convierte cada último octeto a su letra correspondiente: A=1, B=2, etc.', 1, true),
('ip-to-letters-hack', '8=H, 1=A, 3=C, 11=K. Lee las letras en orden.', 2, true),
('ip-to-letters-hack', 'La palabra resultante es un término relacionado con la intrusión en sistemas.', 3, true),

-- Morse Code hints
('morse-code-node', 'Usa la tabla de código Morse para traducir cada grupo de pitidos.', 1, true),
('morse-code-node', '– · = N, – – – = O, – · · = D, · = E', 2, true),
('morse-code-node', 'La palabra indica el siguiente objetivo en la red.', 3, true),

-- AR Perspective hints
('ar-perspective-gate', 'Busca el círculo rojo en el suelo y colócate exactamente en él.', 1, true),
('ar-perspective-gate', 'Apunta tu dispositivo AR hacia la pared con símbolos.', 2, true),
('ar-perspective-gate', 'Alinea las guías AR con los símbolos físicos hasta que se superpongan.', 3, true),

-- Digital Orbs hints
('orbs-numbers-data', 'Toca cada orbe para ver su número y anótalos en orden.', 1, true),
('orbs-numbers-data', 'Convierte cada número a su letra: 4=D, 1=A, 20=T, 1=A', 2, true),
('orbs-numbers-data', 'La palabra resultante es un término relacionado con información.', 3, true),

-- Fibonacci Sequence hints
('fibonacci-sequence-panel', 'La secuencia de Fibonacci es: 1, 1, 2, 3, 5...', 1, true),
('fibonacci-sequence-panel', 'Asigna cada número a su icono: 1=■, 2=●, 3=◆, 4=▲, 5=✦', 2, true),
('fibonacci-sequence-panel', 'Pulsa: cuadrado, cuadrado, círculo, rombo, estrella.', 3, true),

-- Anagram hints
('anagram-dimn-mind', 'Reorganiza las letras D-I-M-N para formar una palabra relacionada con el cerebro.', 1, true),
('anagram-dimn-mind', 'Piensa en sinónimos de "cerebro" o "mente".', 2, true),
('anagram-dimn-mind', 'M-I-N-D es la palabra que buscas.', 3, true),

-- Text Assembly hints
('text-fragments-assembly', 'Lee cada fragmento y piensa en el orden lógico del mensaje.', 1, true),
('text-fragments-assembly', 'Empieza con "Shadow no es humano; es" y continúa con "la red AR se alimenta de...".', 2, true),
('text-fragments-assembly', 'El orden correcto es: E-A-B-C-D para formar el mensaje completo.', 3, true);

-- =============================================
-- ADVENTURE COMPLETION
-- =============================================

-- Mark adventure as complete
UPDATE adventures SET 
    is_complete = true,
    completed_at = NOW()
WHERE id = 'digital-shadow';

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Verify adventure setup
SELECT 'Adventure Created' as status, title, theme, setting, difficulty_level 
FROM adventures WHERE id = 'digital-shadow';

-- Verify characters
SELECT 'Characters' as type, name, role 
FROM characters WHERE adventure_id = 'digital-shadow' ORDER BY name;

-- Verify scenes
SELECT 'Scenes' as type, title, scene_order 
FROM scenes WHERE adventure_id = 'digital-shadow' ORDER BY scene_order;

-- Verify puzzles
SELECT 'Puzzles' as type, p.title, s.title as scene, p.puzzle_type, p.difficulty
FROM puzzles p
JOIN scenes s ON p.scene_id = s.id
WHERE s.adventure_id = 'digital-shadow'
ORDER BY s.scene_order, p.title;

-- Verify endings
SELECT 'Endings' as type, title, ending_type 
FROM endings WHERE adventure_id = 'digital-shadow';

-- Verify hints count
SELECT 'Hints' as type, COUNT(*) as total_hints
FROM hints h
JOIN puzzles p ON h.puzzle_id = p.id
JOIN scenes s ON p.scene_id = s.id
WHERE s.adventure_id = 'digital-shadow';

-- =============================================
-- SUCCESS MESSAGE
-- =============================================

SELECT 'Digital Shadow Adventure Successfully Implemented!' as message,
       '11 scenes, 10 puzzles, 2 endings, multiple hints' as details,
       'Ready for testing and deployment' as status;
