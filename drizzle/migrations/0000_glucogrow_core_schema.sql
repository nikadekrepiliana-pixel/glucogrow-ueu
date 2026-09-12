-- ROLES
CREATE TYPE public.app_role AS ENUM ('super_admin', 'health_worker', 'parent');

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  full_name text,
  phone text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','health_worker'))
$$;

-- profiles policies
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "staff read profiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "super admin manage profiles" ON public.profiles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin')) WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- user_roles policies
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "super admin read roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

-- CHILDREN
CREATE TABLE public.children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nik text UNIQUE,
  name text NOT NULL,
  birth_place text,
  dob date NOT NULL,
  gender text NOT NULL DEFAULT 'L',
  parent_name text,
  parent_phone text,
  parent_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.children TO authenticated;
GRANT ALL ON public.children TO service_role;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff read children" ON public.children FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "parent read own children" ON public.children FOR SELECT TO authenticated USING (parent_user_id = auth.uid());
CREATE POLICY "staff insert children" ON public.children FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff update children" ON public.children FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "super admin delete children" ON public.children FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

-- VISITS
CREATE TABLE public.visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  visit_date date NOT NULL DEFAULT current_date,
  visit_type text NOT NULL DEFAULT 'baru',
  purpose text NOT NULL,
  age_months integer,
  height numeric(5,2),
  weight numeric(5,2),
  head_circumference numeric(5,2),
  status text,
  findings text,
  notes text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX visits_child_idx ON public.visits (child_id, visit_date DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.visits TO authenticated;
GRANT ALL ON public.visits TO service_role;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff read visits" ON public.visits FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "parent read own child visits" ON public.visits FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.children c WHERE c.id = visits.child_id AND c.parent_user_id = auth.uid()));
CREATE POLICY "staff insert visits" ON public.visits FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff update visits" ON public.visits FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "super admin delete visits" ON public.visits FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

-- IMMUNIZATIONS
CREATE TABLE public.immunizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  visit_id uuid REFERENCES public.visits(id) ON DELETE SET NULL,
  vaccine_name text NOT NULL,
  dose_number integer NOT NULL DEFAULT 1,
  given_date date NOT NULL DEFAULT current_date,
  notes text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX immunizations_child_idx ON public.immunizations (child_id, given_date DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.immunizations TO authenticated;
GRANT ALL ON public.immunizations TO service_role;
ALTER TABLE public.immunizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff read imm" ON public.immunizations FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "parent read own child imm" ON public.immunizations FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.children c WHERE c.id = immunizations.child_id AND c.parent_user_id = auth.uid()));
CREATE POLICY "staff insert imm" ON public.immunizations FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff update imm" ON public.immunizations FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "super admin delete imm" ON public.immunizations FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

-- NEW USER TRIGGER (default role: parent)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_username text;
  v_role public.app_role;
BEGIN
  v_username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
  INSERT INTO public.profiles (id, username, full_name, phone)
  VALUES (NEW.id, v_username, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'phone')
  ON CONFLICT (id) DO NOTHING;

  BEGIN
    v_role := COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'parent');
  EXCEPTION WHEN others THEN
    v_role := 'parent';
  END;
  IF v_role NOT IN ('parent','health_worker','super_admin') THEN
    v_role := 'parent';
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, v_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();