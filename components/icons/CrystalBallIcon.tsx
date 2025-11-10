import React from 'react';

const CrystalBallIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2a4 4 0 0 0-4 4v2" />
    <path d="M12 2a4 4 0 0 1 4 4v2" />
    <circle cx="12" cy="13" r="7" />
    <path d="M12 20v2" />
    <path d="M10 22h4" />
  </svg>
);

export default CrystalBallIcon;