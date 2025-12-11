import React, { useState } from 'react';
import { LayoutDashboard, Zap, Settings, Bell, Search, Menu } from 'lucide-react';
import { ClaimsList } from './components/ClaimsList';
import { ClaimDetails } from './components/ClaimDetails';
import { claimsData } from './data/mockData';

function App() {
  const [selectedClaim, setSelectedClaim] = useState(claimsData[0]);

  const activeCalls = claimsData.filter(c => ['calling', 'on_hold', 'speaking'].includes(c.status)).length;

  return (
    <div className="h-screen bg-[#F8FAFC] flex overflow-hidden text-slate-900 font-sans selection:bg-blue-100">

      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 flex-shrink-0 flex flex-col justify-between border-r border-slate-800">
        <div>
          <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800/50">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <Zap className="text-white fill-white" size={18} />
            </div>
            <span className="hidden lg:block ml-3 font-bold text-white tracking-tight text-lg">InsurAI</span>
          </div>

          <nav className="p-4 space-y-2">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-blue-600/10 text-blue-400 rounded-xl transition-colors">
              <LayoutDashboard size={20} />
              <span className="hidden lg:block font-medium">Dashboard</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 rounded-xl transition-all">
              <Settings size={20} />
              <span className="hidden lg:block font-medium">Settings</span>
            </a>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/50">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 shrink-0" />
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Dr. Sarah Smith</p>
              <p className="text-xs text-slate-400 truncate">Senior Agent</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-10">
          <h2 className="text-xl font-semibold text-slate-800">Claims Resolution</h2>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 border border-slate-200 focus-within:ring-2 ring-blue-500/20 transition-all">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search claims, patients..."
                className="bg-transparent border-none outline-none text-sm ml-2 w-64 text-slate-700 placeholder:text-slate-400"
              />
            </div>

            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-hidden">

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{activeCalls}</p>
                <p className="text-xs text-slate-500 font-medium uppercase">Active Calls</p>
              </div>
            </div>
            {/* More stats could go here */}
          </div>

          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
            <div className="col-span-12 lg:col-span-4 xl:col-span-3 h-full min-h-0">
              <ClaimsList
                claims={claimsData}
                selectedId={selectedClaim?.id}
                onSelect={setSelectedClaim}
              />
            </div>
            <div className="col-span-12 lg:col-span-8 xl:col-span-9 h-full min-h-0">
              <ClaimDetails claim={selectedClaim} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
