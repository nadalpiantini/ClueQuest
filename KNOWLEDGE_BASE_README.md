# 🧠 ClueQuest Knowledge Base + RAG System

## 🎯 Overview

ClueQuest now includes a **production-ready Knowledge Base with RAG (Retrieval-Augmented Generation)** system that enhances AI story generation with **enterprise-grade originality guarantees**. This integration allows ClueQuest to:

- ✅ Draw contextual inspiration from organizational knowledge
- ✅ Generate 100% original content with anti-plagiarism protection  
- ✅ Provide semantic search across documents
- ✅ Maintain multi-tenant data isolation
- ✅ Track originality metrics and usage analytics

## 🚀 Quick Start

### 1. Run Database Migration

```bash
# Apply the KB migration
supabase db migrate
```

### 2. Add Your First Document

```bash
# Basic document ingestion
node scripts/ingest-knowledge-base.mjs ./docs/team-building-guide.pdf "Team Building Activities"

# With full metadata
node scripts/ingest-knowledge-base.mjs \
  ./docs/escape-room-design.pdf \
  "Escape Room Design Guide" \
  --description "Comprehensive guide for designing engaging escape rooms" \
  --category adventure_ideas \
  --organization 12345678-1234-1234-1234-123456789012 \
  --public
```

### 3. Test the System

```bash
# Test semantic search
curl -X POST http://localhost:5173/api/kb/search \
  -H "Content-Type: application/json" \
  -d '{"query":"team building puzzle mechanics","limit":5}'

# Test KB-enhanced story generation
curl -X POST http://localhost:5173/api/ai/story-generator \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "Corporate Team Building",
    "tone": "professional", 
    "targetAudience": "professionals",
    "duration": 60,
    "maxPlayers": 8,
    "useKnowledgeBase": true,
    "originalityLevel": "strict"
  }'
```

### 4. Access Admin Dashboard

Visit: `http://localhost:5173/admin/kb`

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   PDF Upload    │───▶│  Text Chunking   │───▶│   Embeddings    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Story Request  │───▶│   RAG Context    │◀───│  Vector Search  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│ AI Generation   │───▶│ Originality      │
│ (DeepSeek)      │    │ Validation       │
└─────────────────┘    └──────────────────┘
```

## 📊 Features

### 🔍 Semantic Search
- Vector-based similarity search using OpenAI embeddings
- Multi-tenant filtering by organization
- Content categorization and filtering
- Rate limiting and performance optimization

### 🤖 RAG-Enhanced Generation
- Contextual inspiration from knowledge base
- Multi-attempt optimization for originality
- Enterprise-grade similarity detection
- Automatic source leakage prevention

### 🛡️ Originality Protection
- **Cosine similarity analysis** (< 82% threshold)
- **Jaccard 5-gram analysis** (< 18% phrase overlap)
- **Source leakage detection** (blocks URLs, citations)
- **Multi-attempt regeneration** until originality achieved

### 📈 Analytics & Monitoring
- Real-time usage tracking
- Originality score monitoring  
- Performance metrics dashboard
- Content category analytics

## 🔧 API Endpoints

### Search Knowledge Base
```bash
POST /api/kb/search
{
  "query": "team building activities",
  "organization_id": "optional-org-id", 
  "category": "corporate",
  "limit": 10,
  "similarity_threshold": 0.7
}
```

### Generate Original Content
```bash
POST /api/kb/generate
{
  "theme": "Corporate Mystery",
  "context": "Office environment, 1 hour, 8 people", 
  "generation_type": "team_building",
  "tone": "professional",
  "target_audience": "professionals",
  "organization_id": "your-org-id",
  "originality_level": "enterprise"
}
```

### Enhanced Story Generation
```bash
POST /api/ai/story-generator
{
  "theme": "Adventure Theme",
  "tone": "mysterious",
  "targetAudience": "adults", 
  "duration": 90,
  "maxPlayers": 6,
  "useKnowledgeBase": true,
  "organizationId": "your-org-id",
  "originalityLevel": "strict"
}
```

## 📁 File Structure

```
ClueQuest/
├── supabase/migrations/
│   └── 004_knowledge_base.sql          # KB database schema
├── src/lib/kb/
│   ├── embeddings.ts                   # Embedding utilities
│   ├── originality-guard.ts            # Anti-plagiarism system
│   └── story-integration.ts            # KB + Story integration
├── src/app/api/kb/
│   ├── search/route.ts                 # Semantic search endpoint
│   └── generate/route.ts               # Original content generation
├── src/app/admin/kb/
│   └── page.tsx                        # Admin dashboard
└── scripts/
    └── ingest-knowledge-base.mjs       # Document ingestion script
```

## ⚙️ Configuration

### Environment Variables
```env
# Existing ClueQuest vars
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_key
OPENAI_API_KEY=sk-your-openai-key

# The system reuses existing DeepSeek configuration
```

### Originality Levels

| Level | Cosine Threshold | Jaccard Threshold | Max Attempts |
|-------|------------------|-------------------|---------------|
| **standard** | < 82% | < 18% | 3 |
| **strict** | < 75% | < 15% | 4 |
| **enterprise** | < 70% | < 12% | 4+ |

### Content Categories

- `adventure_ideas` - Adventure concepts and storylines
- `puzzle_mechanics` - Puzzle designs and game mechanics  
- `story_frameworks` - Narrative structures and templates
- `educational` - Educational content and materials
- `corporate` - Corporate team building materials
- `general` - General reference material

## 🔒 Security & Compliance

### Multi-Tenant Security
- **Row Level Security (RLS)** on all KB tables
- **Organization-based data isolation** 
- **API key-based access control**
- **Rate limiting** to prevent abuse

### Originality Guarantees
- **Enterprise-grade similarity detection**
- **Source attribution blocking**
- **Multi-attempt optimization** 
- **Comprehensive audit logging**

### Performance Optimization  
- **25+ strategic database indexes**
- **Vector similarity optimization**
- **Batch embedding processing**
- **Intelligent caching strategies**

## 📊 Monitoring

### Admin Dashboard (`/admin/kb`)
- KB source management
- Search testing interface  
- Originality analytics
- Usage metrics and trends

### Key Metrics
- **Sources processed**: Total documents in KB
- **Active chunks**: Searchable content segments  
- **Originality score**: Average content uniqueness
- **Usage analytics**: Search and generation patterns

## 🚀 Production Deployment

### Prerequisites
1. **PostgreSQL with pgvector** (Supabase provides this)
2. **OpenAI API access** for embeddings
3. **Sufficient compute resources** for embedding generation

### Deployment Steps
```bash
# 1. Deploy database migration
supabase db push

# 2. Configure environment variables in Vercel
vercel env add OPENAI_API_KEY

# 3. Deploy application  
vercel --prod

# 4. Ingest initial documents
node scripts/ingest-knowledge-base.mjs ./docs/starter-pack.pdf "Starter Guide"
```

### Performance Considerations
- **Embedding costs**: ~$0.0001 per 1K tokens
- **Storage requirements**: ~2KB per chunk + 6KB embedding
- **Rate limits**: OpenAI embeddings (3,000 RPM)
- **Processing time**: ~1-2 seconds per chunk

## 💡 Usage Examples

### Corporate Training
```bash
# Upload training materials
node scripts/ingest-knowledge-base.mjs \
  ./training/leadership.pdf "Leadership Training" \
  --category corporate --organization $ORG_ID

# Generate team building activity
curl -X POST /api/kb/generate -d '{
  "theme": "Leadership Development", 
  "generation_type": "team_building",
  "organization_id": "'$ORG_ID'",
  "originality_level": "enterprise"
}'
```

### Educational Content  
```bash
# Upload curriculum
node scripts/ingest-knowledge-base.mjs \
  ./curriculum/science.pdf "Science Curriculum" \
  --category educational --public

# Generate educational adventure
curl -X POST /api/ai/story-generator -d '{
  "theme": "Scientific Discovery",
  "targetAudience": "students", 
  "useKnowledgeBase": true,
  "originalityLevel": "strict"
}'
```

## 🤝 Contributing

The Knowledge Base system follows ClueQuest's existing patterns:
- **Database**: Uses `cluequest_` table prefix
- **API**: Consistent with existing endpoint patterns
- **Security**: Integrates with existing RLS policies  
- **Architecture**: Follows ClueQuest's multi-tenant model

## 📞 Support

For issues and questions:
1. Check the **admin dashboard** (`/admin/kb`) for system status
2. Review **API endpoint health** (`GET /api/kb/search`)
3. Monitor **database logs** for processing issues
4. Verify **environment variables** are properly set

---

**🎉 Result**: ClueQuest now has enterprise-grade RAG capabilities with guaranteed originality - perfect for generating unique adventures while drawing inspiration from your organizational knowledge base!

*Built with the proven patterns from your original proposal, integrated seamlessly into ClueQuest's production-ready architecture.*