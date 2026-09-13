import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_ORDERS, VENDORS, getVendorById } from '../config/menuData';
import { soundAlerts } from '../utils/soundAlerts';

const OrderContext = createContext(null);

const STORAGE_KEY_ORDERS = 'streetbyte_orders_v2';
const STORAGE_KEY_VENDOR = 'streetbyte_active_vendor';
const STORAGE_KEY_BUFFER = 'streetbyte_rush_buffers';
const STORAGE_KEY_STOCK = 'streetbyte_stock_map';
const STORAGE_KEY_AUTH = 'streetbyte_auth';

export function OrderProvider({ children }) {
  // --- Auth State (dummy / frontend-only for MVP) ---
  const [authRole, setAuthRole] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_AUTH))?.role || null; } catch { return null; }
  });
  const [authUser, setAuthUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_AUTH))?.user || null; } catch { return null; }
  });

  // Current tab — must be declared before login/logout so setCurrentTab is in scope
  const [currentTab, setCurrentTab] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY_AUTH));
      return saved?.role === 'vendor' ? 'kitchen' : 'customer';
    } catch { return 'customer'; }
  });

  const login = useCallback((role, name) => {
    const user = { name, role };
    setAuthRole(role);
    setAuthUser(user);
    setCurrentTab(role === 'vendor' ? 'kitchen' : 'customer');
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify({ role, user }));
  }, []);

  const logout = useCallback(() => {
    setAuthRole(null);
    setAuthUser(null);
    setCurrentTab('customer');
    localStorage.removeItem(STORAGE_KEY_AUTH);
  }, []);

  // 1. Active Vendor ID
  const [selectedVendorId, setSelectedVendorId] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_VENDOR) || 'musa-suya';
  });

  // Current vendor profile
  const vendor = getVendorById(selectedVendorId);

  // 2. Orders State
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      return saved ? JSON.parse(saved) : MOCK_ORDERS;
    } catch {
      return MOCK_ORDERS;
    }
  });

  const [activeTicketId, setActiveTicketId] = useState(() => {
    return localStorage.getItem('streetbyte_active_ticket') || null;
  });

  // Rush buffer per vendor: { 'musa-suya': 0, 'mama-blessing': 0 }
  const [rushBufferMap, setRushBufferMap] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BUFFER);
      return saved ? JSON.parse(saved) : { 'musa-suya': 0, 'mama-blessing': 0 };
    } catch {
      return { 'musa-suya': 0, 'mama-blessing': 0 };
    }
  });

  // Out of stock items map: { [itemId]: boolean }
  const [stockMap, setStockMap] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STOCK);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [cart, setCart] = useState([]);

  // Persist states
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VENDOR, selectedVendorId);
    } catch (e) {
      console.error(e);
    }
  }, [selectedVendorId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BUFFER, JSON.stringify(rushBufferMap));
    } catch (e) {
      console.error(e);
    }
  }, [rushBufferMap]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STOCK, JSON.stringify(stockMap));
    } catch (e) {
      console.error(e);
    }
  }, [stockMap]);

  useEffect(() => {
    if (activeTicketId) {
      localStorage.setItem('streetbyte_active_ticket', activeTicketId);
    } else {
      localStorage.removeItem('streetbyte_active_ticket');
    }
  }, [activeTicketId]);

  // Real-time Broadcast Channel for Multi-tab & Multi-window sync
  useEffect(() => {
    let channel;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('streetbyte_sync_channel');
      channel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'SYNC_ORDERS') {
          setOrders(payload);
        } else if (type === 'SYNC_BUFFERS') {
          setRushBufferMap(payload);
        } else if (type === 'SYNC_STOCK') {
          setStockMap(payload);
        } else if (type === 'NEW_ORDER_ALERT') {
          soundAlerts.playNewOrderChime();
        } else if (type === 'READY_ORDER_ALERT') {
          soundAlerts.playReadyChime();
          if (payload?.ticketId) {
            soundAlerts.speakAnnouncement(`Order ${payload.ticketId.replace('-', ' ')} is ready for pickup!`);
          }
        }
      };
    }

    return () => {
      if (channel) channel.close();
    };
  }, []);

  const broadcast = useCallback((type, payload) => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const ch = new BroadcastChannel('streetbyte_sync_channel');
        ch.postMessage({ type, payload });
        ch.close();
      } catch {
        // ignore
      }
    }
  }, []);

  // Cart Actions
  const addToCart = useCallback((item, quantity = 1, customizations = null) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(ci => 
        ci.item.id === item.id && 
        JSON.stringify(ci.customizations) === JSON.stringify(customizations)
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, { item, quantity, customizations, vendorId: item.vendorId }];
      }
    });
  }, []);

  const updateCartQuantity = useCallback((index, newQty) => {
    setCart(prev => {
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Place Order Action
  const placeOrder = useCallback(({ customerName, customerPhone, paymentMethod = 'BANK_TRANSFER' }) => {
    if (cart.length === 0) return null;

    const nextNum = 100 + orders.length + 1;
    const ticketId = `SB-${nextNum}`;
    const subtotal = cart.reduce((acc, c) => acc + (c.item.price * c.quantity), 0);
    const convenienceFee = 100;
    const total = subtotal + convenienceFee;

    // Determine vendor for this order based on first item or current vendor
    const orderVendorId = cart[0]?.item?.vendorId || selectedVendorId;
    const orderVendor = getVendorById(orderVendorId);
    const vendorBuffer = rushBufferMap[orderVendorId] || 0;

    const newOrder = {
      id: ticketId,
      vendorId: orderVendorId,
      vendorName: orderVendor.name,
      stallNumber: orderVendor.stallNumber,
      customerName: customerName || 'Guest Eater',
      customerPhone: customerPhone || '08000000000',
      items: cart.map(c => ({
        name: c.item.name,
        quantity: c.quantity,
        price: c.item.price,
        vendorId: c.item.vendorId,
        spice: c.customizations?.spice || 'medium',
        onions: c.customizations?.onions || 'standard',
        packaging: c.customizations?.packaging || 'foil'
      })),
      subtotal,
      convenienceFee,
      total,
      status: 'incoming',
      placedAt: new Date().toISOString(),
      prepTimeMinutes: Math.max(...cart.map(c => c.item.prepTime), 6),
      paymentStatus: 'PAID_VERIFIED',
      paymentMethod,
      paymentRef: `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
      etaMinutesRemaining: Math.max(...cart.map(c => c.item.prepTime), 6) + vendorBuffer,
    };

    setOrders(prev => {
      const updated = [newOrder, ...prev];
      broadcast('SYNC_ORDERS', updated);
      broadcast('NEW_ORDER_ALERT', { ticketId, vendorId: orderVendorId });
      return updated;
    });

    soundAlerts.playNewOrderChime();
    setActiveTicketId(ticketId);
    clearCart();
    return newOrder;
  }, [cart, orders.length, selectedVendorId, rushBufferMap, broadcast, clearCart]);

  // Order status update
  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders(prev => {
      const updated = prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : order.completedAt
          };
        }
        return order;
      });

      broadcast('SYNC_ORDERS', updated);

      if (newStatus === 'ready') {
        broadcast('READY_ORDER_ALERT', { ticketId: orderId });
        soundAlerts.playReadyChime();
        soundAlerts.speakAnnouncement(`Order ${orderId.replace('-', ' ')} is ready for pickup!`);
      }

      return updated;
    });
  }, [broadcast]);

  // Rush Buffer for a specific vendor
  const setRushBuffer = useCallback((vendorId, minutes) => {
    setRushBufferMap(prev => {
      const updated = {
        ...prev,
        [vendorId]: minutes
      };
      broadcast('SYNC_BUFFERS', updated);
      return updated;
    });
  }, [broadcast]);

  // Stock status toggle
  const toggleItemStock = useCallback((itemId) => {
    setStockMap(prev => {
      const updated = {
        ...prev,
        [itemId]: !prev[itemId]
      };
      broadcast('SYNC_STOCK', updated);
      return updated;
    });
  }, [broadcast]);

  // Reset Demo Data
  const resetDemoData = useCallback(() => {
    setOrders(MOCK_ORDERS);
    setActiveTicketId(null);
    setRushBufferMap({ 'musa-suya': 0, 'mama-blessing': 0 });
    setStockMap({});
    broadcast('SYNC_ORDERS', MOCK_ORDERS);
    broadcast('SYNC_BUFFERS', { 'musa-suya': 0, 'mama-blessing': 0 });
    broadcast('SYNC_STOCK', {});
  }, [broadcast]);

  return (
    <OrderContext.Provider value={{
      // Auth
      authRole,
      authUser,
      login,
      logout,
      // Vendors
      vendors: VENDORS,
      selectedVendorId,
      setSelectedVendorId,
      vendor,
      // Orders
      orders,
      activeTicketId,
      setActiveTicketId,
      cart,
      addToCart,
      updateCartQuantity,
      clearCart,
      placeOrder,
      updateOrderStatus,
      rushBufferMap,
      setRushBuffer,
      stockMap,
      toggleItemStock,
      currentTab,
      setCurrentTab,
      resetDemoData
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
