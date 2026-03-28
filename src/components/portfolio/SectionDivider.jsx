import React from 'react';

export default function SectionDivider() {
  return (
    <div style={{ width: '100%', height: '120px', position: 'relative', overflow: 'hidden', background: '#0d0d0d' }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, #0d0d0d 30%, #3a0e0e 44%, #6B1414 49%, #8B1A1A 51%, #c47a7a 56%, #f9f9f7 70%)',
      }} />
    </div>
  );
}

