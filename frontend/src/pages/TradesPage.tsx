import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, Clock, Loader2, TrendingUp, Activity, Eye } from "lucide-react";
import { useTrades } from "@/lib/hooks";
import { PageHeader } from "@/components/PageHeader";
import { SummaryCard } from "@/components/SummaryCard";
import { JsonViewerDialog } from "@/components/JsonViewerDialog";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { formatNumber, formatDate, truncateAddress, truncateText } from "@/lib/utils";
import type { Trade } from "@/lib/api";

export function TradesPage() {
    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useTrades(50);
    const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

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
            totalVolume += (t.size || 0) * (t.price || 0);
            if (t.side?.toLowerCase() === "buy") buys++;
            else if (t.side?.toLowerCase() === "sell") sells++;
        });

        return { count: allTrades.length, totalVolume, buys, sells };
    }, [allTrades]);

    if (isError) {
        return (
            <div className="min-h-screen pt-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <ErrorState title="Failed to load trades" message="Check if the API is running." onRetry={() => refetch()} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <PageHeader title="Live Trades" description="Real-time trade feed from prediction markets">
                    <Button onClick={() => refetch()} variant="outline" size="sm">Refresh</Button>
                </PageHeader>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <SummaryCard title="Total Trades" value={stats.count} icon={ArrowDownUp} isLoading={isLoading} />
                    <SummaryCard title="Total Volume" value={formatNumber(stats.totalVolume)} icon={TrendingUp} isLoading={isLoading} />
                    <SummaryCard title="Buy Orders" value={stats.buys} icon={Activity} description="Detected buys" isLoading={isLoading} />
                    <SummaryCard title="Sell Orders" value={stats.sells} icon={Clock} description="Detected sells" isLoading={isLoading} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                    {isLoading ? (
                        <div className="rounded-xl border border-border/50 overflow-hidden">
                            <div className="bg-muted/30 p-4"><div className="flex gap-4">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-4 w-20" />)}</div></div>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="p-4 border-t border-border/30"><div className="flex gap-4">{[1, 2, 3, 4, 5].map((j) => <Skeleton key={j} className="h-4 w-20" />)}</div></div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-border/50 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-muted/30 border-b border-border/30">
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Time</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Asset</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Side</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Size</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Price</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Wallet</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/30">
                                        {allTrades.map((trade, i) => (
                                            <motion.tr key={trade.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: Math.min(i, 20) * 0.02 }}
                                                className="bg-card/30 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelectedTrade(trade)}>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(trade.timestamp)}</td>
                                                <td className="px-4 py-3 text-sm text-foreground font-medium">{truncateText(trade.asset, 25)}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant={trade.side?.toLowerCase() === "buy" ? "success" : trade.side?.toLowerCase() === "sell" ? "destructive" : "outline"}>
                                                        {trade.side || "—"}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-foreground">{trade.size?.toFixed(2) || "—"}</td>
                                                <td className="px-4 py-3 text-sm text-foreground">${trade.price?.toFixed(4) || "—"}</td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{truncateAddress(trade.wallet_address)}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant={trade.status === "OPEN" ? "default" : trade.status === "CLOSED" ? "secondary" : "outline"}>
                                                        {trade.status || "—"}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button variant="ghost" size="sm" className="gap-1"><Eye className="h-3 w-3" /> View</Button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {!allTrades.length && <div className="py-12 text-center text-muted-foreground">No trades found</div>}
                        </div>
                    )}
                </motion.div>

                {hasNextPage && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex justify-center mt-8">
                        <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} variant="outline" size="lg" className="gap-2">
                            {isFetchingNextPage ? <><Loader2 className="h-4 w-4 animate-spin" /> Loading...</> : <>Load More <ArrowDownUp className="h-4 w-4" /></>}
                        </Button>
                    </motion.div>
                )}

                <JsonViewerDialog open={!!selectedTrade} onOpenChange={(open) => !open && setSelectedTrade(null)} data={selectedTrade} title="Trade Details" />
            </div>
        </div>
    );
}
