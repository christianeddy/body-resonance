
-- ============================================
-- BODY APP — Full Schema
-- ============================================

-- 1. PROFILES
CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  user_profile TEXT NOT NULL DEFAULT 'bienestar',
  onboarding_answers JSONB,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. PRACTICES (catalog)
CREATE TABLE public.practices (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  category TEXT NOT NULL,
  intention TEXT,
  technique TEXT,
  duration_estimated TEXT,
  intensity TEXT,
  media_mode TEXT NOT NULL DEFAULT 'visual',
  media_url TEXT,
  for_profile TEXT NOT NULL DEFAULT 'ambos',
  phases JSONB,
  tags JSONB,
  sort_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.practices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Practices are readable by authenticated users" ON public.practices FOR SELECT TO authenticated USING (true);

-- 3. PROGRAMS
CREATE TABLE public.programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  target_profile TEXT NOT NULL DEFAULT 'ambos',
  days JSONB NOT NULL DEFAULT '[]',
  max_days INTEGER NOT NULL DEFAULT 7
);

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Programs are readable by authenticated users" ON public.programs FOR SELECT TO authenticated USING (true);

-- 4. USER_PROGRAM_PROGRESS
CREATE TABLE public.user_program_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id TEXT NOT NULL REFERENCES public.programs(id),
  current_day INTEGER NOT NULL DEFAULT 1,
  completed_days JSONB NOT NULL DEFAULT '[]',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.user_program_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON public.user_program_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_program_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_program_progress FOR UPDATE USING (auth.uid() = user_id);

-- 5. SESSIONS
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_id TEXT,
  practice_name TEXT,
  duration_seconds INTEGER,
  feeling TEXT,
  ice_duration_minutes INTEGER,
  temperature TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON public.sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. SAVED_PRACTICES (favorites)
CREATE TABLE public.saved_practices (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_id TEXT NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, practice_id)
);

ALTER TABLE public.saved_practices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites" ON public.saved_practices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON public.saved_practices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.saved_practices FOR DELETE USING (auth.uid() = user_id);

-- 7. STORAGE BUCKET for audios
INSERT INTO storage.buckets (id, name, public) VALUES ('audios', 'audios', true);

CREATE POLICY "Audio files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'audios');
CREATE POLICY "Admins can upload audio files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'audios' AND auth.uid() IS NOT NULL);
