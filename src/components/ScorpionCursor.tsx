import { useEffect, useState } from "react";

const ScorpionCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName === "A" ||
        target.tagName === "BUTTON"
      );
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer cursor */}
      <div
        className="fixed pointer-events-none z-[9999] transition-transform duration-200"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`,
        }}
      >
        <div className="w-8 h-8 border-2 border-primary rounded-full box-glow"></div>
      </div>

      {/* Inner cursor dot */}
      <div
        className="fixed pointer-events-none z-[9999] transition-all duration-100"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isPointer ? 0.5 : 1})`,
        }}
      >
        <div className="w-2 h-2 bg-primary rounded-full"></div>
      </div>

      {/* Trail effect */}
      <div
        className="fixed pointer-events-none z-[9998] transition-all duration-500 opacity-50"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="w-16 h-16 bg-primary/20 rounded-full blur-xl"></div>
      </div>
    </>
  );
};

export default ScorpionCursor;
