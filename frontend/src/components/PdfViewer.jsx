import React, { useState } from 'react';

export default function PdfViewer({ src, fileName = 'document.pdf' }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!src) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-sm text-slate-600">
        No document available
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
        <div className="w-full aspect-[4/3] sm:aspect-video">
          <iframe
            src={src}
            title={fileName}
            className="w-full h-full"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <a href={src} target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center justify-center">
          Open in new tab
        </a>
        <button onClick={() => setIsOpen(true)} className="btn-secondary">
          Open fullscreen
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl h-full bg-white rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-slate-200">
              <div className="font-semibold text-slate-900">{fileName}</div>
              <button onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-slate-900">Close</button>
            </div>
            <div className="w-full h-[calc(100%-56px)]">
              <iframe src={src} title={fileName} className="w-full h-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
