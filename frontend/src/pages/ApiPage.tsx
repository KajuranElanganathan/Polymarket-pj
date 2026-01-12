import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Copy, Check, Terminal, Globe } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { fetchEndpoint, BASE_URL } from "@/lib/api";

interface Endpoint {
    method: "GET";
    path: string;
    description: string;
    example: string;
    params?: { name: string; type: string; description: string }[];
}

const endpoints: Endpoint[] = [
    { method: "GET", path: "/", description: "Health check endpoint. Returns API status.", example: `curl ${BASE_URL}/` },
    { method: "GET", path: "/home", description: "Returns top markets by volume from Polymarket.", example: `curl ${BASE_URL}/home` },
    { method: "GET", path: "/whales", description: "Returns list of whale traders being tracked.", example: `curl ${BASE_URL}/whales` },
    {
        method: "GET", path: "/trades", description: "Returns trades ordered by timestamp (newest first).",
        example: `curl "${BASE_URL}/trades?skip=0&limit=50"`,
        params: [
            { name: "skip", type: "integer", description: "Records to skip (default: 0)" },
            { name: "limit", type: "integer", description: "Max records to return (default: 50)" },
        ],
    },
];

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
    const [response, setResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copiedCurl, setCopiedCurl] = useState(false);

    const handleTryIt = async () => {
        setIsLoading(true);
        setResponse(null);
        try {
            const data = await fetchEndpoint(endpoint.path);
            setResponse(JSON.stringify(data, null, 2));
        } catch (error) {
            setResponse(JSON.stringify({ error: error instanceof Error ? error.message : "Request failed" }, null, 2));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async (text: string, setter: (v: boolean) => void) => {
        await navigator.clipboard.writeText(text);
        setter(true);
        setTimeout(() => setter(false), 2000);
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Badge className="font-mono text-xs">{endpoint.method}</Badge>
                        <code className="text-sm font-mono text-foreground">{endpoint.path}</code>
                    </div>
                    <Button onClick={handleTryIt} disabled={isLoading} size="sm" className="gap-1"><Play className="h-3 w-3" /> Try it</Button>
                </div>
                <CardDescription className="mt-2">{endpoint.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {endpoint.params?.length && (
                    <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Parameters</h4>
                        <div className="space-y-2">
                            {endpoint.params.map((p) => (
                                <div key={p.name} className="flex items-start gap-3 text-sm p-2 rounded-lg bg-muted/20">
                                    <code className="text-primary font-mono">{p.name}</code>
                                    <span className="text-muted-foreground">({p.type})</span>
                                    <span className="text-muted-foreground">—</span>
                                    <span className="text-muted-foreground">{p.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Example Request</h4>
                        <Button variant="ghost" size="sm" onClick={() => handleCopy(endpoint.example, setCopiedCurl)} className="h-6 px-2 gap-1">
                            {copiedCurl ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />} {copiedCurl ? "Copied" : "Copy"}
                        </Button>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 font-mono text-xs text-muted-foreground overflow-x-auto"><code>{endpoint.example}</code></div>
                </div>

                {response && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }}>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Response</h4>
                            <Button variant="ghost" size="sm" onClick={() => handleCopy(response, setCopied)} className="h-6 px-2 gap-1">
                                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />} {copied ? "Copied" : "Copy"}
                            </Button>
                        </div>
                        <ScrollArea className="h-64 rounded-lg border border-border/50 bg-muted/20">
                            <pre className="p-4 text-xs font-mono text-foreground whitespace-pre-wrap">{response}</pre>
                        </ScrollArea>
                    </motion.div>
                )}

                {isLoading && <div className="flex items-center justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" /></div>}
            </CardContent>
        </Card>
    );
}

export function ApiPage() {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <PageHeader title="API Documentation" description="Explore and test the PolyMetrics API endpoints" />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-2.5 rounded-lg bg-primary/10"><Globe className="h-5 w-5 text-primary" /></div>
                            <div><p className="text-sm font-medium">Base URL</p><code className="text-xs text-muted-foreground">{BASE_URL}</code></div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-2.5 rounded-lg bg-primary/10"><Terminal className="h-5 w-5 text-primary" /></div>
                            <div><p className="text-sm font-medium">Response Format</p><code className="text-xs text-muted-foreground">application/json</code></div>
                        </CardContent>
                    </Card>
                </motion.div>

                <Tabs defaultValue="endpoints" className="w-full">
                    <TabsList className="w-full justify-start mb-6">
                        <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                        <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                    </TabsList>

                    <TabsContent value="endpoints">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6">
                            {endpoints.map((ep, i) => (
                                <motion.div key={ep.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                                    <EndpointCard endpoint={ep} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="getting-started">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Terminal className="h-5 w-5" /> Quick Start</CardTitle>
                                    <CardDescription>Get started with the PolyMetrics API in minutes</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div><h4 className="font-medium mb-2">1. Check API Status</h4><div className="bg-muted/30 rounded-lg p-4 font-mono text-sm"><code>curl {BASE_URL}/</code></div></div>
                                    <div><h4 className="font-medium mb-2">2. Fetch Top Markets</h4><div className="bg-muted/30 rounded-lg p-4 font-mono text-sm"><code>curl {BASE_URL}/home</code></div></div>
                                    <div><h4 className="font-medium mb-2">3. Get Recent Trades</h4><div className="bg-muted/30 rounded-lg p-4 font-mono text-sm"><code>curl "{BASE_URL}/trades?skip=0&limit=10"</code></div></div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
