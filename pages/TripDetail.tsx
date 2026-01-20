
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Trip, Inquiry } from '../types';

interface TripDetailProps {
  trips: Trip[];
  onInquiry: (inquiry: Inquiry) => Promise<void>;
}

const RobustDetailImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, [src]);

  return (
    <img 
      ref={imgRef}
      src={src} 
      alt={alt} 
      referrerPolicy="no-referrer"
      onLoad={() => setLoaded(true)}
      className={`${className} transition-all duration-[2s] ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105 blur-sm'}`}
    />
  );
};

const TripDetail: React.FC<TripDetailProps> = ({ trips, onInquiry }) => {
  const { id } = useParams();
  const trip = trips.find(t => t.id === id);
  
  const [form, setForm] = useState({ name: '', email: '', mobile: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!trip) return <Navigate to="/destinations" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onInquiry({
        id: Math.random().toString(36).substr(2, 9),
        tripId: trip.id,
        ...form,
        selectedAddons: [], // Feature removed
        status: 'new',
        date: new Date().toISOString()
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="h-[75vh] md:h-[85vh] relative overflow-hidden rounded-b-[3rem] md:rounded-b-[5rem] shadow-2xl bg-slate-900">
        <RobustDetailImage src={trip.mainImage} alt={trip.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/20"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20 container mx-auto">
          <div className="animate-fade-in max-w-7xl">
            <span className="inline-block bg-teal-500 text-slate-900 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-xl">
              {trip.destination}, {trip.country} | {trip.difficulty}
            </span>
            <h1 className="text-4xl md:text-8xl lg:text-9xl font-serif text-white leading-tight md:leading-[0.9] mb-4 drop-shadow-2xl">
              {trip.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-24 mb-32">
          <div className="lg:col-span-2 space-y-24">
            <section>
              <h2 className="text-3xl md:text-4xl font-serif mb-10 text-slate-900 border-b-4 border-teal-50 pb-6 inline-block">The Experience</h2>
              <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium mb-12">{trip.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100">
                  <p className="text-teal-600 text-[9px] uppercase tracking-widest font-black mb-3">Duration</p>
                  <p className="text-lg md:text-xl font-serif text-slate-900">{trip.duration}</p>
                </div>
                <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100">
                  <p className="text-orange-500 text-[9px] uppercase tracking-widest font-black mb-3">Activity</p>
                  <p className="text-lg md:text-xl font-serif text-slate-900">{trip.activity}</p>
                </div>
                <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100">
                  <p className="text-sky-500 text-[9px] uppercase tracking-widest font-black mb-3">Difficulty</p>
                  <p className="text-lg md:text-xl font-serif text-slate-900">{trip.difficulty}</p>
                </div>
                <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100">
                  <p className="text-purple-500 text-[9px] uppercase tracking-widest font-black mb-3">Region</p>
                  <p className="text-lg md:text-xl font-serif text-slate-900">{trip.destination}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl md:text-4xl font-serif mb-16 text-slate-900 border-b-4 border-teal-50 pb-6 inline-block">Curated Itinerary</h2>
              <div className="space-y-12">
                {(trip.itinerary || []).map((item, idx) => (
                  <div key={idx} className="flex gap-8 md:gap-12 group">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-teal-50 border-4 border-white shadow-sm flex items-center justify-center text-teal-600 font-serif text-xl md:text-2xl z-10 group-hover:bg-teal-600 group-hover:text-white transition-all">
                        {item.day}
                      </div>
                      {idx !== trip.itinerary.length - 1 && (
                        <div className="w-0.5 h-full bg-slate-100 group-hover:bg-teal-100 transition-all"></div>
                      )}
                    </div>
                    <div className="pb-12">
                      <h4 className="text-2xl md:text-3xl font-serif text-slate-900 mb-4">{item.title}</h4>
                      <p className="text-lg text-slate-500 leading-relaxed font-medium max-w-2xl">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white border border-slate-100 rounded-[3.5rem] p-10 md:p-12 shadow-2xl shadow-teal-900/10">
              <h3 className="text-2xl md:text-3xl font-serif mb-10 text-slate-900">Launch Inquiry</h3>
              {submitted ? (
                <div className="text-center py-16 space-y-6 animate-fade-in">
                  <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="text-2xl font-serif text-slate-900">Expedition Synced</h4>
                  <p className="text-slate-400 text-sm font-medium">A curator will reach out shortly.</p>
                  <button onClick={() => setSubmitted(false)} className="text-teal-600 text-[10px] font-black uppercase tracking-widest pt-6 border-b-2 border-teal-600">Request another route</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="bg-slate-50 p-6 rounded-3xl mb-8">
                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black mb-2">Investment Base</p>
                    <p className="text-4xl font-serif text-slate-900 font-bold">₹{trip.basePrice.toLocaleString()}</p>
                  </div>
                  
                  <div className="space-y-5">
                    <input required type="text" placeholder="Full Name" className="w-full bg-slate-50 rounded-2xl px-6 py-5 focus:outline-none text-slate-900 font-medium border border-transparent focus:border-teal-500/20" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    <input required type="email" placeholder="Email Address" className="w-full bg-slate-50 rounded-2xl px-6 py-5 focus:outline-none text-slate-900 font-medium border border-transparent focus:border-teal-500/20" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    <input required type="tel" placeholder="WhatsApp Number" className="w-full bg-slate-50 rounded-2xl px-6 py-5 focus:outline-none text-slate-900 font-medium border border-transparent focus:border-teal-500/20" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} />
                    <textarea placeholder="Message (Optional)" rows={3} className="w-full bg-slate-50 rounded-2xl px-6 py-5 focus:outline-none text-slate-900 font-medium border border-transparent focus:border-teal-500/20 resize-none" value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                  </div>
                  
                  <button type="submit" disabled={isSubmitting} className="w-full mt-10 bg-teal-600 text-white font-black uppercase tracking-[0.3em] py-6 rounded-full hover:bg-slate-900 transition-all shadow-xl shadow-teal-600/20 disabled:opacity-50 text-xs">
                    {isSubmitting ? 'Syncing...' : 'Secure Reservation'}
                  </button>
                  <p className="text-center text-[9px] text-slate-300 uppercase tracking-widest font-black">Private & Confidential</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;
