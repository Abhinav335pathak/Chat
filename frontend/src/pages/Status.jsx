import React, { useState, useEffect } from 'react';
import { uploadStatus, getStatusFeed, getUserStatuses, markStatusViewed, deleteStatus } from '../services/api.js';
import { Plus, X, ChevronLeft, ChevronRight, Send, Camera, Trash2 } from 'lucide-react';
import  Sidebar from "../components/layout/Sidebar.jsx";
export const Status = ({isMobile}) => {
  const [groupedFeed, setGroupedFeed] = useState([]);
  const [myStatuses, setMyStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Viewer State
  const [activeQueue, setActiveQueue] = useState(null); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Upload State
  const [uploadFile, setUploadFile] = useState(null);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [feedRes, myRes] = await Promise.all([getStatusFeed(), getUserStatuses()]);
      
      // Group flat backend array by User ID for the "Story" bubbles
      const grouped = feedRes.data.statuses.reduce((acc, status) => {
        const userId = status.user._id;
        if (!acc[userId]) {
          acc[userId] = {
            username: status.user.username,
            avatar: status.user.avatar,
            statuses: []
          };
        }
        acc[userId].statuses.push(status);
        return acc;
      }, {});

      setGroupedFeed(Object.values(grouped));
      setMyStatuses(myRes.data.statuses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('media', uploadFile);
    formData.append('caption', caption);
    try {
      await uploadStatus(formData);
      setUploadFile(null);
      setCaption("");
      fetchData();
    } catch (err) {
      alert("Upload failed");
    }
  };

  const openStatus = (statusList) => {
    setActiveQueue(statusList);
    setCurrentIndex(0);
    setProgress(0);
    markAsViewed(statusList[0]._id);
  };

  const markAsViewed = async (id) => {
    try { await markStatusViewed(id); } catch (e) {}
  };

  useEffect(() => {
    let interval;
    if (activeQueue) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (currentIndex < activeQueue.length - 1) {
              const nextIdx = currentIndex + 1;
              setCurrentIndex(nextIdx);
              markAsViewed(activeQueue[nextIdx]._id);
              return 0;
            } else {
              setActiveQueue(null);
              return 0;
            }
          }
          return prev + 1;
        });
      }, 50); 
    }
    return () => clearInterval(interval);
  }, [activeQueue, currentIndex]);

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-hidden">
      {!isMobile && <Sidebar />}
      {/* SIDEBAR */}
      <aside className="w-full md:w-96 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-zinc-900">
        <div className="p-4 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50">
          <h1 className="text-xl font-bold">Status</h1>
          <label className="p-2 bg-green-500 rounded-full cursor-pointer hover:scale-105 transition-transform shadow-lg">
            <Plus className="text-white" size={20} />
            <input type="file" hidden onChange={(e) => setUploadFile(e.target.files[0])} accept="image/*,video/*" />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* My Status Bubble */}
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
            <div 
              onClick={() => myStatuses.length > 0 && openStatus(myStatuses)}
              className="flex items-center gap-4 cursor-pointer group"
            >
              <div className={`relative w-14 h-14 rounded-full border-2 p-0.5 ${myStatuses.length > 0 ? 'border-green-500' : 'border-zinc-300'}`}>
                <div className="w-full h-full rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                  <Camera className="w-full h-full p-3 text-zinc-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">My Status</h3>
                <p className="text-xs text-zinc-500">{myStatuses.length > 0 ? 'Tap to view your updates' : 'Add an update'}</p>
              </div>
            </div>
          </div>

          {/* Recent Updates Bubble List */}
          <div className="">
            <p className="text-xs font-bold text-zinc-400 uppercase px-3 py-4">Recent Updates</p>
            {groupedFeed.map((user) => (
              <div 
                key={user.username}
                onClick={() => openStatus(user.statuses)}
                className="flex items-center gap-4 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl cursor-pointer transition-colors"
              >
                <div className="w-14 h-14 rounded-full border-2 border-green-500 p-0.5">
                  <img src={user.avatar || 'https://via.placeholder.com/150'} className="w-full h-full rounded-full object-cover" alt="" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{user.username}</h3>
                  <p className="text-xs text-zinc-500">{user.statuses.length} updates</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* STATUS VIEWER PLAYER */}
      {activeQueue && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {/* Progress Indicator Bar */}
          <div className="absolute top-4 left-0 right-0 flex gap-1.5 px-4 z-30">
            {activeQueue.map((_, i) => (
              <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-75" 
                  style={{ width: i === currentIndex ? `${progress}%` : i < currentIndex ? '100%' : '0%' }}
                />
              </div>
            ))}
          </div>

          <div className="absolute top-8 left-4 right-4 flex justify-between items-center z-30 text-white">
            <div className="flex items-center gap-3">
              <img src={activeQueue[currentIndex].user.avatar} className="w-10 h-10 rounded-full object-cover border border-white/20" alt="" />
              <span className="font-bold shadow-sm">{activeQueue[currentIndex].user.username}</span>
            </div>
            <button onClick={() => setActiveQueue(null)}><X size={28} /></button>
          </div>
          
          <div className="relative h-full w-full max-w-lg flex items-center justify-center bg-zinc-900">
            {activeQueue[currentIndex].type === 'image' ? (
              <img src={activeQueue[currentIndex].mediaUrl} className="max-h-full w-full object-contain" alt="" />
            ) : (
              <video src={activeQueue[currentIndex].mediaUrl} autoPlay className="max-h-full w-full object-contain" />
            )}
            
            {activeQueue[currentIndex].caption && (
              <div className="absolute bottom-12 left-0 right-0 p-6 text-center bg-gradient-to-t from-black/80 to-transparent text-white text-lg">
                {activeQueue[currentIndex].caption}
              </div>
            )}
          </div>

          {/* Touch Zones for Navigation */}
          <div className="absolute inset-0 flex z-20">
            <div className="w-1/3 h-full cursor-pointer" onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)} />
            <div className="w-2/3 h-full cursor-pointer" onClick={() => currentIndex < activeQueue.length - 1 ? setCurrentIndex(currentIndex + 1) : setActiveQueue(null)} />
          </div>
        </div>
      )}

      {/* UPLOAD PREVIEW OVERLAY */}
      {uploadFile && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md h-[80vh] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            {uploadFile.type.startsWith('image') ? (
              <img src={URL.createObjectURL(uploadFile)} className="w-full h-full object-cover" />
            ) : (
              <video src={URL.createObjectURL(uploadFile)} className="w-full h-full object-cover" />
            )}
            
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-md flex gap-3">
              <input 
                type="text" 
                placeholder="Add a caption..." 
                className="flex-1 bg-white/10 text-white p-3 rounded-2xl outline-none border border-white/10 focus:border-green-500 transition-colors"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <button 
                onClick={handleUpload} 
                className="bg-green-500 p-4 rounded-2xl text-white hover:bg-green-600 transition-colors shadow-lg"
              >
                <Send size={24}/>
              </button>
            </div>
          </div>
          <button onClick={() => setUploadFile(null)} className="mt-6 text-zinc-400 hover:text-white font-medium">Cancel</button>
        </div>
      )}
    </div>
  );
};
export default Status;