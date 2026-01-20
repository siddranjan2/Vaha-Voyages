
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
import { supabase } from './supabase';

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
             <a href="#" className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-white hover:bg-teal-600 transition-all duration-300">Insta</a>
             <a href="#" className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-white hover:bg-teal-600 transition-all duration-300">WA</a>
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
    try {
      setLoading(true);
      // Fetch Trips from Supabase
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
        // Use Mock data if DB is empty or connection fails
        console.warn('Trips fetch returned empty or failed, using fallback:', tripsError);
        setTrips(MOCK_TRIPS);
      }

      // Fetch Gallery
      const { data: galleryData } = await supabase.from('gallery').select('*');
      if (galleryData && galleryData.length > 0) {
        setGalleryItems(galleryData);
      } else {
        setGalleryItems(GALLERY_IMAGES);
      }

      // Fetch Leads
      const { data: leadsData } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (leadsData) {
        setLeads(leadsData.map(l => ({
          ...l,
          tripId: l.trip_id,
          date: l.created_at
        })));
      }
    } catch (err) {
      console.error('Initial load failed entirely, using full mock fallback', err);
      setTrips(MOCK_TRIPS);
      setGalleryItems(GALLERY_IMAGES);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrip = async (newTrip: Trip) => {
    const { error } = await supabase.from('trips').insert([{
      ...newTrip,
      base_price: newTrip.basePrice,
      main_image: newTrip.mainImage,
      gallery_images: newTrip.galleryImages,
      itinerary: newTrip.itinerary,
      tags: newTrip.tags
    }]);
    if (!error) fetchData();
    else console.error('Error adding trip:', error);
  };

  const handleUpdateTrip = async (updated: Trip) => {
    const { error } = await supabase.from('trips').update({
      ...updated,
      base_price: updated.basePrice,
      main_image: updated.mainImage,
      gallery_images: updated.galleryImages,
      itinerary: updated.itinerary,
      tags: updated.tags
    }).eq('id', updated.id);
    if (!error) fetchData();
    else console.error('Error updating trip:', error);
  };

  const handleDeleteTrip = async (id: string) => {
    const { error } = await supabase.from('trips').delete().eq('id', id);
    if (!error) fetchData();
    else console.error('Error deleting trip:', error);
  };
  
  const handleAddGallery = async (item: GalleryImage) => {
    const { error } = await supabase.from('gallery').insert([item]);
    if (!error) fetchData();
  };

  const handleUpdateGallery = async (updated: GalleryImage) => {
    const { error } = await supabase.from('gallery').update(updated).eq('id', updated.id);
    if (!error) fetchData();
  };

  const handleDeleteGallery = async (id: string) => {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (!error) fetchData();
  };

  const handleAddInquiry = async (inquiry: Inquiry) => {
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
    if (!error) fetchData();
    else console.error('Error submitting lead:', error);
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
