import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Navbar } from "@/components/Navbar";
import { LandingPage } from "@/pages/LandingPage";
import { MarketsPage } from "@/pages/MarketsPage";
import { WhalesPage } from "@/pages/WhalesPage";
import { TradesPage } from "@/pages/TradesPage";

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <div className="min-h-screen bg-background">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/markets" element={<MarketsPage />} />
                        <Route path="/whales" element={<WhalesPage />} />
                        <Route path="/trades" element={<TradesPage />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
