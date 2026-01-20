
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Trip, Inquiry } from '../types';

interface TripDetailProps {
  trips: Trip[];
  onInquiry: (inquiry: Inquiry) => void;
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

  if (!trip) return <Navigate to="/destinations" />;

  const totalPrice = trip.basePrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInquiry({
      id: Math.random().toString(36).substr(2, 9),
      tripId: trip.id,
      ...form,
      selectedAddons: [],
      status: 'new',
      date: new Date().toISOString()
    });
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Immersive Playful Header with Collision Prevention */}
      <div className="h-[85vh] relative overflow-hidden rounded-b-[4rem] shadow-2xl bg-slate-900">
        <RobustDetailImage src={trip.mainImage} alt={trip.title} className="w-full h-full object-cover" />
        {/* Darker overlay for text legibility */}
        <div className="absolute inset-0 bg-slate-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/20"></div>
        
        {/* Title Container: Using pt-40 to avoid clashing with navbar */}
        <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-20 pt-40 container mx-auto">
          <div className="animate-fade-in max-w-7xl">
            <span className="inline-block bg-teal-500 text-slate-900 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-xl">
              {trip.destination}, {trip.country} | {trip.difficulty}
            </span>
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif text-white leading-[0.9] mb-4 drop-shadow-2xl">
              {trip.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 mb-32">
          {/* Content Column */}
          <div className="lg:col-span-2 space-y-24">
            <section>
              <h2 className="text-4xl font-serif mb-10 text-slate-900 border-b-4 border-teal-50 pb-6 inline-block">The Experience</h2>
              <p className="text-2xl text-slate-500 leading-relaxed font-medium mb-12">
                {trip.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <p className="text-teal-600 text-[10px] uppercase tracking-widest font-black mb-3">Duration</p>
                  <p className="text-xl font-serif text-slate-900">{trip.duration}</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <p className="text-sky-500 text-[10px] uppercase tracking-widest font-black mb-3">Challenge</p>
                  <p className="text-xl font-serif text-slate-900">{trip.difficulty}</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <p className="text-orange-500 text-[10px] uppercase tracking-widest font-black mb-3">Activity</p>
                  <p className="text-xl font-serif text-slate-900">{trip.activity}</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <p className="text-teal-600 text-[10px] uppercase tracking-widest font-black mb-3">Season</p>
                  <p className="text-xl font-serif text-slate-900">Peak Oct-Apr</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-4xl font-serif mb-12 text-slate-900 border-b-4 border-teal-50 pb-6 inline-block">Curated Itinerary</h2>
              <div className="space-y-10">
                {trip.itinerary && trip.itinerary.length > 0 ? (
                  trip.itinerary.map((item) => (
                    <div key={item.day} className="flex gap-10 group bg-slate-50/50 p-10 rounded-[3rem] border border-transparent hover:border-teal-100 hover:bg-white hover:shadow-xl transition-all duration-500">
                      <div className="flex-shrink-0 w-20 h-20 bg-white border-2 border-teal-600 rounded-3xl flex items-center justify-center text-teal-600 font-serif text-3xl group-hover:bg-teal-600 group-hover:text-white transition-all shadow-lg shadow-teal-600/10">
                        {item.day}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 uppercase tracking-widest mb-3">{item.title}</h3>
                        <p className="text-slate-500 leading-relaxed font-medium text-lg">{item.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold uppercase tracking-widest">Itinerary Revealed Upon Inquiry</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white border border-slate-100 rounded-[3.5rem] p-12 shadow-2xl shadow-teal-900/10">
              <h3 className="text-3xl font-serif mb-10 text-slate-900">Reserve Expedition</h3>
              
              {submitted ? (
                <div className="text-center py-16 space-y-6 animate-fade-in">
                  <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="text-2xl font-serif text-slate-900">Inquiry Launched!</h4>
                  <p className="text-slate-500 font-medium">Our concierge will connect with you shortly to finalize your custom route.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-teal-600 text-xs font-black uppercase tracking-widest pt-6 border-b-2 border-teal-600"
                  >
                    Start another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="pt-0">
                    <div className="flex justify-between items-end mb-10">
                      <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black">Estimated Investment</p>
                      <p className="text-4xl font-serif text-slate-900 font-bold">₹{totalPrice.toLocaleString()}</p>
                    </div>
                    
                    <div className="space-y-6">
                      <input 
                        required
                        type="text" 
                        placeholder="Full Name" 
                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-5 focus:outline-none focus:border-teal-600 focus:bg-white transition-all text-slate-900 font-medium"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                      />
                      <input 
                        required
                        type="email" 
                        placeholder="Email Address" 
                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-5 focus:outline-none focus:border-teal-600 focus:bg-white transition-all text-slate-900 font-medium"
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                      />
                      <input 
                        required
                        type="tel" 
                        placeholder="Mobile Number (WhatsApp)" 
                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-5 focus:outline-none focus:border-teal-600 focus:bg-white transition-all text-slate-900 font-medium"
                        value={form.mobile}
                        onChange={e => setForm({...form, mobile: e.target.value})}
                      />
                      <textarea 
                        placeholder="Personal requirements or health notes..." 
                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-5 focus:outline-none focus:border-teal-600 focus:bg-white transition-all text-slate-900 font-medium h-40"
                        value={form.message}
                        onChange={e => setForm({...form, message: e.target.value})}
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      className="w-full mt-10 bg-teal-600 text-white font-black uppercase tracking-[0.3em] py-6 rounded-full hover:bg-slate-900 transition-all shadow-xl shadow-teal-600/20 active:scale-95"
                    >
                      Inquire Privately
                    </button>
                    <p className="mt-6 text-[10px] text-slate-400 text-center uppercase tracking-widest leading-relaxed font-bold">
                      Your privacy is our priority. Professional consultation guaranteed.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Cinematic Rolling Gallery Section */}
        {trip.galleryImages && trip.galleryImages.length > 0 && (
          <section className="pt-24 border-t border-slate-100">
            <div className="flex justify-between items-end mb-16">
              <div>
                <p className="text-sky-500 uppercase tracking-[0.4em] text-[10px] font-black mb-4">Rolling Gallery</p>
                <h2 className="text-5xl font-serif text-slate-900">Captured Moments</h2>
              </div>
              <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] font-black hidden md:block">Scroll to explore visuals</p>
            </div>
            
            <div className="flex overflow-x-auto gap-10 pb-12 no-scrollbar scroll-smooth snap-x">
              {trip.galleryImages.map((imgUrl, index) => (
                <div key={index} className="flex-shrink-0 w-[85vw] md:w-[65vw] h-[55vh] md:h-[65vh] relative group overflow-hidden snap-center rounded-[3.5rem] shadow-xl bg-slate-100">
                  <RobustDetailImage 
                    src={imgUrl} 
                    alt={`Expedition visual ${index + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TripDetail;
