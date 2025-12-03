-- Create enum for unit categories
CREATE TYPE public.unit_category AS ENUM ('veterans', 'government', 'military_family', 'civilian', 'other');

-- Add unit_category column to profiles
ALTER TABLE public.profiles 
ADD COLUMN unit_category unit_category DEFAULT 'other';

-- Create index for efficient unit aggregation queries
CREATE INDEX idx_profiles_unit ON public.profiles(unit) WHERE unit IS NOT NULL;
CREATE INDEX idx_profiles_unit_category ON public.profiles(unit_category);