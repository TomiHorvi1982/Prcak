import React from 'react';
import { Sparkles, MapPin, User, Compass } from 'lucide-react';
import { DiagnosticAnswers } from '../types';

interface HeaderProps {
  profile: DiagnosticAnswers;
}

export default function Header({ profile }: HeaderProps) {
  const getStatusBadge = () => {
    switch (profile.laborOfficeStatus) {
      case 'yet_to_visit':
        return { text: 'Příprava na Úřad Práce', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'registered':
        return { text: 'Registrován na ÚP', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'meeting_scheduled':
        return { text: 'Plánovaná schůzka', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'approved':
        return { text: 'Rekvalifikace schválena! 🎉', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      default:
        return { text: 'Nová kariérní cesta', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const status = getStatusBadge();

  return (
    <header className="bg-white border-b border-slate-100 py-6 px-4 md:px-8 shadow-xs" id="app-header">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left side: branding & welcome */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-100 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              Tomášův IT Mentor
              <span className="text-xs bg-teal-50 text-teal-700 font-sans px-2.5 py-0.5 rounded-full border border-teal-100">
                Kariérní Akcelerátor
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Tvůj parťák, průvodce a motivátor na cestě z Bohumína do světa moderního IT.
            </p>
          </div>
        </div>

        {/* Right side: quick profile stats */}
        <div className="flex flex-wrap items-center gap-3 md:self-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Bohumín / Ostrava</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>46 let</span>
          </div>

          <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border ${status.color}`}>
            <Compass className="w-3.5 h-3.5" />
            <span>{status.text}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
