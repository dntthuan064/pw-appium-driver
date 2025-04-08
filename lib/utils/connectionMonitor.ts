import { Browser } from "playwright-core";
import { EventEmitter } from "events";
import { PlaywrightConnectionError } from "./connectionErrors";

export enum ConnectionState {
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  RECONNECTING = "reconnecting",
  FAILED = "failed",
}

export interface ConnectionStats {
  failedChecks: number;
  lastCheckTime: number;
  reconnectAttempts: number;
  state: ConnectionState;
  lastError?: Error;
}

export class ConnectionMonitor extends EventEmitter {
  private static instance: ConnectionMonitor;
  private connectionStats: Map<string, ConnectionStats> = new Map();
  private healthChecks: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    super();
  }

  static getInstance(): ConnectionMonitor {
    if (!ConnectionMonitor.instance) {
      ConnectionMonitor.instance = new ConnectionMonitor();
    }
    return ConnectionMonitor.instance;
  }

  async monitorConnection(
    sessionId: string,
    browser: Browser | any,
    options = {
      healthCheckInterval: 30000,
      maxFailedChecks: 3,
      maxReconnectAttempts: 5,
    },
  ): Promise<void> {
    this.connectionStats.set(sessionId, {
      failedChecks: 0,
      lastCheckTime: Date.now(),
      reconnectAttempts: 0,
      state: ConnectionState.CONNECTED,
    });

    const healthCheck = setInterval(async () => {
      const stats = this.connectionStats.get(sessionId)!;
      try {
        if ("browser" in browser) {
          // Appium client health check
          await browser.status();
        } else {
          // Playwright browser health check
          await browser.contexts();
        }

        if (stats.state !== ConnectionState.CONNECTED) {
          stats.state = ConnectionState.CONNECTED;
          stats.failedChecks = 0;
          stats.reconnectAttempts = 0;
          this.emit("connectionRestored", sessionId);
        }
        stats.lastCheckTime = Date.now();
      } catch (err) {
        const error = err as Error;
        stats.failedChecks++;
        stats.lastError = error;

        if (stats.failedChecks >= options.maxFailedChecks) {
          stats.state = ConnectionState.DISCONNECTED;
          this.emit("connectionLost", sessionId, error);

          // Attempt recovery if not exceeding max reconnect attempts
          if (stats.reconnectAttempts < options.maxReconnectAttempts) {
            stats.state = ConnectionState.RECONNECTING;
            stats.reconnectAttempts++;
            this.emit("reconnecting", sessionId, stats.reconnectAttempts);

            try {
              if ("browser" in browser) {
                await browser.reloadSession();
              }
              stats.state = ConnectionState.CONNECTED;
              stats.failedChecks = 0;
              this.emit("connectionRestored", sessionId);
            } catch (recoveryErr) {
              stats.state = ConnectionState.FAILED;
              this.emit("recoveryFailed", sessionId, recoveryErr);
            }
          } else {
            stats.state = ConnectionState.FAILED;
            this.emit("maxReconnectAttemptsExceeded", sessionId);
          }
        }
      }
    }, options.healthCheckInterval);

    this.healthChecks.set(sessionId, healthCheck);
  }

  stopMonitoring(sessionId: string): void {
    const healthCheck = this.healthChecks.get(sessionId);
    if (healthCheck) {
      clearInterval(healthCheck);
      this.healthChecks.delete(sessionId);
      this.connectionStats.delete(sessionId);
    }
  }

  getConnectionState(sessionId: string): ConnectionState {
    return (
      this.connectionStats.get(sessionId)?.state ?? ConnectionState.DISCONNECTED
    );
  }

  getConnectionStats(sessionId: string): ConnectionStats | undefined {
    return this.connectionStats.get(sessionId);
  }

  isConnected(sessionId: string): boolean {
    return this.getConnectionState(sessionId) === ConnectionState.CONNECTED;
  }
}
