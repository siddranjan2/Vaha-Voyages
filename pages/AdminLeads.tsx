
import React from 'react';
import { Link } from 'react-router-dom';
import { Inquiry } from '../types';

interface AdminLeadsProps {
  leads: Inquiry[];
}

const AdminLeads: React.FC<AdminLeadsProps> = ({ leads }) => {
  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-72 border-r border-slate-200 bg-white flex flex-col p-10">
        <h2 className="text-xl font-serif text-slate-900 mb-16 tracking-widest uppercase flex items-center">
          <span className="text-teal-600 font-bold">V</span><span className="-ml-0.5">AHA VOYAGES</span>
        </h2>
        <nav className="space-y-4">
          <Link to="/admin" className="flex items-center gap-4 text-slate-400 hover:bg-slate-50 hover:text-teal-600 p-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            Expeditions
          </Link>
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] w-full p-4 rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            Lead Desk
          </div>
          <div className="pt-20 border-t border-slate-50 mt-10">
            <Link to="/" className="text-[10px] text-slate-300 uppercase tracking-[0.4em] font-black hover:text-teal-600">Site Home</Link>
          </div>
        </nav>
      </aside>

      <main className="flex-grow overflow-y-auto p-16">
        <div className="flex justify-between items-center mb-16">
          <h1 className="text-5xl font-serif text-slate-900">Lead Desk</h1>
          <div className="text-right bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Incoming Pulse</p>
             <p className="text-4xl font-serif text-teal-600 font-bold">{leads.length}</p>
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-40 text-center shadow-sm border border-slate-100">
            <p className="text-slate-300 italic font-medium">Lead desk is quiet today. New adventures await.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {leads.map(lead => (
              <div key={lead.id} className="bg-white rounded-[3rem] border border-slate-100 p-12 flex flex-col lg:flex-row justify-between gap-12 hover:shadow-2xl hover:shadow-teal-900/5 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center gap-6 mb-4">
                    <span className="text-[9px] bg-teal-50 text-teal-600 px-4 py-1.5 rounded-full font-black uppercase tracking-widest">{lead.status}</span>
                    <span className="text-slate-300 text-[9px] uppercase tracking-widest font-black">{new Date(lead.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-3xl font-serif text-slate-900">{lead.name}</h3>
                  <div className="space-y-1">
                    <p className="text-teal-600 font-bold text-lg">{lead.email}</p>
                    <p className="text-slate-900 font-black text-sm uppercase tracking-widest">WhatsApp: {lead.mobile}</p>
                  </div>
                </div>
                
                <div className="lg:w-1/3">
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black mb-3">Manifesto</p>
                  <p className="text-lg text-slate-500 font-medium italic leading-relaxed">"{lead.message || 'The user is ready to begin.'}"</p>
                </div>

                <div className="text-right flex flex-col justify-center space-y-6">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Target Trip</p>
                    <p className="text-xs font-mono font-bold text-slate-900">{lead.tripId}</p>
                  </div>
                  <a 
                    href={`https://wa.me/${lead.mobile.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-teal-600 text-white text-[10px] font-black uppercase tracking-[0.3em] px-8 py-3 rounded-full hover:bg-slate-900 transition-all shadow-xl shadow-teal-600/10 text-center"
                  >
                    Open WhatsApp
                  </a>
                  <button className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] px-8 py-3 rounded-full hover:bg-teal-600 transition-all shadow-xl shadow-slate-900/10">
                    Dispatch Email
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLeads;
