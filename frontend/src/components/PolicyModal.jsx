import React from 'react';
import { X, FileText, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


export const PolicyModal = ({ isOpen, onClose, policyText }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Insurance Policy Document</h3>
                                <p className="text-sm text-slate-500">UnitedHealthcare of New York, Inc. • HMO Contract</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white">
                        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h2:text-blue-600 prose-p:text-slate-600 prose-sm">
                            {/* Simple markdown rendering assumption */}
                            {policyText.split('\n').map((line, i) => {
                                if (line.startsWith('# ')) return <h1 key={i} className="mb-4 mt-6">{line.replace('# ', '')}</h1>
                                if (line.startsWith('## ')) return <h2 key={i} className="mb-3 mt-6 border-b border-slate-100 pb-2">{line.replace('## ', '')}</h2>
                                if (line.startsWith('**')) return <p key={i} className="font-bold mb-2">{line.replace(/\*\*/g, '')}</p>
                                if (line.startsWith('|')) return <p key={i} className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-100 mb-2 whitespace-pre-wrap">{line}</p>
                                if (line.trim() === '') return <br key={i} />
                                return <p key={i} className="mb-2 leading-relaxed">{line}</p>
                            })}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                        >
                            Close Document
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
