import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

interface SummaryCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    isLoading?: boolean;
}

export function SummaryCard({ title, value, icon: Icon, description, isLoading }: SummaryCardProps) {
    if (isLoading) {
        return (
            <div className="stat-card p-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-2.5 flex-1">
                        <Skeleton className="h-3.5 w-20" />
                        <Skeleton className="h-7 w-28" />
                        {description && <Skeleton className="h-3 w-16" />}
                    </div>
                    <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="stat-card p-5 group"
        >
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">{title}</p>
                    <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">{value}</p>
                    {description && <p className="text-xs text-muted-foreground/60">{description}</p>}
                </div>
                <div className="p-2 rounded-lg bg-primary/8 group-hover:bg-primary/12 transition-colors">
                    <Icon className="h-5 w-5 text-primary/80" />
                </div>
            </div>
        </motion.div>
    );
}
