import React from 'react';
import { useOrders } from '../context/OrderContext';
import { calculateQueueMetrics } from '../utils/etaCalculator';
import { 
  Flame, 
  ShoppingBag, 
  ChefHat, 
  QrCode, 
  RotateCcw,
  Clock,
  Volume2,
  Store
} from 'lucide-react';
import { soundAlerts } from '../utils/soundAlerts';

export default function Navbar() {
  const { 
    currentTab, 
    setCurrentTab, 
    cart, 
    orders, 
    vendor,
    vendors,
    selectedVendorId,
    setSelectedVendorId,
    rushBufferMap,
    resetDemoData 
  } = useOrders();

  const stallBuffer = rushBufferMap[vendor.id] || 0;
  const metrics = calculateQueueMetrics(
    orders.filter(o => o.vendorId === vendor.id), 
    stallBuffer, 
    vendor.walkingDistanceMinutes
  );

  const totalCartCount = cart.reduce((acc, c) => acc + c.quantity, 0);
  const activeKitchenCount = orders.filter(o => o.status === 'incoming' || o.status === 'preparing').length;

  return (
    <header className="sticky top-0 z-40 bg-street-charcoal/95 backdrop-blur-md border-b border-street-border/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Active Stall Indicator */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-street-orange to-street-amber flex items-center justify-center text-white shadow-lg shadow-street-orange/20">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">StreetByte</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-street-orange/20 text-street-orange border border-street-orange/30">
                  TechOff '26
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Store className="w-3 h-3 text-street-amber" />
                <span>Active: <strong className="text-white">{vendor.shortName}</strong> ({vendor.stallNumber})</span>
              </p>
            </div>
          </div>

          {/* Mobile Sound Test Button */}
          <button
            onClick={() => soundAlerts.playNewOrderChime()}
            title="Test Audio Chime"
            className="md:hidden p-2 rounded-lg bg-street-card text-slate-400 hover:text-white border border-street-border"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Live Stall Queue Indicator */}
        <div className="hidden lg:flex items-center gap-3 bg-street-card/80 px-3.5 py-1.5 rounded-full border border-street-border text-xs">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-street-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-street-green"></span>
            </span>
            <span className="text-slate-300 font-medium">{vendor.shortName} Queue:</span>
            <span className="font-bold text-white">{metrics.queueLength} orders</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-street-amber" />
            <span>Wait: <strong className="text-white">{metrics.estimatedWaitMinutes}m</strong></span>
          </div>
          {stallBuffer > 0 && (
            <span className="bg-street-red/20 text-street-red font-semibold px-2 py-0.5 rounded-full text-[11px] border border-street-red/30">
              +{stallBuffer}m Rush Buffer
            </span>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-street-surface p-1 rounded-xl border border-street-border w-full md:w-auto justify-center">
          <button
            onClick={() => setCurrentTab('customer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'customer'
                ? 'bg-street-orange text-white shadow-md shadow-street-orange/30'
                : 'text-slate-300 hover:text-white hover:bg-street-card'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Hub</span>
            {totalCartCount > 0 && (
              <span className="bg-white text-street-charcoal font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('kitchen')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
              currentTab === 'kitchen'
                ? 'bg-street-card text-street-amber border border-street-amber/40 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-street-card'
            }`}
          >
            <ChefHat className="w-4 h-4 text-street-amber" />
            <span>Kitchen KDS</span>
            {activeKitchenCount > 0 && (
              <span className="bg-street-amber text-street-charcoal font-black text-[10px] px-1.5 py-0.2 rounded-full flex items-center justify-center">
                {activeKitchenCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('qr')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'qr'
                ? 'bg-street-card text-white border border-street-border'
                : 'text-slate-300 hover:text-white hover:bg-street-card'
            }`}
          >
            <QrCode className="w-4 h-4 text-slate-400" />
            <span>Counter QR</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset demo orders and queue back to default?')) {
                resetDemoData();
              }
            }}
            title="Reset Demo Data"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-street-card transition-colors ml-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
}
