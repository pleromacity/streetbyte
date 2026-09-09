import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useOrders } from '../../context/OrderContext';
import { 
  Flame, 
  Printer, 
  Sparkles, 
  Smartphone, 
  ShieldCheck, 
  Clock, 
  Store 
} from 'lucide-react';

export default function CounterStand() {
  const { vendors, selectedVendorId } = useOrders();
  const [printVendorId, setPrintVendorId] = useState(selectedVendorId || 'musa-suya');
  const [appUrl, setAppUrl] = useState('');

  const targetVendor = vendors.find(v => v.id === printVendorId) || vendors[0];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAppUrl(window.location.origin);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const qrDestinationUrl = `${appUrl || 'https://streetbyte.vercel.app'}?stall=${targetVendor.id}`;

  return (
    <div className="max-w-xl mx-auto space-y-5">
      
      {/* Configuration bar (hidden in print) */}
      <div className="print:hidden bg-street-card border border-street-border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-auto space-y-2">
          <label className="block text-[10px] uppercase font-bold text-slate-400">
            Generate QR Stand for Stall:
          </label>
          <div className="flex items-center gap-2">
            {vendors.map(v => (
              <button
                key={v.id}
                onClick={() => setPrintVendorId(v.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  printVendorId === v.id
                    ? 'bg-street-orange text-white shadow-md'
                    : 'bg-street-charcoal text-slate-400 hover:text-white border border-street-border'
                }`}
              >
                {v.image} {v.shortName}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-street-orange text-white font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-md shadow-street-orange/20"
        >
          <Printer className="w-4 h-4" />
          <span>Print Counter Stand</span>
        </button>
      </div>

      {/* Printable Counter Poster Card */}
      <div className="bg-white text-street-charcoal rounded-3xl p-8 border-4 border-street-orange shadow-2xl flex flex-col items-center text-center space-y-6">
        
        {/* Stall Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black uppercase tracking-wider mb-2">
            <Flame className="w-4 h-4 fill-current" />
            <span>StreetByte Fast Lane • {targetVendor.stallNumber}</span>
          </div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {targetVendor.name}
          </h1>
          <p className="text-sm font-semibold text-slate-600">
            {targetVendor.cuisine} • Junction Food Hub
          </p>
        </div>

        {/* Catchy Hook */}
        <div className="bg-slate-900 text-white w-full py-3 px-4 rounded-2xl">
          <h2 className="text-lg font-black tracking-wide uppercase text-amber-400">
            Skip The Crowd & Sidewalk Lines!
          </h2>
          <p className="text-xs text-slate-300">
            Scan below to order with AI • Real-time queue ticket called at {targetVendor.stallNumber}
          </p>
        </div>

        {/* QR Code Container */}
        <div className="p-4 bg-white rounded-2xl border-4 border-slate-900 shadow-inner flex flex-col items-center">
          <QRCodeSVG
            value={qrDestinationUrl}
            size={220}
            level="H"
            includeMargin={true}
          />
          <span className="font-mono text-xs font-bold text-slate-700 mt-2">
            {qrDestinationUrl}
          </span>
        </div>

        {/* 3-Step Customer Guide */}
        <div className="grid grid-cols-3 gap-3 w-full text-center">
          <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
            <div className="w-7 h-7 rounded-full bg-orange-500 text-white font-black text-xs flex items-center justify-center mx-auto mb-1">
              1
            </div>
            <h4 className="font-bold text-xs text-slate-800">Scan QR</h4>
            <p className="text-[10px] text-slate-600">Camera / browser</p>
          </div>

          <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
            <div className="w-7 h-7 rounded-full bg-orange-500 text-white font-black text-xs flex items-center justify-center mx-auto mb-1">
              2
            </div>
            <h4 className="font-bold text-xs text-slate-800">AI Order</h4>
            <p className="text-[10px] text-slate-600">Speak your meal</p>
          </div>

          <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
            <div className="w-7 h-7 rounded-full bg-orange-500 text-white font-black text-xs flex items-center justify-center mx-auto mb-1">
              3
            </div>
            <h4 className="font-bold text-xs text-slate-800">Hot Pickup</h4>
            <p className="text-[10px] text-slate-600">Collect at {targetVendor.stallNumber}</p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="pt-2 border-t border-slate-200 w-full flex items-center justify-between text-[11px] font-bold text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Instant Verified Payment
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Zero Idle Waiting
          </span>
        </div>

      </div>

    </div>
  );
}
