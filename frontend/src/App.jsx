import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ResearchProvider } from './context/ResearchContext';

import LandingPage from './pages/LandingPage';
import { CaseExplorer, MemoHistory } from './pages/InternalPages';
import HowItWorks from './pages/HowItWorks';
import DashboardPage from './pages/DashboardPage';
import TeamWorkspace from './pages/TeamWorkspace';
import ResearchPage from './pages/ResearchPage';
import VaultPage from './pages/VaultPage';
import SmartCitations from './pages/SmartCitations';
import SmartViewPage from './pages/SmartViewPage';

function AnimatedRoutes() {
    const location = useLocation();
    
    return (
        <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/explorer" element={<CaseExplorer />} />
            <Route path="/vault" element={<VaultPage />} />
            <Route path="/history" element={<MemoHistory />} />
            <Route path="/citations" element={<SmartCitations />} />
            <Route path="/team" element={<TeamWorkspace />} />
            <Route path="/smartview" element={<SmartViewPage />} />

            {/* Bypassing auth: Redirect /auth to dashboard as requested */}
            <Route path="/auth" element={<Navigate to="/dashboard" replace />} />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <ResearchProvider>
                <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-orange-600/30 selection:text-orange-900">
                    <AnimatedRoutes />
                </div>
            </ResearchProvider>
        </Router>
    );
}

export default App;