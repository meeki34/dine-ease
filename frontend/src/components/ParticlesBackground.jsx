import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const ParticlesBackground = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 4 + 3, // Even larger base size (3 to 7px)
      duration: Math.random() * 20 + 15,
      delay: Math.random() * -20,
      opacity: Math.random() * 0.5 + 0.4, // Brighter base opacity (0.4 to 0.9)
    }));
  }, []);

  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 2, 
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            opacity: 0,
            y: 50 
          }}
          animate={{
            y: [50, -150], 
            opacity: [0, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
            times: [0, 0.5, 1]
          }}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: '#ffb77d', // Much brighter center
            boxShadow: `0 0 ${p.size * 3}px 2px rgba(244, 140, 37, 0.8)` // Intense amber glow
          }}
        />
      ))}
      
      {/* Ambient Radial Glows */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(244, 140, 37, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '-10%',
        width: '700px',
        height: '700px',
        background: 'radial-gradient(circle, rgba(255, 179, 77, 0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }} />
    </div>
  );
};

export default React.memo(ParticlesBackground);
