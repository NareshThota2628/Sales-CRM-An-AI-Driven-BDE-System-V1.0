import React from 'react';

const FireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M11.75 6c.75-2.5 4.5-2.5 5.25 0C17.75 8.5 15 11.5 15 13.5c0 1.5 1 2.5 2.5 2.5s2.5-1 2.5-2.5c0-2-2.75-5-2-7.5" />
        <path d="M12.25 6C11.5 3.5 8.75 3.5 8 6c-.75 2.5 2 5.5 2 7.5c0 1.5-1 2.5-2.5 2.5S5 15 5 13.5c0-2 2.75-5 2-7.5" />
        <path d="M10.5 15.5c-2-1-2-4-2-4" />
        <path d="M13.5 15.5c2-1 2-4 2-4" />
        <path d="M8.5 19.5c2.5-1 5.5-1 8 0" />
        <path d="M7 16s-1.5 0-1.5 1.5S7 19 7 19" />
        <path d="M17 16s1.5 0 1.5 1.5S17 19 17 19" />
    </svg>
);

export default FireIcon;