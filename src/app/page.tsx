'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Navbar } from '@/components/Navbar';

const CanvasSequence = dynamic(() => import('@/components/CanvasSequence'), { ssr: false });
const StoreTransition = dynamic(() => import('@/components/StoreTransition'), { ssr: false });

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Luxury OS Refs
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const systemStatusRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // 1. BRAND NARRATIVE (Left Side)
      if (promptRef.current && containerRef.current) {
        gsap.to(promptRef.current, {
          opacity: 0,
          y: -20,
          scrollTrigger: {
            trigger: containerRef.current,
            start: '5% top',
            end: '15% top',
            scrub: true,
          }
        });
      }

      const phrases = [
        "NOT FOR EVERYONE.",
        "BUILT FROM SILENCE.",
        "DESIGNED FOR THE UNKNOWN.",
        "ENTER THE DROP."
      ];

      const updateText = (index: number) => {
        if (narrativeRef.current) {
          gsap.to(narrativeRef.current, {
            filter: 'blur(20px)',
            opacity: 0,
            duration: 0.4,
            onComplete: () => {
              if (narrativeRef.current) {
                narrativeRef.current.innerText = phrases[index];
                gsap.to(narrativeRef.current, { filter: 'blur(0px)', opacity: 1, duration: 0.8 });
              }
            }
          });
        }
      };

      if (containerRef.current) {
        ScrollTrigger.create({ trigger: containerRef.current, start: '20% top', onEnter: () => updateText(1), onLeaveBack: () => updateText(0) });
        ScrollTrigger.create({ trigger: containerRef.current, start: '45% top', onEnter: () => updateText(2), onLeaveBack: () => updateText(1) });
        ScrollTrigger.create({ trigger: containerRef.current, start: '75% top', onEnter: () => updateText(3), onLeaveBack: () => updateText(2) });
      }

      // 2. SYSTEM UI (Right Side)
      if (materialRef.current && containerRef.current) {
        gsap.fromTo(materialRef.current,
          { opacity: 0, x: 20, filter: 'blur(10px)' },
          {
            opacity: 0.8, x: 0, filter: 'blur(0px)',
            scrollTrigger: {
              trigger: containerRef.current,
              start: '40% top',
              end: '50% top',
              scrub: 1,
            }
          }
        );
      }

      // 3. SPATIAL MOTION
      if (leftSideRef.current && rightSideRef.current && containerRef.current) {
        gsap.to([leftSideRef.current, rightSideRef.current], {
          x: (i) => i === 0 ? 60 : -60,
          opacity: 1,
          scale: 1.05,
          scrollTrigger: {
            trigger: containerRef.current,
            start: '60% top',
            end: '90% top',
            scrub: 1.5,
          }
        });

        gsap.to([leftSideRef.current, rightSideRef.current], {
          opacity: 0,
          filter: 'blur(20px)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: '92% top',
            end: '100% top',
            scrub: 1,
          }
        });
      }
    }
  }, []);

  return (
    <main style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>
      <Navbar />
      
      {/* Scroll timeline container for cinematic sequence */}
      <div ref={containerRef} style={{ height: '500vh', position: 'relative' }}>
        {/* Canvas remains fixed in background during this 500vh scroll */}
        <CanvasSequence />

        {/* Cinematic Overlays to mask blur/add texture */}
        <div className="cinematic-overlay">
          <div className="noise" />
          <div className="vignette" />
          <div className="scanlines" />
        </div>

        {/* LEFT SIDE — BRAND NARRATIVE */}
        <div ref={leftSideRef} style={{
          position: 'fixed', top: '50%', left: '60px', transform: 'translateY(-50%)',
          zIndex: 30, opacity: 0.5, pointerEvents: 'none'
        }}>
          <div ref={narrativeRef} className="narrative-text" style={{ fontSize: '5vw', letterSpacing: '0.05em' }}>
            NOT FOR EVERYONE.
          </div>
          <div className="narrative-sub" style={{ marginTop: '24px' }}>
            DROP_01 // SYSTEM_AWAKENING
          </div>
        </div>

        <div ref={promptRef} style={{
          position: 'fixed', bottom: '60px', left: '60px', zIndex: 30,
          fontFamily: 'Inter', fontSize: '10px', letterSpacing: '0.6em', color: 'rgba(255,255,255,0.3)'
        }}>
          SCROLL TO AWAKEN
        </div>

        {/* RIGHT SIDE — SYSTEM UI */}
        <div ref={rightSideRef} className="system-ui" style={{
          position: 'fixed', top: '50%', right: '60px', transform: 'translateY(-50%)',
          zIndex: 30, opacity: 0.5, pointerEvents: 'none', textAlign: 'right'
        }}>
          <div className="ui-fragment flicker-anim">
            <div className="system-label">STATUS</div>
            <div className="system-value">OS_INITIALIZING</div>
          </div>
          
          <div className="ui-fragment" style={{ opacity: 0.6 }}>
            <div className="system-label">SEQUENCE</div>
            <div className="system-value">DARK_TRANSFORMATION</div>
          </div>

          <div ref={materialRef} className="ui-fragment" style={{ opacity: 0 }}>
            <div className="system-label">MATERIAL // SPECS</div>
            <div className="system-value" style={{ fontSize: '13px' }}>TECH_FLEECE / OVERSIZED</div>
            <div className="system-label" style={{ marginTop: '10px' }}>EDITION // 2026</div>
            <div className="system-value" style={{ fontSize: '13px' }}>LIMITED_RELEASE</div>
          </div>
        </div>
      </div>

      {/* SECTION 5 — STORE TRANSITION with overlap */}
      <div style={{ marginTop: '-150vh', position: 'relative', zIndex: 40 }}>
        <StoreTransition />
      </div>
    </main>
  );
}
