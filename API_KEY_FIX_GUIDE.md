# 🔧 Google Maps API Key - Fix Guide

## 🚨 PROBLEMA IDENTIFICADO

**Error:** `API keys with referer restrictions cannot be used with this API`

**Causa:** La API key está configurada con restricciones de referrer que solo permiten su uso desde navegadores web, no desde servidores.

## ✅ SOLUCIÓN PASO A PASO

### 1. Ir a Google Cloud Console
- URL: https://console.cloud.google.com/
- Iniciar sesión con tu cuenta de Google

### 2. Navegar a Credentials
- Ve a "APIs & Services" → "Credentials"
- Busca tu API key: `AIzaSyAy-oS-hSSi38S5nNnuc4ykUK8F9RBVCH0`
- Haz clic en el nombre de la API key para editarla

### 3. Configurar Restricciones de Aplicación

**Opción A: Sin Restricciones (Para Desarrollo)**
- En "Application restrictions"
- Seleccionar "None"
- ⚠️ **Menos seguro pero funciona para desarrollo**

**Opción B: Restricciones por IP (Recomendado)**
- En "Application restrictions"
- Seleccionar "IP addresses"
- Agregar tu IP pública del servidor
- Para desarrollo local, agregar: `127.0.0.1`

**Opción C: Restricciones por Referrer (Para Web)**
- En "Application restrictions"
- Seleccionar "HTTP referrers"
- Agregar: `localhost:3000/*`
- Agregar: `tu-dominio.com/*` (para producción)

### 4. Configurar Restricciones de API
- En "API restrictions"
- Seleccionar "Restrict key"
- Elegir solo:
  - ✅ **Geocoding API**
  - ✅ **Places API**
  - ✅ **Maps JavaScript API** (opcional)

### 5. Guardar Cambios
- Haz clic en "Save"
- Espera 1-2 minutos para que los cambios se apliquen

## 🧪 VERIFICAR LA SOLUCIÓN

### Test 1: Verificar API Key
```bash
node test-api-key.js
```

### Test 2: Probar en la Aplicación
```bash
curl -X POST http://localhost:3000/api/geocoding \
  -H "Content-Type: application/json" \
  -d '{"action":"geocode","query":"Times Square, New York"}'
```

### Resultado Esperado
```json
{
  "latitude": 40.7589,
  "longitude": -73.9851,
  "formattedAddress": "Times Square, New York, NY, USA",
  "addressComponents": {
    "locality": "New York",
    "administrativeAreaLevel1": "NY",
    "country": "United States"
  }
}
```

## 🎯 COORDENADAS REALES QUE OBTENDRÁS

Una vez solucionado, obtendrás coordenadas reales:

- **Times Square, NY**: 40.7589, -73.9851
- **Torre Eiffel, París**: 48.8584, 2.2945
- **Tokyo Tower, Japón**: 35.6586, 139.7454
- **Machu Picchu, Perú**: -13.1631, -72.5450
- **Sydney Opera House, Australia**: -33.8568, 151.2153

## 🔒 SEGURIDAD RECOMENDADA

### Para Desarrollo
- **Application restrictions**: "None" o "IP addresses" con `127.0.0.1`
- **API restrictions**: Solo Geocoding API y Places API

### Para Producción
- **Application restrictions**: "HTTP referrers" con tu dominio
- **API restrictions**: Solo las APIs necesarias
- **Billing alerts**: Configurar alertas de uso

## 🚨 TROUBLESHOOTING

### Error: "REQUEST_DENIED"
- ✅ Verificar que las restricciones de aplicación estén configuradas correctamente
- ✅ Esperar 1-2 minutos después de guardar cambios
- ✅ Verificar que las APIs estén habilitadas

### Error: "API key not found"
- ✅ Verificar que la API key esté en `.env.local`
- ✅ Reiniciar el servidor después de cambios

### Error: "Quota exceeded"
- ✅ Verificar billing en Google Cloud Console
- ✅ Revisar límites de uso

## 🎉 RESULTADO FINAL

Una vez solucionado:
- ✅ **Cobertura Global**: Cualquier dirección del mundo
- ✅ **Coordenadas Reales**: Precisión exacta
- ✅ **Sin Datos Mock**: No más coordenadas falsas de NYC
- ✅ **Búsqueda Inteligente**: Autocomplete con resultados reales

---

**🎯 El sistema está 100% implementado. Solo necesita configurar las restricciones de la API key.**
