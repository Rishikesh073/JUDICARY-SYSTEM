import ReactMarkdown from 'react-markdown';
import { FileText, Download, AlertTriangle, ShieldCheck } from 'lucide-react';
import { jsPDF } from 'jspdf';
import CitationGraph from './CitationGraph';

export default function MemoDisplay({ data }) {
    if (!data || !data.memo) return null;

    const downloadMemo = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(217, 119, 6);
        doc.text("LEXAGENT — LEGAL MEMORANDUM", 10, 20);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Query: ${data.query}`, 10, 30);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 35);
        doc.line(10, 40, 200, 40);
        doc.setFontSize(12);
        doc.setTextColor(0);
        const splitText = doc.splitTextToSize(data.memo, 180);
        doc.text(splitText, 10, 50);
        doc.save(`lexagent_memo_${data.query.substring(0, 20)}.pdf`);
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Top Bar */}
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-3">
                    <FileText className="text-orange-600" size={24} />
                    <h2 className="font-semibold text-lg text-slate-900 font-serif">Legal Research Memorandum</h2>

                    <div className="ml-auto flex items-center gap-3">
                        <button
                            onClick={downloadMemo}
                            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 transition-all shadow-sm"
                        >
                            <Download size={14} />
                            Download PDF
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    {/* EMERGENCY DEBUG POSITION: TOP OF PAGE */}
                    <div className="mb-8 p-8 bg-red-600 text-white font-black text-2xl border-8 border-yellow-400 rounded-xl">
                        ⚠️ SYSTEM TEST: IF YOU CAN SEE THIS RED BOX, PLEASE TELL ME "I SEE THE RED BOX".
                        <br /><br />
                        IF YOU DO NOT SEE THIS RED BOX, YOUR BROWSER IS NOT UPDATING THE CODE.
                    </div>
                    <div className="mb-8">
                        <CitationGraph data={data.graph_data || { nodes: [], links: [] }} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Main Memo Column */}
                        <div className="md:col-span-3 prose prose-slate prose-headings:text-slate-900 prose-a:text-blue-600 max-w-none">
                            <ReactMarkdown>
                                {data.memo}
                            </ReactMarkdown>

                            {/* Dissenting Precedents Section */}
                            {data.dissenting_cases && data.dissenting_cases.length > 0 && (
                                <div className="mt-12 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                                    <div className="flex items-center gap-2 text-orange-600 mb-4">
                                        <AlertTriangle size={20} />
                                        <h3 className="text-sm font-bold uppercase tracking-widest m-0">Dissenting / Distinguished Views</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {data.dissenting_cases.map((c, i) => (
                                            <div key={i} className="text-sm">
                                                <p className="font-bold text-slate-900 m-0">{c.filename}</p>
                                                <p className="text-slate-600 mt-1 italic">"{c.summary}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar: Verified Citations */}
                        <div className="border-l border-slate-100 pl-4">
                            <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-6">Verified Citations</h3>
                            <div className="flex flex-col gap-6">
                                {data.approved_cases?.map((c, i) => (
                                    <div key={i} className="flex flex-col gap-2">
                                        <p className="text-xs font-bold text-slate-900 leading-tight">{c.filename}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="flex items-center gap-1 text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                                                <ShieldCheck size={10} />
                                                BINDING - 95%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
