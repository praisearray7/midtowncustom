'use client';

import React from 'react';
import { ShoppingCart, Menu } from 'lucide-react';

export function Navbar() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      padding: '24px 48px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 50,
      mixBlendMode: 'difference',
      color: '#fff'
    }}>
      <div style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '0.1em', fontFamily: 'Outfit, sans-serif' }}>
        THE DROP.
      </div>
      
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center', fontFamily: 'Inter, sans-serif', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Product Catalog</a>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Custom Labs</a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <ShoppingCart size={20} />
          <span>CART (0)</span>
        </div>
        <Menu size={24} style={{ cursor: 'pointer', marginLeft: '16px' }} />
      </div>
    </nav>
  );
}
