import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatPills } from "@/components/StatPills";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center pt-16">
            {/* Subtle background gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/[0.02] rounded-full blur-[100px]" />

                {/* Subtle stars */}
                <div className="absolute inset-0">
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0.1, 0.4, 0.1] }}
                            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
                            className="absolute w-px h-px bg-white rounded-full"
                            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                        />
                    ))}
                </div>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Globe Visualization - kept as requested */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="relative order-2 lg:order-1"
                    >
                        <div className="relative aspect-square max-w-md mx-auto">
                            {/* Outer glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 rounded-full blur-3xl" />

                            {/* Rotating globe */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                                className="relative w-full h-full"
                            >
                                <div className="absolute inset-8 rounded-full border border-white/[0.06] overflow-hidden">
                                    {/* Globe background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-secondary/[0.02]" />

                                    {/* Latitude lines */}
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={`lat-${i}`}
                                            className="absolute w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
                                            style={{ top: `${(i + 1) * 16}%` }}
                                        />
                                    ))}

                                    {/* Longitude lines */}
                                    {[...Array(7)].map((_, i) => (
                                        <div
                                            key={`lng-${i}`}
                                            className="absolute h-full w-px bg-gradient-to-b from-transparent via-white/[0.04] to-transparent"
                                            style={{ left: `${(i + 1) * 12}%` }}
                                        />
                                    ))}

                                    {/* Data points */}
                                    <motion.div
                                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                                        transition={{ duration: 2.5, repeat: Infinity }}
                                        className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-primary rounded-full shadow-glow-sm"
                                    />
                                    <motion.div
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                        className="absolute top-1/2 right-1/4 w-2 h-2 bg-secondary/80 rounded-full"
                                    />
                                    <motion.div
                                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                        className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-primary/80 rounded-full"
                                    />
                                </div>
                            </motion.div>

                            {/* Chart overlay card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute -top-2 -left-2 sm:top-0 sm:left-0 w-40 bg-card/90 backdrop-blur-xl border border-white/[0.06] rounded-lg p-3 shadow-card"
                            >
                                <div className="flex items-center gap-1.5 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-destructive/80" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-warning/80" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-success/80" />
                                </div>
                                <svg viewBox="0 0 100 35" className="w-full h-10">
                                    <path
                                        d="M 0 30 Q 15 28, 25 18 T 45 22 T 65 8 T 100 12"
                                        fill="none"
                                        stroke="url(#chartGradient)"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="hsl(210, 100%, 52%)" />
                                            <stop offset="100%" stopColor="hsl(262, 60%, 55%)" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Hero Text */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="order-1 lg:order-2 text-center lg:text-left"
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6 text-balance"
                        >
                            Unlock the Markets:{" "}
                            <span className="text-gradient">Polymarket Analytics</span>{" "}
                            Evolved.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="text-base sm:text-lg text-muted-foreground/80 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            Real-time insights, predictive modeling, and deep data for every prediction market. See what others miss.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-16"
                        >
                            <Link to="/markets">
                                <Button size="lg" className="w-full sm:w-auto gap-2 group">
                                    Explore Platform
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </Button>
                            </Link>
                            <Link to="/trades">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                                    <Play className="h-4 w-4" />
                                    View Live Data
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-8 lg:mt-20"
                >
                    <StatPills />
                </motion.div>
            </div>
        </section>
    );
}
