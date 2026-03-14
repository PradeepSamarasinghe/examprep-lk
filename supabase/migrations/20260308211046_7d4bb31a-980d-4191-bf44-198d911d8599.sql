
-- Fix security definer views by recreating with security_invoker
CREATE OR REPLACE VIEW public.leaderboard_ranked
WITH (security_invoker=on) AS
SELECT 
  us.user_id,
  us.subject,
  us.score,
  us.questions_answered,
  us.correct_answers,
  p.display_name,
  p.school,
  p.avatar_url,
  RANK() OVER (PARTITION BY us.subject ORDER BY us.score DESC) as rank,
  us.updated_at
FROM public.user_scores us
JOIN public.profiles p ON us.user_id = p.user_id;

CREATE OR REPLACE VIEW public.leaderboard_total
WITH (security_invoker=on) AS
SELECT 
  us.user_id,
  SUM(us.score)::INTEGER as total_score,
  SUM(us.questions_answered)::INTEGER as total_questions,
  SUM(us.correct_answers)::INTEGER as total_correct,
  p.display_name,
  p.school,
  p.avatar_url,
  RANK() OVER (ORDER BY SUM(us.score) DESC) as rank
FROM public.user_scores us
JOIN public.profiles p ON us.user_id = p.user_id
GROUP BY us.user_id, p.display_name, p.school, p.avatar_url;
