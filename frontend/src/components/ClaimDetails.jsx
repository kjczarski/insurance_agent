import React, { useState } from 'react';
import {
    User, Calendar, CreditCard, Activity, FileText, Phone,
    MapPin, Clock, Shield, AlertCircle, File, Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { StatusBadge } from './StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';

const DetailSection = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`p-5 rounded-2xl bg-slate-50 border border-slate-100 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
            <Icon size={16} className="text-slate-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</h3>
        </div>
        {children}
    </div>
);

const InfoRow = ({ label, value, mono = false }) => (
    <div>
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        <p className={`text-sm font-medium text-slate-700 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
);

export const ClaimDetails = ({ claim }) => {
    if (!claim) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                    <Activity size={32} className="opacity-50" />
                </div>
                <p>Select a claim to view details</p>
            </div>
        );
    }

    const isActive = ['calling', 'on_hold', 'speaking'].includes(claim.status);

    return (
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 h-full overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white backdrop-blur-md">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-2xl font-bold text-slate-900">{claim.patient.name}</h1>
                            <StatusBadge status={claim.status} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{claim.id}</span>
                            <span>•</span>
                            <span>Submitted {format(new Date(claim.submittedAt), 'MMMM d, yyyy')}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-slate-900 tracking-tight">${claim.estimatedCost.toLocaleString()}</p>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mt-1">Estimated Cost</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Patient Info */}
                    <DetailSection title="Patient Information" icon={User}>
                        <div className="space-y-4">
                            <InfoRow label="Date of Birth" value={format(new Date(claim.patient.dob), 'MMM d, yyyy')} />
                            <InfoRow label="Member ID" value={claim.patient.insuranceId} mono />
                            <InfoRow label="Policy Plan" value={claim.patient.policy} />
                        </div>
                    </DetailSection>

                    {/* Insurance Info */}
                    <DetailSection title="Insurance Provider" icon={Shield}>
                        <div className="space-y-4">
                            <InfoRow label="Provider" value={claim.insurance.provider} />
                            <InfoRow label="Contact Phone" value={claim.insurance.phone} mono />
                            <div className="pt-2">
                                <button className="text-xs flex items-center gap-1 text-blue-600 font-medium hover:underline">
                                    <Phone size={12} /> Call Provider manually
                                </button>
                            </div>
                        </div>
                    </DetailSection>
                </div>

                {/* Diagnosis & Procedure */}
                <div className="mb-6">
                    <DetailSection title="Clinical Details" icon={Activity} className="bg-white border-slate-200 shadow-sm">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2">
                                <InfoRow label="Procedure" value={claim.procedure.name} />
                                <p className="text-sm text-slate-500 mt-1">{claim.diagnosis}</p>
                            </div>
                            <div className="space-y-3">
                                <InfoRow label="CPT Code" value={claim.procedure.code} mono />
                                <InfoRow label="ICD-10 Code" value={claim.procedure.icd10} mono />
                            </div>
                        </div>
                    </DetailSection>
                </div>

                {/* Documents Section (NEW) */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <FileText size={16} className="text-blue-500" />
                        Supporting Documents
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">{claim.documents.length}</span>
                    </h3>
                    {claim.documents.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {claim.documents.map(doc => (
                                <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                            <File size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">{doc.name}</p>
                                            <p className="text-xs text-slate-400">{doc.date} • {doc.type.toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <Eye size={16} className="text-slate-300 group-hover:text-blue-500" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <p className="text-sm text-slate-400">No documents attached to this claim.</p>
                        </div>
                    )}
                </div>

                {/* Dynamic Status Content */}
                {claim.status === 'denied' && (
                    <div className="p-4 bg-red-50 rounded-xl border border-red-100 mb-6">
                        <div className="flex gap-3">
                            <AlertCircle className="text-red-600 shrink-0" size={20} />
                            <div>
                                <h4 className="font-semibold text-red-900">Authorization Denied</h4>
                                <p className="text-sm text-red-700 mt-1 leading-relaxed">{claim.denialReason}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Live Transcript */}
                {(isActive || claim.transcript.length > 0) && (
                    <div className="border-t border-slate-100 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <Phone size={16} className="text-blue-500" />
                                Call Transcript
                            </h3>
                            {isActive && (
                                <span className="flex items-center gap-2 px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium border border-red-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    LIVE
                                </span>
                            )}
                        </div>

                        <div className="bg-slate-900 rounded-xl p-5 font-mono text-sm max-h-64 overflow-y-auto custom-scrollbar shadow-inner">
                            <div className="space-y-4">
                                {claim.transcript.map((line, i) => (
                                    <div key={i} className="flex gap-4">
                                        <span className="text-slate-500 text-xs shrink-0 pt-0.5">{line.time.split('T').pop()}</span>
                                        <div className="flex-1">
                                            <span className={`text-xs font-bold uppercase tracking-wider mb-0.5 block ${line.speaker === 'agent' ? 'text-blue-400' :
                                                    line.speaker === 'rep' ? 'text-emerald-400' : 'text-slate-400'
                                                }`}>
                                                {line.speaker}
                                            </span>
                                            <p className="text-slate-300 leading-relaxed">{line.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {isActive && (
                                    <div className="flex items-center gap-2 text-slate-600 animate-pulse">
                                        <span>Listening</span>
                                        <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                        <span className="w-1 h-1 bg-slate-600 rounded-full animation-delay-75" />
                                        <span className="w-1 h-1 bg-slate-600 rounded-full animation-delay-150" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
