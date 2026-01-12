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
    { name: "API", href: "/api" },
];

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2 group">
                        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="relative">
                            <BarChart3 className="h-8 w-8 text-primary" />
                            <div className="absolute inset-0 blur-lg bg-primary/30 group-hover:bg-primary/50 transition-colors" />
                        </motion.div>
                        <span className="text-xl font-bold text-foreground">
                            Poly<span className="text-primary">Metrics</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    location.pathname === link.href ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <ApiStatusBadge />
                        <Button variant="ghost" size="sm">Sign In</Button>
                    </div>

                    <button
                        className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </nav>

                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="md:hidden border-t border-border/50 bg-card/95 backdrop-blur-xl rounded-b-xl"
                    >
                        <div className="py-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "block px-4 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-muted/50 rounded-lg mx-2",
                                        location.pathname === link.href ? "text-primary bg-muted/30" : "text-muted-foreground"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="px-4 pt-2 flex items-center gap-4">
                                <ApiStatusBadge />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.header>
    );
}
