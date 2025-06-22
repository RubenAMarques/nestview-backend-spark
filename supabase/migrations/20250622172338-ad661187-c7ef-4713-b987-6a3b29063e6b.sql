
-- Create status enum
CREATE TYPE public.listing_status AS ENUM ('pending', 'approved', 'need_fix', 'merged', 'rejected', 'expired');

-- Create users table (simplified profiles)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('admin', 'agent')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create listings table
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price_eur INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER,
  area_m2 NUMERIC,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  lat NUMERIC,
  lng NUMERIC,
  status listing_status NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create listing_prices table for price history
CREATE TABLE public.listing_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  price_eur INTEGER NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_favourites table
CREATE TABLE public.user_favourites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favourites ENABLE ROW LEVEL SECURITY;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    COALESCE(new.raw_user_meta_data ->> 'role', 'agent')
  );
  RETURN new;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to track price changes
CREATE OR REPLACE FUNCTION public.track_price_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert the new price into price history
  INSERT INTO public.listing_prices (listing_id, price_eur)
  VALUES (NEW.id, NEW.price_eur);
  
  RETURN NEW;
END;
$$;

-- Create trigger for price history
CREATE TRIGGER track_listing_price_changes
  AFTER UPDATE OF price_eur ON public.listings
  FOR EACH ROW 
  WHEN (OLD.price_eur IS DISTINCT FROM NEW.price_eur)
  EXECUTE FUNCTION public.track_price_changes();

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER STABLE
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

-- RLS Policies for users
CREATE POLICY "Users can view all users"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- RLS Policies for listings
CREATE POLICY "Public can view approved non-expired listings"
  ON public.listings FOR SELECT
  USING (
    status = 'approved' AND 
    (expires_at IS NULL OR expires_at > now())
  );

CREATE POLICY "Agents can create listings"
  ON public.listings FOR INSERT
  TO authenticated
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Agents can update own listings"
  ON public.listings FOR UPDATE
  TO authenticated
  USING (agent_id = auth.uid())
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Admins can update any listing"
  ON public.listings FOR UPDATE
  TO authenticated
  USING (public.get_current_user_role() = 'admin');

-- RLS Policies for listing_prices
CREATE POLICY "Anyone can view listing price history"
  ON public.listing_prices FOR SELECT
  USING (true);

-- RLS Policies for user_favourites
CREATE POLICY "Users can manage own favourites"
  ON public.user_favourites FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create storage bucket for listing photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-photos', 'listing-photos', true);

-- Storage policy for public read access
CREATE POLICY "Anyone can view listing photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-photos');

CREATE POLICY "Authenticated users can upload listing photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'listing-photos');

CREATE POLICY "Users can manage own listing photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'listing-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own listing photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'listing-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create indexes
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_agent_id ON public.listings(agent_id);
CREATE INDEX idx_listings_expires_at ON public.listings(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_user_favourites_user_id ON public.user_favourites(user_id);
CREATE INDEX idx_listing_prices_listing_id ON public.listing_prices(listing_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_listings_updated_at 
  BEFORE UPDATE ON public.listings 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Finally: Grant UPDATE(status) permission to authenticated users
GRANT UPDATE(status) ON public.listings TO authenticated;
