import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, Wallet, TrendingUp, Activity, ExternalLink } from "lucide-react";
import { useWhales } from "@/lib/hooks";
import { PageHeader } from "@/components/PageHeader";
import { SummaryCard } from "@/components/SummaryCard";
import { JsonViewerDialog } from "@/components/JsonViewerDialog";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatNumber, truncateAddress } from "@/lib/utils";
import type { Whale } from "@/lib/api";

export function WhalesPage() {
    const { data: whales, isLoading, isError, refetch } = useWhales();
    const [selectedWhale, setSelectedWhale] = useState<Whale | null>(null);

    const stats = useMemo(() => {
        if (!whales?.length) return { count: 0, totalVolume: 0, avgVolume: 0, maxVolume: 0 };

        let totalVolume = 0;
        let maxVolume = 0;

        whales.forEach((w) => {
            const vol = typeof w.total_volume === "number" && isFinite(w.total_volume) ? w.total_volume : 0;
            totalVolume += vol;
            if (vol > maxVolume) maxVolume = vol;
        });

        return {
            count: whales.length,
            totalVolume: isFinite(totalVolume) ? totalVolume : 0,
            avgVolume: whales.length > 0 && isFinite(totalVolume) ? totalVolume / whales.length : 0,
            maxVolume: isFinite(maxVolume) ? maxVolume : 0,
        };
    }, [whales]);

    if (isError) {
        return (
            <div className="min-h-screen pt-24 px-5">
                <div className="max-w-7xl mx-auto">
                    <ErrorState title="Unable to load whale data" message="Please check your connection and try again." onRetry={() => refetch()} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-16 px-5">
            <div className="max-w-7xl mx-auto">
                <PageHeader title="Whale Tracker" description="Monitor high-volume traders and their market activity">
                    <Button onClick={() => refetch()} variant="outline" size="sm">Refresh</Button>
                </PageHeader>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10"
                >
                    <SummaryCard title="Total Whales" value={stats.count} icon={Users} isLoading={isLoading} />
                    <SummaryCard title="Combined Volume" value={formatNumber(stats.totalVolume)} icon={Wallet} isLoading={isLoading} />
                    <SummaryCard title="Top Whale" value={formatNumber(stats.maxVolume)} icon={TrendingUp} isLoading={isLoading} />
                    <SummaryCard title="Avg Volume" value={formatNumber(stats.avgVolume)} icon={Activity} isLoading={isLoading} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Card key={i}>
                                    <CardContent className="p-5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Skeleton className="h-5 w-32" />
                                            <Skeleton className="h-5 w-16 rounded-full" />
                                        </div>
                                        <Skeleton className="h-4 w-24" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Skeleton className="h-12" />
                                            <Skeleton className="h-12" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {whales?.map((whale, i) => (
                                <motion.div
                                    key={whale.address}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
                                >
                                    <Card
                                        className="group cursor-pointer hover:border-white/[0.08] transition-all duration-300"
                                        onClick={() => setSelectedWhale(whale)}
                                    >
                                        <CardContent className="p-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <p className="font-medium text-foreground text-sm">
                                                        {whale.username || truncateAddress(whale.address)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground/70 font-mono mt-0.5">
                                                        {truncateAddress(whale.address)}
                                                    </p>
                                                </div>
                                                <Badge variant={whale.is_tracked ? "success" : "outline"} className="text-xs">
                                                    {whale.is_tracked ? "Active" : "Inactive"}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
                                                <div>
                                                    <p className="text-xs text-muted-foreground/70 mb-0.5">Volume</p>
                                                    <p className="text-sm font-semibold tabular-nums">{formatNumber(whale.total_volume)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground/70 mb-0.5">Trades</p>
                                                    <p className="text-sm font-semibold tabular-nums">{whale.trade_count?.toLocaleString() || "0"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground/70 mb-0.5">Realized P&L</p>
                                                    <p className={`text-sm font-semibold tabular-nums ${(whale.total_r_pnl || 0) >= 0 ? "text-success" : "text-destructive"}`}>
                                                        {formatNumber(whale.total_r_pnl)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground/70 mb-0.5">Unrealized P&L</p>
                                                    <p className={`text-sm font-semibold tabular-nums ${(whale.total_u_pnl || 0) >= 0 ? "text-success" : "text-destructive"}`}>
                                                        {formatNumber(whale.total_u_pnl)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end pt-3 border-t border-white/[0.04]">
                                                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}

                            {(!whales || whales.length === 0) && (
                                <div className="col-span-full py-16 text-center text-muted-foreground">
                                    <p className="text-sm">No whales found</p>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>

                <JsonViewerDialog open={!!selectedWhale} onOpenChange={(open) => !open && setSelectedWhale(null)} data={selectedWhale} title="Whale Details" />
            </div>
        </div>
    );
}
