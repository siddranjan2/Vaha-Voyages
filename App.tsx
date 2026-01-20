
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Destinations from './pages/Destinations';
import AdminDashboard from './pages/AdminDashboard';
import AdminLeads from './pages/AdminLeads';
import AdminLogin from './pages/AdminLogin';
import TripDetail from './pages/TripDetail';
import { MOCK_TRIPS, GALLERY_IMAGES } from './constants';
import { Trip, Inquiry, GalleryImage } from './types';

// Admin Auth Wrapper
const ProtectedAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check session storage for auth
    const auth = sessionStorage.getItem('vaha_admin_auth');
    setIsAuthenticated(auth === 'true');
  }, []);

  const handleLogin = (passphrase: string) => {
    if (passphrase === 'vaha2025') {
      sessionStorage.setItem('vaha_admin_auth', 'true');
      setIsAuthenticated(true);
    }
  };

  if (isAuthenticated === null) return null; // Loading state

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <>{children}</>;
};

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

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
  if (location.pathname.startsWith('/admin')) return null;
  return (
    <footer className="bg-slate-50 border-t border-slate-100 py-16">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-serif mb-6 text-slate-900 uppercase tracking-widest"><span className="text-teal-600">V</span>AHA VOYAGES</h2>
          <p className="text-slate-500 max-w-sm leading-relaxed mb-8 font-medium">
            Curating Asia's most exclusive adventure experiences. We define the new way to travel.
          </p>
          <div className="flex gap-5">
             <a 
               href="https://instagram.com" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-white hover:bg-teal-600 hover:border-teal-600 transition-all duration-300 group"
             >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
             </a>
             <a 
               href="https://whatsapp.com" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-white hover:bg-teal-600 hover:border-teal-600 transition-all duration-300 group"
             >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.887.002-5.462-4.415-9.89-9.881-9.891-5.446 0-9.884 4.438-9.887 9.887-.001 2.22.634 4.385 1.835 6.265l-1.015 3.71 3.844-.888zm11.367-7.312c-.151-.252-.555-.403-1.161-.706-.606-.303-3.584-1.767-4.139-1.969-.556-.202-.96-.303-1.363.303-.404.606-1.565 1.97-1.918 2.374-.354.404-.707.455-1.313.152-.606-.303-2.559-1.13-4.874-3.195-1.762-1.571-2.951-3.511-3.297-4.117-.347-.606-.038-.933.265-1.234.272-.271.606-.706.808-1.01.202-.303.269-.522.404-.875.135-.353.067-.656-.034-.858-.101-.202-.858-2.068-1.176-2.834-.31-.749-.624-.648-.858-.66l-.733-.008c-.252 0-.663.095-1.008.473-.346.378-1.321 1.291-1.321 3.148 0 1.857 1.354 3.653 1.539 3.905.185.252 2.651 4.049 6.423 5.676.897.387 1.597.618 2.14.793 1.05.334 2.006.287 2.76.175.842-.125 2.583-1.056 2.946-2.074.364-1.018.364-1.892.253-2.074z" />
                </svg>
             </a>
          </div>
        </div>
        <div>
          <h3 className="text-teal-600 uppercase tracking-widest text-xs font-bold mb-6">Explore</h3>
          <ul className="space-y-4 text-sm text-slate-600 font-medium">
            <li><Link to="/destinations" className="hover:text-teal-600 transition-colors">Destinations</Link></li>
            <li><Link to="/gallery" className="hover:text-teal-600 transition-colors">The Gallery</Link></li>
            <li><Link to="/" className="hover:text-teal-600 transition-colors">Signature Trips</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-teal-600 uppercase tracking-widest text-xs font-bold mb-6">Support</h3>
          <ul className="space-y-4 text-sm text-slate-600 font-medium">
            <li><a href="#" className="hover:text-teal-600 transition-colors">Curated Itineraries</a></li>
            <li><a href="#" className="hover:text-teal-600 transition-colors">Private Expedition</a></li>
            <li><a href="#" className="hover:text-teal-600 transition-colors">Privacy Policy</a></li>
            <li><Link to="/admin" className="text-slate-200 hover:text-teal-600 transition-colors mt-8 block">Partner Access</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-12 pt-8 border-t border-slate-200 text-center text-[10px] text-slate-400 uppercase tracking-widest">
        &copy; 2024 Vaha Voyages Adventure & Wellness. All Rights Reserved.
      </div>
    </footer>
  );
};

// Persistence helper
const loadPersistedData = <T,>(key: string, fallback: T): T => {
  const data = localStorage.getItem(key);
  if (!data) return fallback;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error(`Error hydrating ${key}:`, e);
    return fallback;
  }
};

const App: React.FC = () => {
  // Initialize state from localStorage or Fallbacks
  const [trips, setTrips] = useState<Trip[]>(() => loadPersistedData('vaha_trips_v1', MOCK_TRIPS));
  const [galleryItems, setGalleryItems] = useState<GalleryImage[]>(() => loadPersistedData('vaha_gallery_v1', GALLERY_IMAGES));
  const [leads, setLeads] = useState<Inquiry[]>(() => loadPersistedData('vaha_leads_v1', []));

  // Sync with localStorage on change
  useEffect(() => {
    localStorage.setItem('vaha_trips_v1', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('vaha_gallery_v1', JSON.stringify(galleryItems));
  }, [galleryItems]);

  useEffect(() => {
    localStorage.setItem('vaha_leads_v1', JSON.stringify(leads));
  }, [leads]);

  const addTrip = (newTrip: Trip) => setTrips(prev => [newTrip, ...prev]);
  const updateTrip = (updated: Trip) => setTrips(prev => prev.map(t => t.id === updated.id ? updated : t));
  const deleteTrip = (id: string) => setTrips(prev => prev.filter(t => t.id !== id));
  
  const addGalleryItem = (item: GalleryImage) => setGalleryItems(prev => [item, ...prev]);
  const updateGalleryItem = (updated: GalleryImage) => setGalleryItems(prev => prev.map(i => i.id === updated.id ? updated : i));
  const deleteGalleryItem = (id: string) => setGalleryItems(prev => prev.filter(i => i.id !== id));

  const addInquiry = (inquiry: Inquiry) => setLeads(prev => [inquiry, ...prev]);

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home trips={trips.filter(t => t.featured)} />} />
            <Route path="/destinations" element={<Destinations trips={trips} />} />
            <Route path="/gallery" element={<Gallery images={galleryItems} />} />
            <Route path="/trip/:id" element={<TripDetail trips={trips} onInquiry={addInquiry} />} />
            <Route path="/admin" element={
              <ProtectedAdmin>
                <AdminDashboard 
                  trips={trips} 
                  onAdd={addTrip} 
                  onUpdate={updateTrip} 
                  onDelete={deleteTrip}
                  galleryItems={galleryItems}
                  onGalleryAdd={addGalleryItem}
                  onGalleryUpdate={updateGalleryItem}
                  onGalleryDelete={deleteGalleryItem}
                />
              </ProtectedAdmin>
            } />
            <Route path="/admin/leads" element={
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
