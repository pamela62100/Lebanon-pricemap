import { useEffect, useRef } from 'react';
import { liveConnection, type LiveEvent } from '@/lib/liveConnection';

/**
 * Subscribe to a SignalR event for the lifetime of a component.
 *
 * @param event   Server event name (e.g. 'NotificationCreated')
 * @param handler Called with the payload from the server. Use a stable ref or wrap in useCallback if needed.
 *
 * @example
 *   useLiveUpdate('NotificationCreated', (n) => setNotifications(prev => [n, ...prev]));
 */
export function useLiveUpdate<T = any>(
  event: LiveEvent,
  handler: (payload: T) => void
) {
  // Keep the latest handler in a ref so we don't re-subscribe on every render
  const handlerRef = useRef(handler);
  useEffect(() => { handlerRef.current = handler; }, [handler]);

  useEffect(() => {
    const unsubscribe = liveConnection.on(event, (payload) => handlerRef.current(payload));
    return unsubscribe;
  }, [event]);
}

/**
 * Subscribe to live events for a specific store. Auto-joins on mount, leaves on unmount.
 *
 * @example
 *   useLiveStoreGroup(myStoreId);
 *   useLiveUpdate('CatalogItemChanged', refresh);
 */
export function useLiveStoreGroup(storeId: string | null | undefined) {
  useEffect(() => {
    if (!storeId) return;
    liveConnection.joinStore(storeId);
    return () => { liveConnection.leaveStore(storeId); };
  }, [storeId]);
}

/**
 * Subscribe to live events for a specific product (e.g. shopper detail page).
 */
export function useLiveProductGroup(productId: string | null | undefined) {
  useEffect(() => {
    if (!productId) return;
    liveConnection.joinProduct(productId);
    return () => { liveConnection.leaveProduct(productId); };
  }, [productId]);
}
