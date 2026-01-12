import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, Wallet, TrendingUp, Activity, Search, Eye } from "lucide-react";
import { useWhales } from "@/lib/hooks";
import { PageHeader } from "@/components/PageHeader";
import { SummaryCard } from "@/components/SummaryCard";
import { JsonViewerDialog } from "@/components/JsonViewerDialog";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatNumber, truncateAddress } from "@/lib/utils";
import type { Whale } from "@/lib/api";

export function WhalesPage() {
    const { data: whales, isLoading, isError, refetch } = useWhales();
    const [selectedWhale, setSelectedWhale] = useState<Whale | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [minVolume, setMinVolume] = useState("");

    const stats = useMemo(() => {
        if (!whales?.length) return { count: 0, totalVolume: 0, avgVolume: 0, maxVolume: 0 };

        let totalVolume = 0;
        let maxVolume = 0;

        whales.forEach((w) => {
            const vol = w.total_volume || 0;
            totalVolume += vol;
            if (vol > maxVolume) maxVolume = vol;
        });

        return {
            count: whales.length,
            totalVolume,
            avgVolume: whales.length > 0 ? totalVolume / whales.length : 0,
            maxVolume,
        };
    }, [whales]);

    const filteredWhales = useMemo(() => {
        if (!whales) return [];
        let result = [...whales];

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter((w) =>
                w.address.toLowerCase().includes(q) || (w.username && w.username.toLowerCase().includes(q))
            );
        }

        if (minVolume) {
            const min = parseFloat(minVolume);
            if (!isNaN(min)) result = result.filter((w) => (w.total_volume || 0) >= min);
        }

        return result;
    }, [whales, searchQuery, minVolume]);

    if (isError) {
        return (
            <div className="min-h-screen pt-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <ErrorState title="Failed to load whales" message="Check if the API is running." onRetry={() => refetch()} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <PageHeader title="Whale Tracker" description="Monitor high-volume traders and their activity">
                    <Button onClick={() => refetch()} variant="outline" size="sm">Refresh</Button>
                </PageHeader>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <SummaryCard title="Total Whales" value={stats.count} icon={Users} isLoading={isLoading} />
                    <SummaryCard title="Total Volume" value={formatNumber(stats.totalVolume)} icon={Wallet} isLoading={isLoading} />
                    <SummaryCard title="Largest Whale" value={formatNumber(stats.maxVolume)} icon={TrendingUp} isLoading={isLoading} />
                    <SummaryCard title="Average Volume" value={formatNumber(stats.avgVolume)} icon={Activity} isLoading={isLoading} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
                    className="mb-6 flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by address or username..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                    </div>
                    <div className="w-full sm:w-auto">
                        <Input type="number" placeholder="Min volume..." value={minVolume} onChange={(e) => setMinVolume(e.target.value)} className="w-full sm:w-40" />
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Card key={i}><CardContent className="p-6 space-y-3"><Skeleton className="h-5 w-32" /><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-20" /></CardContent></Card>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredWhales.map((whale, i) => (
                                <motion.div key={whale.address} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                                    <Card className="hover:border-primary/30 transition-colors cursor-pointer" onClick={() => setSelectedWhale(whale)}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <p className="font-medium text-foreground">{whale.username || truncateAddress(whale.address)}</p>
                                                    <p className="text-xs text-muted-foreground font-mono">{truncateAddress(whale.address)}</p>
                                                </div>
                                                <Badge variant={whale.is_tracked ? "success" : "outline"}>{whale.is_tracked ? "Tracked" : "Inactive"}</Badge>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Total Volume</p>
                                                    <p className="text-sm font-semibold">{formatNumber(whale.total_volume)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Trade Count</p>
                                                    <p className="text-sm font-semibold">{whale.trade_count}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Realized PnL</p>
                                                    <p className={`text-sm font-semibold ${whale.total_r_pnl >= 0 ? "text-green-500" : "text-red-500"}`}>{formatNumber(whale.total_r_pnl)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Unrealized PnL</p>
                                                    <p className={`text-sm font-semibold ${whale.total_u_pnl >= 0 ? "text-green-500" : "text-red-500"}`}>{formatNumber(whale.total_u_pnl)}</p>
                                                </div>
                                            </div>

                                            <Button variant="ghost" size="sm" className="w-full gap-1"><Eye className="h-3 w-3" /> View Details</Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}

                            {!filteredWhales.length && !isLoading && (
                                <div className="col-span-full py-12 text-center text-muted-foreground">No whales found 🐋</div>
                            )}
                        </div>
                    )}
                </motion.div>

                <JsonViewerDialog open={!!selectedWhale} onOpenChange={(open) => !open && setSelectedWhale(null)} data={selectedWhale} title="Whale Details" />
            </div>
        </div>
    );
}
