import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useVideoStore } from '../store/videoStore';

export function VideoGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { videos } = useVideoStore();

  useEffect(() => {
    const adjustLayout = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const aspectRatio = 16 / 9;
      const containerWidth = container.clientWidth;
      const containerHeight = window.innerHeight - 56; // Adjusted for single-line header
      
      const cols = Math.ceil(Math.sqrt(videos.length * (containerWidth / containerHeight)));
      const rows = Math.ceil(videos.length / cols);
      
      container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      container.style.gridAutoRows = `calc((100vh - 56px) / ${rows})`;
    };

    adjustLayout();
    window.addEventListener('resize', adjustLayout);
    return () => window.removeEventListener('resize', adjustLayout);
  }, [videos.length]);

  return (
    <div 
      ref={containerRef}
      className="grid gap-1 pt-14 pb-4 px-4"
    >
      {videos.map((videoId, index) => (
        <motion.div
          key={`${videoId}-${index}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full h-full rounded-lg overflow-hidden shadow-lg"
        >
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
      ))}
    </div>
  );
}