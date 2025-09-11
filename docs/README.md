# 📚 ClueQuest Knowledge Base Documents

Esta carpeta contiene los documentos PDF que alimentan el sistema de Knowledge Base de ClueQuest.

## 📄 Documentos incluidos

- `example-adventure-guide.pdf` - Guía de ejemplo para aventuras ClueQuest

## 🔄 Cómo agregar nuevos documentos

### Método 1: Script de ingesta (Recomendado)
```bash
node scripts/ingest-knowledge-base.mjs ./docs/tu-documento.pdf "Título del Documento"
```

### Método 2: Con metadata completa
```bash
node scripts/ingest-knowledge-base.mjs \
  ./docs/team-building-guide.pdf \
  "Guía de Team Building Corporativo" \
  --description "Estrategias y actividades para team building en empresas" \
  --category corporate \
  --organization tu-org-id \
  --license creative_commons
```

## 📂 Categorías disponibles

- `adventure_ideas` - Ideas y conceptos de aventuras
- `puzzle_mechanics` - Mecánicas de puzzles y juegos  
- `story_frameworks` - Estructuras narrativas y templates
- `educational` - Material educativo
- `corporate` - Contenido corporativo y team building
- `general` - Material de referencia general

## 🎯 Uso en ClueQuest

Una vez ingestados, estos documentos:
- ✅ Aparecen en `/admin/kb` para gestión
- ✅ Se pueden buscar via `/api/kb/search`
- ✅ Inspiran generación de historias con garantías de originalidad
- ✅ Se integran automáticamente en el builder de aventuras

## ⚡ Estado actual

- [x] `example-adventure-guide.pdf` - Listo para ingestar
- [ ] Aplicar migración KB: `supabase db migrate`
- [ ] Ingestar primer documento: `node scripts/ingest-knowledge-base.mjs`