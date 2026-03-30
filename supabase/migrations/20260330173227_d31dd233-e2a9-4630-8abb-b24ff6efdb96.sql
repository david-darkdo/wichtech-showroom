-- Create enum for product categories
CREATE TYPE public.product_category AS ENUM ('Plumbing', 'Paint', 'Electrical', 'Roofing');

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  item_code TEXT NOT NULL UNIQUE,
  price NUMERIC NOT NULL,
  category product_category NOT NULL,
  product_image TEXT,
  finished_result_image TEXT,
  full_details TEXT,
  related_tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create users table for email capture
CREATE TABLE public.captured_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity logs table
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  user_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.captured_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Products: public read, admin write
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Products can be inserted by authenticated users" ON public.products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Products can be updated by authenticated users" ON public.products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Products can be deleted by authenticated users" ON public.products FOR DELETE TO authenticated USING (true);

-- Captured users: anyone can insert their email, authenticated can read
CREATE POLICY "Anyone can sign up email" ON public.captured_users FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can view users" ON public.captured_users FOR SELECT TO authenticated USING (true);

-- Activity logs: anyone can insert, authenticated can read
CREATE POLICY "Anyone can log activity" ON public.activity_logs FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can view logs" ON public.activity_logs FOR SELECT TO authenticated USING (true);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

CREATE POLICY "Product images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated users can upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Authenticated users can update product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated users can delete product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images');

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();