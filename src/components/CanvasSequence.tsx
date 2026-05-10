'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAME_COUNT = 240;
const currentFrame = (index: number) =>
  `/sequence/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

export default function CanvasSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMutedRef = useRef(true);

  useEffect(() => {
    // Setup Audio
    audioRef.current = new Audio('/audio/cinematic.mp3');
    audioRef.current.loop = true;

    // Preload images
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        setLoaded(Math.round((loadedCount / FRAME_COUNT) * 100));
        if (loadedCount === FRAME_COUNT) {
          setImages(loadedImages);
        }
      };
      loadedImages.push(img);
    }
  }, []);

  useEffect(() => {
    if (images.length < FRAME_COUNT || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const render = (index: number) => {
      const img = images[index];
      if (!img) return;
      
      // Calculate aspect ratio covering the canvas
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render(0); // initial render
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const animationState = { frame: 0 };

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        // Map frames to 0 - 85% of scroll progress
        const adjustedProgress = Math.min(1, self.progress / 0.85);
        const frameIndex = Math.min(
          FRAME_COUNT - 1,
          Math.floor(adjustedProgress * (FRAME_COUNT - 1))
        );
        animationState.frame = frameIndex;
        render(frameIndex);
      },
    });

    // Pause audio when entering collection (now at 90% progress)
    const audioTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: '90% bottom',
      onEnter: () => {
        if (audioRef.current && !isMutedRef.current) {
          audioRef.current.pause();
        }
      },
      onLeaveBack: () => {
        if (audioRef.current && !isMutedRef.current) {
          audioRef.current.play();
        }
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      st.kill();
      audioTrigger.kill();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [images]);

  const handleToggleAudio = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        setIsMuted(false);
        isMutedRef.current = false;
      } else {
        audioRef.current.pause();
        setIsMuted(true);
        isMutedRef.current = true;
      }
    }
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      {loaded < 100 && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#030303', color: '#fff', zIndex: 100, fontFamily: 'Outfit, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', letterSpacing: '0.2em', opacity: 0.5 }}>LOADING SEQUENCE</div>
            <div style={{ fontSize: '32px', fontWeight: 300, marginTop: '8px' }}>{loaded}%</div>
          </div>
        </div>
      )}

      {/* Mute/Unmute Toggle */}
      <button 
        onClick={handleToggleAudio}
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          zIndex: 60,
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '30px',
          cursor: 'pointer',
          fontFamily: 'Outfit',
          fontSize: '12px',
          letterSpacing: '0.1em',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span style={{ width: '8px', height: '8px', background: isMuted ? '#ff4b4b' : '#4bff4b', borderRadius: '50%' }} />
        {isMuted ? 'SOUND OFF' : 'SOUND ON'}
      </button>

      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          objectFit: 'cover'
        }}
      />
    </div>
  );
}
