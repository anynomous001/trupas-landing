/**
 * Dashboard WebSocket Client
 * Real-time updates for dashboard metrics and alerts
 * Adapted for Vite environment
 */

import type {
    DashboardUpdateMessage,
    AlertItem,
} from '../types/dashboard.types';

// ============================================================================
// Configuration
// ============================================================================

const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/api/v1';
const PING_INTERVAL = 30000; // 30 seconds
const RECONNECT_DELAY = 3000; // 3 seconds
const MAX_RECONNECT_ATTEMPTS = 5;

// ============================================================================
// WebSocket Message Types
// ============================================================================

interface WebSocketMessage {
    type: string;
    token?: string;
    data?: any;
    message?: string;
    timestamp?: string;
}

// ============================================================================
// Dashboard WebSocket Class
// ============================================================================

export class DashboardWebSocket {
    private ws: WebSocket | null = null;
    private token: string;
    private reconnectAttempts = 0;
    private pingInterval: number | null = null;
    private reconnectTimeout: number | null = null;
    private isIntentionallyClosed = false;

    // Event handlers
    private onUpdateCallback: ((data: any) => void) | null = null;
    private onErrorCallback: ((error: string) => void) | null = null;
    private onConnectedCallback: (() => void) | null = null;
    private onDisconnectedCallback: (() => void) | null = null;

    constructor(token: string) {
        this.token = token;
    }

    /**
     * Connect to WebSocket
     */
    connect(): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            console.warn('WebSocket already connected');
            return;
        }

        this.isIntentionallyClosed = false;
        const url = `${WS_BASE_URL}/ws/dashboard?token=${this.token}`;

        try {
            this.ws = new WebSocket(url);

            this.ws.onopen = () => {
                console.log('Dashboard WebSocket connected');
                this.reconnectAttempts = 0;
                this.startPingInterval();
                this.subscribe();
                this.onConnectedCallback?.();
            };

            this.ws.onmessage = (event) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data);
                    this.handleMessage(message);
                } catch (error) {
                    console.error('Failed to parse WebSocket message:', error);
                }
            };

            this.ws.onerror = (error) => {
                console.error('Dashboard WebSocket error:', error);
                this.onErrorCallback?.('WebSocket connection error');
            };

            this.ws.onclose = (event) => {
                console.log('Dashboard WebSocket closed:', event.code, event.reason);
                this.cleanup();
                this.onDisconnectedCallback?.();

                // Auto-reconnect if not intentionally closed
                if (!this.isIntentionallyClosed && this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                    this.scheduleReconnect();
                }
            };
        } catch (error) {
            console.error('Failed to create WebSocket:', error);
            this.onErrorCallback?.('Failed to create WebSocket connection');
        }
    }

    /**
     * Disconnect from WebSocket
     */
    disconnect(): void {
        this.isIntentionallyClosed = true;
        this.cleanup();

        if (this.ws) {
            this.ws.close(1000, 'Client disconnecting');
            this.ws = null;
        }
    }

    /**
     * Subscribe to dashboard updates
     */
    private subscribe(): void {
        this.send({
            type: 'subscribe',
            token: this.token,
        });
    }

    /**
     * Send message to server
     */
    private send(message: WebSocketMessage): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket not connected, cannot send message');
        }
    }

    /**
     * Handle incoming message
     */
    private handleMessage(message: WebSocketMessage): void {
        switch (message.type) {
            case 'pong':
                // Pong received, connection alive
                break;

            case 'dashboard_update':
            case 'update':
            case 'new_alert':
            case 'location_update':
                // Forward the whole message to allow component to check message.type
                this.onUpdateCallback?.(message);
                break;

            case 'error':
                console.error('WebSocket error message:', message.message);
                this.onErrorCallback?.(message.message || 'Unknown error');
                break;

            case 'connected':
                console.log('WebSocket connected message received');
                break;

            default:
                console.warn('Unknown message type:', message.type);
        }
    }

    /**
     * Start ping interval to keep connection alive
     */
    private startPingInterval(): void {
        this.pingInterval = window.setInterval(() => {
            this.send({
                type: 'ping',
                token: this.token,
            });
        }, PING_INTERVAL);
    }

    /**
     * Schedule reconnection attempt
     */
    private scheduleReconnect(): void {
        this.reconnectAttempts++;
        console.log(`Scheduling reconnect attempt ${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);

        this.reconnectTimeout = window.setTimeout(() => {
            console.log('Attempting to reconnect...');
            this.connect();
        }, RECONNECT_DELAY);
    }

    /**
     * Cleanup intervals and timeouts
     */
    private cleanup(): void {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }

        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
    }

    /**
     * Set event handlers
     */
    onUpdate(callback: (data: any) => void): void {
        this.onUpdateCallback = callback;
    }

    onError(callback: (error: string) => void): void {
        this.onErrorCallback = callback;
    }

    onConnected(callback: () => void): void {
        this.onConnectedCallback = callback;
    }

    onDisconnected(callback: () => void): void {
        this.onDisconnectedCallback = callback;
    }

    /**
     * Get connection state
     */
    isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }
}
