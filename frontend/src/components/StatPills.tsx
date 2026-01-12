import { motion } from "framer-motion";
import { TrendingUp, Zap, Target, DollarSign } from "lucide-react";

const stats = [
    { value: "50K+", label: "Markets Tracked", icon: TrendingUp },
    { value: "<1s", label: "Data Refresh", icon: Zap },
    { value: "99.9%", label: "Accuracy", icon: Target },
    { value: "$500M+", label: "Volume Analyzed", icon: DollarSign },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.8 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function StatPills() {
    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-wrap justify-center gap-3 md:gap-4">
            {stats.map((stat) => (
                <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/40 bg-card/60 backdrop-blur-md shadow-lg hover:border-primary/30 transition-colors"
                >
                    <stat.icon className="h-4 w-4 text-primary/70" />
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-foreground">{stat.value}</span>
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
