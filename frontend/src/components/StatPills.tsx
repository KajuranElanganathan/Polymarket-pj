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
        transition: { staggerChildren: 0.08, delayChildren: 0.6 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function StatPills() {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-3"
        >
            {stats.map((stat) => (
                <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/[0.04] bg-white/[0.02] backdrop-blur-sm"
                >
                    <stat.icon className="h-4 w-4 text-primary/60" />
                    <div>
                        <span className="text-base font-bold text-foreground tabular-nums">{stat.value}</span>
                        <span className="text-xs text-muted-foreground/60 ml-1.5">{stat.label}</span>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
