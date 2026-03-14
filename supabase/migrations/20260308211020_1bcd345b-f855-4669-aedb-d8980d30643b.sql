
-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  school TEXT DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create user_scores table for tracking scores per subject
CREATE TABLE public.user_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  questions_answered INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, subject)
);

ALTER TABLE public.user_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scores are viewable by everyone" ON public.user_scores FOR SELECT USING (true);
CREATE POLICY "Users can insert their own scores" ON public.user_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own scores" ON public.user_scores FOR UPDATE USING (auth.uid() = user_id);

-- Create leaderboard_entries view for easy querying with ranking
CREATE OR REPLACE VIEW public.leaderboard_ranked AS
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

-- Create a total scores view (sum across all subjects)
CREATE OR REPLACE VIEW public.leaderboard_total AS
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

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_scores_updated_at
  BEFORE UPDATE ON public.user_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
