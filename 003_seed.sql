INSERT INTO public.cluequest_organizations (id, name, slug, description, settings, is_active) 
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Default Organization',
    'default-org',
    'Default organization for ClueQuest adventures',
    '{}',
    true
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.cluequest_achievements (id, name, description, points_reward, criteria, is_active)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'First Adventure', 'Complete your first adventure', 100, 'Complete any adventure', true),
    ('00000000-0000-0000-0000-000000000002', 'Speed Runner', 'Complete an adventure in record time', 200, 'Complete adventure in under 30 minutes', true),
    ('00000000-0000-0000-0000-000000000003', 'Team Player', 'Complete an adventure with a team', 150, 'Complete adventure as part of a team', true),
    ('00000000-0000-0000-0000-000000000004', 'Puzzle Master', 'Solve all puzzles in an adventure', 250, 'Solve all puzzle-type challenges', true),
    ('00000000-0000-0000-0000-000000000005', 'Explorer', 'Discover all hidden elements', 300, 'Find all hidden QR codes and AR elements', true)
ON CONFLICT (id) DO NOTHING;
