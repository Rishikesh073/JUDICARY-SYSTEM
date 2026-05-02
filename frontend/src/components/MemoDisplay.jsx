import ReactMarkdown from 'react-markdown';
import { FileText, CheckCircle2 } from 'lucide-react';

export default function MemoDisplay({ data }) {
    if (!data || !data.memo) return null;

    return (
        <div className="bg-panelBg backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-500">

            {/* Top Bar of the Memo */}
            <div className="bg-black/40 p-4 border-b border-white/10 flex items-center gap-3">
                <FileText className="text-orange-400" size={24} />
                <h2 className="font-semibold text-lg">Synthesized Legal Memorandum</h2>
                <div className="ml-auto flex items-center gap-2 text-xs font-medium bg-emerald-900/30 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-800/50">
                    <CheckCircle2 size={14} />
                    <span>Verified Precedents</span>
                </div>
            </div>

            {/* The Actual Memo Content */}
            <div className="p-8 prose prose-invert prose-orange max-w-none">
                <ReactMarkdown>
                    {data.memo}
                </ReactMarkdown>
            </div>
        </div>
    );
}