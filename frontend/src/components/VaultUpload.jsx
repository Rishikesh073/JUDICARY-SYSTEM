import { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function VaultUpload() {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [ipfsData, setIpfsData] = useState(null);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title) return alert("Please provide a title and select a PDF.");

        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('document', file);

        try {
            const response = await axios.post('http://localhost:5000/api/upload-vault', formData);
            setIpfsData(response.data);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload to the decentralized vault.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-900/40 to-panelBg backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4 justify-center">
                <ShieldCheck className="text-indigo-400" size={24} />
                <h2 className="text-xl font-bold text-slate-100">Decentralized Vault</h2>
            </div>

            {!ipfsData ? (
                <form onSubmit={handleUpload} className="flex flex-col gap-4">
                    <p className="text-xs text-slate-400 mb-2">
                        Documents uploaded here are permanently secured on the IPFS decentralized network.
                        Unredacted names and locations will be preserved in their original state.
                    </p>
                    <input
                        type="text"
                        placeholder="Official Case Title"
                        onChange={e => setTitle(e.target.value)}
                        className="bg-black/40 border border-white/10 p-3 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={e => setFile(e.target.files[0])}
                        className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-900/50 file:text-indigo-300 hover:file:bg-indigo-900/70"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? "Securing on Web3..." : <><UploadCloud size={18} /> Upload to IPFS</>}
                    </button>
                </form>
            ) : (
                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 text-center animate-in fade-in">
                    <CheckCircle2 className="text-emerald-400 mx-auto mb-2" size={32} />
                    <p className="font-semibold text-emerald-300 mb-1">Document Secured!</p>
                    <p className="text-xs text-slate-400 break-all mb-4">IPFS CID: {ipfsData.ipfsHash}</p>
                    <a
                        href={ipfsData.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs bg-emerald-600/20 text-emerald-400 py-2 px-4 rounded-lg hover:bg-emerald-600/30 transition-colors"
                    >
                        View on Decentralized Network
                    </a>
                </div>
            )}
        </div>
    );
}