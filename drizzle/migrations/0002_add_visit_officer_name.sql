ALTER TABLE public.visits ADD COLUMN IF NOT EXISTS officer_name text;
ALTER TABLE public.immunizations ADD COLUMN IF NOT EXISTS officer_name text;
ALTER TABLE public.children ADD COLUMN IF NOT EXISTS parent_username text;