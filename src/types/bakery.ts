export type ProductCategory = 'all' | 'sourdough' | 'pastry' | 'sweet_savory' | 'beverage';

export type SliceOption = 'utuh' | 'tipis_1cm' | 'standar_1.5cm' | 'tebal_2cm';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  image: string;
  description: string;
  fermentationHours?: number;
  batchTime: string;
  stock: number;
  isPopular?: boolean;
  isNewBatch?: boolean;
  ingredients: string[];
  allergens: string[];
  allowSliceOption: boolean;
}

export interface CartItem {
  id: string; // unique item cart key (productId + sliceOption)
  product: Product;
  quantity: number;
  sliceOption: SliceOption;
  notes?: string;
}

export type OrderType = 'takeaway' | 'dine_in' | 'delivery';

export type PaymentMethod = 'qris' | 'gopay' | 'ovo' | 'dana' | 'shopeepay';

export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'expired';

export interface Order {
  id: string;
  orderNumber: string; // e.g., "AK-9841"
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  tax: number; // 11% PPN
  packagingFee: number;
  total: number;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  tableOrAddress: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  qrisPayload: string;
  barcodeValue: string;
  createdAt: string;
  paidAt?: string;
}
