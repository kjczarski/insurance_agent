import React, { useState } from 'react';
import {
    User, Calendar, CreditCard, Activity, FileText, Phone,
    MapPin, Clock, Shield, AlertCircle, File, Eye, Building2, Banknote, BookOpen
} from 'lucide-react';
import { format } from 'date-fns';
import { StatusBadge } from './StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { PolicyModal } from './PolicyModal';
import { policyText } from '../data/mockData';

const DetailSection = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`p-5 rounded-2xl bg-slate-50 border border-slate-100 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
            <Icon size={16} className="text-slate-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</h3>
        </div>
        {children}
    </div>
);

const InfoRow = ({ label, value, mono = false, highlight = false }) => (
    <div>
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        <p className={`text-sm font-medium ${mono ? 'font-mono' : ''} ${highlight ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>{value}</p>
    </div>
);

export const ClaimDetails = ({ claim }) => {
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

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
            <PolicyModal
                isOpen={isPolicyModalOpen}
                onClose={() => setIsPolicyModalOpen(false)}
                policyText={policyText}
            />

            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white backdrop-blur-md">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-2xl font-bold text-slate-900">{claim.patient.name}</h1>
                            <StatusBadge status={claim.status} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">{claim.id}</span>
                            <span>•</span>
                            <span>Submitted {format(new Date(claim.submittedAt), 'MMMM d, yyyy')}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-slate-900 tracking-tight">${Number(claim.financial?.billed?.replace(/,/g, '') || claim.estimatedCost).toLocaleString()}</p>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mt-1">Total Billed</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                {/* Action Bar */}
                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => setIsPolicyModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                    >
                        <BookOpen size={16} />
                        View Policy Document
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Patient Info */}
                    <DetailSection title="Patient Information" icon={User}>
                        <div className="space-y-4">
                            <InfoRow label="Date of Birth" value={format(new Date(claim.patient.dob), 'MMM d, yyyy')} />
                            <InfoRow label="Member ID" value={claim.patient.insuranceId} mono />
                            <InfoRow label="Policy Plan" value={claim.patient.policy || "Standard"} />
                        </div>
                    </DetailSection>

                    {/* Insurance & Provider Info */}
                    <DetailSection title="Payer & Provider" icon={Building2}>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <InfoRow label="Payer" value={claim.insurance.provider} />
                                <InfoRow label="Phone" value={claim.insurance.phone} mono />
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Service Provider</p>
                                <div className="space-y-3">
                                    <InfoRow label="Facility/Doctor" value={claim.provider?.name || "Unknown Provider"} highlight />
                                    <div className="grid grid-cols-2 gap-2">
                                        <InfoRow label="NPI" value={claim.provider?.npi} mono />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400 mb-0.5">Status</span>
                                            <span className={`text-sm font-medium inline-flex items-center gap-1 ${claim.provider?.status === 'In-Network' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {claim.provider?.status === 'In-Network' ? <Shield size={12} /> : <AlertCircle size={12} />}
                                                {claim.provider?.status || "Unknown"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DetailSection>
                </div>

                {/* Financial Breakdown (NEW) */}
                <div className="mb-6">
                    <DetailSection title="Financial Breakdown" icon={Banknote} className="bg-slate-50 border-slate-200">
                        <div className="grid grid-cols-3 gap-6">
                            <InfoRow label="Billed Amount" value={`$${claim.financial?.billed}`} mono highlight />
                            <InfoRow label="Allowed Amount" value={claim.financial?.allowed === 'N/A' ? 'N/A' : `$${claim.financial?.allowed}`} mono />
                            <div className="bg-white p-3 rounded-lg border border-slate-200">
                                <p className="text-xs text-slate-400 mb-1">Deductible Status</p>
                                <p className="text-sm font-medium text-slate-700">{claim.financial?.deductibleStatus}</p>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{
                                            width: claim.financial?.deductibleStatus ?
                                                `${(parseFloat(claim.financial.deductibleStatus.split(' ')[0].replace('$', '')) / 1000) * 100}%` : '0%'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </DetailSection>
                </div>

                {/* Diagnosis & Procedure */}
                <div className="mb-6">
                    <DetailSection title="Clinical Details" icon={Activity} className="bg-white border-slate-200 shadow-sm">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2">
                                <InfoRow label="Procedure" value={claim.procedure.name} highlight />
                                <p className="text-sm text-slate-500 mt-1 italic">{claim.diagnosis}</p>
                            </div>
                            <div className="space-y-3">
                                <InfoRow label="CPT Code" value={claim.procedure.code} mono />
                                <InfoRow label="ICD-10 Code" value={claim.procedure.icd10} mono />
                            </div>
                        </div>
                    </DetailSection>
                </div>

                {/* Documents Section */}
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
                {(claim.status === 'denied' || claim.status === 'needs_info') && (
                    <div className={`p-4 rounded-xl border mb-6 ${claim.status === 'denied' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                        <div className="flex gap-3">
                            <AlertCircle className={`${claim.status === 'denied' ? 'text-red-600' : 'text-amber-600'} shrink-0`} size={20} />
                            <div>
                                <h4 className={`font-semibold ${claim.status === 'denied' ? 'text-red-900' : 'text-amber-900'}`}>
                                    {claim.status === 'denied' ? 'Authorization Denied' : 'Information Required'}
                                </h4>
                                <p className={`text-sm mt-1 leading-relaxed ${claim.status === 'denied' ? 'text-red-700' : 'text-amber-700'}`}>
                                    {claim.denialReason || claim.missingInfo}
                                </p>
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
