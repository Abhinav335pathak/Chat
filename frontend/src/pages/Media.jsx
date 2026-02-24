import React, { useEffect, useState } from 'react';
import { getMedia, deleteMedia } from '../services/api.js';
import { X, ChevronLeft, ChevronRight, Trash2, Download, CheckCircle, Circle } from 'lucide-react';
import Sidebar from "../components/layout/Sidebar.jsx";
import { useTheme } from "../context/themeContext.jsx";
import { useNavigate } from 'react-router-dom';
export const Media = ({ isMobile }) => {
  const { theme } = useTheme();
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewIndex, setViewIndex] = useState(null);
  const navigate = useNavigate();

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
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0b141a] text-white' : 'bg-gray-100 text-black'}`}>
      {/* Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <div className={`sticky top-0 z-40 border-b ${theme === 'dark' ? 'bg-[#1d1f1f] border-gray-800' : 'bg-white border-gray-200'} p-6 flex justify-between items-center shadow-sm`}>
           { isMobile && <button
          onClick={() => navigate("/")}
          className="text-blue-600 font-medium"
        >
          ← Back
        </button>}
        
          <h1 className="text-2xl font-bold">Library ({medias.length})</h1>
          
          <div className="flex gap-3">
            {selectedIds.length > 0 && (
              <button 
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all font-medium"
              >
                <Trash2 size={18} /> Delete {selectedIds.length}
              </button>
            )}
            {selectedIds.length > 0 && (
              <button 
                onClick={() => setSelectedIds([])}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Deselect All
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin mb-4">
                  <div className={`w-12 h-12 border-4 rounded-full ${theme === 'dark' ? 'border-gray-700 border-t-green-500' : 'border-gray-300 border-t-green-500'}`}></div>
                </div>
                <p className="text-gray-500">Loading media...</p>
              </div>
            </div>
          ) : medias.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className={`text-6xl mb-4 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`}>📸</div>
              <p className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No media found</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Start sharing photos and videos</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {medias.map((media, index) => {
                const isSelected = selectedIds.includes(media._id);
                return (
                  <div 
                    key={media._id}
                    className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all 
                      ${isSelected 
                        ? `border-green-500 scale-95 ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-100'}` 
                        : `border-transparent ${theme === 'dark' ? 'bg-[#202c33] shadow-lg' : 'bg-white shadow-md'}`}`}
                    onClick={() => setViewIndex(index)}
                  >
                    {/* Checkbox */}
                    <button 
                      onClick={(e) => toggleSelect(media._id, e)}
                      className={`absolute top-3 left-3 z-10 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    >
                      {isSelected 
                        ? <CheckCircle className="text-green-500" size={24} /> 
                        : <Circle className={theme === 'dark' ? 'text-gray-400' : 'text-gray-300'} size={24} />}
                    </button>

                    {/* Media */}
                    {media.type === "image" ? (
                      <img src={media.url} className="w-full h-full object-cover" alt="media" />
                    ) : (
                      <div className="w-full h-full relative bg-black">
                        <video src={media.url} className="w-full h-full object-cover" />
                        <div className={`absolute inset-0 flex items-center justify-center ${theme === 'dark' ? 'bg-black/30' : 'bg-black/20'}`}>
                          <div className="text-white text-3xl">▶</div>
                        </div>
                      </div>
                    )}

                    {/* Overlay */}
                    <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/40' : 'bg-black/30'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); downloadFile(media.url, `media-${index}`); }}
                        className="p-3 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md text-white transition-colors"
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Viewer */}
      {viewIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-xl p-4">
          {/* Close Button */}
          <button 
            onClick={() => setViewIndex(null)} 
            className="absolute top-6 right-6 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <X size={32}/>
          </button>
          
          {/* Previous Button */}
          <button 
            onClick={() => setViewIndex((prev) => (prev - 1 + medias.length) % medias.length)} 
            className="absolute left-6 p-4 text-white hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <ChevronLeft size={48}/>
          </button>
          
          {/* Media Container */}
          <div className="max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-6">
            {medias[viewIndex].type === "image" ? (
              <img 
                src={medias[viewIndex].url} 
                className="max-h-[80vh] object-contain rounded-lg shadow-2xl" 
                alt="media" 
              />
            ) : (
              <video 
                src={medias[viewIndex].url} 
                controls 
                autoPlay 
                className="max-h-[80vh] rounded-lg" 
              />
            )}
            
            {/* Info */}
            <div className="flex gap-6 text-gray-400 items-center">
              <span className="bg-gray-800 px-3 py-1 rounded text-sm uppercase text-gray-200 font-medium">
                {medias[viewIndex].type}
              </span>
              <span className="text-sm">{viewIndex + 1} / {medias.length}</span>
              <button
                onClick={(e) => { e.stopPropagation(); downloadFile(medias[viewIndex].url, `media-${viewIndex}`); }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
              >
                <Download size={20} />
              </button>
            </div>
          </div>

          {/* Next Button */}
          <button 
            onClick={() => setViewIndex((prev) => (prev + 1) % medias.length)} 
            className="absolute right-6 p-4 text-white hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <ChevronRight size={48}/>
          </button>
        </div>
      )}
    </div>
  );
};

export default Media;