import React from 'react';

export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 011.05-4.305 9.75 9.75 0 01-1.05-4.305h9a9.75 9.75 0 01-1.05 4.305 9.75 9.75 0 011.05 4.305zM12 3v2.25m0 16.5v-2.25m3.75 0h-7.5M12 3c-3.314 0-6 2.686-6 6v3h12V9c0-3.314-2.686-6-6-6z" />
    </svg>
);
