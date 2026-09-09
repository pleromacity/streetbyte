import React from 'react';
import { useOrders } from '../../context/OrderContext';
import { calculateQueueMetrics } from '../../utils/etaCalculator';
import { 
  Flame, 
  Store, 
  Clock, 
  Star, 
  CheckCircle2, 
  Users,
  ChevronRight
} from 'lucide-react';

export default function VendorDiscovery() {
  const { 
    vendors, 
    selectedVendorId, 
    setSelectedVendorId, 
    orders, 
    rushBufferMap 
  } = useOrders();

  return (
    <div className="mb-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-street-orange" />
          <h3 className="font-extrabold text-white text-sm tracking-tight uppercase">
            StreetByte Food Hub • Select A Stall ({vendors.length} Vendors Active)
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">
          Tap stall to switch menus & live queues
        </span>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {vendors.map((v) => {
          const isSelected = selectedVendorId === v.id;
          
          // Filter orders for this specific stall
          const stallOrders = orders.filter(o => o.vendorId === v.id);
          const stallBuffer = rushBufferMap[v.id] || 0;
          const metrics = calculateQueueMetrics(stallOrders, stallBuffer, v.walkingDistanceMinutes);

          return (
            <div
              key={v.id}
              onClick={() => setSelectedVendorId(v.id)}
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-street-card border-street-orange shadow-xl shadow-street-orange/10 glow-orange'
                  : 'bg-street-surface border-street-border hover:border-slate-600 hover:bg-street-card/60'
              }`}
            >
              {/* Active checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 bg-street-orange text-white rounded-full p-1 shadow-md animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}

              <div>
                {/* Stall Number & Cuisine */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-street-charcoal text-street-amber border border-street-border">
                    {v.stallNumber}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {v.cuisine}
                  </span>
                </div>

                {/* Vendor Name & Emoji */}
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-3xl filter drop-shadow">{v.image}</span>
                  <div>
                    <h4 className="font-extrabold text-white text-base leading-tight">
                      {v.name}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {v.tagline}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Real-time Queue Pill */}
              <div className="mt-3 pt-3 border-t border-street-border/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-street-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-street-green"></span>
                  </span>
                  <span className="font-semibold">{metrics.queueLength} in line</span>
                  <span className="text-slate-500">•</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3 text-street-amber" />
                    <strong>~{metrics.estimatedWaitMinutes}m wait</strong>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-street-amber font-bold text-xs">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{v.rating}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
