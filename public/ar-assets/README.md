# AR Assets for Whispers in the Library

This directory should contain 3D models and AR assets for the adventure:

## Required AR Assets (3 total)

### 3D Models
- `library-cards-3d.glb` - 3D model of library cards for Scene 1
- `ancient-chest-3d.glb` - 3D model of ancient chest for Scene 2
- `knowledge-tree-3d.glb` - 3D model of knowledge tree for Scene 6

## File Requirements
- Format: GLB (GL Transmission Format)
- Size: Optimized for web (under 5MB each)
- Textures: Embedded in GLB file
- Animations: Optional, but recommended for chest opening

## Model Specifications

### Library Cards (library-cards-3d.glb)
- 8 individual card models
- Realistic paper texture
- Slight wear and aging effects
- Interactive hover states

### Ancient Chest (ancient-chest-3d.glb)
- Medieval-style wooden chest
- Metal lock mechanism
- Opening animation
- Weathering and patina effects

### Knowledge Tree (knowledge-tree-3d.glb)
- Stylized tree with branches
- Wooden tablets hanging from branches
- Subtle growth animation
- Mystical lighting effects

## Usage
These models are loaded by the AR system and displayed when users scan QR codes or interact with specific scenes. They enhance the immersive experience by providing 3D visual elements.

## Note
If AR assets are not available, the adventure will still function with 2D elements. The system includes fallbacks for missing 3D models.
