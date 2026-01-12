import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatPills } from "@/components/StatPills";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center pt-20">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
                />

                {/* Stars */}
                <div className="absolute inset-0">
                    {[...Array(50)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0.2, 0.8, 0.2] }}
                            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                        />
                    ))}
                </div>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Globe Visualization */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative order-2 lg:order-1"
                    >
                        <div className="relative aspect-square max-w-lg mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent rounded-full blur-2xl" />

                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                className="relative w-full h-full"
                            >
                                <div className="absolute inset-8 rounded-full border border-primary/20 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" style={{ top: `${(i + 1) * 14}%` }} />
                                    ))}
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="absolute h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" style={{ left: `${(i + 1) * 11}%` }} />
                                    ))}
                                    <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-1/4 left-1/3 w-2 h-2 bg-primary rounded-full shadow-glow" />
                                    <motion.div animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} className="absolute top-1/2 right-1/4 w-3 h-3 bg-secondary rounded-full shadow-glow-purple" />
                                    <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1 }} className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-primary rounded-full shadow-glow" />
                                </div>
                            </motion.div>

                            {/* Chart overlay */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="absolute -top-4 -left-4 w-48 bg-card/90 backdrop-blur-xl border border-border/50 rounded-xl p-3 shadow-card"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                    </div>
                                </div>
                                <svg viewBox="0 0 100 40" className="w-full h-12">
                                    <path d="M 0 35 Q 20 30, 30 20 T 50 25 T 70 10 T 100 15" fill="none" stroke="url(#chartGradient)" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M 0 30 Q 25 35, 40 25 T 60 30 T 85 20 T 100 25" fill="none" stroke="url(#chartGradient2)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
                                            <stop offset="100%" stopColor="hsl(270, 70%, 60%)" />
                                        </linearGradient>
                                        <linearGradient id="chartGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="hsl(270, 70%, 60%)" />
                                            <stop offset="100%" stopColor="hsl(217, 91%, 60%)" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Hero Text */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="order-1 lg:order-2 text-center lg:text-left"
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                        >
                            Unlock the Markets:{" "}
                            <span className="text-gradient">Polymarket Analytics</span>{" "}
                            Evolved.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
                        >
                            Real-time insights, predictive modeling, and deep data for every prediction market. See what others miss.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="flex flex-wrap gap-4 justify-center lg:justify-start mb-16"
                        >
                            <Link to="/markets">
                                <Button size="lg" className="gap-2 group">
                                    Explore Platform
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Link to="/trades">
                                <Button variant="outline" size="lg" className="gap-2">
                                    <Play className="h-4 w-4" />
                                    View Live Data
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="mt-8 lg:mt-16"
                >
                    <StatPills />
                </motion.div>
            </div>
        </section>
    );
}
