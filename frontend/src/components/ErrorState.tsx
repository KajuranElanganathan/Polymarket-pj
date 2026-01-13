import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({
    title = "Something went wrong",
    message = "We couldn't load the data. Please try again.",
    onRetry
}: ErrorStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm mx-auto py-16"
        >
            <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                    <AlertCircle className="h-6 w-6 text-destructive/80" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1.5">{title}</h3>
                <p className="text-sm text-muted-foreground/70 mb-6">{message}</p>
                {onRetry && (
                    <Button onClick={onRetry} variant="outline" size="sm" className="gap-2">
                        <RefreshCw className="h-4 w-4" /> Try Again
                    </Button>
                )}
            </div>
        </motion.div>
    );
}
