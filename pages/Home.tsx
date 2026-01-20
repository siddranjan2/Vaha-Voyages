
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trip, ActivityType } from '../types';

interface HomeProps {
  trips: Trip[];
}

const RobustImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
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
      className={`${className} transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  );
};

const Home: React.FC<HomeProps> = ({ trips }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ 
    destination: '', 
    country: 'All Countries',
    activity: 'All Activities' 
  });

  // Dynamically derive available countries and activities from the trips list
  const availableCountries = useMemo(() => {
    return Array.from(new Set(trips.map(t => t.country))).sort();
  }, [trips]);

  const availableActivities = useMemo(() => {
    return Array.from(new Set(trips.map(t => t.activity))).sort();
  }, [trips]);

  const handleExplore = () => {
    const params = new URLSearchParams();
    if (search.destination) params.append('q', search.destination);
    if (search.country !== 'All Countries') params.append('country', search.country);
    if (search.activity !== 'All Activities') params.append('activity', search.activity);
    
    navigate(`/destinations?${params.toString()}`);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen md:h-[95vh] w-full flex items-center justify-center overflow-hidden">
        {/* Immersive Background */}
        <div className="absolute inset-0 z-0 bg-slate-900">
           <RobustImage 
             src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000" 
             alt="Vibrant Landscape"
             className="w-full h-full object-cover scale-100"
           />
           <div className="absolute inset-0 bg-slate-900/40"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/20"></div>
        </div>

        <div className="relative z-10 text-center px-6 w-full max-w-6xl animate-fade-in pt-24 md:pt-0">
          <span className="inline-block bg-teal-600 text-white px-6 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-6 md:mb-8 shadow-2xl">
            Adventure Awaits
          </span>
          <h1 className="text-4xl md:text-9xl font-serif text-white mb-6 md:mb-8 leading-tight md:leading-none drop-shadow-2xl">
            Live Your <span className="italic text-teal-400">Legend</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/90 font-medium mb-10 md:mb-12 tracking-wide max-w-2xl mx-auto drop-shadow-md">
            Discover breathtaking expeditions that nourish the soul and challenge the body.
          </p>
          
          {/* Dynamic Search Bar */}
          <div className="bg-white/10 backdrop-blur-2xl p-2 rounded-3xl md:rounded-full border border-white/20 flex flex-col md:flex-row items-stretch w-full max-w-6xl mx-auto shadow-2xl">
            
            {/* Destination Field */}
            <div className="flex-grow flex items-center px-6 py-3 md:py-4 group hover:bg-white/5 transition-all rounded-2xl md:rounded-l-full">
              <svg className="w-5 h-5 text-teal-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <div className="flex flex-col items-start w-full">
                <label className="text-[9px] uppercase tracking-widest text-white/60 font-black mb-1">Destination</label>
                <input 
                  type="text" 
                  placeholder="Where to next?" 
                  className="bg-transparent text-white w-full focus:outline-none placeholder:text-white/40 text-base font-bold" 
                  value={search.destination}
                  onChange={(e) => setSearch({ ...search, destination: e.target.value })}
                />
              </div>
            </div>

            <div className="hidden md:block w-px bg-white/10 self-stretch my-4"></div>

            {/* Dynamic Country Filter */}
            <div className="flex-grow flex items-center px-6 py-3 md:py-4 group hover:bg-white/5 transition-all">
              <svg className="w-5 h-5 text-sky-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div className="flex flex-col items-start w-full">
                <label className="text-[9px] uppercase tracking-widest text-white/60 font-black mb-1">Country</label>
                <select 
                  className="w-full bg-transparent text-white focus:outline-none cursor-pointer appearance-none text-base font-bold pr-8"
                  value={search.country}
                  onChange={(e) => setSearch({ ...search, country: e.target.value })}
                >
                  <option className="text-slate-900" value="All Countries">All Territories</option>
                  {availableCountries.map((c) => (
                    <option className="text-slate-900" key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hidden md:block w-px bg-white/10 self-stretch my-4"></div>

            {/* Dynamic Activity Filter */}
            <div className="flex-grow flex items-center px-6 py-3 md:py-4 group hover:bg-white/5 transition-all">
              <svg className="w-5 h-5 text-teal-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <div className="flex flex-col items-start w-full">
                <label className="text-[9px] uppercase tracking-widest text-white/60 font-black mb-1">Activity</label>
                <select 
                  className="w-full bg-transparent text-white focus:outline-none cursor-pointer appearance-none text-base font-bold pr-8"
                  value={search.activity}
                  onChange={(e) => setSearch({ ...search, activity: e.target.value })}
                >
                  <option className="text-slate-900" value="All Activities">All Activities</option>
                  {availableActivities.map((a) => (
                    <option className="text-slate-900" key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={handleExplore}
              className="bg-teal-500 text-slate-900 font-black uppercase tracking-[0.2em] px-10 py-4 md:py-5 rounded-2xl md:rounded-full hover:bg-white hover:scale-[1.03] transition-all active:scale-95 whitespace-nowrap shadow-xl m-1 text-sm"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Featured Horizontal Scroll */}
      <section className="py-24 md:py-32 px-6 bg-slate-50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-6">
            <div>
              <p className="text-teal-600 uppercase tracking-[0.3em] text-xs font-black mb-4">Curated Journeys</p>
              <h2 className="text-4xl md:text-6xl font-serif text-slate-900">Signature Trips</h2>
            </div>
            <Link to="/destinations" className="text-sm font-bold uppercase tracking-widest text-teal-600 hover:text-slate-900 transition-colors">See all expeditions →</Link>
          </div>
          
          <div className="flex overflow-x-auto gap-10 pb-12 no-scrollbar scroll-smooth snap-x">
            {trips.filter(t => t.featured).map((trip) => (
              <Link 
                key={trip.id} 
                to={`/trip/${trip.id}`} 
                className="group flex-shrink-0 w-[280px] md:w-[480px] relative h-[500px] md:h-[650px] overflow-hidden rounded-[2.5rem] md:rounded-[3rem] bg-slate-200 snap-center shadow-xl"
              >
                <RobustImage 
                  src={trip.mainImage} 
                  alt={trip.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                  <span className="inline-block bg-teal-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                    {trip.activity}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif text-white mb-2 leading-tight">{trip.title}</h3>
                  <p className="text-white/70 text-xs md:text-sm mb-6 uppercase tracking-widest font-medium">
                    {trip.destination}, {trip.country}
                  </p>
                  <div className="flex justify-between items-center border-t border-white/20 pt-6">
                    <span className="text-white/90 text-xs md:text-sm font-bold tracking-widest">{trip.duration}</span>
                    <span className="text-white font-serif text-xl md:text-2xl">₹ {trip.basePrice.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bespoke Journeys Proposition */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16 md:gap-24">
           <div className="w-full md:w-1/2 relative">
             <div className="absolute inset-0 border-[8px] md:border-[12px] border-teal-600/5 -m-4 md:-m-8 rounded-[3rem] md:rounded-[4rem]"></div>
             <div className="bg-slate-100 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden h-[400px] md:h-[600px] shadow-2xl relative z-10">
               <RobustImage 
                 src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1200" 
                 alt="Luxury Tented Camp" 
                 className="w-full h-full object-cover"
               />
             </div>
           </div>
           <div className="w-full md:w-1/2 space-y-6 md:space-y-8">
              <span className="text-sky-500 uppercase tracking-[0.4em] text-xs font-black">Private Curation</span>
              <h2 className="text-4xl md:text-7xl font-serif leading-tight text-slate-900">Bespoke Journeys.</h2>
              <p className="text-slate-500 text-lg md:text-xl font-medium max-w-lg">
                Your private expedition, designed without compromise.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 pt-4 md:pt-6">
                <div className="group">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-4 md:mb-6 group-hover:bg-teal-600 group-hover:text-white transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                  </div>
                  <p className="text-xs md:text-sm uppercase tracking-widest font-black text-slate-900 mb-2">Tailored Routes</p>
                  <p className="text-[10px] md:text-xs text-slate-400 font-medium leading-relaxed">Every turn mapped to your unique rhythm and curiosity.</p>
                </div>
                <div className="group">
                   <div className="w-10 h-10 md:w-12 md:h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500 mb-4 md:mb-6 group-hover:bg-sky-500 group-hover:text-white transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" /></svg>
                  </div>
                  <p className="text-xs md:text-sm uppercase tracking-widest font-black text-slate-900 mb-2">Private Crew</p>
                  <p className="text-[10px] md:text-xs text-slate-400 font-medium leading-relaxed">Dedicated experts at your command, from peak to base.</p>
                </div>
              </div>
              <div className="pt-4 md:pt-8">
                <Link to="/destinations" className="inline-block bg-slate-900 text-white px-10 md:px-12 py-4 md:py-5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-xl hover:bg-teal-600 transition-all w-full md:w-auto text-center">
                  Design Your Route
                </Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
