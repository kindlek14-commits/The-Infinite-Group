import React, { useState, useRef } from 'react';
import { Photo, Tenant } from '../types';

interface Props {
  tenant: Tenant;
  photos: Photo[];
  onUpload: (newPhotos: Photo[]) => void;
  onDelete: (photoId: string) => void;
  onClose: () => void;
}

const DamageGallery: React.FC<Props> = ({ tenant, photos, onUpload, onDelete, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_PHOTOS = 50;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = MAX_PHOTOS - photos.length;
    // Fix: Explicitly cast to File[] to ensure 'file' is recognized as a Blob for URL.createObjectURL
    const filesToProcess = Array.from(files).slice(0, remainingSlots) as File[];

    if (files.length > remainingSlots) {
      alert(`You can only upload up to ${MAX_PHOTOS} photos. Adding the first ${remainingSlots} selected.`);
    }

    const newPhotos: Photo[] = filesToProcess.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      timestamp: new Date().toLocaleString(),
    }));

    onUpload(newPhotos);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="bg-[#111] border border-[#D4AF37]/30 w-full max-w-5xl h-[85vh] rounded-xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1B3022]/20">
          <div>
            <h3 className="text-2xl font-serif text-[#D4AF37]">Damage Documentation</h3>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
              Tenant: {tenant.name} • Unit: {tenant.unit}
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Capacity</p>
              <p className={`text-sm font-bold ${photos.length >= MAX_PHOTOS ? 'text-red-500' : 'text-white'}`}>
                {photos.length} / {MAX_PHOTOS} Photos
              </p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex-grow p-8 overflow-y-auto custom-scrollbar">
          {photos.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl">
              <svg className="w-16 h-16 text-white/10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 italic">No damage photos uploaded yet.</p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 text-[#D4AF37] font-bold hover:underline uppercase text-xs tracking-widest"
              >
                Upload First Batch
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative aspect-square bg-black rounded-lg overflow-hidden border border-white/10 hover:border-[#D4AF37]/50 transition-all shadow-lg">
                  <img src={photo.url} alt="Damage" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                    <p className="text-[8px] text-gray-300 font-mono">{photo.timestamp}</p>
                    <button 
                      onClick={() => onDelete(photo.id)}
                      className="mt-2 w-full py-1 bg-red-500/80 hover:bg-red-600 text-white text-[10px] font-bold rounded uppercase transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              
              {photos.length < MAX_PHOTOS && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-[#D4AF37]/20 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 rounded-lg transition-all"
                >
                  <svg className="w-8 h-8 text-[#D4AF37]/50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-tighter">Add More</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-black flex justify-between items-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            multiple 
            accept="image/*" 
            className="hidden" 
          />
          <p className="text-xs text-gray-500 max-w-sm">
            All photos are timestamped and stored in the tenant's secure damage log. These can be exported for security deposit reconciliation.
          </p>
          <div className="flex space-x-4">
            <button 
              disabled={photos.length >= MAX_PHOTOS}
              onClick={() => fileInputRef.current?.click()}
              className={`px-8 py-3 rounded text-xs font-bold uppercase tracking-widest transition-all ${
                photos.length >= MAX_PHOTOS 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-[#D4AF37] text-black hover:bg-[#B89630]'
              }`}
            >
              Upload Photos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DamageGallery;