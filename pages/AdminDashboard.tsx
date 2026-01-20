
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trip, Difficulty, ActivityType, ItineraryItem, GalleryImage } from '../types';

interface AdminDashboardProps {
  trips: Trip[];
  onAdd: (trip: Trip) => Promise<void>;
  onUpdate: (trip: Trip) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  galleryItems: GalleryImage[];
  onGalleryAdd: (item: GalleryImage) => Promise<void>;
  onGalleryUpdate: (item: GalleryImage) => Promise<void>;
  onGalleryDelete: (id: string) => Promise<void>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  trips, onAdd, onUpdate, onDelete,
  galleryItems, onGalleryAdd, onGalleryUpdate, onGalleryDelete 
}) => {
  const [activeTab, setActiveTab] = useState<'trips' | 'gallery'>('trips');
  const [isSaving, setIsSaving] = useState(false);
  
  // Trip State
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);

  // Gallery State
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);

  // Fix: Removed 'addons' property which was not in Trip interface.
  const initialTripForm: Partial<Trip> = {
    title: '', description: '', destination: '', country: '', basePrice: 0,
    activity: ActivityType.TREKKING, difficulty: Difficulty.MODERATE, duration: '7 Days',
    mainImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
    featured: true, itinerary: [], tags: [], galleryImages: []
  };

  const initialGalleryForm: Partial<GalleryImage> = { url: '', type: 'image', location: '', activity: ActivityType.TREKKING };

  const [tripFormData, setTripFormData] = useState<Partial<Trip>>(initialTripForm);
  const [galleryFormData, setGalleryFormData] = useState<Partial<GalleryImage>>(initialGalleryForm);

  const handleSaveTrip = async () => {
    setIsSaving(true);
    try {
      if (editingTripId) await onUpdate({ ...tripFormData, id: editingTripId } as Trip);
      else await onAdd({ ...tripFormData, id: Math.random().toString(36).substr(2, 9) } as Trip);
      setIsAddingTrip(false);
      setEditingTripId(null);
      setTripFormData(initialTripForm);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveGallery = async () => {
    setIsSaving(true);
    try {
      if (editingGalleryId) await onGalleryUpdate({ ...galleryFormData, id: editingGalleryId } as GalleryImage);
      else await onGalleryAdd({ ...galleryFormData, id: Math.random().toString(36).substr(2, 9) } as GalleryImage);
      setIsAddingGallery(false);
      setEditingGalleryId(null);
      setGalleryFormData(initialGalleryForm);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const addItineraryDay = () => {
    const nextDay = (tripFormData.itinerary?.length || 0) + 1;
    setTripFormData({
      ...tripFormData,
      itinerary: [...(tripFormData.itinerary || []), { day: nextDay, title: '', description: '' }]
    });
  };

  const updateItineraryDay = (idx: number, field: keyof ItineraryItem, value: any) => {
    const updated = [...(tripFormData.itinerary || [])];
    updated[idx] = { ...updated[idx], [field]: value };
    setTripFormData({ ...tripFormData, itinerary: updated });
  };

  const removeItineraryDay = (idx: number) => {
    const updated = (tripFormData.itinerary || []).filter((_, i) => i !== idx).map((item, i) => ({ ...item, day: i + 1 }));
    setTripFormData({ ...tripFormData, itinerary: updated });
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-72 border-r border-slate-200 bg-white flex flex-col p-10">
        <h2 className="text-xl font-serif text-slate-900 mb-16 tracking-widest uppercase"><span className="text-teal-600">V</span>AHA VOYAGES</h2>
        <nav className="space-y-4">
          <button onClick={() => setActiveTab('trips')} className={`flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] w-full p-4 rounded-2xl transition-all ${activeTab === 'trips' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400'}`}>Expeditions</button>
          <button onClick={() => setActiveTab('gallery')} className={`flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] w-full p-4 rounded-2xl transition-all ${activeTab === 'gallery' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400'}`}>Gallery Assets</button>
          <Link to="/portal-access-vaha/leads" className="flex items-center gap-4 text-slate-400 p-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em]">Lead Desk</Link>
        </nav>
      </aside>

      <main className="flex-grow overflow-y-auto p-16">
        <div className="flex justify-between items-center mb-16">
          <h1 className="text-5xl font-serif text-slate-900">{activeTab === 'trips' ? 'Inventory Portal' : 'Visual Assets'}</h1>
          <button 
            onClick={() => activeTab === 'trips' ? setIsAddingTrip(true) : setIsAddingGallery(true)}
            className="bg-teal-600 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-xl"
          >
            + Add New
          </button>
        </div>

        {activeTab === 'trips' ? (
          <div className="grid grid-cols-1 gap-6">
            {trips.map(trip => (
              <div key={trip.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-xl hover:shadow-teal-900/5 transition-all">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100">
                    <img src={trip.mainImage} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-slate-900">{trip.title}</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{trip.destination}, {trip.country} • ₹{trip.basePrice.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <button onClick={() => { setEditingTripId(trip.id); setTripFormData(trip); setIsAddingTrip(true); }} className="text-[10px] text-teal-600 font-black uppercase tracking-widest px-6 py-3 bg-teal-50 rounded-full">Edit</button>
                  <button onClick={() => onDelete(trip.id)} className="text-[10px] text-red-400 font-black uppercase tracking-widest px-6 py-3 bg-red-50 rounded-full">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-10">
            {galleryItems.map(item => (
              <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden group relative aspect-[4/5]">
                <img src={item.url} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button onClick={() => { setEditingGalleryId(item.id); setGalleryFormData(item); setIsAddingGallery(true); }} className="p-3 bg-white text-teal-600 rounded-full shadow-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => onGalleryDelete(item.id)} className="p-3 bg-white text-red-500 rounded-full shadow-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isAddingTrip && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-8">
            <div className="bg-white rounded-[3.5rem] w-full max-w-4xl p-12 overflow-y-auto max-h-[90vh] shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-serif">{editingTripId ? 'Refine' : 'New'} Expedition</h2>
                <button onClick={() => { setIsAddingTrip(false); setEditingTripId(null); setTripFormData(initialTripForm); }} className="text-slate-400 hover:text-slate-900 transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 block px-4">Trip Basics</label>
                  <input type="text" placeholder="Title" className="w-full bg-slate-50 border border-transparent focus:border-teal-500/20 rounded-2xl p-5 font-bold" value={tripFormData.title} onChange={e => setTripFormData({...tripFormData, title: e.target.value})} />
                  <textarea placeholder="Full Description" rows={4} className="w-full bg-slate-50 border border-transparent focus:border-teal-500/20 rounded-2xl p-5 font-medium resize-none" value={tripFormData.description} onChange={e => setTripFormData({...tripFormData, description: e.target.value})} />
                  <input type="text" placeholder="Main Image URL" className="w-full bg-slate-50 border border-transparent focus:border-teal-500/20 rounded-2xl p-5 font-bold" value={tripFormData.mainImage} onChange={e => setTripFormData({...tripFormData, mainImage: e.target.value})} />
                </div>
                
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 block px-4">Logistics</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Destination" className="bg-slate-50 rounded-2xl p-5 font-bold" value={tripFormData.destination} onChange={e => setTripFormData({...tripFormData, destination: e.target.value})} />
                    <input type="text" placeholder="Country" className="bg-slate-50 rounded-2xl p-5 font-bold" value={tripFormData.country} onChange={e => setTripFormData({...tripFormData, country: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Base Price (₹)" className="bg-slate-50 rounded-2xl p-5 font-bold" value={tripFormData.basePrice} onChange={e => setTripFormData({...tripFormData, basePrice: parseInt(e.target.value) || 0})} />
                    <input type="text" placeholder="Duration (e.g. 7 Days)" className="bg-slate-50 rounded-2xl p-5 font-bold" value={tripFormData.duration} onChange={e => setTripFormData({...tripFormData, duration: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <select className="bg-slate-50 rounded-2xl p-5 font-bold" value={tripFormData.difficulty} onChange={e => setTripFormData({...tripFormData, difficulty: e.target.value as Difficulty})}>
                      {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select className="bg-slate-50 rounded-2xl p-5 font-bold" value={tripFormData.activity} onChange={e => setTripFormData({...tripFormData, activity: e.target.value as ActivityType})}>
                      {Object.values(ActivityType).map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 px-4">Itinerary Manifest</label>
                  <button onClick={addItineraryDay} className="text-[10px] font-black uppercase text-teal-600 border-b-2 border-teal-600 pb-1">Add Day</button>
                </div>
                <div className="space-y-4">
                  {(tripFormData.itinerary || []).map((day, idx) => (
                    <div key={idx} className="bg-slate-50 p-6 rounded-[2rem] flex gap-6 items-start">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-slate-400 shrink-0">{day.day}</div>
                      <div className="flex-grow space-y-4">
                        <input type="text" placeholder="Day Title" className="w-full bg-white rounded-xl p-3 font-bold" value={day.title} onChange={e => updateItineraryDay(idx, 'title', e.target.value)} />
                        <textarea placeholder="Day Narrative" rows={2} className="w-full bg-white rounded-xl p-3 text-sm font-medium resize-none" value={day.description} onChange={e => updateItineraryDay(idx, 'description', e.target.value)} />
                      </div>
                      <button onClick={() => removeItineraryDay(idx)} className="text-red-300 hover:text-red-500 mt-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-6 pt-10 border-t border-slate-50">
                <button onClick={() => { setIsAddingTrip(false); setEditingTripId(null); setTripFormData(initialTripForm); }} className="text-slate-400 text-xs font-black uppercase tracking-widest">Discard</button>
                <button disabled={isSaving} onClick={handleSaveTrip} className="bg-teal-600 text-white px-16 py-5 rounded-full font-black uppercase text-xs shadow-xl disabled:opacity-50 hover:bg-slate-900 transition-all">
                  {isSaving ? 'Synchronizing...' : 'Commit Expedition'}
                </button>
              </div>
            </div>
          </div>
        )}

        {isAddingGallery && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-8">
            <div className="bg-white rounded-[3.5rem] w-full max-w-2xl p-12 overflow-y-auto max-h-[90vh] shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-serif">{editingGalleryId ? 'Refine' : 'New'} Asset</h2>
                <button onClick={() => { setIsAddingGallery(false); setEditingGalleryId(null); setGalleryFormData(initialGalleryForm); }} className="text-slate-400 hover:text-slate-900 transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-6 mb-10">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 block px-4">Asset URL</label>
                  <input type="text" placeholder="https://..." className="w-full bg-slate-50 border border-transparent focus:border-teal-500/20 rounded-2xl p-5 font-bold" value={galleryFormData.url} onChange={e => setGalleryFormData({...galleryFormData, url: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 block px-4">Type</label>
                    <select className="w-full bg-slate-50 rounded-2xl p-5 font-bold" value={galleryFormData.type} onChange={e => setGalleryFormData({...galleryFormData, type: e.target.value as 'image' | 'video'})}>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 block px-4">Activity</label>
                    <select className="w-full bg-slate-50 rounded-2xl p-5 font-bold" value={galleryFormData.activity} onChange={e => setGalleryFormData({...galleryFormData, activity: e.target.value as ActivityType})}>
                      {Object.values(ActivityType).map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 block px-4">Location</label>
                  <input type="text" placeholder="Location Name" className="w-full bg-slate-50 border border-transparent focus:border-teal-500/20 rounded-2xl p-5 font-bold" value={galleryFormData.location} onChange={e => setGalleryFormData({...galleryFormData, location: e.target.value})} />
                </div>
              </div>

              <div className="flex justify-end gap-6 pt-10 border-t border-slate-50">
                <button onClick={() => { setIsAddingGallery(false); setEditingGalleryId(null); setGalleryFormData(initialGalleryForm); }} className="text-slate-400 text-xs font-black uppercase tracking-widest">Discard</button>
                <button disabled={isSaving} onClick={handleSaveGallery} className="bg-teal-600 text-white px-16 py-5 rounded-full font-black uppercase text-xs shadow-xl disabled:opacity-50 hover:bg-slate-900 transition-all">
                  {isSaving ? 'Synchronizing...' : 'Commit Asset'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
