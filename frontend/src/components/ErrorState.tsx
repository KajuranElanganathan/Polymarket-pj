import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({ title = "Something went wrong", message = "We couldn't load the data. Please try again.", onRetry }: ErrorStateProps) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md mx-auto">
            <Card className="border-destructive/30">
                <CardContent className="p-8 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{message}</p>
                    {onRetry && (
                        <Button onClick={onRetry} variant="outline" className="gap-2">
                            <RefreshCw className="h-4 w-4" /> Try Again
                        </Button>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
