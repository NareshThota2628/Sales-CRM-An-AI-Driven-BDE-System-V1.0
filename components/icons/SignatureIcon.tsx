import React from 'react';

const SignatureIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12.5" />
    <path d="m16 14-2 2 4 4 2-2-4-4" />
    <path d="m14.5 12.5 6 6" />
  </svg>
);

export default SignatureIcon;
