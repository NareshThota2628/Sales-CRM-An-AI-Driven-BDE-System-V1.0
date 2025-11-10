import React from 'react';

const PuzzleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19.439 7.852c-2.102-2.102-5.441-2.221-7.73.21-1.392 1.48-1.743 3.422-.985 4.992l-2.008 2.008c-1.34-1.34-3.51-1.34-4.85 0l-.002.002a3.433 3.433 0 0 0 0 4.85l.002.002a3.433 3.433 0 0 0 4.85 0l.002-.002 2.008-2.008c1.57.758 3.512.407 4.992-.985 2.43-2.289 2.31-5.628.209-7.73z" />
    <path d="m11.18 14.86.002-.002" />
    <path d="m14.86 11.18.002-.002" />
  </svg>
);

export default PuzzleIcon;