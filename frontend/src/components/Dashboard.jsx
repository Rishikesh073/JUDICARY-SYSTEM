import { BookOpen, Scale, Clock, ShieldCheck, UploadCloud } from 'lucide-react';
import ChatInterface from './ChatInterface';
import ResearchDashboard from './ResearchDashboard';

export default function Dashboard({ onSearch, isLoading }) {
    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard icon={<BookOpen />} title="Precedents Scanned" value="400+" color="text-blue-400" />
                <StatCard icon={<Clock />} title="Research Hours Saved" value="14.5 hrs" color="text-orange-400" />
                <StatCard icon={<ShieldCheck />} title="Verified Citations" value="100%" color="text-emerald-400" />
                <StatCard icon={<Scale />} title="Active Cases" value="3" color="text-purple-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Research Area (Takes up 2/3 of the screen) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-panelBg backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-serif text-slate-100">LexAgent Research Engine</h2>
                            <span className="text-xs font-semibold bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">System Online</span>
                        </div>
                        <ChatInterface onSearch={onSearch} isLoading={isLoading} />
                    </div>

                    {/* Integrated Analytics Section */}
                    <ResearchDashboard />
                </div>

                {/* Sidebar (Takes up 1/3) */}
                <div className="flex flex-col gap-6">

                    {/* Recent Queries */}
                    <div className="bg-panelBg backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <h3 className="font-semibold text-slate-200 mb-4 border-b border-white/10 pb-2">Recent Memos</h3>
                        <div className="flex flex-col gap-3">
                            <RecentItem title="PMLA Bail Conditions (2025)" date="10 mins ago" />
                            <RecentItem title="Benami Transactions Override" date="2 hours ago" />
                            <RecentItem title="Corporate Fraud Asset Seizure" date="Yesterday" />
                        </div>
                    </div>

                    {/* Community Upload Node (Objective 3) */}
                    <div className="bg-gradient-to-br from-indigo-900/40 to-panelBg backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6 text-center">
                        <ShieldCheck size={32} className="mx-auto mb-3 text-indigo-400" />
                        <h3 className="font-semibold text-slate-200 mb-2">Decentralized Vault</h3>
                        <p className="text-xs text-slate-400 mb-4">Upload new case files. PII will be auto-redacted before community indexing.</p>
                        <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                            <UploadCloud size={16} /> Secure Upload
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Small helper components for the UI
function StatCard({ icon, title, value, color }) {
    return (
        <div className="bg-panelBg backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-black/40 ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{title}</p>
                <p className="text-2xl font-bold text-slate-100">{value}</p>
            </div>
        </div>
    );
}

function RecentItem({ title, date }) {
    return (
        <div className="group cursor-pointer">
            <p className="text-sm text-slate-300 group-hover:text-orange-400 transition-colors truncate">{title}</p>
            <p className="text-xs text-slate-500">{date}</p>
        </div>
    );
}