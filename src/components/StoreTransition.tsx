'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const products = [
  { id: 1, name: 'VOID HOODIE / 01', price: '$240', image: '/images/baba.jpg' },
  { id: 2, name: 'SILENCE TEE / 02', price: '$120', image: '/images/eyga.jpg' },
  { id: 3, name: 'NEON CARGO / 03', price: '$350', image: '/images/happyVVV.jpg' },
  { id: 4, name: 'DROP JACKET / 04', price: '$580', image: '/images/sd.jpg' },
  { id: 5, name: 'PHANTOM HOODIE / 05', price: '$260', image: '/images/plan.jpg' },
  { id: 6, name: 'CYBER TEE / 06', price: '$110', image: '/images/bigd.jpg' },
  { id: 7, name: 'TECH CAP / 07', price: '$85', image: '/images/midlogo.jpg' },
  { id: 8, name: 'MATRIX PANT / 08', price: '$290', image: '/images/baba.jpg' },
];

export default function StoreTransition() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // We need to wait for images/layout to be ready
      const ctx = gsap.context(() => {
        const horizontalWidth = horizontalRef.current!.scrollWidth;
        const amountToScroll = horizontalWidth - window.innerWidth;

        gsap.to(horizontalRef.current, {
          x: -amountToScroll,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${amountToScroll}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });
      }, containerRef);

      return () => ctx.revert();
    }
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <section ref={sectionRef} style={{
        height: '100vh',
        width: '100vw',
        background: 'var(--background)',
        color: 'var(--foreground)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{ padding: '0 48px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '4rem', fontWeight: 300, letterSpacing: '0.05em', margin: 0 }}>THE COLLECTION</h2>
        </div>

        <div 
          ref={horizontalRef}
          style={{
            display: 'flex',
            gap: '60px',
            padding: '0 48px',
            width: 'fit-content',
            willChange: 'transform'
          }}
        >
          {products.map((item) => (
            <div key={item.id} style={{ flexShrink: 0, width: '450px' }}>
              <div style={{
                position: 'relative',
                aspectRatio: '3/4',
                background: 'var(--surface-light)',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '24px',
                border: '1px solid var(--border)'
              }}>
                <Image 
                  src={item.image} 
                  alt={item.name}
                  fill
                  style={{ objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)', opacity: 0.8 }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '0.8'; }}
                />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 400, letterSpacing: '0.05em', marginBottom: '8px' }}>{item.name}</h3>
                <span style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter' }}>{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rest of the page content after horizontal scroll */}
      <div style={{ background: 'var(--background)', position: 'relative', zIndex: 11 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '120px 48px' }}>
          <div style={{ padding: '80px', background: 'var(--surface)', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--border)', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '24px', fontWeight: 700 }}>CUSTOM DESIGN LABS</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto 48px', lineHeight: 1.8, fontSize: '1.1rem' }}>
              Co-create your reality. Use our advanced 3D configurator to customize every detail of your techwear.
            </p>
            <button style={{
              padding: '20px 48px',
              background: 'linear-gradient(45deg, #5E72EB, #8e9cf3)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '1.2rem',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.15em',
              boxShadow: '0 10px 30px rgba(94, 114, 235, 0.3)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >ENTER THE LAB</button>
          </div>

          <footer style={{ marginTop: '160px', borderTop: '1px solid var(--border)', paddingTop: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '1rem' }}>
            <p>© 2026 THE DROP. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '32px' }}>
              <span style={{ color: 'var(--neon-text)', fontWeight: 500 }}>PAYPAL SECURE</span>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
