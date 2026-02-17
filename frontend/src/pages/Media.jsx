import React, { useEffect, useState } from 'react';
import { getMedia, deleteMedia } from '../services/api';
import { X, ChevronLeft, ChevronRight, Trash2, Download, CheckCircle, Circle, Sun, Moon } from 'lucide-react';

export const Media = () => {
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewIndex, setViewIndex] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const response = await getMedia();
      setMedias(response.data.media);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} items?`)) return;
    try {
      await deleteMedia(selectedIds.join(','));
      setMedias(prev => prev.filter(m => !selectedIds.includes(m._id)));
      setSelectedIds([]);
    } catch (error) {
      alert("Failed to delete items");
    }
  };

  const downloadFile = (url, filename) => {
    fetch(url).then(res => res.blob()).then(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename || 'download';
      a.click();
    });
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white p-6">
      
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 sticky top-4 z-10 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Library ({medias.length})</h1>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all"
            >
              <Trash2 size={18} /> Delete {selectedIds.length}
            </button>
          )}
          <button 
            onClick={() => setSelectedIds([])}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {medias.map((media, index) => {
          const isSelected = selectedIds.includes(media._id);
          return (
            <div 
              key={media._id}
              className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all 
                ${isSelected ? 'border-indigo-500 scale-95' : 'border-transparent bg-white dark:bg-zinc-900 shadow-sm dark:shadow-none'}`}
              onClick={() => setViewIndex(index)}
            >
              <button 
                onClick={(e) => toggleSelect(media._id, e)}
                className={`absolute top-3 left-3 z-10 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              >
                {isSelected ? <CheckCircle className="text-indigo-500 fill-indigo-500/20" /> : <Circle className="text-zinc-400 dark:text-white/50" />}
              </button>

              {media.type === "image" ? (
                <img src={media.url} className="w-full h-full object-cover" alt="" />
              ) : (
                <video src={media.url} className="w-full h-full object-cover" />
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); downloadFile(media.url, `file-${index}`); }}
                  className="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md text-white"
                >
                  <Download size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {viewIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-xl">
          <button onClick={() => setViewIndex(null)} className="absolute top-6 right-6 p-2 text-white hover:bg-white/10 rounded-full"><X size={32}/></button>
          
          <button onClick={() => setViewIndex((prev) => (prev - 1 + medias.length) % medias.length)} className="absolute left-6 p-4 text-white hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft size={48}/>
          </button>
          
          <div className="max-w-[90vw] max-h-[85vh] flex flex-col items-center">
            {medias[viewIndex].type === "image" ? (
              <img src={medias[viewIndex].url} className="max-h-[80vh] object-contain rounded-lg shadow-2xl" alt="" />
            ) : (
              <video src={medias[viewIndex].url} controls autoPlay className="max-h-[80vh] rounded-lg" />
            )}
            <div className="mt-6 flex gap-6 text-zinc-400">
              <span className="bg-zinc-800 px-3 py-1 rounded text-sm uppercase text-zinc-200">{medias[viewIndex].type}</span>
              <span>{viewIndex + 1} / {medias.length}</span>
            </div>
          </div>

          <button onClick={() => setViewIndex((prev) => (prev + 1) % medias.length)} className="absolute right-6 p-4 text-white hover:bg-white/10 rounded-full transition-colors">
            <ChevronRight size={48}/>
          </button>
        </div>
      )}
    </div>
  );
};

export default Media;