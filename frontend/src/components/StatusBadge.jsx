import React from 'react';
import { Clock, Phone, Pause, Mic, CheckCircle2, XCircle, FileQuestion } from 'lucide-react';

const statusConfig = {
    pending: { label: "Pending", color: "bg-slate-100 text-slate-700", dot: "bg-slate-400", icon: Clock },
    calling: { label: "Calling", color: "bg-amber-100 text-amber-800", dot: "bg-amber-500 animate-pulse", icon: Phone },
    on_hold: { label: "On Hold", color: "bg-orange-100 text-orange-800", dot: "bg-orange-500 animate-pulse", icon: Pause },
    speaking: { label: "Speaking", color: "bg-blue-100 text-blue-800", dot: "bg-blue-500 animate-pulse", icon: Mic },
    approved: { label: "Approved", color: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500", icon: CheckCircle2 },
    denied: { label: "Denied", color: "bg-red-100 text-red-800", dot: "bg-red-500", icon: XCircle },
    needs_info: { label: "Needs Info", color: "bg-purple-100 text-purple-800", dot: "bg-purple-500", icon: FileQuestion },
};

export const StatusBadge = ({ status, size = "md" }) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    const sizeClasses = size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm";
    const iconSize = size === "sm" ? 14 : 16;

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.color} ${sizeClasses}`}>
            {status === 'calling' || status === 'speaking' || status === 'on_hold' ? (
                <span className={`relative flex items-center justify-center`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`}></span>
                </span>
            ) : (
                <Icon size={iconSize} />
            )}
            {config.label}
        </span>
    );
};
