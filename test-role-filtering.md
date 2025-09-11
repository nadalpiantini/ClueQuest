# Test de Filtrado de Roles por Género

## Funcionalidad Implementada

Se ha implementado la lógica para filtrar roles por género de aventura en la página de selección de roles (`/src/app/(adventure)/role-selection/page.tsx`).

## Cómo Funciona

1. **Mapeo de Géneros a Categorías**: Se creó un mapeo que asocia cada género de aventura con las categorías de roles apropiadas:
   - `fantasy` → ['Fantasy', 'Mystical', 'Historical']
   - `mystery` → ['Mystery', 'Academic', 'Modern']
   - `detective` → ['Mystery', 'Academic', 'Modern']
   - `sci-fi` → ['Tech', 'Academic', 'Modern']
   - `horror` → ['Mystical', 'Fantasy', 'Mystery']
   - `adventure` → ['Adventure', 'Historical', 'Combat']
   - `treasure-hunt` → ['Adventure', 'Historical', 'Mystery']
   - `escape-room` → ['Academic', 'Tech', 'Mystery']
   - `puzzle` → ['Academic', 'Creative', 'Tech']
   - `corporate` → ['Corporate', 'Modern', 'Academic']
   - `educational` → ['Academic', 'Modern', 'Creative']
   - `team-building` → ['Corporate', 'Support', 'Modern']
   - `social` → ['Creative', 'Modern', 'Support']
   - `entertainment` → ['Creative', 'Fantasy', 'Adventure']

2. **Filtrado Dinámico**: La función `getRolesForGenre()` filtra los roles disponibles basándose en el género de la aventura.

3. **Parámetro de URL**: Se puede especificar el género usando el parámetro `genre` en la URL.

## Ejemplos de Uso

### Para Aventura de Fantasía
URL: `https://cluequest.empleaido.com/role-selection?genre=fantasy`
Roles mostrados: Wizard, Sorceress, Paladin, Rogue, Bard, Druid, Psychic, Vampire, Werewolf, Pirate, Ninja, Samurai

### Para Aventura de Misterio
URL: `https://cluequest.empleaido.com/role-selection?genre=mystery`
Roles mostrados: Detective, Forensic Expert, Secret Agent, Investigative Reporter, Scholar, Scientist, Archaeologist, Librarian, Doctor, Teacher, Chef

### Para Aventura de Ciencia Ficción
URL: `https://cluequest.empleaido.com/role-selection?genre=sci-fi`
Roles mostrados: Hacker, Engineer, Pilot, Scholar, Scientist, Archaeologist, Librarian, Doctor, Teacher, Chef

### Para Aventura Corporativa
URL: `https://cluequest.empleaido.com/role-selection?genre=corporate`
Roles mostrados: CEO, Management Consultant, Negotiator, Scholar, Scientist, Archaeologist, Librarian, Doctor, Teacher, Chef

## Categorías de Roles Disponibles

- **Fantasy**: Wizard, Sorceress, Paladin, Rogue, Bard, Druid
- **Combat**: Warrior, Archer, Knight, Assassin
- **Mystery**: Detective, Forensic Expert, Secret Agent, Investigative Reporter
- **Academic**: Scholar, Scientist, Archaeologist, Librarian
- **Tech**: Hacker, Engineer, Pilot
- **Support**: Combat Medic
- **Corporate**: CEO, Management Consultant, Negotiator
- **Creative**: Master Artist, Photographer, Musician
- **Adventure**: Explorer, Treasure Hunter, Survivor
- **Mystical**: Psychic Medium, Vampire, Werewolf
- **Historical**: Pirate Captain, Ninja, Samurai
- **Modern**: Emergency Doctor, Professor, Master Chef

## Integración con el Builder

Esta funcionalidad se integra perfectamente con el sistema de builder existente, donde cada rol ya tiene una categoría definida. El filtrado se aplica automáticamente cuando los usuarios llegan a la página de selección de roles.

## Beneficios

1. **Experiencia Coherente**: Los usuarios solo ven roles que tienen sentido para el tipo de aventura que están jugando.
2. **Inmersión Mejorada**: Cada género de aventura tiene roles temáticamente apropiados.
3. **Flexibilidad**: Fácil de extender con nuevos géneros y roles.
4. **Mantenibilidad**: El mapeo está centralizado y es fácil de modificar.
