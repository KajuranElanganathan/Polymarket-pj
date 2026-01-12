import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";

interface JsonViewerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: unknown;
    title?: string;
}

export function JsonViewerDialog({ open, onOpenChange, data, title = "Details" }: JsonViewerDialogProps) {
    const [copied, setCopied] = useState(false);

    const jsonString = JSON.stringify(data, null, 2);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(jsonString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>Full JSON data for this item</DialogDescription>
                </DialogHeader>

                <div className="relative">
                    <Button variant="ghost" size="sm" onClick={handleCopy} className="absolute top-2 right-2 z-10 gap-1">
                        {copied ? (
                            <><Check className="h-3 w-3 text-green-500" /> Copied</>
                        ) : (
                            <><Copy className="h-3 w-3" /> Copy</>
                        )}
                    </Button>

                    <ScrollArea className="h-[400px] w-full rounded-lg border border-border/50 bg-muted/20 p-4">
                        <pre className="text-sm font-mono text-foreground whitespace-pre-wrap break-words">{jsonString}</pre>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
