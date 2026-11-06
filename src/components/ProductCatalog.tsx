import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types/bakery';
import { ProductCard } from './ProductCard';
import { Search, Flame, Clock, Award, Shield } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onSelectProduct,
  onQuickAdd,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'Semua Roti' },
    { id: 'sourdough', label: 'Sourdough Alami' },
    { id: 'pastry', label: 'Croissant & Pastry' },
    { id: 'sweet_savory', label: 'Roti Manis & Gurih' },
    { id: 'beverage', label: 'Minuman Barista' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div id="koleksi-roti" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E8DFD4] mb-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#C66526] mb-1">
            Menu Roti Segar Hari Ini
          </div>
          <h2 className="font-serif-bakery text-3xl sm:text-4xl font-bold text-[#2C241E]">
            Dipanggang Dengan Hati & Ragi Murni
          </h2>
          <p className="text-sm text-[#6B5E52] mt-1 max-w-xl">
            Semua roti diproduksi setiap subuh dalam jumlah terbatas untuk menjaga kerenyahan kerak dan kelembutan serat adonan.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <label htmlFor="search-input" className="sr-only">Cari jenis roti</label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7B6D]" />
          <input
            id="search-input"
            type="text"
            placeholder="Cari sourdough, croissant, abon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[#E8DFD4] bg-white focus:outline-none focus:border-[#C66526] placeholder:text-[#9C8F83] text-[#2C241E]"
          />
        </div>
      </div>

      {/* Interactive Category Segmented Tabs (Compliant with Section 1.A of design skill) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#F3ECE2] rounded-xl overflow-x-auto mb-8 border border-[#E8DFD4] scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-white text-[#2C241E] shadow-sm'
                  : 'text-[#6B5E52] hover:text-[#2C241E] hover:bg-white/50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-2xl border border-[#E8DFD4] p-8 max-w-md mx-auto">
          <p className="font-serif-bakery text-lg font-bold text-[#2C241E]">
            Roti yang Anda cari belum ditemukan
          </p>
          <p className="text-xs text-[#6B5E52] mt-1 mb-4">
            Coba gunakan kata kunci lain seperti "sourdough", "mentega", atau "pandan".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#C66526] rounded-lg hover:bg-[#B3561B] cursor-pointer"
          >
            Tampilkan Semua Roti
          </button>
        </div>
      )}

      {/* Oven Schedule Section */}
      <section id="jadwal-oven" className="mt-20 pt-12 border-t border-[#E8DFD4]">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#C66526] mb-1">
            Transparansi Dapur Pengrajin
          </div>
          <h3 className="font-serif-bakery text-2xl sm:text-3xl font-bold text-[#2C241E]">
            Jadwal Pemanggangan Oven Batu
          </h3>
          <p className="text-xs text-[#6B5E52] mt-1">
            Untuk memastikan Anda menerima roti dalam kondisi paling hangat dan renyah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFD4] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C66526]">
                Batch 1 (Pagi Subuh)
              </span>
              <span className="text-xs font-mono-receipt font-bold text-[#2C241E] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8DFD4]">
                06.30 WIB
              </span>
            </div>
            <h4 className="font-serif-bakery text-lg font-bold text-[#2C241E] mb-2">
              Sourdough & Baguette Tradisi
            </h4>
            <p className="text-xs text-[#6B5E52] leading-relaxed">
              Dipanggang dengan uap tinggi di lantai oven batu suhu 240°C untuk membentuk kerak tebal beraroma karamel gandum.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8DFD4] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C66526]">
                Batch 2 (Pagi Siang)
              </span>
              <span className="text-xs font-mono-receipt font-bold text-[#2C241E] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8DFD4]">
                08.30 WIB
              </span>
            </div>
            <h4 className="font-serif-bakery text-lg font-bold text-[#2C241E] mb-2">
              Croissant, Danishes & Pastry
            </h4>
            <p className="text-xs text-[#6B5E52] leading-relaxed">
              Laminasi adonan dingin mentega Prancis dipanggang dengan sirkulasi udara presisi hingga mekar sarang lebah sempurna.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8DFD4] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C66526]">
                Batch 3 (Sore Segar)
              </span>
              <span className="text-xs font-mono-receipt font-bold text-[#2C241E] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8DFD4]">
                14.00 WIB
              </span>
            </div>
            <h4 className="font-serif-bakery text-lg font-bold text-[#2C241E] mb-2">
              Roti Sobek, Brioche & Bun
            </h4>
            <p className="text-xs text-[#6B5E52] leading-relaxed">
              Batch kedua siap menemani waktu teh dan kopi sore dengan tekstur lembut yang tetap empuk hingga keesokan hari.
            </p>
          </div>
        </div>
      </section>

      {/* Story & Baker Philosophy Section */}
      <section id="cerita-baker" className="mt-20 p-8 sm:p-12 rounded-3xl bg-[#F3ECE2] border border-[#E8DFD4]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C66526] mb-2">
              Prinsip Tanpa Kompromi
            </div>
            <h3 className="font-serif-bakery text-2xl sm:text-3xl font-bold text-[#2C241E] mb-4">
              Kami Menolak Ragi Kimia Cepat & Pengawet Sintetis
            </h3>
            <p className="text-sm text-[#5C5046] leading-relaxed mb-6">
              Di Aroma Karsa, kami percaya roti terbaik membutuhkan waktu dan kesabaran. Setiap adonan kami biarkan beristirahat, menyerap air, dan terfermentasi secara alami oleh bakteri asam laktat liar. Hasilnya adalah roti dengan indeks glikemik lebih ramah cerna, aroma wangi asam buah yang khas, dan tekstur renyah yang tahan lama secara alami.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-[#C66526] shrink-0" />
                <span className="text-xs font-semibold text-[#2C241E]">0% Bahan Kimia</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-[#C66526] shrink-0" />
                <span className="text-xs font-semibold text-[#2C241E]">Oven Batu Refraktori</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-[#C66526] shrink-0" />
                <span className="text-xs font-semibold text-[#2C241E]">100% Halal & Murni</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 flex justify-center">
            <div className="bg-white p-6 rounded-2xl border border-[#E8DFD4] shadow-sm text-center max-w-xs">
              <p className="font-serif-bakery text-3xl font-bold text-[#C66526]">12+</p>
              <p className="text-xs font-bold text-[#2C241E] mt-1">Tahun Usia Starter Sourdough</p>
              <p className="text-[11px] text-[#7A6D60] mt-1 leading-relaxed">
                Kultur ragi aktif yang dirawat setiap hari sejak awal mula kedai kami berdiri.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
