import { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle2, ShieldCheck, Search, Filter, Clock, FileText, ExternalLink } from 'lucide-react';

export default function VaultUpload() {
    // Upload Form State
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('Live');
    const [caseNumber, setCaseNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [ipfsData, setIpfsData] = useState(null);

    // History & Filter State
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterDays, setFilterDays] = useState('All');

    const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
            const response = await axios.get('http://localhost:5001/api/vault-history');
            setHistory(response.data);
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title) return alert("Please provide a title and select a PDF.");

        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('document', file);
        formData.append('status', status);
        formData.append('caseNumber', caseNumber);

        try {
            const response = await axios.post('http://localhost:5001/api/upload-vault', formData);
            setIpfsData(response.data);
            fetchHistory(); // Refresh history after successful upload
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload to the decentralized vault.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setIpfsData(null);
        setFile(null);
        setTitle('');
        setStatus('Live');
        setCaseNumber('');
    };

    // Filter Logic
    const filteredHistory = history.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || item.status === filterStatus;

        let matchesDays = true;
        if (filterDays !== 'All') {
            const uploadDate = new Date(item.uploadDate);
            const now = new Date();
            const diffDays = Math.floor((now - uploadDate) / (1000 * 60 * 60 * 24));
            if (filterDays === '7') matchesDays = diffDays <= 7;
            if (filterDays === '30') matchesDays = diffDays <= 30;
        }

        return matchesSearch && matchesStatus && matchesDays;
    });

    return (
        <div className="w-full max-w-4xl flex flex-col gap-8 pb-20">
            {/* UPLOAD SECTION */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4 justify-center">
                    <ShieldCheck className="text-slate-900" size={24} />
                    <h2 className="text-xl font-bold text-slate-900">Decentralized Vault</h2>
                </div>

                {!ipfsData ? (
                    <form onSubmit={handleUpload} className="flex flex-col gap-4">
                        <p className="text-xs text-slate-600 mb-4 text-center">
                            Documents uploaded here are permanently secured on the IPFS decentralized network.
                            Metadata is stored natively via Pinata.
                        </p>
                        <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Official Case Title *"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="bg-white border border-slate-300 p-3 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-600/50 w-full"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Case No. / File No. (Optional)"
                                    value={caseNumber}
                                    onChange={e => setCaseNumber(e.target.value)}
                                    className="bg-white border border-slate-300 p-3 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-600/50 w-full"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                <select
                                    value={status}
                                    onChange={e => setStatus(e.target.value)}
                                    className="bg-white border border-slate-300 p-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-600/50 w-full"
                                >
                                    <option value="Live">Live</option>
                                    <option value="Pending">Pending</option>
                                    <option value="On Hold">On Hold</option>
                                </select>

                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={e => setFile(e.target.files[0])}
                                    className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-slate-700 file:border-slate-300 file:border hover:file:bg-slate-50 w-full"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? "Securing on Web3..." : <><UploadCloud size={18} /> Upload to IPFS</>}
                        </button>
                    </form>
                ) : (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center animate-in fade-in">
                        <CheckCircle2 className="text-emerald-600 mx-auto mb-3" size={32} />
                        <p className="font-semibold text-emerald-800 mb-2">Document Secured!</p>
                        <p className="text-xs text-slate-600 break-all mb-4">IPFS CID: <span className="font-mono bg-white px-2 py-1 border border-slate-200 rounded text-slate-800">{ipfsData.ipfsHash}</span></p>
                        <div className="flex justify-center gap-4">
                            <a
                                href={ipfsData.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
                            >
                                <ExternalLink size={14} /> View on IPFS
                            </a>
                            <button
                                onClick={resetForm}
                                className="text-xs bg-white border border-emerald-200 text-emerald-800 py-2 px-4 rounded-lg hover:bg-emerald-100 transition-colors"
                            >
                                Upload Another
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* HISTORY SECTION */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-200 pb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Clock size={20} className="text-orange-600" /> Upload History
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search case name or no..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-600/50"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-sm py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600/50"
                        >
                            <option value="All">All Status</option>
                            <option value="Live">Live</option>
                            <option value="Pending">Pending</option>
                            <option value="On Hold">On Hold</option>
                        </select>
                        <select
                            value={filterDays}
                            onChange={(e) => setFilterDays(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-sm py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600/50"
                        >
                            <option value="All">All Time</option>
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                        </select>
                    </div>
                </div>

                {historyLoading ? (
                    <div className="py-8 text-center text-slate-500 text-sm animate-pulse">
                        Syncing with decentralized network...
                    </div>
                ) : filteredHistory.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-sm bg-slate-50 rounded-xl border border-slate-100">
                        No records found matching your filters.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredHistory.map((item) => (
                            <div key={item.ipfsHash} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-orange-300 transition-colors gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-orange-50 p-2 rounded-lg mt-1">
                                        <FileText className="text-orange-600" size={18} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{item.title}</p>
                                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                                            <span>No: {item.caseNumber}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span className="font-mono text-[10px] truncate w-24" title={item.ipfsHash}>{item.ipfsHash}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-0 border-slate-100 pt-3 sm:pt-0">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.status === 'Live' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                            item.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                'bg-slate-100 text-slate-700 border border-slate-200'
                                        }`}>
                                        {item.status}
                                    </span>
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                                    >
                                        View <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}