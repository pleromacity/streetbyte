import React, { useState, useEffect, useRef } from 'react';
import { parseOrderText } from '../../utils/nlpParser';
import { useOrders } from '../../context/OrderContext';
import { formatNaira } from '../../utils/etaCalculator';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Flame,
  Lightbulb,
  ArrowRight,
  Store
} from 'lucide-react';

export default function AIAssistant() {
  const { addToCart, selectedVendorId, setSelectedVendorId } = useOrders();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);
  const [addedNotification, setAddedNotification] = useState(false);
  const recognitionRef = useRef(null);

  // Setup Web Speech API if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-NG'; // Nigerian English

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          handleProcess(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleProcess = (textToParse) => {
    const query = textToParse || input;
    if (!query.trim()) return;

    const result = parseOrderText(query, selectedVendorId);
    setParsedResult(result);
  };

  const handleAddAllToCart = () => {
    if (!parsedResult || parsedResult.detectedItems.length === 0) return;

    // If items belong to a vendor different than currently selected, switch to that vendor
    if (parsedResult.primaryVendorId && parsedResult.primaryVendorId !== selectedVendorId) {
      setSelectedVendorId(parsedResult.primaryVendorId);
    }

    parsedResult.detectedItems.forEach(d => {
      addToCart(d.item, d.quantity, d.customizations);
    });

    setAddedNotification(true);
    setTimeout(() => {
      setAddedNotification(false);
      setParsedResult(null);
      setInput('');
    }, 2500);
  };

  const handleAddUpsell = (upsellItem) => {
    if (!upsellItem) return;
    addToCart(upsellItem, 1, null);
  };

  const QUICK_PROMPTS = [
    "2 beef suya, extra pepper, onions on side, 1 malt",
    "Party jollof with dodo and peppered turkey",
    "Fiery goat asun with chilled chapman",
    "Solo rush combo from Musa"
  ];

  return (
    <div className="bg-gradient-to-b from-street-card to-street-surface border border-street-border rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden mb-6">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-street-orange/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-street-orange/20 border border-street-orange/30 text-street-orange flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span>StreetByte AI Order Voice & Chat</span>
              <span className="flex items-center gap-1 text-[10px] font-semibold bg-street-amber/20 text-street-amber px-2 py-0.5 rounded-full border border-street-amber/30">
                <Sparkles className="w-3 h-3" /> All Stalls Ready
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Speak or type your order from any stall (e.g., "Party jollof with asun" or "2 beef suya")
            </p>
          </div>
        </div>
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
          placeholder="Speak or type your food order naturally..."
          className="w-full bg-street-charcoal border border-street-border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-street-orange transition-colors"
        />

        {/* Voice Recognition Button */}
        {speechSupported && (
          <button
            type="button"
            onClick={toggleMic}
            title={isListening ? "Stop listening" : "Click to speak order"}
            className={`p-3 rounded-xl border transition-all ${
              isListening
                ? 'bg-street-red text-white border-street-red animate-pulse'
                : 'bg-street-card text-slate-300 border-street-border hover:text-white hover:border-street-orange'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        )}

        {/* Submit button */}
        <button
          type="button"
          onClick={() => handleProcess()}
          className="p-3 rounded-xl bg-street-orange text-white hover:brightness-110 shadow-md shadow-street-orange/20 transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-slate-500 font-medium">Try saying:</span>
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => {
              setInput(prompt);
              handleProcess(prompt);
            }}
            className="text-[11px] px-2.5 py-1 rounded-full bg-street-charcoal/80 text-slate-300 border border-street-border hover:border-street-orange hover:text-white transition-all truncate max-w-[300px]"
          >
            "{prompt}"
          </button>
        ))}
      </div>

      {/* Parsed Result Box */}
      {parsedResult && (
        <div className="mt-4 p-4 rounded-xl bg-street-charcoal border border-street-orange/40 animate-fadeIn">
          {parsedResult.detectedItems.length > 0 ? (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-street-orange flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Order Understood
                </span>
                
                {/* Stall attribution badge */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-street-card text-street-amber border border-street-border flex items-center gap-1">
                    <Store className="w-3 h-3" />
                    Stall: {parsedResult.targetVendor.shortName} ({parsedResult.targetVendor.stallNumber})
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Est. Time: {parsedResult.prepTimeMinutes}m
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                {parsedResult.detectedItems.map((di, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-street-surface border border-street-border text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{di.item.image}</span>
                      <div>
                        <span className="font-bold text-white">{di.quantity}x {di.item.name}</span>
                        {di.customizations && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                            <span className="text-street-amber">🔥 {di.customizations.spice}</span>
                            <span>•</span>
                            <span>🧅 {di.customizations.onions}</span>
                            <span>•</span>
                            <span>📦 {di.customizations.packaging}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-white">{formatNaira(di.item.price * di.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Smart upsell */}
              {parsedResult.smartSuggestion && (
                <div className="mb-3 p-2.5 rounded-lg bg-street-amber/10 border border-street-amber/30 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-200">
                    <Lightbulb className="w-4 h-4 text-street-amber flex-shrink-0" />
                    <span>{parsedResult.smartSuggestion.text}</span>
                  </div>
                  <button
                    onClick={() => handleAddUpsell(parsedResult.smartSuggestion.upsellItem)}
                    className="px-2.5 py-1 rounded bg-street-amber text-street-charcoal font-bold text-[11px] hover:brightness-110 flex-shrink-0"
                  >
                    + Add
                  </button>
                </div>
              )}

              {/* Add to cart action */}
              <div className="flex items-center justify-between pt-2 border-t border-street-border">
                <div>
                  <span className="text-xs text-slate-400">Subtotal:</span>
                  <p className="text-base font-black text-white">{formatNaira(parsedResult.subtotal)}</p>
                </div>

                <button
                  type="button"
                  onClick={handleAddAllToCart}
                  className="py-2.5 px-4 rounded-xl bg-street-orange text-white font-bold text-xs hover:brightness-110 flex items-center gap-2 shadow-lg shadow-street-orange/30"
                >
                  <span>Add All to Cart</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-xs text-slate-400">
                Could not find matching food items for "<span className="text-white font-medium">{parsedResult.rawInput}</span>". Try asking for "party jollof with turkey" or "2 beef suya".
              </p>
            </div>
          )}
        </div>
      )}

      {/* Success toast */}
      {addedNotification && (
        <div className="mt-3 p-3 rounded-xl bg-street-green/20 border border-street-green/40 text-street-green text-xs font-bold flex items-center justify-center gap-2 animate-bounce-short">
          <CheckCircle2 className="w-4 h-4" />
          <span>Items added to cart! Review & place order below.</span>
        </div>
      )}

    </div>
  );
}
