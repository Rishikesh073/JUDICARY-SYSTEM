import ReactMarkdown from 'react-markdown';
import { FileText, CheckCircle2 } from 'lucide-react';

export default function MemoDisplay({ data }) {
    if (!data || !data.memo) return null;

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-500">

            {/* Top Bar of the Memo */}
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-3">
                <FileText className="text-orange-600" size={24} />
                <h2 className="font-semibold text-lg text-slate-900">Synthesized Legal Memorandum</h2>
                <div className="ml-auto flex items-center gap-2 text-xs font-medium bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200">
                    <CheckCircle2 size={14} />
                    <span>Verified Precedents</span>
                </div>
            </div>

            {/* The Actual Memo Content */}
            <div className="p-8 prose prose-slate prose-headings:text-slate-900 prose-a:text-blue-600 hover:prose-a:underline prose-a:no-underline max-w-none">
                <ReactMarkdown>
                    {data.memo}
                </ReactMarkdown>
            </div>
        </div>
    );
}