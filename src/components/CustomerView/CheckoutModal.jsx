import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { formatNaira } from '../../utils/etaCalculator';
import { getVendorById } from '../../config/menuData';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Smartphone, 
  Loader2, 
  CheckCircle2, 
  Lock,
  Copy,
  Check,
  Store
} from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, onOrderPlaced }) {
  if (!isOpen) return null;

  const { cart, placeOrder, selectedVendorId } = useOrders();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('TRANSFER');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Target vendor
  const targetVendorId = cart[0]?.item?.vendorId || selectedVendorId;
  const targetVendor = getVendorById(targetVendorId);

  const subtotal = cart.reduce((acc, c) => acc + (c.item.price * c.quantity), 0);
  const convenienceFee = 100;
  const total = subtotal + convenienceFee;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handlePayAndOrder = (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Please enter your name or nickname');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);

      setTimeout(() => {
        const order = placeOrder({
          customerName,
          customerPhone: customerPhone || '08031230000',
          paymentMethod
        });
        setIsPaid(false);
        onClose();
        if (onOrderPlaced) onOrderPlaced(order);
      }, 1000);

    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-street-surface border border-street-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-street-border flex items-center justify-between bg-street-card">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-street-green/20 text-street-green flex items-center justify-center border border-street-green/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Secure Fast Checkout</h3>
              <p className="text-xs text-slate-400">StreetByte Multi-Vendor Instant Settlement</p>
            </div>
          </div>
          <button 
            disabled={isProcessing}
            onClick={onClose} 
            className="p-1.5 rounded-lg bg-street-charcoal text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Vendor Stall Pill */}
        <div className="bg-street-charcoal px-4 py-2 border-b border-street-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Store className="w-3.5 h-3.5 text-street-orange" />
            <span>Ordering from: <strong>{targetVendor.name}</strong></span>
          </div>
          <span className="bg-street-card px-2 py-0.5 rounded text-[10px] font-black text-street-amber border border-street-border">
            {targetVendor.stallNumber}
          </span>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handlePayAndOrder} className="p-5 overflow-y-auto space-y-4 text-sm">
          
          {/* Customer Details */}
          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">
              Pickup Name / Nickname <span className="text-street-orange">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Wanaemi, Chidi, or Sister Blessing"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-street-card border border-street-border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-street-orange"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">
              Phone Number (For Ready SMS Alert)
            </label>
            <input
              type="tel"
              placeholder="0803 123 4567"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full bg-street-card border border-street-border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-street-orange"
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('TRANSFER')}
                className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'TRANSFER'
                    ? 'bg-street-orange/15 border-street-orange text-white font-bold'
                    : 'bg-street-card border-street-border text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-[11px]">Bank Transfer</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('USSD')}
                className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'USSD'
                    ? 'bg-street-orange/15 border-street-orange text-white font-bold'
                    : 'bg-street-card border-street-border text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="text-[11px]">USSD Code</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'CARD'
                    ? 'bg-street-orange/15 border-street-orange text-white font-bold'
                    : 'bg-street-card border-street-border text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[11px]">Card / Apple</span>
              </button>
            </div>
          </div>

          {/* Bank Transfer Details (Dynamic per vendor) */}
          {paymentMethod === 'TRANSFER' && (
            <div className="p-3.5 rounded-xl bg-street-card border border-street-border/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Vendor Bank:</span>
                <strong className="text-white">{targetVendor.bankInfo.bank}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Account Name:</span>
                <strong className="text-white">{targetVendor.bankInfo.accountName}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-street-border">
                <span>Account Number:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-black text-street-amber">
                    {targetVendor.bankInfo.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(targetVendor.bankInfo.accountNumber)}
                    className="p-1 rounded bg-street-surface text-slate-300 hover:text-white"
                  >
                    {copiedAccount ? <Check className="w-3.5 h-3.5 text-street-green" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-street-green font-medium flex items-center gap-1 pt-1">
                <Lock className="w-3 h-3" /> Auto-validated by StreetByte Webhook API
              </p>
            </div>
          )}

          {paymentMethod === 'USSD' && (
            <div className="p-3.5 rounded-xl bg-street-card border border-street-border text-xs text-center space-y-2">
              <p className="text-slate-400">Dial the instant USSD string from your phone:</p>
              <div className="p-2 bg-street-charcoal rounded-lg font-mono text-sm font-bold text-street-amber">
                *737*2*{total}*{targetVendor.bankInfo.accountNumber}#
              </div>
              <p className="text-[11px] text-slate-500">Auto-detected upon network PIN confirmation</p>
            </div>
          )}

          {paymentMethod === 'CARD' && (
            <div className="p-3.5 rounded-xl bg-street-card border border-street-border text-xs space-y-2">
              <input
                type="text"
                disabled
                value="5399 •••• •••• 9281"
                className="w-full bg-street-charcoal border border-street-border rounded-lg p-2 font-mono text-slate-400"
              />
              <div className="flex gap-2">
                <input type="text" disabled value="12/28" className="w-1/2 bg-street-charcoal border border-street-border rounded-lg p-2 text-center text-slate-400" />
                <input type="password" disabled value="•••" className="w-1/2 bg-street-charcoal border border-street-border rounded-lg p-2 text-center text-slate-400" />
              </div>
            </div>
          )}

          {/* Pricing Breakdown */}
          <div className="pt-2 border-t border-street-border space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Items Total ({cart.length} items):</span>
              <span className="text-white font-medium">{formatNaira(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span className="flex items-center gap-1">
                Queue Fast-Pass Fee:
                <span className="text-[10px] bg-street-green/20 text-street-green px-1.5 py-0.2 rounded">Low</span>
              </span>
              <span className="text-white font-medium">{formatNaira(convenienceFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-street-border">
              <span>Total Payable:</span>
              <span className="text-street-orange text-base">{formatNaira(total)}</span>
            </div>
          </div>

          {/* Processing / Paid States */}
          {isProcessing && (
            <div className="p-3 rounded-xl bg-street-card border border-street-amber text-street-amber text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Validating transfer with {targetVendor.bankInfo.bank} inbound logs...</span>
            </div>
          )}

          {isPaid && (
            <div className="p-3 rounded-xl bg-street-green/20 border border-street-green text-street-green text-xs flex items-center justify-center gap-2 font-bold animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              <span>Payment Verified! Generating Ticket for {targetVendor.stallNumber}...</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || isPaid}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-street-orange to-street-amber text-white font-bold text-sm hover:brightness-110 shadow-lg shadow-street-orange/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Payment...</span>
              </>
            ) : isPaid ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmed!</span>
              </>
            ) : (
              <span>Simulate Instant Payment ({formatNaira(total)})</span>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
