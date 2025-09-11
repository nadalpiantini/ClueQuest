-- Extend existing adventure system for templates
ALTER TABLE public.cluequest_adventures ADD COLUMN template_id TEXT;
ALTER TABLE public.cluequest_adventures ADD COLUMN is_template BOOLEAN DEFAULT FALSE;
ALTER TABLE public.cluequest_adventures ADD COLUMN template_metadata JSONB;

-- Template instantiation tracking
CREATE TABLE public.cluequest_template_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id TEXT NOT NULL,
    adventure_id UUID NOT NULL REFERENCES public.cluequest_adventures(id) ON DELETE CASCADE,
    customizations JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}'
);
