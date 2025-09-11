# Leonardo AI Avatar Generation Setup

## 🎭 ClueQuest Avatar System

Tu sistema de avatares ahora está integrado con Leonardo AI para generar transformaciones de personajes basadas en roles de aventura.

## ⚙️ Configuración Requerida

### 1. API Key de Leonardo AI
Tu API Key ya está proporcionada: `your_leonardo_api_key_here`

Añádela a tu archivo `.env.local`:
```env
LEONARDO_AI_API_KEY=your_leonardo_api_key_here
```

### 2. Verificar Supabase Storage
Asegúrate de que tu proyecto Supabase tenga Storage habilitado:
- Ve a tu proyecto Supabase Dashboard
- Navega a Storage
- El bucket `avatars` se creará automáticamente la primera vez que uses el sistema

## 🎯 Funcionalidades Implementadas

### Transformaciones por Rol
Cada rol de aventura tiene una transformación única:

| Rol | Transformación | Descripción |
|-----|----------------|-------------|
| **Leader** | Noble Detective | Detectivo elegante con presencia de comando |
| **Warrior** | Werewolf Warrior | Hombre lobo feroz listo para batalla |
| **Mage** | Mystic Vampire | Vampiro sorcerer etéreo con poderes arcanos |
| **Healer** | Luminous Fairy | Hada radiante con aura gentil |
| **Scout** | Shadow Scout | Ninja explorador sigiloso |

### Flujo de Usuario
1. **Selección de Rol** → Usuario elige su rol en `/role-selection`
2. **Upload de Selfie** → Sube foto personal en `/avatar-generation`  
3. **Transformación Automática** → Leonardo AI genera avatar basado en el rol
4. **Personalización** → Opciones de género, edad, etc.
5. **Resultado Final** → Avatar transformado listo para la aventura

## 🔧 API Endpoints Creados

### `/api/ai/avatar/upload-selfie`
- **Método**: POST
- **Input**: FormData con archivo 'selfie'
- **Validación**: Tamaño máx 10MB, tipos JPEG/PNG/WebP
- **Output**: URL del archivo subido

### `/api/ai/avatar/generate`  
- **Método**: POST
- **Input**: `{ selfie_url, style_id, customizations, session_code? }`
- **Proceso**: Leonardo AI + Character Reference ControlNet
- **Output**: Avatar generado con metadata completa

## 🎨 Tecnología Leonardo AI

### Configuración Técnica
- **Modelo**: Leonardo Kino XL (PhotoReal v2)
- **ControlNet**: Character Reference (preprocessorId: 133)
- **Resolución**: 1024x1024 píxeles
- **Estilo**: Cinematic preset para calidad profesional
- **Fortaleza**: High strength para mantener características faciales

### Prompts Optimizados
Cada rol tiene prompts específicamente diseñados para generar transformaciones coherentes:

```typescript
// Ejemplo: Warrior Role
'fierce werewolf warrior character, powerful muscular build, battle-ready stance, 
intense fierce eyes, rugged armor details, epic fantasy lighting, photorealistic 
portrait, high detail, intimidating, studio quality, 8K resolution'
```

## 🧪 Testing

Para probar el sistema completo:

1. **Inicia el servidor dev**:
   ```bash
   npm run dev
   ```

2. **Navega a Role Selection**:
   ```
   http://localhost:5173/role-selection?session=test&guest=true
   ```

3. **Sigue el flujo**: Role → Avatar → Adventure Hub

## 🔒 Seguridad & Privacidad

### Características de Seguridad
- **Validación de archivos**: Solo imágenes permitidas
- **Límites de tamaño**: Máximo 10MB por selfie  
- **Autenticación requerida**: Solo usuarios autenticados pueden generar avatares
- **Limpieza automática**: Selfies originales se eliminan después de generar
- **Moderación integrada**: Leonardo AI tiene moderación de contenido incorporada

### Almacenamiento
- **Selfies temporales**: `avatars/selfies/` (eliminados después de uso)
- **Avatares generados**: `avatars/generated/` (permanentes)
- **Metadata**: Guardado en `cluequest_ai_avatars` con tracking completo

## 🚀 Performance

### Optimizaciones Implementadas
- **Upload asíncrono**: Proceso en background para mejor UX
- **Progress tracking**: Indicadores de progreso en tiempo real
- **Error handling**: Fallbacks graceful y reintentos automáticos
- **Caching**: Avatares cacheados por 1 año en CDN

### Métricas Esperadas
- **Tiempo de generación**: 15-45 segundos con Leonardo AI
- **Calidad**: PhotoReal v2 para avatares de calidad profesional
- **Costo por avatar**: Aproximadamente $0.02-0.05 USD por generación

## 🎯 Siguiente Pasos

1. **Configurar API Key** en `.env.local`
2. **Probar flujo completo** con rol → avatar → aventura
3. **Opcional**: Añadir más estilos de transformación
4. **Opcional**: Implementar cache de avatares por usuario
5. **Opcional**: Añadir analytics de uso de avatares

---

**🎭 Tu sistema de avatares ClueQuest está listo para crear transformaciones épicas basadas en roles de aventura!**