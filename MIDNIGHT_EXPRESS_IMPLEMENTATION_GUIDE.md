# The Midnight Express Mystery - Guía de Implementación

## Resumen Ejecutivo

**The Midnight Express Mystery** es una aventura de escape room completa desarrollada para ClueQuest, siguiendo los principios de diseño de escape rooms profesionales. La aventura está ambientada en un tren de lujo de 1920 y presenta un misterio de desaparición con múltiples capas de intriga.

### Características Principales

- **Duración**: 55 minutos
- **Jugadores**: 4-8 personas
- **Edad mínima**: 12+
- **Dificultad**: Media
- **Tema**: Misterio a bordo de un tren de lujo
- **Tecnología**: QR codes, AR, elementos multisensoriales

## Estructura de Archivos

La aventura está implementada en los siguientes archivos:

```
src/data/adventures/
├── midnight-express-mystery.ts          # Estructura principal de la aventura
├── midnight-express-npcs.ts             # Sistema de NPCs y personajes
├── midnight-express-materials.ts        # Materiales físicos y tecnología
├── midnight-express-endings.ts          # Sistema de decisiones y finales
├── midnight-express-progression.ts      # Validación y progresión de puzzles
├── midnight-express-communication.ts    # Sistema de comunicación del equipo
└── midnight-express-complete.ts         # Integración completa de todos los sistemas
```

## Componentes del Sistema

### 1. Estructura Principal (`midnight-express-mystery.ts`)

Contiene la definición base de la aventura con:
- 10 escenas interconectadas
- 4 roles de jugador especializados
- 15 puzzles integrados con la narrativa
- Sistema de progresión lineal con elementos de elección

### 2. Sistema de NPCs (`midnight-express-npcs.ts`)

Define 7 personajes interactivos:
- **Henri Dupont Lemaire** (Conductor) - Sospechoso principal
- **Albert** (Maitre d') - Testigo clave
- **Madame Aria** (Soprano) - Sospechosa secundaria
- **Jean Laurent Renaud** (Empresario) - Agente doble
- **Inge Müller Schmidt** (Científica) - Agente de policía
- **Nicholas López Álvarez** (Periodista) - Observador neutral
- **Dr. Émile Fournier** (Historiador) - Personaje desaparecido

### 3. Materiales y Tecnología (`midnight-express-materials.ts`)

Incluye:
- **16 materiales físicos** requeridos
- **4 códigos QR** para pistas digitales
- **4 elementos AR** para experiencias inmersivas
- **7 efectos sonoros** ambientales
- **4 fragancias** para elementos multisensoriales

### 4. Sistema de Finales (`midnight-express-endings.ts`)

Implementa **6 finales diferentes** basados en decisiones del jugador:
- **Justicia Prevalece** (Éxito completo)
- **Éxito Parcial** (Algunos criminales escapan)
- **La Traición** (Confían en la persona equivocada)
- **Tragedia en las Vías** (El tren descarrila)
- **Neutralidad Cautelosa** (Mantienen distancia)
- **Caos Total** (Decisiones crean confusión)

### 5. Progresión y Validación (`midnight-express-progression.ts`)

Sistema completo de:
- **15 validaciones de puzzles** con múltiples respuestas aceptables
- **45 pistas progresivas** (3 niveles por puzzle)
- **9 condiciones de desbloqueo** de escenas
- Sistema de puntuación y logros

### 6. Comunicación del Equipo (`midnight-express-communication.ts`)

Facilita la colaboración con:
- **Sistema de chat en tiempo real**
- **7 coordinaciones específicas** por escena
- **Cuaderno compartido** para notas
- **4 reglas de comunicación** contextuales

## Implementación Técnica

### Integración con ClueQuest

La aventura se integra con el sistema existente de ClueQuest a través de:

1. **Modelos de Dominio**: Utiliza las interfaces definidas en `src/lib/domain/adventure/models.ts`
2. **Base de Datos**: Compatible con el esquema de `025_story_system_enhanced.sql`
3. **API**: Se puede cargar a través de la API de aventuras existente
4. **UI**: Compatible con los componentes de aventura existentes

### Configuración de Base de Datos

Para implementar la aventura en la base de datos:

```sql
-- Insertar la aventura en la tabla enhanced_adventures
INSERT INTO public.cluequest_enhanced_adventures (
    story_id,
    title,
    description,
    category,
    difficulty,
    estimated_duration,
    scene_count,
    min_players,
    max_players,
    min_age,
    location_type,
    space_requirements,
    required_materials,
    tech_requirements,
    puzzle_types,
    tech_integrations,
    narrative_hook,
    story_acts,
    character_roles,
    story_themes,
    qr_codes_enabled,
    ar_features,
    ai_characters,
    status
) VALUES (
    'midnight_express',
    'The Midnight Express Mystery',
    'A mysterious disappearance aboard a luxury train. Can you solve the case before the next station?',
    'mystery',
    'intermediate',
    55,
    10,
    4,
    8,
    12,
    'indoor',
    'large_room',
    '["Manifiesto de pasajeros", "Servilleta codificada", "Tabla de código Morse", "Horario del tren", "Etiqueta de equipaje", "Objetos con peso", "Disco de gramófono", "Etiquetas de maletas", "Pasaporte con tinta invisible", "Linterna UV", "Panel de sala de máquinas", "Tablero de lógica", "Panel de engranajes", "Máquina telegráfica", "Lupas", "Cuadernos y lápices"]',
    '["QR codes", "AR elements", "UV flashlight", "Audio system", "Communication system"]',
    '["logical", "cryptographic", "mathematical", "spatial", "temporal", "linguistic"]',
    '["qr_code", "ar_overlay", "voice_recognition", "ai_interaction"]',
    'El Midnight Express es un tren de lujo que cubre la ruta París–Estambul. Durante el viaje nocturno, un pasajero célebre desaparece sin dejar rastro.',
    '[{"act": 1, "scenes": ["Embarque", "Comedor", "Salón", "Cabina 3A"], "description": "Investigación inicial y descubrimiento de pistas"}, {"act": 2, "scenes": ["Observación", "Equipaje", "Sala de Máquinas"], "description": "Profundización en el misterio y descubrimiento de la conspiración"}, {"act": 3, "scenes": ["Biblioteca", "Vagón Oculto", "Conclusión"], "description": "Resolución del misterio y decisión final"}]',
    '[{"id": "detective-lead", "name": "Detective Principal", "description": "Líder del equipo de detectives encubiertos"}, {"id": "forensic-expert", "name": "Experto Forense", "description": "Especialista en análisis de evidencia y pistas"}, {"id": "code-breaker", "name": "Descifrador de Códigos", "description": "Especialista en criptografía y códigos secretos"}, {"id": "social-detective", "name": "Detective Social", "description": "Especialista en interrogatorios y análisis de comportamiento"}]',
    '["mystery", "suspense", "teamwork", "deduction", "historical", "adventure"]',
    true,
    '{"enabled": true, "elements": 4, "triggers": ["image", "location", "qr", "manual"]}',
    '[]',
    'published'
);
```

### Configuración de Escenas

Cada escena debe insertarse en la tabla `cluequest_enhanced_scenes`:

```sql
-- Ejemplo para la primera escena
INSERT INTO public.cluequest_enhanced_scenes (
    adventure_id,
    scene_number,
    scene_id,
    title,
    description,
    act_number,
    narrative_content,
    objectives,
    completion_criteria,
    puzzles,
    challenges,
    interactions,
    qr_codes,
    ar_elements,
    tech_interactions,
    estimated_duration,
    time_limit,
    hints,
    points_reward,
    unlocks_next,
    story_revelations,
    order_index
) VALUES (
    (SELECT id FROM public.cluequest_enhanced_adventures WHERE story_id = 'midnight_express'),
    1,
    'scene-1-embarkation',
    'Embarque y Manifiesto',
    'Al subir al tren, el jefe de estación entrega al equipo seis billetes y un manifiesto de pasajeros.',
    1,
    'El Midnight Express se alza majestuoso bajo la luz de la luna...',
    '["Presentar la aventura", "Resolver el puzzle del manifiesto", "Establecer la dinámica del equipo"]',
    '{"type": "all_challenges", "requiredChallenges": ["puzzle-1-manifest"]}',
    '[{"id": "puzzle-1-manifest", "type": "short_answer", "question": "Manifiesto del Midnight Express...", "correctAnswer": "3A", "difficulty": "beginner", "pointValue": 100}]',
    '[]',
    '[]',
    '[]',
    '[]',
    '[]',
    10,
    600,
    '[{"id": "hint-1-manifest-subtle", "level": "subtle", "text": "Recuerda que las cabinas están numeradas en orden: 1A, 1C, 2A, 2B, 3A, 3B"}]',
    100,
    '["scene-2-dining-car"]',
    '["Descubrimiento de la cabina 3A como punto de partida"]',
    1
);
```

## Guía de Uso

### Para Facilitadores

1. **Configuración**: Usar la guía de configuración en `setupGuide`
2. **Facilitación**: Seguir la guía del maestro en `masterGuide`
3. **Monitoreo**: Usar el sistema de progresión para rastrear el avance
4. **Soporte**: Proporcionar pistas usando el sistema de hints progresivos

### Para Jugadores

1. **Preparación**: Leer la guía del jugador en `playerGuide`
2. **Roles**: Asignar roles específicos a cada miembro del equipo
3. **Comunicación**: Usar el sistema de comunicación para colaborar
4. **Notas**: Mantener un cuaderno compartido de descubrimientos

### Para Desarrolladores

1. **Integración**: Importar los archivos TypeScript en el proyecto
2. **Personalización**: Modificar los datos según necesidades específicas
3. **Extensión**: Agregar nuevas escenas o puzzles siguiendo la estructura existente
4. **Testing**: Usar el sistema de validación para probar puzzles

## Características Avanzadas

### Elementos Multisensoriales

- **Sonidos**: Efectos ambientales del tren, código Morse, sonidos de éxito
- **Fragancias**: Jazmín (conecta pistas), cuero (ambientación), humo de carbón (sala de máquinas)
- **Texturas**: Materiales de época, objetos con peso específico
- **Visuales**: Iluminación de época, efectos AR, códigos QR

### Sistema de Decisiones

- **3 decisiones críticas** que afectan el final
- **Múltiples caminos** de resolución
- **Consecuencias reales** de las acciones del equipo
- **Sistema de logros** basado en el rendimiento

### Tecnología Integrada

- **QR Codes**: 4 códigos para pistas digitales
- **AR Elements**: 4 experiencias de realidad aumentada
- **Comunicación**: Sistema de chat en tiempo real
- **Progresión**: Tracking automático del avance

## Métricas y Analytics

La aventura incluye métricas detalladas para:

- **Tiempo de resolución** por puzzle
- **Uso de pistas** por equipo
- **Patrones de comunicación** del equipo
- **Decisiones tomadas** y sus consecuencias
- **Satisfacción del jugador** por escena

## Mantenimiento y Actualizaciones

### Versionado

- **Versión actual**: 1.0.0
- **Compatibilidad**: ClueQuest v2.0+
- **Actualizaciones**: Seguir el sistema de versionado semántico

### Mejoras Futuras

- **IA Personalizada**: Adaptación de dificultad basada en rendimiento
- **Más Finales**: Expansión del sistema de decisiones
- **Nuevos Puzzles**: Adición de puzzles adicionales
- **Localización**: Soporte para múltiples idiomas

## Conclusión

**The Midnight Express Mystery** representa una implementación completa y profesional de una aventura de escape room, siguiendo las mejores prácticas del diseño de escape rooms y aprovechando las capacidades tecnológicas de ClueQuest. La aventura está lista para ser implementada y utilizada en producción, proporcionando una experiencia inmersiva y desafiante para equipos de 4-8 jugadores.

La estructura modular permite fácil personalización y extensión, mientras que el sistema completo de validación, progresión y comunicación asegura una experiencia fluida y profesional para todos los participantes.
