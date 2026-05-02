import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { CaseExplorer, MemoHistory, Auth } from './pages/InternalPages';

function App() {
    return (
        <Router>
            <div className="selection:bg-orange-500/30 selection:text-orange-200">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/explorer" element={<CaseExplorer />} />
                    <Route path="/history" element={<MemoHistory />} />
                    <Route path="/auth" element={<Auth />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;