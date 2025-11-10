import React from 'react';

const ColumnViewIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="18" x2="12" y2="6" />
    <line x1="6" y1="18" x2="6" y2="6" />
    <line x1="18" y1="18" x2="18" y2="6" />
  </svg>
);

export default ColumnViewIcon;