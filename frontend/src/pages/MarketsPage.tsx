import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, BarChart2, Activity, DollarSign, Search, ChevronUp, ChevronDown, Eye } from "lucide-react";
import { useMarkets } from "@/lib/hooks";
import { PageHeader } from "@/components/PageHeader";
import { SummaryCard } from "@/components/SummaryCard";
import { JsonViewerDialog } from "@/components/JsonViewerDialog";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatNumber, truncateText, safeGet } from "@/lib/utils";

export function MarketsPage() {
    const { data: markets, isLoading, isError, refetch } = useMarkets();
    const [selectedMarket, setSelectedMarket] = useState<Record<string, unknown> | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    const stats = useMemo(() => {
        if (!markets?.length) return { count: 0, totalVolume: 0, maxVolume: 0, avgVolume: 0 };

        let totalVolume = 0;
        let maxVolume = 0;

        markets.forEach((m) => {
            const market = m as Record<string, unknown>;
            const volume = safeGet<number>(market, ["volume", "volumeUSD", "totalVolume"]) || 0;
            totalVolume += volume;
            if (volume > maxVolume) maxVolume = volume;
        });

        return {
            count: markets.length,
            totalVolume,
            maxVolume,
            avgVolume: markets.length > 0 ? totalVolume / markets.length : 0,
        };
    }, [markets]);

    const columns = useMemo(() => {
        if (!markets?.length) return [];
        const sample = markets[0] as Record<string, unknown>;
        const priorityKeys = ["question", "title", "name", "volume", "volumeUSD", "liquidity", "endDate", "outcomePrices"];
        const allKeys = Object.keys(sample);
        return priorityKeys.filter((k) => allKeys.includes(k)).concat(allKeys.filter((k) => !priorityKeys.includes(k))).slice(0, 6);
    }, [markets]);

    const filteredData = useMemo(() => {
        if (!markets) return [];
        let result = [...markets] as Record<string, unknown>[];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter((row) =>
                Object.values(row).some((v) => String(v).toLowerCase().includes(query))
            );
        }

        if (sortColumn) {
            result.sort((a, b) => {
                const aVal = a[sortColumn];
                const bVal = b[sortColumn];
                if (aVal === bVal) return 0;
                if (aVal === null || aVal === undefined) return 1;
                if (bVal === null || bVal === undefined) return -1;
                const cmp = typeof aVal === "number" && typeof bVal === "number" ? aVal - bVal : String(aVal).localeCompare(String(bVal));
                return sortDirection === "asc" ? cmp : -cmp;
            });
        }

        return result;
    }, [markets, searchQuery, sortColumn, sortDirection]);

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
        if (key.toLowerCase().includes("volume") || key.toLowerCase().includes("liquidity")) {
            const num = typeof value === "string" ? parseFloat(value) : Number(value);
            return isNaN(num) ? String(value) : formatNumber(num);
        }
        if (typeof value === "object") return truncateText(JSON.stringify(value), 30);
        return truncateText(String(value), 40);
    };

    if (isError) {
        return (
            <div className="min-h-screen pt-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <ErrorState title="Failed to load markets" message="Check if the API is running." onRetry={() => refetch()} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <PageHeader title="Top Markets" description="Track the highest volume prediction markets">
                    <Button onClick={() => refetch()} variant="outline" size="sm">Refresh</Button>
                </PageHeader>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <SummaryCard title="Total Markets" value={stats.count} icon={BarChart2} isLoading={isLoading} />
                    <SummaryCard title="Total Volume" value={formatNumber(stats.totalVolume)} icon={DollarSign} isLoading={isLoading} />
                    <SummaryCard title="Highest Volume" value={formatNumber(stats.maxVolume)} icon={TrendingUp} isLoading={isLoading} />
                    <SummaryCard title="Average Volume" value={formatNumber(stats.avgVolume)} icon={Activity} isLoading={isLoading} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="space-y-4">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search markets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                    </div>

                    {isLoading ? (
                        <div className="rounded-xl border border-border/50 overflow-hidden">
                            <div className="bg-muted/30 p-4"><div className="flex gap-4">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-4 w-24" />)}</div></div>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="p-4 border-t border-border/30"><div className="flex gap-4">{[1, 2, 3, 4].map((j) => <Skeleton key={j} className="h-4 w-24" />)}</div></div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-border/50 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-muted/30 border-b border-border/30">
                                            {columns.map((col) => (
                                                <th key={col} onClick={() => handleSort(col)} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors">
                                                    <div className="flex items-center gap-1">
                                                        <span>{col.replace(/_/g, " ")}</span>
                                                        {sortColumn === col && (sortDirection === "asc" ? <ChevronUp className="h-3 w-3 text-primary" /> : <ChevronDown className="h-3 w-3 text-primary" />)}
                                                    </div>
                                                </th>
                                            ))}
                                            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/30">
                                        {filteredData.map((row, i) => (
                                            <motion.tr key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.02 }}
                                                className="bg-card/30 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelectedMarket(row)}>
                                                {columns.map((col) => (
                                                    <td key={col} className="px-4 py-3 text-sm text-foreground whitespace-nowrap">{formatCell(row[col], col)}</td>
                                                ))}
                                                <td className="px-4 py-3 text-right">
                                                    <Button variant="ghost" size="sm" className="gap-1"><Eye className="h-3 w-3" /> View</Button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {!filteredData.length && <div className="py-12 text-center text-muted-foreground">No markets found</div>}
                        </div>
                    )}

                    <p className="text-xs text-muted-foreground text-right">Showing {filteredData.length} of {markets?.length || 0} results</p>
                </motion.div>

                <JsonViewerDialog open={!!selectedMarket} onOpenChange={(open) => !open && setSelectedMarket(null)} data={selectedMarket} title="Market Details" />
            </div>
        </div>
    );
}
