import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { formatNaira } from '../../utils/etaCalculator';
import { 
  Plus, 
  Flame, 
  Clock, 
  Search, 
  SlidersHorizontal,
  Beef,
  Utensils,
  Coffee,
  Sparkles
} from 'lucide-react';
import CustomizationModal from './CustomizationModal';

const ICON_MAP = {
  Flame: Flame,
  Beef: Beef,
  Utensils: Utensils,
  Coffee: Coffee,
  Sparkles: Sparkles,
};

export default function MenuCatalog() {
  const { vendor, addToCart, stockMap } = useOrders();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customizingItem, setCustomizingItem] = useState(null);

  const categories = vendor.categories || [];
  const menuItems = vendor.menuItems || [];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleItemClick = (item) => {
    const isOut = stockMap[item.id] === true;
    if (isOut) return;

    if (item.customizable) {
      setCustomizingItem(item);
    } else {
      addToCart(item, 1, null);
    }
  };

  return (
    <div>
      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
        
        {/* Horizontal Category Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || Flame;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-street-orange text-white shadow-md shadow-street-orange/20'
                    : 'bg-street-card text-slate-400 hover:text-white border border-street-border'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${vendor.shortName} menu...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-street-card border border-street-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-street-orange"
          />
        </div>

      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isSoldOut = stockMap[item.id] === true;

          return (
            <div
              key={item.id}
              className={`bg-street-surface border rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 group relative ${
                isSoldOut 
                  ? 'opacity-50 border-street-border' 
                  : 'border-street-border/80 hover:border-street-orange/50 hover:shadow-lg hover:shadow-street-orange/5'
              }`}
            >
              {/* Top Row: Food Emoji & Badges */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-200">
                    {item.image}
                  </span>

                  <div className="flex flex-col items-end gap-1">
                    {isSoldOut ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-street-red/20 text-street-red border border-street-red/30 uppercase tracking-wide">
                        Sold Out
                      </span>
                    ) : (
                      <>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-street-orange/20 text-street-orange border border-street-orange/30">
                            {item.badge}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <Clock className="w-3 h-3 text-street-amber" />
                          {item.prepTime}m prep
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h4 className="font-bold text-white text-base leading-snug mb-1">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Bottom Row: Price & Action */}
              <div className="pt-3 border-t border-street-border/60 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Price</span>
                  <span className="text-base font-black text-white tracking-tight">
                    {formatNaira(item.price)}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isSoldOut}
                  onClick={() => handleItemClick(item)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSoldOut
                      ? 'bg-street-card text-slate-500 cursor-not-allowed'
                      : item.customizable
                        ? 'bg-street-card text-white hover:bg-street-orange hover:text-white border border-street-border hover:border-street-orange'
                        : 'bg-street-orange text-white hover:brightness-110 shadow-md shadow-street-orange/20'
                  }`}
                >
                  {item.customizable ? (
                    <>
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Customize</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Customization Modal */}
      {customizingItem && (
        <CustomizationModal
          item={customizingItem}
          isOpen={Boolean(customizingItem)}
          onClose={() => setCustomizingItem(null)}
          onConfirm={(item, qty, customizations) => {
            addToCart(item, qty, customizations);
          }}
        />
      )}
    </div>
  );
}
