import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pt-4"
        >
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{title}</h1>
                {description && (
                    <p className="text-muted-foreground/70 mt-1.5 text-sm sm:text-base">{description}</p>
                )}
            </div>
            {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
        </motion.div>
    );
}
