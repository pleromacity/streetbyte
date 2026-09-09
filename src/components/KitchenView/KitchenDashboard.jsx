import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { formatNaira } from '../../utils/etaCalculator';
import { 
  Flame, 
  CheckCircle2, 
  Clock, 
  Volume2, 
  Store,
  Sliders,
  Check, 
  ShieldCheck, 
  Megaphone,
  ShoppingBag,
  Layers,
  Sparkles
} from 'lucide-react';
import { soundAlerts } from '../../utils/soundAlerts';

export default function KitchenDashboard() {
  const { 
    vendors,
    orders, 
    updateOrderStatus, 
    rushBufferMap, 
    setRushBuffer, 
    stockMap, 
    toggleItemStock 
  } = useOrders();

  const [activeVendorFilter, setActiveVendorFilter] = useState('musa-suya'); // 'musa-suya' | 'mama-blessing' | 'all'
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'stock'

  // Filter orders
  const currentStallOrders = activeVendorFilter === 'all'
    ? orders
    : orders.filter(o => o.vendorId === activeVendorFilter);

  const incomingOrders = currentStallOrders.filter(o => o.status === 'incoming');
  const preparingOrders = currentStallOrders.filter(o => o.status === 'preparing');
  const readyOrders = currentStallOrders.filter(o => o.status === 'ready');
  const completedOrders = currentStallOrders.filter(o => o.status === 'completed');

  // Active vendor details
  const activeVendorObj = vendors.find(v => v.id === activeVendorFilter);
  const currentBuffer = activeVendorFilter !== 'all' ? (rushBufferMap[activeVendorFilter] || 0) : 0;

  // Daily Shift Metrics for filtered view
  const totalRevenue = currentStallOrders.reduce((acc, o) => acc + (o.paymentStatus === 'PAID_VERIFIED' ? o.total : 0), 0);
  const totalCompleted = completedOrders.length + readyOrders.length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Stall Switcher & Shift Metrics */}
      <div className="bg-street-card border border-street-border rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Stall Selector */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-street-orange/20 border border-street-orange/40 text-street-orange flex items-center justify-center text-2xl font-black">
            {activeVendorObj ? activeVendorObj.image : '🏪'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-white text-lg tracking-tight">
                {activeVendorObj ? `${activeVendorObj.name} (${activeVendorObj.stallNumber})` : 'StreetByte Master Hub KDS'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-street-green/20 text-street-green border border-street-green/30">
                LIVE
              </span>
            </div>
            
            {/* Quick Stall Switcher Dropdown / Pills */}
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[11px] font-bold text-slate-400">Viewing Kitchen:</span>
              {vendors.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVendorFilter(v.id)}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all ${
                    activeVendorFilter === v.id
                      ? 'bg-street-orange text-white'
                      : 'bg-street-charcoal text-slate-400 hover:text-white border border-street-border'
                  }`}
                >
                  {v.shortName}
                </button>
              ))}
              <button
                onClick={() => setActiveVendorFilter('all')}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  activeVendorFilter === 'all'
                    ? 'bg-street-amber text-street-charcoal'
                    : 'bg-street-charcoal text-slate-400 hover:text-white border border-street-border'
                }`}
              >
                All Stalls (Plus)
              </button>
            </div>
          </div>
        </div>

        {/* Quick Shift Summary */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="bg-street-surface px-3 py-2 rounded-xl border border-street-border text-center min-w-[100px]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Stall Sales</span>
            <span className="text-sm font-black text-white block">{formatNaira(totalRevenue)}</span>
          </div>

          <div className="bg-street-surface px-3 py-2 rounded-xl border border-street-border text-center min-w-[90px]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Fulfillments</span>
            <span className="text-sm font-black text-street-green block">{totalCompleted} Orders</span>
          </div>

          <div className="bg-street-surface px-3 py-2 rounded-xl border border-street-border text-center min-w-[90px]">
            <span className="text-[10px] uppercase font-bold text-slate-400">In Line</span>
            <span className="text-sm font-black text-street-amber block">
              {incomingOrders.length + preparingOrders.length}
            </span>
          </div>
        </div>

      </div>

      {/* Pacing Regulator & Mode Toggles */}
      <div className="bg-street-surface border border-street-border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Rush buffer controls for this stall */}
        {activeVendorFilter !== 'all' ? (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-street-amber" /> {activeVendorObj?.shortName} Rush Buffer:
            </span>

            <button
              onClick={() => setRushBuffer(activeVendorFilter, 0)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentBuffer === 0
                  ? 'bg-street-green text-white shadow-md'
                  : 'bg-street-card text-slate-400 hover:text-white border border-street-border'
              }`}
            >
              Normal (0m)
            </button>

            <button
              onClick={() => setRushBuffer(activeVendorFilter, 5)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentBuffer === 5
                  ? 'bg-street-amber text-street-charcoal shadow-md'
                  : 'bg-street-card text-slate-400 hover:text-white border border-street-border'
              }`}
            >
              +5m Rush Buffer
            </button>

            <button
              onClick={() => setRushBuffer(activeVendorFilter, 10)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentBuffer === 10
                  ? 'bg-street-red text-white shadow-md'
                  : 'bg-street-card text-slate-400 hover:text-white border border-street-border'
              }`}
            >
              +10m Heavy Rush
            </button>
          </div>
        ) : (
          <div className="text-xs text-slate-400">
            Showing aggregate kitchen pipeline for all food stalls. Select a specific stall to adjust rush pacing.
          </div>
        )}

        {/* View mode toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pipeline'
                ? 'bg-street-orange text-white'
                : 'bg-street-card text-slate-400 hover:text-white border border-street-border'
            }`}
          >
            Live Pipeline
          </button>

          {activeVendorFilter !== 'all' && (
            <button
              onClick={() => setActiveTab('stock')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'stock'
                  ? 'bg-street-orange text-white'
                  : 'bg-street-card text-slate-400 hover:text-white border border-street-border'
              }`}
            >
              Stall Stock Toggles
            </button>
          )}
        </div>

      </div>

      {/* Mode 1: 3-Column Pipeline */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Column 1: Incoming / Paid */}
          <div className="bg-street-card/80 border border-street-border rounded-2xl p-4 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-street-border mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-street-amber animate-pulse"></span>
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                  Incoming & Paid
                </h3>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-street-amber/20 text-street-amber border border-street-amber/30">
                {incomingOrders.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {incomingOrders.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500 text-xs">
                  <span>No new incoming orders for this stall</span>
                </div>
              ) : (
                incomingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-street-surface border-2 border-street-amber/60 rounded-2xl p-4 shadow-lg flex flex-col justify-between gap-3 animate-fadeIn"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-2xl font-black text-white">
                          #{order.id}
                        </span>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-street-green/20 text-street-green border border-street-green/30">
                            {order.paymentRef}
                          </span>
                          <span className="text-[10px] text-street-amber font-bold mt-0.5">
                            {order.stallNumber}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs font-bold text-slate-200">
                        {order.customerName}
                      </p>

                      {/* Items */}
                      <div className="mt-2.5 space-y-1.5 pt-2 border-t border-street-border">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="text-xs">
                            <div className="flex justify-between font-bold text-white">
                              <span>{it.quantity}x {it.name}</span>
                            </div>
                            {it.spice && (
                              <div className="text-[11px] text-street-amber font-semibold">
                                🔥 {it.spice} • 🧅 {it.onions} • 📦 {it.packaging}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-street-orange to-street-amber text-white font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-street-orange/20 flex items-center justify-center gap-2"
                    >
                      <Flame className="w-4 h-4" />
                      <span>Start Kitchen Preparation</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 2: In the Kitchen / Cooking */}
          <div className="bg-street-card/80 border border-street-border rounded-2xl p-4 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-street-border mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-street-orange animate-pulse"></span>
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                  Cooking / Preparing
                </h3>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-street-orange/20 text-street-orange border border-street-orange/30">
                {preparingOrders.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {preparingOrders.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500 text-xs">
                  <span>Kitchen capacity free</span>
                </div>
              ) : (
                preparingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-street-surface border-2 border-street-orange rounded-2xl p-4 shadow-xl flex flex-col justify-between gap-3 glow-orange animate-fadeIn"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-2xl font-black text-white">
                          #{order.id}
                        </span>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-street-orange/20 text-street-orange border border-street-orange/30 flex items-center gap-1">
                            <Flame className="w-3 h-3" /> Preparing
                          </span>
                          <span className="text-[10px] text-street-amber font-bold mt-0.5">
                            {order.stallNumber}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs font-bold text-slate-200">
                        {order.customerName}
                      </p>

                      <div className="mt-2.5 space-y-1.5 pt-2 border-t border-street-border">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="text-xs">
                            <div className="flex justify-between font-bold text-white">
                              <span>{it.quantity}x {it.name}</span>
                            </div>
                            {it.spice && (
                              <div className="text-[11px] text-street-amber font-semibold">
                                🔥 {it.spice} • 🧅 {it.onions} • 📦 {it.packaging}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                      <Megaphone className="w-4 h-4" />
                      <span>Pack & Announce Ready!</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 3: Ready for Pickup */}
          <div className="bg-street-card/80 border border-street-border rounded-2xl p-4 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-street-border mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-street-green animate-pulse"></span>
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                  Ready at Counter
                </h3>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-street-green/20 text-street-green border border-street-green/30">
                {readyOrders.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {readyOrders.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500 text-xs">
                  <span>No orders waiting at counter</span>
                </div>
              ) : (
                readyOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-street-surface border-2 border-street-green rounded-2xl p-4 shadow-xl flex flex-col justify-between gap-3 glow-green animate-fadeIn"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div>
                          <span className="font-mono text-3xl font-black text-street-green">
                            #{order.id}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {order.stallNumber} • {order.vendorName}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            soundAlerts.playReadyChime();
                            soundAlerts.speakAnnouncement(`Order ${order.id.replace('-', ' ')} is ready for pickup at ${order.stallNumber}!`);
                          }}
                          title="Ring Bell & Announce Voice Again"
                          className="p-2 rounded-xl bg-street-green/20 text-street-green border border-street-green/30 hover:bg-street-green hover:text-white"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs font-bold text-white">
                        {order.customerName}
                      </p>

                      <div className="mt-2 text-xs text-slate-400">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="w-full py-2.5 px-3 rounded-xl bg-street-card border border-street-border text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-street-surface hover:text-white flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4 text-street-green" />
                      <span>Customer Collected (Done)</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* Mode 2: Dynamic Stock Toggles for Active Vendor */}
      {activeTab === 'stock' && activeVendorObj && (
        <div className="bg-street-card border border-street-border rounded-2xl p-6 shadow-xl">
          <div className="mb-4">
            <h3 className="font-bold text-white text-base">
              {activeVendorObj.name} • Stock & Availability
            </h3>
            <p className="text-xs text-slate-400">
              1-tap toggles update the customer menu and the AI assistant instantly for this stall.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeVendorObj.menuItems.map((item) => {
              const isOut = stockMap[item.id] === true;

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-street-surface border border-street-border flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{item.image}</span>
                    <div>
                      <h4 className="font-bold text-white text-xs leading-tight">{item.name}</h4>
                      <p className="text-[11px] text-slate-400">{formatNaira(item.price)}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleItemStock(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isOut
                        ? 'bg-street-red/20 text-street-red border border-street-red/40'
                        : 'bg-street-green/20 text-street-green border border-street-green/40'
                    }`}
                  >
                    {isOut ? 'Sold Out' : 'Available'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
