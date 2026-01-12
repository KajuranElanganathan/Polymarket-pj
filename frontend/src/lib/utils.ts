import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatNumber(value: number | string | undefined | null): string {
    if (value === undefined || value === null) return "—";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return String(value);

    if (Math.abs(num) >= 1_000_000_000) {
        return `$${(num / 1_000_000_000).toFixed(2)}B`;
    }
    if (Math.abs(num) >= 1_000_000) {
        return `$${(num / 1_000_000).toFixed(2)}M`;
    }
    if (Math.abs(num) >= 1_000) {
        return `$${(num / 1_000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
}

export function formatDate(value: string | number | Date | undefined | null): string {
    if (!value) return "—";
    try {
        const date = typeof value === "number"
            ? new Date(value > 10000000000 ? value : value * 1000)
            : new Date(value);
        if (isNaN(date.getTime())) return String(value);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return String(value);
    }
}

export function truncateText(text: string, maxLength: number = 50): string {
    if (!text || text.length <= maxLength) return text || "";
    return `${text.slice(0, maxLength)}...`;
}

export function truncateAddress(address: string): string {
    if (!address || address.length < 10) return address || "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function safeGet<T>(obj: Record<string, unknown>, keys: string[]): T | undefined {
    for (const key of keys) {
        if (obj && key in obj && obj[key] !== undefined && obj[key] !== null) {
            return obj[key] as T;
        }
    }
    return undefined;
}
