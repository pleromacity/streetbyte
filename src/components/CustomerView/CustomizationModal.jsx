import React, { useState } from 'react';
import { CUSTOMIZATION_OPTIONS } from '../../config/menuData';
import { formatNaira } from '../../utils/etaCalculator';
import { X, Check, Flame, ShieldAlert } from 'lucide-react';

export default function CustomizationModal({ item, isOpen, onClose, onConfirm }) {
  if (!isOpen || !item) return null;

  const [spice, setSpice] = useState('medium');
  const [onions, setOnions] = useState('standard');
  const [packaging, setPackaging] = useState('foil');
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onConfirm(item, quantity, {
      spice,
      onions,
      packaging
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-street-surface border border-street-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-street-border flex items-center justify-between bg-street-card">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{item.image}</span>
            <div>
              <h3 className="font-bold text-white text-base leading-tight">{item.name}</h3>
              <p className="text-xs text-street-amber font-semibold">{formatNaira(item.price)} each</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-street-charcoal text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-5 text-sm">
          
          {/* Spice Preference */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-street-orange" />
              Yaji Pepper Intensity
            </label>
            <div className="grid grid-cols-1 gap-2">
              {CUSTOMIZATION_OPTIONS.spiceLevels.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSpice(lvl.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    spice === lvl.id
                      ? 'bg-street-orange/15 border-street-orange text-white font-medium'
                      : 'bg-street-card border-street-border text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span>{lvl.label}</span>
                  {spice === lvl.id && <Check className="w-4 h-4 text-street-orange" />}
                </button>
              ))}
            </div>
          </div>

          {/* Onions Preference */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
              Fresh Red Onions (Albasa)
            </label>
            <div className="grid grid-cols-1 gap-2">
              {CUSTOMIZATION_OPTIONS.onions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setOnions(opt.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    onions === opt.id
                      ? 'bg-street-card border-street-amber text-white font-medium'
                      : 'bg-street-card/60 border-street-border text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span>{opt.label}</span>
                  {onions === opt.id && <Check className="w-4 h-4 text-street-amber" />}
                </button>
              ))}
            </div>
          </div>

          {/* Packaging */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
              Packaging Option
            </label>
            <div className="grid grid-cols-1 gap-2">
              {CUSTOMIZATION_OPTIONS.packaging.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setPackaging(pkg.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    packaging === pkg.id
                      ? 'bg-street-card border-street-green text-white font-medium'
                      : 'bg-street-card/60 border-street-border text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span>{pkg.label}</span>
                  {packaging === pkg.id && <Check className="w-4 h-4 text-street-green" />}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="pt-2 flex items-center justify-between bg-street-card p-3 rounded-xl border border-street-border">
            <span className="text-xs font-semibold text-slate-300">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-street-surface border border-street-border font-bold text-white hover:bg-street-border"
              >
                -
              </button>
              <span className="font-extrabold text-white text-base min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-street-surface border border-street-border font-bold text-white hover:bg-street-border"
              >
                +
              </button>
            </div>
          </div>

        </div>

        {/* Footer Submit */}
        <div className="p-4 border-t border-street-border bg-street-card flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400">Total Price:</span>
            <p className="text-lg font-black text-white">{formatNaira(item.price * quantity)}</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-street-orange to-street-amber text-white font-bold hover:brightness-110 shadow-lg shadow-street-orange/20 transition-all text-sm"
          >
            Add to Order
          </button>
        </div>

      </div>
    </div>
  );
}
