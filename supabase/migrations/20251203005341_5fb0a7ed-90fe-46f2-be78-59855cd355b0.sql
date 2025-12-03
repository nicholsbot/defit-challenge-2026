-- Create enum for cardio types
CREATE TYPE public.cardio_type AS ENUM ('run_walk_ruck', 'bike', 'swim', 'row_elliptical');

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'soldier');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  unit TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for USARC admin validation
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'soldier',
  UNIQUE (user_id, role)
);

-- Create cardio_logs table
CREATE TABLE public.cardio_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  cardio_type cardio_type NOT NULL,
  distance NUMERIC(10,2) NOT NULL,
  distance_unit TEXT NOT NULL DEFAULT 'miles',
  notes TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create strength_logs table
CREATE TABLE public.strength_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  exercise_name TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps_per_set INTEGER NOT NULL,
  weight_per_rep NUMERIC(10,2) NOT NULL,
  total_weight NUMERIC(12,2) NOT NULL,
  notes TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hiit_logs table
CREATE TABLE public.hiit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  duration INTEGER NOT NULL,
  description TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tmarm_logs table
CREATE TABLE public.tmarm_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  duration INTEGER NOT NULL,
  description TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cardio_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strength_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hiit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tmarm_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profile policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies (admins can manage, users can view own)
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Cardio logs policies
CREATE POLICY "Users can view own cardio logs" ON public.cardio_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cardio logs" ON public.cardio_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cardio logs" ON public.cardio_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cardio logs" ON public.cardio_logs FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all cardio logs" ON public.cardio_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update cardio logs" ON public.cardio_logs FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Strength logs policies
CREATE POLICY "Users can view own strength logs" ON public.strength_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own strength logs" ON public.strength_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own strength logs" ON public.strength_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own strength logs" ON public.strength_logs FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all strength logs" ON public.strength_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update strength logs" ON public.strength_logs FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- HIIT logs policies
CREATE POLICY "Users can view own hiit logs" ON public.hiit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own hiit logs" ON public.hiit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own hiit logs" ON public.hiit_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own hiit logs" ON public.hiit_logs FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all hiit logs" ON public.hiit_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update hiit logs" ON public.hiit_logs FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- TMARM logs policies
CREATE POLICY "Users can view own tmarm logs" ON public.tmarm_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tmarm logs" ON public.tmarm_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tmarm logs" ON public.tmarm_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tmarm logs" ON public.tmarm_logs FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all tmarm logs" ON public.tmarm_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update tmarm logs" ON public.tmarm_logs FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'soldier');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();