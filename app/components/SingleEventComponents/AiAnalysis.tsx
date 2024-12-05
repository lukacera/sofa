import { Pencil } from 'lucide-react'
import React, { useState, useEffect } from 'react'

const TypewriterText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 20 }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, delay)

      return () => clearTimeout(timeout)
    } 
  }, [currentIndex, delay, text])

  return <span>{displayedText}</span>
}

export const AIAnalysis: React.FC<{
  text: string
}> = ({text}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isHeaderVisible, setHeaderVisible] = useState(false)
  const [startTyping, setStartTyping] = useState(false)
  

  useEffect(() => {
    // Start container fade in
    setTimeout(() => setIsVisible(true), 50)
    // Show header
    setTimeout(() => setHeaderVisible(true), 500)
    // Start typing effect
    setTimeout(() => setStartTyping(true), 1000)
  }, [])

  return (
    <div className={`bg-gradient-to-r from-primary to-primaryDarker/30
      p-5 rounded-xl flex flex-col gap-4 transition-all duration-500 ease-out
      min-h-[17rem] h-auto mt-4
      ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
      <div className={`flex items-center gap-2 transition-opacity duration-300
        ${isHeaderVisible ? 'opacity-100' : 'opacity-0'}`}>
        <Pencil size={18}/>
        <span className='font-medium'>AI Analysis</span>
      </div>
      <p className='text-sm min-h-[4rem] break-words'>
        {startTyping ? (
          <TypewriterText 
            text={text} 
            delay={15}
          />
        ) : (
          <span className="inline-block w-3 h-4 bg-current animate-pulse"/>
        )}
      </p>
    </div>
  )
}