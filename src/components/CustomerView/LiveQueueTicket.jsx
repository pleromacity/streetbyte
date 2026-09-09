import React, { useEffect, useRef } from 'react';
import { useOrders } from '../../context/OrderContext';
import { formatNaira, calculateQueueMetrics } from '../../utils/etaCalculator';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Clock, 
  Flame, 
  Footprints, 
  ShieldCheck, 
  Sparkles, 
  Volume2, 
  AlertCircle,
  ArrowLeft,
  Store
} from 'lucide-react';
import { soundAlerts } from '../../utils/soundAlerts';

export default function LiveQueueTicket({ ticketId, onBackToMenu }) {
  const { orders, rushBufferMap, vendors, setActiveTicketId } = useOrders();
  const confettiFiredRef = useRef(false);

  const order = orders.find(o => o.id === ticketId);

  if (!order) {
    return (
      <div className="bg-street-surface border border-street-border rounded-2xl p-6 text-center space-y-4 max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-street-amber mx-auto" />
        <h3 className="text-lg font-bold text-white">Ticket Not Found</h3>
        <p className="text-xs text-slate-400">
          The ticket <span className="font-mono text-street-amber font-bold">{ticketId}</span> was completed or reset.
        </p>
        <button
          onClick={() => {
            setActiveTicketId(null);
            onBackToMenu();
          }}
          className="px-4 py-2 rounded-xl bg-street-orange text-white text-xs font-bold"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  // Target vendor info
  const vendorObj = vendors.find(v => v.id === order.vendorId) || vendors[0];

  // Calculate position in line for this vendor's stall
  const activeOrdersForStall = orders.filter(
    o => o.vendorId === order.vendorId && (o.status === 'incoming' || o.status === 'preparing')
  );
  const myQueueIndex = activeOrdersForStall.findIndex(o => o.id === order.id);
  const peopleAhead = myQueueIndex > 0 ? myQueueIndex : 0;

  // Trigger confetti when ready
  useEffect(() => {
    if (order.status === 'ready' && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  }, [order.status]);

  const isIncoming = order.status === 'incoming';
  const isPreparing = order.status === 'preparing';
  const isReady = order.status === 'ready';

  return (
    <div className="max-w-xl mx-auto space-y-4 animate-fadeIn">
      
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>

        <span className="text-xs font-semibold text-slate-500">
          StreetByte Multi-Stall Ticket Sync
        </span>
      </div>

      {/* Main Ticket Card */}
      <div className={`bg-street-surface border-2 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
        isReady 
          ? 'border-street-green shadow-street-green/20' 
          : isPreparing 
            ? 'border-street-orange shadow-street-orange/20' 
            : 'border-street-border'
      }`}>
        
        {/* Ticket Header Banner */}
        <div className={`p-6 text-center relative overflow-hidden ${
          isReady 
            ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white' 
            : isPreparing 
              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white' 
              : 'bg-street-card text-white'
        }`}>
          
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-widest text-slate-200">
              Live Queue Ticket
            </span>
          </div>

          {/* Bold Serial Number */}
          <div className="font-mono text-5xl sm:text-6xl font-black tracking-tight my-2 drop-shadow-md">
            #{order.id}
          </div>

          <div className="flex items-center justify-center gap-2 text-sm font-semibold">
            <Store className="w-4 h-4" />
            <span>{order.vendorName || vendorObj.name} ({order.stallNumber || vendorObj.stallNumber})</span>
          </div>

          <p className="text-xs font-medium opacity-90 mt-1">
            Customer: <strong className="underline decoration-white/40">{order.customerName}</strong>
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-xs text-xs font-medium border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-street-green" />
            <span>Ref: {order.paymentRef} • Instant Verified</span>
          </div>
        </div>

        {/* Real-Time Progress Flow */}
        <div className="p-6 space-y-6">
          
          {/* Status Tracker 3-Step */}
          <div>
            <div className="flex items-center justify-between relative mb-2">
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-street-card z-0"></div>
              <div 
                className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-street-orange transition-all duration-500 z-0"
                style={{
                  width: isReady ? '100%' : isPreparing ? '50%' : '0%'
                }}
              ></div>

              {/* Step 1: Paid & Queued */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                  isIncoming || isPreparing || isReady
                    ? 'bg-street-orange text-white border-street-orange'
                    : 'bg-street-card text-slate-500 border-street-border'
                }`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-white mt-1.5">Paid & Queued</span>
              </div>

              {/* Step 2: Preparing */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                  isPreparing || isReady
                    ? 'bg-street-orange text-white border-street-orange glow-orange'
                    : 'bg-street-card text-slate-500 border-street-border'
                }`}>
                  <Flame className={`w-5 h-5 ${isPreparing ? 'animate-bounce' : ''}`} />
                </div>
                <span className={`text-[11px] font-bold mt-1.5 ${isPreparing ? 'text-street-orange' : 'text-slate-400'}`}>
                  Preparing
                </span>
              </div>

              {/* Step 3: Ready for Pickup */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                  isReady
                    ? 'bg-street-green text-white border-street-green glow-green'
                    : 'bg-street-card text-slate-500 border-street-border'
                }`}>
                  <Sparkles className={`w-5 h-5 ${isReady ? 'animate-spin' : ''}`} />
                </div>
                <span className={`text-[11px] font-bold mt-1.5 ${isReady ? 'text-street-green' : 'text-slate-400'}`}>
                  Ready!
                </span>
              </div>

            </div>
          </div>

          {/* Dynamic Banner */}
          {isReady ? (
            <div className="p-4 rounded-2xl bg-street-green/15 border-2 border-street-green text-center space-y-2 animate-bounce-short">
              <span className="inline-block p-2 rounded-full bg-street-green text-white">
                <Sparkles className="w-6 h-6" />
              </span>
              <h4 className="text-lg font-black text-white">YOUR FOOD IS READY!</h4>
              <p className="text-xs text-slate-300">
                Walk up to <strong className="text-white">{order.vendorName || vendorObj.name}</strong> at <strong>{order.stallNumber || vendorObj.stallNumber}</strong> and quote <strong className="font-mono text-white text-sm">#{order.id}</strong>.
              </p>
              <button
                onClick={() => soundAlerts.playReadyChime()}
                className="text-[11px] font-bold text-street-green hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <Volume2 className="w-3.5 h-3.5" /> Replay Pickup Bell
              </button>
            </div>
          ) : isPreparing ? (
            <div className="p-4 rounded-2xl bg-street-orange/15 border border-street-orange/40 text-center space-y-1.5">
              <h4 className="text-base font-bold text-white flex items-center justify-center gap-2">
                <Flame className="w-5 h-5 text-street-orange animate-pulse" />
                Kitchen is preparing your order now!
              </h4>
              <p className="text-xs text-slate-300">
                Packaging your hot meal. Get ready to walk over to {order.stallNumber || vendorObj.stallNumber}!
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-street-card border border-street-border text-center space-y-1.5">
              <h4 className="text-base font-bold text-white">
                {peopleAhead === 0 ? 'Next in Line for this Stall!' : `${peopleAhead} orders ahead of you at this stall`}
              </h4>
              <p className="text-xs text-slate-400">
                Relax at your desk or home. We’ll notify you the moment your meal is ready!
              </p>
            </div>
          )}

          {/* ETA & Walking Distance */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-street-card border border-street-border text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                <Clock className="w-3 3 text-street-amber" />
                Est. Prep Time
              </span>
              <span className="text-xl font-black text-white block mt-0.5">
                {isReady ? '0 min' : `~${order.etaMinutesRemaining || 8} mins`}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-street-card border border-street-border text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                <Footprints className="w-3 h-3 text-street-green" />
                Walking Distance
              </span>
              <span className="text-xl font-black text-white block mt-0.5">
                {vendorObj.walkingDistanceMinutes} mins
              </span>
            </div>
          </div>

          {/* Ordered Items Summary */}
          <div className="p-4 rounded-xl bg-street-card/80 border border-street-border space-y-2 text-xs">
            <span className="font-bold text-slate-300 block mb-1">Items in this Ticket:</span>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-slate-300">
                <div>
                  <span className="font-semibold text-white">{item.quantity}x {item.name}</span>
                  {item.spice && (
                    <span className="text-[10px] text-slate-400 block">
                      🔥 {item.spice} • 🧅 {item.onions}
                    </span>
                  )}
                </div>
                <span className="font-bold text-white">{formatNaira(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-street-border flex justify-between font-black text-sm text-white">
              <span>Total Paid:</span>
              <span className="text-street-orange">{formatNaira(order.total)}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
