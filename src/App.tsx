import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderType, PaymentMethod, SliceOption } from './types/bakery';
import { BAKERY_PRODUCTS } from './data/products';
import { generateQRISPayload } from './services/paymentEngine';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { PaymentModal } from './components/PaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { Footer } from './components/Footer';

export default function App() {
  const [products] = useState<Product[]>(BAKERY_PRODUCTS);

  // Cart state persisted in localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aromakarsa_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders history persisted in localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('aromakarsa_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [pendingCheckoutData, setPendingCheckoutData] = useState<{
    orderType: OrderType;
    packagingOption: 'kraft' | 'gift_box';
    discountCode: string;
    discountAmount: number;
    subtotal: number;
    tax: number;
    packagingFee: number;
    total: number;
  } | null>(null);

  const [activePaymentOrder, setActivePaymentOrder] = useState<Order | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aromakarsa_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cartItems]);

  // Save orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aromakarsa_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders:', e);
    }
  }, [orders]);

  // Total items in cart
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    quantity: number,
    sliceOption: SliceOption = 'utuh',
    notes: string = ''
  ) => {
    setCartItems((prev) => {
      const existingKey = `${product.id}-${sliceOption}`;
      const existingIndex = prev.findIndex((item) => item.id === existingKey);

      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          quantity: copy[existingIndex].quantity + quantity,
          notes: notes || copy[existingIndex].notes,
        };
        return copy;
      } else {
        return [
          ...prev,
          {
            id: existingKey,
            product,
            quantity,
            sliceOption,
            notes,
          },
        ];
      }
    });
  };

  const handleQuickAdd = (product: Product) => {
    if (product.allowSliceOption) {
      // If product allows slicing preference, open detail modal so user can choose
      setSelectedProduct(product);
    } else {
      handleAddToCart(product, 1, 'utuh', '');
    }
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  // Checkout flow
  const handleProceedToCheckout = (orderData: {
    orderType: OrderType;
    packagingOption: 'kraft' | 'gift_box';
    discountCode: string;
    discountAmount: number;
    subtotal: number;
    tax: number;
    packagingFee: number;
    total: number;
  }) => {
    setPendingCheckoutData(orderData);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleConfirmOrder = (customerData: {
    name: string;
    phone: string;
    tableOrAddress: string;
    paymentMethod: PaymentMethod;
  }) => {
    if (!pendingCheckoutData) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AK-${randomSuffix}`;
    const dateNow = new Date();
    const barcodeValue = `AK-${randomSuffix}-${dateNow.getFullYear()}`;

    // Pure JavaScript QRIS Payload generation with EMVCo & CRC16
    const qrisPayload = generateQRISPayload(
      orderNumber,
      pendingCheckoutData.total,
      'TOKO ROTI AROMA KARSA',
      'JAKARTA'
    );

    const newOrder: Order = {
      id: `ord_${Date.now()}_${randomSuffix}`,
      orderNumber,
      items: [...cartItems],
      subtotal: pendingCheckoutData.subtotal,
      discount: pendingCheckoutData.discountAmount,
      discountCode: pendingCheckoutData.discountCode,
      tax: pendingCheckoutData.tax,
      packagingFee: pendingCheckoutData.packagingFee,
      total: pendingCheckoutData.total,
      customerName: customerData.name,
      customerPhone: customerData.phone,
      orderType: pendingCheckoutData.orderType,
      tableOrAddress: customerData.tableOrAddress,
      paymentMethod: customerData.paymentMethod,
      paymentStatus: 'pending',
      qrisPayload,
      barcodeValue,
      createdAt: dateNow.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setIsCheckoutOpen(false);
    setActivePaymentOrder(newOrder);
    setIsPaymentModalOpen(true);
  };

  // Payment completed
  const handlePaymentSuccess = (paidOrder: Order) => {
    // Add to orders history
    setOrders((prev) => [paidOrder, ...prev]);

    // Clear cart
    setCartItems([]);

    // Transition from payment modal to receipt modal
    setIsPaymentModalOpen(false);
    setActiveReceiptOrder(paidOrder);
    setIsReceiptModalOpen(true);
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2C241E]">
      {/* Strict 3-zone Top Bar Contract */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrderHistoryOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          onExplore={() => handleNavigateSection('koleksi-roti')}
        />

        {/* Product Catalog & Schedule */}
        <ProductCatalog
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAdd={handleQuickAdd}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Product Detail Customization Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Customer Checkout Modal */}
      {pendingCheckoutData && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          items={cartItems}
          orderType={pendingCheckoutData.orderType}
          subtotal={pendingCheckoutData.subtotal}
          discount={pendingCheckoutData.discountAmount}
          tax={pendingCheckoutData.tax}
          packagingFee={pendingCheckoutData.packagingFee}
          total={pendingCheckoutData.total}
          onConfirmOrder={handleConfirmOrder}
        />
      )}

      {/* Live Payment Modal (JavaScript QRIS & Barcode) */}
      <PaymentModal
        order={activePaymentOrder}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Digital Thermal Printable Receipt */}
      <ReceiptModal
        order={activeReceiptOrder}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        onNewOrder={() => {
          setIsReceiptModalOpen(false);
          handleNavigateSection('koleksi-roti');
        }}
      />

      {/* Order History Modal */}
      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        orders={orders}
        onViewReceipt={(ord) => {
          setIsOrderHistoryOpen(false);
          setActiveReceiptOrder(ord);
          setIsReceiptModalOpen(true);
        }}
      />
    </div>
  );
}
