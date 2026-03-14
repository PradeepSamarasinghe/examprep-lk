-- Store previous rank snapshots so we can compute rank changes
CREATE TABLE public.rank_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject text NOT NULL DEFAULT 'all',
  rank integer NOT NULL,
  recorded_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, subject)
);

ALTER TABLE public.rank_history ENABLE ROW LEVEL SECURITY;

-- Everyone can read rank history (needed for leaderboard display)
CREATE POLICY "Rank history is viewable by everyone"
  ON public.rank_history FOR SELECT
  USING (true);

-- Users can insert/update their own rank history
CREATE POLICY "Users can upsert own rank history"
  ON public.rank_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rank history"
  ON public.rank_history FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);