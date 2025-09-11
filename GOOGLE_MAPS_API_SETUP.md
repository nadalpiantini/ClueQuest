# 🗺️ Google Maps API Setup - ClueQuest

## 🚨 ESTADO ACTUAL
- ✅ **Servicio de Geocoding**: Implementado y funcionando
- ✅ **Fallback System**: Funciona con datos mock
- ❌ **API Key**: NO CONFIGURADA - usando datos falsos
- ❌ **Cobertura Global**: Limitada a coordenadas mock de NYC

## 🎯 OBJETIVO
Configurar Google Maps API para obtener coordenadas reales de cualquier lugar del mundo.

## 📋 PASOS PARA CONFIGURAR

### 1. Obtener API Key de Google Maps

1. **Ir a Google Cloud Console**
   - Visita: https://console.cloud.google.com/
   - Inicia sesión con tu cuenta de Google

2. **Crear o Seleccionar Proyecto**
   - Si no tienes proyecto: "New Project" → "ClueQuest"
   - Si ya tienes: selecciona tu proyecto

3. **Habilitar APIs Necesarias**
   - Ve a "APIs & Services" → "Library"
   - Busca y habilita:
     - ✅ **Geocoding API**
     - ✅ **Places API**
     - ✅ **Maps JavaScript API** (opcional, para futuras funciones)

4. **Crear API Key**
   - Ve a "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copia la API key generada

### 2. Configurar API Key en ClueQuest

1. **Editar .env.local**
   ```bash
   # Agregar esta línea al final del archivo .env.local
   GOOGLE_MAPS_API_KEY=TU_API_KEY_AQUI
   ```

2. **Reiniciar el servidor**
   ```bash
   npm run dev
   ```

### 3. Verificar Funcionamiento

1. **Ejecutar test**
   ```bash
   node test-google-maps.js
   ```

2. **Verificar en la aplicación**
   - Ir a: http://localhost:3000/create
   - Paso 3: Locations & QR Codes
   - Probar "Google Maps Address Lookup"

## 🔒 SEGURIDAD (IMPORTANTE)

### Restricciones de API Key
1. **Editar API Key** en Google Cloud Console
2. **Application restrictions**:
   - Seleccionar "HTTP referrers"
   - Agregar: `localhost:3000/*`
   - Agregar: `tu-dominio.com/*` (para producción)
3. **API restrictions**:
   - Seleccionar "Restrict key"
   - Elegir solo: Geocoding API, Places API

### Límites de Uso
- **Free Tier**: $200/mes de crédito
- **Geocoding**: $0.005 por request
- **Places API**: $0.017 por request
- **Uso típico**: 1-5 requests por ubicación

## 🧪 TESTING

### Test Automático
```bash
node test-google-maps.js
```

### Test Manual
1. Buscar "Times Square, New York"
2. Buscar "Torre Eiffel, París"
3. Buscar "Machu Picchu, Perú"
4. Verificar que las coordenadas sean reales (no mock)

## 🚨 TROUBLESHOOTING

### Error: "API key not found"
- ✅ Verificar que `GOOGLE_MAPS_API_KEY` esté en `.env.local`
- ✅ Reiniciar servidor después de agregar la variable

### Error: "This API project is not authorized"
- ✅ Verificar que las APIs estén habilitadas
- ✅ Verificar permisos de la API key

### Error: "Quota exceeded"
- ✅ Verificar billing en Google Cloud Console
- ✅ Revisar límites de uso

### Coordenadas siguen siendo mock
- ✅ Verificar que la API key sea válida
- ✅ Verificar que las APIs estén habilitadas
- ✅ Revisar logs del servidor

## 🎯 RESULTADO ESPERADO

Después de configurar correctamente:
- ✅ **Coordenadas Reales**: Times Square = 40.7589, -73.9851
- ✅ **Cobertura Global**: Cualquier dirección del mundo
- ✅ **Búsqueda Precisa**: Autocomplete con resultados reales
- ✅ **Sin Warnings**: No más mensajes de "mock data"

## 📞 SOPORTE

Si tienes problemas:
1. Revisar logs del servidor
2. Verificar configuración en Google Cloud Console
3. Ejecutar `node test-google-maps.js` para diagnóstico
