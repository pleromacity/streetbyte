import React from 'react';
import { useOrders } from '../../context/OrderContext';
import { formatNaira, calculateQueueMetrics } from '../../utils/etaCalculator';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Clock, 
  Footprints,
  ShieldCheck
} from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, onCheckoutClick }) {
  if (!isOpen) return null;

  const { 
    cart, 
    updateCartQuantity, 
    clearCart, 
    orders, 
    rushBufferMinutes, 
    vendor 
  } = useOrders();

  const metrics = calculateQueueMetrics(orders, rushBufferMinutes, vendor.walkingDistanceMinutes);
  const subtotal = cart.reduce((acc, c) => acc + (c.item.price * c.quantity), 0);
  const convenienceFee = 100;
  const total = subtotal + convenienceFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-street-surface border-l border-street-border flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 border-b border-street-border flex items-center justify-between bg-street-card">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-street-orange" />
              <h3 className="font-bold text-white text-base">Your Street Order</h3>
              <span className="bg-street-orange/20 text-street-orange text-xs font-bold px-2 py-0.5 rounded-full border border-street-orange/30">
                {cart.reduce((a, b) => a + b.quantity, 0)} items
              </span>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  title="Clear all items"
                  className="p-1.5 text-slate-400 hover:text-street-red rounded-lg hover:bg-street-charcoal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-street-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body: Empty or List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <span className="text-5xl">🍢</span>
                <h4 className="font-bold text-white text-base">Your bag is empty</h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Browse our authentic charcoal grills, chilled drinks, or speak your custom order using the AI assistant!
                </p>
              </div>
            ) : (
              cart.map((cartItem, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-street-card border border-street-border flex items-start justify-between gap-3 text-xs"
                >
                  <span className="text-2xl pt-0.5">{cartItem.item.image}</span>
                  
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-white text-sm truncate">{cartItem.item.name}</h5>
                    <p className="text-street-amber font-semibold">{formatNaira(cartItem.item.price)} each</p>
                    
                    {cartItem.customizations && (
                      <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-slate-400">
                        <span className="bg-street-surface px-1.5 py-0.5 rounded border border-street-border">
                          🔥 {cartItem.customizations.spice}
                        </span>
                        <span className="bg-street-surface px-1.5 py-0.5 rounded border border-street-border">
                          🧅 {cartItem.customizations.onions}
                        </span>
                        <span className="bg-street-surface px-1.5 py-0.5 rounded border border-street-border">
                          📦 {cartItem.customizations.packaging}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-street-surface px-2 py-1 rounded-lg border border-street-border">
                    <button
                      onClick={() => updateCartQuantity(idx, cartItem.quantity - 1)}
                      className="text-slate-400 hover:text-white font-bold px-1 text-sm"
                    >
                      -
                    </button>
                    <span className="font-bold text-white min-w-[14px] text-center">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(idx, cartItem.quantity + 1)}
                      className="text-slate-400 hover:text-white font-bold px-1 text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout button */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-street-border bg-street-card space-y-3">
              
              {/* ETA Sync Preview */}
              <div className="p-3 rounded-xl bg-street-surface border border-street-border/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-street-amber" />
                    Kitchen Wait:
                  </span>
                  <span className="font-bold text-white">~{metrics.estimatedWaitMinutes} mins</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Footprints className="w-3.5 h-3.5 text-street-green" />
                    Walking Distance:
                  </span>
                  <span className="font-bold text-white">~{vendor.walkingDistanceMinutes} mins</span>
                </div>
                <p className="text-[11px] text-street-green font-medium pt-1 border-t border-street-border/60">
                  ✨ Leave your desk in {metrics.suggestedDepartureMinutes} mins to catch your food hot off the grill!
                </p>
              </div>

              {/* Total calculation */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="text-white font-medium">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Fast-Pass Queue Fee:</span>
                  <span className="text-white font-medium">{formatNaira(convenienceFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-1.5 border-t border-street-border">
                  <span>Total:</span>
                  <span className="text-street-orange text-base">{formatNaira(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCheckoutClick();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-street-orange to-street-amber text-white font-bold text-sm hover:brightness-110 shadow-lg shadow-street-orange/30 flex items-center justify-center gap-2"
              >
                <span>Checkout & Join Digital Queue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
