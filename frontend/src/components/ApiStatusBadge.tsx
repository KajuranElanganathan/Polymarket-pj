import { useApiStatus } from "@/lib/hooks";
import { Badge } from "@/components/ui/Badge";
import { Wifi, WifiOff, Loader2 } from "lucide-react";

export function ApiStatusBadge() {
    const { data, isLoading, isError } = useApiStatus();

    if (isLoading) {
        return (
            <Badge variant="outline" className="gap-1.5 px-2.5 py-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="text-xs">Checking</span>
            </Badge>
        );
    }

    if (isError || !data) {
        return (
            <Badge variant="destructive" className="gap-1.5 px-2.5 py-1">
                <WifiOff className="h-3 w-3" />
                <span className="text-xs">Offline</span>
            </Badge>
        );
    }

    return (
        <Badge variant="success" className="gap-1.5 px-2.5 py-1">
            <Wifi className="h-3 w-3" />
            <span className="text-xs">Online</span>
        </Badge>
    );
}
