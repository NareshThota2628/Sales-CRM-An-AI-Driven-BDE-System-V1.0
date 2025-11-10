import React from 'react';

const BuildingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="8" height="20" rx="1" />
    <rect x="14" y="2" width="8" height="20" rx="1" />
    <path d="M6 18H2" />
    <path d="M6 14H2" />
    <path d="M6 10H2" />
    <path d="M6 6H2" />
    <path d="M18 18h4" />
    <path d="M18 14h4" />
    <path d="M18 10h4" />
    <path d="M18 6h4" />
  </svg>
);

export default BuildingsIcon;
