-- Extensión vector
create extension if not exists vector;

-- Fuentes (PDFs referenciados)
create table if not exists cluequest_kb_sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_url text,
  license_note text,
  created_at timestamptz default now()
);

-- Trozos + embeddings
create table if not exists cluequest_kb_chunks (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references cluequest_kb_sources(id) on delete cascade,
  chunk_index int,
  content text not null,
  embedding vector(1536),
  created_at timestamptz default now()
);

-- Política de originalidad
create table if not exists cluequest_policy (
  id boolean primary key default true,
  strict_originality boolean not null default true,
  block_source_disclosure boolean not null default true,
  max_similarity float not null default 0.82,
  created_at timestamptz default now()
);
insert into cluequest_policy (id) values (true)
on conflict (id) do nothing;

-- RPC de búsqueda vectorial (segura)
create or replace function match_kb_chunks(
  query_embedding vector(1536),
  match_count int default 5,
  similarity_threshold float default 0.75
)
returns table (
  id uuid,
  source_id uuid,
  chunk_index int,
  content text,
  similarity float
)
language sql stable
security definer
set search_path = public
as $$
  select
    c.id, c.source_id, c.chunk_index, c.content,
    1 - (c.embedding <=> query_embedding) as similarity
  from cluequest_kb_chunks c
  where 1 - (c.embedding <=> query_embedding) >= similarity_threshold
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

-- RLS (lees con anon/auth, insert sólo service-role via servidor)
alter table cluequest_kb_sources enable row level security;
alter table cluequest_kb_chunks enable row level security;
alter table cluequest_policy enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='cluequest_kb_sources' and policyname='read sources') then
    create policy "read sources" on cluequest_kb_sources for select to authenticated using (true);
    create policy "read sources anon" on cluequest_kb_sources for select to anon using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='cluequest_kb_chunks' and policyname='read chunks') then
    create policy "read chunks" on cluequest_kb_chunks for select to authenticated using (true);
    create policy "read chunks anon" on cluequest_kb_chunks for select to anon using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='cluequest_policy' and policyname='read policy') then
    create policy "read policy" on cluequest_policy for select to authenticated using (true);
    create policy "read policy anon" on cluequest_policy for select to anon using (true);
  end if;
end $$;

revoke all on function match_kb_chunks(vector,int,float) from public;
grant execute on function match_kb_chunks(vector,int,float) to anon, authenticated;
