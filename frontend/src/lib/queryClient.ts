import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 2,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
        },
    },
});

export const queryKeys = {
    status: ["status"] as const,
    markets: ["markets"] as const,
    whales: ["whales"] as const,
    trades: (skip: number, limit: number) => ["trades", skip, limit] as const,
    tradesInfinite: ["trades-infinite"] as const,
};
