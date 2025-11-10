
import React from 'react';

const BrainCircuitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        {...props}
    >
        <path d="M12 5a3 3 0 1 0-5.993.13a3 3 0 0 0 5.993-.13Z" />
        <path d="M12 5a3 3 0 1 0 5.993.13a3 3 0 0 0 -5.993-.13Z" />
        <path d="M12 12a3 3 0 1 0-5.993.13a3 3 0 0 0 5.993-.13Z" />
        <path d="M12 12a3 3 0 1 0 5.993.13a3 3 0 0 0 -5.993-.13Z" />
        <path d="M12 19a3 3 0 1 0-5.993.13a3 3 0 0 0 5.993-.13Z" />
        <path d="M12 19a3 3 0 1 0 5.993.13a3 3 0 0 0 -5.993-.13Z" />
        <path d="M21 12h-3" />
        <path d="M6 12H3" />
        <path d="m16.5 16.5-1-1" />
        <path d="m8.5 8.5-1-1" />
        <path d="M12 3V2" />
        <path d="M12 22v-1" />
        <path d="m16.5 7.5-1 1" />
        <path d="m8.5 15.5-1 1" />
    </svg>
);

export default BrainCircuitIcon;
