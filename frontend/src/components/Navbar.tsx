import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ApiStatusBadge } from "@/components/ApiStatusBadge";
import { cn } from "@/lib/utils";

const navLinks = [
    { name: "Markets", href: "/markets" },
    { name: "Whales", href: "/whales" },
    { name: "Trades", href: "/trades" },
];

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-50"
        >
            <div className="absolute inset-0 bg-background/70 backdrop-blur-2xl border-b border-white/[0.04]" />

            <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                            className="relative"
                        >
                            <BarChart3 className="h-7 w-7 text-primary" />
                            <div className="absolute inset-0 blur-xl bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>
                        <span className="text-lg font-semibold tracking-tight text-foreground">
                            Poly<span className="text-primary">Metrics</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                    location.pathname === link.href
                                        ? "text-foreground bg-white/[0.04]"
                                        : "text-muted-foreground hover:text-foreground hover:bg-white/[0.02]"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <ApiStatusBadge />
                        <Button variant="outline" size="sm" className="text-sm font-medium">
                            Sign In
                        </Button>
                    </div>

                    <button
                        className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </nav>

                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden absolute left-4 right-4 top-full mt-2 p-2 bg-card/95 backdrop-blur-2xl border border-white/[0.06] rounded-xl shadow-card"
                    >
                        <div className="space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                                        location.pathname === link.href
                                            ? "text-foreground bg-white/[0.06]"
                                            : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="px-4 py-3 border-t border-white/[0.04] mt-2 flex items-center justify-between">
                                <ApiStatusBadge />
                                <Button variant="outline" size="sm">Sign In</Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.header>
    );
}
