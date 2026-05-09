import React, { useState, useEffect } from 'react';
import { BookOpen, Scale, Clock, ShieldCheck, Search, Library, FileText, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:5001/api/dashboard-stats');
                if (res.data) setStats(res.data);
            } catch (err) {
                console.error("[Dashboard] Failed to fetch stats:", err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchStats();
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    const totalMemos = stats?.history?.length || 0;
    const avgConfidence = totalMemos > 0
        ? (stats.history.reduce((acc, curr) => acc + curr.avg_confidence, 0) / totalMemos).toFixed(1)
        : "0";

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    icon={<BookOpen />}
                    title="Precedents Scanned"
                    value={loading ? "..." : `${stats?.collection?.total_precedents || 0}+`}
                    color="text-blue-600"
                />
                <StatCard
                    icon={<ShieldCheck />}
                    title="Avg. Confidence"
                    value={loading ? "..." : `${avgConfidence}%`}
                    color="text-emerald-600"
                />
                <StatCard
                    icon={<FileText />}
                    title="Memos Generated"
                    value={loading ? "..." : totalMemos}
                    color="text-purple-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Actions Area */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <h2 className="text-xl font-serif text-slate-900 mb-2">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link to="/research" className="bg-white shadow-sm hover:shadow-md transition-all border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 group">
                            <div className="p-4 bg-orange-50 rounded-full group-hover:bg-orange-100 transition-colors">
                                <Search className="text-orange-600" size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg sm:text-base">Start New Research</h3>
                                <p className="text-slate-600 text-sm mt-1">Submit a query to your autonomous clerk</p>
                            </div>
                        </Link>

                        <Link to="/explorer" className="bg-white shadow-sm hover:shadow-md transition-all border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 group">
                            <div className="p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                                <Library className="text-blue-600" size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">Access Legal Library</h3>
                                <p className="text-slate-600 text-sm mt-1">Browse and explore 50+ years of precedents</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-4 sm:p-6">
                        <h3 className="font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Recent Memos</h3>
                        <div className="flex flex-col gap-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="animate-spin text-slate-300" />
                                </div>
                            ) : stats?.history?.length > 0 ? (
                                stats.history.slice(0, 5).map((item, i) => (
                                    <RecentItem
                                        key={i}
                                        title={item.query}
                                        date={new Date(item.timestamp).toLocaleDateString()}
                                    />
                                ))
                            ) : (
                                <p className="text-xs text-slate-400 italic text-center py-4">No recent research found</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Small helper components for the UI
function StatCard({ icon, title, value, color }) {
    return (
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-slate-50 ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs text-slate-600 font-medium uppercase tracking-wider">{title}</p>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
            </div>
        </div>
    );
}

function RecentItem({ title, date }) {
    return (
        <div className="group cursor-pointer">
            <p className="text-sm font-medium text-slate-700 group-hover:text-orange-600 transition-colors truncate">{title}</p>
            <p className="text-xs text-slate-500 mt-1">{date}</p>
        </div>
    );
}