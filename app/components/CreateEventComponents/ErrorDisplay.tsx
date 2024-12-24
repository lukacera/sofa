"use client"
import React, { useEffect, useState } from 'react'
import { AlertCircle, X } from 'lucide-react';
interface ErrorDisplayProps {
  error: string | null;
  onDismiss?: () => void;
}

export const ErrorDisplay = ({ error, onDismiss }: ErrorDisplayProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      if (error) setIsVisible(true);
    }, [error]);
    
    if (!error || !isVisible) return null;
  
    const handleDismiss = () => {
      setIsVisible(false);
      onDismiss?.();
    };
  
    return (
      <div className="relative transform transition-all duration-300 ease-in-out">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Please fix the following issues:
              </h3>
              <div className="text-red-700 whitespace-pre-line leading-relaxed">
                {error.split('\n').map((line, index) => (
                  <div key={index} className="flex items-start space-x-2 mb-1">
                    <span className="select-none">•</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 bg-red-50 rounded-full p-1 hover:bg-red-100 
              transition-colors duration-200 focus:outline-none focus:ring-2 
              focus:ring-red-500 focus:ring-offset-2"
            >
              <X className="h-5 w-5 text-red-500" />
            </button>
          </div>
        </div>
      </div>
    );
  };
  