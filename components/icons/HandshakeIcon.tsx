import React from 'react';

const HandshakeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.5 18a4 4 0 0 0-5.5-5.5l-2.5 2.5a4 4 0 0 0 5.5 5.5z" />
    <path d="M9.5 6a4 4 0 0 0 5.5 5.5l2.5-2.5a4 4 0 0 0-5.5-5.5z" />
    <path d="m11 12.5 2.5 2.5" />
    <path d="m12.5 11 2.5 2.5" />
    <path d="M3 21l2.5-2.5" />
    <path d="M21 3l-2.5 2.5" />
  </svg>
);

export default HandshakeIcon;