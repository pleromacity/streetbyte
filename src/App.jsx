import React, { useState } from 'react';
import { OrderProvider, useOrders } from './context/OrderContext';
import Navbar from './components/Navbar';
import LandingPage from './components/Landing/LandingPage';
import VendorDiscovery from './components/CustomerView/VendorDiscovery';
import MenuCatalog from './components/CustomerView/MenuCatalog';
import AIAssistant from './components/CustomerView/AIAssistant';
import CartDrawer from './components/CustomerView/CartDrawer';
import CheckoutModal from './components/CustomerView/CheckoutModal';
import LiveQueueTicket from './components/CustomerView/LiveQueueTicket';
import KitchenDashboard from './components/KitchenView/KitchenDashboard';
import CounterStand from './components/QRView/CounterStand';
import { formatNaira } from './utils/etaCalculator';
import { 
  ShoppingBag, 
  ArrowRight, 
  Ticket, 
  Flame, 
} from 'lucide-react';

function AppContent() {
  const { 
    authRole,
    currentTab, 
    cart, 
    activeTicketId, 
    vendor 
  } = useOrders();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showingTicketView, setShowingTicketView] = useState(false);

  const cartTotal = cart.reduce((acc, c) => acc + (c.item.price * c.quantity), 0);
  const cartCount = cart.reduce((acc, c) => acc + c.quantity, 0);

  // Not authenticated: show landing page
  if (!authRole) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-street-charcoal text-slate-100 flex flex-col font-sans selection:bg-street-orange selection:text-white">
      
      {/* Sticky Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-24 sm:pb-16">
        
        {/* BUYER ENVIRONMENT */}
        {authRole === 'buyer' && currentTab === 'customer' && (
          <div>
            {showingTicketView && activeTicketId ? (
              <LiveQueueTicket
                ticketId={activeTicketId}
                onBackToMenu={() => setShowingTicketView(false)}
              />
            ) : (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Active Ticket Banner */}
                {activeTicketId && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-street-orange/20 to-street-amber/20 border border-street-orange/40 flex items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-street-orange text-white flex items-center justify-center font-bold">
                        <Ticket className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-white">
                          Active Order #{activeTicketId} in Progress
                        </span>
                        <p className="text-[11px] text-slate-300">
                          Track your meal preparation and pickup call in real-time
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowingTicketView(true)}
                      className="px-3 py-1.5 rounded-xl bg-street-orange text-white text-xs font-bold hover:brightness-110 flex items-center gap-1.5 shadow-md shadow-street-orange/20 flex-shrink-0"
                    >
                      <span>View Ticket</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Multi-Vendor Discovery Strip */}
                <VendorDiscovery />

                {/* Hero Stall Banner */}
                <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${vendor.bannerBg || 'from-amber-950/60 to-street-surface'} border border-street-border p-5 sm:p-7 shadow-xl`}>
                  <div className="max-w-2xl space-y-2">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-street-orange/20 text-street-orange border border-street-orange/30 text-xs font-bold">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{vendor.stallNumber} • {vendor.tagline}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Order from {vendor.name}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Skip the queues. Speak or type your order — StreetByte syncs your walking ETA with {vendor.owner}'s kitchen!
                    </p>
                  </div>
                </div>

                <AIAssistant />
                <MenuCatalog />

              </div>
            )}
          </div>
        )}

        {/* VENDOR ENVIRONMENT — Kitchen KDS */}
        {authRole === 'vendor' && currentTab === 'kitchen' && (
          <div className="animate-fadeIn">
            <KitchenDashboard />
          </div>
        )}

        {/* VENDOR ENVIRONMENT — Counter QR */}
        {authRole === 'vendor' && currentTab === 'qr' && (
          <div className="animate-fadeIn">
            <CounterStand />
          </div>
        )}

      </main>

      {/* Floating Bottom Cart Bar — buyers only */}
      {authRole === 'buyer' && currentTab === 'customer' && !showingTicketView && cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-30 animate-bounce-short">
          <div className="bg-street-orange text-white rounded-2xl p-3.5 shadow-2xl shadow-street-orange/40 flex items-center justify-between border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white/90">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} in bag
                </span>
                <p className="text-base font-black leading-tight">
                  {formatNaira(cartTotal + 100)}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white text-street-charcoal font-black text-xs hover:bg-slate-100 flex items-center gap-1.5 shadow-md"
            >
              <span>Review Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckoutClick={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={(order) => {
          setShowingTicketView(true);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-street-border/60 bg-street-card/40 py-5 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto">
          <span className="font-semibold text-slate-400">StreetByte</span>
          <span className="mx-2">•</span>
          <span>© 2026 Wanaemi Watson. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <OrderProvider>
      <AppContent />
    </OrderProvider>
  );
}
