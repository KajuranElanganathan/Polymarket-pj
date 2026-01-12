const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: unknown
    ) {
        super(message);
        this.name = "ApiError";
    }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new ApiError(
                `HTTP ${response.status}: ${response.statusText}`,
                response.status,
                errorData
            );
        }

        return await response.json() as T;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        if (error instanceof TypeError) {
            throw new ApiError("Network error - unable to connect to server", 0);
        }
        throw new ApiError(
            error instanceof Error ? error.message : "Unknown error",
            -1
        );
    }
}

// Types based on your db.py models
export interface Whale {
    address: string;
    username: string | null;
    is_tracked: boolean;
    total_r_pnl: number;
    total_u_pnl: number;
    total_volume: number;
    trade_count: number;
}

export interface Trade {
    id: number;
    wallet_address: string;
    asset: string;
    side: string;
    size: number;
    price: number;
    timestamp: number;
    status: string;
    realized_pnl: number;
    unrealized_pnl: number;
}

export interface StatusResponse {
    online: string;
}

// API functions
export async function getApiStatus(): Promise<StatusResponse> {
    return fetchApi<StatusResponse>("/");
}

export async function getMarkets(): Promise<unknown[]> {
    const data = await fetchApi<unknown>("/home");
    return Array.isArray(data) ? data : [];
}

export async function getWhales(): Promise<Whale[]> {
    const data = await fetchApi<unknown>("/whales");
    return Array.isArray(data) ? data : [];
}

export interface TradesParams {
    skip?: number;
    limit?: number;
}

export async function getTrades(params: TradesParams = {}): Promise<Trade[]> {
    const { skip = 0, limit = 50 } = params;
    const data = await fetchApi<unknown>(`/trades?skip=${skip}&limit=${limit}`);
    return Array.isArray(data) ? data : [];
}

export async function fetchEndpoint(endpoint: string): Promise<unknown> {
    return fetchApi<unknown>(endpoint);
}

export { BASE_URL };
