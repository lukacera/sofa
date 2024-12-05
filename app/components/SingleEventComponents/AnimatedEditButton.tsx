import React, { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';

const AnimatedEditButton = () => {
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldAnimate(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      onClick={() => console.log('Edit button clicked')}
      onMouseEnter={() => setShouldAnimate(false)}
      className="flex items-center justify-center p-2 rounded-full 
      bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-110 
      transition-all duration-300"
    >
      <Pencil 
        size={18} 
        className={`fill-yellow-300 ${shouldAnimate ? 'animate-bounce' : ''}`} 
      />
    </button>
  );
};

export default AnimatedEditButton;