
-- Drop overly permissive products policies
DROP POLICY IF EXISTS "Products can be inserted by authenticated users" ON public.products;
DROP POLICY IF EXISTS "Products can be updated by authenticated users" ON public.products;
DROP POLICY IF EXISTS "Products can be deleted by authenticated users" ON public.products;

-- Admin/staff only insert
CREATE POLICY "Admin/staff can insert products"
ON public.products FOR INSERT TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'staff')
);

-- Admin/staff only update
CREATE POLICY "Admin/staff can update products"
ON public.products FOR UPDATE TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'staff')
);

-- Admin/staff only delete
CREATE POLICY "Admin/staff can delete products"
ON public.products FOR DELETE TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'staff')
);

-- Storage: allow admin/staff to upload to product-images bucket
CREATE POLICY "Admin/staff can upload product images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND (
    public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'staff')
  )
);

-- Storage: allow admin/staff to update/overwrite images
CREATE POLICY "Admin/staff can update product images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'product-images' AND (
    public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'staff')
  )
);

-- Storage: public read for product images
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'product-images');
