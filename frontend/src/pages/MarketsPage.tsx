import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, BarChart2, Activity, DollarSign, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import { useMarkets } from "@/lib/hooks";
import { PageHeader } from "@/components/PageHeader";
import { SummaryCard } from "@/components/SummaryCard";
import { JsonViewerDialog } from "@/components/JsonViewerDialog";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatNumber, truncateText, safeGet } from "@/lib/utils";

export function MarketsPage() {
    const { data: markets, isLoading, isError, refetch } = useMarkets();
    const [selectedMarket, setSelectedMarket] = useState<Record<string, unknown> | null>(null);
    const [sortColumn, setSortColumn] = useState<string | null>("volume");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    // Fixed stats calculation with proper edge case handling
    const stats = useMemo(() => {
        if (!markets || !Array.isArray(markets) || markets.length === 0) {
            return { count: 0, totalVolume: 0, maxVolume: 0, avgVolume: 0 };
        }

        let totalVolume = 0;
        let maxVolume = 0;
        let validVolumeCount = 0;

        markets.forEach((m) => {
            const market = m as Record<string, unknown>;
            const rawVolume = safeGet<number | string>(market, ["volume", "volumeUSD", "totalVolume"]);

            // Parse volume safely
            let volume = 0;
            if (typeof rawVolume === "number" && isFinite(rawVolume) && rawVolume >= 0) {
                volume = rawVolume;
            } else if (typeof rawVolume === "string") {
                const parsed = parseFloat(rawVolume);
                if (isFinite(parsed) && parsed >= 0) {
                    volume = parsed;
                }
            }

            // Cap extremely large values (prevent display issues)
            if (volume > 1e15) volume = 0;

            totalVolume += volume;
            if (volume > maxVolume) maxVolume = volume;
            if (volume > 0) validVolumeCount++;
        });

        // Calculate average only from valid volumes to avoid NaN
        const avgVolume = validVolumeCount > 0 ? totalVolume / validVolumeCount : 0;

        return {
            count: markets.length,
            totalVolume: isFinite(totalVolume) ? totalVolume : 0,
            maxVolume: isFinite(maxVolume) ? maxVolume : 0,
            avgVolume: isFinite(avgVolume) ? avgVolume : 0,
        };
    }, [markets]);

    const columns = useMemo(() => {
        if (!markets?.length) return [];
        const sample = markets[0] as Record<string, unknown>;
        const priorityKeys = ["question", "title", "name", "volume", "liquidity", "endDate"];
        const allKeys = Object.keys(sample);
        return priorityKeys.filter((k) => allKeys.includes(k)).concat(allKeys.filter((k) => !priorityKeys.includes(k))).slice(0, 5);
    }, [markets]);

    const sortedData = useMemo(() => {
        if (!markets) return [];
        let result = [...markets] as Record<string, unknown>[];

        if (sortColumn) {
            result.sort((a, b) => {
                const aVal = a[sortColumn];
                const bVal = b[sortColumn];
                if (aVal === bVal) return 0;
                if (aVal === null || aVal === undefined) return 1;
                if (bVal === null || bVal === undefined) return -1;

                // Handle numeric comparison
                const aNum = typeof aVal === "number" ? aVal : parseFloat(String(aVal));
                const bNum = typeof bVal === "number" ? bVal : parseFloat(String(bVal));

                if (!isNaN(aNum) && !isNaN(bNum)) {
                    const cmp = aNum - bNum;
                    return sortDirection === "asc" ? cmp : -cmp;
                }

                const cmp = String(aVal).localeCompare(String(bVal));
                return sortDirection === "asc" ? cmp : -cmp;
            });
        }

        return result;
    }, [markets, sortColumn, sortDirection]);

    const handleSort = (col: string) => {
        if (sortColumn === col) {
            setSortDirection((p) => (p === "asc" ? "desc" : "asc"));
        } else {
            setSortColumn(col);
            setSortDirection("desc");
        }
    };

    const formatCell = (value: unknown, key: string): string => {
        if (value === null || value === undefined) return "—";

        const lowerKey = key.toLowerCase();
        if (lowerKey.includes("volume") || lowerKey.includes("liquidity")) {
            const num = typeof value === "string" ? parseFloat(value) : Number(value);
            if (!isFinite(num)) return "—";
            return formatNumber(num);
        }
        if (typeof value === "object") return truncateText(JSON.stringify(value), 25);
        return truncateText(String(value), 35);
    };

    if (isError) {
        return (
            <div className="min-h-screen pt-24 px-5">
                <div className="max-w-7xl mx-auto">
                    <ErrorState title="Unable to load markets" message="Please check your connection and try again." onRetry={() => refetch()} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-16 px-5">
            <div className="max-w-7xl mx-auto">
                <PageHeader title="Top Markets" description="Highest volume prediction markets by trading activity">
                    <Button onClick={() => refetch()} variant="outline" size="sm">Refresh</Button>
                </PageHeader>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10"
                >
                    <SummaryCard title="Markets" value={stats.count} icon={BarChart2} isLoading={isLoading} />
                    <SummaryCard title="Total Volume" value={formatNumber(stats.totalVolume)} icon={DollarSign} isLoading={isLoading} />
                    <SummaryCard title="Top Market" value={formatNumber(stats.maxVolume)} icon={TrendingUp} isLoading={isLoading} />
                    <SummaryCard title="Avg Volume" value={formatNumber(stats.avgVolume)} icon={Activity} isLoading={isLoading} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {isLoading ? (
                        <div className="rounded-xl border border-white/[0.04] overflow-hidden bg-card/50">
                            <div className="bg-muted/20 px-5 py-4 border-b border-white/[0.04]">
                                <div className="flex gap-6">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-4 w-20" />)}</div>
                            </div>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="px-5 py-4 border-b border-white/[0.03] last:border-0">
                                    <div className="flex gap-6">{[1, 2, 3, 4, 5].map((j) => <Skeleton key={j} className="h-4 w-24" />)}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-white/[0.04] overflow-hidden bg-card/30">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-muted/15 border-b border-white/[0.04]">
                                            {columns.map((col) => (
                                                <th
                                                    key={col}
                                                    onClick={() => handleSort(col)}
                                                    className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none"
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <span>{col.replace(/_/g, " ")}</span>
                                                        {sortColumn === col && (
                                                            <span className="text-primary">
                                                                {sortDirection === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                                            </span>
                                                        )}
                                                    </div>
                                                </th>
                                            ))}
                                            <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider w-20"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {sortedData.map((row, i) => (
                                            <motion.tr
                                                key={i}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
                                                className="hover:bg-white/[0.015] transition-colors cursor-pointer group"
                                                onClick={() => setSelectedMarket(row)}
                                            >
                                                {columns.map((col) => (
                                                    <td key={col} className="px-5 py-4 text-sm text-foreground/90 whitespace-nowrap tabular-nums">
                                                        {formatCell(row[col], col)}
                                                    </td>
                                                ))}
                                                <td className="px-5 py-4 text-right">
                                                    <ExternalLink className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors inline" />
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {!sortedData.length && (
                                <div className="py-16 text-center text-muted-foreground">
                                    <p className="text-sm">No markets available</p>
                                </div>
                            )}
                        </div>
                    )}

                    <p className="text-xs text-muted-foreground/70 text-right mt-3 tabular-nums">
                        {sortedData.length} market{sortedData.length !== 1 ? 's' : ''}
                    </p>
                </motion.div>

                <JsonViewerDialog open={!!selectedMarket} onOpenChange={(open) => !open && setSelectedMarket(null)} data={selectedMarket} title="Market Details" />
            </div>
        </div>
    );
}
