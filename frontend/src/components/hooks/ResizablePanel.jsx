import { useState } from "react";

const ResizablePanel = ({ children, isMobile, activeConversation }) => {
  const [width, setWidth] = useState(500); // px

  // 👉 Mobile: just render normally, no resizing, no hiding
  if (isMobile) {
    return <div className="w-full h-full">{children}</div>;
  }

  const startResize = (e) => {
    const startX = e.clientX;
    const startWidth = width;

    const onMove = (ev) => {
      const newWidth = startWidth + (ev.clientX - startX);
      setWidth(Math.min(Math.max(newWidth, 428), 700));
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <div
      style={{ width: activeConversation ? width : "33%" }}
      className="relative border-r border-gray-300 flex-shrink-0 h-full"
    >
      {children}

      {/* Drag Handle (desktop only, only when chat open) */}
      {activeConversation && (
        <div
          onMouseDown={startResize}
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-400/40"
        />
      )}
    </div>
  );
};

export default ResizablePanel;
