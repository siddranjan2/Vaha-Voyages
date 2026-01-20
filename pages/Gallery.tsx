
import React, { useState } from 'react';
import { GalleryImage } from '../types';

interface GalleryProps {
  images: GalleryImage[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [selectedAsset, setSelectedAsset] = useState<GalleryImage | null>(null);

  return (
    <div className="bg-white min-h-screen pt-40 pb-32 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <span className="text-sky-500 uppercase tracking-[0.4em] text-xs font-black mb-4 block">Lens into the Wild</span>
          <h1 className="text-6xl md:text-8xl font-serif mb-6 text-slate-900">Visual <span className="italic">Chronicles</span></h1>
          <p className="text-slate-400 font-medium text-lg max-w-xl mx-auto">
            A curated collection of moments captured across the most inspiring landscapes in Asia.
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10">
          {images.map((img) => (
            <div 
              key={img.id} 
              className="relative group cursor-zoom-in break-inside-avoid overflow-hidden rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-teal-900/10 transition-all duration-500"
              onClick={() => setSelectedAsset(img)}
            >
              {img.type === 'video' ? (
                <div className="relative">
                  <video 
                    src={img.url} 
                    className="w-full rounded-[3rem]"
                    muted
                    loop
                    onMouseOver={(e) => e.currentTarget.play()}
                    onMouseOut={(e) => e.currentTarget.pause()}
                  />
                  <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg">
                    <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
                  </div>
                </div>
              ) : (
                <img 
                  src={img.url} 
                  alt={img.activity} 
                  referrerPolicy="no-referrer"
                  className="w-full transition-all duration-[1.5s] ease-out transform group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <div className="text-center bg-white/90 backdrop-blur-md p-10 rounded-[2.5rem] shadow-2xl shadow-teal-900/20 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <p className="text-teal-600 text-[10px] uppercase tracking-[0.3em] font-black mb-2">{img.location}</p>
                  <p className="text-slate-900 font-serif text-3xl">{img.activity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedAsset && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-2xl flex items-center justify-center p-8 animate-fade-in">
          <button 
            className="absolute top-12 right-12 text-slate-400 hover:text-teal-600 transition-colors"
            onClick={() => setSelectedAsset(null)}
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <div className="relative max-w-6xl w-full flex flex-col items-center">
            {selectedAsset.type === 'video' ? (
              <video 
                src={selectedAsset.url} 
                controls 
                autoPlay 
                className="w-full h-auto max-h-[75vh] object-contain rounded-[3rem] shadow-2xl" 
              />
            ) : (
              <img src={selectedAsset.url} referrerPolicy="no-referrer" className="w-full h-auto max-h-[75vh] object-contain rounded-[3rem] shadow-2xl" alt="Selected" />
            )}
            <div className="mt-12">
              <button 
                className="bg-teal-600 text-white px-16 py-6 rounded-full font-black uppercase tracking-[0.3em] text-xs shadow-xl shadow-teal-600/30 hover:bg-slate-900 hover:scale-105 transition-all active:scale-95"
                onClick={() => { setSelectedAsset(null); window.location.hash = '#/destinations'; }}
              >
                Inquire Journey
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
