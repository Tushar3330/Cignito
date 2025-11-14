"use client";

import { useEffect, useRef } from "react";

const FILTERS = [
  { label: "🔥 All Bugs", href: "/" },
  { label: "🐛 Open Bugs", href: "/?status=OPEN" },
  { label: "✅ Solved", href: "/?status=CLOSED" },
  { label: "🟨 JavaScript", href: "/?language=JavaScript" },
  { label: "🐍 Python", href: "/?language=Python" },
  { label: "🔷 TypeScript", href: "/?language=TypeScript" },
  { label: "☕ Java", href: "/?language=Java" },
  { label: "⚛️ React", href: "/?tag=react" },
  { label: "🔷 Next.js", href: "/?tag=nextjs" },
  { label: "🟢 Node.js", href: "/?language=Node" },
];

export default function FilterCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.8; // pixels per frame
    
    const scroll = () => {
      scrollPosition += scrollSpeed;
      
      // Reset when we've scrolled half way (since we duplicate the filters)
      const maxScroll = scrollContainer.scrollWidth / 2;
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 30); // ~33fps

    // Pause on hover
    const handleMouseEnter = () => clearInterval(intervalId);
    const handleMouseLeave = () => {
      const newIntervalId = setInterval(scroll, 30);
      return () => clearInterval(newIntervalId);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(intervalId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Duplicate filters for seamless infinite scroll
  const duplicatedFilters = [...FILTERS, ...FILTERS];

  return (
    <div className="mt-6 w-full flex justify-center">
      {/* Auto-scrolling single-line carousel - no overflow visible */}
      <div 
        ref={scrollRef}
        className="overflow-hidden w-full max-w-[60%]"
        style={{ 
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}
      >
        <div className="flex gap-3 pb-2">
          {duplicatedFilters.map((filter, index) => (
            <a
              key={`${filter.href}-${index}`}
              href={filter.href}
              className="flex-shrink-0 px-4 py-2 bg-white/20 backdrop-blur-sm border-2 border-white rounded-full text-white text-sm font-bold hover:bg-white hover:text-primary transition-all hover:scale-105 whitespace-nowrap"
            >
              {filter.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
