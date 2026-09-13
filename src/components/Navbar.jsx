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
  Store,
  LogOut,
  User,
} from 'lucide-react';
import { soundAlerts } from '../utils/soundAlerts';

export default function Navbar() {
  const { 
    authRole,
    authUser,
    logout,
    currentTab, 
    setCurrentTab, 
    cart, 
    orders, 
    vendor,
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
        
        {/* Brand */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-street-orange to-street-amber flex items-center justify-center text-white shadow-lg shadow-street-orange/20">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">StreetByte</span>
                {authUser && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-street-card text-slate-400 border border-street-border flex items-center gap-1">
                    <User className="w-2.5 h-2.5" />
                    {authUser.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Store className="w-3 h-3 text-street-amber" />
                <span>Active: <strong className="text-white">{vendor.shortName}</strong> ({vendor.stallNumber})</span>
              </p>
            </div>
          </div>

          {/* Mobile: audio (vendors) + logout */}
          <div className="flex items-center gap-1.5 md:hidden">
            {authRole === 'vendor' && (
              <button
                onClick={() => soundAlerts.playNewOrderChime()}
                title="Test Audio Chime"
                className="p-2 rounded-lg bg-street-card text-slate-400 hover:text-white border border-street-border"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={logout}
              title="Log Out"
              className="p-2 rounded-lg bg-street-card text-slate-400 hover:text-red-400 border border-street-border"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Queue Indicator — buyers only, desktop */}
        {authRole === 'buyer' && (
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
        )}

        {/* Tab Switcher — role-aware */}
        <div className="flex items-center gap-1.5 bg-street-surface p-1 rounded-xl border border-street-border w-full md:w-auto justify-center">

          {/* BUYER: single Order tab */}
          {authRole === 'buyer' && (
            <button
              onClick={() => setCurrentTab('customer')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'customer'
                  ? 'bg-street-orange text-white shadow-md shadow-street-orange/30'
                  : 'text-slate-300 hover:text-white hover:bg-street-card'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order</span>
              {totalCartCount > 0 && (
                <span className="bg-white text-street-charcoal font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>
          )}

          {/* VENDOR: Kitchen KDS + Counter QR tabs */}
          {authRole === 'vendor' && (
            <>
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
                  <span className="bg-street-amber text-street-charcoal font-black text-[10px] px-1.5 rounded-full flex items-center justify-center">
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
            </>
          )}

          {/* Reset Demo — always */}
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

          {/* Desktop logout */}
          <button
            onClick={logout}
            title="Log Out"
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-street-card transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </header>
  );
}
