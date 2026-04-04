
-- Create admin role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Insert the admin role for the existing admin user
INSERT INTO public.user_roles (user_id, role) VALUES ('34c896fa-6057-403a-81ca-3892e4a92567', 'admin');

-- Create security definer function to check roles (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
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

-- RLS policy on user_roles itself: only admins can read
CREATE POLICY "Admins can read user_roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Now replace all overly permissive "Auth manage" policies on all 7 tables

-- blog_posts
DROP POLICY IF EXISTS "Auth manage blog_posts" ON public.blog_posts;
CREATE POLICY "Admin manage blog_posts" ON public.blog_posts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- contact_messages
DROP POLICY IF EXISTS "Auth manage contact_messages" ON public.contact_messages;
CREATE POLICY "Admin manage contact_messages" ON public.contact_messages
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- education
DROP POLICY IF EXISTS "Auth manage education" ON public.education;
CREATE POLICY "Admin manage education" ON public.education
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- experiences
DROP POLICY IF EXISTS "Auth manage experiences" ON public.experiences;
CREATE POLICY "Admin manage experiences" ON public.experiences
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- profiles
DROP POLICY IF EXISTS "Auth manage profiles" ON public.profiles;
CREATE POLICY "Admin manage profiles" ON public.profiles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- projects
DROP POLICY IF EXISTS "Auth manage projects" ON public.projects;
CREATE POLICY "Admin manage projects" ON public.projects
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- skill_categories
DROP POLICY IF EXISTS "Auth manage skill_categories" ON public.skill_categories;
CREATE POLICY "Admin manage skill_categories" ON public.skill_categories
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
