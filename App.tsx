
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Destinations from './pages/Destinations';
import AdminDashboard from './pages/AdminDashboard';
import AdminLeads from './pages/AdminLeads';
import AdminLogin from './pages/AdminLogin';
import TripDetail from './pages/TripDetail';
import { MOCK_TRIPS, GALLERY_IMAGES } from './constants';
import { Trip, Inquiry, GalleryImage } from './types';
import { supabase, isSupabaseConfigured } from './supabase';

const ProtectedAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem('vaha_admin_auth');
    setIsAuthenticated(auth === 'true');
  }, []);

  const handleLogin = (passphrase: string) => {
    if (passphrase === 'vaha2025') {
      sessionStorage.setItem('vaha_admin_auth', 'true');
      setIsAuthenticated(true);
    }
  };

  if (isAuthenticated === null) return null;
  if (!isAuthenticated) return <AdminLogin onLogin={handleLogin} />;
  return <>{children}</>;
};

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.includes('portal-access');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdmin) return null;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md py-3 md:py-4 shadow-sm' : 'bg-transparent py-4 md:py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-xl md:text-2xl font-serif tracking-[0.05em] text-slate-900 uppercase flex items-center">
          <span className="text-teal-600 font-bold">V</span><span className="-ml-0.5">AHA VOYAGES</span>
        </Link>
        <div className="hidden md:flex space-x-12 items-center">
          <Link to="/" className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors uppercase tracking-widest">Home</Link>
          <Link to="/destinations" className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors uppercase tracking-widest">Explore</Link>
          <Link to="/gallery" className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors uppercase tracking-widest">Gallery</Link>
        </div>
        <button className="md:hidden text-slate-900" aria-label="Toggle Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => {
  const location = useLocation();
  if (location.pathname.includes('portal-access')) return null;
  return (
    <footer className="bg-slate-50 border-t border-slate-100 py-16">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-serif mb-6 text-slate-900 uppercase tracking-widest"><span className="text-teal-600">V</span>AHA VOYAGES</h2>
          <p className="text-slate-500 max-w-sm leading-relaxed mb-8 font-medium">
            Curating Asia's most exclusive adventure experiences. We define the new way to travel.
          </p>
          <div className="flex gap-5">
             <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-teal-600 transition-all duration-300" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
             </a>
             <a href="https://wa.me/yournumber" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-teal-600 transition-all duration-300" aria-label="WhatsApp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
             </a>
          </div>
        </div>
        <div>
          <h3 className="text-teal-600 uppercase tracking-widest text-xs font-bold mb-6">Explore</h3>
          <ul className="space-y-4 text-sm text-slate-600 font-medium">
            <li><Link to="/destinations" className="hover:text-teal-600 transition-colors">Destinations</Link></li>
            <li><Link to="/gallery" className="hover:text-teal-600 transition-colors">The Gallery</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-teal-600 uppercase tracking-widest text-xs font-bold mb-6">Support</h3>
          <ul className="space-y-4 text-sm text-slate-600 font-medium">
            <li><a href="#" className="hover:text-teal-600 transition-colors">Itineraries</a></li>
            <li><a href="#" className="hover:text-teal-600 transition-colors">Privacy</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryImage[]>([]);
  const [leads, setLeads] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!isSupabaseConfigured) {
      console.info("Vaha Voyages: Supabase not configured. Using Mock Data.");
      setTrips(MOCK_TRIPS);
      setGalleryItems(GALLERY_IMAGES);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data: tripsData, error: tripsError } = await supabase.from('trips').select('*').order('featured', { ascending: false });
      if (tripsData && tripsData.length > 0) {
        setTrips(tripsData.map(t => ({
          ...t,
          basePrice: t.base_price,
          mainImage: t.main_image,
          galleryImages: t.gallery_images || [],
          itinerary: t.itinerary || [],
          tags: t.tags || []
        })));
      } else {
        if (tripsError) console.warn('Supabase fetch error:', tripsError);
        setTrips(MOCK_TRIPS);
      }

      const { data: galleryData } = await supabase.from('gallery').select('*');
      if (galleryData && galleryData.length > 0) {
        setGalleryItems(galleryData);
      } else {
        setGalleryItems(GALLERY_IMAGES);
      }

      const { data: leadsData } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (leadsData) {
        setLeads(leadsData.map(l => ({
          ...l,
          tripId: l.trip_id,
          date: l.created_at
        })));
      }
    } catch (err) {
      console.error('Initial load failed entirely', err);
      setTrips(MOCK_TRIPS);
      setGalleryItems(GALLERY_IMAGES);
    } finally {
      setLoading(false);
    }
  };

  const mapTripToDB = (trip: Trip) => ({
    id: trip.id,
    title: trip.title,
    description: trip.description,
    destination: trip.destination,
    country: trip.country,
    activity: trip.activity,
    duration: trip.duration,
    difficulty: trip.difficulty,
    base_price: trip.basePrice,
    main_image: trip.mainImage,
    gallery_images: trip.galleryImages,
    itinerary: trip.itinerary,
    featured: trip.featured,
    tags: trip.tags
  });

  const handleAddTrip = async (newTrip: Trip) => {
    if (!isSupabaseConfigured) return alert("Supabase not configured. Data will not persist.");
    const dbRecord = mapTripToDB(newTrip);
    const { error } = await supabase.from('trips').insert([dbRecord]);
    if (!error) {
      await fetchData();
      alert('Successfully added trip to database.');
    } else {
      console.error('Insert error:', error);
      alert(`Sync Failed: ${error.message}`);
    }
  };

  const handleUpdateTrip = async (updated: Trip) => {
    if (!isSupabaseConfigured) return alert("Supabase not configured. Data will not persist.");
    const dbRecord = mapTripToDB(updated);
    const { error } = await supabase.from('trips').update(dbRecord).eq('id', updated.id);
    if (!error) {
      await fetchData();
      alert('Changes synced to Supabase.');
    } else {
      console.error('Update error:', error);
      alert(`Sync Failed: ${error.message}`);
    }
  };

  const handleDeleteTrip = async (id: string) => {
    if (!isSupabaseConfigured) return;
    if (!confirm('Are you sure you want to delete this trip?')) return;
    const { error } = await supabase.from('trips').delete().eq('id', id);
    if (!error) await fetchData();
  };
  
  const handleAddGallery = async (item: GalleryImage) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('gallery').insert([item]);
    if (!error) await fetchData();
  };

  const handleUpdateGallery = async (updated: GalleryImage) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('gallery').update(updated).eq('id', updated.id);
    if (!error) await fetchData();
  };

  const handleDeleteGallery = async (id: string) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (!error) await fetchData();
  };

  const handleAddInquiry = async (inquiry: Inquiry) => {
    if (!isSupabaseConfigured) return console.info("Mock Lead:", inquiry);
    const { error } = await supabase.from('leads').insert([{
      id: inquiry.id,
      trip_id: inquiry.tripId,
      name: inquiry.name,
      email: inquiry.email,
      mobile: inquiry.mobile,
      message: inquiry.message,
      status: inquiry.status,
      created_at: inquiry.date
    }]);
    if (!error) await fetchData();
  };

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {!isSupabaseConfigured && location.pathname.includes('portal-access') && (
            <div className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest py-3 text-center px-6">
              Critical: Supabase Environment Variables Missing in Netlify Configuration
            </div>
          )}
          <Routes>
            <Route path="/" element={<Home trips={trips.filter(t => t.featured)} />} />
            <Route path="/destinations" element={<Destinations trips={trips} />} />
            <Route path="/gallery" element={<Gallery images={galleryItems} />} />
            <Route path="/trip/:id" element={<TripDetail trips={trips} onInquiry={handleAddInquiry} />} />
            <Route path="/portal-access-vaha" element={
              <ProtectedAdmin>
                <AdminDashboard 
                  trips={trips} 
                  onAdd={handleAddTrip} 
                  onUpdate={handleUpdateTrip} 
                  onDelete={handleDeleteTrip}
                  galleryItems={galleryItems}
                  onGalleryAdd={handleAddGallery}
                  onGalleryUpdate={handleUpdateGallery}
                  onGalleryDelete={handleDeleteGallery}
                />
              </ProtectedAdmin>
            } />
            <Route path="/portal-access-vaha/leads" element={
              <ProtectedAdmin>
                <AdminLeads leads={leads} />
              </ProtectedAdmin>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
