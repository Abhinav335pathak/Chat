

import { useState, useRef } from "react";
import { Paperclip, SendHorizontal, X, Plus, FileIcon, Image as ImageIcon } from "lucide-react";

const InputField = ({ text, setText, sendMessage }) => {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith("image") ? "image" : 
                 file.type.startsWith("video") ? "video" : "raw";
    setPreview({ file, url, type });
  };

  const handleProcessSend = async () => {
    if (!text.trim() && !preview) return;

    setUploading(true);
    try {
      await sendMessage(text, preview?.file || null);
      setPreview(null);
      setText(""); // Clear text after sending
      if (fileRef.current) fileRef.current.value = ""; 
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleProcessSend();
    }
  };

  return (
    <>
      {/* ATTACHMENT PREVIEW MODAL */}
      {preview && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-10">
          <div className="bg-white dark:bg-[#1d1f1f] w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all scale-100">
            
            {/* Modal Header */}
            <div className="p-4 border-b dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-[#1d1f1f]">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <ImageIcon size={18} />
                <span className="font-semibold text-sm">Preview Attachment</span>
              </div>
              <button 
                onClick={() => setPreview(null)} 
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition dark:text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* Media Display */}
            <div className="flex-1 flex items-center justify-center bg-zinc-100 dark:bg-[#161717] overflow-hidden min-h-[300px]">
              {preview.type === "image" && (
                <img src={preview.url} className="max-h-full max-w-full object-contain p-2" alt="preview" />
              )}
              {preview.type === "video" && (
                <video src={preview.url} controls className="max-h-full max-w-full p-2" />
              )}
              {preview.type === "raw" && (
                <div className="flex flex-col items-center gap-4 text-gray-500 dark:text-gray-400">
                  <FileIcon size={64} className="opacity-50" />
                  <p className="font-medium px-4 text-center truncate max-w-xs">{preview.file.name}</p>
                </div>
              )}
            </div>

            {/* Caption Input */}
            <div className="p-4 bg-white dark:bg-[#1d1f1f] border-t dark:border-zinc-800">
               <input 
                 className="w-full p-3 bg-gray-100 dark:bg-[#2d2e2e] border-none rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition" 
                 placeholder="Add a caption..."
                 autoFocus
                 value={text}
                 onChange={(e) => setText(e.target.value)}
                 onKeyDown={handleKeyDown} 
               />
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t dark:border-zinc-800 flex justify-end gap-3 bg-gray-50 dark:bg-[#1d1f1f]">
              <button 
                onClick={() => setPreview(null)} 
                className="px-5 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleProcessSend} 
                disabled={uploading}
                className="px-8 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2"
              >
                {uploading ? "Sending..." : <>Send <SendHorizontal size={18} /></>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN INPUT BAR */}
      <div className="w-full px-4 py-4 bg-white dark:bg-[#1d1f1f] border-t dark:border-zinc-800 transition-colors">
        <div className="max-w-5xl mx-auto flex items-end gap-3">
          
          {/* Attach Button */}
          <button 
            onClick={() => fileRef.current.click()} 
            className="flex-shrink-0 w-11 h-11 bg-gray-100 dark:bg-[#2d2e2e] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl flex items-center justify-center transition"
            title="Attach File"
          >
            <Plus size={24} />
          </button>
          <input ref={fileRef} type="file" hidden onChange={handleFileSelect} />

          {/* Text Area / Input */}
          <div className="flex-1 relative flex items-center bg-gray-100 dark:bg-[#2d2e2e] rounded-2xl px-4 py-1 transition-all border border-transparent focus-within:border-blue-500/50 focus-within:bg-white dark:focus-within:bg-[#161717]">
            <input
              className="w-full bg-transparent py-2.5 outline-none text-sm dark:text-white placeholder-gray-500"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleProcessSend}
            disabled={!text.trim() && !preview}
            className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                (text.trim() || preview) 
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 active:scale-90" 
                : "bg-gray-100 dark:bg-[#2d2e2e] text-gray-400 cursor-not-allowed"
            }`}
          >
            <SendHorizontal size={22} className={text.trim() || preview ? "translate-x-0.5" : ""} />
          </button>
        </div>
      </div>
    </>
  );
};

export default InputField;