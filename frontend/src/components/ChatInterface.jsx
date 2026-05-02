import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function ChatInterface({ onSearch, isLoading }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <div className="bg-panelBg backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-4 text-slate-200">Submit Legal Query</h2>

            <form onSubmit={handleSubmit} className="relative">
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., Find Supreme Court cases from the last 3 years granting PMLA bail due to a lack of a direct money trail."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 pr-16 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none h-32"
                    disabled={isLoading}
                />

                <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="absolute bottom-4 right-4 bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                </button>
            </form>
        </div>
    );
}