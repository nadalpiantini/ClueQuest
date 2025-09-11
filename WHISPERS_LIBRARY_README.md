# Whispers in the Library - Aventura Completa

## 🎯 Descripción
"Whispers in the Library" es una aventura de escape room narrativo ambientada en la misteriosa Biblioteca Monteverde. Los jugadores deben resolver 8 escenas interconectadas para descubrir la verdad sobre un crimen y encontrar al asesino.

## 🚀 Instalación y Uso

### Acceso a la Aventura
1. **Página Principal**: `/whispers-library`
2. **Página de Prueba**: `/test-whispers`

### Requisitos
- Navegador moderno con soporte para Web Audio API
- JavaScript habilitado
- Resolución mínima: 1024x768

## 🎮 Estructura de la Aventura

### Escenas (8 total)
1. **Registro y el archivo de tarjetas** - Ordenamiento de tarjetas de biblioteca
2. **El manuscrito cifrado** - Descifrado Vigenère
3. **El poema y el reloj** - Código Morse y análisis de poema
4. **El mapa y la sección prohibida** - Resolución de acertijo
5. **Luz negra y susurros** - Anagramas con luz UV
6. **El árbol del conocimiento** - Lógica deductiva
7. **Microfilms y el susurro del fantasma** - Acróstico y patrones numéricos
8. **Confrontación final y desenlace** - Ensamblaje de palabra final

### Tipos de Puzzles
- **Organización**: Ordenamiento y clasificación
- **Criptografía**: Cifrados y códigos
- **Lógica**: Deducción y razonamiento
- **Observación**: Elementos ocultos y patrones
- **Palabras**: Anagramas y acrósticos
- **Audio**: Código Morse y sonidos ambientales

## 🎭 Personajes y Roles

### Roles Disponibles
- **Detective Principal**: Líder con habilidades de deducción
- **Criptógrafo**: Especialista en códigos y cifrados
- **Investigador de Archivos**: Experto en búsqueda y organización
- **Analista de Evidencias**: Especialista en análisis de pistas

### Personajes de la Historia
- **Sr. Sloane**: Bibliotecario jefe (ayudante)
- **Dra. Reyes**: Curadora de manuscritos (sospechosa)
- **Dr. Black**: Profesor de historia (sospechoso)
- **Clara**: Estudiante (sospechosa)
- **Henry**: Custodio (asesino)

## 🛠️ Características Técnicas

### Componentes React
- `WhispersLibraryAdventure.tsx` - Componente principal
- `LibraryCardPuzzle.tsx` - Puzzle de tarjetas
- `CipherPuzzle.tsx` - Cifrado Vigenère
- `MorsePoemPuzzle.tsx` - Código Morse
- `UVAnagramPuzzle.tsx` - Anagramas con UV
- `LogicDeductionPuzzle.tsx` - Lógica deductiva
- `FinalWordPuzzle.tsx` - Palabra final

### Sistemas de Audio
- **16 efectos de sonido** ambientales
- **Código Morse** con audio real
- **Sonidos de interacción** (páginas, pasos, etc.)
- **Música dramática** para el clímax

### Efectos Visuales
- **Simulación de luz UV** para revelar elementos ocultos
- **Animaciones de canvas** para efectos especiales
- **Gradientes y transiciones** suaves
- **Diseño responsivo** para móviles

## 📊 Sistema de Puntuación

### Puntos por Escena
- Escena 1: 150 puntos
- Escena 2: 200 puntos
- Escena 3: 175 puntos
- Escena 4: 200 puntos
- Escena 5: 225 puntos
- Escena 6: 250 puntos
- Escena 7: 200 puntos
- Escena 8: 300 puntos
- **Total**: 1,700 puntos

### Sistema de Pistas
- Pistas disponibles en cada escena
- Costo de puntos por pista
- Pistas progresivas (más específicas)

## 🎨 Personalización

### Temas Visuales
- **Colores**: Ámbar, marrón, dorado (tema biblioteca)
- **Fuentes**: Serif para ambiente clásico
- **Iluminación**: Tenue y misteriosa
- **Efectos**: Sombras y gradientes

### Configuración de Audio
- **Volumen ajustable** por tipo de sonido
- **Efectos de fade** in/out
- **Reproducción en bucle** para ambientes
- **Control de pausa/reproducción**

## 🔧 Desarrollo

### Estructura de Archivos
```
src/
├── components/adventures/whispers-library/
│   ├── WhispersLibraryAdventure.tsx
│   ├── LibraryCardPuzzle.tsx
│   ├── CipherPuzzle.tsx
│   ├── MorsePoemPuzzle.tsx
│   ├── UVAnagramPuzzle.tsx
│   ├── LogicDeductionPuzzle.tsx
│   └── FinalWordPuzzle.tsx
├── data/adventures/
│   └── whispers-library-data.ts
├── lib/
│   ├── audio/
│   │   └── whispers-library-audio.ts
│   └── effects/
│       └── uv-light-effect.ts
└── app/
    ├── whispers-library/
    │   └── page.tsx
    └── test-whispers/
        └── page.tsx
```

### Base de Datos
- **Script SQL**: `whispers_in_the_library.sql`
- **Tablas**: adventures, scenes, roles, qr_codes, ar_assets
- **Relaciones**: Completamente integrado con el sistema existente

## 🧪 Testing

### Página de Prueba
- Acceso: `/test-whispers`
- **Funcionalidades**:
  - Prueba completa de la aventura
  - Tracking de puntuación y tiempo
  - Pantalla de resultados finales
  - Opción de reiniciar

### Verificaciones
- ✅ Sin errores de linting
- ✅ TypeScript type safety
- ✅ Componentes React funcionales
- ✅ Audio system operativo
- ✅ Efectos UV implementados
- ✅ Base de datos lista

## 🚀 Despliegue

### Requisitos del Servidor
- Node.js 18+
- PostgreSQL 13+
- Next.js 15+

### Archivos de Audio Requeridos
```
public/audio/whispers-library/
├── library-ambience.mp3
├── page-turning.mp3
├── footsteps.mp3
├── morse-code.mp3
├── whispered-poetry.mp3
├── uv-light-hum.mp3
├── book-rustling.mp3
├── candle-flickering.mp3
├── parchment-rustling.mp3
├── microfilm-projector.mp3
├── distorted-voice.mp3
├── film-whirring.mp3
├── wooden-creaking.mp3
├── dramatic-music.mp3
├── mechanical-clicks.mp3
└── distant-voices.mp3
```

### Assets 3D (Opcional)
```
public/ar-assets/
├── library-cards-3d.glb
├── ancient-chest-3d.glb
└── knowledge-tree-3d.glb
```

## 📈 Métricas y Analytics

### Datos Recopilados
- Tiempo de completación por escena
- Puntuación total
- Número de pistas utilizadas
- Intentos por puzzle
- Tasa de abandono por escena

### Optimizaciones
- **Carga perezosa** de componentes
- **Caché de audio** para mejor rendimiento
- **Compresión de assets** para carga rápida
- **Responsive design** para todos los dispositivos

## 🎯 Objetivos de Diseño

### Experiencia del Usuario
- **Inmersión narrativa** completa
- **Progresión lógica** de dificultad
- **Variedad de puzzles** para diferentes habilidades
- **Trabajo en equipo** fomentado
- **Accesibilidad** para todos los usuarios

### Objetivos Educativos
- **Pensamiento crítico** y lógico
- **Habilidades de observación**
- **Conocimiento de criptografía**
- **Trabajo colaborativo**
- **Resolución de problemas**

## 🔮 Futuras Mejoras

### Funcionalidades Planificadas
- **Modo multijugador** en tiempo real
- **IA para pistas dinámicas**
- **Más idiomas** (francés, alemán)
- **Realidad aumentada** mejorada
- **Analytics avanzados**

### Expansiones
- **Nuevas aventuras** en la misma temática
- **Puzzles adicionales** por escena
- **Modo difícil** con restricciones de tiempo
- **Competencias** entre equipos

## 📞 Soporte

### Problemas Comunes
1. **Audio no funciona**: Verificar permisos del navegador
2. **Efectos UV no aparecen**: Verificar soporte de Canvas
3. **Puzzles no cargan**: Verificar conexión a base de datos
4. **Rendimiento lento**: Verificar recursos del sistema

### Contacto
- **Desarrollador**: Equipo ClueQuest
- **Documentación**: Ver `WHISPERS_LIBRARY_IMPLEMENTATION_REPORT.md`
- **Issues**: Reportar en el repositorio del proyecto

---

**¡Disfruta resolviendo el misterio de la Biblioteca Monteverde!** 📚🔍
