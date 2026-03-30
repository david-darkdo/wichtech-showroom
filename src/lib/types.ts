export type ProductCategory = 'Plumbing' | 'Paint' | 'Electrical' | 'Roofing';

export interface Product {
  id: string;
  product_name: string;
  item_code: string;
  price: number;
  category: ProductCategory;
  product_image: string | null;
  finished_result_image: string | null;
  full_details: string | null;
  related_tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product_name: string;
  item_code: string;
  price: number;
}
