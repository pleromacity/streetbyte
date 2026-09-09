// Smart ETA and Queue Position Calculator

export function calculateQueueMetrics(orders, rushBufferMinutes = 0, walkingDistanceMinutes = 4) {
  // Filter active queue orders
  const activeOrders = orders.filter(o => o.status === 'incoming' || o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');
  
  // Total workload calculation (average 4 mins per pending order slot)
  const estimatedKitchenWait = Math.max(
    (activeOrders.length * 3.5) + rushBufferMinutes,
    5
  );

  const roundedWait = Math.round(estimatedKitchenWait);
  
  // Smart timing advisory: when should customer start walking?
  const suggestedDepartureMinutes = Math.max(roundedWait - walkingDistanceMinutes, 0);

  let crowdStatus = 'Fast Flow';
  let crowdColor = 'text-green-400';
  if (activeOrders.length >= 6) {
    crowdStatus = 'Peak Rush Hour';
    crowdColor = 'text-red-400';
  } else if (activeOrders.length >= 3) {
    crowdStatus = 'Moderate Queue';
    crowdColor = 'text-amber-400';
  }

  return {
    queueLength: activeOrders.length,
    readyCount: readyOrders.length,
    estimatedWaitMinutes: roundedWait,
    walkingDistanceMinutes,
    suggestedDepartureMinutes,
    crowdStatus,
    crowdColor,
    rushBufferActive: rushBufferMinutes > 0
  };
}

export function formatNaira(amount) {
  return '₦' + Number(amount || 0).toLocaleString('en-NG');
}
