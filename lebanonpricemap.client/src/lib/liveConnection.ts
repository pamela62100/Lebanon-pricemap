import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
  RetryContext,
} from '@microsoft/signalr';

/**
 * Server → Client event names. Must match the methods on ILiveClient in the C# hub.
 */
export type LiveEvent =
  | 'NotificationCreated'
  | 'DiscrepancyReportCreated'
  | 'DiscrepancyReportResolved'
  | 'CatalogItemChanged'
  | 'SyncRunUpdated'
  | 'PriceVoted'
  | 'PriceChanged';

type Handler = (payload: any) => void;

/**
 * Singleton SignalR connection manager.
 *
 * Why a singleton: one open WebSocket per browser tab is enough — every component
 * subscribes to the same connection through `on()` / `off()`.
 *
 * Auto-reconnect: SignalR retries with backoff if the socket drops. We re-join
 * any opted-in groups (stores, products) automatically on reconnect.
 */
class LiveConnection {
  private connection: HubConnection | null = null;
  private startPromise: Promise<void> | null = null;
  private storeGroups = new Set<string>();
  private productGroups = new Set<string>();
  private listeners = new Map<LiveEvent, Set<Handler>>();

  private getApiBase(): string {
    // Same origin used by REST: prefer Vite env, fall back to localhost:5000
    const envBase = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
    if (envBase) {
      return envBase.replace(/\/api\/?$/, '');
    }
    return 'http://localhost:5000';
  }

  /**
   * Open the connection. Safe to call repeatedly — only starts once.
   * `getToken` is called lazily on every reconnect attempt so refreshed tokens are picked up.
   */
  start(getToken: () => string | null): Promise<void> {
    if (this.connection && this.connection.state === HubConnectionState.Connected) {
      return Promise.resolve();
    }
    if (this.startPromise) return this.startPromise;

    const url = `${this.getApiBase()}/hubs/live`;

    this.connection = new HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () => getToken() ?? '',
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (ctx: RetryContext) => {
          // 0s, 2s, 5s, 10s, then every 30s indefinitely
          const seq = [0, 2000, 5000, 10000];
          return seq[ctx.previousRetryCount] ?? 30000;
        },
      })
      .configureLogging(LogLevel.Warning)
      .build();

    // Pre-register all known events so no broadcast is ever missed due to a race
    const allEvents: LiveEvent[] = [
      'NotificationCreated', 'DiscrepancyReportCreated', 'DiscrepancyReportResolved',
      'CatalogItemChanged', 'SyncRunUpdated', 'PriceVoted', 'PriceChanged',
    ];
    allEvents.forEach(event => {
      if (!this.listeners.has(event)) this.listeners.set(event, new Set());
      this.connection!.on(event, (payload: any) => {
        this.listeners.get(event)?.forEach(h => h(payload));
      });
    });

    this.connection.onreconnected(async () => {
      // Re-join any groups we were subscribed to before the drop
      for (const id of this.storeGroups) {
        try { await this.connection!.invoke('JoinStore', id); } catch { /* swallow */ }
      }
      for (const id of this.productGroups) {
        try { await this.connection!.invoke('JoinProduct', id); } catch { /* swallow */ }
      }
    });

    this.startPromise = this.connection.start().catch(err => {
      // Surface but don't throw — the rest of the app must keep working over REST
      console.warn('SignalR initial connection failed:', err);
      this.startPromise = null;
      this.connection = null;
    });
    return this.startPromise;
  }

  async stop(): Promise<void> {
    this.startPromise = null;
    this.storeGroups.clear();
    this.productGroups.clear();
    this.listeners.clear();
    if (this.connection) {
      try { await this.connection.stop(); } catch { /* ignore */ }
      this.connection = null;
    }
  }

  /** Subscribe to an event. Returns an unsubscribe function. */
  on(event: LiveEvent, handler: Handler): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler);
    return () => {
      this.listeners.get(event)?.delete(handler);
    };
  }

  /** Join a store-specific group (e.g. retailer dashboard for a single store). */
  async joinStore(storeId: string): Promise<void> {
    this.storeGroups.add(storeId);
    if (this.connection?.state === HubConnectionState.Connected) {
      try { await this.connection.invoke('JoinStore', storeId); } catch { /* ignore */ }
    }
  }

  async leaveStore(storeId: string): Promise<void> {
    this.storeGroups.delete(storeId);
    if (this.connection?.state === HubConnectionState.Connected) {
      try { await this.connection.invoke('LeaveStore', storeId); } catch { /* ignore */ }
    }
  }

  /** Join a product-specific group (e.g. shopper viewing a price detail page). */
  async joinProduct(productId: string): Promise<void> {
    this.productGroups.add(productId);
    if (this.connection?.state === HubConnectionState.Connected) {
      try { await this.connection.invoke('JoinProduct', productId); } catch { /* ignore */ }
    }
  }

  async leaveProduct(productId: string): Promise<void> {
    this.productGroups.delete(productId);
    if (this.connection?.state === HubConnectionState.Connected) {
      try { await this.connection.invoke('LeaveProduct', productId); } catch { /* ignore */ }
    }
  }
}

export const liveConnection = new LiveConnection();
