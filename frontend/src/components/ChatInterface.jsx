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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-slate-900">Submit Legal Query</h2>

            <form onSubmit={handleSubmit} className="relative">
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (query.trim() && !isLoading) {
                                handleSubmit(e);
                            }
                        }
                    }}
                    placeholder="e.g., Find Supreme Court cases from the last 3 years granting PMLA bail due to a lack of a direct money trail."
                    className="w-full bg-white border border-slate-300 rounded-xl p-4 pr-16 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-600/50 resize-none h-32"
                    disabled={isLoading}
                />

                <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="absolute bottom-4 right-4 bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                </button>
            </form>
        </div>
    );
}