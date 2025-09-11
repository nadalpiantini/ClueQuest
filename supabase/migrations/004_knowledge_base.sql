-- ClueQuest Knowledge Base & RAG System
-- Integrates seamlessly with existing ClueQuest architecture
-- Provides original content generation with anti-plagiarism guards

-- Enable vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- =============================================================================
-- KNOWLEDGE BASE CORE TABLES
-- =============================================================================

-- Knowledge sources (PDFs, documents, etc.)
CREATE TABLE cluequest_kb_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Source metadata
    title TEXT NOT NULL,
    description TEXT,
    source_type TEXT NOT NULL CHECK (source_type IN ('pdf', 'document', 'web_article', 'manual', 'guide')),
    source_url TEXT,
    file_path TEXT,
    file_size_bytes INTEGER,
    page_count INTEGER,
    
    -- Content analysis
    language TEXT DEFAULT 'en',
    topic_tags TEXT[],
    content_category TEXT, -- 'adventure_ideas', 'puzzle_mechanics', 'story_frameworks', 'educational', 'corporate'
    
    -- Processing status
    processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed', 'archived')),
    extraction_method TEXT DEFAULT 'pdf_parse',
    total_chunks INTEGER DEFAULT 0,
    
    -- Access control
    is_active BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT FALSE, -- Can be used across organizations
    license_type TEXT DEFAULT 'internal', -- 'internal', 'creative_commons', 'commercial'
    license_note TEXT,
    
    -- Usage tracking
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- Document chunks with embeddings for semantic search
CREATE TABLE cluequest_kb_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES cluequest_kb_sources(id) ON DELETE CASCADE,
    
    -- Chunk identification
    chunk_index INTEGER NOT NULL,
    chunk_type TEXT DEFAULT 'content' CHECK (chunk_type IN ('content', 'summary', 'outline', 'metadata')),
    
    -- Content
    content TEXT NOT NULL,
    content_length INTEGER,
    word_count INTEGER,
    
    -- Vector embedding for similarity search
    embedding vector(1536), -- OpenAI text-embedding-3-small dimensions
    
    -- Content analysis
    readability_score INTEGER, -- 0-100
    complexity_score INTEGER, -- 0-100  
    topic_relevance JSONB DEFAULT '{}', -- Topic scores
    
    -- Position context
    page_number INTEGER,
    section_title TEXT,
    preceding_context TEXT,
    following_context TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge base policies for originality control
CREATE TABLE cluequest_kb_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    
    -- Originality thresholds
    max_similarity_threshold DECIMAL(4,3) DEFAULT 0.82, -- Cosine similarity threshold
    max_jaccard_threshold DECIMAL(4,3) DEFAULT 0.18,    -- Jaccard similarity threshold
    min_originality_score INTEGER DEFAULT 75,            -- Minimum originality score (0-100)
    
    -- Content generation rules
    strict_originality BOOLEAN DEFAULT TRUE,
    block_source_disclosure BOOLEAN DEFAULT TRUE,
    require_attribution BOOLEAN DEFAULT FALSE,
    
    -- RAG parameters
    max_context_chunks INTEGER DEFAULT 8,
    similarity_threshold DECIMAL(4,3) DEFAULT 0.55,
    context_overlap_penalty DECIMAL(4,3) DEFAULT 0.1,
    
    -- Quality controls
    enable_content_filtering BOOLEAN DEFAULT TRUE,
    profanity_check BOOLEAN DEFAULT TRUE,
    fact_checking_level TEXT DEFAULT 'basic' CHECK (fact_checking_level IN ('none', 'basic', 'strict')),
    
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RAG generation sessions with originality tracking
CREATE TABLE cluequest_kb_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Link to story generation if applicable
    story_generation_id UUID REFERENCES cluequest_ai_story_generations(id) ON DELETE SET NULL,
    
    -- Query and intent
    query_text TEXT NOT NULL,
    generation_intent TEXT, -- 'story_inspiration', 'puzzle_mechanics', 'theme_research', 'educational_content'
    context_parameters JSONB DEFAULT '{}',
    
    -- RAG process
    retrieved_chunks_ids UUID[],
    context_used TEXT,
    context_similarity_scores DECIMAL(4,3)[],
    
    -- Generation results
    generated_content TEXT,
    content_structure JSONB DEFAULT '{}',
    
    -- Originality validation
    originality_score INTEGER, -- 0-100 (higher = more original)
    similarity_checks JSONB DEFAULT '[]', -- Details of similarity checks performed
    passed_originality_check BOOLEAN DEFAULT FALSE,
    regeneration_count INTEGER DEFAULT 0,
    
    -- AI provider details
    ai_provider TEXT DEFAULT 'openai',
    model_version TEXT,
    generation_cost DECIMAL(10,4),
    generation_time_ms INTEGER,
    tokens_used INTEGER,
    
    -- Status and quality
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'rejected')),
    quality_score INTEGER, -- 0-100
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    user_feedback TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Usage analytics for optimization
CREATE TABLE cluequest_kb_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    
    -- Analytics period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    analytics_type TEXT DEFAULT 'daily' CHECK (analytics_type IN ('hourly', 'daily', 'weekly', 'monthly')),
    
    -- Usage metrics
    total_queries INTEGER DEFAULT 0,
    successful_generations INTEGER DEFAULT 0,
    failed_generations INTEGER DEFAULT 0,
    average_originality_score DECIMAL(5,2),
    average_quality_score DECIMAL(5,2),
    
    -- Content analysis
    most_queried_topics JSONB DEFAULT '[]',
    popular_source_types JSONB DEFAULT '[]',
    query_length_distribution JSONB DEFAULT '{}',
    
    -- Performance metrics
    average_response_time_ms INTEGER,
    average_generation_cost DECIMAL(10,4),
    total_tokens_used INTEGER,
    
    -- Quality trends
    originality_trend JSONB DEFAULT '{}', -- Daily originality scores
    regeneration_rate DECIMAL(5,2),       -- % of generations requiring retry
    user_satisfaction_avg DECIMAL(3,2),
    
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- PERFORMANCE INDEXES (Optimized for ClueQuest patterns)
-- =============================================================================

-- Sources indexes
CREATE INDEX idx_kb_sources_org_active ON cluequest_kb_sources(organization_id, is_active) 
    WHERE is_active = TRUE;
CREATE INDEX idx_kb_sources_category ON cluequest_kb_sources(content_category, processing_status);
CREATE INDEX idx_kb_sources_user ON cluequest_kb_sources(user_id, created_at DESC);
CREATE INDEX idx_kb_sources_usage ON cluequest_kb_sources(usage_count DESC, last_used_at DESC);

-- Chunks indexes for vector search optimization
CREATE INDEX idx_kb_chunks_source ON cluequest_kb_chunks(source_id, chunk_index);
CREATE INDEX idx_kb_chunks_embedding_cosine ON cluequest_kb_chunks USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);
CREATE INDEX idx_kb_chunks_content_length ON cluequest_kb_chunks(content_length, word_count);

-- Generation tracking indexes
CREATE INDEX idx_kb_generations_org_recent ON cluequest_kb_generations(organization_id, created_at DESC);
CREATE INDEX idx_kb_generations_user ON cluequest_kb_generations(user_id, status, created_at DESC);
CREATE INDEX idx_kb_generations_story_link ON cluequest_kb_generations(story_generation_id) 
    WHERE story_generation_id IS NOT NULL;
CREATE INDEX idx_kb_generations_originality ON cluequest_kb_generations(originality_score DESC, passed_originality_check) 
    WHERE passed_originality_check = TRUE;

-- Analytics indexes
CREATE INDEX idx_kb_analytics_org_period ON cluequest_kb_analytics(organization_id, period_start, period_end);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all KB tables
ALTER TABLE cluequest_kb_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_kb_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_kb_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_kb_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_kb_analytics ENABLE ROW LEVEL SECURITY;

-- KB Sources: Organization members can manage their sources
CREATE POLICY "Organization members can manage KB sources" ON cluequest_kb_sources
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id 
            FROM cluequest_organization_members 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- Public sources can be read by all authenticated users
CREATE POLICY "Public KB sources are readable" ON cluequest_kb_sources
    FOR SELECT USING (is_public = TRUE AND is_active = TRUE);

-- KB Chunks: Follow source permissions
CREATE POLICY "KB chunks follow source permissions" ON cluequest_kb_chunks
    FOR SELECT USING (
        source_id IN (
            SELECT id FROM cluequest_kb_sources 
            WHERE organization_id IN (
                SELECT organization_id 
                FROM cluequest_organization_members 
                WHERE user_id = auth.uid() AND is_active = TRUE
            )
            OR (is_public = TRUE AND is_active = TRUE)
        )
    );

-- KB Policies: Organization admins can manage
CREATE POLICY "Organization admins can manage KB policies" ON cluequest_kb_policies
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id 
            FROM cluequest_organization_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin') 
            AND is_active = TRUE
        )
    );

-- KB Generations: Users can access their own generations
CREATE POLICY "Users can manage own KB generations" ON cluequest_kb_generations
    FOR ALL USING (
        user_id = auth.uid()
        OR organization_id IN (
            SELECT organization_id 
            FROM cluequest_organization_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin') 
            AND is_active = TRUE
        )
    );

-- =============================================================================
-- OPTIMIZED RPC FUNCTIONS
-- =============================================================================

-- Vector similarity search with originality guards
CREATE OR REPLACE FUNCTION match_kb_chunks_safe(
    query_embedding vector(1536),
    organization_id_param UUID,
    match_count int DEFAULT 8,
    similarity_threshold float DEFAULT 0.55
)
RETURNS TABLE (
    id UUID,
    source_id UUID,
    chunk_index INT,
    content TEXT,
    similarity FLOAT,
    source_title TEXT,
    content_category TEXT
)
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT
        c.id,
        c.source_id,
        c.chunk_index,
        c.content,
        1 - (c.embedding <=> query_embedding) AS similarity,
        s.title AS source_title,
        s.content_category
    FROM cluequest_kb_chunks c
    JOIN cluequest_kb_sources s ON c.source_id = s.id
    WHERE 1 - (c.embedding <=> query_embedding) >= similarity_threshold
    AND (
        s.organization_id = organization_id_param
        OR (s.is_public = TRUE AND s.is_active = TRUE)
    )
    AND s.is_active = TRUE
    AND s.processing_status = 'completed'
    ORDER BY c.embedding <=> query_embedding
    LIMIT match_count;
$$;

-- Get KB analytics dashboard
CREATE OR REPLACE FUNCTION get_kb_dashboard_data(org_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'sources_count', (
            SELECT COUNT(*) 
            FROM cluequest_kb_sources 
            WHERE organization_id = org_id AND is_active = TRUE
        ),
        'active_chunks', (
            SELECT COUNT(c.*) 
            FROM cluequest_kb_chunks c
            JOIN cluequest_kb_sources s ON c.source_id = s.id
            WHERE s.organization_id = org_id AND s.is_active = TRUE
        ),
        'recent_generations', (
            SELECT COUNT(*) 
            FROM cluequest_kb_generations 
            WHERE organization_id = org_id 
            AND created_at >= CURRENT_DATE - INTERVAL '7 days'
        ),
        'average_originality_score', (
            SELECT COALESCE(AVG(originality_score), 0)
            FROM cluequest_kb_generations 
            WHERE organization_id = org_id 
            AND passed_originality_check = TRUE
            AND created_at >= CURRENT_DATE - INTERVAL '30 days'
        ),
        'top_source_categories', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'category', content_category,
                    'count', source_count
                )
                ORDER BY source_count DESC
            ), '[]'::jsonb)
            FROM (
                SELECT content_category, COUNT(*) as source_count
                FROM cluequest_kb_sources 
                WHERE organization_id = org_id AND is_active = TRUE
                GROUP BY content_category
                LIMIT 5
            ) top_categories
        ),
        'quality_trends', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'date', generation_date,
                    'avg_originality', avg_originality
                )
                ORDER BY generation_date
            ), '[]'::jsonb)
            FROM (
                SELECT 
                    created_at::date as generation_date,
                    AVG(originality_score) as avg_originality
                FROM cluequest_kb_generations
                WHERE organization_id = org_id 
                AND created_at >= CURRENT_DATE - INTERVAL '14 days'
                GROUP BY created_at::date
            ) daily_quality
        )
    ) INTO result;

    RETURN result;
END;
$$;

-- Process new document for knowledge base
CREATE OR REPLACE FUNCTION process_kb_document(
    source_id_param UUID,
    chunks_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    chunk_record JSONB;
    chunks_inserted INTEGER := 0;
    total_words INTEGER := 0;
BEGIN
    -- Validate source exists and user has permission
    IF NOT EXISTS(
        SELECT 1 FROM cluequest_kb_sources 
        WHERE id = source_id_param 
        AND user_id = auth.uid()
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Source not found or access denied');
    END IF;
    
    -- Process each chunk
    FOR chunk_record IN SELECT value FROM jsonb_array_elements(chunks_data)
    LOOP
        INSERT INTO cluequest_kb_chunks (
            source_id,
            chunk_index,
            content,
            content_length,
            word_count,
            embedding,
            page_number,
            section_title
        ) VALUES (
            source_id_param,
            (chunk_record->>'chunk_index')::integer,
            chunk_record->>'content',
            length(chunk_record->>'content'),
            array_length(string_to_array(chunk_record->>'content', ' '), 1),
            (chunk_record->>'embedding')::vector,
            (chunk_record->>'page_number')::integer,
            chunk_record->>'section_title'
        );
        
        chunks_inserted := chunks_inserted + 1;
        total_words := total_words + array_length(string_to_array(chunk_record->>'content', ' '), 1);
    END LOOP;
    
    -- Update source status
    UPDATE cluequest_kb_sources
    SET 
        processing_status = 'completed',
        total_chunks = chunks_inserted,
        processed_at = NOW(),
        updated_at = NOW()
    WHERE id = source_id_param;
    
    RETURN jsonb_build_object(
        'success', true,
        'chunks_inserted', chunks_inserted,
        'total_words', total_words,
        'processing_completed', true
    );
END;
$$;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Update timestamps
CREATE TRIGGER update_kb_sources_updated_at 
    BEFORE UPDATE ON cluequest_kb_sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kb_policies_updated_at 
    BEFORE UPDATE ON cluequest_kb_policies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kb_generations_updated_at 
    BEFORE UPDATE ON cluequest_kb_generations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Track source usage
CREATE OR REPLACE FUNCTION track_kb_source_usage()
RETURNS TRIGGER AS $$
BEGIN
    -- Update usage count when chunks are retrieved in a generation
    IF array_length(NEW.retrieved_chunks_ids, 1) > 0 THEN
        UPDATE cluequest_kb_sources
        SET 
            usage_count = usage_count + 1,
            last_used_at = NOW(),
            updated_at = NOW()
        WHERE id IN (
            SELECT DISTINCT source_id 
            FROM cluequest_kb_chunks 
            WHERE id = ANY(NEW.retrieved_chunks_ids)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_track_kb_source_usage
    AFTER INSERT OR UPDATE ON cluequest_kb_generations
    FOR EACH ROW EXECUTE FUNCTION track_kb_source_usage();

-- =============================================================================
-- DEFAULT POLICIES AND SETTINGS
-- =============================================================================

-- Create default KB policy for existing organizations
INSERT INTO cluequest_kb_policies (organization_id, max_similarity_threshold, max_jaccard_threshold, min_originality_score)
SELECT 
    id,
    0.82,  -- Conservative similarity threshold
    0.18,  -- Conservative Jaccard threshold  
    75     -- Require 75% originality minimum
FROM cluequest_organizations
WHERE is_active = TRUE
ON CONFLICT DO NOTHING;

COMMENT ON SCHEMA public IS 'ClueQuest Knowledge Base & RAG System - Seamlessly integrated with existing architecture for original content generation with enterprise-grade originality controls.';