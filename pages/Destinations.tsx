
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Trip } from '../types';

interface TripImageProps {
  src: string;
  alt: string;
}

const TripImage: React.FC<TripImageProps> = ({ src, alt }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setStatus('loaded');
    }
  }, [src]);

  return (
    <div className="w-full h-full bg-slate-100 relative overflow-hidden">
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 backdrop-blur-sm z-10">
          <div className="w-8 h-8 border-2 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-100 z-10">
          <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-black">Expedition Visual Unavailable</span>
        </div>
      )}

      <img 
        ref={imgRef}
        src={src} 
        alt={alt} 
        referrerPolicy="no-referrer"
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-[1.5s] ease-out 
          ${status === 'loaded' ? 'opacity-100 blur-0' : 'opacity-0 blur-md'}`}
      />
    </div>
  );
};

interface DestinationsProps {
  trips: Trip[];
}

const Destinations: React.FC<DestinationsProps> = ({ trips }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q')?.toLowerCase() || '';
  const countryFilter = searchParams.get('country') || 'All Countries';
  const activityFilter = searchParams.get('activity') || 'All Activities';

  // Dynamically derive unique filter options from current trips
  const availableCountries = useMemo(() => {
    return Array.from(new Set(trips.map(t => t.country))).sort();
  }, [trips]);

  const availableActivities = useMemo(() => {
    return Array.from(new Set(trips.map(t => t.activity))).sort();
  }, [trips]);

  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      const matchesQuery = !query || 
        trip.title.toLowerCase().includes(query) || 
        trip.destination.toLowerCase().includes(query) ||
        trip.description.toLowerCase().includes(query) ||
        trip.tags?.some(tag => tag.includes(query)) ||
        trip.country.toLowerCase().includes(query);
      
      const matchesCountry = countryFilter === 'All Countries' || trip.country === countryFilter;
      const matchesActivity = activityFilter === 'All Activities' || trip.activity === activityFilter;

      return matchesQuery && matchesCountry && matchesActivity;
    });
  }, [trips, query, countryFilter, activityFilter]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value.includes('All ')) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-40 pb-32 px-6">
      <div className="container mx-auto">
        <div className="mb-20">
          <div className="max-w-4xl">
            <span className="text-teal-600 uppercase tracking-[0.4em] text-xs font-black mb-4 block">World-Class Horizons</span>
            <h1 className="text-6xl md:text-8xl font-serif mb-8 text-slate-900">Explore the<br/><span className="italic">Wild & Serene</span></h1>
          </div>
          
          {/* Top Filter Bar */}
          <div className="flex flex-col md:flex-row gap-6 mt-12 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex-grow flex items-center px-6 py-3 bg-slate-50 rounded-2xl border border-transparent focus-within:border-teal-500/30 transition-all">
              <svg className="w-5 h-5 text-slate-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="Search expeditions..."
                className="bg-transparent text-slate-900 focus:outline-none w-full font-medium"
                value={query}
                onChange={(e) => updateFilter('q', e.target.value)}
              />
            </div>

            <div className="md:w-64">
              <select 
                className="w-full bg-slate-50 border border-transparent focus:border-teal-500/30 rounded-2xl p-4 font-bold text-slate-700 appearance-none cursor-pointer"
                value={countryFilter}
                onChange={(e) => updateFilter('country', e.target.value)}
              >
                <option value="All Countries">All Territories</option>
                {availableCountries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="md:w-64">
              <select 
                className="w-full bg-slate-50 border border-transparent focus:border-teal-500/30 rounded-2xl p-4 font-bold text-slate-700 appearance-none cursor-pointer"
                value={activityFilter}
                onChange={(e) => updateFilter('activity', e.target.value)}
              >
                <option value="All Activities">All Activities</option>
                {availableActivities.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
        </div>

        {filteredTrips.length === 0 ? (
          <div className="text-center py-40 rounded-[3rem] bg-white shadow-sm border border-slate-100">
            <h2 className="text-3xl font-serif text-slate-300 mb-6">No expeditions match your current hunt.</h2>
            <button onClick={() => setSearchParams({})} className="inline-block bg-teal-600 text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-teal-600/20 hover:scale-105 transition-all">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredTrips.map((trip) => (
              <div key={trip.id} className="group bg-white rounded-[3rem] border border-slate-100 overflow-hidden flex flex-col h-full hover:shadow-2xl hover:shadow-teal-900/10 transition-all duration-500 hover:-translate-y-2">
                <div className="relative h-80 overflow-hidden">
                  <TripImage src={trip.mainImage} alt={trip.title} />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] text-teal-700 font-black shadow-lg z-20">
                    {trip.difficulty}
                  </div>
                  <div className="absolute top-6 right-6 bg-slate-900/40 backdrop-blur-sm px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] text-white font-black z-20">
                    {trip.country}
                  </div>
                </div>
                <div className="p-10 flex flex-col flex-grow">
                  <div className="mb-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black mb-3">{trip.destination}, {trip.country}</p>
                    <h3 className="text-3xl font-serif text-slate-900 leading-tight">{trip.title}</h3>
                  </div>
                  <p className="text-slate-500 leading-relaxed line-clamp-2 mb-8 flex-grow font-medium">
                    {trip.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-10">
                    {trip.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-widest text-teal-600 font-black bg-teal-50 px-4 py-1.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-widest space-y-2">
                      <p className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-sm shadow-teal-500/30"></span> {trip.duration}
                      </p>
                      <p className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400/30"></span> {trip.activity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">From</p>
                      <p className="text-2xl font-serif text-slate-900 font-bold">₹{trip.basePrice.toLocaleString()}</p>
                    </div>
                  </div>
                  <Link 
                    to={`/trip/${trip.id}`} 
                    className="mt-10 w-full text-center py-6 bg-teal-600 rounded-full text-white uppercase text-xs tracking-[0.3em] font-black shadow-lg shadow-teal-600/20 hover:bg-slate-900 transition-all active:scale-95"
                  >
                    Explore Journey
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;
