
import React, { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trip, Difficulty, ActivityType, ItineraryItem, GalleryImage } from '../types';
import { MOCK_ADDONS } from '../constants';

interface AdminDashboardProps {
  trips: Trip[];
  onAdd: (trip: Trip) => void;
  onUpdate: (trip: Trip) => void;
  onDelete: (id: string) => void;
  galleryItems: GalleryImage[];
  onGalleryAdd: (item: GalleryImage) => void;
  onGalleryUpdate: (item: GalleryImage) => void;
  onGalleryDelete: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  trips, onAdd, onUpdate, onDelete,
  galleryItems, onGalleryAdd, onGalleryUpdate, onGalleryDelete 
}) => {
  const [activeTab, setActiveTab] = useState<'trips' | 'gallery'>('trips');
  
  // Inventory Filters
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCountryFilter, setInventoryCountryFilter] = useState('All');
  const [inventoryActivityFilter, setInventoryActivityFilter] = useState('All');

  // Trip State
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [tripMainImageMethod, setTripMainImageMethod] = useState<'url' | 'file'>('url');
  const [tripGalleryMethod, setTripGalleryMethod] = useState<'url' | 'file'>('url');
  
  // Gallery (Global) State
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [galleryMethod, setGalleryMethod] = useState<'url' | 'file'>('url');

  const initialTripForm: Partial<Trip> = {
    title: '',
    description: '',
    destination: '',
    country: '',
    basePrice: 0,
    activity: ActivityType.TREKKING,
    difficulty: Difficulty.MODERATE,
    duration: '7 Days',
    mainImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
    featured: true,
    addons: MOCK_ADDONS,
    itinerary: [],
    tags: [],
    galleryImages: []
  };

  const initialGalleryForm: Partial<GalleryImage> = {
    url: '',
    type: 'image',
    location: '',
    activity: ActivityType.TREKKING
  };

  const [tripFormData, setTripFormData] = useState<Partial<Trip>>(initialTripForm);
  const [galleryFormData, setGalleryFormData] = useState<Partial<GalleryImage>>(initialGalleryForm);

  // Deriving filter options for the admin table
  const availableCountries = useMemo(() => {
    return Array.from(new Set(trips.map(t => t.country))).sort();
  }, [trips]);

  const availableActivities = useMemo(() => {
    return Array.from(new Set(trips.map(t => t.activity))).sort();
  }, [trips]);

  const filteredInventory = useMemo(() => {
    return trips.filter(t => {
      const matchesSearch = !inventorySearch || t.title.toLowerCase().includes(inventorySearch.toLowerCase()) || t.destination.toLowerCase().includes(inventorySearch.toLowerCase());
      const matchesCountry = inventoryCountryFilter === 'All' || t.country === inventoryCountryFilter;
      const matchesActivity = inventoryActivityFilter === 'All' || t.activity === inventoryActivityFilter;
      return matchesSearch && matchesCountry && matchesActivity;
    });
  }, [trips, inventorySearch, inventoryCountryFilter, inventoryActivityFilter]);

  // --- TRIP HANDLERS ---
  const handleSaveTrip = () => {
    if (editingTripId) {
      onUpdate({ ...tripFormData, id: editingTripId } as Trip);
    } else {
      onAdd({
        ...tripFormData,
        id: Math.random().toString(36).substr(2, 9),
      } as Trip);
    }
    setIsAddingTrip(false);
    setEditingTripId(null);
    setTripFormData(initialTripForm);
  };

  const startEditTrip = (trip: Trip) => {
    setEditingTripId(trip.id);
    setTripFormData({ ...trip });
    setTripMainImageMethod(trip.mainImage.startsWith('data:') ? 'file' : 'url');
    setIsAddingTrip(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'main' | 'gallery' | 'global') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (target === 'main') {
          setTripFormData({ ...tripFormData, mainImage: result });
        } else if (target === 'gallery') {
          setTripFormData({
            ...tripFormData,
            galleryImages: [...(tripFormData.galleryImages || []), result]
          });
        } else if (target === 'global') {
          setGalleryFormData({ ...galleryFormData, url: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addItineraryDay = () => {
    const nextDay = (tripFormData.itinerary?.length || 0) + 1;
    const newDay: ItineraryItem = { day: nextDay, title: '', description: '' };
    setTripFormData({ ...tripFormData, itinerary: [...(tripFormData.itinerary || []), newDay] });
  };

  const updateItineraryDay = (index: number, field: keyof ItineraryItem, value: any) => {
    const updated = [...(tripFormData.itinerary || [])];
    updated[index] = { ...updated[index], [field]: value };
    setTripFormData({ ...tripFormData, itinerary: updated });
  };

  const removeItineraryDay = (index: number) => {
    const updated = (tripFormData.itinerary || [])
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, day: i + 1 }));
    setTripFormData({ ...tripFormData, itinerary: updated });
  };

  const addTripGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setTripFormData({
        ...tripFormData,
        galleryImages: [...(tripFormData.galleryImages || []), newGalleryUrl.trim()]
      });
      setNewGalleryUrl('');
    }
  };

  const removeTripGalleryImage = (index: number) => {
    setTripFormData({
      ...tripFormData,
      galleryImages: (tripFormData.galleryImages || []).filter((_, i) => i !== index)
    });
  };

  // --- GALLERY HANDLERS ---
  const handleSaveGallery = () => {
    if (editingGalleryId) {
      onGalleryUpdate({ ...galleryFormData, id: editingGalleryId } as GalleryImage);
    } else {
      onGalleryAdd({
        ...galleryFormData,
        id: Math.random().toString(36).substr(2, 9)
      } as GalleryImage);
    }
    setIsAddingGallery(false);
    setEditingGalleryId(null);
    setGalleryFormData(initialGalleryForm);
  };

  const startEditGallery = (item: GalleryImage) => {
    setEditingGalleryId(item.id);
    setGalleryFormData({ ...item });
    setGalleryMethod(item.url.startsWith('data:') ? 'file' : 'url');
    setIsAddingGallery(true);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-72 border-r border-slate-200 bg-white flex flex-col p-10">
        <h2 className="text-xl font-serif text-slate-900 mb-16 tracking-widest uppercase flex items-center">
          <span className="text-teal-600 font-bold">V</span><span className="-ml-0.5">AHA VOYAGES</span>
        </h2>
        <nav className="space-y-4">
          <button 
            onClick={() => setActiveTab('trips')}
            className={`flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] w-full p-4 rounded-2xl transition-all ${activeTab === 'trips' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'text-slate-400 hover:bg-slate-50 hover:text-teal-600'}`}
          >
            Expeditions
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] w-full p-4 rounded-2xl transition-all ${activeTab === 'gallery' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'text-slate-400 hover:bg-slate-50 hover:text-teal-600'}`}
          >
            Gallery Assets
          </button>
          <Link to="/portal-access-vaha/leads" className="flex items-center gap-4 text-slate-400 hover:bg-slate-50 hover:text-teal-600 p-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all">
            Lead Desk
          </Link>
          <div className="pt-20 border-t border-slate-50 mt-10">
            <Link to="/" className="text-[10px] text-slate-300 uppercase tracking-[0.4em] font-black hover:text-teal-600">Site Home</Link>
          </div>
        </nav>
      </aside>

      <main className="flex-grow overflow-y-auto p-16">
        {activeTab === 'trips' ? (
          <>
            <div className="flex justify-between items-center mb-16">
              <h1 className="text-5xl font-serif text-slate-900">Inventory Portal</h1>
              <button 
                onClick={() => { setIsAddingTrip(true); setEditingTripId(null); setTripFormData(initialTripForm); }}
                className="bg-teal-600 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all shadow-xl shadow-teal-600/20"
              >
                + Publish New Trip
              </button>
            </div>

            {/* Inventory Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 bg-white p-6 rounded-3xl border border-slate-200">
               <div className="space-y-2">
                 <label className="text-[9px] uppercase font-black tracking-widest text-slate-400 px-1">Quick Search</label>
                 <input 
                   type="text" 
                   placeholder="By title or location..."
                   className="w-full bg-slate-50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-bold"
                   value={inventorySearch}
                   onChange={e => setInventorySearch(e.target.value)}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] uppercase font-black tracking-widest text-slate-400 px-1">Country Filter</label>
                 <select 
                    className="w-full bg-slate-50 rounded-xl p-3 text-sm focus:outline-none font-bold appearance-none cursor-pointer"
                    value={inventoryCountryFilter}
                    onChange={e => setInventoryCountryFilter(e.target.value)}
                 >
                   <option value="All">All Territories</option>
                   {availableCountries.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] uppercase font-black tracking-widest text-slate-400 px-1">Activity Filter</label>
                 <select 
                    className="w-full bg-slate-50 rounded-xl p-3 text-sm focus:outline-none font-bold appearance-none cursor-pointer"
                    value={inventoryActivityFilter}
                    onChange={e => setInventoryActivityFilter(e.target.value)}
                 >
                   <option value="All">All Activities</option>
                   {availableActivities.map(a => <option key={a} value={a}>{a}</option>)}
                 </select>
               </div>
               <div className="flex items-end pb-1">
                 <button 
                   onClick={() => { setInventorySearch(''); setInventoryCountryFilter('All'); setInventoryActivityFilter('All'); }}
                   className="text-[9px] uppercase font-black tracking-widest text-slate-300 hover:text-teal-600 transition-colors px-2 underline"
                 >
                   Reset Filters
                 </button>
               </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black">
                    <th className="p-8">Expedition</th>
                    <th className="p-8">Pricing</th>
                    <th className="p-8">Country</th>
                    <th className="p-8 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredInventory.map(trip => (
                    <tr key={trip.id} className="hover:bg-slate-50 transition-all">
                      <td className="p-8">
                        <div className="flex items-center gap-6">
                          <img src={trip.mainImage} className="w-14 h-14 object-cover rounded-2xl" alt="" />
                          <div>
                            <p className="font-black text-slate-900 uppercase tracking-widest text-sm">{trip.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{trip.destination}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-8 text-sm text-slate-900 font-bold">₹{trip.basePrice.toLocaleString()}</td>
                      <td className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">{trip.country}</td>
                      <td className="p-8 text-right space-x-6">
                        <button onClick={() => startEditTrip(trip)} className="text-[10px] text-teal-600 font-black uppercase tracking-widest hover:text-slate-900">Edit</button>
                        <button onClick={() => onDelete(trip.id)} className="text-[10px] text-red-400 font-black uppercase tracking-widest hover:text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {filteredInventory.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-20 text-center text-slate-300 font-medium italic">No results found for your search filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-16">
              <h1 className="text-5xl font-serif text-slate-900">Visual Assets</h1>
              <button 
                onClick={() => { setIsAddingGallery(true); setEditingGalleryId(null); setGalleryFormData(initialGalleryForm); }}
                className="bg-sky-500 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all shadow-xl shadow-sky-500/20"
              >
                + Add Asset
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {galleryItems.map(item => (
                <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm group">
                  <div className="aspect-[4/5] relative">
                    {item.type === 'video' ? (
                      <video src={item.url} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={item.url} className="w-full h-full object-cover" alt="" />
                    )}
                    <div className="absolute top-4 right-4 bg-teal-600 text-white text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-lg">
                      {item.type}
                    </div>
                    <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                      <button onClick={() => startEditGallery(item)} className="p-3 bg-white text-teal-600 rounded-full shadow-lg">Edit</button>
                      <button onClick={() => onGalleryDelete(item.id)} className="p-3 bg-white text-red-500 rounded-full shadow-lg">Delete</button>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{item.location}</p>
                    <p className="text-xs font-black uppercase tracking-widest text-teal-600">{item.activity}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* --- TRIP EDITOR MODAL --- */}
        {isAddingTrip && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-8">
            <div className="bg-white rounded-[3rem] w-full max-w-6xl p-12 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-serif">{editingTripId ? 'Refine Expedition' : 'New Expedition'}</h2>
                <button onClick={() => setIsAddingTrip(false)} className="text-slate-400 hover:text-slate-900">Close</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-teal-600 border-b border-teal-50 pb-2">Core Identity</h3>
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Title</label>
                    <input type="text" className="w-full bg-slate-50 border-0 rounded-2xl p-4 font-bold" value={tripFormData.title} onChange={e => setTripFormData({...tripFormData, title: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Price (INR)</label>
                      <input type="number" className="w-full bg-slate-50 border-0 rounded-2xl p-4 font-bold" value={tripFormData.basePrice} onChange={e => setTripFormData({...tripFormData, basePrice: parseInt(e.target.value) || 0})} />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Duration</label>
                      <input type="text" className="w-full bg-slate-50 border-0 rounded-2xl p-4 font-bold" value={tripFormData.duration} onChange={e => setTripFormData({...tripFormData, duration: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Destination, Country & Activity</label>
                    <div className="flex gap-4">
                      <input type="text" placeholder="City" className="w-full bg-slate-50 border-0 rounded-2xl p-4 font-bold" value={tripFormData.destination} onChange={e => setTripFormData({...tripFormData, destination: e.target.value})} />
                      <input type="text" placeholder="Country" className="w-full bg-slate-50 border-0 rounded-2xl p-4 font-bold" value={tripFormData.country} onChange={e => setTripFormData({...tripFormData, country: e.target.value})} />
                      <select 
                        className="w-full bg-slate-50 border-0 rounded-2xl p-4 font-bold appearance-none cursor-pointer" 
                        value={tripFormData.activity} 
                        onChange={e => setTripFormData({...tripFormData, activity: e.target.value as ActivityType})}
                      >
                        {Object.values(ActivityType).map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-teal-600 border-b border-teal-50 pb-2">Visual Media</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Main Hero Image</label>
                      <div className="flex bg-slate-100 rounded-full p-1 scale-90">
                        <button onClick={() => setTripMainImageMethod('url')} className={`px-4 py-1 rounded-full text-[9px] font-black uppercase transition-all ${tripMainImageMethod === 'url' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}>URL</button>
                        <button onClick={() => setTripMainImageMethod('file')} className={`px-4 py-1 rounded-full text-[9px] font-black uppercase transition-all ${tripMainImageMethod === 'file' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}>Upload</button>
                      </div>
                    </div>
                    {tripMainImageMethod === 'url' ? (
                      <input type="text" className="w-full bg-slate-50 border-0 rounded-2xl p-4 font-bold" value={tripFormData.mainImage} onChange={e => setTripFormData({...tripFormData, mainImage: e.target.value})} />
                    ) : (
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'main')} className="w-full bg-slate-50 rounded-2xl p-4 text-xs font-bold" />
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Trip Gallery</label>
                      <div className="flex bg-slate-100 rounded-full p-1 scale-90">
                        <button onClick={() => setTripGalleryMethod('url')} className={`px-4 py-1 rounded-full text-[9px] font-black uppercase transition-all ${tripGalleryMethod === 'url' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}>URL</button>
                        <button onClick={() => setTripGalleryMethod('file')} className={`px-4 py-1 rounded-full text-[9px] font-black uppercase transition-all ${tripGalleryMethod === 'file' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}>Upload</button>
                      </div>
                    </div>
                    {tripGalleryMethod === 'url' ? (
                      <div className="flex gap-2">
                        <input type="text" className="flex-grow bg-slate-50 border-0 rounded-2xl p-4 font-bold" placeholder="Paste link..." value={newGalleryUrl} onChange={e => setNewGalleryUrl(e.target.value)} />
                        <button onClick={addTripGalleryImage} className="bg-teal-600 text-white px-6 rounded-2xl font-black">Add</button>
                      </div>
                    ) : (
                      <input type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e, 'gallery')} className="w-full bg-slate-50 rounded-2xl p-4 text-xs font-bold" />
                    )}
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {tripFormData.galleryImages?.map((url, idx) => (
                        <div key={idx} className="relative aspect-square group">
                          <img src={url} className="w-full h-full object-cover rounded-xl" alt="" />
                          <button onClick={() => removeTripGalleryImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-8 mt-4">
                  <div className="flex justify-between items-center border-b border-teal-50 pb-2">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-teal-600">Curated Itinerary</h3>
                    <button onClick={addItineraryDay} className="text-teal-600 text-[10px] font-black uppercase">+ Add Day</button>
                  </div>
                  <div className="space-y-6">
                    {tripFormData.itinerary?.map((day, idx) => (
                      <div key={idx} className="bg-slate-50 p-6 rounded-[2rem] flex gap-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-serif text-teal-600 text-xl border border-teal-100">{day.day}</div>
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" placeholder="Title" className="w-full bg-white border-0 rounded-xl p-3 font-bold" value={day.title} onChange={e => updateItineraryDay(idx, 'title', e.target.value)} />
                          <textarea placeholder="Details" className="w-full bg-white border-0 rounded-xl p-3 font-medium h-24" value={day.description} onChange={e => updateItineraryDay(idx, 'description', e.target.value)} />
                        </div>
                        <button onClick={() => removeItineraryDay(idx)} className="text-red-400 hover:text-red-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-16 flex justify-end gap-6 border-t border-slate-100 pt-10">
                <button onClick={() => setIsAddingTrip(false)} className="text-[10px] uppercase font-black tracking-widest text-slate-400">Discard</button>
                <button onClick={handleSaveTrip} className="bg-teal-600 text-white px-16 py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-600/20">
                  {editingTripId ? 'Commit Updates' : 'Publish Expedition'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- GLOBAL GALLERY MODAL --- */}
        {isAddingGallery && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-8">
            <div className="bg-white rounded-[3rem] w-full max-w-lg p-12">
              <h2 className="text-3xl font-serif mb-8">{editingGalleryId ? 'Update Asset' : 'New Visual Asset'}</h2>
              <div className="space-y-6">
                <div className="flex gap-4 mb-4">
                  <button 
                    onClick={() => setGalleryFormData({...galleryFormData, type: 'image'})}
                    className={`flex-grow py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${galleryFormData.type === 'image' ? 'border-teal-600 bg-teal-50 text-teal-600' : 'border-slate-100 text-slate-400'}`}
                  >
                    Image
                  </button>
                  <button 
                    onClick={() => setGalleryFormData({...galleryFormData, type: 'video'})}
                    className={`flex-grow py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${galleryFormData.type === 'video' ? 'border-teal-600 bg-teal-50 text-teal-600' : 'border-slate-100 text-slate-400'}`}
                  >
                    Video
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset {galleryMethod === 'url' ? 'Link' : 'File'}</label>
                    <div className="flex bg-slate-100 rounded-full p-1 scale-75">
                      <button onClick={() => setGalleryMethod('url')} className={`px-4 py-1 rounded-full text-[9px] font-black uppercase ${galleryMethod === 'url' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}>URL</button>
                      <button onClick={() => setGalleryMethod('file')} className={`px-4 py-1 rounded-full text-[9px] font-black uppercase ${galleryMethod === 'file' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}>Upload</button>
                    </div>
                  </div>
                  {galleryMethod === 'url' ? (
                    <input type="text" placeholder={`Paste ${galleryFormData.type} link...`} className="w-full bg-slate-50 border-0 rounded-2xl p-4 font-bold" value={galleryFormData.url} onChange={e => setGalleryFormData({...galleryFormData, url: e.target.value})} />
                  ) : (
                    <input type="file" accept={galleryFormData.type === 'image' ? "image/*" : "video/*"} onChange={(e) => handleFileUpload(e, 'global')} className="w-full bg-slate-50 rounded-2xl p-4 text-xs font-bold" />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location Label</label>
                  <input type="text" className="w-full bg-slate-50 border-0 rounded-2xl p-4 font-bold" value={galleryFormData.location} onChange={e => setGalleryFormData({...galleryFormData, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Activity Category</label>
                  <select className="w-full bg-slate-50 border-0 rounded-2xl p-4 font-bold" value={galleryFormData.activity} onChange={e => setGalleryFormData({...galleryFormData, activity: e.target.value as ActivityType})}>
                    {Object.values(ActivityType).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-12 flex justify-end gap-6">
                <button onClick={() => setIsAddingGallery(false)} className="text-[10px] font-black uppercase text-slate-400">Abort</button>
                <button onClick={handleSaveGallery} className="bg-sky-500 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs">Confirm Asset</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
