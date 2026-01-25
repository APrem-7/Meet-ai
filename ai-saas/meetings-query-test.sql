-- Enhanced Meetings Query Test
-- This SQL demonstrates the query structure implemented in the meetings controller

-- Test query to fetch meetings with agent details and duration calculation
SELECT 
  -- Meeting fields
  m.id,
  m.name,
  m.user_id,
  m.agent_id,
  m.status,
  m.started_at,
  m.ended_at,
  m.transcript_url,
  m.recording_url,
  m.summary,
  m.created_at,
  m.updated_at,
  
  -- Agent fields (nested in application response)
  a.id as agent_id,
  a.name as agent_name,
  a.user_id as agent_user_id,
  a.instructions,
  a.created_at as agent_created_at,
  a.updated_at as agent_updated_at,
  
  -- Duration calculation in seconds
  EXTRACT(EPOCH FROM (m.ended_at - m.started_at)) as duration
  
FROM meetings m
INNER JOIN agents a ON m.agent_id = a.id
WHERE m.user_id = 'current_user_id'
  AND ($1 IS NULL OR m.name ILIKE '%' || $1 || '%')
ORDER BY m.created_at DESC
LIMIT $2 OFFSET $3;

-- Count query for pagination (with same JOIN logic)
SELECT COUNT(*) as count
FROM meetings m
INNER JOIN agents a ON m.agent_id = a.id
WHERE m.user_id = 'current_user_id'
  AND ($1 IS NULL OR m.name ILIKE '%' || $1 || '%');
