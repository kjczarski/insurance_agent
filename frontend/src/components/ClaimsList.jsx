import React from 'react';
import { StatusBadge } from './StatusBadge';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export const ClaimsList = ({ claims, selectedId, onSelect }) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden flex flex-col h-full ring-1 ring-slate-900/5">
            <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white backdrop-blur-sm">
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Claims Queue</h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">{claims.length} active claims requiring attention</p>
            </div>
            <div className="divide-y divide-slate-100 overflow-y-auto flex-1 custom-scrollbar">
                {claims.map((claim) => (
                    <motion.div
                        key={claim.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => onSelect(claim)}
                        className={`cursor-pointer transition-all duration-200 hover:bg-slate-50 group relative ${selectedId === claim.id ? 'bg-blue-50/50' : ''
                            }`}
                    >
                        {selectedId === claim.id && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md" />
                        )}
                        <div className="px-6 py-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-[10px] tracking-wider uppercase text-slate-400 font-semibold">{claim.id}</span>
                                        <span className="text-[10px] text-slate-300">•</span>
                                        <span className="text-xs text-slate-500 truncate font-medium">{claim.insurance.provider}</span>
                                    </div>
                                    <p className="font-bold text-slate-800 text-sm truncate group-hover:text-blue-700 transition-colors">{claim.patient.name}</p>
                                    <p className="text-xs text-slate-600 truncate mt-0.5">{claim.procedure.name}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <StatusBadge status={claim.status} size="sm" />
                                    <span className="text-[10px] font-medium text-slate-400">
                                        {format(new Date(claim.submittedAt), 'h:mm a')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
