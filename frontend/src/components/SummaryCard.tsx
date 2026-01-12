import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
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
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-32" />
                            {description && <Skeleton className="h-3 w-20" />}
                        </div>
                        <Skeleton className="h-10 w-10 rounded-lg" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">{title}</p>
                            <p className="text-2xl font-bold text-foreground">{value}</p>
                            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
                        </div>
                        <div className="p-2.5 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
