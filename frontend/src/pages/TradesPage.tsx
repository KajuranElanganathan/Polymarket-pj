import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, Clock, Loader2, TrendingUp, Activity, ExternalLink, RefreshCw } from "lucide-react";
import { useTrades } from "@/lib/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";
import { PageHeader } from "@/components/PageHeader";
import { SummaryCard } from "@/components/SummaryCard";
import { JsonViewerDialog } from "@/components/JsonViewerDialog";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { formatNumber, formatDate, truncateAddress, truncateText } from "@/lib/utils";
import type { Trade } from "@/lib/api";

/**
 * Trades Page - displays whale/insider trades
 * 
 * DATA SOURCE: GET /trades endpoint from database
 * 
 * METRICS BREAKDOWN:
 * - Total Trades: Count of trades returned (allTrades.length)
 * - Volume: Sum of (trade.size * trade.price) for all trades
 * - Buy Orders: Count of trades where side === "buy"
 * - Sell Orders: Count of trades where side === "sell"
 */

export function TradesPage() {
    const queryClient = useQueryClient();
    const { data, isLoading, isError, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useTrades(50);
    const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

    // Force refresh - invalidates cache and refetches
    const handleRefresh = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tradesInfinite });
    }, [queryClient]);

    const allTrades = useMemo(() => {
        if (!data?.pages) return [];
        return data.pages.flatMap((page) => page.data);
    }, [data]);

    const stats = useMemo(() => {
        if (!allTrades.length) return { count: 0, totalVolume: 0, buys: 0, sells: 0 };

        let totalVolume = 0;
        let buys = 0;
        let sells = 0;

        allTrades.forEach((t) => {
            const size = typeof t.size === "number" && isFinite(t.size) ? t.size : 0;
            const price = typeof t.price === "number" && isFinite(t.price) ? t.price : 0;
            totalVolume += size * price;

            const side = t.side?.toLowerCase();
            if (side === "buy") buys++;
            else if (side === "sell") sells++;
        });

        return {
            count: allTrades.length,
            totalVolume: isFinite(totalVolume) ? totalVolume : 0,
            buys,
            sells
        };
    }, [allTrades]);

    if (isError) {
        return (
            <div className="min-h-screen pt-24 px-5">
                <div className="max-w-7xl mx-auto">
                    <ErrorState title="Unable to load trades" message="Please check your connection and try again." onRetry={handleRefresh} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-16 px-5">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="Whale / Insider Trades"
                    description="Track high-impact trades from major market participants"
                >
                    <Button
                        onClick={handleRefresh}
                        variant="outline"
                        size="sm"
                        disabled={isFetching}
                        className="gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                        {isFetching ? 'Loading...' : 'Refresh'}
                    </Button>
                </PageHeader>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10"
                >
                    <SummaryCard title="Total Trades" value={stats.count} icon={ArrowDownUp} isLoading={isLoading} />
                    <SummaryCard title="Volume" value={formatNumber(stats.totalVolume)} icon={TrendingUp} isLoading={isLoading} />
                    <SummaryCard title="Buy Orders" value={stats.buys} icon={Activity} isLoading={isLoading} />
                    <SummaryCard title="Sell Orders" value={stats.sells} icon={Clock} isLoading={isLoading} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {isLoading ? (
                        <div className="rounded-xl border border-white/[0.04] overflow-hidden bg-card/50">
                            <div className="bg-muted/20 px-5 py-4 border-b border-white/[0.04]">
                                <div className="flex gap-8">{[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-4 w-16" />)}</div>
                            </div>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="px-5 py-4 border-b border-white/[0.03] last:border-0">
                                    <div className="flex gap-8">{[1, 2, 3, 4, 5, 6].map((j) => <Skeleton key={j} className="h-4 w-20" />)}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-white/[0.04] overflow-hidden bg-card/30">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-muted/15 border-b border-white/[0.04]">
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Asset</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Side</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Size</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Wallet</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                            <th className="px-5 py-3.5 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {allTrades.map((trade, i) => (
                                            <motion.tr
                                                key={trade.id || i}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.4) }}
                                                className="hover:bg-white/[0.015] transition-colors cursor-pointer group"
                                                onClick={() => setSelectedTrade(trade)}
                                            >
                                                <td className="px-5 py-4 text-sm text-muted-foreground/80 whitespace-nowrap tabular-nums">
                                                    {formatDate(trade.timestamp)}
                                                </td>
                                                <td className="px-5 py-4 text-sm text-foreground font-medium whitespace-nowrap">
                                                    {truncateText(trade.asset || "—", 22)}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <Badge
                                                        variant={trade.side?.toLowerCase() === "buy" ? "success" : trade.side?.toLowerCase() === "sell" ? "destructive" : "outline"}
                                                        className="text-xs font-medium"
                                                    >
                                                        {trade.side || "—"}
                                                    </Badge>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-foreground/90 tabular-nums">
                                                    {typeof trade.size === "number" ? trade.size.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}
                                                </td>
                                                <td className="px-5 py-4 text-sm text-foreground/90 tabular-nums">
                                                    {typeof trade.price === "number" ? `$${trade.price.toFixed(4)}` : "—"}
                                                </td>
                                                <td className="px-5 py-4 text-sm text-muted-foreground/70 font-mono">
                                                    {truncateAddress(trade.wallet_address)}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <Badge
                                                        variant={trade.status === "OPEN" ? "default" : trade.status === "CLOSED" ? "secondary" : "outline"}
                                                        className="text-xs"
                                                    >
                                                        {trade.status || "—"}
                                                    </Badge>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {!allTrades.length && (
                                <div className="py-16 text-center text-muted-foreground">
                                    <p className="text-sm">No trades recorded yet</p>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>

                {hasNextPage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-center mt-8"
                    >
                        <Button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            variant="outline"
                            size="lg"
                            className="gap-2"
                        >
                            {isFetchingNextPage ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Loading...</>
                            ) : (
                                <>Load More</>
                            )}
                        </Button>
                    </motion.div>
                )}

                <JsonViewerDialog open={!!selectedTrade} onOpenChange={(open) => !open && setSelectedTrade(null)} data={selectedTrade} title="Trade Details" />
            </div>
        </div>
    );
}
