import React from 'react';

const PipelineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 6h4" />
    <path d="M2 12h10" />
    <path d="M2 18h14" />
    <path d="M12 6h4" />
    <path d="M18 12h4" />
    <path d="M22 18h-2" />
  </svg>
);

export default PipelineIcon;