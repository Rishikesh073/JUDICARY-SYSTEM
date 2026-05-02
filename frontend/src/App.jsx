import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { CaseExplorer, MemoHistory } from './pages/InternalPages';
import HowItWorks from './pages/HowItWorks';
import DashboardPage from './pages/DashboardPage';
import TeamWorkspace from './pages/TeamWorkspace';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-[#0A0A0A] text-slate-200 selection:bg-orange-500/30 selection:text-orange-200">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/explorer" element={<CaseExplorer />} />
                    <Route path="/history" element={<MemoHistory />} />
                    <Route path="/team" element={<TeamWorkspace />} />

                    {/* Bypassing auth: Redirect /auth to dashboard as requested */}
                    <Route path="/auth" element={<Navigate to="/dashboard" replace />} />
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;