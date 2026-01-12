import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getApiStatus, getMarkets, getWhales, getTrades } from "./api";
import { queryKeys } from "./queryClient";

export function useApiStatus() {
    return useQuery({
        queryKey: queryKeys.status,
        queryFn: getApiStatus,
        refetchInterval: 30000,
        retry: 1,
    });
}

export function useMarkets() {
    return useQuery({
        queryKey: queryKeys.markets,
        queryFn: getMarkets,
        staleTime: 60000,
    });
}

export function useWhales() {
    return useQuery({
        queryKey: queryKeys.whales,
        queryFn: getWhales,
        staleTime: 60000,
    });
}

export function useTrades(limit: number = 50) {
    return useInfiniteQuery({
        queryKey: queryKeys.tradesInfinite,
        queryFn: async ({ pageParam = 0 }) => {
            const data = await getTrades({ skip: pageParam, limit });
            return {
                data,
                nextCursor: data.length === limit ? pageParam + limit : undefined,
            };
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        staleTime: 15000,
    });
}
