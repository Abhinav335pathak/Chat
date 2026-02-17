import { useState ,useRef } from "react";
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
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/70 flex justify-center pt-20">
          <div className="bg-white w-full max-w-3xl h-[80vh] rounded-xl shadow-xl flex flex-col overflow-hidden">
            <div className="p-3 border-b flex justify-between items-center">
              <span className="text-sm font-semibold">Preview Attachment</span>
              <button onClick={() => setPreview(null)}>✕</button>
            </div>

            <div className="flex-1 flex items-center justify-center bg-black overflow-hidden">
              {preview.type === "image" && <img src={preview.url} className="max-h-full" alt="preview" />}
              {preview.type === "video" && <video src={preview.url} controls className="max-h-full" />}
              {preview.type === "raw" && <div className="text-white">📎 {preview.file.name}</div>}
            </div>

            <div className="p-3 bg-gray-50 border-t">
               <input 
                 className="w-full p-2 border rounded-md" 
                 placeholder="Add a caption..."
                 value={text}
                 onChange={(e) => setText(e.target.value)}
                 onKeyDown={handleKeyDown} 
               />
            </div>

            <div className="p-3 border-t flex justify-end gap-3">
              <button onClick={() => setPreview(null)} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
              <button 
                onClick={handleProcessSend} 
                disabled={uploading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                {uploading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      
      <div className="w-full px-4 h-24 py-3 border-t bg-white flex items-center gap-3">
        <button onClick={() => fileRef.current.click()} className="w-10 h-10 bg-gray-100 rounded-full">➕</button>
        <input ref={fileRef} type="file" hidden onChange={handleFileSelect} />

        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 h-12">
          <input
            className="flex-1 bg-transparent outline-none text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={handleKeyDown}
          />
        </div>

        <button
          onClick={handleProcessSend}
          className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center"
        >
          ➤
        </button>
      </div>
    </>
  );
};
export default InputField;
